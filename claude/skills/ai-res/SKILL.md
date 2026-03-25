---
name: ai-res
description: Load domain-specific reference knowledge from ai-ressources on demand
argument-hint: "[domain or question] — e.g., design, stack-ref, 'SaaS B2B billing views'"
---

# /ai-res — Domain Knowledge Loader

Load structured reference knowledge from the ai-ressources knowledge base via the `ai-res-librarian` agent.

## Aliases

| Alias | Resolves to |
|-------|-------------|
| `stack` | `stack-ref` |
| `code` | `code-conventions` |
| `pricing` | `pricing-models` |

## Procedure

**Always delegate to the `ai-res-librarian` agent.** Never read knowledge base files directly.

### With argument: `/ai-res <domain or question>`

1. Resolve alias if applicable (see table above)
2. Spawn `ai-res-librarian` agent with the resolved domain or question as prompt
3. Return the agent's response to the user

### Without argument: `/ai-res`

1. Spawn `ai-res-librarian` agent with prompt: "List all available domains with their descriptions and status"
2. If conversation context suggests relevant domains, add that context to the prompt
3. Return the agent's response to the user

## Examples

These examples show how to formulate requests. The agent crosses domains automatically when needed.

### Design — views and components for an app

```
/ai-res I'm building a SaaS B2B with billing and team management. What views do I need and which UI components go in each?
```

Returns: matching app views (Dashboard, Settings, Billing...), component blocks for each view, layout compositions, mobile considerations.

### Code conventions — language + database

```
/ai-res I have a TypeScript API with PostgreSQL. What conventions should I follow?
```

Returns: TypeScript coding rules, database conventions (naming, migrations, queries), architecture patterns for API + DB.

```
/ai-res Delphi app with SQL Server database — give me the coding and database conventions
```

Returns: Delphi-specific rules, database conventions, relevant architecture patterns.

### Pricing — explore models then deep-dive

```
/ai-res What pricing models are available? I need to build a pricing page
```

Returns: all documented models (freemium, per-seat, usage-based, flat-rate...) with characteristics, pros/cons, and when to use each.

```
/ai-res Give me the freemium model details for a developer tools SaaS
```

Returns: freemium structure, tier design, conversion triggers, pricing page anatomy.

### Legal — CGU, RGPD, privacy

```
/ai-res I need to set up CGU and a RGPD-compliant privacy page for a French SaaS
```

Returns: CGU template structure, RGPD requirements, privacy policy sections, cookie policy rules.

### Multi-domain — full project context

```
/ai-res I'm starting a B2C mobile app for fitness tracking. Give me everything: views, design tokens, architecture patterns, and legal requirements
```

Returns: cross-domain synthesis — relevant views, design system tokens, architecture decisions, legal templates. The agent prioritizes and structures the response.

### Browse available domains

```
/ai-res
```

Returns: list of all domains with descriptions and current status (complete, draft, placeholder).

## Rules

- **Always use the agent** — never read `index.yaml` or knowledge base files directly from this skill. The `ai-res-librarian` agent handles all navigation, reading, and synthesis in an isolated context.
- **Pagination** — the agent reads at most 15 files per invocation. If its response includes a **Cross-References** section with unread files, re-invoke the agent with those specific files/topics to get the remaining content. Example: `Spawn ai-res-librarian with prompt: "Read these files: design/references/app-views-catalog.md, design/components/forms.md"`.
- **Coexistence** — `code-conventions` is also loaded by `claude/rules/code.md` during coding tasks. Both mechanisms coexist without conflict: the rule dispatcher loads conventions automatically for coding, while `/ai-res code` provides on-demand browsing via the agent.
