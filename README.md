# ai-ressources

Reference knowledge base for building cross-platform SaaS applications. Designed to be consumed by humans and AI agents alike.

## Structure

```
architecture/      → Auth flows, multi-tenant, rate limiting, webhook patterns
claude/            → Claude Code mechanics (rules dispatcher, skills)
code-conventions/  → Language-agnostic and per-language coding standards
copywriting/       → Landing pages, email sequences, taglines
design/            → Design tokens, platform systems (HIG, M3, Web), components
legal/             → CGU, RGPD, mentions légales, merchant of record
pricing-models/    → Freemium, flat-rate, per-seat, usage-based
seo/               → Core Web Vitals, programmatic SEO, Next.js technical SEO
stack-ref/         → Vendor comparison sheets (auth, DB, email, payments, platforms, etc.)
```

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

Browse files directly or point an AI coding assistant at the relevant section for context-aware recommendations.
