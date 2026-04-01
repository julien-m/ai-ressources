# Plan: CLI Stdin Input Convention

**Date:** 2026-04-01
**Spec:** `docs/superpowers/specs/2026-04-01-cli-stdin-convention-design.md`
**Approach:** Direct implementation (small scope, single file + metadata)

## Tasks

### Task 1: Add "Stdin Input" section to cli.md

**File:** `code-conventions/cli.md`
**Action:** Insert new `## Stdin Input` section after `## Command Registration (Commander.js)`, before `## Module Structure`.

Content:
- Rule: commands accepting variable-length text MUST accept stdin when arg is omitted
- Priority order: positional arg > stdin (!isTTY) > error
- isTTY guard is mandatory (explicit rule, not just code)
- UTF-8 text only, binary out of scope
- Scope: variable-length content a user might pipe from a file
- `resolveInput()` helper pattern in `services/` with code example
- Commander.js `[text]` optional arg syntax
- Usage examples (direct arg, echo pipe, cat pipe, no input error)

### Task 2: Add anti-pattern row to cli.md

**File:** `code-conventions/cli.md`
**Action:** Add row to existing Anti-Patterns table.

| Required positional for text input, no stdin | Optional `[arg]` + `resolveInput()` from stdin |

### Task 3: Update inline comment trigger in cli.md

**File:** `code-conventions/cli.md`
**Action:** Add to existing "Inline Comment Triggers (CLI-Specific)" section. Note: distinct from existing `isTTY checks` trigger which covers non-TTY fallback behavior. This new trigger specifically covers stdin reads that lack the guard (hanging risk).

- **stdin read without `isTTY` guard** — explain why hanging is possible and what the fallback is

### Task 4: Update index.yaml for cli.md entry

**File:** `code-conventions/index.yaml`
**Action:** Update the cli.md entry:
- Add `"stdin input"`, `"pipe input"` to `use_when`
- Add `"How to accept stdin in a CLI command?"`, `"How to pipe input to a CLI?"` to `questions_answered`

### Task 5: Sync domain-catalog.md

**File:** `domain-catalog.md`
**Action:** Add `stdin`, `pipe` signals to existing cli.md entry (currently: `cli`, `commander`, `parseArgs`, `ink`, `ora`, `chalk`, `bin`, `shebang`).

### Task 6: Rebuild compiled index

**Action:** Run `bun run scripts/build-index.ts`

### Task 7: Update .last-updated marker

**Action:** Run `date +%Y-%m-%d > .last-updated`

## Dependencies

```
Task 1 ──┐
Task 2 ──┤── all edit cli.md (sequential)
Task 3 ──┘
Task 4 ──── independent (different file)
Task 5 ──── independent (different file)
Task 6 ──── after Tasks 4-5
Task 7 ──── after any task
```

## Execution

Tasks 1-3 are sequential edits to the same file.
Tasks 4-5 are independent edits to different files.
Tasks 6-7 run after all edits.
