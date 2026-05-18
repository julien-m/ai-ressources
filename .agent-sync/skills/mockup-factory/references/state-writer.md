<!-- @spec FR-010, AC-009: state.json writer + counter-advance rule — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/005-mockup-factory/spec.md#fr-010 -->

# State Writer — `state.json`

Persisted per group at `<target>/.mockup-validation/<group>/state.json`. Written by the
orchestrator after every significant transition (AUDITING → CHECKLIST_FROZEN, after
each fix wave, after each revalidation, on terminal status).

## Shape

```json
{
  "group_id": "dashboard",
  "viewport": "web",
  "status": "pending | generating | auditing | fixing | revalidating | passed | passed_with_warnings | escalated | blocked",
  "iteration_count": 0,
  "codex_calls_used": 0,
  "started_at": "2026-04-23T10:00:00Z",
  "updated_at": "2026-04-23T10:05:00Z",
  "iterations": [
    {
      "n": 1,
      "started_at": "...",
      "ended_at": "...",
      "items_resolved": ["id-1", "id-2"],
      "outcome": "pass | partial | passed_with_warnings | escalated"
    }
  ],
  "last_codex_verdict": "pass | partial | blocked_unavailable | blocked_malformed | null",
  "block_reason": "conventions_missing | conventions_incomplete | theme_missing | codex_unavailable | codex_malformed | codex_budget_exceeded | null"
}
```

## Counter-advance rule (FR-010, AC-009)

`iteration_count` advances **iff and only iff** all three conditions hold:

1. The most recent `cc-hub codex` revalidation call returned a **well-formed** payload (not malformed, not unavailable).
2. That payload reported `unticked != []` (some items remain unresolved).
3. `iteration_count < 3` (otherwise we are at the cap).

On advance: `iteration_count += 1`, append a new entry to `iterations[]` with
`outcome: "partial"`.

**Never advance** on:
- Codex failures (unavailable, malformed) — per FR-011.
- Fix-wave progress that is not yet revalidated.
- Repeated retries within the Codex wrapper.

## Write discipline

- Atomic: write `state.json.tmp` then `rename`.
- Schema validation: on read, missing keys default to the shape above.
- Append-only for `iterations[]` — entries are never removed, only added.
