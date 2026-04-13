---
name: conventions.refresh
description: "Check if conventions are stale and regenerate from ai-ressources. Use when conventions may be outdated or after ai-ressources updates."
argument-hint: "[--full]"
---

# /conventions.refresh — Refresh Materialized Conventions

Check if `.conventions/` is up to date with `~/projects/ai-ressources/`, and regenerate stale domain files incrementally.

## Prerequisites

- `.conventions/` directory must exist in the current project (or use `--full` to create)
- `~/projects/ai-ressources/` must exist

## Procedure

### Default mode (hash-based staleness detection)

1. **Check for manifest** — look for `.conventions/conventions.manifest.json`

   **If manifest does not exist:**
   - Auto-full mode: Run `/conventions.init` Phases 1-4 to initialize `.conventions/` from scratch (transparent migration for old projects)
   - This ensures projects without a manifest get set up correctly

   **If manifest exists:**
   - Proceed to incremental refresh (step 2)

2. **Detect current stack** — re-run Phase 1 of `/conventions.init` (dependencies, file extensions, project context) to build a current stack profile

3. **For each domain in manifest.domains:**
   
   a. **Get current source hashes** — compute SHA256 hashes for all source files listed in `manifest.domains[domain].sources`
   
   b. **Compare to manifest** — check if computed hashes match `manifest.domains[domain].hashes`
      - **Match**: Domain is fresh, skip
      - **Mismatch**: Domain is stale, rebuild (step 3c)
   
   c. **Rebuild stale domain** — call build-conventions.ts for this domain only:
      ```bash
      bun run ~/projects/ai-ressources/scripts/build-conventions.ts \
        "$(pwd)" \
        '{"<domain>":["<file1>","<file2>"]}'
      ```
      This regenerates `.conventions/<domain>.md` and updates the manifest entry for this domain.

4. **Update manifest** — after all domains are checked/rebuilt:
   - Recompute all hashes
   - Update `generated` date to today
   - Save `.conventions/conventions.manifest.json`

5. **Regenerate index** — update `.conventions/index.md` with the latest domain hints and availability

### Output — default mode

**All fresh:**
```
Conventions up to date (last checked: 2026-04-13)
```

**Partial refresh:**
```
Conventions refreshed — 2/4 domains updated (code, legal)
✓ code.md (rebuilt, +3 sources)
✓ legal.md (rebuilt, +1 source)
✓ design.md (no changes)
✓ pricing.md (no changes)
```

**Auto-migrated to manifest:**
```
Auto-migrating to new manifest format...
Conventions initialized from existing structure
Manifest created: .conventions/conventions.manifest.json
```

### `--full` mode (re-detection + full rebuild)

Re-run the full `/conventions.init` workflow:
- **Phase 1-3**: Re-detect domains from scratch (new dependencies, new file types, changed stack)
- **Phase 4**: Call build-conventions.ts with detected domains
- **Phase 5**: Update gitignore
- **Phase 6**: Audit config files

This regenerates the entire `.conventions/` directory and manifest from the current stack.

**Useful when:**
- Project has evolved significantly (new packages, new languages)
- Stack declarations have changed (`.specs/stacks/_default.md` updated)
- User wants guaranteed freshness regardless of hashes

### Output — `--full` mode

```
Full refresh: 6 domains (was 5), 1 new (copywriting)
✓ code.md rebuilt (6 sources)
✓ legal.md rebuilt (2 sources)
✓ design.md rebuilt (3 sources)
✓ pricing.md rebuilt (1 source)
✓ copywriting.md new (1 source)
Removed: architecture.md (no longer detected)
Manifest updated
```

## Edge Cases

- **No manifest, no conventions/** → create from scratch (same as auto-full)
- **Manifest exists but references missing files** → rebuild domain, update manifest with `"missing"` hash for unreachable files
- **New sources in extends graph** → include in hash computation, rebuild if different
- **Domain file deleted from ai-ressources** → warn, rebuild fails gracefully, update manifest with `"missing"`
- **Empty domain after rebuild** → remove from manifest, remove file, update index

## Rules

- Never regenerate if all source hashes match
- Manifest is the single source of truth for staleness (not dates)
- Incremental refresh is fast — only changed domains rebuild
- `--full` is slower but guarantees detection of new conventions
- The project directory is never modified except `.conventions/`
