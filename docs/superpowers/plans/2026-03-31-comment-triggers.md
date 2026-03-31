# Plan: Mandatory Comment Triggers

> Spec: `docs/superpowers/specs/2026-03-31-comment-triggers-design.md`
> Date: 2026-03-31

## Tasks

### Task 1: Update `general.md` §25 and §28
- **File**: `code-conventions/general.md`
- **Action**: Replace §25 single line with the full 15-trigger table. Expand §28 with anti-table.
- **Dependencies**: None
- **Parallel**: Yes (independent of language files)

### Task 2: Update `javascript.md` TS Documentation
- **File**: `code-conventions/javascript.md`
- **Action**: Add "Inline Comment Triggers" sub-section after existing TS Documentation rules
- **Dependencies**: Task 1 (references §25)
- **Parallel**: Yes (can run alongside Tasks 3-6)

### Task 3: Update `go.md` Go Documentation
- **File**: `code-conventions/go.md`
- **Action**: Add "Inline Comment Triggers" sub-section + `// nolint:` rule
- **Dependencies**: Task 1
- **Parallel**: Yes

### Task 4: Update `rust.md` Rust Documentation
- **File**: `code-conventions/rust.md`
- **Action**: Add "Inline Comment Triggers" sub-section + `// SAFETY:` rule for unsafe blocks
- **Dependencies**: Task 1
- **Parallel**: Yes

### Task 5: Update `swift-kotlin.md` Documentation
- **File**: `code-conventions/swift-kotlin.md`
- **Action**: Add "Inline Comment Triggers" sub-section + `@available`/`@Deprecated` guidance
- **Dependencies**: Task 1
- **Parallel**: Yes

### Task 6: Update `delphi.md` Documentation
- **File**: `code-conventions/delphi.md`
- **Action**: Add "Inline Comment Triggers" sub-section + `{$IFDEF}` rule
- **Dependencies**: Task 1
- **Parallel**: Yes

### Task 7: Update index and timestamp
- **File**: `compiled-index.txt`, `.last-updated`
- **Action**: Update general.md description in index, bump timestamp
- **Dependencies**: Tasks 1-6
- **Parallel**: No (runs after all edits)

## Execution Order

```
Task 1 (general.md) ──→ Tasks 2-6 (language files, parallel) ──→ Task 7 (index)
```
