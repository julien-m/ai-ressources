---
extends: [javascript]
---
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

## Cache
> For generic patterns (cache-aside, versioned keys, CDN `Cache-Control` headers), see [`architecture/caching-strategies.md`](../architecture/caching-strategies.md). This section covers Cloudflare-specific implementation via `caches.default` and service bindings.
### Cache hierarchy
```
Request → caches.default (L-1: free, edge-local, ~1ms) → KV with cacheTtl (L-2: ~1ms) → D1/R2 (source of truth, billable)
```
Never hit D1 or R2 without checking upper layers first.
### Cache API (`caches.default`)
Use synthetic `Request` objects as cache keys (URL-based).

**R2 objects:**
```ts
async function getR2Cached(ctx: ExecutionContext, bucket: R2Bucket, cache: Cache, key: string): Promise<Response> {
  const cacheKey = new Request(`https://r2-cache/${key}`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const object = await bucket.get(key);
  if (!object) return new Response(null, { status: 404 });

  const response = new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    },
  });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
```

**D1 query results:**
```ts
async function getQueryCached<T>(
  ctx: ExecutionContext,
  cache: Cache,
  db: D1Database,
  query: string,
  params: unknown[],
  ttl = 60,
): Promise<T[]> {
  const cacheKey = new Request(`https://d1-cache/${btoa(query + JSON.stringify(params))}`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached.json<T[]>();

  const result = await db.prepare(query).bind(...params).all<T>();
  const response = new Response(JSON.stringify(result.results), {
    headers: { 'Cache-Control': `public, max-age=${ttl}`, 'Content-Type': 'application/json' },
  });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return result.results;
}
```
### KV with `cacheTtl`
```ts
// Without cacheTtl: ~50 ms round-trip to central KV store
const value = await env.MY_KV.get('key');

// With cacheTtl: ~1 ms from edge-local cache for 300s
const value = await env.MY_KV.get('key', { cacheTtl: 300 });
```

Always use `cacheTtl` for read-heavy keys (feature flags, config, translations). Not suitable for data that changes more often than the TTL. See **Invalidation strategies** below for keys that need active invalidation.
### R2 response headers
```ts
// Immutable assets (hash in filename): 1-year TTL
'Cache-Control': 'public, max-age=31536000, immutable'

// Versioned assets (content changes): 24h TTL + stale window
'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600'

// Private/user-specific: never cache
'Cache-Control': 'private, no-store'
```
### Stale-while-revalidate (manual)
```ts
const cached = await cache.match(cacheKey);
if (cached) {
  ctx.waitUntil(revalidate(cache, cacheKey, db, query, params)); // refresh silently
  return cached;
}
// cache miss — fetch fresh, cache, return
```
### What NOT to cache
- User-specific or sensitive data (unless `private` + client-side only)
- Mutation responses (`POST`/`PUT`/`DELETE`) — always `Cache-Control: no-store`
- Tokens, sessions, credentials
### Invalidation strategies
#### Strategy 1 — Short TTL + stale tolerance (default)
Don't invalidate actively — choose a TTL short enough that stale is acceptable: lists/counters 10–30s, reference data 5–15 min. Use when consistency is not critical.
#### Strategy 2 — Version tag via KV (global, multi-node)
Safest for Workers (avoids multi-node `cache.delete()` limitations). Old entries expire at TTL; KV lookup ~1 ms with `cacheTtl: 5`.

```ts
// Read: include version in cache key
const version = await env.MY_KV.get('cache:version:articles', { cacheTtl: 5 });
const cacheKey = new Request(`https://d1-cache/articles/${version ?? '0'}`);
// Invalidate: bump version → all old cache keys become orphaned
await env.MY_KV.put('cache:version:articles', String(Date.now()));
```
#### Strategy 3 — `cache.delete()` (targeted, single-node)
Best for well-identified resources. Limitation: only invalidates on the current edge node — other nodes serve stale until TTL expires.

```ts
await cache.delete(new Request(`https://r2-cache/${objectKey}`));
```
#### Strategy 4 — Durable Objects (advanced)
Use when a single object has very high read traffic and strong consistency is required. Use rarely — DOs have single-geography placement and operational cost.

```
Worker → Durable Object (in-memory state, refreshes from D1 periodically)
```
#### Drizzle + D1: multi-table invalidation
When a `db.batch()` touches multiple tables, invalidate **all** affected table version tags — not just the primary table:

```ts
// Mutation touches both `articles` and `tags`
await db.batch([
  db.insert(articles).values(articleData),
  db.insert(articleTags).values(tagData),
]);

// Invalidate both — missing one causes stale joins
await env.MY_KV.put('cache:version:articles', String(Date.now()));
await env.MY_KV.put('cache:version:tags', String(Date.now()));
```
### Decision tree
```
Can this data be slightly stale?
  ├─ Yes → TTL short (Strategy 1)
  └─ No → Is it a single identifiable resource + low traffic?
              ├─ Yes → cache.delete() (Strategy 3)
              └─ No  → Version tag via KV (Strategy 2)
                        (Durable Objects only if very high contention on a single object)
```

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
- Use `cacheTtl` for frequently accessed keys — see **Cache** section above for full pattern and decision tree

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

## Scheduled Jobs and Durable Execution

- Use Cron Triggers for global UTC recurrence, Queue delays for simple deferral up to 24 hours, DO alarms + Queues for editable per-entity schedules, and Workflows for durable multi-step execution.
- DO alarms and Queue delivery are at-least-once; Queue ordering is not guaranteed. Persist pending dispatch before sending, use stable occurrence IDs, and make consumers idempotent.
- **Read** [the Cloudflare scheduling pattern](../architecture/cloudflare-job-scheduling.md) for timing, cancellation, retries, crash windows, alternatives and validation evidence.

## Security
- Use `crypto.randomUUID()` for secure randomness
- Hash before comparing secrets with `crypto.subtle.timingSafeEqual()`
- Never use `any` on `Env` or handler parameters
- Validate all input at handler boundaries
