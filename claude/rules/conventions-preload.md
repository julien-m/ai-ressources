# Conventions Preload

**These rules apply when a `.conventions/` directory exists at the root of the current project.**

## What it is

`.conventions/` contains domain-specific convention files compiled from `~/projects/ai-ressources/`. It replaces runtime calls to `/ai-res` for conventions.

Structure:
- `.conventions/index.md` — table of contents with domain hints
- `.conventions/code.md` — coding conventions (language, framework, testing, logging, architecture)
- `.conventions/legal.md`, `.conventions/design.md`, etc. — domain-specific conventions
- `.conventions/conventions.manifest.json` — metadata and staleness hashes

## Loading

**Before coding, designing, or producing anything covered by conventions:**

1. **Read** `.conventions/index.md` to understand which domain applies to your task
2. **Read** the relevant domain file (e.g., `.conventions/code.md` for coding tasks, `.conventions/legal.md` for legal content)

**No routing needed.** The index tells you which file to read. Load only what you need.

### Domain hints

| Task type | Load |
|-----------|------|
| Writing code, implementing features, testing, debugging | `.conventions/code.md` |
| Creating legal content (ToS, privacy, policies) | `.conventions/legal.md` |
| Designing UI, components, layouts, visual systems | `.conventions/design.md` |
| Writing marketing copy, homepage, pricing | `.conventions/copywriting.md` |
| Configuring pricing tiers, payment models | `.conventions/pricing.md` |
| Creating diagrams, flowcharts, flows | `.conventions/diagrams.md` |

**Not found?** The domain is not materialized for this project. Use `/ai-res` for ad-hoc queries, or suggest `/conventions.refresh --full` to detect additional domains.

## Overrides

When `.conventions/` exists:

- **Replaces `/ai-res`** for all materialized domains. Do NOT call `/ai-res` for topics covered by a domain file.
- **Replaces individual convention files** — do not read `code-conventions/*.md` or `design/*.md` directly from `~/projects/ai-ressources/`. The compiled domain files already contain the relevant rules.
- `/ai-res` remains usable for ad-hoc queries **outside** the materialized scope (e.g., a domain not detected in this project).

## Subagents

When dispatching a subagent that will code, design, or produce content:

1. **Identify the relevant domain** for the subagent's task
2. **Read** the corresponding `.conventions/<domain>.md` file
3. **Include the file content directly in the subagent's prompt** under a `## Conventions` section

Example:
```
You are implementing a feature for a React project.

## Conventions
{content of .conventions/code.md}

## Task
Implement X by following the conventions above.
```

The subagent does NOT need to load conventions itself — you provide the exact rules it needs.

## Audit

When `.conventions/` exists, `/audit` reads only the relevant domain file (based on the file type being audited) instead of calling `/ai-res`. Domain auditors receive the conventions in their prompt.

## Freshness

At the start of each session (optional reminder):

1. Check if `.conventions/conventions.manifest.json` exists
2. If not found → suggest `/conventions.refresh --full` once (transparent migration for old projects)
3. If found → conventions are materialized and up to date (manifest tracks staleness)

Do not block — this is a gentle reminder only.

## Initialization

If `.conventions/` does **not** exist and the project contains code or design files, suggest `/conventions.init` once at the start of the session. Do not block.
