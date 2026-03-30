---
name: conventions.init
description: "Analyze a project's stack and generate .conventions/conventions.md — a single synthesized file with all relevant conventions from ai-ressources. Use when setting up conventions for a new or existing project."
argument-hint: ""
---

# /conventions.init — Materialize Project Conventions

Analyze the current project's stack, detect relevant domains, and generate a single `.conventions/conventions.md` file containing synthesized conventions from `~/projects/ai-ressources/`.

The output is equivalent to what the `ai-res-librarian` agent would return — but materialized locally so every agent and subagent has instant access without calling `/ai-res`.

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

### Phase 4: Generate `.conventions/conventions.md`

This is the core step. The goal is to produce a **single, compact, synthesized file** — NOT a dump of source files.

#### 4.0 Build project context for synthesis

Before dispatching agents, build a **project context block** that will be injected into every librarian prompt:

1. **Project type** — from Phase 1.4 (e.g., "CLI", "web app", "API", "library")
2. **One-line vision** — from `.specs/project.md` if exists (first sentence of the Vision section), or from CLAUDE.md, or inferred from Phase 1
3. **Constraints** — from `.specs/project.md` or `.specs/constitution.md` if exists. Extract:
   - Scale signals: "single-user", "multi-tenant", "high-traffic", etc.
   - Boundary signals: "local-only", "no auth", "no cloud", "no server", etc.
   - Dependency signals: "minimal deps", "zero deps", etc.
4. **Domain terms** — from `.specs/project.md`, `.specs/roadmap.md`, or CLAUDE.md. Extract 3-6 domain nouns that represent the project's core concepts (e.g., `Task`, `CronExpression`, `History` for a cron manager)
5. **Exclusions** — derive from constraints:

| Constraint | Exclude from architecture |
|---|---|
| "single-user", "local-only" | `multi-tenant`, `rate-limiting` |
| "no auth", "no login" | `auth-flows` |
| "no server", "no cloud" | cloud-specific patterns |
| "no database", "flat file" | `database-migrations` (unless file contains migration logic) |

Exclusions remove patterns from the architecture agent's scope. They do NOT prevent detection — if a pattern was detected in Phase 2, the exclusion overrides it at synthesis time.

The context block format injected into each agent prompt (omit empty lines):

```
Project: {name} — {project type}
Vision: {one-line vision}                              ← from specs/CLAUDE.md, omit if unavailable
Constraints: {comma-separated constraints}             ← from specs, omit if unavailable
Exclude: {comma-separated excluded architecture patterns} ← derived from constraints, omit if none
Domain terms: {comma-separated terms for examples}     ← from specs/roadmap, omit if unavailable
```

#### 4.1 Dispatch ai-res-librarian agents per category

Dispatch one `ai-res-librarian` agent per detected category, **in parallel**. Each agent reads the relevant source files and produces a **synthesized section** — not a copy.

| Category | Agent prompt | Sources read by agent |
|---|---|---|
| code | "Synthesize coding conventions for a [language] project. {context block}. Extract only essential rules: naming, types, imports, error handling, async, testing, logging, architecture layers, security. When providing do/don't examples, use domain terms from this project (e.g., {domain terms}). Format: imperative rules, no prose, do/don't examples only when ambiguous. Budget: {N} lines ({primary\|secondary})." | `code-conventions/*.md` (language deltas: general, architecture, logging, testing, javascript, etc.) |
| frameworks | "Synthesize framework conventions for: [detected frameworks]. {context block}. Extract key rules, anti-patterns, composition patterns, and critical configuration. Format: imperative rules per framework, do/don't examples for non-obvious rules. Budget: {N} lines ({primary\|secondary})." | `code-conventions/*.md` (framework deltas: react, nextjs, shadcn, tailwind, cloudflare, tanstack, drizzle, prisma, remotion — only detected ones) |
| architecture | "Synthesize architecture patterns for: [detected patterns]. {context block}. Exclude these patterns (not relevant to project constraints): {exclusions}. Extract key rules, constraints, and patterns for remaining items only. Format: imperative rules per pattern. Budget: {N} lines ({primary\|secondary})." | `architecture/*.md` (matched ones, minus excluded) |
| stack | "Synthesize stack reference for: [detected stack]. {context block}. Extract essential setup, gotchas, and best practices for each. Format: imperative rules. Budget: {N} lines ({primary\|secondary})." | `stack-ref/**/*.md` (matched ones) |
| design | "Synthesize design conventions for a [project type]. {context block}. Extract key rules: spacing, typography, colors, component patterns, accessibility. Format: imperative rules. Budget: {N} lines ({primary\|secondary})." | `design/**/*.md` (relevant ones) |
| copywriting | "Synthesize copywriting conventions for: [detected needs]. {context block}. Format: imperative rules. Budget: {N} lines ({primary\|secondary})." | `copywriting/*.md` (relevant ones) |
| config | "Extract expected configuration defaults for a {runtime} {language} project. {context block}. Include: compiler/runtime config (tsconfig, bunfig, etc.), package manager expectations, editor config, gitignore patterns. Format: imperative rules grouped by config file. Budget: {N} lines (secondary)." | `code-conventions/runtime-configs.md` |
| diagrams | "Synthesize diagram conventions. {context block}. Format: imperative rules. Budget: {N} lines (secondary)." | `conventions/diagrams.md` |

**Agent instructions for synthesis quality:**
- Produce output equivalent to what `ai-res-librarian` would return for the same question
- Rules in imperative form: "Use X", "Never Y", "Prefer Z over W"
- No prose, no explanations of why — just the rules
- `do:`/`don't:` inline examples only when the rule is ambiguous — use project domain terms from the context block
- Each `##` section must start with a `> Covers:` line listing keywords
- The entire file must stay under **400 lines** (hard limit)

#### Budget allocation

Each category is classified as **primary** or **secondary** based on the project type detected in Phase 1.4:

| Project type | Primary categories (60-100 lines) | Secondary categories (15-40 lines) |
|---|---|---|
| CLI | code, design | architecture, stack, config, diagrams |
| Web app | code, design, frameworks | architecture, stack, config, diagrams |
| API / backend | code, architecture | stack, frameworks, config, diagrams |
| Library / SDK | code | architecture, config, diagrams |
| Dashboard / admin | code, design, frameworks | architecture, stack, config, diagrams |
| Default | code | all others |

- **Primary**: 60-100 lines — full rules, examples for ambiguous cases, do/don't blocks
- **Secondary**: 15-40 lines — essential rules only, no examples unless critical
- A category with 0 detected files gets 0 lines (omitted entirely)
- If the sum exceeds 400 lines, compress secondary categories first
- Include the budget in each agent prompt: "Budget: {N} lines (primary)" or "Budget: {N} lines (secondary)"

#### 4.2 Assemble the single file

Combine all agent outputs into `.conventions/conventions.md` with this structure:

```yaml
---
project: {directory name}
generated: {ISO 8601 date YYYY-MM-DD}
source: ~/projects/ai-ressources
categories:
  - code
  - frameworks
  - architecture
  - stack
  - design
  - config
  - diagrams
---

# Conventions — {project name}

{output of code agent}

{output of frameworks agent}

{output of architecture agent}

{output of stack agent}

{output of design agent}

{output of config agent}

{output of diagrams agent}
```

Each category section uses `##` headings. Subsections use `###`. The `> Covers:` line on each `##` enables fast scanning.

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

### Completion

Display:
```
.conventions/conventions.md generated — {N} categories, {L} lines
Config audit: {X} fixed, {Y} created, {Z} skipped
```

## Rules

- Never write secrets or sensitive data in generated files
- Scan `stack-ref/`, `architecture/`, `design/`, `copywriting/` dynamically — never hardcode the file list
- The output file must stay under **400 lines** — this is a hard budget
- For design/components, only include components relevant to the project
- If a source file does not exist in ai-ressources, skip it and warn
- The synthesized content must be equivalent to what `ai-res-librarian` would produce
