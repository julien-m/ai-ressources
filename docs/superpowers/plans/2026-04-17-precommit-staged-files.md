# Pre-commit Staged-File Awareness — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the `/conventions.init` and stack-command documentation so the generated pre-commit hook examples lint only staged files and do so with filename-safe shell patterns.

**Architecture:** This patch is intentionally limited to four files already in the diff: `claude/skills/conventions.init/SKILL.md`, `code-conventions/stack-commands.md`, this implementation plan, and the paired design note. Broader source-of-truth changes remain follow-up work outside this patch.

**Tech Stack:** Markdown/YAML skill files, POSIX sh hook scripts

---

## File Map

| File | Change |
|------|--------|
| `claude/skills/conventions.init/SKILL.md` | Replace unsafe staged-file examples with filename-safe `git diff ... -z | xargs -0 ...` examples for TypeScript + Biome and Python + Ruff |
| `code-conventions/stack-commands.md` | Align the stack table examples with the filename-safe staged-file shell pattern used by the generated hook examples |
| `docs/superpowers/plans/2026-04-17-precommit-staged-files.md` | Record the actual patch scope and the validation checklist for the documentation update |
| `docs/superpowers/specs/2026-04-17-precommit-staged-files-design.md` | Align the design note with the filename-safe shell pattern and clarify follow-up scope |

---

### Task 1: Update `conventions.init` Phase 7 hook examples

**Files:**
- Modify: `claude/skills/conventions.init/SKILL.md`

The examples in Phase 7 are the canonical reference for generated pre-commit hooks. They must use a filename-safe staged-file pattern.

**Required shell pattern:**

- Use `git diff --cached --quiet --diff-filter=ACMR -- <pathspecs>` to detect whether relevant staged files exist.
- Use `git diff --cached --name-only --diff-filter=ACMR -z -- <pathspecs> | xargs -0 ...` to invoke the linter.
- Do not use `tr '\n' ' '` or `eval "$1"` for staged filenames. Both are unsafe for filenames containing spaces.

- [x] **Step 1: Read the current Phase 7 examples**

Read the existing TypeScript + Biome and Python + Ruff examples in `claude/skills/conventions.init/SKILL.md`.

- [x] **Step 2: Replace newline-splitting snippets**

Update both examples to use `git diff --cached --quiet --diff-filter=ACMR` with Git pathspecs, followed by a `-z` / `xargs -0` execution pipeline.

- [x] **Step 3: Add a note explaining why**

Document that newline splitting and `eval "$1"` are not safe for filenames with spaces.

- [x] **Step 4: Re-read the edited section**

Verify the old `STAGED_TS=$(...)` / `STAGED_PY=$(...)` pattern is gone and both examples still end with the success message.

---

### Task 2: Align this plan with the actual patch scope

**Files:**
- Modify: `docs/superpowers/plans/2026-04-17-precommit-staged-files.md`

The original plan described edits to files that are not part of this patch. That makes the plan misleading as implementation documentation.

- [x] **Step 1: Rewrite the goal and architecture**

State clearly that this patch updates the `conventions.init` examples plus the companion plan/spec documents only.

- [x] **Step 2: Replace the file map**

List only the four files that are actually part of this change.

- [x] **Step 3: Remove out-of-scope implementation instructions**

Drop instructions for `conventions.refresh`, commits, asset sync, and index rebuilds from this plan revision.

- [x] **Step 4: Keep the document self-consistent**

Make sure the scope described here matches the files in the current diff.

---

### Task 3: Align the design note with the safe shell pattern

**Files:**
- Modify: `docs/superpowers/specs/2026-04-17-precommit-staged-files-design.md`

The design note must not describe a broken staged-file implementation.

- [x] **Step 1: Replace `tr '\n' ' '` examples**

Use the same `git diff --cached --quiet` plus `git diff ... -z | xargs -0 ...` pattern documented in the skill file.

- [x] **Step 2: Correct the narrative**

Remove references to unimplemented file edits in this patch. If future follow-up work is mentioned, label it explicitly as follow-up.

- [x] **Step 3: Re-read for consistency**

Verify that the plan and spec now describe the same safe shell approach and the same limited patch scope.

---

### Task 4: Align the stack command source-of-truth table

**Files:**
- Modify: `code-conventions/stack-commands.md`

The stack detection table must match the same staged-file shell pattern documented in the generated hook examples.

- [x] **Step 1: Update the staged-file note**

Document the `git diff --cached --quiet --diff-filter=ACMR` guard and the `-z` / `xargs -0` invocation pattern.

- [x] **Step 2: Update TypeScript and Python command rows**

Ensure the TypeScript + Biome, TypeScript + ESLint, and Python rows use the same filename-safe `ACMR` pattern as the skill file.

- [x] **Step 3: Re-read for consistency**

Verify the stack table, implementation plan, and design note all describe the same rename-aware staged-file approach.
