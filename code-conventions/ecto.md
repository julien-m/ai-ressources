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

## Compact public IDs for UUID primary keys

Apply [the shared primary-key rules](database.md#5-primary-keys) and read [the PostgreSQL implementation notes](../stack-ref/databases/postgres.md#clés-et-index) for native storage and database-side generation. When the application owns generation, Ecto 3.14 supports creating UUIDv7 before an insert.

For a Phoenix API that needs compact opaque IDs, use [the shared public identifier rules](database.md#51-public-identifiers). This example adapts reversible, prefixed AES-128 encoding to Ecto. Apply one prefix per exposed entity and reuse it on its foreign-key fields. The encoded form hides the UUIDv7 timestamp and uses 26 characters with `usr_`, compared with 36 for a canonical UUID.

### Ecto type and runtime configuration

Configure a dedicated, randomly generated 32-byte secret in the deployment secret store, shared by every node that serves the same IDs. Add `:crypto` to the application's `extra_applications`. The schema stores only the prefix at compile time. The type reads the secret at runtime.

```elixir
# config/runtime.exs
import Config

case System.fetch_env("OPAQUE_UUID_KEY") do
  {:ok, encoded_key} ->
    case Base.decode64(encoded_key) do
      {:ok, <<_::256>> = key} -> config :my_app, :opaque_uuid_key, key
      _ -> raise "OPAQUE_UUID_KEY must contain 32 random bytes encoded as Base64"
    end

  :error ->
    if config_env() == :prod, do: raise("OPAQUE_UUID_KEY is required")
end
```

Set the key in development and test configuration or their environment before calling the type.

```elixir
defmodule MyApp.OpaqueUUID do
  use Ecto.ParameterizedType

  @impl true
  def init(opts), do: Keyword.fetch!(opts, :id_prefix) <> "_"

  @impl true
  def type(_prefix), do: :uuid

  @impl true
  def autogenerate(prefix) do
    Ecto.UUID.bingenerate(version: 7) |> encode(prefix)
  end

  @impl true
  def cast(nil, _prefix), do: {:ok, nil}

  def cast(token, prefix) do
    case decode_payload(token, prefix) do
      {:ok, _encrypted} -> {:ok, token}
      :error -> :error
    end
  end

  @impl true
  def load(nil, _loader, _prefix), do: {:ok, nil}
  def load(<<_::128>> = uuid, _loader, prefix), do: {:ok, encode(uuid, prefix)}
  def load(_, _loader, _prefix), do: :error

  @impl true
  def dump(nil, _dumper, _prefix), do: {:ok, nil}

  def dump(token, _dumper, prefix) do
    with {:ok, encrypted} <- decode_payload(token, prefix) do
      {:ok, :crypto.crypto_one_time(:aes_128_ecb, key(prefix), encrypted, false)}
    end
  end

  defp encode(uuid, prefix) do
    encrypted = :crypto.crypto_one_time(:aes_128_ecb, key(prefix), uuid, true)
    prefix <> Base.url_encode64(encrypted, padding: false)
  end

  defp decode_payload(token, prefix) do
    prefix_size = byte_size(prefix)

    with <<^prefix::binary-size(prefix_size), encoded::binary-size(22)>> <- token,
         {:ok, <<_::128>> = encrypted} <- Base.url_decode64(encoded, padding: false),
         ^encoded <- Base.url_encode64(encrypted, padding: false) do
      {:ok, encrypted}
    else
      _ -> :error
    end
  end

  defp key(prefix) do
    master_key = Application.fetch_env!(:my_app, :opaque_uuid_key)

    :crypto.mac(:hmac, :sha256, master_key, "opaque-uuid:v1:" <> prefix)
    |> binary_part(0, 16)
  end
end
```

### Schemas, migrations and Phoenix queries

Use the target entity's prefix on the foreign key so primary and foreign keys have the same representation in Ecto. Define the foreign-key field explicitly and have `belongs_to` reuse it.

```elixir
defmodule MyApp.Accounts.User do
  use Ecto.Schema

  @primary_key {:id, MyApp.OpaqueUUID, id_prefix: "usr", autogenerate: true}
  schema "users" do
  end
end

defmodule MyApp.Billing.Quote do
  use Ecto.Schema

  @primary_key {:id, MyApp.OpaqueUUID, id_prefix: "quo", autogenerate: true}
  schema "quotes" do
    field :user_id, MyApp.OpaqueUUID, id_prefix: "usr"
    belongs_to :user, MyApp.Accounts.User, define_field: false
  end
end
```

Use native UUIDs in the migration. This example assigns generation to Ecto, so the database columns have no generation default.

```elixir
create table(:users, primary_key: false) do
  add :id, :uuid, primary_key: true
end

create table(:quotes, primary_key: false) do
  add :id, :uuid, primary_key: true
  add :user_id, references(:users, type: :uuid), null: false
end

create index(:quotes, [:user_id])
```

Normal schema inserts generate the UUIDv7 and return the encoded ID. Ecto decodes bound query parameters on dump and encodes database values on load, including association fields. In a Phoenix context, validate route input before querying and scope the lookup to the authenticated user's access. For example, this query implements owner-only access. The caller uses the same generic 404 response for a malformed ID and a missing quote.

```elixir
def fetch_quote(quote_id, %MyApp.Accounts.User{id: user_id}) do
  alias MyApp.Billing.Quote

  with {:ok, id} when is_binary(id) <- Ecto.Type.cast(Quote.__schema__(:type, :id), quote_id),
       %Quote{} = quote <- MyApp.Repo.get_by(Quote, id: id, user_id: user_id) do
    {:ok, quote}
  else
    _ -> {:error, :not_found}
  end
end
```

Select public fields in the Phoenix JSON renderer. The selected ID values are already strings and need no further conversion. Plain SQL, external writers and table-name-only bulk operations bypass schema callbacks. Pass explicit IDs to bulk/import paths and verify the representation each entry point expects.

- This uses AES on exactly one 16-byte block per identifier. The same UUID and prefix produce the same public ID. The 22-character payload carries no authentication tag, so format validation cannot detect every alteration. Use object-level authorization on every access. Use a separate authenticated token for share links or other capabilities.
- Treat both the entity prefix and the encoding key as part of the public ID contract. Replacing either changes emitted IDs. Plan versioned decoding for old links before migrating the format or rotating the key. Keep a stored random public ID with a unique constraint as an alternative when links must remain independent of encryption keys.
- Verify with the pinned Ecto/Postgrex versions and real PostgreSQL. Cover insert, scoped lookup, association preload, native UUID column types, malformed or wrong-prefix input and stable encoding across reloads.

Read [Ecto.ParameterizedType](https://hexdocs.pm/ecto/Ecto.ParameterizedType.html), [Ecto.UUID](https://hexdocs.pm/ecto/Ecto.UUID.html) and [PostgreSQL UUID functions](https://www.postgresql.org/docs/18/functions-uuid.html) for callback, generation and storage semantics.

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
