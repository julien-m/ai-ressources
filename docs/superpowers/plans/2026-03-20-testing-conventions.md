# Testing Conventions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cross-cutting `testing.md` convention file and integrate it into the existing dispatcher and index system.

**Architecture:** Pure documentation — no code to compile or test. Five files touched: one created, four edited. Each task is independent after Task 1 (the new file must exist before the dispatcher can reference it).

**Tech Stack:** Markdown, YAML

**Spec:** `docs/superpowers/specs/2026-03-20-testing-conventions-design.md`

---

### Task 1: Create `code-conventions/testing.md`

**Files:**
- Create: `code-conventions/testing.md`

- [ ] **Step 1: Create the file with header and cross-reference blockquote**

```markdown
# Testing Rules (Cross-Cutting)

> These rules complement [`general.md`](general.md) §9 (Testing), §8 (Async) and [`architecture.md`](architecture.md) §26 (Testing Boundaries).
> This file supersedes general.md §9 for detailed testing patterns.
> Language deltas keep their own runner/framework choices — this file covers cross-cutting patterns only.
```

- [ ] **Step 2: Add Section 1 — UI Test Identifiers**

For each step (2-8), copy the corresponding section **verbatim** from the spec file at `docs/superpowers/specs/2026-03-20-testing-conventions-design.md`. The checklist below is for verification, not for writing from scratch.

Full content from spec Section 1, including:
- Guard clause: `> Applies only when the project includes a user-facing UI layer. Skip for CLI tools, backend APIs, and libraries.`
- Universal rule
- Platform mapping table (column: "UI Test Framework", not "Runner")
- Naming convention (`{feature}-{element}-{variant?}`, kebab-case)
- Code examples: Web (React), iOS/macOS (SwiftUI), Android (Compose), Flutter, Tauri/Wails, Desktop native Rust
- AI instructions (5 rules)

- [ ] **Step 3: Add Section 2 — Test Structure & Naming**

Full content from spec Section 2:
- Naming convention table (7 languages: TypeScript, Go, Rust, Swift, Kotlin, Delphi, Dart)
- File organization rules (Go, Rust, Delphi, Dart, all others)

- [ ] **Step 4: Add Section 3 — Mocking Boundaries**

Full content from spec Section 3:
- Cross-reference: `> Extends general.md §9 and architecture.md §26 with detailed per-layer guidance.`
- "What to Mock" table (3 rows)
- "What to Never Mock" table (3 rows)
- "Fakes Over Mocks" paragraph + exception for spies

- [ ] **Step 5: Add Section 4 — Test Data**

Full content from spec Section 4:
- 4 rules (factories, relevant fields only, own data, explicit cleanup)
- Factory idioms table (7 languages)
- Anti-patterns (2 items)

- [ ] **Step 6: Add Section 5 — Async Testing**

Full content from spec Section 5:
- Cross-reference: `> Extends general.md §8 (Async) with test-specific patterns.`
- Rule: no arbitrary sleep
- Patterns list (polling, event-driven, explicit timeout)
- Anti-pattern code example (TypeScript)

- [ ] **Step 7: Add Section 6 — Integration vs Unit Boundaries**

Full content from spec Section 6:
- Cross-reference: `> Extends architecture.md §26 (Testing Boundaries) with explicit layer-to-test-type mapping.`
- Test type by layer table (4 rows: Handler, Service, Repository, Gateway)
- Rule: business logic = unit, boundaries = integration

- [ ] **Step 8: Add Section 7 — Coverage Philosophy**

Full content from spec Section 7:
- 3 bullet points (cover, skip, no mandatory threshold)

- [ ] **Step 9: Review the complete file**

Read `code-conventions/testing.md` end-to-end. Verify:
- All 7 sections present
- Cross-reference blockquotes use relative markdown links: `[general.md](general.md)`, `[architecture.md](architecture.md)`
- All tables render correctly (no broken pipes)
- All code blocks have language tags

- [ ] **Step 10: Commit**

```bash
git add code-conventions/testing.md
git commit -m "feat(conventions): add cross-cutting testing.md with 7 sections

Covers UI test identifiers, test naming, mocking boundaries, test data,
async testing, integration vs unit boundaries, and coverage philosophy."
```

---

### Task 2: Update dispatcher `claude/rules/code.md`

**Files:**
- Modify: `claude/rules/code.md`

**Depends on:** Task 1

- [ ] **Step 1: Add testing.md to the always-load list**

Between line 9 (logging.md) and line 10 (language-specific), insert:

```markdown
4. **Always load** [`testing.md`](../../code-conventions/testing.md) (cross-cutting testing conventions)
```

Renumber the existing step 4 ("Then load the language-specific file") to step 5 — change the literal `4.` to `5.` in the Markdown source.

- [ ] **Step 2: Update the load order line**

Change line 24 from:
```
Load order: [`general.md`](../../code-conventions/general.md) → [`architecture.md`](../../code-conventions/architecture.md) → [`logging.md`](../../code-conventions/logging.md) → language delta → [`database.md`](../../code-conventions/database.md) (if applicable).
```
To:
```
Load order: [`general.md`](../../code-conventions/general.md) → [`architecture.md`](../../code-conventions/architecture.md) → [`logging.md`](../../code-conventions/logging.md) → [`testing.md`](../../code-conventions/testing.md) → language delta → [`database.md`](../../code-conventions/database.md) (if applicable).
```

- [ ] **Step 3: Update the display rule confirmation block**

Change lines 44-51 from:
```
⚙ Code Conventions Loaded
  ✓ general
  ✓ architecture
  ✓ logging
  ✓ <language delta>
  ✓ database (if loaded)
  ✓ design/<system> (if loaded)
```
To:
```
⚙ Code Conventions Loaded
  ✓ general
  ✓ architecture
  ✓ logging
  ✓ testing
  ✓ <language delta>
  ✓ database (if loaded)
  ✓ design/<system> (if loaded)
```

- [ ] **Step 4: Verify the file**

Read `claude/rules/code.md` and confirm:
- testing.md appears in the always-load list (step 4)
- testing.md appears in the load order line
- testing appears in the display block between logging and language delta
- All relative links are correct: `../../code-conventions/testing.md`

- [ ] **Step 5: Commit**

```bash
git add claude/rules/code.md
git commit -m "feat(dispatcher): add testing.md to always-load list and display block"
```

---

### Task 3: Update `code-conventions/index.yaml`

**Files:**
- Modify: `code-conventions/index.yaml`

- [ ] **Step 1: Add testing.md entry**

After the `logging.md` block (lines 8-9), insert:

```yaml
  - file: testing.md
    description: "Cross-cutting testing conventions: UI test identifiers, naming, mocking, test data, async, boundaries, coverage"
```

This places it in the same position as the load order (after logging, before language deltas).

- [ ] **Step 2: Verify the file**

Read `code-conventions/index.yaml` and confirm:
- testing.md entry is present
- YAML is valid (consistent indentation: 2 spaces)
- Entry is between logging.md and javascript.md

- [ ] **Step 3: Commit**

```bash
git add code-conventions/index.yaml
git commit -m "feat(index): add testing.md to code-conventions index"
```

---

### Task 4: Update root `index.yaml`

**Files:**
- Modify: `index.yaml`

- [ ] **Step 1: Increment file_count**

Change line 15 from:
```yaml
    file_count: 9
```
To:
```yaml
    file_count: 10
```

- [ ] **Step 2: Verify the file**

Read `index.yaml` and confirm `code-conventions.file_count` is now `10`.

- [ ] **Step 3: Commit**

```bash
git add index.yaml
git commit -m "chore(index): bump code-conventions file_count to 10"
```

---

### Task 5: Trim `general.md` §9

**Files:**
- Modify: `code-conventions/general.md`

- [ ] **Step 1: Replace §9 content with pointer**

Change lines 60-64 from:
```markdown
### 9. Testing
- Tests must be deterministic
- Test business logic and edge cases
- Mock only external dependencies (database, network, filesystem, time)
- Name tests clearly: describe scenario and expected outcome
```
To:
```markdown
### 9. Testing
See [`testing.md`](testing.md) for all cross-cutting testing conventions (UI test identifiers, naming, mocking boundaries, test data, async, integration vs unit, coverage).
```

- [ ] **Step 2: Verify the file**

Read `code-conventions/general.md` lines 60-62 and confirm:
- §9 is now a single-line pointer
- The link `[testing.md](testing.md)` is a valid relative link from general.md's location
- §10 (Tooling) still follows immediately after

- [ ] **Step 3: Commit**

```bash
git add code-conventions/general.md
git commit -m "refactor(general): replace §9 testing rules with pointer to testing.md"
```

---

### Task 6: Final verification

- [ ] **Step 1: Verify all files are consistent**

Read these files and cross-check:
1. `code-conventions/testing.md` — exists, 7 sections, cross-references valid
2. `claude/rules/code.md` — testing.md in load list (step 4), load order line, display block
3. `code-conventions/index.yaml` — testing.md entry present
4. `index.yaml` — file_count is 10
5. `code-conventions/general.md` — §9 is pointer only

- [ ] **Step 2: Verify git log**

```bash
git log --oneline -5
```

Expected: 5 commits in order (Task 1-5).

- [ ] **Step 3: Update spec status**

In `docs/superpowers/specs/2026-03-20-testing-conventions-design.md`, change:
```
**Status:** Draft
```
To:
```
**Status:** Implemented
```

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-03-20-testing-conventions-design.md
git commit -m "chore(spec): mark testing-conventions spec as implemented"
```
