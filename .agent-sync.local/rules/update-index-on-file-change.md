# Update Index on File Change

After every file creation, deletion, rename, or **modification** in this project, update the relevant `index.yaml` immediately.

## How to find the index

The index is not always in the same directory as the changed file. Search in this order:

1. **Same directory** as the changed file (`index.yaml`, `index.md`)
2. **Parent directory** — the index may be centralized one level up (e.g. `design/index.yaml` indexes `design/references/`, `design/components/`, etc.)
3. **Ancestor directories** — keep going up until the project root

Stop at the first index found that references files in the affected directory.

## What to update

### On creation, deletion, or rename

- **files list**: add/remove the entry for the created/deleted/renamed file
- **description**: add/remove references if the file introduces or removes a topic
- **file_count**: adjust the count for the affected section if present

### On any change (including modification)

- **last_reviewed**: set to today's date (`YYYY-MM-DD`) on the domain entry in the **root `index.yaml`** that owns the affected file. This tracks when a domain was last touched.

## Compiled index

After **any** of these events, regenerate the compiled index:

- Creation, deletion, or rename of a `.md` file in the knowledge base
- Modification of any `index.yaml` (adding, removing, or changing file entries)
- Modification of a file's `description`, `use_when`, or `questions_answered` in an `index.yaml`

```bash
bun run scripts/build-index.ts
```

This keeps `compiled-index.txt` in sync with the domain indexes. The compiled index is used by the `ai-res-librarian` agent for fast routing. **A stale compiled index means the agent cannot find newly added files.**

This step must happen **in the same pass** as the index.yaml update — never defer it.

## Last-updated marker

After any `.md` file change in a **domain directory indexed in the root `index.yaml`** (architecture, code-conventions, conventions, copywriting, design, legal, pricing-models, seo, stack-ref, templates), update the global last-updated marker:

```bash
date +%Y-%m-%d > .last-updated
```

This marker is read by `/conventions-refresh` in other projects to detect when the knowledge base has changed. It must be updated **in the same pass** as the index.yaml update.

## Schema sync

When adding a **new property** to any `index.yaml`, update the matching schema before committing:

**Read** [`root-index.schema.yaml`](../../schemas/root-index.schema.yaml):
- Top-level property (e.g. `domains`) → `properties:`
- Domain property (e.g. `last_reviewed`, `subdirectories`) → `properties.domains.additionalProperties.properties:`
- Domain `status` value → `properties.domains.additionalProperties.properties.status.enum`

**Read** [`domain-index.schema.yaml`](../../schemas/domain-index.schema.yaml):
- Root-level property (e.g. `coverage`, `frameworks`) → `properties:`
- File-entry property (e.g. `applies_to`, `priority`) → `$defs.file-entry.properties:`
- File-entry `status` value → `$defs.file-entry.properties.status.enum`
- Section property → `$defs.section.properties:`

Both schemas use `additionalProperties: false` — any unregistered property will fail CI.

Validate locally after updating:

```bash
check-jsonschema --schemafile schemas/root-index.schema.yaml index.yaml
check-jsonschema --schemafile schemas/domain-index.schema.yaml <domain>/index.yaml
```

## Rules

- Never wait for the user to notice a stale index — sync it in the same pass as the file operation.
- If no index exists anywhere in the ancestry, do nothing — don't create one unprompted.
- Update `last_reviewed` even for content-only edits — the date reflects the last time a human or agent verified the domain.
- Always update `.last-updated` when a domain `.md` file changes — this is the freshness signal for materialized conventions.
