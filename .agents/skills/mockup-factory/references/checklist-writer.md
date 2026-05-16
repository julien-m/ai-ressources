<!-- @spec FR-007, FR-008, AC-007, AC-017: Checklist writer (sole-writer, idempotent) — ../../../../.specs/features/005-mockup-factory/spec.md#fr-008 -->

# Checklist Writer

The orchestrator is the **sole writer** to `<target>/.mockup-validation/<group>/checklist.md`.
This module defines the exact write operations.

## Initial write (after first well-formed audit)

Input: `items` array returned by `cc-hub codex` (see **Read** [`codex-call.md`](codex-call.md)).

1. Extract `item_ids = [item.id for item in items]` — preserve order.
2. Render **Read** [`../templates/checklist.md.tmpl`](../templates/checklist.md.tmpl) with:
   - `iteration: 0`
   - `group_id`, `group_name`, `codex_model`, `created_at`
   - `item_ids`: the ordered list
   - `items`: the full objects
3. Write atomically: write to `checklist.md.tmp`, then `rename` over `checklist.md`.

After this write, `frontmatter.item_ids` is **frozen**. Every subsequent write MUST
preserve this exact set (no add, no remove).

## Tick operation (after each fix wave)

Input: list of agent diffs `[{resolved_item_ids: [...], notes?}]`.

1. Union all `resolved_item_ids` into a set `claimed`.
2. **Drop unknown ids:** for `id in claimed` where `id not in frontmatter.item_ids` → no-op (silently dropped; log a `WARNING: unknown item id <id>`).
3. **Read** the current `checklist.md`.
4. For each remaining `id` in `claimed`:
   - Find the line `- [ ] <id> — ...` in the `## Checklist` section.
   - If already `- [x]` → no-op (idempotent — first tick wins).
   - Else flip `[ ]` → `[x]`; append `(ticked by <agent-id> at <iso_now>)` is OPTIONAL metadata — keep line length reasonable; if omitted, record in `state.json.iterations[*].items_resolved` instead.
5. Update `frontmatter.iteration` to the current iteration number (0 for post-initial-audit, then 1/2/3 after revalidations).
6. Write atomically (`.tmp` + rename).

## Invariants

- `frontmatter.item_ids` is immutable after initial write (AC-007).
- `frontmatter.frozen: true` is immutable.
- No line is ever added to or removed from `## Checklist`.
- `[x]` is never flipped back to `[ ]` (AC-017 — monotonic tick).
- Updates against the same `id` from concurrent fix agents are safe: first tick wins, subsequent ticks are no-ops.

## Reject conditions (no-op, do not raise)

- Unknown id → drop.
- Empty `resolved_item_ids` → write nothing.
- Fix agent returning `resolved_item_ids` with duplicates → deduplicate before apply.
