# Sync Agent-Sync Assets

When any global skill or rule is created or modified in this project, keep canonical sources under `.agent-sync/` and synchronize provider outputs through `cc-hub`.

## Scope

- `.agent-sync/skills/` — global portable skills (`SKILL.md`)
- `.agent-sync/rules/` — global portable rules (`.md`)
- `.agent-sync.local/rules/` — local project rules; rebuild local outputs only

## Procedure

After creating or modifying a global asset, run the appropriate sync command:

```bash
# For skills
cc-hub skill link .agent-sync/skills/<name> --scope global --targets all --force

# For rules
cc-hub rule link .agent-sync/rules/<name>.md --scope global --targets all --force
```

After creating or modifying a local rule, update local provider outputs from `.agent-sync.local/rules`.

## Rules

- Do not reintroduce `claude/skills/` or `claude/rules/` as canonical sources.
- Do not create direct global provider links to project files outside `.agent-sync/`.
- If multiple assets are created in one task, sync all of them before finishing.
- After syncing, confirm briefly which assets were linked.
