# Architecture Pattern Template

Use this format for a reusable architecture example: a concrete problem, component choices, guarantees, failure behavior and proof. Write an independently usable reference in English; a vendor tutorial is supporting context, not the reliability contract.

**Read** [naming conventions](../conventions/naming.md), [diagram conventions](../conventions/diagrams.md) and [technical writing conventions](../conventions/technical-writing.md) before authoring. **Read** [Cloudflare job scheduling](cloudflare-job-scheduling.md) for a filled example.

## 1. Problem and scope

- Name one observable use case and its inputs, outputs and constraints.
- State the environment, audience, non-goals and evidence status: proposed reference, locally tested example or deployed implementation.
- List all contract signals before designing: timing, ownership, updates, ordering, concurrency, retries, cancellation, persistence and side effects as applicable.

## 2. Selection and alternatives

- Compare the recommended approach with simpler and more capable alternatives.
- Give explicit use-when / avoid-when conditions, trade-offs and assumptions.
- Distinguish vendor guarantees from application policy and recommendations; never turn an example threshold into an SLA.

## 3. Components and ownership

- Map each component to its responsibility, authoritative state, interface and trust boundary.
- Identify optional components, read projections and consistency requirements.
- Define versioned input/output contracts, stable identities and resource lifecycle.

## 4. Lifecycle and failure handling

- Use a Mermaid sequence/flow diagram for service interactions and a state diagram where lifecycle matters.
- Show success, partial failure, crash/retry, update/cancel and recovery paths.
- Mark transaction boundaries, external side effects and possible interleaving; state idempotency, duplicate and replay policies.

## 5. Concrete example

- Supply small representative configuration, request and event examples with consistent identifiers and timestamps.
- Use Gherkin for observable scenarios and Mermaid for structural behavior.
- Label pseudocode and contracts that still require implementation. For runnable examples, specify files, dependencies, commands and actual validation evidence.

## 6. Operations and optimization

- Define metrics, failure alerts, inspection/replay, retention/cleanup and recovery ownership.
- Cover tenant authorization, payload validation and sensitive data handling where relevant.
- Explain cost drivers, latency budgets, capacity assumptions and when measurements justify an optimization.

## 7. Validation and reuse decision

- Map every important guarantee to a test or observable receipt, including negative cases and crash windows.
- Separate source verification, static/local tests and live deployment proof.
- End with the decisions a consuming project must freeze before implementation; retain unresolved assumptions explicitly.

## 8. Sources and publication

- Link the motivating example with author/title; link authoritative documentation next to current API, limit and guarantee claims.
- Record the review date and a concise assessment of what is retained, corrected or optional. Verify unstable facts again when reusing the reference.
- Write original analysis/examples. For copied or adapted material, establish rights and record provenance according to **Read** [contribution guidance](../CONTRIBUTING.md).
- Update the domain index, root count/review date, keyword catalog, freshness marker and compiled index in the same pass; add relevant backlinks and README discovery guidance.
