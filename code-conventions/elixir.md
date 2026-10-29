---
extends: [general, architecture, logging, testing]
---
# Elixir Rules (Delta)

## When to use

Apply to Mix applications, libraries and BEAM backends. These are language-specific refinements of the shared conventions, not a decision to adopt Elixir. Read [OTP rules](elixir-otp.md) for processes and native code, [Phoenix rules](phoenix.md) for HTTP, and [Elixir testing](elixir-testing.md) before validation.

## Toolchain and dependencies

- Use Mix and Hex; commit `mix.lock` for applications. Pin exact Elixir and Erlang/OTP versions in the project's version-manager file and CI; `elixir: "~> ..."` in `mix.exs` is a compatibility constraint, not a runtime lock.
- Check the official compatibility table for the chosen Elixir/OTP pair, OS image and dependencies. Build releases for the production OS/architecture and compatible native libraries; a macOS build is not a Linux release.
- Review Hex package maintenance, license, transitive dependencies and runtime requirements before adding one. Upgrade deliberately with tests and a lockfile diff; do not install every library mentioned here.
- Use `.ex` for compiled modules, `.exs` for scripts/config/tests, `lib/` for application code and `test/` mirroring `lib/`. Use `mix format` and the project's `.formatter.exs` (including selected dependency imports/plugins).

## Idioms and contracts

- Modules use `PascalCase` namespaces (`MyApp.Billing.Invoice`); functions, variables and source files use `snake_case`. Predicates end in `?`; `!` signals an explicitly raising variant. `is_*` names belong to type/guard-like checks rather than every domain predicate.
- Prefer immutable values, small pure functions, pattern matching and guarded clauses. Use structs for domain data and behaviours (`@callback`, `@impl true`) for external adapters. Avoid macros unless a function cannot express the requirement clearly.
- Match expected shapes at boundaries; use `case` for alternatives and `with` for dependent success tuples. Make error shapes distinguishable when different steps need different handling. Do not use `=` to crash on routine invalid input.
- Return `{:ok, value}` / `{:error, reason}` for expected failures. Raise for violated programmer invariants; do not rescue every exception or turn unknown failures into success. OTP recovery is not a substitute for validating inputs.
- Prefer `Enum` for bounded eager transformations; use `Stream` for lazy pipelines only when the consumer stays bounded. `Enum.to_list/1` still materializes a stream. Push filtering/pagination into SQL before loading rows.
- Avoid repeated list append, unbounded recursion retaining state and unnecessary binary copies. Never create atoms from arbitrary external strings; map to a finite allowlist. Do not evaluate user code or deserialize arbitrary Erlang terms from untrusted clients.

Short pattern example; `adapter` implements the project's persistence behaviour:

```elixir
with {:ok, attrs} <- InvoiceInput.cast(params),
     {:ok, invoice} <- adapter.insert_invoice(scope, attrs) do
  {:ok, invoice}
end
```

## Functions, options and conversions

- Use `def` for the intended public/context API, `defp` for implementation details. A module namespace is not a class instance; inject adapters as explicit arguments/options or validated startup dependencies rather than constructing service objects.
- Use `alias` for local module names, narrow `import` for required functions/macros, `require` for macros and `use` only when its generated behavior is understood. Keep dependencies explicit and avoid broad convenience imports.
- Use two-space indentation and formatter defaults, not JS tabs/semicolons. Mirror module names in paths (`MyApp.Billing.Invoice` → `lib/my_app/billing/invoice.ex`).
- Keyword lists suit a small set of optional parameters; validate supported keys, value types and defaults at the public boundary. A keyword list can contain duplicate keys; reject ambiguity when it matters. Use a named struct/embedded schema for a substantial validated request, and typed structs or tagged tuples for results.
- Convert transport, domain and persistence representations in explicit functions. Keep absence (`nil`), expected error tuples and successful empty collections distinct; never use truthiness to conflate a valid value with failure.
- Prefer composition through functions/behaviours. Use protocols only for genuine data-type polymorphism; avoid building a framework of abstractions before several implementations need it.

Small option example; a real boundary also rejects unknown/duplicate keys and enforces the configured maximum:

```elixir
@spec page_size(keyword()) :: pos_integer()
def page_size(opts) do
  Keyword.fetch!(opts, :page_size)
end
```

## Constants and module attributes

- `@name` is a compile-time attribute, not a mutable shared field. Reading it inside a function embeds a snapshot; later compile-time reassignment does not update an already compiled function. An expression assigned at module scope runs during compilation, not on every request.
- Use attributes for stable local facts and annotations, not deployment secrets, current time, remote HTTP calls, open connections or live counters. Repeatedly embedding large values can grow compiled code; keep large data in an appropriate runtime store and measure.
- An enum-like domain contract may use a finite set of atoms and a union type; do not copy a TypeScript constant object or invent a constant for every literal. Document the origin of policy values and keep changing business settings in validated configuration/data.

Illustrative closed vocabulary; the consuming domain defines its actual allowed states:

```elixir
@type status :: :draft | :signed
@statuses [:draft, :signed]
@spec valid_status?(term()) :: boolean()
def valid_status?(value), do: value in @statuses
```

- `Application.compile_env/3` intentionally binds a build-time dependency. `Application.fetch_env!/2` in a function reads the current runtime application environment; changes only apply to processes that actually reread/reload it. Application env is VM-wide configuration, not tenant state or a substitute for explicit dependency injection.
- Keep mutable state in an owned supervised process, ETS or a durable database according to the lifetime needed; do not reach for `:persistent_term` as a generic mutable store. Read [OTP state ownership](elixir-otp.md) before choosing one.

## Types and documentation

- Write `@moduledoc`, `@doc`, public `@spec` and domain `@type` / `@opaque` contracts, including tagged errors and side effects. Use `@spec` rather than foreign-language return annotations.
- Typespecs document intent; Dialyzer finds discrepancies through success typing, not proof of total correctness. New compiler type diagnostics depend on the pinned Elixir version. Neither replaces runtime validation, authorization or database constraints.
- Use Dialyxir when adopting Dialyzer in the project; maintain a reviewed PLT/cache and explain narrow suppressions. Gleam can be an optional BEAM component, but does not type Elixir modules or directly execute Phoenix macros.
- Use `#` comments for the shared inline-comment triggers, especially retry policy, native boundaries and order-sensitive persistence. Keep executable `doctest` examples deterministic; use ExDoc for maintained libraries or a shared internal API, not automatically for every application.

### Documentation and comment examples

- `@moduledoc` states module responsibility, boundaries and state ownership. Public `@doc` explains argument meaning, results, errors/raises and side effects without repeating types. Put types in `@spec` and document exported types with `@typedoc`.
- `defp` helpers use a short `#` explanation only when the algorithm or constraint needs it; `@doc` does not document private functions. Use `@doc false` / `@moduledoc false` only for deliberately hidden public/internal implementation surfaces, with a reason; hiding docs does not make a `def` private. Behaviour callbacks use `@impl true` and inherit the callback contract; explain extra guarantees where needed.
- For multiple clauses/defaults, write a single documented function head and then the clauses. Keep doc examples deterministic, independent of network/time/global state, and register `doctest MyApp.Module` in ExUnit; examples are not run merely because they appear in `@doc`.

Illustrative documentation pattern, not a billing implementation:

```elixir
defmodule MyApp.DocumentStatus do
  @moduledoc "Validates the document status vocabulary without persistence."
  @typedoc "States accepted by this illustrative document contract."
  @type status :: :draft | :signed

  @doc """
  Accepts a known atom; other values return `{:error, :invalid_status}`.
  Performs no I/O and does not convert external strings to atoms.

  ## Examples

      iex> MyApp.DocumentStatus.validate(:draft)
      {:ok, :draft}

      iex> MyApp.DocumentStatus.validate("unexpected")
      {:error, :invalid_status}
  """
  @spec validate(term()) :: {:ok, status()} | {:error, :invalid_status}
  def validate(value) when value in [:draft, :signed], do: {:ok, value}
  def validate(_value), do: {:error, :invalid_status}
end
```

Activate those examples in the consuming project:

```elixir
defmodule MyApp.DocumentStatusTest do
  use ExUnit.Case, async: true
  doctest MyApp.DocumentStatus
end
```

- All shared comment triggers apply: explain why, not a restatement of a call. Explain compiler/linter suppressions, dynamic module dispatch, unsafe/native boundaries, intentional compile-time reads, retry/idempotency policy, lifecycle ownership and ignored error/exit handling.
- Use `TODO(owner-or-issue): reason and removal condition` for actionable deferred work; do not leave unexplained TODOs, commented-out code or secrets. A comment never substitutes for fixing an authorization/error-handling defect.

```elixir
# The provider accepts retries only when the same operation key is reused.
adapter.submit(document, idempotency_key: operation.key)
# TODO(issue-link): remove the legacy decoder after stored v1 jobs are drained.
```

## Configuration and secrets

- Read [runtime configuration guidance](runtime-configs.md) for required files. Use `config/config.exs` and environment config for build-time choices; `config/runtime.exs` for deployment secrets, database URLs and runtime limits.
- Module attributes and `Application.compile_env/3` capture build-time values. Use them only for intentional compile-time dependencies. Read dynamic runtime settings in functions/startup and inject collaborators; do not bake secrets into BEAM files or release images.
- Validate required env values at boot (`System.fetch_env!/1`, explicit parsers/ranges), including pool/concurrency sizes, hosts and timeouts. Fail before accepting traffic. Do not expose secrets via logs, errors or generated docs.
- Configure release startup/migrations explicitly; Mix need not exist inside a release. Persist business state outside process memory and local ephemeral disks.

## Data, locale and boundaries

- Keep timestamps in UTC and preserve the IANA zone for local appointment intent. Use a configured time-zone database when converting beyond UTC; explicitly resolve DST gaps/ambiguities. Inject a clock, use monotonic time for elapsed durations.
- Money uses `Decimal` or integer minor units with an explicit currency/exponent and rounding policy. Never assume all currencies have two decimals, or use binary floats for totals. JSON contracts must specify decimal strings or integer units and date formats.
- Use Gettext for message translation/plurals; Localize for locale-aware numbers, dates and currencies. Persist locale explicitly and propagate it into tasks/jobs; process-local locale is not automatically a job contract. Test fallback, pluralization, FR/EN/IT and EUR/USD where supported by the product.
- As verified on 2026-10-28, ex_cldr's docs announce support through 2027-12-31 and recommend Localize. Prefer evaluating Localize for new work; existing ex_cldr integrations need a tested migration, not a blind substitution.
- Wrap HTTP/JSON behind a domain adapter. Req is a candidate for new HTTP integrations; reuse a suitable existing client first. Set connection/receive and overall operation deadlines, body limits, TLS verification, allowed destinations, explicit retry policy and domain error mapping. Do not blindly retry non-idempotent requests; automatic client retries and job retries multiply.
- Decode to a validated boundary contract rather than leaking arbitrary maps or DB structs. Choose the existing framework JSON encoder (or the pinned runtime's JSON API); do not add another solely by habit.

## Observability and minimum checks

Use Logger metadata for correlation/operation IDs and structured output configured by a formatter; metadata alone does not create JSON logs. Redact payloads and secrets. Use Telemetry spans/metrics for duration, errors, queue lag and saturation, with bounded labels rather than user IDs. Read [test commands and CI](elixir-testing.md) before claiming validation.

## Sources

Official references checked 2026-10-28; unversioned links track upstream, so consult the chosen dependency version before copying APIs.

- Consult [module attributes](https://hexdocs.pm/elixir/module-attributes.html) and [writing documentation](https://hexdocs.pm/elixir/writing-documentation.html) for compilation and executable examples.
- Consult [Elixir compatibility](https://hexdocs.pm/elixir/compatibility-and-deprecations.html), [library guidelines](https://hexdocs.pm/elixir/library-guidelines.html) and [Config](https://hexdocs.pm/elixir/Config.html) for toolchain and module contracts.
- Consult [Gettext](https://hexdocs.pm/gettext/Gettext.html), [Localize](https://hexdocs.pm/localize/readme.html) and [ex_cldr support](https://hexdocs.pm/ex_cldr/readme.html) for localization choices.
- Consult [Req](https://hexdocs.pm/req/readme.html) and [Logger](https://hexdocs.pm/logger/Logger.html) for adapter and logging APIs.
