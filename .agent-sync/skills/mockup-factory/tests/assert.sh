#!/usr/bin/env bash
# Assert Mockup Factory terminal disk state against a scenario's _expected_disk block.
#
# Usage: assert.sh <target-dir> <group-name> <scenario.json>
#
# Checks (subset actually on disk, per expectations):
#   - audit-report.md presence
#   - escalation.md presence
#   - .mockup-validation/<group>/state.json.{iteration_count,final_status,reason,codex_calls_used}
#   - .mockup-validation/<group>/codex-raw.log presence
#   - checklist.md invariant (item_ids from frontmatter unchanged vs initial snapshot if provided)

set -euo pipefail

TARGET="${1:?target dir required}"
GROUP="${2:?group name required}"
SCENARIO="${3:?scenario json required}"

MV="$TARGET/.mockup-validation"
GDIR="$MV/$GROUP"
STATE="$GDIR/state.json"

pass=0; fail=0
ok()   { printf "  \033[32mOK\033[0m %s\n"   "$1"; pass=$((pass+1)); }
ko()   { printf "  \033[31mKO\033[0m %s\n"   "$1"; fail=$((fail+1)); }

read_exp() { jq -r "._expected_disk.$1 // empty" "$SCENARIO"; }

# Helpers
exp_final="$(read_exp final_status)"
exp_reason="$(read_exp reason)"
exp_iter="$(read_exp iteration_count)"
exp_calls="$(read_exp codex_calls_used)"
exp_raw_log="$(read_exp codex_raw_log_present)"
exp_raw_log_both="$(read_exp codex_raw_log_contains_both_attempts)"
exp_report="$(read_exp audit_report_md_present)"
exp_report_warnings="$(read_exp audit_report_lists_accepted_warnings)"
exp_escalation="$(read_exp escalation_md_present)"
exp_escalation_blocking="$(read_exp escalation_lists_remaining_blocking)"
exp_pen="$(read_exp pen_file_saved)"
exp_screenshots="$(read_exp pencil_screenshots_preserved)"

echo "== Asserting $GROUP against $(basename "$SCENARIO") =="

# Schema ref: .claude/skills/mockup-factory/references/state-writer.md
# state.json uses `status` (enum lowercase) + `block_reason`.
# Map scenario _expected_disk.final_status (UPPERCASE terminal) to lowercase status.
map_status() {
  case "$1" in
    PASS)                 echo passed ;;
    PASSED_WITH_WARNINGS) echo passed_with_warnings ;;
    ESCALATED)            echo escalated ;;
    BLOCKED)              echo blocked ;;
    *)                    echo "$1" ;;
  esac
}

if [[ -f "$STATE" ]]; then
  cur_status="$(jq -r '.status // empty' "$STATE")"
  cur_reason="$(jq -r '.block_reason // empty' "$STATE")"
  cur_iter="$(jq -r '.iteration_count // 0' "$STATE")"
  cur_calls="$(jq -r '.codex_calls_used // 0' "$STATE")"

  exp_status="$(map_status "$exp_final")"
  [[ -z "$exp_final" || "$cur_status" == "$exp_status" ]] \
    && ok "status=$cur_status (terminal $exp_final)" \
    || ko "status: expected '$exp_status' (for terminal $exp_final), got '$cur_status'"

  [[ -z "$exp_reason" || "$cur_reason" == "$exp_reason" ]] \
    && ok "block_reason=$cur_reason" \
    || ko "block_reason: expected '$exp_reason', got '$cur_reason'"

  [[ -z "$exp_iter" || "$cur_iter" == "$exp_iter" ]] \
    && ok "iteration_count=$cur_iter" \
    || ko "iteration_count: expected $exp_iter, got $cur_iter"

  [[ -z "$exp_calls" || "$cur_calls" == "$exp_calls" ]] \
    && ok "codex_calls_used=$cur_calls" \
    || ko "codex_calls_used: expected $exp_calls, got $cur_calls"
else
  ko "state.json missing at $STATE"
fi

# Artefact presence checks
case "$exp_raw_log" in
  true)  [[ -f "$GDIR/codex-raw.log" ]] && ok "codex-raw.log present" || ko "codex-raw.log missing" ;;
  false) [[ ! -f "$GDIR/codex-raw.log" ]] && ok "codex-raw.log absent" || ko "codex-raw.log unexpectedly present" ;;
esac

case "$exp_raw_log_both" in
  true)
    if [[ -f "$GDIR/codex-raw.log" ]] && [[ "$(grep -Eic 'attempt|retry' "$GDIR/codex-raw.log" || true)" -ge 2 ]]; then
      ok "codex-raw.log includes both attempts"
    else
      ko "codex-raw.log does not include two attempt markers"
    fi
    ;;
esac

case "$exp_report" in
  true)  [[ -f "$MV/audit-report.md" ]] && ok "audit-report.md present" || ko "audit-report.md missing" ;;
  false) [[ ! -f "$MV/audit-report.md" ]] && ok "audit-report.md absent" || ko "audit-report.md unexpectedly present" ;;
esac

case "$exp_report_warnings" in
  true)
    REPORT="$MV/audit-report.md"
    warning_ids="$(jq -r '.calls[0].stdout | fromjson? | .items[]? | select(.severity == "WARNING") | .id' "$SCENARIO")"
    report_missing=0
    if [[ ! -f "$REPORT" ]] || ! grep -q "Accepted trade-offs" "$REPORT"; then
      report_missing=1
    else
      while IFS= read -r id; do
        [[ -z "$id" ]] && continue
        grep -q -- "$id" "$REPORT" || report_missing=1
      done <<< "$warning_ids"
    fi
    [[ "$report_missing" -eq 0 ]] \
      && ok "audit-report.md lists accepted warnings" \
      || ko "audit-report.md missing accepted warning trade-offs"
    ;;
esac

case "$exp_escalation" in
  true)  [[ -f "$GDIR/escalation.md" ]] && ok "escalation.md present" || ko "escalation.md missing" ;;
  false) [[ ! -f "$GDIR/escalation.md" ]] && ok "escalation.md absent" || ko "escalation.md unexpectedly present" ;;
esac

case "$exp_escalation_blocking" in
  true)
    ESC="$GDIR/escalation.md"
    blocking_ids="$(jq -r '.calls[0].stdout | fromjson? | .items[]? | select(.severity == "BLOCKING") | .id' "$SCENARIO")"
    escalation_missing=0
    if [[ ! -f "$ESC" ]] || ! grep -q "Remaining BLOCKING" "$ESC"; then
      escalation_missing=1
    else
      while IFS= read -r id; do
        [[ -z "$id" ]] && continue
        grep -q -- "$id" "$ESC" || escalation_missing=1
      done <<< "$blocking_ids"
    fi
    [[ "$escalation_missing" -eq 0 ]] \
      && ok "escalation.md lists remaining blocking items" \
      || ko "escalation.md missing remaining blocking items"
    ;;
esac

case "$exp_screenshots" in
  true)  compgen -G "$GDIR/*.png" > /dev/null && ok "screenshots preserved" || ko "screenshots missing under $GDIR" ;;
  false) ! compgen -G "$GDIR/*.png" > /dev/null && ok "screenshots absent" || ko "screenshots unexpectedly present under $GDIR" ;;
esac

case "$exp_pen" in
  # Spec ambiguity: FR-014 says "save the .pen source file" without anchoring a
  # path. Tolerant search in all plausible locations.
  true)  if compgen -G "$TARGET/*.pen" > /dev/null \
         || compgen -G "$MV/*.pen" > /dev/null \
         || compgen -G "$GDIR/*.pen" > /dev/null \
         || compgen -G "$TARGET/.specs/design/*.pen" > /dev/null; then
           ok ".pen file saved"
         else
           ko ".pen file missing (searched $TARGET, $MV, $GDIR, $TARGET/.specs/design)"
         fi ;;
esac

# Checklist invariance: initial item_ids set must equal final item_ids set
CHK="$GDIR/checklist.md"
if [[ -f "$CHK" ]]; then
  # Extract frontmatter item_ids list and `- [ ]`/`- [x]` ids from body; compare.
  fm_ids=$(awk '/^---$/{f++;next} f==1 && /item_ids:/{found=1;next} f==1 && found && /^  - /{gsub(/^ *- /,""); print} f==1 && found && !/^  - /{found=0}' "$CHK" | sort -u)
  body_ids=$(grep -E '^- \[[ x]\] ' "$CHK" | sed -E 's/^- \[[ x]\] ([a-z0-9-]+).*/\1/' | sort -u || true)
  if [[ "$fm_ids" == "$body_ids" && -n "$fm_ids" ]]; then
    ok "checklist item_ids invariant holds"
  else
    ko "checklist item_ids drift: frontmatter vs body mismatch"
    diff <(echo "$fm_ids") <(echo "$body_ids") || true
  fi
fi

echo
echo "== $pass passed / $fail failed =="
exit "$fail"
