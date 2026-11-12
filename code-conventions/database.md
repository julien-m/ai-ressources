---
extends: []
---
# Database Rules

> Language-agnostic and ORM-agnostic. Apply regardless of stack.
## 0. Required Before Planning or Reviewing a Data Model
- Apply these rules during discovery and the first plan, before proposing tables, fields, migrations or SQL; also apply them when reviewing an existing model, regardless of ORM or engine.
- Start from approved business scenarios and cardinalities. Do not invent tables, multiple versions per purchase or optional fields for unspecified future workflows.
- The plan must include the following contract; mark unresolved decisions explicitly instead of inventing values or declaring the model ready:

| Plan deliverable | Required detail |
|---|---|
| Data dictionary | Table purpose; each field's meaning, type, nullability, default, source/writer, creation/update trigger, readers and concrete use; structured JSON shape and example where applicable |
| Relationships | Cardinalities, ownership path, foreign keys, deletion behavior and version references |
| Closed value sets | Every enum-like field, including states, kinds, actions, permissions and reason codes; exhaustive allowed values, meanings, defaults and database enforcement |
| State transitions | Source/target states, actor or event, guards, values read/written, transaction boundary, retries and failure behavior |
| Access and scale | Main filters, joins, ordering, bounded pagination, indexes, volume/growth assumptions and contention scope |
| Exceptions and lifecycle | Each denormalization/snapshot/index exception, immutable history, retention/purge triggers, migration/backfill and regional evolution where required |
| Verification | Schema/diagram/SQL consistency, rejected invalid values and relationships, isolation, concurrency and actual target-engine checks |

- Explain technical fields through concrete application scenarios; a paraphrase of the column name is insufficient. Read [diagram conventions](../conventions/diagrams.md) for state machines and behavioral acceptance scenarios.

### 0.1. Evidence-Based Plan Review Gate
- During the existing plan review, compare the actual proposed schema, dictionary, state transitions and queries with §0 and §§7–8, 10–12, 19, 23–27 and 31–35. Reading this file, listing its headings or declaring compliance is not evidence of application.
- Inventory the plan's affected tables, relationships, enum-like fields, stored states, copies/snapshots and access paths. Review each applicable item; a representative example cannot certify the rest. For unchanged structures, inspect referenced current schema sources when the plan relies on them.
- Include a compact compliance matrix in the existing review report; group items only when they share the same evidence and verdict:

| Criterion and affected items | Exact plan/schema citation | Design evidence or justified exception | Verdict | Required correction |
|---|---|---|---|---|
| Applicable convention and table/field/query names | File plus section/lines; for a missing element cite the requirement and searched sections | Concrete proposed behavior, constraint or ownership mechanism | CONFORMING / JUSTIFIED_EXCEPTION / NOT_APPLICABLE / MISSING / CONTRADICTORY | Precise change, or none |

- Check field purpose and lifecycle; cardinalities and parent ownership; redundant identifiers/snapshots and immutable history; exhaustive closed values with database enforcement; transitions and derived states; SQL views/prepared queries and bounded indexed access; concurrency/idempotency; retention and migration/verification plans.
- A retained copy needs its concrete consumer, reason, consistency mechanism and cost. Verify that removing a copy preserves ownership enforcement. A rejected view/prepared-query option needs a relevant design or engine/driver reason, not a compulsory new mechanism.
- Accept NOT_APPLICABLE only with a reason grounded in the actual scope. Accept JUSTIFIED_EXCEPTION only where the convention permits an exception; it cannot waive isolation, integrity or safe parameterization. Cite the approved project override for a permitted local policy difference.
- MISSING, CONTRADICTORY or unsupported exceptions block approval of the affected data-model plan and progression to its implementation. Record corrections and recheck affected rows against the revised plan before approval; carry unresolved decisions as blockers, never as implicit passes. Follow the host review's existing retry/round limits.
- Review proposed mechanisms and their planned verification at this stage; do not require migrations or runtime tests to have run before implementation. Planned verification does not certify implemented constraints. For a plan with no data-model impact, record one scoped NOT_APPLICABLE verdict instead of inventing schema work.

## 1. Core Principles
- Model for **correctness first**, performance second
- Schema must be explicit, predictable, and stable
- One table = one clear business concept
- Prefer relational modeling over generic unstructured storage
- Enforce invariants in the database, not only in application code
- Never use database triggers for business logic

## 2. Data Access Layer
- All database access through a dedicated data access layer
- Controllers/handlers/services must not query the database directly
- Data access layer contains only persistence logic, not business orchestration

## 3. Table Design
- One clear entity per table. No catch-all tables
- Avoid polymorphic relations unless absolutely necessary
- Explicit join tables for many-to-many: `user_organization`, `role_permission`

## 4. Naming
- **Tables**: explicit, singular (or plural if project-consistent): `user`, `invoice`, `signature_request`
- **Columns**: explicit names (`organization_id`, `created_at`). No abbreviations (`usr`, `org`, `dt`)

## 5. Primary Keys
- Every table must have a primary key
- One consistent ID strategy per project. IDs must be stable and immutable

## 6. Foreign Keys
- Mandatory unless strong reason exists. Referential integrity enforced by database
- Choose delete strategy intentionally: `RESTRICT`, `CASCADE`, `SET NULL`
- Never rely solely on application code for referential integrity

## 7. Multi-Tenant Data Isolation
- Every tenant-scoped operation must enforce ownership, including direct child reads/writes, background jobs and view access. Derive trusted tenant context server-side.
- Store tenant identity on ownership roots. A child with a mandatory, unambiguous ownership path may resolve it through a scoped join or equivalent database policy; a tenant column on every child is not mandatory.
- Never remove ownership enforcement when removing a redundant identifier. Document the enforced path and test cross-tenant reads, inserts, updates and reparenting under the actual application role.
- When several references must share a tenant or business parent, enforce their consistency with database constraints, such as composite foreign keys where supported. Independent foreign keys only prove existence.
- Keep a duplicated ownership key only for a documented constraint, isolation mechanism or concrete access pattern; enforce its agreement with the parent. A generic claim of security or speed is insufficient.

## 8. Indexing
- Indexes must reflect real query patterns (filters, joins, ordering, uniqueness)
- Review exact duplicates and prefix coverage before adding an index; compare uniqueness, predicates, ordering and included columns before removing one.
- Composite indexes follow query shape: `INDEX (organization_id, user_id, created_at DESC)`

## 9. Query Typing & Schema Safety
- Query results must have explicit expected shape with declared columns
- Column rename/removal should break at build/type-check time when possible
- Avoid untyped `row["name"]` — prefer typed ORM, typed query builder, or schema-generated types
- If compile-time safety unavailable: explicit output contracts + integration tests

## 10. Query Rules
- Never `SELECT *` — select only required columns
- Avoid overfetching and repeated round-trips; prefer a set-based query over separate lookups when it preserves semantics. A single statement does not replace required transaction or concurrency guarantees.

## 11. Pagination
- Always bounded, never unbounded lists
- **Avoid OFFSET on large tables** — cost grows as O(OFFSET + LIMIT)
- **Use keyset pagination** — cost is O(LIMIT):

```sql
SELECT * FROM events
WHERE created_at < ?
ORDER BY created_at DESC
LIMIT 20
```

## 12. N+1 Queries
- Never: 1 query for parents + 1 query per child row
- Use joins, grouped queries, or batch loading

## 13. Batch Operations
- Avoid many small inserts/updates — batch them:

```sql
INSERT INTO tags (id, name) VALUES (1,'a'), (2,'b'), (3,'c')
```

## 14. Filter in Database
- Never load a large dataset then filter in application code
- Apply `WHERE` clauses in SQL

## 15. Sorting Requires Index
- If a query sorts frequently (`ORDER BY created_at DESC`), an index must support it
- Without index: scan → sort → discard (expensive)

## 16. COUNT on Large Tables
- `SELECT COUNT(*)` may be expensive on huge tables
- Alternatives: cached counters, approximate counts, "has_more" pagination flag

## 17. LIKE Searches
- `WHERE name LIKE '%john%'` prevents index usage
- Prefer: prefix search, full-text search, or specialized indexing

## 18. Large IN Lists
- Avoid `WHERE id IN (10000 values)`
- Use: temporary tables, join tables, or batching

## 19. Short Transactions
- Transactions must be minimal — no HTTP calls, long loops, or slow processing inside
- Pattern: prepare data → start transaction → perform writes → commit

## 20. Batch Large Deletes
- Never delete millions of rows at once — delete in batches

## 21. JSON Columns
- JSON only for: metadata, provider payloads, optional extensions
- If a field is frequently filtered/joined/sorted, make it a real column

## 22. Log/Event Tables
- Queries must include: time limits, tenant filters, pagination (these tables grow indefinitely)

## 23. Avoid Over-Indexing
- Indexes improve reads but slow writes (insert, update, delete cost)
- Add only when justified by real queries

## 24. Concurrency
- Never assume read-then-write is safe
- Use: unique constraints, transactions, optimistic locking, version fields, idempotency keys
- Choose the narrowest correct contention scope; avoid serializing an entire tenant or calendar when independent resources can proceed safely. State throughput assumptions and distinguish estimates from measured capacity.

## 25. Idempotent Operations
- Retry-able operations must be idempotent (payment webhooks, job processors, callbacks)
- Use: unique operation IDs, request IDs, external reference keys

## 26. Migrations
- All schema changes through migrations. One logical change per migration
- Migrations must be reviewed. Avoid unsafe changes on large tables

## 27. Safe Schema Evolution
- Never add non-null columns to large tables in one step or drop columns still used by code
- Process: add nullable → backfill → deploy code → make required

## 28. Observability
- Monitor: slow queries, query counts, deadlocks, lock timeouts, migration failures

## 29. Query Review Checklist
Before shipping: tenant scope enforced? filter indexed? pagination applied? columns minimal? sorting indexed? N+1 risk? cross-tenant leak risk?

## 30. Fundamental Principle
Efficient query = index seek → read small subset → return. Avoid: scan large table → filter → sort → discard.

## 31. Input Normalization, Validation & Parameter Safety
External inputs must **never** reach the database layer without normalization, validation, authorization checks and safe parameterization.
### Processing Pipeline
```
input → schema validate/normalize → authz/tenant scope check → whitelist-map query params → parameterized query
```
### Schema-Based Validation
All external inputs through a **schema-based validation framework** before DB layer. `schema.parse(input)` → ready-to-use object (validated + normalized). No scattered post-validation sanitization.
Frameworks: JS/TS: Zod (preferred), Yup, Valibot — Python: Pydantic — Kotlin/JVM: Jakarta Bean Validation — Swift: Vapor Validations — Go: go-playground/validator — Delphi: DelphiMVCFramework validation.
### Normalization (Inside Schema)
- Operations: trim whitespace, collapse spaces, case normalize, parse numbers/dates, format slugs, remove invisible chars. Example: `" Julien "` / `"julien"` → `julien`
- Align validation rules with DB constraints: max lengths match column limits, enums match allowed values, identifier formats enforced early
### Parameterized Queries (Mandatory)
- All external values via **bind parameters** — never string interpolation
- Bad: `WHERE username = '${input}'` — Good: `WHERE username = ?` (bound value)
- Normalization/sanitization **does not replace** parameterized queries — only parameterized queries prevent SQL injection
### Non-Parameterizable Elements
- Column names, table names, sort directions, operators, dynamic clauses **cannot** be parameterized
- Must come from **strict internal whitelists**, never from raw input
- Map: `input.sort="createdAt"` → `"created_at"`, `input.direction="desc"` → whitelist `DESC`
- Never: `ORDER BY ${userInput}`
### Pre-Query Input Validation
- Before building any query: validate type correctness, allowed values, format, length limits, numeric bounds, enum membership, tenant ownership
- Example: `limit` between 1–100, `status` one of `active|disabled|archived`
- Pagination/batch params (`limit`, `offset`, `batchSize`, `pageSize`): always clamped — `clamp(limit, 1, 100)`
### Text Search Safety
- Normalize search input (trim, case) for consistency
- Wildcards added to **bound parameter value**, never to SQL string
- Bad: `WHERE name LIKE '%${input}%'` — Good: `WHERE name LIKE ?` with value `%julien%`

## 32. References, Immutable Versions and Minimal Stored State
- Prefer normalized relationships and joins. Do not repeat a product, tenant, client or version ID when a mandatory parent already provides it unambiguously, unless §7 or a documented query/constraint requires it.
- Prefer one shared immutable version referenced by transactions to repeated copies of its content. A content change creates a new version; enforce immutability and prevent deletion while historical references require it.
- Keep transaction-specific facts that must survive later changes, such as applied currency, timezone, price or rate, either as immutable references or justified frozen values.
- For each retained copy or snapshot, record its consumer, historical/query/constraint need, source of truth, consistency mechanism and storage/write cost. Do not justify copies with hypothetical speed gains.
- Derive states from existing facts when sufficient; avoid a stored flag or scheduled state update merely to mirror a deadline. Preserve distinct facts such as provider reconciliation when expiry alone cannot safely release a resource.
- Reject unused fingerprints, digests, request IDs, timestamps and speculative state machines; retain those with a concrete integrity, audit, idempotency or operational consumer.

## 33. Closed Sets and Database Enforcement
- Inventory all closed value sets in the first plan, including enum-like text columns and permission collections; no partial lists or unspecified future values.
- Constrain them with engine-supported enums, CHECK constraints, reference tables or normalized permission relations. Generated application types alone do not constrain stored values.
- Keep genuinely open text, provider payloads and user explanations open; distinguish a closed reason code from free-form detail. Define handling for unknown external values and version changes.
- Keep allowed values, defaults, transition contracts, SQL constraints and generated types aligned; test rejection through actual database writes, not only application validation.
- Document nullable composite keys and uniqueness semantics explicitly; test whether the intended invariant holds when one or more components are NULL.

## 34. Database-Side Read Models and Prepared Queries
- Prefer reusable SQL views for shared joins, projections, derived states and aggregates rather than repeating their definitions in application queries or copying their outputs into base tables.
- A normal view centralizes a query; it does not cache results or guarantee a speedup. Justify materialized views separately with freshness, refresh/recovery ownership and storage/write costs.
- Keep view access tenant-scoped and verify engine-specific privileges/RLS under the consuming role. Keep workflow orchestration and external side effects in application services; do not introduce business triggers.
- Filter, aggregate and join in the database instead of loading rows for application-side processing. Keep queries behind the data access boundary.
- Bind all values as required by §31. Prefer reusable prepared statements for repeated query shapes where the driver, connection pool and engine support them; document lifecycle or pooling limits. Parameterization is mandatory even when server-side preparation is unavailable.

## 35. Growth, Retention and Verification
- Create costly derived data only when needed, then reuse it. For translations, keep source content/version and locale in dedicated related tables; generate a requested translation once and define invalidation when its source changes.
- Define retention, expiry, purge or anonymization triggers and responsible jobs for technical rows, logs, caches and personal data. Preserve required history and active operations; use bounded cleanup, not indefinite accumulation or arbitrary durations.
- Plan supported future changes, such as guest-to-account identity continuity or regional relocation, without speculative duplicate entities or premature distributed infrastructure.
- Use migrations as the executable schema source; synchronize dictionaries, plans, diagrams, generated types and SQL exports. Do not assume a visual editor exports every documented constraint.
- Verify migrations and constraints on the intended engine in an isolated local/test database, including negative writes. A substitute engine can provide partial evidence but cannot certify target-specific behavior.
- For each schema warning or ignored finding, record the exact target, reason, corrective action or accepted exception and verification. Never treat a hidden warning as a corrected invariant.
