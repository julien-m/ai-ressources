#!/usr/bin/env bash
set -euo pipefail

# ai-ressources setup: configure the knowledge-base path and optionally link portable assets.

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
VAR_NAME="AIRESOURCES"
LINK_ASSETS=false

if [[ "${1:-}" == "--link-assets" ]]; then
  LINK_ASSETS=true
  shift
fi

if [[ "$#" -ne 0 ]]; then
  echo "Usage: ./setup.sh [--link-assets]" >&2
  exit 2
fi

if [[ -n "${AI_RESOURCES_SHELL_RC:-}" ]]; then
  SHELL_RC="$AI_RESOURCES_SHELL_RC"
else
  case "$(basename "${SHELL:-sh}")" in
    zsh) SHELL_RC="$HOME/.zshrc" ;;
    bash) SHELL_RC="$HOME/.bashrc" ;;
    *) SHELL_RC="$HOME/.profile" ;;
  esac
fi

echo "📦 ai-ressources setup"
echo "   Base directory: $BASE_DIR"
echo ""

# Single-quote the path so the profile never expands $(...), backticks or variables in it.
quote_for_shell() {
  local escaped=${1//\'/\'\\\'\'}
  printf "'%s'" "$escaped"
}

EXPECTED_EXPORT="export ${VAR_NAME}=$(quote_for_shell "$BASE_DIR")"
# Earlier releases wrote a double-quoted line; it is equivalent only for paths without expandable characters.
PREVIOUS_EXPORT="export ${VAR_NAME}=\"${BASE_DIR}\""
PREVIOUS_IS_SAFE=false
[[ "$BASE_DIR" != *[\"\$\`\\]* ]] && PREVIOUS_IS_SAFE=true

if grep -Fqx "$EXPECTED_EXPORT" "$SHELL_RC" 2>/dev/null \
  || { $PREVIOUS_IS_SAFE && grep -Fqx "$PREVIOUS_EXPORT" "$SHELL_RC" 2>/dev/null; }; then
  echo "✓ ${VAR_NAME} already configured in $SHELL_RC"
elif grep -q "^export ${VAR_NAME}=" "$SHELL_RC" 2>/dev/null; then
  echo "❌ $SHELL_RC already defines ${VAR_NAME}." >&2
  echo "   Update that line to: $EXPECTED_EXPORT" >&2
  exit 1
else
  mkdir -p "$(dirname "$SHELL_RC")"
  printf '\n# ai-ressources knowledge base\n%s\n' "$EXPECTED_EXPORT" >> "$SHELL_RC"
  echo "✓ Added ${VAR_NAME} to $SHELL_RC"
fi

# Releases before AIRESOURCES exported this variable; nothing reads it anymore.
LEGACY_VAR_NAME="AI_RESOURCES_PATH"
while IFS=: read -r line_number _; do
  echo "⚠ $SHELL_RC:$line_number still exports $LEGACY_VAR_NAME, which nothing reads anymore. Remove that line." >&2
done < <(grep -n "^[[:space:]]*export ${LEGACY_VAR_NAME}=" "$SHELL_RC" 2>/dev/null || true)

export "$VAR_NAME=$BASE_DIR"

# ------------------------------------------------------------------
if $LINK_ASSETS; then
  if ! command -v cc-hub >/dev/null 2>&1; then
    echo "❌ --link-assets requires an existing cc-hub installation." >&2
    echo "   The knowledge base is configured; rerun without this option or install assets manually." >&2
    exit 1
  fi

  echo ""
  echo "Linking portable assets from .agent-sync/..."
  for skill_dir in "$BASE_DIR"/.agent-sync/skills/*; do
    [[ -f "$skill_dir/SKILL.md" ]] || continue
    cc-hub skill link "$skill_dir" --scope global --targets all --force
    echo "  ✓ skill: $(basename "$skill_dir")"
  done

  for rule in "$BASE_DIR"/.agent-sync/rules/*.md; do
    [[ -f "$rule" ]] || continue
    cc-hub rule link "$rule" --scope global --targets all --force
    echo "  ✓ rule: $(basename "$rule" .md)"
  done
else
  echo "✓ Portable asset linking skipped (optional: ./setup.sh --link-assets)"
fi

# ------------------------------------------------------------------
echo ""
echo "✅ Setup complete."
echo ""
echo "   ${VAR_NAME}=${BASE_DIR}"
echo "   Restart your shell or run: source $SHELL_RC"
echo ""
echo "   Browse index.yaml or point your agent at $BASE_DIR."
