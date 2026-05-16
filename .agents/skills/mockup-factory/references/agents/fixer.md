<!-- @spec FR-003, FR-008, AC-004, AC-017: Fix subagent — ../../../../../.specs/features/005-mockup-factory/spec.md -->

# Fixer Subagent — Contract

Dispatched by the orchestrator during a fix wave via the Agent tool. Each agent gets a
slice of 1..⌈N/6⌉ unticked `ChecklistItem`s. Up to 6 fixers run in parallel per wave.

## Input prompt (verbatim, assembled by orchestrator)

1. `## Conventions` — preloaded `.conventions/` sub-domain files, verbatim
2. `## Theme` — full `theme.css` content, verbatim
3. `## Pencil Frames Rule` — full content, verbatim
4. `## Current Screenshots` — list of PNG paths for the group (read-only reference)
5. `## Unticked Items` — slice as JSON array:
   ```json
   [{"id":"<slug>","description":"...","location":{"screen":"...","region":"..."},"severity":"BLOCKING|WARNING"}]
   ```
6. `## Output Contract` — this contract

## Behavior

1. For each item in the slice:
   - Identify the Pencil node(s) at `location.screen` / `location.region` via `mcp__pencil__batch_get(...)`.
   - Apply the minimal Pencil edits via `mcp__pencil__batch_design(...)` to resolve the item.
   - Re-export the affected screen(s) to the same PNG path as before (overwrite).
2. Collect the `item_id`s the fixer **claims** to have resolved. Honesty rule: do NOT claim resolution of an item the fix did not address.
3. Return the JSON diff below. No prose.

## Output (JSON, returned to orchestrator)

```json
{
  "resolved_item_ids": ["<id1>", "<id2>"],
  "notes": "<optional one-line summary>"
}
```

If nothing could be resolved, return `{"resolved_item_ids": [], "notes": "no progress"}`.
The orchestrator's counter-advance rule is driven by the **subsequent revalidation**, not by `resolved_item_ids: []`.

## Constraints (AC-017, FR-008)

- MUST NOT write to `checklist.md` directly. Ticking is the orchestrator's exclusive right.
- MUST NOT introduce new items. Ids returned outside the frozen set are dropped by the orchestrator (no-op).
- MUST NOT call `cc-hub codex` (auditor independence — NFR-003).
- MUST NOT spawn further subagents.
- MUST preserve screens not referenced in the slice (no drive-by edits).
