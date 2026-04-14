---
extends: []
---
# Database Rules

> Language-agnostic and ORM-agnostic. Apply regardless of stack.
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
- Tenant isolation explicit in schema: `organization_id` on every tenant-scoped table
- Queries must always include ownership scope:

```sql
-- Bad
SELECT * FROM notes WHERE id = ?

-- Good
SELECT * FROM notes WHERE organization_id = ? AND id = ?

-- Or with user scope
SELECT * FROM notes WHERE organization_id = ? AND user_id = ? AND id = ?
```

Prevents: cross-tenant data leaks, IDOR attacks, accidental access to other orgs' data.

## 8. Indexing
- Indexes must reflect real query patterns (filters, joins, ordering, uniqueness)
- Composite indexes follow query shape: `INDEX (organization_id, user_id, created_at DESC)`

## 9. Query Typing & Schema Safety
- Query results must have explicit expected shape with declared columns
- Column rename/removal should break at build/type-check time when possible
- Avoid untyped `row["name"]` — prefer typed ORM, typed query builder, or schema-generated types
- If compile-time safety unavailable: explicit output contracts + integration tests

## 10. Query Rules
- Never `SELECT *` — select only required columns
- Avoid overfetching and repeated round-trips

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
