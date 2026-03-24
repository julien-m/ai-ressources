#!/bin/bash
set -e

# ai-ressources — Setup script
# Run this once after cloning to configure the knowledge base for Claude Code.

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
SHELL_RC="$HOME/.zshrc"
VAR_NAME="AI_RESOURCES_PATH"

echo "📦 ai-ressources setup"
echo "   Base directory: $BASE_DIR"
echo ""

# ------------------------------------------------------------------
# 1. Check cc-hub is installed
# ------------------------------------------------------------------
if ! command -v cc-hub &>/dev/null; then
  echo "❌ cc-hub is not installed."
  echo ""
  echo "   cc-hub is required to link Claude Code skills and rules."
  echo "   Install it:"
  echo ""
  echo "     git clone https://github.com/julien-m/cc-hub.git ~/projects/cc-hub"
  echo "     cd ~/projects/cc-hub && bun install && bun link"
  echo ""
  echo "   Then re-run this script."
  exit 1
fi
echo "✓ cc-hub found: $(which cc-hub)"

# ------------------------------------------------------------------
# 2. Set AI_RESOURCES_PATH in shell profile
# ------------------------------------------------------------------
if grep -q "^export ${VAR_NAME}=" "$SHELL_RC" 2>/dev/null; then
  # Update existing export
  sed -i '' "s|^export ${VAR_NAME}=.*|export ${VAR_NAME}=\"${BASE_DIR}\"|" "$SHELL_RC"
  echo "✓ Updated ${VAR_NAME} in $SHELL_RC"
else
  echo "" >> "$SHELL_RC"
  echo "# ai-ressources knowledge base" >> "$SHELL_RC"
  echo "export ${VAR_NAME}=\"${BASE_DIR}\"" >> "$SHELL_RC"
  echo "✓ Added ${VAR_NAME} to $SHELL_RC"
fi

# Export for current session
export ${VAR_NAME}="$BASE_DIR"

# ------------------------------------------------------------------
# 3. Link Claude Code assets via cc-hub
# ------------------------------------------------------------------
echo ""
echo "Linking Claude Code assets..."

# Skills
if [ -d "$BASE_DIR/claude/skills/ai-res" ]; then
  cc-hub skill link "$BASE_DIR/claude/skills/ai-res/SKILL.md" 2>/dev/null && \
    echo "  ✓ skill: ai-res" || echo "  ⚠ skill ai-res already linked"
fi

# Rules
for rule in "$BASE_DIR"/claude/rules/*.md; do
  [ -f "$rule" ] || continue
  name="$(basename "$rule" .md)"
  cc-hub rule link "$rule" 2>/dev/null && \
    echo "  ✓ rule: $name" || echo "  ⚠ rule $name already linked"
done

# ------------------------------------------------------------------
# 4. Done
# ------------------------------------------------------------------
echo ""
echo "✅ Setup complete."
echo ""
echo "   ${VAR_NAME}=${BASE_DIR}"
echo "   Restart your shell or run: source $SHELL_RC"
echo ""
echo "   Usage in Claude Code:"
echo "     /ai-res              → list all domains"
echo "     /ai-res design       → load design reference"
echo "     /ai-res stack        → vendor comparison sheets"
