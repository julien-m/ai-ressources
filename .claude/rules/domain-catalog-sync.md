# Domain Catalog Sync

After any `.md` file is **created, renamed, or deleted** in a domain directory, verify that `domain-catalog.md` at the project root reflects the change.

## Affected directories

- `architecture/`
- `code-conventions/`
- `conventions/`
- `copywriting/`
- `design/` (all subdirectories)
- `legal/`
- `models/`
- `pricing-models/`
- `seo/`
- `stack-ref/` (all subdirectories)

## What to check

| Event | Action on domain-catalog.md |
|-------|----------------------------|
| File created | Add signal entries mapping relevant keywords to the new file path |
| File deleted | Remove all entries referencing the deleted file path |
| File renamed | Update file paths in all entries referencing the old name |

## Rules

- Update `domain-catalog.md` in the **same pass** as the file operation and the `index.yaml` update
- Choose signal keywords that a consumer would naturally extract from a stack file, dependency list, or project description
- A new file should have at least 2-3 signal keywords
- Do NOT add signals that are too generic (e.g., `app`, `code`) unless they map to a specific convention
