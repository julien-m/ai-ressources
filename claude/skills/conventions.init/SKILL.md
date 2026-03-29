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

#### Spec-aware detection (merges with channels above)

If step 0 extracted layers from `.specs/stacks/_default.md`, map each layer's choice value to convention domains:

| Choice value contains (case-insensitive) | Treated as |
|---|---|
| `typescript`, `javascript` | `.ts`/`.js` extension detected (Channel 1) |
| `go` | `.go` extension detected (Channel 1) |
| `rust` | `.rs` extension detected (Channel 1) |
| `swift`, `kotlin` | `.swift`/`.kt` extension detected (Channel 1) |
| `delphi`, `pascal` | `.pas` extension detected (Channel 1) |
| `next.js`, `next` | `next` dependency detected (Channel 1b) |
| `react` | `react` dependency detected (Channel 1b) |
| `tailwind` | `tailwindcss` dependency detected (Channel 1b) |
| `shadcn` | `@shadcn/ui` dependency detected (Channel 1b) |
| `cloudflare`, `hono`, `workers` | `wrangler.toml` detected (Channel 1b) |
| `tanstack` | `@tanstack/*` dependency detected (Channel 1b) |
| `drizzle` | `drizzle-orm` dependency detected (Channel 1b) |
| `prisma` | `@prisma/client` dependency detected (Channel 1b) |
| `remotion` | `remotion` dependency detected (Channel 1b) |
| `postgresql`, `sqlite`, `mysql` | `.sql` extension detected (Channel 1) |
| `supabase`, `stripe`, `redis`, etc. | Package name for Channel 2 lookup |

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

#### 4.1 Dispatch ai-res-librarian agents per category

Dispatch one `ai-res-librarian` agent per detected category, **in parallel**. Each agent reads the relevant source files and produces a **synthesized section** — not a copy.

| Category | Agent prompt | Sources read by agent |
|---|---|---|
| code | "Synthesize coding conventions for a [language] project. Extract only essential rules: naming, types, imports, error handling, async, testing, logging, architecture layers, security. Format: imperative rules, no prose, do/don't examples only when ambiguous." | `code-conventions/*.md` (language deltas: general, architecture, logging, testing, javascript, etc.) |
| frameworks | "Synthesize framework conventions for: [detected frameworks]. Extract key rules, anti-patterns, composition patterns, and critical configuration. Format: imperative rules per framework, do/don't examples for non-obvious rules." | `code-conventions/*.md` (framework deltas: react, nextjs, shadcn, tailwind, cloudflare, tanstack, drizzle, prisma, remotion — only detected ones) |
| architecture | "Synthesize architecture patterns for: [detected patterns]. Extract key rules, constraints, and patterns. Format: imperative rules per pattern." | `architecture/*.md` (matched ones) |
| stack | "Synthesize stack reference for: [detected stack]. Extract essential setup, gotchas, and best practices for each. Format: imperative rules." | `stack-ref/**/*.md` (matched ones) |
| design | "Synthesize design conventions for a [project type]. Extract key rules: spacing, typography, colors, component patterns, accessibility. Format: imperative rules." | `design/**/*.md` (relevant ones) |
| copywriting | "Synthesize copywriting conventions for: [detected needs]. Format: imperative rules." | `copywriting/*.md` (relevant ones) |
| diagrams | "Synthesize diagram conventions. Format: imperative rules." | `conventions/diagrams.md` |

**Agent instructions for synthesis quality:**
- Produce output equivalent to what `ai-res-librarian` would return for the same question
- Rules in imperative form: "Use X", "Never Y", "Prefer Z over W"
- No prose, no explanations of why — just the rules
- `do:`/`don't:` inline examples only when the rule is ambiguous
- Each `##` section must start with a `> Covers:` line listing keywords
- Budget: each category section should be **30-80 lines** — the entire file must stay under **400 lines**

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
  - diagrams
---

# Conventions — {project name}

{output of code agent}

{output of frameworks agent}

{output of architecture agent}

{output of stack agent}

{output of design agent}

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
