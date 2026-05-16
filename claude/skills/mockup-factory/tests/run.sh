#!/usr/bin/env bash
# Set up a throwaway fixture and PATH-prepended shim for a Mockup Factory test run.
#
# Usage:
#   tests/run.sh <scenario-name>        # e.g. tests/run.sh SC-003-unavailable
#   tests/run.sh --list                 # list available scenarios
#   tests/run.sh --assert <scenario> <tmpdir> <group>   # just re-run assertions
#
# Flow:
#   1. Copies tests/fixtures/minimal-project/ to a tmpdir
#   2. Points MOCKUP_FACTORY_TEST_SCENARIO at the chosen scenario JSON
#   3. Prepends tests/shim/ to PATH (so `cc-hub` resolves to the shim)
#   4. Prints operator-facing instructions: "now invoke /mockup-factory --target <tmp> --groups test"
#   5. After the factory run, run tests/assert.sh to verify disk state
#
# This is the honest harness shape for a markdown-driven skill: the run loop is
# executed by Claude following SKILL.md; the shim + fixture + assertions are the
# deterministic parts that make the test reproducible.

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SHIM="$HERE/shim"
SCEN_DIR="$HERE/scenarios"
FIX="$HERE/fixtures/minimal-project"

list_scenarios() {
  find "$SCEN_DIR" -maxdepth 1 -type f -name '*.json' -exec basename {} .json \; | sort
}

case "${1:-}" in
  ""|--help|-h)
    cat <<EOF
Mockup Factory test harness

Scenarios available:
$(list_scenarios | sed 's/^/  - /')

Commands:
  tests/run.sh <scenario>        Prepare a sandbox + print operator steps
  tests/run.sh --list            List scenarios
  tests/run.sh --assert <scenario> <tmpdir> <group>
                                 Run assertions on an already-executed run
EOF
    exit 0
    ;;
  --list)
    list_scenarios; exit 0
    ;;
  --assert)
    if [[ $# -lt 3 ]]; then
      echo "Usage: tests/run.sh --assert <scenario> <tmpdir> [group]" >&2
      exit 2
    fi
    SCEN="$2"; TMPDIR="$3"; GROUP="${4:-test}"
    SCEN_FILE="$SCEN_DIR/$SCEN.json"
    [[ -f "$SCEN_FILE" ]] || { echo "Unknown scenario: $SCEN"; exit 2; }
    exec "$HERE/assert.sh" "$TMPDIR" "$GROUP" "$SCEN_FILE"
    ;;
esac

SCEN="$1"
SCEN_FILE="$SCEN_DIR/$SCEN.json"
[[ -f "$SCEN_FILE" ]] || { echo "Unknown scenario: $SCEN"; echo "Available:"; list_scenarios; exit 2; }

TMP="$(mktemp -d -t mockup-factory-test-XXXXXX)"
cp -R "$FIX"/. "$TMP/"

# Reset scenario counter
rm -f "$SCEN_FILE.counter"

# Optional env override (e.g. SC-007 budget=2)
ENV_EXPORT="$(jq -r '._env_required // {} | to_entries[] | "export \(.key)=\(.value)"' "$SCEN_FILE")"

cat <<EOF

== Mockup Factory test harness — scenario '$SCEN' ==

Sandbox:    $TMP
Scenario:   $SCEN_FILE
Shim:       $SHIM/cc-hub

To run the factory against this sandbox, copy-paste:

  export MOCKUP_FACTORY_TEST_SCENARIO='$SCEN_FILE'
  export PATH='$SHIM:\$PATH'
$(echo "$ENV_EXPORT" | sed 's/^/  /')

  # Then invoke the skill (Claude drives this):
  #   /mockup-factory --target '$TMP' --groups test

After the run terminates, verify disk state:

  '$HERE/assert.sh' '$TMP' test '$SCEN_FILE'

Or re-run assertions only:

  '$HERE/run.sh' --assert '$SCEN' '$TMP' test

EOF
