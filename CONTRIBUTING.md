# Contributing to ai-ressources

This knowledge base is structured for human and AI-agent consumption. This guide explains how to add or update content and keep the repository consistent.

## Table of contents

- [Adding a new resource](#adding-a-new-resource)
- [Updating an existing resource](#updating-an-existing-resource)
- [Keeping indexes up to date](#keeping-indexes-up-to-date)
- [File naming and structure](#file-naming-and-structure)
- [Rule precedence / authority](#rule-precedence--authority)
- [Portable assets](#portable-assets)
- [Validation and CI](#validation-and-ci)
- [Releases and provenance](#releases-and-provenance)

---

## Adding a new resource

### 1. Choose the right domain

| Domain | What belongs here |
|--------|------------------|
| `architecture/` | SaaS architectural patterns (auth flows, multi-tenant, caching, etc.) |
| `code-conventions/` | Language-agnostic or language-specific coding standards |
| `conventions/` | Cross-cutting meta-conventions (diagrams, naming, doc structure) |
| `copywriting/` | Marketing copy templates (landing pages, emails, taglines) |
| `design/` | Design tokens, platform systems (HIG/M3/Web), components, quality rules |
| `legal/` | Legal templates (CGU, RGPD, merchant of record) |
| `pricing-models/` | SaaS pricing model references |
| `seo/` | SEO guides (Core Web Vitals, programmatic SEO, Next.js) |
| `stack-ref/` | Vendor comparison sheets |

### 2. Create the file

- **stack-ref entries:** copy `stack-ref/_templates/_template.md` and fill every section.
- **design components:** copy `templates/design-component.md` and fill every section.
- **Other entries:** follow the structure of existing files in the same domain.

All files must be in **English**. **Read** [`code-conventions/general.md`](code-conventions/general.md) for the repository-wide language and documentation rules.

### 3. Update the domain `index.yaml`

Every domain has an `index.yaml`. After creating a file, add an entry to it:

**Flat format** (used by `architecture/`, `code-conventions/`, `conventions/`, `copywriting/`, `legal/`, `pricing-models/`, `seo/`):

```yaml
files:
  - file: new-file.md
    description: "One-line summary of content"
    status: complete  # complete | active | partial | placeholder
```

**Sectioned format** (used by `design/`, `stack-ref/`): add the file under the appropriate section:

```yaml
sections:
  <section-name>:
    description: "Section description"
    files:
      - file: <sub-path>/new-file.md
        description: "One-line summary"
```

### 4. Update the root `index.yaml`

If the `file_count` for the domain changes, update it in the root `index.yaml`.

---

## Updating an existing resource

1. Edit the file directly.
2. If you add or remove major topics, update the `description` field in the domain `index.yaml`.
3. If you add or remove entire files, follow the index update rules above.
4. For `stack-ref/` vendor sheets: update `last_updated` and lower `confidence` to `medium` if any section is uncertain.

---

## Keeping indexes up to date

Indexes are the "table of contents" that Claude Code reads first. Stale indexes mislead the agent.

**Rules:**
- Never leave an index entry pointing to a file that does not exist.
- Never leave a real file unindexed (it will be invisible to `/ai-res`).
- The `status` field should reflect actual completeness (`placeholder` = file exists but is empty).
- The root `index.yaml` `file_count` must match the actual number of content files (excluding `index.yaml` itself).

---

## File naming and structure

- **File names:** `kebab-case.md` (lowercase, hyphen-separated).
- **Directories:** `kebab-case/` (lowercase, hyphen-separated).
- **Encoding:** UTF-8, LF line endings, no trailing whitespace (enforced by `.editorconfig`).
- **YAML indentation:** 2 spaces.
- **Markdown:** follow the rules in `.markdownlint.yaml`.

---

## Rule precedence / authority

When multiple documents address the same topic, the following priority applies (highest first):

1. **Project instructions** — [`AGENTS.md`](AGENTS.md) and provider-generated project rules define repository maintenance behavior.
2. **Portable dispatcher rules** — [`.agent-sync/rules/`](.agent-sync/rules/) define how consumers load conventions.
3. **`code-conventions/general.md`** — shared rules for all languages.
4. **Cross-cutting and language/runtime deltas** — architecture, logging, testing, and language-specific files refine the foundation.
5. **Domain references** — `design/`, `architecture/`, and `stack-ref/` are authoritative within their domains.

If two rules conflict, the higher-priority source wins. Document the conflict resolution in the relevant convention file.

---

## Portable assets

Canonical global skills and rules live under [`.agent-sync/`](.agent-sync/). Never create or edit a provider-specific global target as the source of truth.

After modifying a global skill, synchronize its canonical directory:

```bash
cc-hub skill link .agent-sync/skills/<name> --scope global --targets all --force
```

After modifying a global rule, synchronize its canonical file:

```bash
cc-hub rule link .agent-sync/rules/<name>.md --scope global --targets all --force
```

`cc-hub` is a maintainer convenience and is not required for contributors who only edit or consume the knowledge base. Provider outputs under `.claude/` or `.agents/` are generated/local state; do not edit them as canonical sources.

---

## Validation and CI

CI runs on pushes to `main` and pull requests. It validates:

- Bun tests, index reproducibility, and `setup.sh` syntax.
- Root and domain `index.yaml` files against the schemas in [`schemas/`](schemas/).
- Scheduled and pull-request security workflows configure secret, dependency, and filesystem checks; a configured workflow is not evidence of a completed scan.

To run locally before pushing:

```bash
bun test
bun run scripts/build-index.ts
bash -n setup.sh
git diff --check
```

The CI schema job installs `check-jsonschema` and validates [`index.yaml`](index.yaml) plus every domain index against [`schemas/root-index.schema.yaml`](schemas/root-index.schema.yaml) and [`schemas/domain-index.schema.yaml`](schemas/domain-index.schema.yaml).

## Releases and provenance

- `main` is the maintained source. Tags may identify stable knowledge-base snapshots; there is no package-registry release.
- Keep [`README.md`](README.md), indexes, `compiled-index.txt`, and `.last-updated` synchronized with relevant changes.
- Record copied or adapted material in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) with an authoritative source, immutable revision, affected files, and required license text.
- Do not add material when rights or provenance cannot be established; replace it with independently authored content instead.
