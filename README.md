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

### Local usage with Claude Code on macOS

#### 1. Clone the repository

```bash
git clone https://github.com/julien-m/ai-ressources.git ~/projects/ai-ressources
```

#### 2. Point the `/ai-res` skill at your local path

Open `claude/skills/ai-res/SKILL.md` and update the `Base path` to match your clone location:

```
## Base path

/Users/<your-username>/projects/ai-ressources/
```

Then link the skill globally via `cc-hub`:

```bash
cc-hub skill link claude/skills/ai-res/SKILL.md
```

#### 3. Link the coding rules globally

```bash
cc-hub rule link claude/rules/code.md
cc-hub rule link claude/rules/diagrams.md
```

After this, Claude Code will automatically load your coding conventions whenever it starts a coding task.

#### 4. Refreshing indexes

When you pull updates or add new files, the indexes (`index.yaml`) are updated in the same commit. No manual refresh is needed — Claude Code re-reads the index on each `/ai-res` invocation.

To verify all indexes are schema-valid after a pull:

```bash
pip install check-jsonschema  # one-time
check-jsonschema --schemafile schemas/root-index.schema.yaml index.yaml
```

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for instructions on adding resources, updating indexes, and keeping the repository consistent.
