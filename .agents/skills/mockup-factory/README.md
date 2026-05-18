# Mockup Factory — Operator Notes

Parallel Pencil mockup generation + `cc-hub codex` audit loop with frozen checklist,
3-iteration cap, and severity-aware terminal status. Produces mockups conformant to
`.conventions/` + `theme.css` without manual iteration.

Full spec: **Read** [`../../../.specs/features/005-mockup-factory/spec.md`](../../../.specs/features/005-mockup-factory/spec.md).

## Invocation examples

**Standalone, single group:**
```
/mockup-factory --target . --groups dashboard
```

**Standalone, multi-group with Telegram notification:**
```
/mockup-factory --target . --groups auth,dashboard,settings --notify
```

## Known limitations

- **Cost (NFR-001):** each group may consume up to 4 Codex calls (1 audit + 3 revalidations). Cap overridable via `MOCKUP_FACTORY_MAX_CODEX_CALLS` env var. `project.md` budget is nominally `$0` — this feature explicitly deviates and is budget-bound per NFR-001.
- **Parallelism (NFR-002):** 6-agent cap is best-effort; Claude Code harness may deliver fewer concurrent subagents.
- **Auditor independence (NFR-003):** on Codex failure, the run stays `BLOCKED` — no Claude fallback. Re-invoke after fixing the CLI.
- **Frozen checklist:** no new findings can appear after the initial audit. Items missed on first audit require a full re-run (delete `.mockup-validation/<group>/` and re-invoke).
- **Pencil idempotence:** saving the `.pen` after PASS relies on Pencil MCP's node persistence. No manual save call beyond `batch_design`.

## Escalation handling

When the factory returns `ESCALATED`:

1. Read `<target>/.mockup-validation/<group>/escalation.md` for the list of remaining BLOCKING items.
2. Decide: (a) accept the mockups as-is (override → advance manually to Planning), (b) fix the underlying conventions/theme gap and re-invoke, or (c) abandon the group.
3. External callers (if any) are expected to halt and surface `escalation.md` to the user — this skill does not auto-advance past ESCALATED.

## `BLOCKED` reasons

| Reason | Fix |
|---|---|
| `conventions_missing` | Add `.conventions/` to the target (run `/conventions-init`). |
| `conventions_incomplete` | Add missing mandatory sub-domain(s) to `.conventions/manifest.yaml`. |
| `theme_missing` | Generate `theme.css` via Brander or hand-author it. |
| `codex_unavailable` | Ensure `cc-hub codex --help` works; check PATH + install. |
| `codex_malformed` | Usually transient. Retry the invocation. If persistent, inspect `codex-raw.log` and adjust prompts. |
| `codex_budget_exceeded` | Raise `MOCKUP_FACTORY_MAX_CODEX_CALLS` or fix the convergence issue. |

## Output location

All artifacts live under `<target>/.mockup-validation/`. This directory is auto-added
to `<target>/.gitignore` on run start (AC-005, AC-018).

```
<target>/.mockup-validation/
├── audit-report.md              (global)
└── <group>/
    ├── checklist.md
    ├── state.json
    ├── codex-raw.log            (on BLOCKED_CODEX only)
    ├── escalation.md            (on ESCALATED only)
    └── <screen>.png             (one per screen)
```
