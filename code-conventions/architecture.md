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

### 3.1 Entry Points
Bootstrap only: initialize app, wire dependencies, load config, start transports/workers, register routes/jobs/commands.
Examples: HTTP server, CLI main, worker startup, cron runner, mobile/desktop app entry.
Forbidden: business logic, SQL, direct provider calls.

### 3.2 Handlers / Controllers / Transport Adapters
Thin translation layer between outside world and application. Parse input, validate transport payload, authenticate/authorize, call service, map result to response.
Examples: HTTP controllers, RPC handlers, CLI commands, queue consumers, event subscribers.
Forbidden: business orchestration, SQL, provider logic, stateful workflows.

### 3.3 Services / Use Cases
All business logic lives here: orchestration, invariant enforcement, workflow definition, cross-repository coordination.
Examples: create signature request, capture payment, issue refund, rotate token, generate invoice.
Forbidden: transport concerns, framework request/response objects, raw SQL, direct filesystem/API code (unless gateway abstraction), UI rendering.

### 3.4 Repositories
Persistence boundary only: query/save aggregates, transaction participation, map persistence ↔ domain models.
Forbidden: business decisions, emails, unrelated external API calls, transport formatting, cross-domain orchestration.

### 3.5 Gateways / Clients / Adapters
Wrap external systems: isolate SDKs, define stable internal interfaces, convert provider payloads → internal models, centralize retries/timeouts/error mapping.
Examples: payment gateway, email sender, SMS provider, PDF service, cloud storage, HTTP API client.
Forbidden: business workflow decisions, cross-domain orchestration.

### 3.6 Mappers
Transform data between layers only. No business logic, no side effects, no I/O.
Examples: DB row → domain model, provider response → DTO, service result → API response.

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
Always separate: transport DTOs, domain models, persistence models, provider models.
Example: `CreateUserRequestDTO` → `CreateUserInput` → `UserEntity` → `StripeCustomerResponse` → `UserResponseDTO`.
A model designed for one layer must not automatically become the model for another.

## 8. Orchestration vs Domain Logic
- **Domain logic**: pure business rules (can document be signed? is payment refundable? can user access resource?)
- **Orchestration**: workflow coordination (fetch → create → update status → send email → publish event)
- Keep pure business rules isolated from workflow glue whenever possible

## 9. Business Logic Forbidden Locations
Business rules must not live in: controllers/handlers, forms/UI views, route files, ORM hooks, model lifecycle callbacks, database triggers, migration scripts, utility files, build scripts.
Business logic belongs in services/use cases/domain modules only.

## 10. Database Triggers
Extends database §1. Forbidden trigger use: changing billing state, updating balances, creating business records, enforcing workflow transitions, sending notifications.
Allowed only for strictly technical purposes: audit metadata, internal replication, low-level bookkeeping.
Reason: triggers create hidden behavior, hide dependencies, split logic between app and DB.

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
Extends database §7. Architectural rule, not just convention.
- Every tenant-scoped operation carries explicit tenant context
- Every repository query includes tenant scope
- Cross-tenant access impossible by default
- Tenant filtering must not depend on caller discipline alone

## 19. Utility Files
Extends general §3. Avoid: `utils/`, `helpers/`, `common/`, `misc/`.
- Helpers must be domain-specific or responsibility-specific
- Generic utilities must be truly generic and few
- If a file grows because "many things need it", rethink the architecture

## 20. Dependency Injection
Extends general §15. Dependencies must be explicit.
- Inject repositories, gateways, services
- Constructors assign only — no hidden logic
- No hidden singleton access in business code (unless intentionally centralized and justified)
- Avoid service locators
- Bad: business code instantiates dependencies — Good: startup/wiring layer constructs object graph

## 21. Object Construction
Complex construction must be isolated. Use factories, builders, dedicated initialization services.
When: creating aggregates, composing provider clients, initializing expensive resources, building complex workflows.
Don't scatter construction rules across random call sites.

## 22. Circular Dependencies
Forbidden. If two modules depend on each other, extract a shared contract or redesign boundaries.
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
