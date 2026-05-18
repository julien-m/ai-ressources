# Conventions Preload

**These rules apply when a `.conventions/` directory exists at the root of the current project.**

## What it is

`.conventions/` contains two files only:
- `index.md` — routing table (~30–60 lines): domain keywords + direct ai-ressources file paths
- `manifest.yaml` — machine-readable: exact source paths + exclusion filters per sub-domain

No compiled content. Source files live in ai-ressources and are read directly.

## Loading

**Before coding, designing, or producing anything covered by conventions:**

1. **Read** `.conventions/index.md` — scan domain keywords to identify your sub-domain
2. **Read** the source files listed for that sub-domain (`→` lines), directly from the `$AIRESOURCES` path shown in the index header
3. Apply `⊘` exclusions mentally when reading (e.g., ignore iOS/Android columns in token tables)

Load only the sub-domain(s) that match your task. Do not pre-load all sub-domains.

### Reading the index

Each entry in `index.md`:
```
## domain-name [kw1, kw2, kw3, ...]
→ $AIRESOURCES/dir/file1.md, file2.md
→ $AIRESOURCES/dir/file3.md
⊘ exclusion note  ← apply mentally when reading
```

The directory prefix on each `→` line applies to ALL filenames listed on that line.

### Sub-domain quick reference

| Task | Sub-domain |
|------|-----------|
| CSS, colors, spacing, typography, motion, dark mode | `design-tokens` |
| Button, input, form, toast, modal, nav, list, badge | `design-components` |
| Page layout, dashboard, settings, auth, mockup specs | `design-views` |
| a11y audit, WCAG, keyboard nav, ARIA, visual QA | `design-quality` |
| Charts, metrics, KPIs, data visualization | `design-dataviz` |
| WebSocket, SSE, streaming, LLM token output, real-time | `design-realtime` |
| Code, tests, logging, naming, imports, architecture | `code` |
| Legal pages, ToS, RGPD, cookies | `legal` |
| Pricing page, billing tiers | `pricing` |
| Marketing copy, landing page | `copywriting` |

**Sub-domain not in index?** Not configured for this project. Use `/ai-res` for ad-hoc, or re-run `/conventions-refresh --full` or `/conventions-init` to re-detect it.

## Overrides

When `.conventions/` exists:
- Do NOT call `/ai-res` for topics covered by the manifest
- Do NOT read ai-ressources source files directly without checking the index first — the manifest may declare `⊘` exclusions
- `/ai-res` remains valid for topics outside the manifest scope

## Subagents

When dispatching a subagent that will code or design:
1. Read `.conventions/index.md`
2. Identify the relevant sub-domain(s)
3. Read the source files for those sub-domains directly from ai-ressources (paths from `→` lines in index)
4. Include the content in the subagent prompt under `## Conventions`

The subagent does NOT need to load conventions itself — the dispatching agent reads and includes the content.

## Freshness

Conventions are always fresh — they reference ai-ressources source files directly. No hash comparison needed.

Check `.conventions/manifest.yaml` exists. If not found, or if `.conventions/` contains compiled `.md` domain files (e.g., `design.md`, `code.md` — old format), suggest `/conventions-refresh --full` once to migrate. Do not block.

## Initialization

If `.conventions/` does not exist and the project has code or design files, suggest `/conventions-init` once. Do not block.
