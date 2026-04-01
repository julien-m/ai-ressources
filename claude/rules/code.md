# Code Conventions — Dispatcher

**These rules apply only when the task involves writing or modifying code.** Do not load the files below for non-coding tasks (questions, code review, documentation, research, configuration edits).

Before coding, always load the shared rules first, then cross-cutting rules, then the language-specific delta:

1. **Always load** [`general.md`](../../code-conventions/general.md) first (shared rules for all languages)
2. **Always load** [`architecture.md`](../../code-conventions/architecture.md) (cross-cutting architectural rules)
3. **Always load** [`logging.md`](../../code-conventions/logging.md) (cross-cutting logging and sensitive data rules)
4. **Always load** [`testing.md`](../../code-conventions/testing.md) (cross-cutting testing conventions)
5. Then load the language-specific file:

- **JavaScript / TypeScript** → **Read** [`javascript.md`](../../code-conventions/javascript.md)
- **Delphi / Pascal** → **Read** [`delphi.md`](../../code-conventions/delphi.md)
- **Go** → **Read** [`go.md`](../../code-conventions/go.md)
- **Rust** → **Read** [`rust.md`](../../code-conventions/rust.md)
- **Swift / Kotlin** → **Read** [`swift-kotlin.md`](../../code-conventions/swift-kotlin.md)
- **SQL / Database** → **Read** [`database.md`](../../code-conventions/database.md)
- **Any other language** → [`general.md`](../../code-conventions/general.md) + [`architecture.md`](../../code-conventions/architecture.md) is sufficient

6. Then load applicable framework deltas (detect from imports, config files, or project context):

- **React** (`useState`, `useEffect`, JSX) → **Read** [`react.md`](../../code-conventions/react.md)
- **Next.js** (`next.config`, `app/` dir, `'use server'`) → **Read** [`nextjs.md`](../../code-conventions/nextjs.md)
- **shadcn/ui** (`@/components/ui/`, shadcn CLI) → **Read** [`shadcn.md`](../../code-conventions/shadcn.md)
- **Tailwind CSS** (`tailwind.config`, `@tailwindcss/`) → **Read** [`tailwind.md`](../../code-conventions/tailwind.md)
- **Cloudflare Workers** (`wrangler.toml`, `@cloudflare/`, Hono) → **Read** [`cloudflare.md`](../../code-conventions/cloudflare.md)
- **TanStack** (`@tanstack/react-query`, `@tanstack/react-router`, `@tanstack/react-start`) → **Read** [`tanstack.md`](../../code-conventions/tanstack.md)
- **Drizzle ORM** (`drizzle.config`, `drizzle-orm`) → **Read** [`drizzle.md`](../../code-conventions/drizzle.md)
- **Prisma** (`prisma/schema.prisma`, `@prisma/client`) → **Read** [`prisma.md`](../../code-conventions/prisma.md)
- **Astro** (`astro.config`, `.astro` files, `client:*` directives) → **Read** [`astro.md`](../../code-conventions/astro.md)
- **CLI** (`commander`, `parseArgs`, `ink`, `bin` field, `#!/usr/bin/env node`) → **Read** [`cli.md`](../../code-conventions/cli.md)
- **Remotion** (`remotion.config`, `<Composition>`, `useCurrentFrame`) → **Read** [`remotion.md`](../../code-conventions/remotion.md)

All paths are relative to this file's location (`claude/rules/`).

Always load files **before** starting to code. If the task spans multiple domains (e.g. TypeScript + SQL), load all relevant files.

Load order: [`general.md`](../../code-conventions/general.md) → [`architecture.md`](../../code-conventions/architecture.md) → [`logging.md`](../../code-conventions/logging.md) → [`testing.md`](../../code-conventions/testing.md) → language delta → framework deltas (if applicable) → [`database.md`](../../code-conventions/database.md) (if applicable).

## Design conventions

When the task involves frontend or UI work, also load the relevant design reference:

- **iOS** → **Read** [`apple-hig.md`](../../design/systems/apple-hig.md) + [`spacing.md`](../../design/tokens/spacing.md), [`typography.md`](../../design/tokens/typography.md), [`colors.md`](../../design/tokens/colors.md)
- **Android** → **Read** [`material-design.md`](../../design/systems/material-design.md) + [`spacing.md`](../../design/tokens/spacing.md), [`typography.md`](../../design/tokens/typography.md), [`colors.md`](../../design/tokens/colors.md)
- **Web** → **Read** [`web-standards.md`](../../design/systems/web-standards.md) + [`spacing.md`](../../design/tokens/spacing.md), [`typography.md`](../../design/tokens/typography.md), [`colors.md`](../../design/tokens/colors.md)
- **Cross-platform** → **Read** [`cross-platform.md`](../../design/tokens/cross-platform.md) + relevant [`components/`](../../design/components/) files

Component references (load when relevant): [`forms.md`](../../design/components/forms.md), [`lists.md`](../../design/components/lists.md), [`modals.md`](../../design/components/modals.md)

When the task involves **design maquettage** (generating mockups in Pencil, Figma, or any tool without built-in design system components), also load:
- **Read** [`mockup-specs.md`](../../design/references/mockup-specs.md) — explicit px values for component heights, paddings, icon sizes, modal anatomy, mobile translations, overlays, and layout composition patterns. **Do not use these values in code** — use design system components instead.

## Display rule

This rule is subject to the same guard clause as the rest of this file: **do not display anything for non-coding tasks.**

After loading the convention files, **always** display the following confirmation block before starting to code:

```
⚙ Code Conventions Loaded
  ✓ general
  ✓ architecture
  ✓ logging
  ✓ testing
  ✓ <language delta>
  ✓ <framework deltas> (if loaded)
  ✓ database (if loaded)
  ✓ design/<system> (if loaded)
```

Only list files that were actually loaded. Use the short name (without `.md` extension).

## Cross-cutting rule

**All code, comments, and documentation must be written in English.** This includes: variable names, functions, classes, types, error messages, inline comments, doc comments, and technical README files.
