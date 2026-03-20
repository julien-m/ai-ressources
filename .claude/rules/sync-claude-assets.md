# Sync Claude Assets

When any skill, rule, or command is created or modified in the `claude/` directory of this project, **all assets must be synchronized** to the global Claude Code configuration via `cc-hub` symlink commands.

## Scope

This applies to:

- `claude/skills/` — skills (SKILL.md files)
- `claude/rules/` — rules (.md files)
- `claude/commands/` — commands (.md files), if any exist

## Procedure

After creating or modifying an asset in `claude/`, run the appropriate symlink command:

```bash
# For skills
cc-hub skill link claude/skills/<name>/SKILL.md

# For rules
cc-hub rule link claude/rules/<name>.md

# For commands
cc-hub command link claude/commands/<name>.md
```

Use `--name <custom-name>` if the default name needs to be overridden.

## Rules

- Never skip the sync step — an unlinked asset is invisible to Claude Code globally
- If multiple assets are created in a single task, sync all of them before finishing
- After syncing, confirm briefly which assets were linked
