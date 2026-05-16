<!-- @spec FR-012, AC-011: Prerequisite guard — ../../../../.specs/features/005-mockup-factory/spec.md#fr-012 -->

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
   - (c) `<target>/projects/<slug>/theme.css` (orchestrator-v2 mode only; requires `slug` from pipeline state)
   - If none found → `BLOCKED: theme_missing`, payload `{tried: [...], hint: "run Brander or create theme.css manually"}`. Stop.
6. **All OK** → return `{status: "ok", conventions_dir: "<resolved-path>", conventions: {...}, theme_css_path: "..."}` — proceed to preload.

## Non-goals

- This check does NOT verify `cc-hub codex` availability — Codex failures are caught at call time via the retry-once policy (FR-011).
- This check does NOT verify Pencil MCP availability — Pencil failures surface per-screen in the generator's `status: failed` output.

## Output payload format

All `BLOCKED` returns share the shape:

```json
{
  "verdict": "BLOCKED",
  "reason": "conventions_missing | conventions_incomplete | theme_missing",
  "payload": { "...": "..." }
}
```
