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

### Completion

Display:
```
.conventions/conventions.md generated — {N} categories, {L} lines
```

## Rules

- Never write secrets or sensitive data in generated files
- Scan `stack-ref/`, `architecture/`, `design/`, `copywriting/` dynamically — never hardcode the file list
- The output file must stay under **400 lines** — this is a hard budget
- For design/components, only include components relevant to the project
- If a source file does not exist in ai-ressources, skip it and warn
- The synthesized content must be equivalent to what `ai-res-librarian` would produce
