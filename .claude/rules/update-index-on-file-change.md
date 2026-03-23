# Update Index on File Change

After every file creation or deletion in this project, update `index.yaml` immediately:

- **file_count**: adjust the count for the affected domain
- **description**: add/remove references to new/deleted files if they introduce or remove a topic

Never wait for the user to notice a stale index — sync it in the same pass as the file operation.
