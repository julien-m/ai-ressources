---
extends: [elixir-otp, ecto]
---
# Phoenix Web and API Rules

## When to use

Apply to Phoenix serving a React frontend, mobile API or server-rendered application. Read [LiveView rules](phoenix-liveview.md) only when that UI model is used. Phoenix does not require LiveView or a React rewrite.

## Boundaries and structure

- Keep business capabilities in `MyApp` contexts and HTTP/socket presentation in `MyAppWeb`. A context is a public domain API, not one service class per database table. Controllers, LiveViews and Channels call contexts; they do not duplicate policy or persistence rules.
- Use schemas/query modules for persistence within contexts. For Phoenix this refines the shared repository-layer rule: contexts may orchestrate Ecto operations directly without inventing a generic repository wrapper; keep reusable query construction separate where needed.
- Router pipelines and Plugs handle request parsing, authentication, rate limits and request metadata. Put authorization in contexts too so jobs, Channels and LiveView cannot bypass it. Use `action_fallback` or a consistent boundary mapper for tagged errors; never leak exceptions/stack traces.
- Keep transport DTOs explicit: field allowlists, pagination, error codes and serialized timestamps/money. Read [REST/OpenApiSpex and Orval](openapi.md) to generate API scaffolding, export a versioned HTTP contract and test independent React/mobile consumers. Do not serialize entire Ecto schemas/associations.
- Start with one modular application and PostgreSQL for small SaaS workloads; split services only for demonstrated isolation, deployment or scaling needs. User counts alone do not establish connection count or CPU/memory demand.

Illustrative context call; the trusted scope comes from authenticated server state:

```elixir
case Bookings.reserve(scope, params) do
  {:ok, booking} -> render(conn, :show, booking: booking)
  {:error, reason} -> {:error, reason}
end
```

## Authentication, authorization and tenants

- Use the current project's generated Phoenix authentication/scopes or a deliberately chosen identity provider. Inspect generated code for the pinned Phoenix version; generator output is application code requiring review, not a permanent security guarantee.
- Select session/cookie versus bearer authentication per client. Set Secure/HttpOnly/SameSite cookie policy, rotate sessions on login and define token expiration/revocation. Cookie-authenticated mutating requests need CSRF protection, including a separate React origin; CORS is not CSRF protection or authentication.
- Restrict CORS and socket origins to intended clients. Rate-limit login, token operations and expensive endpoints. Verify raw-body webhook signatures before decoding/side effects, bound payloads and make provider event handling idempotent.
- Build scope from the verified actor and membership; a submitted tenant ID is a requested resource, not authority. Scope all reads, writes, PubSub topics, exports, file URLs and jobs, including tenant switches. Recheck membership/permissions for long-lived sessions and revoked access.
- Test unauthenticated, expired, revoked, wrong-role and cross-tenant access at every entry point. Normalize resource-not-found/forbidden responses deliberately to avoid leaking existence.

## Channels, PubSub and public caching

- Channels provide client communication; PubSub distributes live messages. Neither is a durable job queue, database log or guarantee of replay to disconnected users. Persist authoritative state, publish after commit and let clients reload/reconcile after reconnect.
- Authorize both Channel joins and each command. Validate event schemas, topic ownership, message size and rate. Do not broadcast private tenant data to a generic topic.
- A database commit and PubSub broadcast are not atomic: use a transactional outbox/job if a missed notification must eventually be repaired. Do not hold database transactions open while broadcasting or calling providers.
- A Cloudflare CDN/proxy can cache appropriate public HTTP responses without a Worker. Add Workers only for an actual edge-compute requirement. Cache keys, locale, invalidation and public `Cache-Control` must be explicit; private/authenticated responses bypass public caching.
- Availability shown through cached public pages is advisory. The database transaction remains the authority for booking and payment; a stale CDN response must not permit double reservation.
- Read [Oban deployment rules](oban.md) for active workers and Flycast. Cloudflare cache hits do not execute Phoenix code or wake an arbitrary suspended queue consumer.

## Operational checks

- Configure release hosts, HTTPS/proxy handling, `SECRET_KEY_BASE`, database access, health/readiness and graceful shutdown for the actual platform. Trust forwarded headers only through the expected proxy boundary.
- Budget HTTP handlers, WebSockets, DB connections and jobs together. Use pool checkout and queue lag metrics before raising pool sizes; each additional node adds connections and resident memory.
- Test API behavior with ConnTest and real scoped persistence where relevant. Browser checks remain necessary for React integration, cookies/CORS, JavaScript, reconnect and responsive/mobile behavior; backend tests do not prove a native mobile UI.

## Sources

Official references checked 2026-10-28:

- Consult [Phoenix contexts](https://hexdocs.pm/phoenix/contexts.html), [security](https://hexdocs.pm/phoenix/security.html) and [Channels](https://hexdocs.pm/phoenix/channels.html) when implementing boundaries.
- Consult [Phoenix deployment](https://hexdocs.pm/phoenix/deployment.html) for releases and production configuration.
