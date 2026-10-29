---
extends: [elixir, database]
---
# Ecto and PostgreSQL Rules

## When to use

Apply to Ecto schemas, changesets, queries, Postgrex connections and database migrations. Read [SQL conventions](database.md) for general invariants and [Oban](oban.md) for transactional jobs. Ecto does not make every PostgreSQL-protocol database equivalent.

## Schemas, input and queries

- Define explicit schemas/types and changesets per operation. Cast an allowlist of externally writable fields; never mass-assign ownership, role, payment state or price authority from client params. Assign tenant/actor fields from trusted scope.
- Normalize and validate boundary data in changesets or embedded schemas. Distinguish `cast` (external params) from `change` (trusted internal values); a valid changeset is not authorization.
- Use parameter interpolation (`^value`) in Ecto queries. Dynamic fields/order come from internal allowlists, never arbitrary strings/atoms from users. Keep tenant predicates in every applicable query, including updates/deletes/preloads and joins.
- Select required fields, bound page size, preload deliberately and inspect N+1 behavior. Use `Repo.stream` only with its required transaction and bounded consumption; a long stream holds resources/connection until completion.
- Translate persistence failures into explicit domain outcomes. Use `unique_constraint`, `foreign_key_constraint`, `check_constraint` or `exclusion_constraint` with matching database constraints/names; changeset validation alone cannot prevent concurrent violations.

Illustrative query; the caller has validated scope, cursor and page size:

```elixir
from(booking in Booking,
  where: booking.tenant_id == ^scope.tenant_id and booking.id > ^cursor,
  order_by: [asc: booking.id], limit: ^page_size,
  select: %{id: booking.id, starts_at: booking.starts_at})
|> Repo.all()
```

## Transactions and concurrency

- Keep context orchestration separate from reusable schema/query functions. Use `Ecto.Multi` for named, dependent operations in one transaction; inspect failures by operation and translate them at the boundary. Use the transaction API supported by the pinned Ecto version; `Repo.transaction(multi)` remains the broadly established Multi pattern.
- No HTTP/provider work in the transaction. Insert an Oban job or outbox row in the same database transaction for later external execution. A rollback must leave neither the domain row nor its job committed.
- For a fixed booking slot, enforce database uniqueness at the actual business key (including tenant/resource). For overlapping time intervals, use a suitable PostgreSQL exclusion constraint or an explicitly designed locking strategy. Check cancellation/status semantics too; a naive timestamp unique index does not prevent interval overlap.
- Use optimistic locking for stale edits; handle `Ecto.StaleEntryError` deliberately. Use row locks only inside a transaction when required, with lock order and timeouts; a lock on no row cannot prevent all competing inserts.
- Retry only appropriate transient database failures, with a bounded policy around the entire safe transaction. Retain the same operation identity. Test two independent contenders and assert the durable invariant, not which process wins.
- Use Postgrex/Ecto pool sizes derived from total web/job/node demand and database connection capacity. Do not use pool growth as the first response to slow queries or blocked transactions.

## Migrations and deployment

- Commit reviewed migration files; run migration operations once through a deployment/release task, not concurrently in every web startup. Use `mix ecto.migrations` to inspect development/test state; production release commands must be defined by that application.
- Expand first, deploy compatible readers/writers, backfill in bounded restartable batches, then contract. Avoid locking table rewrites and dropping fields still used by old nodes. A reversible `down` is not proof that deleted data can be recovered.
- Use `change/0` for reversible operations or explicit `up/0`/`down/0`; give raw SQL a reverse operation where valid. Document irreversible changes, backups and forward recovery.
- Concurrent PostgreSQL index creation needs migration transaction/lock settings appropriate to the chosen Ecto version and deployment serialization. Do not copy `@disable_ddl_transaction` / `@disable_migration_lock` without documenting how concurrent deploys remain safe.
- Rehearse migrate/rollback/migrate on a disposable database where rollback is supported. Also test application compatibility across deployment order and restored backups for destructive operations; never run this rehearsal on production.
- CockroachDB speaks PostgreSQL's wire protocol, but Ecto SQL behavior, migrations, isolation/retry semantics and the selected Oban engine must be integration-tested explicitly before adoption. Neither compatibility nor impossibility follows from the protocol alone.

## Testing requirements

Use real PostgreSQL for persistence semantics; read [SQL Sandbox and concurrency testing](elixir-testing.md). Cover invalid input, constraint mapping, tenant scope, transaction rollback and contested booking/payment transitions. In-memory fakes are useful for pure domain tests, but cannot prove database locking, indexes or isolation.

## Sources

Official references checked 2026-10-28:

- Consult [Ecto.Changeset](https://hexdocs.pm/ecto/Ecto.Changeset.html), [Ecto.Multi](https://hexdocs.pm/ecto/Ecto.Multi.html) and [Ecto.Query](https://hexdocs.pm/ecto/Ecto.Query.html) for validation, transactions and queries.
- Consult [Ecto migrations](https://hexdocs.pm/ecto_sql/Ecto.Migration.html) and [SQL Sandbox](https://hexdocs.pm/ecto_sql/Ecto.Adapters.SQL.Sandbox.html) for deployment and test ownership.
