<!-- @spec FR-009, FR-010, AC-008, AC-009, AC-016, AC-017: Revalidation algorithm — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/005-mockup-factory/spec.md#fr-009 -->

# Revalidation Algorithm

Runs after each fix wave. Calls `cc-hub codex` with the revalidate prompt
(**Read** [`../templates/revalidate-prompt.md.tmpl`](../templates/revalidate-prompt.md.tmpl))
via the wrapper (**Read** [`codex-call.md`](codex-call.md)), then resolves the group's
next state.

## Algorithm

1. Read current `checklist.md` frontmatter: `item_ids`, on-disk `ticked`, `unticked`.
2. Render the revalidate prompt with those pinned values and the current group screenshots.
3. Call `cc-hub codex` via the wrapper.
   - On `BLOCKED(codex_unavailable|codex_malformed)` → persist state with `status: "blocked"`, `block_reason`, return `{"verdict":"BLOCKED","reason":"..."}`. **Counter NOT advanced** (FR-011).
   - On `BLOCKED(codex_budget_exceeded)` → same, with reason `codex_budget_exceeded`.
4. Otherwise parse `{ticked, unticked}`. Enforce the set-equality check: if `set(ticked) ∪ set(unticked) ≠ frontmatter.item_ids` → classify as malformed per AC-008.b (the wrapper already does this and retries once).
5. **Sole-writer reconciliation (AC-017):**
   - For any id the codex lists as `unticked` that is already `[x]` on disk → **keep the on-disk tick**. The orchestrator is the source of truth; un-ticking is never permitted.
   - For any id the codex lists as `ticked` that is already `[x]` on disk → no-op.
   - Effectively, only fixer diffs can tick; codex cannot tick or un-tick.
6. Compute `remaining_unticked = set(item_ids) - set(on_disk_ticked)`.

## Transition rules

| Condition | Transition |
|---|---|
| `remaining_unticked == ∅` | `PASS` → terminal |
| `remaining_unticked != ∅` AND `iteration_count < 3` | Advance: `iteration_count += 1`; go back to `FIXING` |
| `remaining_unticked != ∅` AND `iteration_count == 3` AND all items `severity == "WARNING"` | `PASSED_WITH_WARNINGS` → terminal (AC-016) |
| `remaining_unticked != ∅` AND `iteration_count == 3` AND ≥ 1 item `severity == "BLOCKING"` | `ESCALATED` → terminal (AC-016) |

**Counter-advance rule (FR-010, AC-009):** `iteration_count` is incremented iff
this revalidation was well-formed AND still reports unticked items. Codex failures
do NOT advance.

## State updates on each branch

On every transition, append an `iterations[]` entry in `state.json` with
`started_at`, `ended_at`, `items_resolved`, and `outcome` ∈ {`pass`, `partial`,
`passed_with_warnings`, `escalated`}. On `BLOCKED*`, do NOT append; set
`status: "blocked"` and `block_reason`.

## Terminal handoff

On `PASS` / `PASSED_WITH_WARNINGS` / `ESCALATED` / `BLOCKED*`, call
**Read** [`terminal.md`](terminal.md) to write artifacts and (optionally) notify.
