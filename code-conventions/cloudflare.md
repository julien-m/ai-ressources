# Cloudflare Workers Rules (Delta)

> These rules complement [`javascript.md`](javascript.md). Covers Workers, D1, R2, KV, and Hono framework.

## Configuration

- Set `compatibility_date` to current date on new projects
- Enable `nodejs_compat` in compatibility flags
- Use JSONC format: `wrangler.jsonc`
- Run `wrangler types` to auto-generate `Env` interface — never hand-write
- Store secrets with `wrangler secret put` — never hardcode
- Enable observability: `"observability": { "enabled": true, "head_sampling_rate": 1 }`

## Critical Anti-Patterns

### Module-level mutable state (request leakage)
```ts
// BAD — state leaks between requests
let requestId = '';
export default {
  fetch: (request, env) => { requestId = generateId(); }
}

// GOOD — scoped to request
export default {
  fetch: (request, env) => { const requestId = generateId(); }
}
```

### Other forbidden patterns
- **Floating promises** — every Promise must be `await`ed, `return`ed, `void`ed, or `ctx.waitUntil()`ed
- **`Math.random()` for tokens** — use `crypto.randomUUID()` or `crypto.getRandomValues()`
- **Destructuring `ctx`** — breaks `this` binding, causes "Illegal invocation"
- **`passThroughOnException()`** — hides bugs, use explicit try/catch
- **`await response.text()` on unbounded data** — 128 MB memory limit, stream instead
- **REST API calls to Cloudflare services** — use in-process bindings (KV, R2, D1, Queues)
- **Direct secret comparison** — use `crypto.subtle.timingSafeEqual()` for timing safety

## Streaming

- Always stream large/unknown payloads via `TransformStream`
- Never buffer with `await response.text()` or `await request.arrayBuffer()` for unbounded data
- Use `pipeTo()` with `preventClose: true` for chaining streams

## Async Patterns

- `ctx.waitUntil()` for post-response work (analytics, cache writes) — 30s limit
- Use Queues for single-step async with at-least-once delivery
- Use Workflows for multi-step processes with step persistence
- Service bindings for Worker-to-Worker calls (zero-cost, type-safe RPC)
- Hyperdrive for external PostgreSQL/MySQL connections

## D1 (SQLite)

- Max 10 GB per database (paid), 500 MB (free)
- Optimized for per-user/per-tenant patterns
- Use `db.batch()` for multi-statement operations — never raw `BEGIN TRANSACTION`
- Use `integer('field', { mode: 'timestamp' })` — D1 lacks native date types
- Point-in-time recovery via Time Travel (30 days)

## R2 (Object Storage)

- Use bindings, not S3 API, from Workers
- Multipart upload for files > 5 MB
- Set appropriate `Content-Type` and cache headers

## KV (Key-Value)

- Eventually consistent — not for coordination
- Best for read-heavy, write-light patterns (config, feature flags)
- Max value size: 25 MB
- Use `cacheTtl` for frequently accessed keys

## Hono on Workers

- Type bindings: `new Hono<{ Bindings: Env }>()`
- Access env via `c.env.*` — never `process.env`
- Inline handlers for type inference — avoid controller pattern unless using `hono/factory`
- Modular routes via `app.route('/api', apiApp)`
- Test with `@cloudflare/vitest-pool-workers`

```ts
// Hono typed bindings
type Bindings = { DB: D1Database; BUCKET: R2Bucket; MY_KV: KVNamespace }
const app = new Hono<{ Bindings: Bindings }>()

app.get('/items', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM items').all();
  return c.json(result);
});
```

## Security

- Use `crypto.randomUUID()` for secure randomness
- Hash before comparing secrets with `crypto.subtle.timingSafeEqual()`
- Never use `any` on `Env` or handler parameters
- Validate all input at handler boundaries
