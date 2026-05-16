<!-- @spec FR-001, FR-002, FR-006, FR-007, FR-008, FR-009, FR-013: Naming convention — ../../../../.specs/features/009-mockup-export-naming/spec.md -->

# Mockup Export Naming Convention

Authoritative reference for mockup export filenames and `manifest.json`. All other skill files link here; never re-list the enum values elsewhere.

## Format

```
{product}_{parent}[_{subview}][_{state}].{ext}
```

- Segments joined by `_`.
- Optional segments (`subview`, `state`) are **omitted entirely** when absent — never as empty strings, never as trailing `_`.
- Extension is currently `png` (changing format is out of scope).

**Examples:**
- `web_dashboard.png` — parent-only (2 segments).
- `web_dashboard_sidebar.png` — parent + subview (3 segments).
- `mobile_onboarding_step3.png` — parent + state (3 segments, state carries sequence step).
- `landing_hero_pricing_modal-open.png` — all four segments.

## Product enum (closed)

**Single source of truth.** The `product` segment MUST be one of exactly these 5 values:

- `web`
- `mobile`
- `landing`
- `showcase`
- `admin`

Any value outside this list MUST be rejected at the orchestrator level before any subagent is dispatched, and at the generator level before `mcp__pencil__export_nodes` is called. **Adding a 6th value is a roadmap change, not inline discretion of any caller.**

## Segment validation rules

Each segment (including `product`, `parent`, `subview`, `state`) MUST:

- Be a non-empty string.
- NOT contain `_` (reserved as separator), whitespace, or path separators (`/`, `\`).
- Be a lowercase English token; `-` is allowed within a segment (e.g. `modal-open`).

## Conditional numbering

Numbering (`_N` or `stepN`) appears **ONLY** when the caller declares an explicit narrative sequence (e.g. onboarding steps). Automatic positional numbering based on dispatch order within a group is prohibited.

**Positive example** (onboarding sequence — state carries step):
- `mobile_onboarding_step1.png`
- `mobile_onboarding_step2.png`
- `mobile_onboarding_step3.png`

**Negative example** (unrelated screens — no sequence — forbidden):
- `web_dashboard_1.png`
- `web_settings_1.png`

The `_1` is meaningless here and MUST NOT be emitted.

## Manifest schema

Each batch writes a `manifest.json` in the same folder as its PNG exports.

**Top-level fields:**
- `schemaVersion` — integer, current value `2` (mockup-factory now writes v2; v1 manifests remain valid for readers that only access v1 fields).
- `product` — one of the enum above (the batch's product).
- `generatedAt` — ISO-8601 timestamp string.
- `exports` — array of entries.

**Success entry (schemaVersion 2):**
```
{
  filename,         // string — e.g. "web_dashboard_sidebar.png"
  product,          // string — product enum value
  parent,           // string
  subview,          // string | null
  state,            // string | null
  groupId,          // string
  generatedAt,      // ISO-8601 string — when the PNG was exported
  sourceNodeId,     // string | null — Pencil node ID at export time
  sourceFile,       // string — design source file (e.g. "ui.pen")
  sourceGeneratedAt,// ISO-8601 string | null — source node's last-modified timestamp
  specFlow,         // string | null — flow slug set by specify-flows
  specScreen,       // string | null — screen filename stem set by specify-flows
  specStatus,       // null | "fresh" | "stale" — set by specify-flows
  specGeneratedAt   // ISO-8601 string | null — when specify-flows last generated the spec
}
```

- `sourceNodeId`: captured by the generator agent from `mcp__pencil__export_nodes` response at export time; null if unavailable.
- `sourceFile`: always `"ui.pen"` (or the actual `.pen` filename if project uses a different name).
- `sourceGeneratedAt`: the timestamp of the Pencil node at export time; null if unavailable.
- `specFlow`, `specScreen`, `specStatus`, `specGeneratedAt`: all null at mockup-factory time; populated by `specify-flows` when behavioral specs are generated.
- `specStatus` enum: `null` (no spec yet) | `"fresh"` (spec up to date) | `"stale"` (source regenerated after spec).

**Backward compatibility:** v1 readers accessing only `filename`, `product`, `parent`, `subview`, `state`, `groupId`, `generatedAt` remain unaffected. The 7 new fields are additive.

**Failure entry:** `{ screen, error, groupId, generatedAt }` — no segment fields (unchanged from v1).

**Formatting:** pretty-printed, 2-space indent (NFR-005).

**Overwrite rule:** an existing `manifest.json` is overwritten in full; manifests are never merged with historical content.

**Example (schemaVersion 2):**

```json
{
  "schemaVersion": 2,
  "product": "web",
  "generatedAt": "2026-04-24T10:15:00Z",
  "exports": [
    {
      "filename": "web_dashboard_sidebar.png",
      "product": "web",
      "parent": "dashboard",
      "subview": "sidebar",
      "state": null,
      "groupId": "dashboard",
      "generatedAt": "2026-04-24T10:14:58Z",
      "sourceNodeId": "node-abc123",
      "sourceFile": "ui.pen",
      "sourceGeneratedAt": "2026-04-24T10:14:55Z",
      "specFlow": null,
      "specScreen": null,
      "specStatus": null,
      "specGeneratedAt": null
    },
    {
      "screen": "settings",
      "error": "pencil export timed out",
      "groupId": "dashboard",
      "generatedAt": "2026-04-24T10:15:00Z"
    }
  ]
}
```

## Validation at source

Validation happens at exactly two points:

1. **Orchestrator** — on invocation, validates the incoming `product` value against the closed enum. Unknown or missing values cause refusal to dispatch and surface an error listing the 5 allowed values.
2. **Generator** — before calling `mcp__pencil__export_nodes`, validates each segment (non-empty, no `_`, no whitespace, no path separator). Failure returns the standard failure payload; no file is written.

**No post-export renaming, regex cleanup, or filename normalization step exists anywhere.** A malformed input MUST fail fast, not be silently cleaned.

## Edge cases

- **Empty-string optional segment** — treated as absent (omitted, no trailing `_`). Callers should prefer `null`, but both behave identically.
- **Same filename collision within a batch** — second PNG overwrites the first (last-write-wins on disk); both attempts are preserved as separate rows in `manifest.json`.
- **Sequence of length 1** — technically allowed but pointless; omit the `stepN` suffix.
- **Mixed-product batches** — not supported in v1: one batch = one `product`. Top-level `manifest.json` carries a single `product` value.
