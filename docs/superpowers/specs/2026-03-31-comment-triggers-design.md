# Design: Mandatory Comment Triggers

> Date: 2026-03-31
> Scope: `general.md` §25 expansion + 5 language deltas (JS, Go, Rust, Swift/Kotlin, Delphi)

## Problem

`general.md` §25 says "Use comments to explain intent in multi-step operations" — too vague to enforce. LLMs and developers interpret "complex" differently, leading to inconsistent inline comments across projects (observed in cronshed: silent catches, magic numbers, diff algorithms without strategy comments).

Each language file has a documentation section covering public API doc format but no guidance on **when inline comments are mandatory**.

## Solution

### 1. Replace `general.md` §25 with an exhaustive trigger table

15 triggers. Each trigger = a code pattern that **requires** an inline comment explaining the "why". The comment is mandatory regardless of language.

| # | Trigger | Expected comment |
|---|---------|------------------|
| 1 | **Magic constant** — numeric or string literal without self-evident meaning | Origin and rationale for the value |
| 2 | **Silent catch** — catch block that ignores, swallows, or returns a default | Why the error is intentionally ignored |
| 3 | **Diff/merge/sync algorithm** — logic comparing two states to produce actions | Strategy summary before the implementation |
| 4 | **Template/string building** — multi-line script, query, or document construction | End-to-end flow description of the generated output |
| 5 | **Non-trivial business branch** — if/else encoding a business rule, not just type narrowing | The business rule in plain language |
| 6 | **Non-obvious default value** — fallback that isn't zero/empty/null | Why this specific default was chosen |
| 7 | **Loop with early exit** — break/continue/return inside a loop body | What condition triggers the exit and why |
| 8 | **Backward compatibility code** — logic supporting an old format, schema, or API | What old version it supports and when it can be removed |
| 9 | **Order-dependent operations** — sequence where reordering would break correctness | Why this order matters (e.g., write-then-rename for atomicity) |
| 10 | **Non-trivial regex** — pattern longer than ~15 characters | What the pattern matches, in plain language |
| 11 | **System/shell interaction** — external process call, OS-specific behavior | The contract: expected inputs, outputs, exit codes, platform quirks |
| 12 | **Lossy data transformation** — conversion that intentionally discards information | What is lost and why it's acceptable |
| 13 | **Intentionally ignored parameter** — received argument not used in a code path | Why it's unused (distinguish from a bug) |
| 14 | **Arbitrary threshold/limit** — any bound not from a standard or spec | Where the number comes from and trade-offs |
| 15 | **High cyclomatic function** — function >20 lines with >2 nesting levels | Strategy summary at the top of the function |

### 2. Expand §28 with an anti-table

Patterns that must NOT be commented (to prevent over-commenting):

- Getters/setters and trivial property access
- Import statements
- Function calls where the name is self-documenting
- Simple assignments and variable declarations
- Types/interfaces whose name fully conveys their purpose
- Standard framework boilerplate (route registration, middleware setup)
- Tests (test name is the documentation)

### 3. Add inline trigger reference to each language file

Each language doc section gets a new sub-section:

```
### Inline Comment Triggers

All 15 triggers from [`general.md`](general.md) §25 apply. Use `{language_comment_syntax}` for inline comments. See the trigger table for the exhaustive list.
```

Plus language-specific additions where relevant:
- **Go**: `// nolint:` directives must include a comment explaining why the lint is suppressed
- **Rust**: `unsafe` blocks require a `// SAFETY:` comment (already a Rust convention)
- **Delphi**: `{$IFDEF}` conditional compilation blocks require a comment explaining the condition
- **Swift/Kotlin**: `@available` / `@Deprecated` annotations should include migration guidance in the comment

### 4. Files to modify

| File | Change |
|------|--------|
| `general.md` | Replace §25 one-liner with trigger table + expand §28 with anti-table |
| `javascript.md` | Add "Inline Comment Triggers" sub-section in TS Documentation |
| `go.md` | Add "Inline Comment Triggers" sub-section in Go Documentation |
| `rust.md` | Add "Inline Comment Triggers" sub-section in Rust Documentation + SAFETY comment |
| `swift-kotlin.md` | Add "Inline Comment Triggers" sub-section in Swift & Kotlin Documentation |
| `delphi.md` | Add "Inline Comment Triggers" sub-section in Delphi-Specific Documentation |
| `compiled-index.txt` | Update general.md description |
| `.last-updated` | Update to 2026-03-31 |

## Non-goals

- No changes to framework deltas (react.md, nextjs.md, cloudflare.md, etc.) — they inherit from javascript.md
- No changes to architecture.md, database.md, logging.md, testing.md — these are not language files
- No new file — everything fits in existing files
- No tooling enforcement (linter rules) — this is convention-level, enforced by AI and code review
