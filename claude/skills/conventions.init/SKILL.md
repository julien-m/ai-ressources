---
name: conventions.init
description: "Analyze a project's stack and generate .conventions/ directory with per-domain convention files. Use when setting up conventions for a new or existing project."
argument-hint: ""
---

# /conventions.init — Materialize Project Conventions

Analyze the current project's stack, detect relevant domains, and generate `.conventions/` directory containing compiled convention files from `~/projects/ai-ressources/`.

The compilation is **deterministic** (no LLM synthesis): the build script reads source files, resolves dependency graphs, concatenates content, and outputs clean per-domain files. Every agent and subagent has instant access without calling `/ai-res`.

## Prerequisites

- The current working directory is the **target project** (NOT ai-ressources)
- `~/projects/ai-ressources/` must exist and contain the knowledge base

## Procedure

### Phase 1: Analyze the target project

0. **Spec stack (if available)** — Check if `.specs/stacks/_default.md` exists in the project root. If it does:
   - Read the file
   - Find the first Markdown table with a "Layer" or "Technology" column header
   - Extract each row: the layer name (column 1) and the choice value (column 2)
   - Store the extracted layers as an additional detection source — these are merged with the code scan results in Phase 2

   This enables conventions generation for greenfield projects where no code exists yet but the stack is declared in LiveSpec specs.

   If `.specs/stacks/_default.md` does not exist, skip this step silently. The rest of Phase 1 proceeds as normal.

1. **Dependencies** — Read dependency files in the project root. Extract all package/module names:
   - `package.json` → `dependencies` + `devDependencies`
   - `go.mod` → `require` block
   - `Cargo.toml` → `[dependencies]`
   - `Podfile` → pod names
   - `*.dproj` → Delphi project references
   - `requirements.txt`, `pyproject.toml` → Python packages
   - `Gemfile` → Ruby gems

2. **File extensions** — Glob the project for file extensions present. **Exclude**: `node_modules/`, `dist/`, `build/`, `.git/`, `.conventions/`, `vendor/`, `target/`, `.next/`, `.nuxt/`, `.output/`.

3. **Project context** — Read `CLAUDE.md` if present. Note declared stack, conventions, project description.

4. **Project type** — Deduce from the above: web app, mobile app, CLI, API, landing page, design system, library, monorepo, etc.

### Phase 2: Detect relevant domains

Before detection, **read these reference files** and **scan ai-ressources directories**:

**Read** [`references/package-mapping.md`](references/package-mapping.md) — packages → stack-ref mapping
**Read** [`references/architecture-signals.md`](references/architecture-signals.md) — code signals → architecture patterns
**Read** [`references/project-type-signals.md`](references/project-type-signals.md) — project type → design/copywriting

**Scan dynamically** — list all `.md` files in these `~/projects/ai-ressources/` directories to discover available files at runtime:
- `stack-ref/**/*.md`
- `architecture/*.md`
- `design/**/*.md`
- `copywriting/*.md`
- `code-conventions/*.md`
- `conventions/*.md`

#### Catalog-Based Detection (Primary when signals provided)

If the caller provides a list of keyword signals (e.g., from a LiveSpec stack file):

1. **Read** [`~/projects/ai-ressources/domain-catalog.md`](~/projects/ai-ressources/domain-catalog.md)
2. Match each provided signal against all tables in the catalog
3. Collect all matched convention file paths
4. Use these as the **primary** detected domains — they take precedence over file scanning and code grepping
5. Still run Channels 1-3 for any additional signals not covered by the caller's list, but do NOT override catalog results

If no signals are provided by the caller, proceed with Channels 1-3 as before (backward compatible).

#### Channel 1: File extensions → code-conventions (language deltas)

| Extensions | Category | Source files to read (all from `code-conventions/`) |
|---|---|---|
| `.ts`, `.tsx`, `.js`, `.jsx` | code | `general.md` + `architecture.md` + `logging.md` + `testing.md` + `javascript.md` |
| `.go` | code | `general.md` + `architecture.md` + `logging.md` + `testing.md` + `go.md` |
| `.rs` | code | `general.md` + `architecture.md` + `logging.md` + `testing.md` + `rust.md` |
| `.swift`, `.kt` | code | `general.md` + `architecture.md` + `logging.md` + `testing.md` + `swift-kotlin.md` |
| `.pas`, `.dfm`, `.dproj` | code | `general.md` + `architecture.md` + `logging.md` + `testing.md` + `delphi.md` |
| `.sql`, `migration`/`schema` in path | code | `database.md` |
| `.css`, `.scss` | design | `design/systems/web-standards.md` + `design/tokens/*.md` |
| `.swift` with UI, `.xib`, `.storyboard` | design | `design/systems/apple-hig.md` + `design/tokens/*.md` |
| `.kt` with UI, layout XML | design | `design/systems/material-design.md` + `design/tokens/*.md` |
| `.pen` | design | `design/references/mockup-specs.md` |
| `.md` with mermaid/gherkin | diagrams | `conventions/diagrams.md` |
| `.specs/` directory exists | diagrams | `conventions/diagrams.md` |

#### Channel 1b: Dependencies + config → code-conventions (framework deltas)

Detect frameworks from `package.json` dependencies AND config files in the project root. Each match adds the corresponding framework delta from `code-conventions/`:

| Signal (dependency or config file) | Framework delta |
|---|---|
| `react`, `react-dom`, `.tsx` files with JSX | `react.md` |
| `next`, `next.config.*` | `nextjs.md` |
| `@shadcn/ui`, `components/ui/` dir, `components.json` | `shadcn.md` |
| `tailwindcss`, `@tailwindcss/*`, `tailwind.config.*` | `tailwind.md` |
| `wrangler.toml`, `wrangler.jsonc`, `@cloudflare/*`, `hono` | `cloudflare.md` |
| `@tanstack/react-query`, `@tanstack/react-router`, `@tanstack/react-start` | `tanstack.md` |
| `drizzle-orm`, `drizzle-kit`, `drizzle.config.*` | `drizzle.md` |
| `@prisma/client`, `prisma/schema.prisma` | `prisma.md` |
| `remotion`, `@remotion/*`, `remotion.config.*` | `remotion.md` |

Multiple framework deltas can match simultaneously (e.g., React + Next.js + shadcn + Tailwind). Include all matching deltas.

#### Spec-Aware Detection (resolves through catalog)

If step 0 extracted layers from `.specs/stacks/_default.md`:

1. Read the stack file and extract all technology names, dependency names, and keywords as a flat signal list
2. Resolve these signals through **Read** [`~/projects/ai-ressources/domain-catalog.md`](~/projects/ai-ressources/domain-catalog.md) (same as catalog-based detection above)
3. Merge results with Channel 1-3 detections (union)

This replaces the previous hardcoded mapping table. The catalog is the single source of truth for signal-to-convention resolution.

**Merge strategy:** Union. Spec layers and code scan results are combined. If both sources detect the same domain, it appears once. If only specs or only code detects a domain, it's included.

This means on a greenfield project (no code), the specs alone provide enough signal to generate accurate conventions. On an existing project, both sources enrich each other.

#### Channel 2: Dependencies → stack-ref + architecture

Match extracted package names against **Read** [`references/package-mapping.md`](references/package-mapping.md).

For architecture patterns, grep the project codebase for signals from **Read** [`references/architecture-signals.md`](references/architecture-signals.md).

#### Channel 3: Project type → design, copywriting, quality

Use **Read** [`references/project-type-signals.md`](references/project-type-signals.md).

### Phase 3: Confirm with user

Display detected domains grouped by category:

```
Domaines détectés pour [project-name] :

Code:
  ✓ TypeScript (general + architecture + logging + testing + javascript)
  ✓ Database (database)

Frameworks:
  ✓ React (react)
  ✓ Next.js (nextjs)
  ✓ shadcn/ui (shadcn)
  ✓ Tailwind CSS (tailwind)

Architecture:
  ✓ auth-flows, webhook-patterns

Stack:
  ✓ databases/turso, auth/better-auth, platforms/cloudflare

Design:
  ✓ web (web-standards + tokens)
  ✓ quality (accessibility + ui-rules)
  ✓ components: forms, modals, navigation

Copywriting:
  (none detected)

Diagrams:
  ✓ diagrams

Confirm? (or add/remove domains)
```

**Wait for user confirmation.** The user can add or remove domains before generation.

### Phase 4: Generate `.conventions/` directory via build-conventions.ts

This phase uses a **deterministic compilation script** to resolve dependency graphs and concatenate conventions without LLM synthesis.

#### 4.0 Construct domains JSON

Build a JSON object mapping category names to detected files. Use the domains detected in Phase 2-3, organized by category:

```json
{
  "code": [
    "nextjs",
    "drizzle",
    "tailwind",
    "testing",
    "logging",
    "architecture"
  ],
  "legal": [
    "cgu-saas-type",
    "rgpd-obligations"
  ],
  "design": [
    "web-standards",
    "forms",
    "colors"
  ]
}
```

**Mapping from Phase 2-3 to domains JSON:**

- **code domain**: All detected language/framework files (javascript, react, nextjs, drizzle, prisma, tailwind, etc.) PLUS any transversal files explicitly mentioned (testing, logging, architecture, runtime-configs). `general` and `database` are **excluded** from the domains array — they are auto-resolved by the build script via the `extends` graph in each file's frontmatter.
- **legal domain**: Architecture or legal files detected in Phase 2 (from `architecture/`, `conventions/`)
- **design domain**: Design-related files detected in Phase 2 (from `design/`)
- **pricing domain**: Pricing model files if detected (from `pricing-models/`)
- **architecture domain**: Not a separate domain — include in code if `architecture.md` was detected

**Examples:**

- Detected: TypeScript, React, Next.js, Drizzle → `code: ["nextjs", "drizzle"]` (general + javascript + react are inherited via extends)
- Detected: TypeScript, testing, logging → `code: ["javascript", "testing", "logging"]` (general inherited)
- Greenfield project, no code → `code: []` (omit or empty array)

#### 4.1 Invoke build-conventions.ts

Call the build script with the project directory and domains JSON:

```bash
bun run ~/projects/ai-ressources/scripts/build-conventions.ts "$(pwd)" '{"code":["nextjs","drizzle"],"legal":[],"design":[]}'
```

**Script behavior:**

- Reads from `~/projects/ai-ressources/code-conventions/*.md` (and other domain directories)
- Resolves the `extends` graph for code domain (post-order DFS, deduplication)
- Concatenates files with separators: `\n\n---\n<!-- source: path -->\n---\n\n`
- Outputs:
  - `.conventions/code.md` (if code domain has files)
  - `.conventions/legal.md`, `.conventions/design.md`, etc. (if domains have files)
  - `.conventions/index.md` (table of contents with domain hints)
  - `.conventions/conventions.manifest.json` (SHA256 hashes + metadata)
- Creates `.conventions/` directory if it does not exist
- Exits with status 0 (warnings non-fatal)

**Edge cases handled by script:**

- **Cycle in extends**: warns, skips the cyclic file, continues
- **Missing source file**: warns with hash `"missing"`, continues
- **Empty code domain**: skips code.md, does not add to index
- **No domains**: creates only index.md (no domain files)

### Phase 5: Gitignore

Check if `.conventions/` is in the project's `.gitignore`:
- If `.gitignore` exists and `.conventions/` is not listed → append `\n# Materialized conventions\n.conventions/\n`
- If `.gitignore` does not exist AND project is a git repo → create `.gitignore` with `.conventions/\n`
- If not a git repo → skip

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
  + biome.json (tabs, semi, double quotes, lineWidth 120)
  + .nvmrc (v22.x)
ℹ vitest.config.ts not found (vitest in devDependencies)

Apply? (y/n, or list items to skip)
```

8. **On confirmation:**
   - Fix existing files using JSON merge (not overwrite) for `.json` files
   - Create missing files marked "auto" in `runtime-configs.md`
   - Files marked "confirm" (tsconfig.json, package.json) are included in the grouped summary — the summary serves as the confirmation gate
   - Files marked "signal" are displayed with `ℹ` — no action taken
9. **User can skip items** — respond with "skip .nvmrc, biome.json" etc.
10. **If nothing to fix or create** (all items `ok`) → display "Config audit: all checks passed ✓" and skip the confirmation prompt

### Phase 7: Pre-commit Hook

1. **Read** [`~/projects/ai-ressources/code-conventions/stack-commands.md`](~/projects/ai-ressources/code-conventions/stack-commands.md) — load the stack detection table
2. **Detect stack** — scan project root for markers per the detection rules in `stack-commands.md`
3. **No stack detected** → skip Phase 7, display "No supported stack detected — skipping pre-commit hook"
4. **If `.githooks/pre-commit` exists:**
   - If contains sentinel `# @generated by conventions.init` → will overwrite
   - If no sentinel → ask user confirmation before overwriting
5. **Generate `.githooks/pre-commit`** — a POSIX shell script (`#!/bin/sh`) containing:
   - Sentinel comment: `# @generated by conventions.init — do not edit manually`
   - Stack label comment
   - `set -e`
   - A `check()` function that prints the command, runs it, and prints failure message on error
   - For each detected stack: a tool existence guard (`command -v`) followed by `check` calls for each command
   - **Single-stack:** tool guard uses `exit 1` (fail-closed)
   - **Multi-stack:** tool guard uses `else` block (skip block, warn, continue to next stack). Add a `_ran=0` counter incremented per executed block. At the end, if `_ran` is still 0, exit 1 with "No tools found" error.
   - Final success message

   Example (single-stack, TypeScript + Biome):
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
5. **Dependabot** — if npm/Node.js stack detected, generate `.github/dependabot.yml` from `dependabot-npm.yml` template
6. **Create `.github/workflows/` directory** if it does not exist
7. **For each file to write:**
   - **Does not exist** → create from template
   - **Exists with sentinel `# @generated by conventions.init`** → overwrite
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

### Completion

Display:
```
.conventions/ generated — {N} domains, {L} total lines
  ✓ code.md ({L1} lines, {S} sources)
  ✓ legal.md ({L2} lines, {S} sources)
  ✓ design.md ({L3} lines, {S} sources)
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

The manifest tracks file hashes for staleness detection in `/conventions.refresh`, and the detected stack for hook/CI refresh.

## Rules

- Never write secrets or sensitive data in generated files
- Scan `stack-ref/`, `architecture/`, `design/`, `copywriting/` dynamically — never hardcode the file list
- The output file must stay under **400 lines** — this is a hard budget
- For design/components, only include components relevant to the project
- If a source file does not exist in ai-ressources, skip it and warn
- The synthesized content must be equivalent to what `ai-res-librarian` would produce
