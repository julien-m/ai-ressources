<!-- @spec FR-003, FR-004, FR-005, AC-004, AC-005: Pencil generator subagent — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/005-mockup-factory/spec.md -->
<!-- @spec FR-004, FR-005: Structured export filename — https://github.com/julien-m/project-brainstorm/blob/717494f5d8b475d59ed59405036e648b2e3b87cd/.specs/features/009-mockup-export-naming/spec.md -->

# Generator Subagent — Contract

Dispatched by the orchestrator via the Agent tool. One subagent per screen. Runs in
parallel with up to 5 siblings (cap 6 per batch — AC-003).

## Input prompt (verbatim, assembled by orchestrator)

1. `## Conventions` — preloaded `.conventions/` sub-domain files, verbatim
2. `## Theme` — full `theme.css` content, verbatim
3. `## Pencil Frames Rule` — full `pencil-frames` rule content (resolved via `resolve_pencil_frames(target)` — see **Read** [`../prereq-check.md`](../prereq-check.md)), verbatim
4. `## Target Screen` — one screen descriptor: `{name, description, regions, product, parent, subview?, state?}` where `product` ∈ closed enum (see **Read** [`../naming-convention.md`](../naming-convention.md))
5. `## Viewport` — `web` | `mobile` | `landing`
6. `## Output Contract` — this contract (below)

## Behavior

1. If no active `.pen` editor, open a new one with `mcp__pencil__open_document('new')`.
2. Load guidelines: `mcp__pencil__get_guidelines(category=<viewport>)`.
3. Create the screen using `mcp__pencil__batch_design(...)`, respecting:
   - Every group of 2+ aligned elements MUST be inside a frame (pencil-frames rule).
   - Spacing values MUST match design-tokens scale; no arbitrary values.
   - Color values MUST come from the preloaded `theme.css` custom properties.
4. Build the filename from the payload by joining non-null segments with `_` in the order `product, parent, subview, state`, then append `.png`. Validate each included segment (non-empty string, no `_`, no whitespace, no path separator) before proceeding. Export: `mcp__pencil__export_nodes([screen_node_id], format="png", folder="<target>/.mockup-validation/<group>/")` passing the built filename. See **Read** [`../naming-convention.md`](../naming-convention.md) for the format, enum, and validation rules.
4a. If the payload `product` is outside the closed enum or any segment fails validation, return the failure payload (below) WITHOUT invoking `mcp__pencil__export_nodes`. No file MUST be written.
5. Return the JSON output below. No prose.

## Output (JSON, returned to orchestrator)

```json
{
  "screen": "dashboard",
  "png_path": "<target>/.mockup-validation/<group>/web_dashboard.png",
  "filename": "web_dashboard.png",
  "product": "web",
  "parent": "dashboard",
  "subview": null,
  "state": null,
  "status": "ok",
  "error": null
}
```

`png_path` and `filename` both carry the structured name; segment fields echo the payload (consumed by the orchestrator when building `manifest.json`).

On failure (Pencil error, export failure, guideline load failure, validation failure):

```json
{
  "screen": "<screen-name>",
  "status": "failed",
  "error": "<one-line reason>"
}
```

On failure, segment fields (`product`/`parent`/`subview`/`state`) MAY be omitted; orchestrator falls back to the `screen` name when building the manifest failure entry.

## Constraints

- The subagent MUST NOT write to `checklist.md` (sole-writer rule — AC-017).
- The subagent MUST NOT invoke `cc-hub codex` (auditor independence — NFR-003).
- The subagent MUST NOT spawn further subagents.
- Pencil calls only via `mcp__pencil__*` (never read `.pen` with `Read`).
- The subagent MUST NOT rename or sanitize the filename after export; validation happens before the export call (see **Read** [`../naming-convention.md`](../naming-convention.md) § Validation at source).
