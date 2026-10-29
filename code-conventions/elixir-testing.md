---
extends: [elixir]
---
# Elixir Tests, Checks and CI

## When to use

Read before implementing or verifying any Elixir application. Apply [shared test conventions](testing.md), refined here for ExUnit and the project's actual dependencies. These commands are a consuming-project contract; the knowledge-base repository itself runs Bun/schema checks and does not prove an application's ExUnit suite passed.

## Test organization and boundaries

- Use ExUnit, `test/**/*_test.exs` mirroring `lib/`, shared case templates in `test/support/`, and `ExUnit.start()` in `test/test_helper.exs`. This overrides the shared generic colocation pattern for Elixir. Name tests by observable behavior.
- Test pure domain rules directly. Use context/DataCase tests for authorization and persistence, ConnTest for request/response boundaries, LiveViewTest for server interactions and browser tests for JavaScript/React/hooks and actual network reconnection. Do not reproduce every unit scenario through HTTP.
- Use `start_supervised!` for owned test processes and cleanup temporary files/providers on exit. Use `async: true` only when database ownership, global app env, names, ETS and external resources are isolated; otherwise serialize the affected tests.
- Build per-test records with factories/helpers and unique relevant values. Exercise a differing case; never force production behavior to match a fixture or hardcode generated IDs. Do not mock the function under test or test code that only restates its implementation.
- Use `assert_receive` with a bounded timeout, monitors or explicit completion; never `Process.sleep` to make an assertion pass. For clocks/schedules inject time, and use monotonic deadlines for waits.

Illustrative supervised process test; the application defines `Worker` and its message contract:

```elixir
worker = start_supervised!({Worker, notify: self()})
Worker.run(worker, input)
assert_receive {:completed, ^input}, timeout_ms
```

## SQL Sandbox and true concurrency

- Configure `Ecto.Adapters.SQL.Sandbox` for the test Repo and manual ownership in `test_helper.exs`. Use the project's generated DataCase/ConnCase ownership pattern (`start_owner!` / `stop_owner` on exit or explicit checkout/checkin).
- Tests and spawned tasks/LiveViews must have explicit access to the owner connection where needed (`Sandbox.allow/3` or the documented caller ownership mechanism). Shared mode allows child access but requires non-async use; do not globally share one connection across concurrent tests.
- Normal sandbox tests roll back their transactions, so separate test owners do not see each other's uncommitted fixtures. Create fixtures through the correct owner and wait for child completion before owner teardown.
- Two contenders sharing one sandbox connection cannot prove independent database transaction/lock behavior. Use a separate, disposable committed-data integration suite with independent connections, explicit cleanup and synchronization barriers for real booking/uniqueness races. Never repoint it at production or disable sandbox safety in the default suite.
- Cover rollback of data+job, constraint errors, tenant scoping, stale writes and contention. Assert the invariant (one authorized winner, no duplicate side effect), not a chosen scheduler ordering.

## Jobs, HTTP and failures

- With Oban installed, use manual testing mode and `assert_enqueued` / `refute_enqueued` for scheduling/rollback; `perform_job` for worker results and controlled draining for integration. Assert args/queue/schedule and business outcome rather than internal call order.
- Add a separate isolated real-worker test when proving retry timing, node/worker crash recovery, database disconnect, duplicate delivery, provider-accepted-but-response-lost or deployment/restart behavior. Manual/inline tests do not prove those runtime properties.
- Inject a behaviour adapter for external providers. Use a simple fake for deterministic domain tests; choose Mox for expectations on that behaviour, with `verify_on_exit!` and explicit task allowances. Avoid changing application-global mocks inside async tests.
- Use Req.Test when already using Req and transport behavior is not the subject. Use Bypass/local HTTP server when actual serialization, headers, status mapping, timeout or connection behavior needs proof. Do not add Mox, Bypass and another client merely because they are listed here.
- HTTP contracts cover malformed/oversized JSON, provider errors, rate limits, timeouts, idempotency keys and version changes. Avoid live paid/provider calls in default CI.
- Use `ExUnit.CaptureLog.capture_log` for boundary logging/redaction checks, and assertions on stable events/fields rather than incidental wording. Do not log sensitive data to make tests easier.

## API and SDK contract checks

Read [REST/OpenApiSpex and Orval coherence gates](openapi.md) when a Phoenix API has generated consumers: validate real ConnTest responses and rejected requests, deterministic export, SDK regeneration, strict consumer compilation, adapters and released-client compatibility. Code generation alone does not prove any runtime behavior.

## Commands and prerequisites

Run from the consuming Mix project root with its pinned Elixir/OTP pair, Hex/Rebar installed as needed, committed lockfile, test configuration and isolated database available. Inspect `mix.exs` aliases first: Phoenix commonly aliases `test` to create/migrate the test DB already. Never use production credentials.

| Check | Exact command | Scope / prerequisite |
|---|---|---|
| Resolve locked dependencies | `mix deps.get` | Network/Hex access; review unexpected lock changes |
| Formatter | `mix format --check-formatted` | `.formatter.exs` includes application/config/test sources and plugins |
| Compile | `MIX_ENV=test mix compile --warnings-as-errors` | Compile the test environment and configured support modules |
| Prepare DB | `MIX_ENV=test mix ecto.create` then `MIX_ENV=test mix ecto.migrate` | Ecto SQL only; skip duplication if test alias already does this |
| Full default suite | `mix test` | Includes doctests explicitly registered in test modules; record seed/exclusions |
| Target one file | `mix test test/my_app/billing_test.exs` | Replace illustrative path with actual test |
| Target one test | `mix test test/my_app/billing_test.exs:42` | Use actual discovered line number |
| Reproduce ordering | `mix test --seed 12345` | Replace illustrative seed with failing run's reported seed |
| Exclude a tagged group | `mix test --exclude external` | `@tag :external`; report omission and run required integration groups separately |
| Include excluded group | `mix test --include external` | Overrides configured exclusion; also runs other default tests |
| Only tagged group | `mix test --only external` | Explicit tag; not a substitute for full required suite |
| Coverage | `mix test --cover` | Reporting only; configured thresholds may affect exit; no arbitrary quota |
| Credo | `mix credo --strict` | Optional dependency adopted/configured by project; required once adopted |
| Dialyzer | `mix dialyzer` | Optional Dialyxir, compatible PLT; required once adopted |
| Documentation build | `mix docs --warnings-as-errors` | Optional ExDoc dependency and supported task options |
| Rust formatting | `cargo fmt --all -- --check` | Run in native crate/workspace with pinned Rust |
| Rust lint | `cargo clippy --all-targets --locked -- -D warnings` | Chosen production features/target; add justified feature variants |
| Rust tests | `cargo test --locked` | Crate tests/doctests; also run Mix tests that load the NIF |

Minimum required: locked dependency resolution, formatter, warnings-as-errors compile and all required test groups with test DB preparation where applicable. Add `MIX_ENV=prod mix compile --warnings-as-errors` / `mix release` when release/runtime configuration changes, with build-safe configuration; test actual release boot separately without production data. Dependency, security, Credo, Dialyxir, coverage and ExDoc checks are selected by project needs, not a requirement to install every tool.

## GitHub Actions example

Adapt in the application repo; this is not an active workflow in ai-ressources. Prerequisites: committed `.tool-versions` with exact `erlang` and `elixir` versions supported by setup-beam, a test Repo reading `DATABASE_URL` in test config, and repository variable `TEST_POSTGRES_IMAGE` containing the chosen PostgreSQL image pinned by digest. The disposable credentials below belong only to the job service. Review/pin action revisions under project supply-chain policy.

```yaml
name: Elixir checks
on: [push, pull_request]
permissions:
  contents: read
jobs:
  test:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    env:
      MIX_ENV: test
      DATABASE_URL: postgres://postgres:test-only@localhost:5432/app_test
    services:
      postgres:
        image: ${{ vars.TEST_POSTGRES_IMAGE }}
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: test-only
          POSTGRES_DB: app_test
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U postgres -d app_test"
          --health-interval 5s --health-timeout 5s --health-retries 10
    steps:
      - uses: actions/checkout@v7
      - uses: erlef/setup-beam@v1
        with:
          version-file: .tool-versions
          version-type: strict
      - run: mix local.hex --force
      - run: mix local.rebar --force
      - run: mix deps.get
      - run: git diff --exit-code -- mix.lock
      - run: mix format --check-formatted
      - run: mix compile --warnings-as-errors
      - run: mix ecto.create
      - run: mix ecto.migrate
      - run: mix test
```

Remove Ecto/service steps for applications without a database; do not replace PostgreSQL with SQLite when testing PostgreSQL semantics. Include the separate committed-data/recovery suite when the change requires it. Cache only with OS/architecture, exact OTP/Elixir and lockfile-aware keys; never cache credentials/database contents. Add frontend checks separately for a React client and native build/load checks for Rustler. CI success requires actual execution; copied YAML is not evidence.

## Sources

Official references checked 2026-10-28:

- Consult [Mix test](https://hexdocs.pm/mix/Mix.Tasks.Test.html) and [ExUnit](https://hexdocs.pm/ex_unit/ExUnit.html) for selection, tags and lifecycle.
- Consult [SQL Sandbox](https://hexdocs.pm/ecto_sql/Ecto.Adapters.SQL.Sandbox.html), [Oban.Testing](https://hexdocs.pm/oban/Oban.Testing.html) and [Mox](https://hexdocs.pm/mox/Mox.html) for ownership and execution modes.
- Consult [setup-beam](https://github.com/erlef/setup-beam) before selecting toolchain inputs or action revisions.
