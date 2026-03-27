# Conventions Preload

**These rules apply when a `.conventions/` directory exists at the root of the current project.**

## What it is

`.conventions/conventions.md` is a single synthesized file containing all project-relevant conventions from `~/projects/ai-ressources/`. It replaces runtime calls to `/ai-res` for conventions.

## Loading

Before coding, designing, or producing anything covered by conventions, **Read** `.conventions/conventions.md`. The entire file is loaded — it is optimized to be compact (under 400 lines).

No routing needed. No manifest to consult first. One Read, everything is in context.

## Overrides

When `.conventions/conventions.md` exists:

- **Replaces `/ai-res`** for all materialized domains. Do NOT call `/ai-res` for topics already covered. `/ai-res` remains usable for ad-hoc queries outside the materialized scope.
- **Replaces `code.md` dispatcher** — do not load individual convention files from `~/projects/ai-ressources/`. The synthesized file already contains the relevant rules.

## Subagents

When dispatching a subagent that will code or design, **include the content of `.conventions/conventions.md` directly in the subagent's prompt**. The subagent does NOT need to load conventions itself.

## Audit

When `.conventions/conventions.md` exists, `/audit` reads it instead of calling `/ai-res`. Domain auditors receive the conventions in their prompt.

## Freshness

At the start of each session, compare the `generated` date in the file's YAML frontmatter against `~/projects/ai-ressources/.last-updated`. If `generated` is older, suggest `/conventions.refresh` once. Do not block.

## Initialization

If `.conventions/` does **not** exist and the project contains code or design files, suggest `/conventions.init` once at the start of the session. Do not block.
