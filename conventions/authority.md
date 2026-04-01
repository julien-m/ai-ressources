# Convention Authority & Conflict Resolution

## Hierarchy

Conventions are layered. When two rules conflict, the **more specific level wins** — except for non-overridable rules.

```
Level 1 — Foundations (all languages)
  code-conventions/general.md

Level 2 — Cross-cutting
  code-conventions/architecture.md
  code-conventions/logging.md
  code-conventions/testing.md
  code-conventions/database.md

Level 3 — Language delta (overrides Level 1-2 for that language)
  code-conventions/javascript.md
  code-conventions/go.md
  code-conventions/rust.md
  code-conventions/swift-kotlin.md
  code-conventions/delphi.md

Level 3.5 — Framework/runtime delta (overrides Level 1-3 for framework-specific concerns)
  code-conventions/react.md
  code-conventions/nextjs.md
  code-conventions/tailwind.md
  code-conventions/shadcn.md
  code-conventions/cloudflare.md
  code-conventions/tanstack.md
  code-conventions/prisma.md
  code-conventions/drizzle.md
  code-conventions/astro.md
  code-conventions/cli.md
  code-conventions/remotion.md

Level 4 — Project local (highest override authority)
  CONVENTIONS.md in the target project (if it exists)
```

## Conflict Resolution Rule

The most specific level wins: Level 3.5 overrides Level 3, Level 4 overrides all.
Framework deltas (Level 3.5) override language and cross-cutting rules only for concerns within the framework's domain (e.g., Next.js file structure overrides general structure rules for Next.js projects).

**Exception — non-overridable rules** (apply regardless of level):

| Rule | Source | Why |
|------|--------|-----|
| All code in English | `general.md` | Cross-platform consistency |
| Never log PII/secrets | `logging.md` | Security / compliance |
| Validate external input at boundaries | `general.md` | Security |
| No `any` in TypeScript without justification | `javascript.md` | Type safety |

## Design Convention Authority

| Context | Primary source | Tokens |
|---------|---------------|--------|
| iOS | `design/systems/apple-hig.md` | `spacing.md`, `typography.md`, `colors.md` |
| Android | `design/systems/material-design.md` | `spacing.md`, `typography.md`, `colors.md` |
| Web | `design/systems/web-standards.md` | `spacing.md`, `typography.md`, `colors.md` |
| Cross-platform | `design/tokens/cross-platform.md` | Relevant component files |
| Mockup/maquettage | `design/references/mockup-specs.md` | Design tools only, never code |

When a design system rule (e.g., HIG) conflicts with a design token, the **platform system** wins.
