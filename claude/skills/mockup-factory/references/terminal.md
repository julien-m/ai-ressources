<!-- @spec FR-013b, FR-014, FR-015, AC-013, AC-014, AC-015, AC-018: Terminal artifact writers + notify; all writes under <target>, never under projects/<slug>/ in standalone mode — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/005-mockup-factory/spec.md#fr-014 -->

# Terminal Artifact Writers

Dispatched once per group (and once globally at run end) by the orchestrator.

## Per-group writers

### `PASS`

1. Save the `.pen` file(s) via Pencil MCP (the MCP persists the current document; no extra explicit save call is required beyond `batch_design` completion, but the orchestrator SHOULD run a `mcp__pencil__get_editor_state` to confirm persistence).
2. Append this group's outcome to the pending global report entry (see § Global report below).
3. Update `state.json`: `status: "passed"`, `updated_at`.

### `PASSED_WITH_WARNINGS`

1. Same as `PASS` (save `.pen`).
2. Append the outcome with the remaining WARNING items listed as **accepted trade-offs**.
3. `state.json`: `status: "passed_with_warnings"`.

### `ESCALATED`

1. Do NOT save additional `.pen` snapshots beyond what already exists.
2. Render **Read** [`../templates/escalation.md.tmpl`](../templates/escalation.md.tmpl) to `<target>/.mockup-validation/<group>/escalation.md`, listing remaining `BLOCKING` and `WARNING` items + iteration history + `codex_calls_used`.
3. Append to global report with `final_status: ESCALATED`.
4. `state.json`: `status: "escalated"`.

### `BLOCKED`

1. No `.pen` save. `codex-raw.log` is already written by the wrapper (see **Read** [`codex-call.md`](codex-call.md)).
2. Do NOT render a per-group report (incomplete data).
3. `state.json`: `status: "blocked"`, `block_reason`.

## Global report (on run completion)

After all groups have reached a terminal state, render **Read**
[`../templates/audit-report.md.tmpl`](../templates/audit-report.md.tmpl) to
`<target>/.mockup-validation/audit-report.md`. The report includes:

- `project_slug` (orchestrator mode) or `<target>` (standalone)
- `run_id`
- `started_at`, `completed_at`
- `final_status` (aggregate: `PASS` if all groups PASS; `PASSED_WITH_WARNINGS` if ≥1 with warnings; `ESCALATED` if ≥1 escalated; `BLOCKED` if ≥1 blocked)
- Per-group table: `| group | final_status | iterations_used | resolved | remaining_warnings | remaining_blocking |`
- Trade-offs section listing `PASSED_WITH_WARNINGS` items
- `codex_calls_used` per group and total

Write only if at least one group reached a non-BLOCKED terminal — otherwise skip (BLOCKED runs have no aggregate report).

## `--notify` (AC-015, FR-015)

If the caller passed `--notify`, on terminal status (aggregate), invoke:

```bash
cc-hub telegram --message "<summary>"
```

Where `<summary>` is:

```
[Mockup Factory] <final_status> — <target>
  Groups: <N>  Codex calls: <total>
  Report: <path-to-audit-report-or-escalation>
```

If `--notify` is absent → silently skip (no error, no log).

If `cc-hub telegram` is missing or fails → log `WARNING: notify failed: <err>` and continue (notification is not a gate).

## Caller return

The orchestrator returns a structured verdict to its caller:

```json
{
  "verdict": "PASS | PASSED_WITH_WARNINGS | ESCALATED | BLOCKED",
  "reason": "<only on BLOCKED>",
  "report_path": "<target>/.mockup-validation/audit-report.md",
  "groups": [{"id": "...", "final_status": "...", "iterations_used": N}]
}
```
