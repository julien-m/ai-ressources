---
name: ai-res
description: Load domain-specific reference knowledge from ai-ressources on demand
argument-hint: "[domain] — e.g., design, stack-ref, code-conventions"
---

# /ai-res — Domain Knowledge Loader

Load structured reference knowledge from the ai-ressources knowledge base.

## Base path

```
/Users/julienm/projects/ai-ressources/
```

All file paths below are relative to this base.

## Aliases

| Alias | Resolves to |
|-------|-------------|
| `stack` | `stack-ref` |
| `code` | `code-conventions` |
| `pricing` | `pricing-models` |

## Procedure

### With argument: `/ai-res <domain>`

1. Resolve alias if applicable
2. **Read** `<base>/<domain>/index.yaml`
3. If the domain is not found, show available domains from root `index.yaml` and stop
4. Select only the files relevant to the current conversation context
5. **Read** the selected files
6. If any selected file is marked `status: placeholder`, report it to the user: "Note: `<file>` is a placeholder (empty)."

### Without argument: `/ai-res`

1. **Read** `<base>/index.yaml` (root index)
2. Present the available domains with their descriptions and status
3. If conversation context suggests relevant domains, recommend them
4. Wait for user to specify a domain or proceed with recommendation

## Rules

- **Consultation only** — never modify any file in the knowledge base
- **Selective loading** — read the domain index first, then pick only files relevant to the task. Never bulk-load an entire domain
- **Report placeholders** — if a file has `status: placeholder`, tell the user it's empty
- **Domain not found** — read root `index.yaml` and show available domains
- **Coexistence** — `code-conventions` is also loaded by `claude/rules/code.md` during coding tasks. Both mechanisms coexist without conflict: the rule dispatcher loads conventions automatically for coding, while `/ai-res code` provides on-demand browsing
