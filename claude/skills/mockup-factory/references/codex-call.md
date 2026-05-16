<!-- @spec FR-006 (005), FR-001/FR-005/FR-006 (012): cc-hub codex wrapper, paths-in-prompt — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/012-audit-codex-via-file-paths/spec.md#fr-001 -->

# `cc-hub codex` Wrapper — Contract

Wraps every audit / revalidation call. Enforces the retry-once policy and counter-invariance.

## Command shape

```bash
cc-hub codex \
  --prompt @<prompt-file> \
  --schema @<schema-file> \
  --timeout 120
```

## Screenshot delivery

Screenshots are referenced by **absolute filesystem paths** embedded inside the rendered prompt body — under section `## Screenshots under audit` for the initial audit, and `## Current screenshots` for revalidation. Codex reads the PNG bytes itself from disk.

Pre-flight rules (orchestrator-side, before any invocation):

- For every screenshot, the orchestrator MUST `Path(p).resolve(strict=False)` and verify `Path.is_file()`.
- Every path MUST begin with `/` (absolute). Any non-absolute path is rejected.
- If any screenshot path is missing on disk OR non-absolute → return `BLOCKED: missing_screenshot` with the offending path in the `reason` field; do NOT invoke `cc-hub codex`.
- TOCTOU note: if Codex itself cannot open a path that existed at pre-flight, the response is treated as **malformed** and follows the retry-once path below.

The `attach` argument is forbidden — screenshot delivery is by absolute path inside the prompt body only.

## Response parsing

A response is **well-formed** iff all apply:
1. Exit code `0`.
2. Body trims to a JSON object (leading `{`, trailing `}`).
3. For audit: root key `items` is an array; every item has `id` (kebab), `description`, `severity` ∈ {`BLOCKING`, `WARNING`}.
4. For revalidation (see **Read** [`revalidation.md`](revalidation.md)): root keys `ticked` and `unticked` are arrays; `set(ticked) ∪ set(unticked) == frontmatter.item_ids`. If this set equality fails → **malformed** (AC-008.b).

Otherwise → malformed.

## Retry-once policy (FR-011, AC-010)

For a single logical Codex slot (one audit, or one revalidation at iteration N):

1. First call with base prompt. If well-formed → return parsed payload, increment `codex_calls_used`.
2. If not well-formed (non-zero exit OR parse fail OR set-equality fail):
   - Append raw stdout+stderr to `<target>/.mockup-validation/<group>/codex-raw.log` (with timestamp and attempt marker).
   - Retry ONCE with the strict-retry variant prompt (the template's `STRICT:1` mode — see the audit + revalidate `.tmpl` files). Do NOT change the screenshot paths embedded in the prompt — the STRICT:1 retry MUST reuse the same absolute paths as call #1.
3. If the retry is well-formed → return parsed payload, increment `codex_calls_used`.
4. If the retry also fails → append again to `codex-raw.log`, return:
   ```json
   {"verdict": "BLOCKED", "reason": "codex_unavailable" | "codex_malformed"}
   ```

**Reason distinction:**
- `codex_unavailable`: non-zero exit, missing binary (`ENOENT`), timeout, network error.
- `codex_malformed`: exit `0` but parse or set-equality failure.

## Counter invariance (FR-010, AC-009)

The 3-iteration counter (`state.json.iteration_count`) MUST NOT be advanced by this
wrapper. Retries within this wrapper do NOT count as new iterations. The counter is
advanced only by the revalidation algorithm (**Read** [`revalidation.md`](revalidation.md))
when a **well-formed** revalidation still reports unticked items.

## Budget guard (NFR-001)

After every call, the orchestrator MUST compare `state.codex_calls_used` to
`MOCKUP_FACTORY_MAX_CODEX_CALLS` (default 4). If exceeded:
- Stop further Codex calls.
- Return `{"verdict": "BLOCKED", "reason": "codex_budget_exceeded"}`.

## Independence guard (NFR-003)

On `BLOCKED` return, the caller MUST NOT dispatch a Claude-based reviewer, a
Codex-emulating subagent, or any other auditor. The failure path is `BLOCKED`, always.
