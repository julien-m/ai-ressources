<!-- @spec FR-001..FR-004, FR-008: Orchestrator posture — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/005-mockup-factory/spec.md -->

# Mockup Factory — Orchestrator Posture

When the `mockup-factory` skill is invoked, Claude becomes the **orchestrator**. It does
not delegate orchestration itself — orchestration is a posture. Only the generator and
fixer agents are subagents (see **Read** [`https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/stacks/decisions/ADR-004-mockup-factory-subagents.md`](https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/stacks/decisions/ADR-004-mockup-factory-subagents.md)).

## Run lifecycle

1. **Argument parsing.** Read `--target`, `--groups`, `--product`, `--notify`. `--target` defaults to the current working directory when omitted.
2. **Prerequisite check.** Follow **Read** [`prereq-check.md`](prereq-check.md). On any BLOCKED reason, return immediately without spawning agents.
3. **Preload (FR-001).** Use `conventions_dir` returned by prereq-check (resolved by walking up from `<target>`; typically repo root in monorepo layouts, `<target>` otherwise). Read ONCE, cache in memory:
   - `<conventions_dir>/manifest.yaml` (parse YAML)
   - Mandatory sub-domain files (`design-tokens`, `design-components`)
   - `design-views` sub-domain files if declared; otherwise load ai-ressources defaults and log a `WARNING: design-views fallback to ai-ressources/<path>`
   - `theme.css` content from `theme_css_path` returned by prereq-check (full file)
   - `pencil-frames` rule content — resolved via `resolve_pencil_frames(target)` defined in **Read** [`prereq-check.md`](prereq-check.md). Precedence: `<target>/.claude/rules/pencil-frames.md` wins; else `~/.claude/rules/pencil-frames.md` (global, installed by `~/projects/ai-ressources/setup.sh`); else `BLOCKED: pencil_frames_missing` (no silent fallback)
4. **`.gitignore` write (FR-005, AC-018).** Append `.mockup-validation/` to `<target>/.gitignore` if the literal line is absent (idempotent).
5. **Group splitting (FR-002, AC-001).** See § Group splitting below.
6. **Per-group loop.** For each group: generate → audit → (fix → revalidate)*≤3 → terminal. State machine defined in `SKILL.md`.
7. **Terminal.** Aggregate group results into `audit-report.md` (per **Read** [`terminal.md`](terminal.md)). Send Telegram if `--notify` set (FR-015, AC-015).

## Group splitting (FR-002)

Input: list of target screen descriptors (name + viewport). Algorithm:

1. **Cluster by domain keyword (lowercase match on screen name):**
   | Keyword matches | Group id |
   |---|---|
   | `auth`, `login`, `signup`, `signin`, `register` | `auth` |
   | `dashboard`, `home` (authenticated), `overview` | `dashboard` |
   | `settings`, `profile`, `account`, `preferences` | `settings` |
   | `landing`, `marketing`, `pricing`, `home` (public) | `landing` |
   | fallback | `misc` |
2. **Split oversize clusters:** any cluster with > 5 screens is split into sub-groups of ≤ 5 screens, numbered `<group>-1`, `<group>-2`, ... (preserving input order).
3. **Output:** ordered list of `MockupGroup` entries with `id`, `name`, `screens[]`, `viewport`.

## Parallel spawn discipline (FR-003, AC-003, NFR-002)

Agent-tool batch size is **hard-capped at 6**. For a group with N screens:
- If N ≤ 6: single batch of N generators.
- If N > 6: impossible by construction (group cap is 5), so the cap is never reached inside generation. The 6-cap exists for fix waves, where unticked items may exceed 5.

For fix waves: slice unticked items into at most 6 agent prompts (see **Read** [`fix-orchestration.md`](fix-orchestration.md)).

The harness may observe fewer than 6 concurrent — tolerated without probing (NFR-002).
**Never use Agent Teams** — only the Agent tool.

## Prompt assembly contract (FR-004, AC-004)

Every generator or fixer prompt MUST contain, verbatim, in this order:
1. Preloaded `.conventions/` sub-domain content (design-tokens, design-components, design-views)
2. `theme.css` full content
3. `pencil-frames` rule content
4. The target screen description (one screen per generator, or a slice of unticked items per fixer)
5. The target viewport (`web` | `mobile` | `landing`)
6. Output contract (JSON schema expected back from the subagent)

Any prompt missing one of items 1–5 MUST NOT be dispatched.

## Checklist writer contract (FR-008, AC-017)

The orchestrator is the **sole writer** to `<target>/.mockup-validation/<group>/checklist.md`.
- On initial audit: write the full frozen file (YAML frontmatter + `## Checklist` body with all items unticked). See **Read** [`checklist-writer.md`](checklist-writer.md).
- After each fix wave: apply ticks per agent diffs — idempotent, append-only-semantics, never un-tick.
- Validate every diff against the frozen `item_ids` set; unknown ids are silently dropped (no-op).

## State persistence

See **Read** [`state-writer.md`](state-writer.md). The counter advances ONLY on a well-formed revalidation still reporting unticked items (FR-010, AC-009).

## Audit + revalidation calls

See **Read** [`codex-call.md`](codex-call.md) for the `cc-hub codex` wrapper and the retry-once policy (FR-011, AC-010).

## Codex call site — paths-in-prompt contract

<!-- @spec FR-004/FR-005/FR-006/FR-007/FR-008 (012): paths-in-prompt contract — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/012-audit-codex-via-file-paths/spec.md#fr-004 -->

Initial audit AND revalidation invoke `cc-hub codex` under the following contract — screenshots are referenced by absolute path inside the prompt, never as binary attachments:

1. For each screenshot to audit, compute its absolute path via `Path(p).resolve(strict=False)`.
2. Verify `Path.is_file()` for every resolved path. If any check fails, return `BLOCKED: missing_screenshot` with the missing absolute path in the `reason` field; do NOT invoke `cc-hub codex`.
3. Reject any path whose first character is not `/` with the same `BLOCKED: missing_screenshot` and a reason mentioning "non-absolute path".
4. Pass the list of absolute paths as the `screenshots` template variable to `audit-prompt.md.tmpl` (initial audit) or `revalidate-prompt.md.tmpl` (revalidation).
5. Invoke `cc-hub codex --prompt @<rendered-prompt-file> --schema @<schema-file> --timeout 120` — no `attach` arguments.
6. The STRICT:1 retry under FR-011 reuses the captured absolute-path list verbatim; do not re-resolve between call #1 and call #2.
7. Counter accounting (FR-010 of feature 005) and budget guard (NFR-001) are unchanged. `codex_calls_used` follows the wrapper contract in `codex-call.md`; the 3-iteration counter is NOT advanced by the wrapper.
8. NFR-003 unchanged: on any terminal `BLOCKED`, never dispatch a Claude or non-Codex auditor.

## Terminal verdict mapping

| Verdict | Action | Caller return |
|---|---|---|
| PASS | Write `audit-report.md`, save `.pen` | `PASS` |
| PASSED_WITH_WARNINGS | Write `audit-report.md` with trade-offs, save `.pen` | `PASSED_WITH_WARNINGS` |
| ESCALATED | Write `escalation.md` (no `.pen` save override) | `ESCALATED` |
| BLOCKED | Write `codex-raw.log` only | `BLOCKED(<reason>)` |

External callers (e.g. brainstorm orchestrators) map these verdicts to their own state transitions; this skill itself returns the verdict as documented above.
