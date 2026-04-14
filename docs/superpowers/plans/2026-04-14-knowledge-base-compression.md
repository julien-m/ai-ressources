# Knowledge Base Compression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compress stack-ref/, code-conventions/, and architecture/ by 15-20% without losing any information (flags, defaults, normative rules, reasoning chains, cross-references).

**Architecture:** Three parallel domain subagents compress content-only (no file merges/splits), each validating normative markers and structural integrity before finishing. A sequential orchestrator step runs shared-file sync (compiled-index.txt, .last-updated) after all three complete with exit code 0.

**Tech Stack:** Markdown editing, bash (find, xargs, wc -l, grep), bun (build-index), git

**Spec:** `docs/superpowers/specs/2026-04-14-knowledge-base-compression-design.md`

**Baselines (Codex-verified):**
- stack-ref/: **6 175 lines** → target ≤ 4 940 (20%) or ≤ 5 249 (15%) depending on duplication measurement
- code-conventions/: **3 816 lines** → target ≤ 3 244 (15%)
- architecture/: **2 605 lines** → target ≤ 2 214 (15%)

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

**Context:** 61 `.md` files across 16 subdirectories, 6 175 lines total. Single `stack-ref/index.yaml` covers all files — no per-subdir indexes exist or should be created. `decision-matrix.md` (526L) is the largest. Target: 20% if measured duplication >40%, else 15%.

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

Expected: BEFORE=6175, plus marker and row counts.

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

- [ ] **Step 3: Compress decision-matrix.md (526 lines — largest file)**

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
- `AFTER` ≤ 4940 if target=20%, or ≤ 5249 if target=15%

If a criterion fails: `git diff stack-ref/` to identify which file has the regression. Restore that file: `git checkout HEAD -- stack-ref/<file>.md`. Recompress that file more conservatively (blank lines only). Re-run validation.

- [ ] **Step 6: Update stack-ref/index.yaml — last_reviewed only**

Open `stack-ref/index.yaml`. Find the `last_reviewed` field (top-level or under the domain entry). Set it to `2026-04-14`. Save. No other changes.

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

**Context:** 24 `.md` files, 3 816 lines. One `code-conventions/index.yaml`. Key pattern: language files (go, rust, python, etc.) may repeat rules from general.md. Target: 15% (≤ 3 244 lines).

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

Expected: BEFORE=3816.

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
- `AFTER` ≤ 3244

If normative marker regression: `git diff code-conventions/` to find the file. Restore: `git checkout HEAD -- code-conventions/<file>.md`. Recompress more conservatively. Re-run validation.

- [ ] **Step 5: Update code-conventions/index.yaml — last_reviewed only**

Set `last_reviewed: 2026-04-14`. No other changes.

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

**Context:** 8 `.md` files, 2 605 lines. All files 261-378 lines. One `architecture/index.yaml`. Contains ASCII flow diagrams — verify alignment after compaction. Target: 15% (≤ 2 214 lines).

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

Expected: BEFORE=2605.

- [ ] **Step 2: Compress event-driven.md (378 lines — largest)**

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
- `AFTER` ≤ 2214
- No ASCII diagram has broken alignment (boxes and arrows readable)

- [ ] **Step 6: Update architecture/index.yaml — last_reviewed only**

Set `last_reviewed: 2026-04-14`. No other changes.

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

- [ ] **Step 2: Rebuild compiled-index.txt**

```bash
cd /Users/julienm/projects/ai-ressources
bun run build-index
```

If this exits non-zero: STOP. Do not write `.last-updated`. Do not commit. Report the error output.

- [ ] **Step 3: Write .last-updated**

```bash
cd /Users/julienm/projects/ai-ressources
date +%Y-%m-%d > .last-updated
cat .last-updated
```

Expected output: `2026-04-14`

- [ ] **Step 4: Verify domain-catalog.md is unchanged**

```bash
cd /Users/julienm/projects/ai-ressources
git diff domain-catalog.md
```

Expected: no diff. If diff exists, review it — subagents should not have touched this file. Revert if needed: `git checkout HEAD -- domain-catalog.md`

- [ ] **Step 5: Commit index sync**

```bash
cd /Users/julienm/projects/ai-ressources
git add compiled-index.txt .last-updated
git commit -m "refactor(compress): sync indexes post-compression"
```

- [ ] **Step 6: Print final summary**

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
