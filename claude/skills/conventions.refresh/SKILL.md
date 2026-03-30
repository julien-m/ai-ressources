---
name: conventions.refresh
description: "Check if conventions are stale and regenerate from ai-ressources. Use when conventions may be outdated or after ai-ressources updates."
argument-hint: "[--full]"
---

# /conventions.refresh — Refresh Materialized Conventions

Check if `.conventions/conventions.md` is up to date with `~/projects/ai-ressources/`, and regenerate stale category sections.

## Prerequisites

- `.conventions/conventions.md` must exist in the current project
- `~/projects/ai-ressources/` must exist

## Procedure

### Default mode (date check)

1. **Read** the `generated` date from the YAML frontmatter of `.conventions/conventions.md`
2. **Read** `~/projects/ai-ressources/.last-updated` to get the last modification date of the knowledge base
3. **Read** the `updated` date from `.specs/stacks/_default.md` YAML frontmatter (if the file exists)
4. **Compare** (in priority order):
   - If `.specs/stacks/_default.md` exists AND has an `updated` field AND `generated` < `updated` → conventions are stale (stack changed), proceed to **full** regeneration (re-detect domains, same as `--full` mode)
   - If `generated` < `.last-updated` → conventions are stale (rules changed), proceed to regeneration (same categories)
   - Otherwise → conventions are up to date, stop

Note: If `.specs/stacks/_default.md` does not exist or has no `updated` frontmatter, skip the stack comparison and fall back to the ai-ressources date check only.

#### Regeneration

When stale, re-synthesize all categories **without re-detecting the project**:

1. **Rebuild project context** — same as `/conventions.init` Phase 4.0 (project type, vision, constraints, domain terms, exclusions). This ensures refreshed conventions maintain project-specific contextualization and budget weighting
2. Read the `categories` list from the frontmatter of `.conventions/conventions.md`
3. For each category, dispatch an `ai-res-librarian` agent with the same synthesis prompts as `/conventions.init` Phase 4.1 (including context block and weighted budget)
4. Reassemble the file with updated content and set `generated` to today's date
5. The categories stay the same — only the synthesized content is refreshed

### `--full` mode (re-detection)

Re-run the full `/conventions.init` workflow (Phases 1-4):
- Re-detect domains from scratch (new dependencies, new file types)
- Compare with existing categories
- Add new categories, remove irrelevant ones
- Regenerate the entire file

Useful when the project has evolved significantly (new packages, new languages, changed project type).

### Output

Default mode (stale):
```
Conventions refreshed — 5 categories regenerated
```

Default mode (fresh):
```
Conventions up to date (generated: 2026-03-25, ai-ressources: 2026-03-24)
```

Full mode:
```
Full refresh: 6 categories (was 5), 1 new (copywriting), all regenerated
```

Stack-triggered full refresh:
```
Full refresh (stack changed): 6 categories (was 5), 1 new (cloudflare), all regenerated
```

## Rules

- Never regenerate if `generated` >= `.last-updated`
- The file must stay under **400 lines** after refresh
- If `.last-updated` does not exist in ai-ressources, warn and skip (do not fail)
- When stack staleness is detected (`generated` < `stacks.updated`), use `--full` mode automatically (re-detect domains) because a stack change may add/remove entire convention categories
- When only ai-ressources staleness is detected, use default mode (same categories, refreshed content)
