---
name: conventions-refresh
description: "Check if project conventions need migration or refresh from ai-ressources. Use when conventions may be outdated or after ai-ressources updates."
argument-hint: "[--full] [--security <keep|none|baseline|production|public|web-staging>]"
---

# /conventions-refresh — Refresh Project Conventions

## Goal
Bring `.conventions/manifest.yaml` to current state by detecting old format, comparing the manifest date against `ai-ressources/.last-updated`, rebuilding via `build-conventions.ts` when stale, ensuring `.gitignore` excludes generated convention/agent state, and refreshing hook/CI/security workflows when stack markers or the requested security profile changed — without recompiling content (sources are read directly from ai-ressources).

## Execution context
- Mode: apply
- Month: 2026-06

## Anti-drift rules (apply to all steps)
- Execute steps in the exact numbered order. Do NOT reorder, parallelise, merge, or skip.
- Do NOT start step N+1 until step N success criteria are met.
- Do NOT assume `.conventions/` shape — observe it.
- Run commands as written. Policy-block → `BLOCKED at step N - policy_blocked - <reason>`.
- `timeout=90s`, `max_retries=1` per command.
- Failure → stop, do not silently substitute.
- `--full` flag changes routing in step 2 only — never invented when absent.
- `--security keep` is the default; explicit profiles are `none|baseline|production|public|web-staging`.
- Date comparison is the staleness signal. Per-file hashes are explicitly NOT used.

## Steps

### 1. Validate context and parse flags
**Prerequisite**: None.

**Required inputs/resources**:
- `pwd` (must be a target project, NOT `~/projects/ai-ressources`).
- `~/projects/ai-ressources/` must exist.
- Argument string (may contain `--full` and/or `--security <keep|none|baseline|production|public|web-staging>`).

**Action**:
1. Confirm cwd ≠ ai-ressources path.
2. Confirm `~/projects/ai-ressources/` is readable.
3. Set `full = true` iff `--full` token present in arguments.
4. Set `securityProfileRequested = keep` unless `--security <profile>` is present. Reject values outside `keep|none|baseline|production|public|web-staging`.

**Execution evidence**:
- `pwd`, `full` boolean, `securityProfileRequested`.

**Success criteria**:
- Resolved cwd, flag, and security profile request.
- ai-ressources reachable.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=1 type=missing_dependency ...`. Stop.

---

### 2. Detect format and route
**Prerequisite**: Step 1 met.

**Required inputs/resources**:
- `.conventions/` directory contents.

**Action**:
- **Case A — Old compiled format**: any of `.conventions/design.md`, `.conventions/code.md`, `.conventions/conventions.manifest.json` exists.
  1. Print: `Old compiled format detected. Migrating to manifest format.`
  2. Record `OLD_COMPILED_FILES` as the observed old-format artifacts in `.conventions/` (`design.md`, `code.md`, `conventions.manifest.json`, plus any other pre-existing per-domain `*.md` except `index.md`).
  3. Jump to step 5 with `migration=true`. Step 5 (migration mode) handles the migration atomically: run init Phases 1–4 (re-detect + user confirm + `build-conventions.ts`), and only on build success delete `OLD_COMPILED_FILES`. On any failure (detection error, user cancel, build non-zero exit), the old compiled files remain in place.
  4. After step 6 success, print: `Migration complete. Old compiled files removed.` Stop (do not run steps 3–4, 7).
- **Case B — No `.conventions/` or no `manifest.yaml`**:
  1. Print: ``No `.conventions/manifest.yaml` found. Run `/conventions-init` to set up.``
  2. Stop.
- **Case C — `manifest.yaml` exists**:
  - If `full == true` → jump to step 5 with `full=true` (skip staleness check).
  - Else → proceed to step 3.

**Execution evidence**:
- Resolved `case ∈ {A, B, C}`, plus chosen branch (`migrate | init-needed | full | staleness-check`).

**Success criteria**:
- Branch deterministically selected from observed file presence and flag.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=2 type=verification_failed ...`. Stop.

---

### 3. Detect staleness via date comparison
**Prerequisite**: Step 2 routed to staleness-check (Case C, `full=false`).

**Required inputs/resources**:
- `.conventions/manifest.yaml` (`generated:`, `ai_resources_path:` keys).
- `<ai_resources_path>/.last-updated` file.

**Action**:
```bash
MANIFEST_DATE=$(grep "^generated:" .conventions/manifest.yaml | awk '{print $2}')
AI_RES_PATH=$(grep "^ai_resources_path:" .conventions/manifest.yaml | awk '{print $2}')
LAST_UPDATED=$(cat "$AI_RES_PATH/.last-updated" 2>/dev/null || echo "unknown")
echo "Manifest generated: $MANIFEST_DATE"
echo "ai-ressources last updated: $LAST_UPDATED"
```
- If `LAST_UPDATED == "unknown"` → print: ``Cannot read `ai-ressources/.last-updated` — run `/conventions-refresh --full` to force refresh.`` Stop (no rebuild).
- If `LAST_UPDATED ≤ MANIFEST_DATE` → print `Conventions up to date.` Proceed to step 6.
- If `LAST_UPDATED > MANIFEST_DATE` → proceed to step 4.

**Execution evidence**:
- Both date strings printed; chosen branch.

**Success criteria**:
- Both keys parsed from manifest.
- Branch selected from observed comparison only.

**If this step fails**:
- Retry once for transient read failures.
- Terminal: `ERROR step=3 type=<command_failed|verification_failed> ...`. Stop.

---

### 4. Reconstruct domains JSON from manifest
**Prerequisite**: Step 3 selected `stale → rebuild` branch.

**Required inputs/resources**:
- `.conventions/manifest.yaml`.
- `bun` available.

**Action**:
The `bun -e` snippet `import { parse } from 'yaml'` resolves the `yaml` package from cwd. The target project is rarely a Node project, so run from `~/projects/ai-ressources` (which has `yaml` installed) and read the manifest via an absolute path:

```bash
export MANIFEST_ABS="$(pwd)/.conventions/manifest.yaml"
DOMAINS_JSON=$(cd ~/projects/ai-ressources && bun -e "
  import { parse } from 'yaml';
  import { readFileSync } from 'fs';
  const m = parse(readFileSync(process.env.MANIFEST_ABS,'utf-8'));
  const domains = {};
  for (const [key, dom] of Object.entries(m.domains)) {
    if (key.startsWith('design-')) {
      domains[key] = [];
    } else if (key === 'code') {
      domains[key] = dom.sources.map(s => s.replace('code-conventions/','').replace('.md',''));
    } else {
      domains[key] = dom.sources.map(s => s.split('/').pop().replace('.md',''));
    }
  }
  console.log(JSON.stringify(domains));
")
```

`MANIFEST_ABS` MUST be exported (or prefixed inline as `MANIFEST_ABS=... bun -e "..."` — but inline placement applies only when the assignment precedes the command; placing it after the closing quote turns it into a positional argument). Verify with `[ -n "$DOMAINS_JSON" ]` before proceeding.

Never run the snippet directly from the target project's cwd — the `yaml` import will fail on any non-Node repo.
- Mapping rules (verbatim): `design-*` → `[]`; `code` → strip `code-conventions/` prefix and `.md`; other keys → strip dir prefix and `.md`.

**Execution evidence**:
- Captured `DOMAINS_JSON` string (parses as JSON object).

**Success criteria**:
- JSON parses.
- Every original manifest domain key is present in the JSON.
- All `design-*` values are `[]`.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=4 type=<command_failed|verification_failed> ...`. Stop.

---

### 5. Rebuild manifest via build-conventions.ts
**Prerequisite**: Step 4 success criteria met (or step 2 jumped here for migration / `--full`).

**Required inputs/resources**:
- `~/projects/ai-ressources/scripts/build-conventions.ts`.
- For migration / `--full`: re-run `/conventions-init` Phases 1–4 to regenerate `DOMAINS_JSON` from current project signals (NOT from old manifest). For staleness rebuild: use step 4 JSON.

**Action**:

1. Run the build:
   ```bash
   bun run ~/projects/ai-ressources/scripts/build-conventions.ts "$(pwd)" "$DOMAINS_JSON"
   ```
   `timeout=90s`, `max_retries=1`.

2. **Migration-mode atomic cleanup** (only when `migration=true` from step 2 Case A):
   - If exit code ≠ 0 → STOP. Do NOT delete anything. Old compiled files remain intact.
   - If exit code == 0 → delete only the `OLD_COMPILED_FILES` recorded in step 2. Do this in the same step before asserting the success criterion.

   In non-migration mode, no cleanup is performed (manifest format never produces stale per-domain files).

**Execution evidence**:
- Stdout `✓` lines; `ls .conventions/` post-run (and post-cleanup if migration).
- Migration mode only: explicit list of deleted files.

**Success criteria**:
- Exit code 0.
- `.conventions/` contains exactly `manifest.yaml` + `index.md` (no per-domain `.md`).
- New `manifest.yaml generated:` date ≥ today.
- Migration mode: deletion list exactly matches `OLD_COMPILED_FILES`; no deletion happens before build success.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=5 type=command_failed retry_count=1 timed_out=<bool> message="<stderr>"`. Stop.

---

### 6. Ensure `.gitignore` exclusions
**Prerequisite**: Step 3 ended `up to date`, OR step 5 succeeded.

**Required inputs/resources**: project `.gitignore`, `.git/` presence.

**Action**:
- Required exclusions: `.conventions/`, `.claude/`, `.agents/`.
- If `.gitignore` exists → append only missing required exclusions under:
  ```gitignore
  # Materialized conventions and local agent state
  .conventions/
  .claude/
  .agents/
  ```
- If absent and `.git/` exists → create `.gitignore` with the block above.
- If no `.git/` → skip.

**Execution evidence**:
- Diff or hash of `.gitignore` before/after, or explicit "skipped (no .git)".

**Success criteria**:
- `.gitignore` contains `.conventions/`, `.claude/`, and `.agents/`, or step skipped due to no git.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=6 type=command_failed ...`. Stop.

---

### 7. Stack tracking — refresh hook, CI, and security if needed
**Prerequisite**: Step 6 success criteria met.

**Required inputs/resources**:
- `.conventions/manifest.yaml stack.markers` (previous markers).
- `.conventions/manifest.yaml stack.securityProfile` and `stack.securityMatrixVersion` when present.
- **Read** [`~/projects/ai-ressources/.agent-sync/skills/conventions-init/references/security-profiles.md`](~/projects/ai-ressources/.agent-sync/skills/conventions-init/references/security-profiles.md)
- Current project root markers per `stack-commands.md` detection.

**Action**:
1. Re-run stack detection on current project root.
2. Compute `markersChanged = (currentMarkers != manifestStack.markers)`.
3. Resolve `currentSecurityProfile`:
   - If manifest has `stack.securityProfile`, use it.
   - Else if generated `.github/workflows/security.yml` exists with `# @generated by conventions-init`, infer `baseline`.
   - Else infer `none`.
   Print `Security profile inferred: <currentSecurityProfile>` before changing anything.
4. Compute `targetSecurityProfile = securityProfileRequested == keep ? currentSecurityProfile : securityProfileRequested`.
5. Compute `securityChanged = targetSecurityProfile != currentSecurityProfile OR stack.securityMatrixVersion != "2026-06-30" OR expected generated security workflow state differs from targetSecurityProfile`.
6. If `markersChanged`:
   - Re-run `/conventions-init` Phase 7 (pre-commit hook regeneration) under its own success criteria.
   - Re-run `/conventions-init` Phase 8 (CI workflows) under its own success criteria with `--security <targetSecurityProfile>`.
   - Update `manifest.yaml stack:` block accordingly.
7. Else if `securityChanged`:
   - Re-run only `/conventions-init` Phase 8 security branch with `--security <targetSecurityProfile>`.
   - If `targetSecurityProfile == none`, remove `.github/workflows/security.yml` only when it contains `# @generated by conventions-init`; if it lacks the sentinel, prompt `keep / remove` defaulting to `keep`, then update `securityGenerated: []`.
   - Update `stack.securityProfile`, `stack.securityGenerated[]`, `stack.securityMatrixVersion`, and `stack.stagingUrlSecret` when applicable.
8. Else: print `Stack unchanged and security profile unchanged — hook, CI, and security left as-is.`

**Execution evidence**:
- `markersChanged` boolean with diff (`previous` vs `current`).
- `securityChanged` boolean with reason.
- If changed: confirmation lines from regenerated hook, CI, and/or security summary.

**Success criteria**:
- Decision is fully justified by observed marker diff.
- `manifest.yaml stack:` block and security metadata consistent with current state.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=7 type=<command_failed|verification_failed> ...`. Stop.

---

## Done
The task is complete when ALL of the following are true:
- [ ] Step 1 success criteria met (cwd + flag resolved)
- [ ] Step 2 success criteria met (case routed deterministically)
- [ ] Step 3 success criteria met (date branch picked or skipped due to flag/migration)
- [ ] Step 4 success criteria met (DOMAINS_JSON valid) — when staleness rebuild branch
- [ ] Step 5 success criteria met (`.conventions/` strictly `{manifest.yaml, index.md}`) — when rebuild ran
- [ ] Step 6 success criteria met (`.gitignore` handled or skipped)
- [ ] Step 7 success criteria met (stack/security tracked or unchanged)
- [ ] No step skipped, reordered, parallelised outside the routed branch
- [ ] No unresolved ambiguity remains
- [ ] Month present in `Execution context`

Report: `DONE` or `BLOCKED at step N - <one-line reason>`.

## Final consistency check
- Every step has prerequisite, required inputs, action, evidence, success criteria, failure handling.
- Failure uses `timeout=90s, max_retries=1` and canonical `ERROR step=N ...` line.
- Policy-block uses `BLOCKED at step N - policy_blocked - <reason>`.
- Date comparison is the staleness signal. Per-file hashes are NOT used.
- After any rebuild, `.conventions/` contains only `manifest.yaml` + `index.md`.
- After any refresh path that reaches step 6, `.gitignore` contains `.conventions/`, `.claude/`, and `.agents/`, or was skipped because no `.git/` exists.

## Drift tests (mini-suite)
1. Old `.conventions/design.md` present, no `--full` → expected: Case A migration path, never reaches step 3.
2. Missing `.last-updated` → expected: WARN + stop, no rebuild attempted.
3. `--full` flag → expected: skip step 3, jump to step 5 with init Phases 1–4.
4. `LAST_UPDATED ≤ MANIFEST_DATE` → expected: `Conventions up to date.` then proceed to step 6 (gitignore) and step 7 (stack check).
5. `bun -e` JSON build emits invalid JSON → expected: ERROR step=4 type=verification_failed; no rebuild.
6. After rebuild, `.conventions/code.md` still present → expected: BLOCKED step 5 (success criterion violated).
7. Stack markers unchanged and security unchanged → expected: hook + CI untouched after `.gitignore` exclusions are verified; `Stack unchanged and security profile unchanged — hook, CI, and security left as-is.` printed.
8. Manifest lacks security metadata but generated `security.yml` has sentinel → expected: infer `baseline`, then preserve with `--security keep`.
9. `--security production` on existing `baseline` manifest → expected: regenerate security workflow and update manifest security metadata.
