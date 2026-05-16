# Mockup Factory — Test Harness

Deterministic tests for the Mockup Factory skill. Since the skill is markdown-driven (Claude reads `SKILL.md` and executes), the harness provides **three** reproducible pieces:

1. A **shim** (`shim/cc-hub`) that impersonates the real `cc-hub codex` binary and emits scripted JSON responses. Keyed off `MOCKUP_FACTORY_TEST_SCENARIO` env var.
2. **Scenarios** (`scenarios/*.json`) covering every Success Criterion that exercises Codex behaviour.
3. **Assertions** (`assert.sh`) that verify terminal disk state (`state.json`, `audit-report.md`, `escalation.md`, `codex-raw.log`, checklist `item_ids` invariant).

The actual run loop is still executed by Claude following `SKILL.md`. The harness makes that execution **deterministic** and **verifiable**.

## Scenarios → Success Criteria mapping

| Scenario | SC covered | Expected terminal |
|---|---|---|
| `happy-path-pass.json` | SC-001 | `PASS`, iter=1, 2 codex calls |
| `SC-002-SC-008-escalated.json` | SC-002 (3-iter cap), SC-008 (BLOCKING → ESCALATED) | `ESCALATED`, iter=3, 4 codex calls, `escalation.md` present |
| `SC-008-passed-with-warnings.json` | SC-008 (WARNING-only → PASSED_WITH_WARNINGS) | `PASSED_WITH_WARNINGS`, iter=3, 4 codex calls, no `escalation.md` |
| `SC-003-unavailable.json` | SC-003, NFR-003 | `BLOCKED: codex_unavailable`, iter=0, `codex-raw.log` present |
| `SC-003-malformed.json` | SC-003 (retry-once on malformed), NFR-003 | `BLOCKED: codex_malformed`, iter=0, `codex-raw.log` present with both attempts |
| `SC-007-budget-exceeded.json` | SC-007 (NFR-001 budget guard, override=2) | `BLOCKED: codex_budget_exceeded`, calls_used=2 |

SC-004 (parallelism ≤ 6) is not Codex-driven — verified by inspecting the Agent-tool batch calls in the conversation transcript during a real run. Not in scope for this shim.

SC-005 (orchestrator state transition) and SC-006 (standalone write isolation) are end-to-end — verified by inspecting the target directory vs the project-brainstorm directory after a run.

## How to run a scenario

```bash
# 1. Prepare sandbox + print operator steps
.claude/skills/mockup-factory/tests/run.sh SC-002-SC-008-escalated

# The script prints a tmpdir path and the exports to set. Copy-paste them,
# then in this same shell session invoke the skill:
#   /mockup-factory --target <tmpdir> --groups test

# 2. After the skill returns a terminal status, verify disk state:
.claude/skills/mockup-factory/tests/assert.sh <tmpdir> test \
  .claude/skills/mockup-factory/tests/scenarios/SC-002-SC-008-escalated.json
```

## Shim contract

- Reads `$MOCKUP_FACTORY_TEST_SCENARIO` (path to scenario JSON).
- Pops `calls[IDX]` on each invocation via a sibling `.counter` file.
- Emits `stdout`, `stderr`, and exits with the scripted `exit` code.
- `cc-hub telegram` always exits 0 silently (AC-015 is non-blocking).

Scenarios can set `_env_required` for extra env vars the run needs (e.g. `MOCKUP_FACTORY_MAX_CODEX_CALLS=2` for SC-007).

## Resetting between runs

Each `run.sh` invocation resets the scenario counter (`rm -f <scenario>.counter`) and creates a fresh tmpdir. No cross-run state leakage.

## Validation status (2026-04-23)

The shim, all 6 scenarios, and `assert.sh` have been validated against **hand-crafted simulated outputs** matching the `state.json` schema from `references/state-writer.md`. Results:

| Harness piece | Verdict |
|---|---|
| Shim (`shim/cc-hub`) | ✅ Pops scenarios, returns scripted stdout/exit, errors on exhaustion |
| JSON validity of all 6 scenarios | ✅ `jq` passes |
| Assertions vs state.json schema | ✅ All declared `_expected_disk` fields asserted |
| Negative test (wrong state → should fail) | ✅ Correctly exits non-zero with 4 KO |
| Bash compatibility (macOS 3.2 + modern) | ✅ Uses `case` and `compgen`, no `declare -A` |

**NOT validated:** an actual end-to-end run of the skill against the shim. That requires Claude to invoke `/mockup-factory` with the PATH-modified shim and real Pencil agents — costly and non-deterministic. The harness is ready for that run but hasn't been used in anger.

### Spec gap surfaced by the harness

FR-014 says "save the `.pen` source file" but no reference file anchors the path. `assert.sh` searches four plausible locations (`<target>/*.pen`, `<target>/.mockup-validation/*.pen`, `<target>/.mockup-validation/<group>/*.pen`, `<target>/.specs/design/*.pen`) as a pragmatic tolerance. Recommend pinning a single canonical location in `references/terminal.md` before an end-to-end run.

## Adding a new scenario

1. Write `scenarios/<name>.json` with `_purpose`, `_expected_disk`, and `calls[]`.
2. If it needs env overrides, add `_env_required`.
3. Re-run `assert.sh` after a skill run to verify.
