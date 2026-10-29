---
extends: [general, architecture, testing]
---
# REST Contracts, OpenApiSpex and Orval

## When to use

Use for a REST API consumed by an independently deployed TypeScript/React client or mobile application. OpenAPI describes the HTTP boundary; it is not inferred reliably from Ecto schemas, Rust types or database columns. Read [Phoenix boundaries](phoenix.md), [Elixir tests](elixir-testing.md) and [TypeScript rules](javascript.md) for the respective implementations.

Examples target Phoenix 1.8, OpenApiSpex 3.22 and Orval 8 APIs checked on 2026-10-29. They are illustrative application code, not a runnable product or a claim of ExUnit/codegen execution here. Pin exact dependency/toolchain versions and lockfiles in the consuming repository; verify its selected versions before copying options. Orval 8+ requires Node.js 22.18+ according to its installation guide; Bun can manage packages and scripts while the CLI runs under its supported Node runtime.

## Contract ownership and compatibility

- Keep one HTTP contract authority: Phoenix operation/schema modules export an identified `openapi.json` artifact; Orval consumes that exact file/release artifact. Record backend revision, contract digest and generator version when publishing a separate SDK. Do not generate from an uncontrolled live production endpoint.
- Specify paths/methods, stable unique `operationId`s, parameter location/serialization, request bodies, status codes, content types, error envelopes, pagination, nullability, required fields, timestamps, currencies and decimal encoding. Model HTTP DTOs rather than exposing ORM/native structs.
- This example uses OpenAPI 3.0.3 (`nullable: true` on a typed property); 3.1 uses JSON Schema null types instead. Select a dialect supported by all exporter/validator/generator versions; do not mix them.
- Stable operation IDs preserve generated function names even when internal modules move. Treat renames, changed error/status behavior, removed fields, narrowed inputs and new required inputs as compatibility changes. New enum values and newly nullable responses can break old clients too.
- Compare against the last released contract, not only the PR's regenerated SDK. Use a pinned breaking-change checker plus review for semantic changes it cannot detect. Preserve supported older mobile clients already distributed; coordinate additive rollout, deprecation and versioning rather than assuming regeneration updates installed apps.
- Generated SDK/schema files are outputs: edit contract sources, generator configuration or handwritten adapters, then regenerate. Keep handwritten files outside output directories. Choose either committed generation with a clean-diff gate or reproducible build artifacts with digest verification; state the policy.

## Phoenix API scaffolding

Prerequisites: compatible pinned Elixir/OTP, an explicitly installed/pinned `phx_new` archive and a new disposable/project directory. The names below are illustrative; choose the product's actual contexts and fields. Generate an API-oriented skeleton:

```bash
mix phx.new my_app --no-html --no-assets --no-live --database postgres
cd my_app
mix phx.gen.json Documents Document documents title:string --binary-id
```

The resource generator adds/extends a context, schema, migration, controller, JSON renderer and context/controller tests. Inspect its emitted routing instructions and configure the API routes/pipelines, authenticated scope and authorization. Configured Phoenix scopes may shape generated context code, but generators do not establish your tenant policy or prove it. Review ownership assignment and generated tests before migrating the isolated development database. Existing context modules can be modified by generation; inspect the diff.

## OpenApiSpex specification and runtime input validation

Add `:open_api_spex` as a pinned application dependency, commit `mix.lock` and include `:open_api_spex` in formatter imports when using its controller DSL. Build a pure spec with deterministic server metadata; do not derive production hosts/secrets from a running endpoint during export.

Illustrative `MyAppWeb.ApiSpec`; route/schema/controller modules must exist in the application:

```elixir
defmodule MyAppWeb.ApiSpec do
  @moduledoc "Defines the public HTTP contract independently of deployment secrets."
  @behaviour OpenApiSpex.OpenApi
  alias OpenApiSpex.{Components, Info, OpenApi, Paths, SecurityScheme, Server}

  @impl true
  def spec do
    %OpenApi{
      openapi: "3.0.3",
      info: %Info{title: "Documents API", version: "1.0.0"},
      servers: [%Server{url: "/"}],
      paths: Paths.from_router(MyAppWeb.Router),
      components: %Components{securitySchemes: %{
        "bearerAuth" => %SecurityScheme{type: "http", scheme: "bearer"}
      }},
      security: [%{"bearerAuth" => []}]
    }
    |> OpenApiSpex.resolve_schema_modules()
  end
end
```

Define transport schemas separately; this minimal response is only an illustrative wire shape:

```elixir
defmodule MyAppWeb.Schemas.DocumentResponse do
  @moduledoc "Describes the public document response without persistence fields."
  require OpenApiSpex
  alias OpenApiSpex.Schema
  OpenApiSpex.schema(%{
    title: "DocumentResponse", type: :object, additionalProperties: false,
    required: [:id, :title],
    properties: %{
      id: %Schema{type: :string, format: :uuid},
      title: %Schema{type: :string},
      signed_at: %Schema{type: :string, format: :"date-time", nullable: true}
    }
  })
end
```

For illustration the controller renders that object directly; if the application's JSON renderer wraps it in `data`, define and test the matching envelope. Define `MyAppWeb.Schemas.ErrorResponse` for actual error responses before using this declaration; changing generator ID strategy also requires changing the parameter/schema format:

```elixir
use OpenApiSpex.ControllerSpecs
alias MyAppWeb.Schemas.{DocumentResponse, ErrorResponse}
plug OpenApiSpex.Plug.CastAndValidate, json_render_error_v2: true

operation :show,
  operation_id: "getDocument",
  parameters: [id: [in: :path, required: true,
    schema: %OpenApiSpex.Schema{type: :string, format: :uuid}]],
  responses: [
    ok: {"Document", "application/json", DocumentResponse},
    bad_request: {"Invalid input", "application/json", ErrorResponse},
    unauthorized: {"Authentication required", "application/json", ErrorResponse},
    not_found: {"Unavailable document", "application/json", ErrorResponse}
  ]
```

- In the API router pipeline, add `plug OpenApiSpex.Plug.PutApiSpec, module: MyAppWeb.ApiSpec` before controller `CastAndValidate`. Keep JSON parsing/body limits in the endpoint/pipeline and actual authentication/tenant authorization in the appropriate Plug/context. The security scheme documents credentials; it never authenticates a request.
- An operation annotation alone validates nothing. `CastAndValidate` must run for the action and its operation must be discoverable. Set `request_body` schemas for mutations and enforce required/allowlisted fields. Test the chosen validation-error renderer/status/body; the built-in validation envelope may differ from the application's `ErrorResponse`.
- Casting can change parameter keys/types and separates body params from route/query params. Adapt generated actions to read `OpenApiSpex.params(conn)` and `OpenApiSpex.body_params(conn)` (or the documented replaced conn fields), then call authorized contexts; do not retain unexamined string-key patterns from the generator.
- Declare/test every response produced by auth, validation, domain errors and fallback rendering, including 403/404 policy, 409, 422, 429 and relevant service failures. A public operation can override global security intentionally; do not accidentally include an empty security alternative that makes authentication optional in the contract.

## Reproducible export

With dependencies fetched and test/build configuration free of production secrets, export from the Mix root:

```bash
MIX_ENV=test mix openapi.spec.json --spec MyAppWeb.ApiSpec --filename openapi.json --start-app=false
```

The requested core command is `mix openapi.spec.json --spec MyAppWeb.ApiSpec --filename openapi.json`; `--start-app=false` avoids starting Repo/Oban for a pure export. Compilation/config evaluation must also be offline-safe; it can still fail if the application reads secrets or performs I/O at compile time. Fix the spec/build config rather than supplying production credentials. If runtime-derived specification data is unavoidable, use an isolated test app/database and document that prerequisite.

Export twice with identical inputs to two temporary paths and compare bytes; remove timestamps, unordered dynamic metadata or machine-specific hosts at their source. For a committed spec, `--check=true` compares the current export to the existing file; use the same flags/dialect in local and CI export. Validate the document itself and references, not only that JSON parses. Keep referenced files local or explicitly allowlisted to avoid untrusted file/network reads during validation/codegen.

## Orval TypeScript generation

Install reviewed exact versions of `orval`, `typescript` and a document validator such as `@redocly/cli` as dev dependencies (`bun add --dev --exact ...` with actual package/version arguments); commit `package.json` and `bun.lock`. Use a supported pinned Node runtime for codegen. Keep `openapi.json`, `orval.config.ts` and generated code in the same artifact/revision chain. Do not recommend `openapi-typescript-codegen` for new work: its author marks it unmaintained and recommends migration; Hey API is an alternative only when the project chooses it.

Illustrative `orval.config.ts` at the client root; copy the identified backend artifact here first, and adapt paths deliberately:

```typescript
import { defineConfig } from "orval";

export default defineConfig({
	documents: {
		input: { target: "./openapi.json" },
		output: {
			target: "./src/api/generated/documents.ts",
			schemas: "./src/api/generated/models",
			client: "fetch",
		},
	},
});
```

- Plain Fetch functions are suitable for framework-independent TypeScript consumers. Choose `client: "react-query"` only for a TanStack Query client, install the compatible Query/HTTP dependencies and configure its transport deliberately; it does not replace authentication or server authorization. Read [TanStack conventions](tanstack.md) for cache/invalidation ownership.
- Configure base URL, credentials/bearer tokens, abort/deadline handling and error mapping in the selected client options or a handwritten Orval mutator matching the pinned generator's signature. Preserve status/headers and distinguish 204, JSON errors, network failures and cancellations. Do not embed deployment secrets into generated code or assume Fetch rejects HTTP 4xx/5xx automatically.
- TypeScript types disappear at runtime and do not validate network JSON. If runtime client validation is required, configure Orval's supported validator generation/integration (for example Zod) and test that the adapter actually invokes it. Generating a schema without calling it provides no runtime protection.
- Flutter needs a Dart client with its own generator/adapter/tests; a TypeScript SDK does not settle the mobile stack. Test the Rust/Elixir service/NIF boundary separately; native type changes do not automatically update the HTTP schema.

Illustrative `package.json` scripts after installing those tools; `test:api` requires actual test files in that directory, and `api:lint` uses the project's reviewed Redocly rules:

```json
{
  "scripts": {
    "api:lint": "redocly lint openapi.json",
    "api:generate": "orval --config orval.config.ts",
    "typecheck": "tsc --noEmit --strict",
    "test:api": "vitest run test/api"
  }
}
```

Use `bun run api:generate` to invoke the locked binary, not an unpinned remote CLI. Install/configure Vitest only when adopting this illustrative `test:api` script; it must test real adapters/consumers, not a generator fixture. Include generated code and all consumers in strict TypeScript configuration. Keep spec validation enabled during Orval generation, as well as a separate document-validation gate.

## Coherence gates and CI

These checks prove different properties; none alone proves end-to-end security:

| Gate | Required evidence in the consuming application |
|---|---|
| Document validity | Validator passes for the exported dialect, references, required fields and unique operation IDs |
| Request enforcement | Real invalid route/query/body requests rejected before side effects by the installed validation plugs; auth/tenant checks still enforced |
| Response conformity | ConnTest exercises actual renderers/fallback/auth responses and validates each actual body against the operation's schema |
| Repeatable export | Same inputs export byte-identical artifacts; committed-spec check or artifact digest matches |
| Repeatable SDK | Regenerate with pinned tool/config and compare tracked outputs; detect new/untracked files too |
| Consumer compilation | Strict TypeScript compiles SDK plus real consumers, not only declarations |
| Adapter behavior | Auth/baseURL/status/error/cancellation tests run against a local HTTP boundary |
| End-to-end behavior | Real client + Phoenix + test database covers critical success, failure and cross-tenant rejection |
| Released compatibility | Breaking-change diff versus last supported release plus tests/review for older mobile/API consumers |

ConnTest fragment after importing `OpenApiSpex.TestAssertions`; `conn`, trusted auth fixture and `document` come from the application's test case/factory:

```elixir
conn = get(conn, ~p"/api/documents/#{document.id}")
assert json_response(conn, 200)
assert_operation_response(conn, "getDocument")
```

Repeat for actual errors and boundary cases: missing required fields, omitted versus null, timestamps/UUIDs/decimal strings, unexpected fields and unauthorized/wrong-tenant IDs. Validate decoded wire responses rather than the Ecto object used to render them; schema conformance does not prove that the right tenant's record was returned.

Extend the [isolated Elixir CI example](elixir-testing.md) with pinned Node/Bun and frozen client dependencies. In the backend job export with `MIX_ENV=test` and `--start-app=false`, then run the spec check, real ConnTest suite and database-dependent tests using only the isolated service. In the client job consume that exact artifact; run `bun install --frozen-lockfile`, `bun run api:lint`, `bun run api:generate`, `bun run typecheck` and the configured adapter/consumer tests.

For the committed-generation policy, fail after regeneration on `git diff --exit-code -- openapi.json src/api/generated` and on any output of `git ls-files --others --exclude-standard -- openapi.json src/api/generated`. A diff command alone misses untracked new files. Treat ignored generated outputs according to the explicitly selected artifact policy instead. Run a second export/codegen comparison when changing generator/config versions to prove determinism; preserve removed-output detection by cleaning only the owned generated directory in a disposable checkout.

## Sources

Official references checked 2026-10-29:

- Consult [Phoenix new](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.New.html) and [JSON generator](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Json.html) for scaffolding and scope behavior.
- Consult [OpenApiSpex setup](https://hexdocs.pm/open_api_spex/readme.html), [ControllerSpecs](https://hexdocs.pm/open_api_spex/OpenApiSpex.ControllerSpecs.html), [CastAndValidate](https://hexdocs.pm/open_api_spex/OpenApiSpex.Plug.CastAndValidate.html) and [test assertions](https://hexdocs.pm/open_api_spex/OpenApiSpex.TestAssertions.html) for executable boundary enforcement.
- Consult [JSON export task](https://hexdocs.pm/open_api_spex/Mix.Tasks.Openapi.Spec.Json.html) and [cast parameter accessors](https://hexdocs.pm/open_api_spex/OpenApiSpex.html) for export flags and controller adaptation.
- Consult [Orval installation](https://orval.dev/docs/installation/), [configuration](https://orval.dev/docs/reference/configuration/), [Fetch](https://orval.dev/docs/guides/fetch/), [React Query](https://orval.dev/docs/guides/react-query/) and [input validation/reference policy](https://orval.dev/docs/reference/configuration/input/) before selecting generator options.
- Consult [Redocly document lint](https://redocly.com/docs/cli/commands/lint) for the separate OpenAPI validity gate.
- Consult [custom HTTP clients](https://orval.dev/docs/guides/custom-client/) and [runtime client validation](https://orval.dev/docs/guides/client-with-zod/) for adapters; consult the [unmaintained generator notice](https://github.com/ferdikoomen/openapi-typescript-codegen) before considering legacy tooling.
