# conventions-init Config Audit — Design Spec

**Date:** 2026-03-28
**Scope:** Add a Phase 6 "Config Audit" to `/conventions-init` that detects the project runtime/toolchain and audits/fixes configuration files.

## Decisions

| Decision | Choice |
|---|---|
| Language scope (configs) | TypeScript only (extensible structure for Go, Rust, etc.) |
| Language scope (.gitignore) | All supported languages (TS, Go, Rust, Delphi, Python, Swift/Kotlin) |
| Config files audited (TS) | tsconfig.json, package.json, .nvmrc/.node-version, .editorconfig, eslint, prettier, vitest, bunfig.toml, .npmrc, .gitignore |
| Missing file behavior | Auto-create (except tsconfig.json/package.json which require confirmation via grouped summary) |
| Incorrect file behavior | Grouped summary, single confirmation, batch apply |
| Defaults source | `code-conventions/runtime-configs.md` (knowledge base, reusable) |
| Position in flow | Phase 6, after gitignore (Phase 5) |

## Deliverables

1. **`code-conventions/runtime-configs.md`** — new file in the knowledge base
2. **`conventions-init/SKILL.md`** — Phase 6 added

---

## 1. Runtime Detection

Detect JS/TS runtime via lockfiles and config files. First match wins:

| Signal | Runtime |
|---|---|
| `bun.lock` or `bunfig.toml` | Bun |
| `deno.json` or `deno.lock` | Deno |
| `pnpm-lock.yaml` | Node + pnpm |
| `yarn.lock` | Node + yarn |
| `package-lock.json` | Node + npm |
| `package.json` (no lockfile) | Node + npm (fallback) |

No JS/TS detected = skip config audit entirely.

Language detection for `.gitignore` reuses Phase 1 file extension analysis (already done before Phase 6 runs).

---

## 2. File: `code-conventions/runtime-configs.md`

Source of truth for expected config defaults per runtime/language. Structure with `##` per language, `###` per config file.

### TypeScript section

#### Config: tsconfig.json

**All runtimes:**

| Key | Expected | If missing |
|---|---|---|
| `compilerOptions.strict` | `true` | confirm |
| `compilerOptions.esModuleInterop` | `true` | confirm |
| `compilerOptions.skipLibCheck` | `true` | confirm |
| `compilerOptions.forceConsistentCasingInImports` | `true` | confirm |

**Bun only:**

| Key | Expected |
|---|---|
| `compilerOptions.moduleResolution` | `"bundler"` |
| `compilerOptions.target` | `"ESNext"` |
| `compilerOptions.module` | `"ESNext"` |

**Deno only:**

| Key | Expected |
|---|---|
| `compilerOptions.lib` | includes `"deno.ns"` |

**Node (all package managers):**

| Key | Expected |
|---|---|
| `compilerOptions.moduleResolution` | `"node16"` or `"nodenext"` |
| `compilerOptions.target` | `"ES2022"` or higher |
| `compilerOptions.module` | `"node16"` or `"nodenext"` |

#### Config: package.json

**All runtimes:**

| Key | Expected | If missing |
|---|---|---|
| `type` | `"module"` | auto |
| `scripts.typecheck` | exists | auto |
| `scripts.lint` | exists | signal only |
| `scripts.test` | exists | signal only |

**Bun only:**

| Key | Expected |
|---|---|
| `devDependencies.@types/bun` | present |
| `scripts.typecheck` | `"bunx tsc --noEmit"` |

#### Config: .nvmrc / .node-version

- **Node (all):** create `.nvmrc` with current LTS if missing -> auto
- **Bun:** create `.node-version` if missing -> auto
- **Deno:** skip

#### Config: .editorconfig

**All runtimes** — create if missing -> auto:

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

#### Config: eslint

**All runtimes (except Deno):** check `eslint.config.*` or `.eslintrc.*` exists. If missing -> signal only (too complex to auto-generate).

#### Config: prettier

**All runtimes (except Deno):** check `.prettierrc*` or `prettier` key in `package.json`. If missing -> auto-create `.prettierrc`:

```json
{
  "useTabs": true,
  "semi": true,
  "singleQuote": false
}
```

#### Config: vitest.config.ts

**All runtimes:** check existence when `vitest` is in devDependencies. If missing -> signal only.

#### Config: bunfig.toml

**Bun only:** no required defaults — file presence is enough signal.

#### Config: .npmrc

**pnpm only** — create if missing -> auto:

```ini
shamefully-hoist=true
```

---

## 3. `.gitignore` Audit

The `.gitignore` audit applies to **all detected languages**, not just TypeScript. Patterns are composed in layers:

### Layer 1: Common (always applied)

```gitignore
# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/          # skippable if team shares VS Code settings
*.swp
*.swo

# Environment
.env
.env.*
!.env.example

# Logs
*.log

# Conventions (from Phase 5)
.conventions/
```

### Layer 2: Language-specific (cumulative if multi-language)

**TypeScript / JavaScript:**

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

**Go:**

```gitignore
bin/
*.exe
vendor/
```

**Rust:**

```gitignore
target/
*.pdb
```

**Delphi:**

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

**Python:**

```gitignore
__pycache__/
*.pyc
.venv/
*.egg-info/
.mypy_cache/
.ruff_cache/
```

**Swift:**

```gitignore
DerivedData/
*.xcworkspace
build/
```

**Kotlin:**

```gitignore
build/
.gradle/
```

### Behavior

- If `.gitignore` exists: add only missing patterns (no duplicates), grouped under a comment header per layer
- If `.gitignore` does not exist: create it with all relevant layers
- No confirmation required — auto like other minor files
- Phase 5 (existing) still handles `.conventions/` specifically. Phase 6 handles the full audit — if `.conventions/` was already added by Phase 5, Phase 6 skips that pattern

---

## 4. Phase 6 in SKILL.md

Added after Phase 5 (gitignore):

### Phase 6: Config Audit

1. **Read** `~/projects/ai-ressources/code-conventions/runtime-configs.md`
2. **Detect runtime** — glob lockfiles/config files in project root, match with detection table
3. **Detect languages** — reuse Phase 1 file extension analysis
4. **If no supported language detected** -> skip Phase 6
5. **Audit .gitignore** — compose layers (common + detected languages), add missing patterns. Auto-apply, no confirmation needed.
6. **Audit config files** (TS only for now):
   - Read each config file if it exists
   - Compare each expected key with actual value
   - Classify: `ok`, `fix` (wrong value), `create` (file missing), `signal` (info only)
7. **Display grouped summary:**

```
Config Audit (Bun detected):

.gitignore:
  + 12 patterns added (node_modules/, .bun/, .idea/, ...)

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
   - Fix existing files (JSON merge, not overwrite)
   - Create missing files marked "auto"
   - "confirm" files (tsconfig, package.json) are included in the grouped summary — the summary IS the confirmation
   - "signal only" files are displayed with `ℹ` but no action taken
9. **User can skip items** — respond "skip .nvmrc, .prettierrc" etc.

### Updated completion message

```
.conventions/conventions.md generated — {N} categories, {L} lines
Config audit: {X} fixed, {Y} created, {Z} skipped
```

---

## 5. Interactions with Existing Features

- **`conventions-refresh`** — does NOT re-run the config audit. Configs don't change when conventions are refreshed. Config audit only runs with `conventions-init`.
- **`/audit`** — could read `runtime-configs.md` to verify config compliance in the future. Out of scope here.
- **`runtime-configs.md`** — indexed in `code-conventions/index.yaml`, compiled into `compiled-index.txt`. Available to `ai-res-librarian`.
- **Phase 5 overlap** — Phase 5 still adds `.conventions/` to `.gitignore`. Phase 6 `.gitignore` audit skips patterns already present (including those added by Phase 5).

---

## 6. Extensibility

Adding a new language:
1. Add a `## <Language>` section in `runtime-configs.md` with detection table and config defaults
2. Add `.gitignore` patterns in the language-specific layer (already possible for all languages)
3. Phase 6 logic auto-discovers sections — no hardcoding in the skill

Adding a new config file to an existing language:
1. Add a `### Config: <filename>` subsection under the relevant language
2. Specify expected keys, values, and "if missing" behavior
