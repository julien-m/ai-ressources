# Contributing to ai-ressources

This knowledge base is structured for human and AI-agent consumption. This guide explains how to add or update content and keep the repository consistent.

## Table of contents

- [Adding a new resource](#adding-a-new-resource)
- [Updating an existing resource](#updating-an-existing-resource)
- [Keeping indexes up to date](#keeping-indexes-up-to-date)
- [File naming and structure](#file-naming-and-structure)
- [Rule precedence / authority](#rule-precedence--authority)
- [Claude Code assets (rules and skills)](#claude-code-assets-rules-and-skills)
- [Validation and CI](#validation-and-ci)

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

All files must be in **English** (rule enforced by `claude/rules/code.md`).

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

1. **`claude/rules/code.md`** — the primary dispatcher for coding tasks. It defines load order and applies to all coding work.
2. **`code-conventions/general.md`** — shared rules for all languages; always loaded.
3. **`code-conventions/architecture.md`**, **`logging.md`**, **`testing.md`** — cross-cutting rules; always loaded after general.
4. **Language-specific delta** (e.g. `javascript.md`, `go.md`) — overrides `general.md` for language-specific choices.
5. **Domain references** (`design/`, `architecture/`, `stack-ref/`) — authoritative for their domain; do not override code conventions.

If two rules conflict, the higher-priority source wins. Document the conflict resolution in the relevant convention file.

---

## Claude Code assets (rules and skills)

### Project rules (`.claude/rules/`)

Files in `.claude/rules/` are **Claude Code project rules** — they are loaded automatically whenever Claude Code opens this repository. They describe meta-level behavior (how to keep indexes in sync, how to sync assets to the global Claude Code hub).

Do **not** put coding conventions in `.claude/rules/`. Those belong in `claude/rules/`.

### Global rules and skills (`claude/rules/`, `claude/skills/`)

Files in `claude/rules/` and `claude/skills/` are designed to be linked globally via `cc-hub`:

```bash
# Link a rule globally
cc-hub rule link claude/rules/<name>.md

# Link a skill globally
cc-hub skill link claude/skills/<name>/SKILL.md
```

After creating or modifying an asset in `claude/`, run the appropriate `cc-hub` command to sync it. See `.claude/rules/sync-claude-assets.md` for details.

### Modifying the `/ai-res` skill

The `/ai-res` skill base path (`claude/skills/ai-res/SKILL.md`) must point to your local clone of this repository. Update the `Base path` section if you move or rename the directory.

---

## Validation and CI

CI runs on every push and pull request. It validates:

1. **YAML lint** (`yamllint`) — all `.yaml` and `.yml` files.
2. **Markdown lint** (`markdownlint`) — all `.md` files.
3. **Schema validation** (`check-jsonschema`) — `index.yaml` (root and all domains) against their JSON Schemas in `schemas/`.

To run locally before pushing:

```bash
# Install tools (one-time)
pip install yamllint check-jsonschema
npm install -g markdownlint-cli2

# Lint YAML
yamllint -c .yamllint.yaml $(find . -name '*.yaml' -o -name '*.yml' | grep -v '.git/')

# Lint Markdown
markdownlint-cli2 --config .markdownlint.yaml "**/*.md"

# Validate root index schema
check-jsonschema --schemafile schemas/root-index.schema.yaml index.yaml

# Validate domain index schemas
for f in architecture/index.yaml code-conventions/index.yaml conventions/index.yaml \
          copywriting/index.yaml legal/index.yaml pricing-models/index.yaml seo/index.yaml \
          design/index.yaml stack-ref/index.yaml; do
  check-jsonschema --schemafile schemas/domain-index.schema.yaml "$f"
done
```

Schemas are documented in `schemas/root-index.schema.yaml` and `schemas/domain-index.schema.yaml`.
