# Knowledge Base Compression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve and, where still possible, further compress `stack-ref/`, `code-conventions/`, and `architecture/` without losing any information (flags, defaults, normative rules, reasoning chains, cross-references).

**Architecture:** Three parallel domain subagents compress content-only (no file merges/splits), each validating normative markers and structural integrity before finishing. A sequential orchestrator step runs shared-file sync (`index.yaml`, `compiled-index.txt`, `.last-updated`) after all three complete with exit code 0, unless the caller has imposed a narrower writable-file scope for the run.

**Tech Stack:** Markdown editing, bash (find, xargs, wc -l, grep), bun (build-index), git

**Spec:** `docs/superpowers/specs/2026-04-14-knowledge-base-compression-design.md`

**Baselines (Codex-verified, current repo snapshot):**
- `stack-ref/`: **5 113 lines** across **61 files**. Historical 15% ceiling (**≤ 5 249**) is already met; stretch ceiling remains **≤ 4 940** if duplication still justifies more trimming.
- `code-conventions/`: **3 244 lines** across **24 files**. Historical 15% ceiling (**≤ 3 244**) is already met; re-runs must not regress above the current snapshot.
- `architecture/`: **2 212 lines** across **8 files**. Historical 15% ceiling (**≤ 2 214**) is already met; re-runs must not regress above the current snapshot.

**Planning note:** This document reflects the repository state on `2026-04-14`. If you run it from an older branch with higher counts, use the historical ceilings above. If you run it from the current snapshot, treat the work as zero-loss cleanup only.

**Mandatory measurement command (all tasks):**
```bash
LINES=$(find <domain> -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
```

**Build script:** `bun run build-index` (package.json key, not direct ts path)

---

## Tasks 1–3 are INDEPENDENT and MUST run in parallel (one subagent per domain)

Task 4 runs ONLY after Tasks 1, 2, and 3 have ALL completed successfully (exit 0).

---

### Task 1: Compress stack-ref/

**Context:** 61 `.md` files, 5 113 lines total. Single `stack-ref/index.yaml` covers all files — no per-subdir indexes exist or should be created. `decision-matrix.md` (416L) is the largest. Historical target: 20% if measured duplication >40%, else 15%. Current snapshot already satisfies the 15% ceiling.

**Constraint:** Content-only edits. No file creates, renames, or deletes.

- [ ] **Step 1: Record baseline metrics**

```bash
cd /Users/julienm/projects/ai-ressources
BEFORE=$(find stack-ref -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
MARKERS_BEFORE=$(grep -rc 'MUST\|SHOULD\|NEVER\|toujours\|jamais\|obligatoire\|interdit\|required\|forbidden\|must not\|should not' stack-ref/ --include="*.md" | awk -F: '{sum+=$2} END{print sum}')
ROWS_BEFORE=$(grep -rc '|' stack-ref/ --include="*.md" | awk -F: '{sum+=$2} END{print sum}')
echo "stackref_before=$BEFORE" > /tmp/stackref-metrics.txt
echo "stackref_markers_before=$MARKERS_BEFORE" >> /tmp/stackref-metrics.txt
echo "stackref_rows_before=$ROWS_BEFORE" >> /tmp/stackref-metrics.txt
cat /tmp/stackref-metrics.txt
```

Expected on the current snapshot: `BEFORE=5113`, plus marker and row counts.

- [ ] **Step 2: Measure duplication to set compression target**

```bash
cd /Users/julienm/projects/ai-ressources
# Count unique headings in decision-matrix.md
echo "=== decision-matrix headings ==="
grep '^## ' stack-ref/decision-matrix.md | wc -l
# Check how many also appear in quick-ref or service files
grep '^## ' stack-ref/decision-matrix.md | while read heading; do
  count=$(grep -rl "$heading" stack-ref/ --include="*.md" | wc -l)
  echo "$count $heading"
done | sort -rn | head -20
```

If more than 40% of `decision-matrix.md` headings appear in 2+ files → **target 20%** (≤ 4 940 lines). Otherwise → **target 15%** (≤ 5 249 lines). Record the target:

```bash
echo "stackref_target_pct=20" >> /tmp/stackref-metrics.txt  # or 15
```

- [ ] **Step 3: Compress decision-matrix.md (416 lines — largest file)**

Apply in order:
1. **Tables instead of prose repetition**: Find any section listing the same attributes per service/variant (e.g., cost/limit/use-case repeated N times as prose). Convert to a comparison table where each row is a service. Preserve every value, condition, and "because/to avoid" clause in table cells.
2. **Merge duplicate sections**: If the same criteria list appears in multiple places (overview + detail), keep the detail section only.
3. **Remove excessive blank lines**: Max 1 blank line between `##` sections, 0 within lists and tables.
4. **Consolidate cross-references**: If "See also / Read" links appear 5+ times, create a "References" block at file head.

Preservation invariants (check after each section modified):
- Every service name present before → present after
- Every price/limit/quota value → verbatim in output
- Every "use when" / "avoid when" condition → in output
- Every flag name (e.g., `--workers`, env vars) → verbatim

- [ ] **Step 4: Compress all remaining stack-ref files (dynamic discovery)**

```bash
cd /Users/julienm/projects/ai-ressources
# Discover all .md files sorted by size descending (process largest first)
find stack-ref -name "*.md" ! -path "stack-ref/decision-matrix.md" ! -name "_template.md" \
  -exec wc -l {} + | sort -rn | grep -v total | awk '{print $2}'
```

For each file in that order, apply:
1. **Remove excessive blank lines** (highest impact for most files): max 1 blank between `##`, 0 within lists.
2. **Convert multi-line option lists to tables** when the same 3+ attributes repeat per option:
   ```
   Before:
   ### Option A
   - Cost: $5/month
   - Limit: 100k req
   - Best for: hobby

   After:
   | Option | Cost | Limit | Best for |
   |--------|------|-------|----------|
   | A | $5/mo | 100k req | hobby |
   ```
3. **Merge duplicated criteria**: If "Pros" prose text repeats content already in a table above, remove the prose.
4. **Remove repeated decision-matrix cross-refs**: Keep only the first "See decision-matrix for comparison" per file.

Files <60 lines: apply blank line reduction only — don't risk losing information in already-compact files.

- [ ] **Step 5: Validate — normative markers, table rows, line count**

```bash
cd /Users/julienm/projects/ai-ressources
source /tmp/stackref-metrics.txt
AFTER=$(find stack-ref -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
MARKERS_AFTER=$(grep -rc 'MUST\|SHOULD\|NEVER\|toujours\|jamais\|obligatoire\|interdit\|required\|forbidden\|must not\|should not' stack-ref/ --include="*.md" | awk -F: '{sum+=$2} END{print sum}')
ROWS_AFTER=$(grep -rc '|' stack-ref/ --include="*.md" | awk -F: '{sum+=$2} END{print sum}')
PCT=$(awk "BEGIN {printf \"%.1f\", ($stackref_before-$AFTER)/$stackref_before*100}")
echo "Lines: $stackref_before → $AFTER (-${PCT}%)"
echo "Normative markers: $stackref_markers_before → $MARKERS_AFTER"
echo "Table rows: $stackref_rows_before → $ROWS_AFTER"
```

**Acceptance criteria:**
- `MARKERS_AFTER` ≥ `MARKERS_BEFORE`
- `ROWS_AFTER` ≥ `ROWS_BEFORE`
- If `BEFORE` > 5249: `AFTER` ≤ 4940 if target=20%, or ≤ 5249 if target=15%
- If `BEFORE` ≤ 5249: `AFTER` ≤ `BEFORE` (no regression from the verified current snapshot)

If a criterion fails: inspect `git diff stack-ref/` to identify the regression, manually restore the affected section from `HEAD`, recompress more conservatively (blank lines only), then re-run validation.

- [ ] **Step 6: Confirm stack-ref/index.yaml needs no local freshness edit**

`stack-ref/index.yaml` does not expose a local `last_reviewed` field in the current schema. Leave it unchanged unless a file path or description changed during the compression pass. Root freshness is handled later in Task 4 via the root `index.yaml`.

- [ ] **Step 7: Commit stack-ref/ (one commit, after full validation)**

```bash
cd /Users/julienm/projects/ai-ressources
source /tmp/stackref-metrics.txt
AFTER=$(find stack-ref -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
COUNT=$(git diff --name-only | grep '^stack-ref/' | wc -l | tr -d ' ')
PCT=$(awk "BEGIN {printf \"%.1f\", ($stackref_before-$AFTER)/$stackref_before*100}")
git add stack-ref/
git commit -m "refactor(compress): stack-ref — ${COUNT} files, ${stackref_before}→${AFTER} lines (-${PCT}%)"
echo "stackref_exit=0" >> /tmp/stackref-metrics.txt
```

Record `stackref_exit=0` to signal success to the orchestrator (Task 4).

---

### Task 2: Compress code-conventions/

**Context:** 24 `.md` files, 3 244 lines. One `code-conventions/index.yaml`. Key pattern: language files (go, rust, python, etc.) may repeat rules from `general.md`. Historical target: 15% (≤ 3 244 lines), already met on the current snapshot.

**Constraint:** Content-only edits. No file creates, renames, or deletes.

- [ ] **Step 1: Record baseline metrics**

```bash
cd /Users/julienm/projects/ai-ressources
BEFORE=$(find code-conventions -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
MARKERS_BEFORE=$(grep -rc 'MUST\|SHOULD\|NEVER\|toujours\|jamais\|obligatoire\|interdit\|required\|forbidden\|must not\|should not\|always\|never use\|prefer\|avoid' code-conventions/ --include="*.md" | awk -F: '{sum+=$2} END{print sum}')
echo "codeconventions_before=$BEFORE" > /tmp/codeconventions-metrics.txt
echo "codeconventions_markers_before=$MARKERS_BEFORE" >> /tmp/codeconventions-metrics.txt
cat /tmp/codeconventions-metrics.txt
```

Expected on the current snapshot: `BEFORE=3244`.

- [ ] **Step 2: Identify baseline+delta pattern in language files**

```bash
cd /Users/julienm/projects/ai-ressources
# Find lines that appear identically in general.md AND a language file
comm -12 <(sort code-conventions/general.md) <(sort code-conventions/go.md) | grep -v '^\s*$' | head -20
comm -12 <(sort code-conventions/general.md) <(sort code-conventions/python.md) | grep -v '^\s*$' | head -20
comm -12 <(sort code-conventions/general.md) <(sort code-conventions/rust.md) | grep -v '^\s*$' | head -20
```

Lines appearing identically in general.md AND a language file are candidates for removal in the language file (the general rule applies via loading order). Exception: keep any line where the language file adds context via surrounding text.

- [ ] **Step 3: Compress files from largest to smallest (dynamic discovery)**

```bash
cd /Users/julienm/projects/ai-ressources
find code-conventions -name "*.md" -exec wc -l {} + | sort -rn | grep -v total | awk '{print $2}'
```

Process in that order. For each file:
1. **Remove excessive blank lines**: max 1 blank between `##`, 0 within lists/tables.
2. **Remove delta-identical lines** (from Step 2 analysis): lines verbatim in general.md → remove from language files.
3. **Convert repeated test/rule structure to table**: if a file lists the same 3+ attributes for multiple patterns, convert to comparison table.
4. **Merge duplicate caveats**: if the same caveat ("remember to handle migrations", "check types") appears at end of multiple sections, hoist to a single "Common gotchas" or "Notes" section.
5. **Config block deduplication**: if an env var appears explained in prose AND in a code block, keep only the code block with inline comment.

Files <60 lines: blank line reduction only.

- [ ] **Step 4: Validate normative markers**

```bash
cd /Users/julienm/projects/ai-ressources
source /tmp/codeconventions-metrics.txt
AFTER=$(find code-conventions -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
MARKERS_AFTER=$(grep -rc 'MUST\|SHOULD\|NEVER\|toujours\|jamais\|obligatoire\|interdit\|required\|forbidden\|must not\|should not\|always\|never use\|prefer\|avoid' code-conventions/ --include="*.md" | awk -F: '{sum+=$2} END{print sum}')
PCT=$(awk "BEGIN {printf \"%.1f\", ($codeconventions_before-$AFTER)/$codeconventions_before*100}")
echo "Lines: $codeconventions_before → $AFTER (-${PCT}%)"
echo "Normative markers: $codeconventions_markers_before → $MARKERS_AFTER"
```

**Acceptance criteria:**
- `MARKERS_AFTER` ≥ `MARKERS_BEFORE`
- If `BEFORE` > 3244: `AFTER` ≤ 3244
- If `BEFORE` ≤ 3244: `AFTER` ≤ `BEFORE`

If normative marker regression: inspect `git diff code-conventions/` to find the file, manually restore the affected section from `HEAD`, recompress more conservatively, then re-run validation.

- [ ] **Step 5: Confirm code-conventions/index.yaml needs no local freshness edit**

`code-conventions/index.yaml` does not expose a local `last_reviewed` field in the current schema. Leave it unchanged unless a file path or description changed during the compression pass. Root freshness is handled later in Task 4 via the root `index.yaml`.

- [ ] **Step 6: Commit code-conventions/ (one commit, after full validation)**

```bash
cd /Users/julienm/projects/ai-ressources
source /tmp/codeconventions-metrics.txt
AFTER=$(find code-conventions -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
COUNT=$(git diff --name-only | grep '^code-conventions/' | wc -l | tr -d ' ')
PCT=$(awk "BEGIN {printf \"%.1f\", ($codeconventions_before-$AFTER)/$codeconventions_before*100}")
git add code-conventions/
git commit -m "refactor(compress): code-conventions — ${COUNT} files, ${codeconventions_before}→${AFTER} lines (-${PCT}%)"
echo "codeconventions_exit=0" >> /tmp/codeconventions-metrics.txt
```

---

### Task 3: Compress architecture/

**Context:** 8 `.md` files, 2 212 lines. All files are roughly 253-315 lines. One `architecture/index.yaml`. Contains ASCII flow diagrams — verify alignment after compaction. Historical target: 15% (≤ 2 214 lines), already met on the current snapshot.

**Constraint:** Content-only edits. No file creates, renames, or deletes.

- [ ] **Step 1: Record baseline metrics**

```bash
cd /Users/julienm/projects/ai-ressources
BEFORE=$(find architecture -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
MARKERS_BEFORE=$(grep -rc 'MUST\|SHOULD\|NEVER\|toujours\|jamais\|obligatoire\|interdit\|required\|forbidden\|must not\|should not\|always\|avoid\|prefer' architecture/ --include="*.md" | awk -F: '{sum+=$2} END{print sum}')
echo "architecture_before=$BEFORE" > /tmp/architecture-metrics.txt
echo "architecture_markers_before=$MARKERS_BEFORE" >> /tmp/architecture-metrics.txt
cat /tmp/architecture-metrics.txt
```

Expected on the current snapshot: `BEFORE=2212`.

- [ ] **Step 2: Compress event-driven.md (315 lines — largest)**

Apply:
1. **Blank line reduction**: max 1 between `##`, 0 within lists.
2. **ASCII diagram compaction**: reduce internal padding to 2 spaces, remove blank lines inside box diagrams. Immediately after editing each diagram, visually inspect it:
   ```bash
   grep -A 30 '^\`\`\`' architecture/event-driven.md | head -40
   ```
   Verify boxes are aligned and arrows intact before moving to next technique.
3. **Error condition tables**: if retry logic, dead-letter queue, timeout handling appear as prose in 2+ places, consolidate into one table: `| Condition | Behavior | Recovery |`
4. **Sequence deduplication**: if a consumer→producer→broker sequence is described twice (overview + detail), keep the detailed version only.

- [ ] **Step 3: Compress caching-strategies.md, auth-flows.md, webhook-patterns.md**

Apply:
1. Blank line reduction.
2. **Strategy comparison tables**: if multiple strategies (read-through, write-through, cache-aside, etc.) each have a prose section with the same sub-attributes, convert to comparison table.
3. **Auth error deduplication**: `auth-flows.md` likely has similar error handling (invalid token → 401, expired → refresh → retry) repeated for multiple flow types. Consolidate into a shared "Error responses" table, referenced by each flow section.
4. **Webhook condition tables**: "when payload is invalid", "when signature fails", "when idempotency key exists" → convert to `| Case | Action | HTTP status |`

- [ ] **Step 4: Compress database-migrations.md, rate-limiting.md, background-jobs.md**

Apply:
1. Blank line reduction.
2. **Migration step compaction**: if additive/breaking/data migration types each repeat the same 4-step process with minor variations, convert to a table of variations.
3. **Rate limiting algorithm tables**: if token bucket, sliding window, fixed window are described with same attributes in prose, convert to comparison table.
4. For `background-jobs.md` (261L, smallest): blank line reduction only unless obvious prose→table opportunities exist. Target ≥ 10% acceptable if file is already lean.

- [ ] **Step 5: Validate normative markers and ASCII diagram integrity**

```bash
cd /Users/julienm/projects/ai-ressources
source /tmp/architecture-metrics.txt
AFTER=$(find architecture -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
MARKERS_AFTER=$(grep -rc 'MUST\|SHOULD\|NEVER\|toujours\|jamais\|obligatoire\|interdit\|required\|forbidden\|must not\|should not\|always\|avoid\|prefer' architecture/ --include="*.md" | awk -F: '{sum+=$2} END{print sum}')
PCT=$(awk "BEGIN {printf \"%.1f\", ($architecture_before-$AFTER)/$architecture_before*100}")
echo "Lines: $architecture_before → $AFTER (-${PCT}%)"
echo "Normative markers: $architecture_markers_before → $MARKERS_AFTER"
```

Then verify ASCII diagrams in the two files most likely to contain them:
```bash
grep -n '^\`\`\`' architecture/event-driven.md architecture/auth-flows.md
# Visually inspect each code block containing diagram chars (│, ─, ┼, →, ←, ↑, ↓, +, |)
grep -n '[│─┼→←↑↓]' architecture/event-driven.md | head -10
```

**Acceptance criteria:**
- `MARKERS_AFTER` ≥ `MARKERS_BEFORE`
- If `BEFORE` > 2214: `AFTER` ≤ 2214
- If `BEFORE` ≤ 2214: `AFTER` ≤ `BEFORE`
- No ASCII diagram has broken alignment (boxes and arrows readable)

- [ ] **Step 6: Confirm architecture/index.yaml needs no local freshness edit**

`architecture/index.yaml` does not expose a local `last_reviewed` field in the current schema. Leave it unchanged unless a file path or description changed during the compression pass. Root freshness is handled later in Task 4 via the root `index.yaml`.

- [ ] **Step 7: Commit architecture/ (one commit, after full validation)**

```bash
cd /Users/julienm/projects/ai-ressources
source /tmp/architecture-metrics.txt
AFTER=$(find architecture -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
COUNT=$(git diff --name-only | grep '^architecture/' | wc -l | tr -d ' ')
PCT=$(awk "BEGIN {printf \"%.1f\", ($architecture_before-$AFTER)/$architecture_before*100}")
git add architecture/
git commit -m "refactor(compress): architecture — ${COUNT} files, ${architecture_before}→${AFTER} lines (-${PCT}%)"
echo "architecture_exit=0" >> /tmp/architecture-metrics.txt
```

---

### Task 4: Orchestrator — Sync shared files (SEQUENTIAL, after Tasks 1-3 all exit 0)

**Precondition check:** This task MUST NOT run if any of Tasks 1, 2, or 3 failed. Verify:

- [ ] **Step 1: Verify all domain tasks succeeded**

```bash
cd /Users/julienm/projects/ai-ressources
STACKREF_OK=$(grep -c 'stackref_exit=0' /tmp/stackref-metrics.txt 2>/dev/null || echo 0)
CODECONV_OK=$(grep -c 'codeconventions_exit=0' /tmp/codeconventions-metrics.txt 2>/dev/null || echo 0)
ARCH_OK=$(grep -c 'architecture_exit=0' /tmp/architecture-metrics.txt 2>/dev/null || echo 0)
echo "stack-ref: $STACKREF_OK | code-conventions: $CODECONV_OK | architecture: $ARCH_OK"
if [ "$STACKREF_OK" != "1" ] || [ "$CODECONV_OK" != "1" ] || [ "$ARCH_OK" != "1" ]; then
  echo "ERROR: Not all domain tasks completed successfully. Aborting orchestrator sync."
  exit 1
fi
echo "All domain tasks verified. Proceeding with shared-file sync."
```

If any task shows 0: STOP. Do not proceed. Report which domains are incomplete.

- [ ] **Step 2: Update root index freshness**

```bash
cd /Users/julienm/projects/ai-ressources
rg -n '^(  stack-ref:|  code-conventions:|  architecture:|    last_reviewed:)' index.yaml
```

Confirm the root `index.yaml` domain entries for `stack-ref`, `code-conventions`, and `architecture` have `last_reviewed: 2026-04-14`. Update `index.yaml` before continuing if any entry is stale.

- [ ] **Step 3: Rebuild compiled-index.txt**

```bash
cd /Users/julienm/projects/ai-ressources
bun run build-index
```

If this exits non-zero: STOP. Do not write `.last-updated`. Do not commit. Report the error output. If the current task scope forbids editing `.last-updated`, stop after reporting the successful rebuild and note the remaining required sync explicitly.

- [ ] **Step 4: Write .last-updated**

```bash
cd /Users/julienm/projects/ai-ressources
date +%Y-%m-%d > .last-updated
cat .last-updated
```

Expected output on 2026-04-14: `2026-04-14`

If the current task scope forbids editing `.last-updated`, record that constraint in the final report instead of writing the file silently.

- [ ] **Step 5: Verify only shared sync artifacts changed in this phase**

```bash
cd /Users/julienm/projects/ai-ressources
git diff --name-only -- index.yaml compiled-index.txt .last-updated
```

Expected: only `index.yaml`, `compiled-index.txt`, and `.last-updated` appear here.

- [ ] **Step 6: Commit index sync**

```bash
cd /Users/julienm/projects/ai-ressources
git add index.yaml compiled-index.txt .last-updated
git commit -m "refactor(compress): sync indexes post-compression"
```

- [ ] **Step 7: Print final summary**

```bash
cd /Users/julienm/projects/ai-ressources
echo "=== COMPRESSION COMPLETE ==="
echo ""
echo "stack-ref/:"
source /tmp/stackref-metrics.txt
AFTER=$(find stack-ref -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
echo "  $stackref_before → $AFTER lines ($(awk "BEGIN {printf \"%.1f\", ($stackref_before-$AFTER)/$stackref_before*100}")%)"
echo ""
echo "code-conventions/:"
source /tmp/codeconventions-metrics.txt
AFTER=$(find code-conventions -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
echo "  $codeconventions_before → $AFTER lines ($(awk "BEGIN {printf \"%.1f\", ($codeconventions_before-$AFTER)/$codeconventions_before*100}")%)"
echo ""
echo "architecture/:"
source /tmp/architecture-metrics.txt
AFTER=$(find architecture -name "*.md" | xargs wc -l | tail -1 | awk '{print $1}')
echo "  $architecture_before → $AFTER lines ($(awk "BEGIN {printf \"%.1f\", ($architecture_before-$AFTER)/$architecture_before*100}")%)"
echo ""
git log --oneline -5
```
