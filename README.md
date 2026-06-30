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

Each domain contains an `index.yaml` that describes its files and structure. The root `index.yaml` lists all domains with their status (complete, placeholder, partial). `compiled-index.txt` provides a flat routing index generated from those files.

### Direct browsing

Browse files directly or point an AI coding assistant at the relevant section for context-aware recommendations.

## Conventions Lifecycle

### `/conventions-init`

Analyzes the project stack and generates:
- `.conventions/` — compiled convention files from this knowledge base
- `.githooks/pre-commit` — pre-commit hook with stack-adapted lint commands
- `.github/workflows/` — CI pipelines (CI, security, CodeQL)
- `.github/dependabot.yml` — Dependabot updates for npm-based stacks
- Config audit — validates tsconfig.json, biome.json, .gitignore, etc.

Stack detection uses `code-conventions/stack-commands.md` to map marker files (tsconfig.json, Cargo.toml, go.mod, etc.) to the appropriate lint commands and CI templates.

Security workflows are opt-in by profile:
- `--security baseline` (default): Gitleaks + Trivy filesystem scan.
- `--security production`: baseline plus stack-specific SAST/SCA where templates exist.
- `--security public`: production profile plus public-repo CodeQL/Dependabot posture.
- `--security web-staging`: production web profile plus Nuclei/ZAP DAST against `secrets.STAGING_URL`.
- `--security none`: no security workflow for experiments or local-only repos.

Use `$security-hardening --profile <profile>` in Codex or `/security-hardening --profile <profile>` in Claude Code on an existing conventions-enabled project to apply or change only the security posture.

### `/conventions-refresh`

Incrementally updates materialized conventions when the knowledge base changes:
- **Conventions**: date-based staleness detection from `.last-updated`
- **Hooks/CI/security**: marker/profile-based stack change detection — regenerates if the stack or security profile evolved

Use `--full` to force a complete re-detection and rebuild. Use `--security keep|none|baseline|production|public|web-staging` to preserve or change security hardening.
