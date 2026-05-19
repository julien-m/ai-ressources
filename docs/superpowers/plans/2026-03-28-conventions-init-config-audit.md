# conventions-init Config Audit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Phase 6 "Config Audit" to `/conventions-init` that detects the project runtime, audits config files against expected defaults, enriches `.gitignore` with language-specific patterns, and applies fixes with user confirmation.

**Architecture:** Two deliverables — (1) a new `code-conventions/runtime-configs.md` reference file containing expected config defaults per runtime/language, and (2) a Phase 6 section appended to the existing `conventions-init/SKILL.md`. The reference file is the source of truth; the skill reads it at runtime.

**Tech Stack:** Markdown knowledge base files, YAML index entries, build script (`bun run scripts/build-index.ts`)

**Spec:** [`docs/superpowers/specs/2026-03-28-conventions-init-config-audit-design.md`](../specs/2026-03-28-conventions-init-config-audit-design.md)

---

### Task 1: Create `code-conventions/runtime-configs.md`

**Files:**
- Create: `code-conventions/runtime-configs.md`

- [ ] **Step 1: Create the runtime-configs.md file**

```markdown
# Runtime Configurations

Expected configuration defaults per runtime and language. Used by `/conventions-init` Phase 6 (Config Audit).

Structure: `##` per language, `###` per config file. Each config section specifies expected keys, values, and behavior when the file is missing.

## TypeScript

### Runtime detection

First match wins:

| Signal | Runtime |
|---|---|
| `bun.lock` or `bunfig.toml` | Bun |
| `deno.json` or `deno.lock` | Deno |
| `pnpm-lock.yaml` | Node + pnpm |
| `yarn.lock` | Node + yarn |
| `package-lock.json` | Node + npm |
| `package.json` (no lockfile) | Node + npm (fallback) |

No JS/TS files detected = skip TypeScript config audit.

### Config: tsconfig.json

Create if missing: **confirm**

**All runtimes:**

| Key | Expected |
|---|---|
| `compilerOptions.strict` | `true` |
| `compilerOptions.esModuleInterop` | `true` |
| `compilerOptions.skipLibCheck` | `true` |
| `compilerOptions.forceConsistentCasingInImports` | `true` |

**Bun:**

| Key | Expected |
|---|---|
| `compilerOptions.moduleResolution` | `"bundler"` |
| `compilerOptions.target` | `"ESNext"` |
| `compilerOptions.module` | `"ESNext"` |

**Deno:**

| Key | Expected |
|---|---|
| `compilerOptions.lib` | includes `"deno.ns"` |

**Node (npm, pnpm, yarn):**

| Key | Expected |
|---|---|
| `compilerOptions.moduleResolution` | `"node16"` or `"nodenext"` |
| `compilerOptions.target` | `"ES2022"` or higher |
| `compilerOptions.module` | `"node16"` or `"nodenext"` |

### Config: package.json

Create if missing: **confirm**

**All runtimes:**

| Key | Expected | If missing |
|---|---|---|
| `type` | `"module"` | auto |
| `scripts.typecheck` | exists | auto |
| `scripts.lint` | exists | signal |
| `scripts.test` | exists | signal |

**Bun:**

| Key | Expected |
|---|---|
| `devDependencies.@types/bun` | present |
| `scripts.typecheck` | `"bunx tsc --noEmit"` |

### Config: .nvmrc / .node-version

- **Node (all):** create `.nvmrc` with current LTS if missing — auto
- **Bun:** create `.node-version` if missing — auto
- **Deno:** skip

### Config: .editorconfig

Create if missing: **auto**

```ini
root = true

[*]
indent_style = tab
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

### Config: eslint

**All runtimes (except Deno):** check `eslint.config.*` or `.eslintrc.*` exists. If missing — signal only.

### Config: prettier

Create if missing: **auto**

**All runtimes (except Deno):** check `.prettierrc*` or `prettier` key in `package.json`.

```json
{
  "useTabs": true,
  "semi": true,
  "singleQuote": false
}
```

### Config: vitest.config.ts

**All runtimes:** check existence when `vitest` is in devDependencies. If missing — signal only.

### Config: bunfig.toml

**Bun only:** no required defaults — file presence is enough signal.

### Config: .npmrc

Create if missing (pnpm only): **auto**

```ini
shamefully-hoist=true
```

---

## .gitignore Patterns

Language-independent. Composed in layers — common first, then per detected language.

### Layer: common

Always applied:

```gitignore
# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo

# Environment
.env
.env.*
!.env.example

# Logs
*.log

# Conventions
.conventions/
```

> `.vscode/` is skippable if the user explicitly opts out (team shares VS Code settings).

### Layer: typescript

```gitignore
node_modules/
dist/
build/
.output/
coverage/
.tsbuildinfo
.next/
.nuxt/
.astro/
.turbo/
.bun/
.npm/
.yarn/
.pnpm-store/
```

### Layer: go

```gitignore
bin/
*.exe
vendor/
```

### Layer: rust

```gitignore
target/
*.pdb
```

### Layer: delphi

```gitignore
*.dcu
*.exe
*.dll
*.bpl
*.dcp
*.map
*.drc
__history/
__recovery/
Win32/
Win64/
```

### Layer: python

```gitignore
__pycache__/
*.pyc
.venv/
*.egg-info/
.mypy_cache/
.ruff_cache/
```

### Layer: swift

```gitignore
DerivedData/
*.xcworkspace
build/
```

### Layer: kotlin

```gitignore
build/
.gradle/
```
```

- [ ] **Step 2: Verify the file was created correctly**

Run: `wc -l code-conventions/runtime-configs.md`
Expected: ~200 lines

---

### Task 2: Update `code-conventions/index.yaml`

**Files:**
- Modify: `code-conventions/index.yaml`

- [ ] **Step 1: Add runtime-configs.md entry to the files list**

Add after the last `file:` entry (before the framework deltas comment), at priority 6 (same as database.md — cross-cutting utility file):

```yaml
  - file: runtime-configs.md
    description: "Expected config defaults per runtime/language: tsconfig, package.json, editorconfig, prettier, gitignore patterns. Used by /conventions-init Phase 6."
    applies_to: ["*"]
    priority: 6
```

- [ ] **Step 2: Rebuild compiled index**

Run: `cd /Users/julienm/projects/ai-ressources && bun run scripts/build-index.ts`
Expected: success, `compiled-index.txt` updated

- [ ] **Step 3: Update .last-updated marker**

Run: `date +%Y-%m-%d > /Users/julienm/projects/ai-ressources/.last-updated`

---

### Task 3: Update root `index.yaml` last_reviewed date

**Files:**
- Modify: `index.yaml` (project root)

- [ ] **Step 1: Update code-conventions last_reviewed**

Change `last_reviewed` under `code-conventions` domain to `2026-03-28`:

```yaml
  code-conventions:
    description: "Language-agnostic and per-language coding standards. Loaded automatically by claude/rules/code.md dispatcher."
    status: complete
    file_count: 11
    last_reviewed: 2026-03-28
```

Note: `file_count` goes from 10 to 11 (adding `runtime-configs.md`). The `last_reviewed` stays `2026-03-28` (already today but confirms the update).

---

### Task 4: Add Phase 6 to `conventions-init/SKILL.md`

**Files:**
- Modify: `.agent-sync/skills/conventions-init/SKILL.md`

- [ ] **Step 1: Add Phase 6 section after Phase 5 (gitignore)**

Insert before the `### Completion` section:

```markdown
### Phase 6: Config Audit

1. **Read** [`~/projects/ai-ressources/code-conventions/runtime-configs.md`](~/projects/ai-ressources/code-conventions/runtime-configs.md)
2. **Detect runtime** — glob lockfiles and config files in the project root, match against the runtime detection table
3. **Detect languages** — reuse Phase 1 file extension analysis
4. **If no supported language detected** → skip Phase 6
5. **Audit .gitignore** — compose layers from `runtime-configs.md` (common + all detected languages). Add only missing patterns to the existing `.gitignore` (no duplicates). If `.gitignore` does not exist, create it. No confirmation needed — auto-apply.
6. **Audit config files** (TypeScript only for now):
   - Read each config file if it exists
   - Compare each expected key/value from `runtime-configs.md` against the actual file
   - Classify each item: `ok` (matches), `fix` (wrong value), `create` (file missing, auto-create), `signal` (info only, no action)
7. **Display grouped summary:**

```
Config Audit ({runtime} detected):

.gitignore:
  + {N} patterns added ({list of key patterns}...)

tsconfig.json:
  ✓ strict: true
  ⚠ moduleResolution: "node" → "bundler"
  ⚠ target: "ES2020" → "ESNext"

package.json:
  ✓ type: "module"
  ⚠ devDependencies: missing @types/bun
  ⚠ scripts.typecheck: "tsc --noEmit" → "bunx tsc --noEmit"

Files to create:
  + .editorconfig (standard defaults)
  + .prettierrc (tabs, semi, double quotes)
  + .nvmrc (v22.x)

ℹ eslint config not found (create manually)
ℹ vitest.config.ts not found (vitest in devDependencies)

Apply? (y/n, or list items to skip)
```

8. **On confirmation:**
   - Fix existing files using JSON merge (not overwrite) for `.json` files
   - Create missing files marked "auto" in `runtime-configs.md`
   - Files marked "confirm" (tsconfig.json, package.json) are included in the grouped summary — the summary serves as the confirmation gate
   - Files marked "signal" are displayed with `ℹ` — no action taken
9. **User can skip items** — respond with "skip .nvmrc, .prettierrc" etc.
10. **If nothing to fix or create** (all items `ok`) → display "Config audit: all checks passed ✓" and skip the confirmation prompt
```

- [ ] **Step 2: Update the Completion section**

Replace the existing completion display with:

```markdown
### Completion

Display:
```
.conventions/conventions.md generated — {N} categories, {L} lines
Config audit: {X} fixed, {Y} created, {Z} skipped
```
```

- [ ] **Step 3: Verify SKILL.md is coherent**

Read the full updated `SKILL.md` and verify:
- Phase numbering is sequential (1-6)
- No references to old phase numbers are broken
- The Completion section reflects both Phase 4 output and Phase 6 output
- File stays under 300 lines

---

### Task 5: Commit all changes

**Files:**
- All files from Tasks 1-4

- [ ] **Step 1: Verify all changes**

Run: `cd /Users/julienm/projects/ai-ressources && git diff --stat`

Expected files changed:
- `code-conventions/runtime-configs.md` (new)
- `code-conventions/index.yaml` (modified)
- `index.yaml` (modified)
- `.agent-sync/skills/conventions-init/SKILL.md` (modified)
- `compiled-index.txt` (modified, auto-generated)
- `.last-updated` (modified)
- `docs/superpowers/specs/2026-03-28-conventions-init-config-audit-design.md` (new)
- `docs/superpowers/plans/2026-03-28-conventions-init-config-audit.md` (new)

- [ ] **Step 2: Stage and commit**

```bash
git add code-conventions/runtime-configs.md code-conventions/index.yaml index.yaml .agent-sync/skills/conventions-init/SKILL.md compiled-index.txt .last-updated docs/superpowers/specs/2026-03-28-conventions-init-config-audit-design.md docs/superpowers/plans/2026-03-28-conventions-init-config-audit.md
git commit -m "feat(conventions-init): add Phase 6 config audit with runtime detection

Add runtime-configs.md reference file and Phase 6 to conventions-init
that detects JS/TS runtime (Bun/Deno/Node+npm/pnpm/yarn), audits
config files (tsconfig, package.json, editorconfig, prettier, etc.),
and enriches .gitignore with language-specific patterns for all
supported languages."
```
