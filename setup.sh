#!/usr/bin/env bash
set -euo pipefail

# ai-ressources setup: configure the knowledge-base path and optionally link portable assets.

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
VAR_NAME="AI_RESOURCES_PATH"
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

EXPECTED_EXPORT="export ${VAR_NAME}=\"${BASE_DIR}\""

if grep -Fqx "$EXPECTED_EXPORT" "$SHELL_RC" 2>/dev/null; then
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
