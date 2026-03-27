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

### With argument: `/ai-res <domain or question>`

1. Resolve alias if applicable (see table above)

#### Step 2 — Quick-ref fast path

Before reading the compiled index or spawning the agent, check if the question can be answered directly from a quick-ref file. This avoids the ~60s agent overhead for common questions.

**Quick-ref domains:**

| Keywords in question | Domain | Quick-ref file |
|---|---|---|
| model, modèle, LLM, image gen, video gen, music, cheapest model, best model, which model, quel modèle | `models` | `~/projects/ai-ressources/models/quick-ref.md` |
| stack, hosting, auth, database, DB, payment, email provider, platform, quelle stack, quel hébergeur | `stack-ref` | `~/projects/ai-ressources/stack-ref/quick-ref.md` |

**Bare domain shortcut:** if the argument is exactly `models` or `stack-ref` (after alias resolution), this is a fast path match — return the entire quick-ref file.

**Matching rules:**
1. Scan the question for keywords above
2. If it matches **exactly one** quick-ref domain → candidate for fast path
3. If it matches **two domains**, **zero domains**, or **one quick-ref domain + another domain** (e.g., "which model + which architecture") → skip fast path, go to step 3

**Depth signals — force fallback to agent if ANY is present:**
- Detailed comparison: "compare X vs Y in detail", "full specs", "differences between"
- Specific model/tech name not covered in the quick-ref
- Exhaustive request: "all options", "everything", "complete list"
- Cross-domain: question mixes topics from different domains

When in doubt → skip fast path, go to step 3.

**If fast path matches:**
1. **Read** the quick-ref file directly (1 Read, no agent)
2. If the question targets a specific type (e.g., "image", "video", "auth", "hosting"), extract only the matching `##` section from the file
3. If the question is general about the domain, return the entire file content
4. Append footer: `> For deeper detail, use /ai-res <detailed question> (routed via agent)`
5. **Stop here** — do NOT read compiled-index.txt, do NOT spawn the agent

#### Step 3 — Agent path (default)

If the fast path did not match, delegate to the `ai-res-librarian` agent:

1. **Read** `compiled-index.txt` at the project root (`~/projects/ai-ressources/compiled-index.txt`)
2. Spawn `ai-res-librarian` agent with a prompt structured as:
   ```
   ## COMPILED INDEX
   <content of compiled-index.txt>

   ## QUESTION
   <resolved domain or question>
   ```
3. Return the agent's response to the user
4. If `compiled-index.txt` does not exist, spawn the agent with just the question (fallback — the agent will route via index.yaml)

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

- **Quick-ref fast path first** — for single-domain questions matching `models` or `stack-ref`, read the quick-ref file directly (step 2). For everything else, delegate to the agent (step 3).
- **Agent for complex queries** — never read `index.yaml` or deep knowledge base files directly from this skill. The `ai-res-librarian` agent handles all navigation, reading, and synthesis in an isolated context.
- **Pagination** — the agent reads at most 15 files per invocation. If its response includes a **Cross-References** section with unread files, re-invoke the agent with those specific files/topics to get the remaining content. Example: `Spawn ai-res-librarian with prompt: "Read these files: design/references/app-views-catalog.md, design/components/forms.md"`.
- **Coexistence** — `code-conventions` is also loaded by `claude/rules/code.md` during coding tasks. Both mechanisms coexist without conflict: the rule dispatcher loads conventions automatically for coding, while `/ai-res code` provides on-demand browsing via the agent.
