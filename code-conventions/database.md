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
| Data dictionary | Table purpose; each field's meaning, type, nullability, default, source/writer, exact default value/expression and its owner/trigger where required, creation/update trigger, readers and concrete use; structured JSON shape and example where applicable |
| Relationships | Cardinalities, ownership path, foreign keys, deletion behavior and version references |
| Engine and consumer contract | Actual engine/version, relevant modes/connection settings, driver and language mappings; documented guarantees and differences for each supported target, including development versus production |
| Types, bounds and arithmetic | Per-field SQL and application types, units, text/payload limits, integer range, exact/approximate arithmetic, decimal precision/scale, rounding and conversion policy; reasons and targeted verification |
| Nullability and uniqueness | Required/optional/conditionally required fields with reasons; unique columns or column sets, business scope, predicates, NULL semantics and database constraints; schema inspection and risk-based positive/negative test cases |
| Closed value sets | Every enum-like field, including states, kinds, actions, permissions and reason codes; exhaustive allowed values, meanings, defaults and database enforcement |
| State transitions | Source/target states, actor or event, guards, values read/written, transaction boundary, retries and failure behavior |
| Access and scale | Main filters, joins, ordering, bounded pagination, indexes, volume/growth assumptions and contention scope |
| Exceptions and lifecycle | Each denormalization/snapshot/index exception, immutable history, retention/purge triggers, migration/backfill and regional evolution where required |
| Verification | Schema/diagram/SQL consistency, rejected invalid values and relationships, isolation, concurrency and actual target-engine checks |

- Explain technical fields through concrete application scenarios; a paraphrase of the column name is insufficient. Read [diagram conventions](../conventions/diagrams.md) for state machines and behavioral acceptance scenarios.

### 0.1. Evidence-Based Plan Review Gate
- During the existing plan review, compare the actual proposed schema, dictionary, state transitions and queries with §0, §§3.1–3.3 and §§7–8, 10–12, 19, 23–27 and 31–35. Reading this file, listing its headings or declaring compliance is not evidence of application.
- Inventory the plan's affected tables, relationships, enum-like fields, stored states, nullability and uniqueness rules, copies/snapshots and access paths. Review each applicable item; a representative example cannot certify the rest. For unchanged structures, inspect referenced current schema sources when the plan relies on them.
- Include a compact compliance matrix in the existing review report; group items only when they share the same evidence and verdict:

| Criterion and affected items | Exact plan/schema citation | Design evidence or justified exception | Verdict | Required correction |
|---|---|---|---|---|
| Applicable convention and table/field/query names | File plus section/lines; for a missing element cite the requirement and searched sections | Concrete proposed behavior, constraint or ownership mechanism | CONFORMING / JUSTIFIED_EXCEPTION / NOT_APPLICABLE / MISSING / CONTRADICTORY | Precise change, or none |

- Check field purpose and lifecycle; engine-specific failure modes (§3.3), type/size/range/precision choices and input limits (§3.2); mandatory/conditional values, exact defaults and their owner, installed constraints and justified non-NULL uniqueness test cases (§3.1); cardinalities and parent ownership; redundant identifiers/snapshots and immutable history; exhaustive closed values with database enforcement; transitions and derived states; SQL views/prepared queries and bounded indexed access; concurrency/idempotency; retention and migration/verification plans.
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

### 3.1. Required Values, Defaults, NULL Semantics and Uniqueness
- Specify every field's nullability and reason in the first plan: required, optional, or required under an explicit condition/state. State defaults and omission behavior separately; do not silently make a mandatory business fact nullable.
- Enforce required values with NOT NULL and conditional requirements with an appropriate database constraint. NOT NULL alone does not prohibit an empty string, zero or an out-of-range value; specify and constrain those separately when the business rule requires it. A CHECK that can evaluate to UNKNOWN must not accidentally admit a forbidden NULL.
- For every field that needs a default, specify its exact typed value or expression, business rationale, when it applies and which layer owns it (database DEFAULT, application or caller). Do not invent zero, false, empty text or an initial state as a fallback for an undecided business rule; do not duplicate conflicting defaults across layers.
- Verify required defaults in the actual migrated schema or the responsible application path, including validity against allowed values, nullability and other constraints. Distinguish omitted input from explicit NULL and preserve an explicitly supplied valid value. For generated/time-dependent defaults, define the expected generation/time semantics rather than a fixed sample value.
- Use schema inspection for straightforward native defaults; add behavior tests only when omission/NULL handling, application overrides, bulk/import paths, expressions or migration/export behavior present a distinct risk. Test that an omitted value receives the intended default and an explicit valid value remains unchanged when that is the contract. Defaults must not hide missing mandatory identity or business inputs.
- Inventory business uniqueness separately from primary keys: exact columns/expressions, global or tenant/parent/provider namespace, conditional predicate, case/normalization rules where relevant, and intended behavior when any component is NULL. Use database-enforced UNIQUE constraints or unique indexes as supported; an application pre-check is insufficient under concurrency.
- Reflect uniqueness and nullability in relationship cardinalities and diagram exports. A foreign key alone does not establish a one-to-one relationship; verify the actual unique key and optionality.
- Verify that the actual migrated schema contains the intended primary keys, NOT NULL constraints and unique keys/indexes with the correct columns and scope. A native primary key enforces uniqueness; verify its documented non-NULL guarantees for the chosen engine and table/key definition (PostgreSQL guarantees non-NULL components; some SQLite definitions do not). Require explicit NOT NULL where needed; do not add per-table duplicate/NULL insert tests merely to retest documented engine behavior. Apply the same proportionality to straightforward native NOT NULL/UNIQUE constraints whose definition is verified and whose behavior is not customized.
- Plan additional database-write tests only for a concrete modeling or integration risk: composite/scoped/partial business uniqueness, nullable-key semantics, conditional required values, normalization, generated/exported DDL that may omit constraints, migration changes or an observed regression. Name the risk; reuse existing migration/integration evidence when sufficient. Execute selected cases on the actual migrated schema during implementation/verification.
- Where required-value behavior needs such a test, accept a valid populated row and reject explicit NULL only in the states where the value is mandatory; test omission/default and conditional-state cases when they exercise distinct behavior.
- When a uniqueness write test is justified, insert an otherwise valid row with a real non-NULL business key, then reject a second distinct row with the same constrained key in the same scope; test update collisions when they exercise a distinct path or risk. Ensure rejection is caused by the intended constraint, not a duplicate primary key, missing parent or unrelated invalid field.
- For those selected uniqueness tests, also verify legitimate distinct keys and, for scoped uniqueness, reuse of the same key in another permitted scope. When relevant to the selected risk, test NULL coexistence or rejection according to the declared policy, including nullable components of composite keys and the active/inactive boundary of partial uniqueness where applicable. Passing only NULL inserts never proves rejection of duplicate populated keys.
- Report the constraint, concrete input, expected outcome and observed database result; do not change business rules or weaken a constraint to make a faulty fixture pass. Reuse sufficient tests and add only distinct cases needed by the invariant; real concurrent tests remain necessary when correctness depends on transaction/locking behavior beyond the constraint.
- Read [PostgreSQL constraint semantics](https://www.postgresql.org/docs/current/ddl-constraints.html) for NOT NULL, CHECK and nullable unique keys; read [SQLite primary-key semantics](https://www.sqlite.org/lang_createtable.html#the_primary_key) when targeting SQLite. Verify the chosen engine's semantics rather than assuming every engine treats NULL alike.

### 3.2. Types, Size Limits, Numeric Precision and Input Safety
- Choose each field's type from its meaning and actual operations, not an ORM default: SQL type, application/driver/API representation, unit, valid range, required precision and expected growth. A numeric-looking identifier or phone number is text when arithmetic is meaningless or leading zeroes matter.
- Define justified length/size limits for bounded business text, external identifiers, tokens and structured payloads; use upstream contracts or approved product rules, not an arbitrary universal length. For legitimately unbounded document content, document that choice and bound ingestion/processing separately.
- Distinguish characters, encoded bytes and user-perceived characters; align normalization, validation and index/collation behavior with the chosen engine and provider contract. Reject invalid/overlong input at the boundary and enforce essential persisted invariants in the schema; never silently truncate an identifier, token or business value to fit.
- In PostgreSQL, TEXT and VARCHAR have no general performance advantage over each other; VARCHAR(n) adds a character-length check, while CHAR(n) pads values. Use length restrictions for the domain contract, not a presumed fixed allocation or automatic speedup. Storage/index width and real query patterns still matter; verify other engines separately.
- Use integer types for whole-number quantities within a justified lifetime range; include aggregate/intermediate ranges, signedness where supported and overflow behavior. Do not choose the smallest integer merely to save bytes, or a floating point type to sidestep overflow.
- For money, prices, taxes, commissions and other exact quantities, choose exact decimals or scaled integers with an explicit unit/scale. PostgreSQL NUMERIC and DECIMAL are equivalent exact numeric types; REAL/DOUBLE PRECISION are approximate. Do not assume every currency has two decimal places. Exact storage does not remove the need for rounding rules for division, allocation or excess scale.
- Specify decimal precision/scale from maximum magnitude, required fractional resolution and intermediate calculations; state the rounding mode and stage (per item, calculation or final total), treatment of excess precision and overflow. Do not rely on implicit casts or column coercion to decide a business rounding rule, or invent a universal NUMERIC precision/scale.
- Approximate measurements/scientific calculations may use floating point when the error budget and comparison tolerance are explicit. Decide whether NaN/Infinity are allowed; reject them where ordinary finite business values are required. Document cancellation/accumulated error risks when relevant to the calculation.
- Preserve exact values across SQL, driver, application arithmetic and API serialization. Do not convert exact decimals or large integers through a binary float or an undersized consumer integer. For Delphi consumers, verify the actual target's Single/Double/Extended representation and database field mapping; Extended does not offer identical precision across platforms. Choose a suitable exact decimal/scaled representation when required.
- Size limits reduce resource-abuse exposure but do not replace authorization or safe SQL parameters (§7, §31). Bound request bodies, collections and JSON depth/element/string sizes before costly processing where relevant; validate shape/format and reject unsupported fields instead of accepting arbitrary query/schema elements.
- Inspect installed type/length/precision declarations. Add only risk-based boundary/calculation/conversion tests: valid limits and overflow, excess-scale/rounding, multibyte length, no silent truncation and exact driver/API round trips where those risks exist. Reuse sufficient evidence and do not retest native type limits on every column.
- Read [PostgreSQL character types](https://www.postgresql.org/docs/current/datatype-character.html), [numeric types and rounding](https://www.postgresql.org/docs/current/datatype-numeric.html) and [Delphi Extended portability](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Extended) before relying on their engine/platform-specific behavior.

### 3.3. Engine-Specific Failure and Data Integrity Review
- Record the actual engine/version, relevant SQL/strict modes, collation/encoding, timezone and connection enforcement settings, plus driver/ORM/runtime mappings. State which guarantees are documented, inspected or experimentally verified; do not generalize a PostgreSQL behavior to another database or a local substitute.
- For each actually supported target, document the chosen equivalent or explicit limitation for required types, constraints and calculations. Cover relevant development/production differences; do not create a speculative all-engine test matrix.
- Review these hazards where applicable, citing the proposed prevention and sufficient verification in the existing plan-review matrix. A documented engine guarantee plus correct installed definition can be enough; add tests only for distinct application, conversion, migration or concurrency risks.

| Failure mode | Contract to establish before approval |
|---|---|
| Coercion or truncation changes meaning | Accepted input types, conversion/normalization points, rejection versus approved rounding, actual length/precision and SQL modes; inspect import/bulk/cast paths that could behave differently |
| Incorrect calculation | Units/currency/scale, operand and intermediate/result types, integer versus decimal division, zero divisors, overflow, aggregate NULL/empty-set behavior and rounding stage; no automatic zero for an unknown value |
| Time/date shift | Instant versus local date/time/duration, timezone identifier where future civil-time rules matter, daylight-saving ambiguous/missing times, precision and clock ownership; no dependence on an unspecified session timezone or locale parser |
| Wrong equality or ordering | Case/accent/Unicode normalization, collation and trailing-space semantics for lookup and uniqueness; stable tie-breakers for pagination or order-dependent computation |
| Constraints only appear enforced | Actual migrated constraints, validation/enforcement state, relevant connection settings and application role; distinguish model comments/ORM validation from database guarantees |
| Lost update, partial operation or replay | Atomic write boundary, documented isolation/locking, idempotency scope, retryable errors versus business rejection and reconciliation after uncertain commit/provider outcome; an exception handler must not turn failure into success |
| Migration/import damages existing values | Source/target type and unit mapping, backfill/conflict policy, reconciliation of row counts and relevant totals/invariants, compatibility window and recoverability; never silently discard rejected rows |
| Exposure or destructive access | Scoped roles/ownership, parameterized queries, bounded inputs, sensitive-field handling and redacted errors/logs; input size restrictions alone do not secure data |

- Distinguish semantically invalid values or relations from physical storage corruption/data loss. For the latter, identify operational backup/restore and integrity-check responsibilities appropriate to the deployment; tests of business constraints do not prove recoverability, and a model change does not require a new backup system by default.
- Read [MySQL SQL modes](https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html), [SQLite STRICT tables](https://www.sqlite.org/stricttables.html), [PostgreSQL aggregate semantics](https://www.postgresql.org/docs/current/functions-aggregate.html) and [date/time semantics](https://www.postgresql.org/docs/current/datatype-datetime.html) when those engine behaviors are relevant; verify the deployed version and configuration rather than assuming defaults.

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
