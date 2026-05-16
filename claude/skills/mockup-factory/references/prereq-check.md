<!-- @spec FR-012, AC-011: Prerequisite guard — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/005-mockup-factory/spec.md#fr-012 -->

# Prerequisite Check

Runs before any spawn. On failure, emits `BLOCKED: <reason>` with a payload and exits
immediately — no `.mockup-validation/` directory is created.

## Algorithm

1. **Resolve `conventions_dir`.**
   - Starting from `<target>`, walk up parent directories until one contains `.conventions/` (stop at filesystem root or first `.git/` repo boundary, inclusive — the repo root is a valid match).
   - First match wins. Assign `conventions_dir = <matched-ancestor>/.conventions`.
   - If no ancestor contains `.conventions/` → return `BLOCKED: conventions_missing`, payload `{target: "<target>", searched: [<target>, ...ancestors]}`. Stop.
   - Rationale: in monorepo layouts, `.conventions/` is shared at the repo root and `<target>` points to `projects/<slug>/`.
2. **`manifest.yaml` readable?**
   - Read `<conventions_dir>/manifest.yaml` — if absent or unparseable → `BLOCKED: conventions_incomplete`, payload `{reason: "manifest_missing_or_unparseable"}`.
3. **Mandatory sub-domains present?**
   - Required keys: `design-tokens`, `design-components`.
   - If one or both are missing from the manifest's sub-domain list → `BLOCKED: conventions_incomplete`, payload `{missing: ["design-tokens", ...]}`. Stop.
4. **Optional `design-views`?**
   - If declared → load. If absent → log `WARNING: design-views fallback to ai-ressources defaults` and proceed with the default (AC-002).
5. **`theme.css` locatable?** Try in order:
   - (a) `<target>/theme.css`
   - (b) path under `manifest.yaml` key `theme_css:` (if set — explicit override)
   - If none found → `BLOCKED: theme_missing`, payload `{tried: [...], hint: "run Brander or create theme.css manually"}`. Stop.
6. **`pencil-frames` rule resolvable?** Apply `resolve_pencil_frames(target)` (algorithm below). On failure → `BLOCKED: pencil_frames_missing`. Stop.
7. **All OK** → return `{status: "ok", conventions_dir: "<resolved-path>", conventions: {...}, theme_css_path: "...", pencil_frames: {source, path, content}}` — proceed to preload.

## `resolve_pencil_frames(target)` — canonical algorithm

This algorithm is the single source of truth for resolving the `pencil-frames` rule
content. It is invoked by prereq-check (step 6 above) and referenced by
`orchestrator.md` § "Preload" and `references/agents/generator.md` § "Prompt assembly".

```text
function resolve_pencil_frames(target):
    candidate_local  = path_join(target, ".claude/rules/pencil-frames.md")
    candidate_global = path_join(HOME,   ".claude/rules/pencil-frames.md")

    if file_exists(candidate_local) and readable(candidate_local):
        return { source: "local",  path: candidate_local,  content: read(candidate_local) }

    if file_exists(candidate_global) and readable(candidate_global):
        # If candidate_global is a symlink, also verify the symlink target is readable
        if is_symlink(candidate_global):
            real = realpath(candidate_global)
            if not (file_exists(real) and readable(real)):
                emit_blocked("pencil_frames_missing",
                             payload={tried: [candidate_local, candidate_global, real],
                                      reason: "global rule symlink dangling — run ai-ressources/setup.sh"})
        return { source: "global", path: candidate_global, content: read(candidate_global) }

    emit_blocked("pencil_frames_missing",
                 payload={tried: [candidate_local, candidate_global],
                          hint:  "run ~/projects/ai-ressources/setup.sh to install the global rule, "
                                 "or create <target>/.claude/rules/pencil-frames.md"})
    # emit_blocked is terminal: no agents are spawned, no .mockup-validation/ is created.
```

**Invariants:**
- `BLOCKED: pencil_frames_missing` is raised **iff** BOTH local and global are absent/unreadable (or the global symlink is dangling).
- **No `WARNING`, no silent fallback to embedded defaults** — the rule MUST be resolved from disk.
- Local wins over global by construction (first check that succeeds returns).

## Non-goals

- This check does NOT verify `cc-hub codex` availability — Codex failures are caught at call time via the retry-once policy (FR-011).
- This check does NOT verify Pencil MCP availability — Pencil failures surface per-screen in the generator's `status: failed` output.

## Output payload format

All `BLOCKED` returns share the shape:

```json
{
  "verdict": "BLOCKED",
  "reason": "conventions_missing | conventions_incomplete | theme_missing | pencil_frames_missing",
  "payload": { "...": "..." }
}
```
