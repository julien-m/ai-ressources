---
extends: []
---
# Architecture Rules (Delta)

> These rules define **how the system is structured**: layers, boundaries, dependency direction, responsibilities, and cross-domain interactions.
> They complement [`general.md`](general.md) (§3 structure, §13 DTOs, §15 DI, §16 separation, §17 idempotency) and [`database.md`](database.md) (§1 triggers, §7 multi-tenant, §19 transactions). Only the architectural dimension is added here.
## 1. Core Principles
- Optimize for: correctness, maintainability, explicit boundaries, predictable change
- Business logic must be easy to locate
- Dependencies flow in one direction only
- Each layer has a single clear responsibility
- Hidden side effects and cross-layer shortcuts are forbidden

## 2. Dependency Direction
```text
entry points → handlers/controllers → services/use cases → repositories/gateways → external systems
```

External systems: database, queue, filesystem, HTTP APIs, email/SMS/payment providers, OS/platform APIs.

Dependencies must always point **inward** (toward business logic) or **downward** (toward infrastructure), never upward.

Forbidden: repository → controller, controller → database directly, service → UI framework, domain → HTTP transport, handler containing business rules, external SDK objects leaking into domain.

## 3. Layer Responsibilities
| Layer | Responsibility | Forbidden |
|---|---|---|
| **Entry Points** | Bootstrap: init app, wire deps, load config, start transports/workers. Examples: HTTP server, CLI main, worker startup. | Business logic, SQL, direct provider calls |
| **Handlers / Controllers** | Thin translation: parse input, validate payload, auth, call service, map result. Examples: HTTP controllers, CLI commands, queue consumers. | Business orchestration, SQL, provider logic, stateful workflows |
| **Services / Use Cases** | All business logic: orchestration, invariants, workflow, cross-repo coordination. Examples: create signature request, capture payment, issue refund. | Transport concerns, framework objects, raw SQL, direct FS/API code, UI rendering |
| **Repositories** | Persistence boundary: query/save aggregates, transaction participation, map persistence ↔ domain. | Business decisions, emails, unrelated external calls, transport formatting |
| **Gateways / Clients** | Wrap external systems: isolate SDKs, stable interfaces, convert payloads → internal models, centralize retries/timeouts. Examples: payment gateway, email sender, PDF service. | Business workflow decisions, cross-domain orchestration |
| **Mappers** | Transform data between layers. No business logic, no side effects, no I/O. Examples: DB row → domain, provider response → DTO. | — |

## 4. Domain Boundaries
Organize by business domain (extends general §3). Each domain owns: its types, business rules, use cases, repository contracts, transport mappings.

```text
src/auth/  src/billing/  src/users/  src/signature_requests/  src/documents/
```

## 5. Public vs Internal Module Boundaries
- Expose a small public API per domain, keep internals private
- Cross-module access through explicit public interfaces only
- Bad: `billing imports users/internal/sql/helpers.ts` — Good: `billing imports users/public-api`

## 6. No Layer Leaks
Forbidden: HTTP request objects in business logic, DB rows as API responses, ORM models as public DTOs, provider SDK types outside adapters, SQL concepts in domain logic, UI state as business entities.
Every layer speaks its own language — explicit transformations at boundaries.

## 7. DTO / Model Separation
Always separate: transport DTOs, domain models, persistence models, provider models. Example: `CreateUserRequestDTO` → `CreateUserInput` → `UserEntity` → `StripeCustomerResponse` → `UserResponseDTO`. A model for one layer must not become the model for another.

## 8. Orchestration vs Domain Logic
- **Domain logic**: pure business rules (can document be signed? is payment refundable? can user access resource?)
- **Orchestration**: workflow coordination (fetch → create → update status → send email → publish event)
- Keep pure business rules isolated from workflow glue whenever possible

## 9. Business Logic Forbidden Locations
Business rules must not live in: controllers/handlers, forms/UI views, route files, ORM hooks, model lifecycle callbacks, database triggers, migration scripts, utility files, build scripts. Always use services/use cases/domain modules.

## 10. Database Triggers
Extends database §1. Forbidden: changing billing state, updating balances, creating business records, enforcing workflow transitions, sending notifications. Allowed only for technical purposes: audit metadata, internal replication. Reason: triggers create hidden behavior and split logic between app and DB.

## 11. Transactions
Extends database §19. Transactions belong at the service/use-case level.
- Start only when necessary, keep short
- Never perform external calls or slow computation inside transactions
- Repositories participate but don't decide business transaction scope
- Pattern: prepare → start transaction → write → commit → trigger side effects after commit

## 12. Side Effects
Side effects: DB writes, emails, SMS, webhooks, queue pushes, file writes, external API calls, analytics events.
- Must be explicit and happen in predictable places
- Must be documented when non-obvious
- Never hidden in mappers, getters, hooks, triggers, or property access

## 13. Eventing
Use events only when they improve decoupling and clarity.
- Clear ownership and naming, explicit producers/consumers
- Payloads must be versionable and stable
- Don't use events to hide normal synchronous flow
- Don't replace direct calls with events just to "look decoupled"
- Good: publish domain event after completed action for secondary processing

## 14. Idempotency and Retries
Extends general §17. Any retryable operation must be architected for idempotency.
Applies to: payments, webhooks, queue jobs, callbacks, external API retries, file processing.
- Define idempotency boundary explicitly
- Use operation IDs / request IDs / external references
- Ensure repeated execution does not duplicate effects

## 15. Concurrency Boundaries
Extends general §8. Concurrency must be intentional.
- Parallelize only independent operations
- Minimize shared mutable state, explicit ownership
- Cancellation, timeout, and lifecycle must be controlled
- Bound active work, pending queues, caches/retained collections and retry attempts where present. Assign each limit an owner, configuration/source and overload behavior (wait/backpressure, explicit rejection or an approved loss policy); limits must come from workload/product requirements, not invented universal constants. Do not introduce absent queues/caches merely to satisfy this rule.
- Cancellation, timeout and partial initialization must release owned resources and leave state consistent. Stop or supervise spawned work; reconcile an uncertain external effect before retrying it. A caller timeout does not prove that remote work was cancelled.
- Background work must be observable and managed
- Forbidden: unmanaged fire-and-forget, hidden goroutines/threads/tasks, unsupervised long-running jobs from request handlers

## 16. Configuration Boundary
Extends general §12. Config loaded once at startup and injected.
- No raw env access deep in business code
- No ad hoc config parsing in random modules
- Config validated, typed, injected via constructors/parameters
- Bad: service reads `process.env` directly — Good: startup loads → validates → injects

## 17. Security Boundary
Extends general §22. Security logic must be explicit and centralized.
Covers: auth, permissions, tenant isolation, ownership checks, secrets handling.
- Authorization not scattered randomly
- Tenant scoping enforced close to data access and use case boundaries
- Security decisions must be testable
- Never rely on UI-only protection
- Never trust client-provided ownership/tenant identity without verification

## 18. Multi-Tenant Isolation
Architectural rule (extends database §7), not just convention.
- Every tenant-scoped operation carries explicit tenant context
- Every repository query includes tenant scope
- Cross-tenant access impossible by default
- Tenant filtering must not depend on caller discipline alone

## 19. Utility Files
Avoid: `utils/`, `helpers/`, `common/`, `misc/` (extends general §3).
- Helpers must be domain-specific or responsibility-specific
- Generic utilities must be truly generic and few
- If a file grows because "many things need it", rethink the architecture

## 20. Dependency Injection
Dependencies must be explicit (extends general §15).
- Inject repositories, gateways, services
- Dependency-wiring constructors assign only — no hidden I/O or orchestration; read [validated domain creation](general.md#2-type-safety) for construction of domain values.
- No hidden singleton access in business code (unless intentionally centralized and justified)
- Avoid service locators
- Bad: business code instantiates dependencies — Good: startup/wiring layer constructs object graph

## 21. Object Construction
Complex construction must be isolated. Use factories, builders, dedicated initialization services (creating aggregates, composing provider clients, initializing expensive resources). Don't scatter construction logic across random call sites.

## 22. Circular Dependencies
Forbidden. If two modules depend on each other, extract a shared contract or redesign boundaries.
- Declare allowed module dependencies and public entry points from the actual architecture; enforce them with the language/build visibility mechanisms and an appropriate import/dependency check in CI where supported. Inspect the effective configuration and check result, not only a diagram or comment.
- Detect circular dependencies and forbidden access to another module's internals or to infrastructure from the business core. Use existing tooling or a small justified repository check; keep approved exceptions explicit. Missing automated enforcement is a coverage gap to report, not a claim that the boundary is verified or a reason to invent a new tool stack.
Examples: user ↔ billing internals, service A ↔ service B.

## 23. Framework Containment
Framework code stays near the edges: HTTP framework in handlers, ORM annotations in persistence, UI toolkit in presentation.
The business core must survive a framework swap with minimal changes.

## 24. Persistence Ignorance
Business logic should not depend on persistence details (SQL vs NoSQL vs file vs API).
- Avoid embedding SQL/ORM assumptions in business rules
- Repository contracts reflect business needs, not table structure
- Perfect purity not required, but coupling must be minimized

## 25. Observability by Design
Extends general §19. Architecture must support debugging and operations.
- Important use cases emit structured logs at boundaries
- Major business operations carry traceable IDs
- Async/background workflows must be observable
- Failures carry enough context to debug
- Hidden internal state transitions forbidden

## 26. Testing Boundaries
Extends general §9. Architecture must make testing easy.
- Business logic testable without real HTTP/server/UI
- Repositories/gateways mockable or replaceable
- Pure logic testable without infrastructure
- Use cases testable with fake dependencies
- Architecture that prevents isolated tests is considered flawed

## 27. Domain Events vs Integration Events
- **Domain events**: internal business facts (invoice issued, document signed, user invited)
- **Integration events**: messages for external systems (webhook payload, queue message, analytics export)
- Never mix internal domain language with external integration contracts

## 28. Versioning and Evolution
Architecture must allow safe change.
- Add new modules without rewriting unrelated ones
- Evolve APIs without breaking internals unnecessarily
- Introduce new providers behind adapters
- Separate stable contracts from unstable implementation details

## 29. Module Naming
Names must reflect business meaning: `signature_requests`, `billing`, `document_signing`, `user_access`.
Bad: `manager`, `processor`, `engine`, `helpers`, `misc`.
If a name does not explain responsibility clearly, rename it.

## 30. Architectural Clarity Test
A developer must quickly answer: where does this business rule live? where is this data loaded? where is this external API called? where is this side effect triggered? which layer owns this decision? which module depends on which?
If the answer is unclear, the architecture is too implicit.

## 31. Recommended Default Structure
```text
src/
  app/                # startup, dependency wiring, config
  shared/             # truly shared technical components only
  auth/
    api/              # controllers, handlers, transport DTOs
    application/      # use cases, orchestration, service layer
    domain/           # business rules, domain types, invariants
    infrastructure/   # repositories, external clients, adapters
  billing/
    api/ application/ domain/ infrastructure/
```

Structure is optional, separation of concerns is mandatory.

## 32. Minimal Architecture (Small Projects)
```text
src/
  users/
    user.controller  user.service  user.repository  user.types
  billing/
    billing.controller  billing.service  billing.repository
```

Small projects may simplify folder depth but must preserve the same layer boundaries.

## 33. Forbidden Architectural Smells
Fat controllers, god services, repositories with business rules, domain logic in triggers, infrastructure leaking everywhere, DTO/entity confusion, random cross-module imports, hidden mutable global state, unowned background jobs, framework objects in business code, generic helper dumping grounds.
These are architecture defects, not style issues.

## 34. Interface-Based Modularity and Polymorphism
- Prefer small modules with explicit responsibilities and narrow contracts; callers depend on the contract, while each implementation owns its technical details.
- Keep browser frame callbacks, UI events and other entry callbacks thin: translate inputs, delegate to an injected interface, and manage the callback lifecycle. Keep rendering algorithms and backend-specific code in their own implementations.
- Select and construct implementations at the configuration/composition boundary; do not scatter backend switches or concrete dependency construction through callers.
- Resolve option-dependent behavior when configuration changes, then reuse the configured implementation in frame/event loops. Reconfigure on relevant setting, source or capability changes; keep data-validity and safety checks dynamic.
- Collect hardware, GPS and ambient-light readings at input adapters and pass only the data each consumer needs. Rendering must not query sensors or preference stores; prepare presentation state outside drawing callbacks so a redraw does not advance measurement history.
- Example: a frame callback calls `renderer.draw(scene)` through a rendering contract; Canvas and OpenGL implementations each own their drawing code. Configuration selects the renderer, without changing the callback.
- Use language-idiomatic abstractions: interfaces, protocols, behaviours, traits or explicit function contracts. This preference does not require classes or an inheritance hierarchy.
- Give contracts meaningful responsibilities and names so a reader can locate the caller, contract, implementation and wiring without following unrelated code.
- Keep abstractions proportional: use them to isolate a responsibility, external dependency or meaningful variation; do not add empty forwarding layers or speculative implementations.

- Make polymorphism a default design consideration at meaningful boundaries: business callers depend on a capability contract, and implementations can change without rewriting the caller. Apply this to providers, persistence, rendering, hardware inputs and replaceable algorithms across all languages.
- Define a narrow contract when isolating a real responsibility or dependency, even with one current implementation; do not wait for a second implementation to decouple an external system. A local pure calculation can remain a function.
- Prefer polymorphic dispatch over repeated switches on provider names or concrete types for an open set of implementations. Keep exhaustive matching for closed domain variants and state transitions; select runtime strategies at the composition boundary.
- Separate capability polymorphism (different implementations of one contract) from parametric polymorphism (generic algorithms preserving type relationships). Choose static or dynamic dispatch according to runtime substitution, heterogeneous storage and measured costs.
- Contracts include semantics: inputs, results, errors, side effects, ownership and concurrency guarantees. Identify owned, borrowed and shared resources, who releases them, and which lifetime they require; specify cleanup on failure/cancellation and whether a returned value transfers ownership. Substitutes must preserve those guarantees, not merely expose matching method names. Keep provider-specific features in separate capabilities rather than fake no-op implementations.
- Verify shared observable guarantees against each real implementation where feasible; reuse contract checks for fakes without treating fake-only tests as proof of a provider integration. Avoid downcasts or concrete-type checks in business callers to recover capabilities omitted from the contract.
- Apply these project design preferences using each language's mechanisms. Read [TypeScript/JavaScript](javascript.md), [Elixir](elixir.md), [Go](go.md), [Python](python.md), [Rust](rust.md), [Swift/Kotlin](swift-kotlin.md) and [Delphi/Pascal](delphi.md) for the corresponding choices. Keep SQL and framework-specific details behind those application contracts rather than inventing a universal interface syntax.
