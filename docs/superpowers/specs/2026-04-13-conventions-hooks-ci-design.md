# Design: Pre-commit Hooks & CI Workflows in conventions.init/refresh

**Date:** 2026-04-13
**Status:** Draft
**Scope:** conventions.init Phase 7-8, conventions.refresh stack tracking, workflow-nexus absorption

## Context

`/conventions.init` already detects the project stack (Phase 1) and audits config files (Phase 6). The same stack detection can drive two additional outputs:

1. **Pre-commit hook** — lint/typecheck commands adapted to the detected stack
2. **CI workflows and Dependabot config** — GitHub Actions pipelines plus npm update automation adapted to the detected stack

Currently, CI generation lives in a separate skill (`/workflow-nexus`) that duplicates stack detection. This design absorbs workflow-nexus into conventions.init and adds pre-commit hook generation.

## Reference: `audit_context.py:detect_stack()`

The audit skill's Python detection function served as inspiration for the stack-to-commands mapping. It maps marker files (tsconfig.json, Cargo.toml, etc.) to lint commands. We replicate this pattern in a markdown lookup table.

## New File: `code-conventions/stack-commands.md`

A single-purpose lookup table mapping stack markers → lint commands + CI template.

```markdown
# Stack Commands

Mapping from stack detection markers to pre-commit commands and CI templates.
Used by `/conventions.init` Phase 7 (pre-commit hook) and Phase 8 (CI workflows).

## Stack Detection Table

| Stack Label | Markers (first match wins) | Pre-commit Commands | CI Template | CodeQL Language |
|---|---|---|---|---|
| TypeScript + Biome | tsconfig.json + (biome.json \| biome.jsonc) | `npx tsc --noEmit`, `npx biome check .` | ci-node | javascript-typescript |
| TypeScript + ESLint | tsconfig.json + (.eslintrc* \| eslint.config.*) | `npx tsc --noEmit`, `npx eslint .` | ci-node | javascript-typescript |
| TypeScript | tsconfig.json | `npx tsc --noEmit` | ci-node | javascript-typescript |
| Rust | Cargo.toml | `cargo check`, `cargo clippy -- -D warnings` | ci-rust | rust |
| Go | go.mod | `go build ./...`, `go vet ./...` | ci-go | go |
| Python | pyproject.toml \| setup.py | `ruff check .`, `mypy .` | ci-python | python |
| Delphi | *.dproj \| *.dpr | `dcc32 {dpr_file} -Q -W` | — | — |
| C/C++ (CMake) | CMakeLists.txt | `cmake --build . --target all` | — | — |
| .NET / C# | *.sln \| *.csproj | `dotnet build --no-restore` | ci-dotnet | csharp |

### Detection Rules

- Scan from the project root
- **Within a stack family** (e.g., TypeScript variants): first match wins for label assignment (TypeScript + Biome before plain TypeScript). The table rows are ordered by specificity — most specific first.
- **Across stack families** (e.g., TypeScript vs Go vs Python): include ALL matching stack families. Each family is detected independently.
- **Primary stack** (for CI file naming): the first family in table order whose markers are found. Table order defines priority: TypeScript > Rust > Go > Python > Delphi > C/C++ > .NET.
- No markers found → skip Phase 7-8 entirely

### Linter sub-detection (TypeScript)

Within the TypeScript stack, linter detection is ordered:
1. `biome.json` or `biome.jsonc` → Biome
2. `.eslintrc`, `.eslintrc.js`, `.eslintrc.cjs`, `.eslintrc.json`, `eslint.config.js`, `eslint.config.mjs` → ESLint
3. Neither → TypeScript only (no linter command)
```

**Rationale for separate file:** `runtime-configs.md` handles tool configuration (what tsconfig keys to set). `stack-commands.md` handles action dispatch (what commands to run). Different consumers, different concerns.

## CI Templates

Migrated from `workflow-nexus/templates/` to `claude/skills/conventions.init/references/templates/`.

Files:
- `ci-node.yml` — Node.js/TypeScript CI
- `ci-python.yml` — Python CI
- `ci-go.yml` — Go CI
- `ci-rust.yml` — Rust CI
- `ci-dotnet.yml` — .NET CI
- `security.yml` — Gitleaks (all stacks)
- `codeql.yml` — CodeQL (public repos only, `__LANGUAGES__` placeholder)
- `dependabot-npm.yml` — Dependabot for npm

Templates are raw YAML files. The only variable is `__LANGUAGES__` in `codeql.yml`, replaced via string substitution. All other templates are used as-is — they are self-contained.

## Manifest Schema Changes

Add `stack` field to `conventions.manifest.json`:

```json
{
  "generated": "2026-04-13",
  "project": "my-project",
  "aiResourcesPath": "/Users/.../ai-ressources",
  "stack": {
    "labels": ["TypeScript + Biome"],
    "markers": ["tsconfig.json", "biome.json"],
    "hookGenerated": true,
    "ciGenerated": ["ci.yml", "security.yml", "codeql.yml"],
    "dependabotGenerated": true
  },
  "domains": { ... }
}
```

- `labels`: array (multi-stack support)
- `markers`: all detected marker files
- `hookGenerated`: whether `.githooks/pre-commit` was written
- `ciGenerated`: list of workflow files written
- `dependabotGenerated`: whether `.github/dependabot.yml` was written

**Written by:** The skill (not `build-conventions.ts`). After `build-conventions.ts` finishes generating conventions, the skill appends the `stack` field to the manifest JSON file. This keeps `build-conventions.ts` focused on convention compilation only.

## Phase 7: Pre-commit Hook

### Trigger

After Phase 6 (Config Audit). Runs on every `conventions.init` and `conventions.refresh --full`.

### Procedure

1. **Read** `stack-commands.md` — load the detection table
2. **Detect stack** — scan project root for markers (same detection as Phase 1, using the table)
3. **No stack detected** → skip Phase 7, display "No supported stack detected — skipping pre-commit hook"
4. **If `.githooks/pre-commit` exists:**
   - If contains sentinel `# @generated by conventions.init` → will overwrite
   - If no sentinel → ask user confirmation before overwriting
5. **Generate `.githooks/pre-commit`:**

```sh
#!/bin/sh
# @generated by conventions.init — do not edit manually
# Stack: TypeScript + Biome
# To eject from auto-management, remove the @generated line above
set -e

check() {
    printf "→ %s\n" "$1"
    if ! eval "$1"; then
        printf "\n✗ FAILED: %s\n" "$1" >&2
        exit 1
    fi
}

# TypeScript + Biome
if ! command -v npx >/dev/null 2>&1; then
    printf "✗ npx not found — install Node.js to enable pre-commit checks\n" >&2
    exit 1
fi
check "npx tsc --noEmit"
check "npx biome check ."

printf "\n✓ All checks passed\n"
```

For multi-stack, each stack block is appended with its own tool guard. **Tool guards are per-block** — a missing tool for one stack skips that block but does NOT block other stacks:

```sh
# Go
if ! command -v go >/dev/null 2>&1; then
    printf "⚠ go not found — skipping Go checks\n" >&2
else
    check "go build ./..."
    check "go vet ./..."
fi
```

**Single-stack behavior:** tool guard uses `exit 1` (fail-closed, no point continuing).
**Multi-stack behavior:** tool guard uses `else` (skip block, continue to next stack). Final exit code reflects whether any executed check failed.

6. **`chmod +x .githooks/pre-commit`**
7. **`git config core.hooksPath .githooks`**
8. **Ensure `.githooks/` is NOT in `.gitignore`** — if found, ask confirmation before removing the entry
9. **Display confirmation:**

```
Pre-commit hook installed:
  Stack: TypeScript + Biome
  Commands: npx tsc --noEmit, npx biome check .
  Location: .githooks/pre-commit
  Hook path: git config core.hooksPath .githooks
```

### Hook Design Rules

- **POSIX sh** — no bashisms (`#!/bin/sh`)
- **Fail-closed** — missing tool → `exit 1` (not silent skip)
- **Clear failure message** — prints which command failed
- **Sentinel comment** — `# @generated by conventions.init` on line 2 for idempotent overwrite
- **Stack comment** — documents which stack was detected
- **One `check()` function** — avoids code duplication for multiple commands
- **Tool existence guard per stack block** — `command -v` before running commands

## Phase 8: CI Workflows

### Trigger

After Phase 7. Runs on every `conventions.init` and `conventions.refresh --full`.

### Procedure

1. **Verify git repository** — abort Phase 8 if no `.git/`
2. **Read templates** from `conventions.init/references/templates/`
3. **Map detected stack(s) to templates** using `stack-commands.md`:
   - Each stack label maps to a CI template name
   - Always include `security.yml` (Gitleaks)
4. **Check repository visibility:**
   ```bash
   gh repo view --json visibility -q '.visibility'
   ```
   - Public → include `codeql.yml` with detected CodeQL languages
   - Private or `gh` unavailable → skip CodeQL (known limitation: public repos without `gh` installed will miss CodeQL)
5. **Dependabot** — generate `.github/dependabot.yml` if npm stack detected
6. **Create `.github/workflows/` if needed**
7. **For each template to write:**
   - **Does not exist** → create from template
   - **Exists with sentinel `# @generated by conventions.init`** → overwrite
   - **Exists without sentinel** → show diff, ask: replace / keep. Default: keep
8. **CodeQL variable substitution:**
   - Replace `__LANGUAGES__` with comma-separated CodeQL language identifiers from all detected stacks
9. **Display summary:**

```
CI workflows generated:
  ✓ .github/workflows/ci.yml (from ci-node template)
  ✓ .github/workflows/security.yml (Gitleaks)
  ✓ .github/workflows/codeql.yml (javascript-typescript)
  ✓ .github/dependabot.yml (npm)
  ⊘ .github/workflows/ci-python.yml skipped (exists, not generated)
```

### CI File Naming

All CI templates write to a fixed filename, not the template name:

| Template | Output file |
|---|---|
| ci-node.yml | `.github/workflows/ci.yml` |
| ci-python.yml | `.github/workflows/ci.yml` |
| ci-go.yml | `.github/workflows/ci.yml` |
| ci-rust.yml | `.github/workflows/ci.yml` |
| ci-dotnet.yml | `.github/workflows/ci.yml` |
| security.yml | `.github/workflows/security.yml` |
| codeql.yml | `.github/workflows/codeql.yml` |
| dependabot-npm.yml | `.github/dependabot.yml` |

**Multi-stack edge case:** If both TypeScript and Python are detected, the CI template for the primary stack (first detected) writes to `ci.yml`. Additional stacks write to `ci-{stack}.yml` (e.g., `ci-python.yml`).

### Sentinel in CI files

Each generated workflow includes a sentinel comment on line 1:

```yaml
# @generated by conventions.init — do not edit manually
name: CI
...
```

## conventions.refresh: Stack Tracking

### Default mode (incremental)

After checking domain hashes (existing behavior), add:

1. **Re-detect stack** — scan project root for markers
2. **Compare with `manifest.stack.markers`**
3. **If markers identical** → skip hook/CI refresh
4. **If markers changed:**
   - **Hook:** regenerate `.githooks/pre-commit` (sentinel overwrite)
   - **CI:** display diff of old vs new templates, propose changes:
     ```
     Stack changed: TypeScript + Biome → Python
     
     Pre-commit hook:
       ✓ Regenerated .githooks/pre-commit (npx tsc --noEmit, npx biome check . → ruff check ., mypy .)
     
     CI workflows:
       - Remove .github/workflows/ci.yml (was ci-node)?
       + Create .github/workflows/ci.yml (from ci-python)?
       
     Apply? (y/n)
     ```
   - Update `manifest.stack` with new detection

### `--full` mode

Re-runs Phase 7 + Phase 8 unconditionally (same as conventions.init).

## workflow-nexus Disposal

### Files to delete

- `/Users/julienm/projects/claude-skills/projects/dev/kit/skills/workflow-nexus/SKILL.md`
- `/Users/julienm/projects/claude-skills/projects/dev/kit/skills/workflow-nexus/templates/` (all files)

### Symlinks to remove

```bash
cc-hub skill unlink workflow-nexus
```

### References to clean

- Any README or doc in `claude-skills` that mentions workflow-nexus
- The skill list in any skills registry

## README Update

Add a section to `ai-ressources/README.md` after "Usage" describing the conventions lifecycle:

```markdown
## Conventions Lifecycle

### `/conventions.init`

Analyzes the project stack and generates:
- `.conventions/` — compiled convention files from this knowledge base
- `.githooks/pre-commit` — pre-commit hook with stack-adapted lint commands
- `.github/workflows/` — CI pipelines (CI, security, CodeQL)
- `.github/dependabot.yml` — Dependabot updates for npm-based stacks
- Config audit — validates tsconfig.json, biome.json, .gitignore, etc.

### `/conventions.refresh`

Incrementally updates materialized conventions when the knowledge base changes. Detects stack changes and regenerates hooks/CI accordingly.

Both skills use `code-conventions/stack-commands.md` for stack detection and `scripts/build-conventions.ts` for deterministic convention compilation.
```

## Updated Completion Message

After all phases, display an integrated summary:

```
.conventions/ generated — {N} domains, {L} total lines
  ✓ code.md ({L1} lines, {S} sources)
  ✓ index.md
  ✓ conventions.manifest.json

Config audit: {X} fixed, {Y} created, {Z} skipped

Pre-commit hook installed:
  Stack: TypeScript + Biome
  Commands: npx tsc --noEmit, npx biome check .
  Location: .githooks/pre-commit

CI workflows generated:
  ✓ .github/workflows/ci.yml (ci-node)
  ✓ .github/workflows/security.yml (Gitleaks)
  ✓ .github/dependabot.yml (npm)
```

## Files Modified by This Work

| File | Action |
|---|---|
| `code-conventions/stack-commands.md` | **Create** — new stack detection table |
| `claude/skills/conventions.init/SKILL.md` | **Edit** — add Phase 7 + Phase 8 |
| `claude/skills/conventions.init/references/templates/*.yml` | **Create** — migrated CI templates |
| `claude/skills/conventions.refresh/SKILL.md` | **Edit** — add stack tracking + Phase 7-8 in --full |
| `README.md` | **Edit** — add Conventions Lifecycle section |
| `code-conventions/index.yaml` | **Edit** — add stack-commands.md entry |
| `index.yaml` | **Edit** — update last_reviewed for code-conventions |

## Edge Cases

| Scenario | Behavior |
|---|---|
| No stack detected | Skip Phase 7-8, display message |
| `.githooks/pre-commit` exists, no sentinel | Ask confirmation |
| `.githooks/pre-commit` exists, has sentinel | Overwrite silently |
| `.github/workflows/ci.yml` exists, no sentinel | Show diff, ask |
| `.github/workflows/ci.yml` exists, has sentinel | Overwrite silently |
| No `.git/` directory | Skip Phase 8 (no CI), still generate hook |
| `gh` not available | Skip CodeQL, default to private |
| Multi-stack (TS + Python) | All commands in hook, multiple CI files |
| Delphi / CMake (no CI template) | Hook generated, CI skipped for that stack |
| `.githooks/` in `.gitignore` | Ask confirmation before removing entry |
| Tool not installed (`npx` missing) | Single-stack: exit 1. Multi-stack: skip block, continue |
| Hook auto vs CI confirmation (refresh) | Hook is 100% generated → safe auto-overwrite. CI may be customized → propose changes |

## Non-Goals

- No Husky integration — `.githooks/` is the standard, simpler, tool-agnostic
- No lint-staged — the hook runs on all files, not just staged ones
- No custom hook commands — the hook is 100% generated from stack detection
- No CI for unsupported stacks — only stacks with templates get CI
- No Dependabot for non-npm ecosystems — only npm template exists today (pip, cargo, go can be added later)
