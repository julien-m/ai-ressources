# Update Index on File Change

After every file creation, deletion, or rename in this project, update the relevant `index.yaml` immediately.

## How to find the index

The index is not always in the same directory as the changed file. Search in this order:

1. **Same directory** as the changed file (`index.yaml`, `index.md`)
2. **Parent directory** — the index may be centralized one level up (e.g., `design/index.yaml` indexes `design/references/`, `design/components/`, etc.)
3. **Ancestor directories** — keep going up until the project root

Stop at the first index found that references files in the affected directory.

## What to update

- **files list**: add/remove the entry for the created/deleted/renamed file
- **description**: add/remove references if the file introduces or removes a topic
- **file_count**: adjust the count for the affected section if present

## Rules

- Never wait for the user to notice a stale index — sync it in the same pass as the file operation.
- If no index exists anywhere in the ancestry, do nothing — don't create one unprompted.
