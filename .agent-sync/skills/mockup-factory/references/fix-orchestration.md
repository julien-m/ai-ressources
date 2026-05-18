<!-- @spec FR-003, FR-008, AC-003, AC-017: Fix wave dispatch — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/005-mockup-factory/spec.md#fr-003 -->

# Fix Wave Orchestration

Entered when `CHECKLIST_FROZEN` or `REVALIDATING` reports unticked items and
`iteration_count < 3`.

## Slicing algorithm

Input: `unticked = [ChecklistItem, ...]` from on-disk checklist state.

1. Let `N = len(unticked)`.
2. `num_agents = min(6, N)` — cap 6 (NFR-002, AC-003).
3. `slice_size = ceil(N / num_agents)`.
4. Partition `unticked` into `num_agents` contiguous slices of up to `slice_size` items.
5. For each slice, assemble a fixer prompt per **Read** [`agents/fixer.md`](agents/fixer.md) and dispatch via the Agent tool.

Example: `N = 9`, `num_agents = 6`, `slice_size = 2` → slices of size `[2, 2, 2, 1, 1, 1]`.

## Dispatch

Use the Agent tool **batch** (not Agent Teams). Wait for the full batch to complete
before proceeding — do not interleave fix waves with revalidation.

```
batch = [Agent.spawn(fixer, slice_i) for slice_i in slices]
diffs = await batch  # ≤6 concurrent
```

## Collect and apply

1. Gather all diffs: `all_claimed = union(diff.resolved_item_ids for diff in diffs)`.
2. Apply ticks per **Read** [`checklist-writer.md`](checklist-writer.md) (drops unknown ids, idempotent).
3. Update `state.json` with a pending `iterations[]` entry (no `outcome` yet — set after revalidation).

## No counter advance here

The fix wave NEVER advances `iteration_count`. Only the revalidation that follows
(see **Read** [`revalidation.md`](revalidation.md)) may advance the counter, and only
if well-formed and still-unticked.

## Edge cases

- All fixers return `resolved_item_ids: []` → still proceed to revalidation. The revalidation outcome drives the counter, not fixer progress.
- Fixer returns an id that is already ticked → no-op at writer level.
- Fixer returns an id not in the frozen set → silently dropped, log `WARNING`.
- Pencil MCP failure mid-wave → that fixer returns `resolved_item_ids: []`; the item stays unticked.
