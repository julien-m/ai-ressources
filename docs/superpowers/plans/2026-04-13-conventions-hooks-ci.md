# Conventions Hooks & CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pre-commit hook generation (Phase 7) and CI workflow generation (Phase 8) to conventions-init/refresh, absorbing workflow-nexus.

**Architecture:** The skill reads a new `stack-commands.md` lookup table to map detected stack markers to lint commands and CI templates. Phase 7 generates a POSIX shell pre-commit hook in `.githooks/`. Phase 8 copies generated workflow templates into `.github/workflows/` and writes Dependabot config to `.github/dependabot.yml`. The manifest tracks detected stack for refresh diffing.

**Tech Stack:** Markdown (skill definitions), YAML (CI templates), Shell (pre-commit hook)

**Spec:** `docs/superpowers/specs/2026-04-13-conventions-hooks-ci-design.md`

---

### Task 1: Create `code-conventions/stack-commands.md`

**Files:**
- Create: `code-conventions/stack-commands.md`
- Modify: `code-conventions/index.yaml` — add file entry
- Modify: `index.yaml` — update `last_reviewed` for code-conventions

- [ ] **Step 1: Create `stack-commands.md`**

```markdown
---
extends: []
---

# Stack Commands

Mapping from stack detection markers to pre-commit commands and CI templates.
Used by `/conventions-init` Phase 7 (pre-commit hook) and Phase 8 (CI workflows).

## Stack Detection Table

| Stack Label | Markers | Pre-commit Commands | CI Template | CodeQL Language |
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

## Detection Rules

### Within a stack family

Table rows are ordered by specificity — most specific first. Within a family (e.g., TypeScript variants), first match wins for label assignment.

### Across stack families

Each family (TypeScript, Rust, Go, Python, Delphi, C/C++, .NET) is detected independently. ALL matching families are included.

### Primary stack

For CI file naming: the first family in table order whose markers are found. Table order defines priority: TypeScript > Rust > Go > Python > Delphi > C/C++ > .NET.

### Linter sub-detection (TypeScript)

1. `biome.json` or `biome.jsonc` → Biome
2. `.eslintrc`, `.eslintrc.js`, `.eslintrc.cjs`, `.eslintrc.json`, `eslint.config.js`, `eslint.config.mjs` → ESLint
3. Neither → TypeScript only (no linter command)

### Tool existence guards

**Single-stack:** `command -v` check → `exit 1` if missing (fail-closed).

**Multi-stack:** `command -v` check → skip block if missing (warn, continue to next stack). Final exit code reflects whether any executed check failed.
```

- [ ] **Step 2: Add entry to `code-conventions/index.yaml`**

Add after the `runtime-configs.md` entry (after line 86 in the current file):

```yaml
  - file: stack-commands.md
    description: "Stack detection → pre-commit commands + CI template mapping. Used by /conventions-init Phase 7-8."
    applies_to: ["*"]
    priority: 6
```

- [ ] **Step 3: Update `index.yaml` last_reviewed**

Change `last_reviewed` for `code-conventions` domain from `2026-04-09` to `2026-04-13`.

- [ ] **Step 4: Update `domain-catalog.md`**

Add signal entries for `stack-commands.md`:

```markdown
| pre-commit | code-conventions/stack-commands.md |
| githooks | code-conventions/stack-commands.md |
| ci workflow | code-conventions/stack-commands.md |
| github actions | code-conventions/stack-commands.md |
| linter commands | code-conventions/stack-commands.md |
```

- [ ] **Step 5: Rebuild compiled index**

```bash
bun run scripts/build-index.ts
```

- [ ] **Step 6: Update `.last-updated`**

```bash
date +%Y-%m-%d > .last-updated
```

- [ ] **Step 7: Commit**

```bash
git add code-conventions/stack-commands.md code-conventions/index.yaml index.yaml domain-catalog.md compiled-index.txt .last-updated
git commit -m "feat(code-conventions): add stack-commands.md for pre-commit and CI mapping"
```

---

### Task 2: Migrate CI templates from workflow-nexus

**Files:**
- Create: `.agent-sync/skills/conventions-init/references/templates/ci-node.yml`
- Create: `.agent-sync/skills/conventions-init/references/templates/ci-python.yml`
- Create: `.agent-sync/skills/conventions-init/references/templates/ci-go.yml`
- Create: `.agent-sync/skills/conventions-init/references/templates/ci-rust.yml`
- Create: `.agent-sync/skills/conventions-init/references/templates/ci-dotnet.yml`
- Create: `.agent-sync/skills/conventions-init/references/templates/security.yml`
- Create: `.agent-sync/skills/conventions-init/references/templates/codeql.yml`
- Create: `.agent-sync/skills/conventions-init/references/templates/dependabot-npm.yml`

- [ ] **Step 1: Copy templates from workflow-nexus**

Copy each template file from `/Users/julienm/projects/claude-skills/projects/dev/kit/skills/workflow-nexus/templates/` to `.agent-sync/skills/conventions-init/references/templates/`.

For each file, prepend the sentinel comment on line 1:

```yaml
# @generated by conventions-init — do not edit manually
```

All 8 files get the sentinel — including `dependabot-npm.yml` (YAML comment syntax works in all these files).

**Note:** `codeql.yml` keeps its `__LANGUAGES__` placeholder as-is in addition to the sentinel.

- [ ] **Step 2: Verify all 8 files exist**

```bash
ls .agent-sync/skills/conventions-init/references/templates/
```

Expected: `ci-dotnet.yml  ci-go.yml  ci-node.yml  ci-python.yml  ci-rust.yml  codeql.yml  dependabot-npm.yml  security.yml`

- [ ] **Step 3: Commit**

```bash
git add .agent-sync/skills/conventions-init/references/templates/
git commit -m "feat(conventions-init): migrate CI templates from workflow-nexus"
```

---

### Task 3: Add Phase 7 (Pre-commit Hook) to conventions-init SKILL.md

**Files:**
- Modify: `.agent-sync/skills/conventions-init/SKILL.md`

- [ ] **Step 1: Read current SKILL.md**

Read `.agent-sync/skills/conventions-init/SKILL.md` to get the current content.

- [ ] **Step 2: Add Phase 7 after Phase 6**

Insert after the Phase 6 section (before "### Completion"). Add:

```markdown
### Phase 7: Pre-commit Hook

1. **Read** [`~/projects/ai-ressources/code-conventions/stack-commands.md`](~/projects/ai-ressources/code-conventions/stack-commands.md) — load the stack detection table
2. **Detect stack** — scan project root for markers per the detection rules in `stack-commands.md`
3. **No stack detected** → skip Phase 7, display "No supported stack detected — skipping pre-commit hook"
4. **If `.githooks/pre-commit` exists:**
   - If contains sentinel `# @generated by conventions-init` → will overwrite
   - If no sentinel → ask user confirmation before overwriting
5. **Generate `.githooks/pre-commit`** — a POSIX shell script (`#!/bin/sh`) containing:
   - Sentinel comment: `# @generated by conventions-init — do not edit manually`
   - Stack label comment
   - `set -e`
   - A `check()` function that prints the command, runs it, and prints failure message on error
   - For each detected stack: a tool existence guard (`command -v`) followed by `check` calls for each command
   - **Single-stack:** tool guard uses `exit 1` (fail-closed)
   - **Multi-stack:** tool guard uses `else` block (skip block, warn, continue to next stack). Add a `_ran=0` counter incremented per executed block. At the end, if `_ran` is still 0, exit 1 with "No tools found" error (prevents silent pass when no tools are installed).
   - Final success message

   Example (single-stack, TypeScript + Biome):
   ```sh
   #!/bin/sh
   # @generated by conventions-init — do not edit manually
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

6. **`chmod +x .githooks/pre-commit`**
7. **If `.git/` exists:** `git config core.hooksPath .githooks`. If no `.git/`, skip this step and display a note: "No .git/ found — run `git config core.hooksPath .githooks` after `git init`"
8. **Ensure `.githooks/` is NOT in `.gitignore`** — if found, ask confirmation before removing the entry
9. **Display confirmation:**

```
Pre-commit hook installed:
  Stack: {detected stack label(s)}
  Commands: {comma-separated list}
  Location: .githooks/pre-commit
  Hook path: git config core.hooksPath .githooks
```
```

- [ ] **Step 3: Verify edit applied correctly**

Re-read the SKILL.md and confirm Phase 7 is present between Phase 6 and Phase 8/Completion.

- [ ] **Step 4: Commit**

```bash
git add .agent-sync/skills/conventions-init/SKILL.md
git commit -m "feat(conventions-init): add Phase 7 — pre-commit hook generation"
```

---

### Task 4: Add Phase 8 (CI Workflows) to conventions-init SKILL.md

**Files:**
- Modify: `.agent-sync/skills/conventions-init/SKILL.md`

- [ ] **Step 1: Read current SKILL.md**

Re-read `.agent-sync/skills/conventions-init/SKILL.md` to get fresh content after Task 3 edit.

- [ ] **Step 2: Add Phase 8 after Phase 7**

Insert after Phase 7 (before "### Completion"). Add:

```markdown
### Phase 8: CI Workflows

1. **Verify git repository** — if no `.git/` in project root, skip Phase 8
2. **Read templates** from **Read** [`references/templates/`](references/templates/) — list available CI templates
3. **Map detected stack(s) to templates** using the stack detection table from Phase 7:
   - Each stack label maps to a CI template name (column "CI Template")
   - Always include `security.yml` (Gitleaks) regardless of stack
   - Stacks with `—` in CI Template column → skip CI for that stack
4. **Check repository visibility:**
   ```bash
   gh repo view --json visibility -q '.visibility'
   ```
   - **Public** → include `codeql.yml`, replace `__LANGUAGES__` with comma-separated CodeQL language identifiers from all detected stacks
   - **Private** or `gh` unavailable → skip CodeQL (known limitation: public repos without `gh` will miss CodeQL)
5. **Dependabot** — if npm/Node.js stack detected, include `.github/dependabot.yml` from `dependabot-npm.yml` template
6. **Create `.github/workflows/` directory** if it does not exist
7. **For each file to write:**
   - **Does not exist** → create from template
   - **Exists with sentinel `# @generated by conventions-init`** → overwrite
   - **Exists without sentinel** → show diff, ask: replace / keep. Default: keep
8. **CI file naming:**

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

   **Multi-stack:** Primary stack (first in table order) writes to `ci.yml`. Additional stacks write to `ci-{stack-lowercase}.yml` (e.g., `ci-python.yml`).

9. **Display summary:**
   ```
   CI workflows generated:
     ✓ .github/workflows/ci.yml (from {template})
     ✓ .github/workflows/security.yml (Gitleaks)
     ✓ .github/dependabot.yml (npm)
     ⊘ .github/workflows/codeql.yml skipped (private repo)
   ```
```

- [ ] **Step 3: Update the Completion section**

Replace the existing Completion display block with an integrated summary that includes Phase 7-8 output:

```markdown
### Completion

Display:
```
.conventions/ generated — {N} domains, {L} total lines
  ✓ code.md ({L1} lines, {S} sources)
  ✓ legal.md ({L2} lines, {S} sources)
  ✓ index.md
  ✓ conventions.manifest.json

Config audit: {X} fixed, {Y} created, {Z} skipped

Pre-commit hook installed:
  Stack: {label(s)}
  Commands: {list}
  Location: .githooks/pre-commit

CI workflows generated:
  ✓ .github/workflows/ci.yml ({template})
  ✓ .github/workflows/security.yml (Gitleaks)
  ✓ .github/dependabot.yml (npm)
```

The manifest tracks file hashes for staleness detection in `/conventions-refresh`, and the detected stack for hook/CI refresh.
```

- [ ] **Step 4: Add manifest stack schema to the skill**

After Phase 8, before Completion, add a note about manifest:

```markdown
### Manifest Update

After Phase 8, append the `stack` field to `.conventions/conventions.manifest.json`:

```json
"stack": {
  "labels": ["TypeScript + Biome"],
  "markers": ["tsconfig.json", "biome.json"],
  "hookGenerated": true,
  "ciGenerated": ["ci.yml", "security.yml"],
  "dependabotGenerated": true
}
```

This is written by the skill (not `build-conventions.ts`), after Phase 4 generates the manifest.
```

- [ ] **Step 5: Verify edit applied correctly**

Re-read the SKILL.md and confirm Phase 8, Manifest Update, and updated Completion are present.

- [ ] **Step 6: Commit**

```bash
git add .agent-sync/skills/conventions-init/SKILL.md
git commit -m "feat(conventions-init): add Phase 8 — CI workflow generation"
```

---

### Task 5: Update conventions-refresh SKILL.md

**Files:**
- Modify: `.agent-sync/skills/conventions-refresh/SKILL.md`

- [ ] **Step 1: Read current SKILL.md**

Read `.agent-sync/skills/conventions-refresh/SKILL.md`.

- [ ] **Step 2: Add stack tracking to default mode**

After existing step 5 ("Regenerate index"), add:

```markdown
6. **Stack tracking** — compare detected stack with `manifest.stack`:

   a. **Re-detect stack** — scan project root for markers per `stack-commands.md`
   
   b. **Compare** current markers with `manifest.stack.markers`
   
   c. **If markers identical** → skip hook/CI refresh, display "Stack unchanged"
   
   d. **If markers changed:**
      - **Hook:** regenerate `.githooks/pre-commit` using Phase 7 logic (sentinel overwrite if present, ask confirmation otherwise)
      - **CI:** display proposed changes:
        ```
        Stack changed: {old label(s)} → {new label(s)}
        
        Pre-commit hook:
          ✓ Regenerated .githooks/pre-commit
        
        CI workflows:
          - Remove {old files}?
          + Create {new files}?
          
        Apply? (y/n)
        ```
      - Update `manifest.stack` with new detection
   
   e. **If `manifest.stack` does not exist** (old manifest without stack tracking) → run Phase 7 + Phase 8 from conventions-init, update manifest
```

- [ ] **Step 3: Update `--full` mode**

In the `--full` mode section, add Phase 7 and Phase 8 to the list of re-run phases:

Change:
```
- **Phase 1-3**: Re-detect domains from scratch
- **Phase 4**: Call build-conventions.ts with detected domains
- **Phase 5**: Update gitignore
- **Phase 6**: Audit config files
```

To:
```
- **Phase 1-3**: Re-detect domains from scratch
- **Phase 4**: Call build-conventions.ts with detected domains
- **Phase 5**: Update gitignore
- **Phase 6**: Audit config files
- **Phase 7**: Regenerate pre-commit hook
- **Phase 8**: Regenerate CI workflows
```

- [ ] **Step 4: Update edge cases**

Add to the Edge Cases section:

```markdown
- **Manifest has no `stack` field** (old format) → run Phase 7-8 from conventions-init, write stack to manifest
- **Stack markers changed** → regenerate hook (sentinel overwrite), propose CI changes
- **Stack markers unchanged** → skip hook/CI, display "Stack unchanged"
```

- [ ] **Step 5: Update Rules section**

Change the rule "The project directory is never modified except `.conventions/`" to:

```markdown
- The project directory is modified only in: `.conventions/`, `.githooks/pre-commit` (with sentinel), `.github/workflows/` (with sentinel), `.github/dependabot.yml` (with sentinel), and `git config core.hooksPath`
```

- [ ] **Step 6: Verify edit**

Re-read the SKILL.md and confirm all additions are present.

- [ ] **Step 7: Commit**

```bash
git add .agent-sync/skills/conventions-refresh/SKILL.md
git commit -m "feat(conventions-refresh): add stack tracking for hook/CI refresh"
```

---

### Task 6: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read current README.md**

Read `README.md`.

- [ ] **Step 2: Add Conventions Lifecycle section**

Insert after the "Usage" section (after the "Direct browsing" subsection, before the end of file). Add:

```markdown
## Conventions Lifecycle

### `/conventions-init`

Analyzes the project stack and generates:
- `.conventions/` — compiled convention files from this knowledge base
- `.githooks/pre-commit` — pre-commit hook with stack-adapted lint commands
- `.github/workflows/` — CI pipelines (CI, security, CodeQL)
- `.github/dependabot.yml` — Dependabot updates for npm-based stacks
- Config audit — validates tsconfig.json, biome.json, .gitignore, etc.

Stack detection uses `code-conventions/stack-commands.md` to map marker files (tsconfig.json, Cargo.toml, go.mod, etc.) to the appropriate lint commands and CI templates.

### `/conventions-refresh`

Incrementally updates materialized conventions when the knowledge base changes:
- **Conventions**: hash-based staleness detection per domain
- **Hooks/CI**: marker-based stack change detection — regenerates if the stack evolved

Use `--full` to force a complete re-detection and rebuild.
```

- [ ] **Step 3: Verify edit**

Re-read `README.md` and confirm the section is present and well-placed.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add Conventions Lifecycle section to README"
```

---

### Task 7: Delete workflow-nexus skill

**Files:**
- Delete: `/Users/julienm/projects/claude-skills/projects/dev/kit/skills/workflow-nexus/SKILL.md`
- Delete: `/Users/julienm/projects/claude-skills/projects/dev/kit/skills/workflow-nexus/templates/` (all 8 files)

- [ ] **Step 1: Unlink the skill from cc-hub**

```bash
cc-hub skill unlink workflow-nexus
```

- [ ] **Step 2: Delete the skill directory**

```bash
rm -rf /Users/julienm/projects/claude-skills/projects/dev/kit/skills/workflow-nexus
```

- [ ] **Step 3: Search for references to workflow-nexus in claude-skills**

```bash
grep -r "workflow-nexus" /Users/julienm/projects/claude-skills/ --include="*.md" -l
```

For each file found: remove or update the reference to workflow-nexus.

- [ ] **Step 4: Commit in claude-skills repo**

```bash
cd /Users/julienm/projects/claude-skills
git add -A
git commit -m "feat: remove workflow-nexus skill (absorbed into conventions-init)"
```

---

### Task 8: Sync cc-hub and verify

- [ ] **Step 1: Sync updated conventions-init skill**

```bash
cc-hub skill link ~/projects/ai-ressources/.agent-sync/skills/conventions-init/SKILL.md --name conventions-init
```

- [ ] **Step 2: Sync updated conventions-refresh skill**

```bash
cc-hub skill link ~/projects/ai-ressources/.agent-sync/skills/conventions-refresh/SKILL.md --name conventions-refresh
```

- [ ] **Step 3: Verify workflow-nexus is gone**

```bash
cc-hub skill list | grep -i nexus
```

Expected: no output (skill is unlinked).

- [ ] **Step 4: Verify conventions-init and conventions-refresh are linked**

```bash
cc-hub skill list | grep -i conventions
```

Expected: both `conventions-init` and `conventions-refresh` appear.
