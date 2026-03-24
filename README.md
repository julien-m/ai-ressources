# ai-ressources

Reference knowledge base for building cross-platform SaaS applications. Designed to be consumed by humans and AI agents alike.

## Setup

### Prerequisites

- [cc-hub](https://github.com/julien-m/cc-hub) — Global AI CLI for linking Claude Code assets, LLM queries, image/video generation, and more

### Install

```bash
git clone <repo-url> ~/projects/ai-ressources
cd ~/projects/ai-ressources
chmod +x setup.sh
./setup.sh
```

The setup script:
1. Checks that `cc-hub` is installed
2. Sets `AI_RESOURCES_PATH` in your `.zshrc` (pointing to the project directory)
3. Links all Claude Code skills and rules via `cc-hub`

After setup, restart your shell or run `source ~/.zshrc`.

## Structure

```
architecture/      → Auth flows, multi-tenant, rate limiting, webhook patterns
claude/            → Claude Code skills and rules (synced to ~/.claude/ via cc-hub)
code-conventions/  → Language-agnostic and per-language coding standards
conventions/       → Transversal conventions (naming, authority, diagrams)
copywriting/       → Landing pages, email sequences, taglines
design/            → Design tokens, platform systems (HIG, M3, Web), components
legal/             → CGU, CGV, RGPD, privacy, cookies, mentions légales, MoR
pricing-models/    → Freemium, flat-rate, per-seat, usage-based
seo/               → Core Web Vitals, programmatic SEO, Next.js technical SEO
stack-ref/         → Vendor comparison sheets (auth, DB, email, payments, platforms, etc.)
```

> **Note:** `claude/` contains skills and rules that are symlinked into `~/.claude/` by `cc-hub`. They are not knowledge base content — they define how Claude Code discovers and loads the knowledge base.

## Code Conventions

Language-agnostic and per-language coding standards loaded by the `claude/rules/code.md` dispatcher:

- **general** — shared rules for all languages (types, naming, testing, errors, etc.)
- **architecture** — layers, boundaries, dependency direction, DI, events
- **logging** — structured logging, sensitive data redaction, compliance
- **javascript** — TypeScript/Node.js/React conventions
- **go** — Go-specific patterns and tooling
- **rust** — Rust idioms, ownership, error handling
- **delphi** — Delphi/Pascal memory management and style
- **swift-kotlin** — iOS/Android native conventions
- **database** — SQL, schema design, migrations, query safety

## Design Section

Cross-platform design reference covering iOS (HIG), Android (Material 3), and Web:

- **Tokens** — spacing, typography, colors, cross-platform unit mapping
- **Systems** — Apple HIG, Material Design 3, Web standards quick references
- **Components** — forms, lists, modals with per-platform specs
- **Quality** — UI visual non-regression rules

## Stack Reference

Vendor comparison sheets with a consistent template: pricing, DX, limits, best-for, and verdict. Covers auth, databases, email, payments, platforms, jobs, search, storage, AI, CMS, and frontend.

## Usage

### `/ai-res` skill

The `/ai-res` skill provides structured, on-demand access to any domain:

```
/ai-res              → list all domains
/ai-res design       → load design domain index, pick relevant files
/ai-res stack        → alias for stack-ref
/ai-res code         → alias for code-conventions
/ai-res pricing      → alias for pricing-models
```

Each domain contains an `index.yaml` that describes its files and structure. The root `index.yaml` lists all domains with their status (complete, placeholder, partial).

### Direct browsing

Browse files directly or point an AI coding assistant at the relevant section for context-aware recommendations.
