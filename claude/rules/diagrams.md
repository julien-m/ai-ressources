# Diagram Conventions — Global Rule

All flows MUST use structured diagram formats. Before producing any diagram, **Read** [`diagrams.md`](../../conventions/diagrams.md).

## Trigger signals

| Signal in task | Action |
|---|---|
| Describing a user journey, scenario, acceptance criteria | Use Gherkin |
| Describing a pipeline, request lifecycle, CI/CD | Use Mermaid `flowchart` |
| Describing service interactions, API calls | Use Mermaid `sequenceDiagram` |
| Describing states, lifecycle, FSM | Use Mermaid `stateDiagram-v2` |
| Describing decision logic, routing, error handling | Use Mermaid `flowchart` (diamond nodes) |
| Writing a spec with behavioral + structural flow | Use Gherkin + Mermaid pair |

## Audience

- **AI-only docs** (rules, skills, internal specs): diagram only, no redundant prose
- **Human-readable docs** (README, runbooks, onboarding): diagram + Mermaid rendering

## Scope

Applies to all contexts: code comments, specs, rules, skills, README, runbooks, onboarding docs, acceptance criteria.
