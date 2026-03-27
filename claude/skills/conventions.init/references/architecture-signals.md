# Architecture Signal Detection

Maps code-level signals (keywords, patterns, imports) to `architecture/` files in ai-ressources.

## How to use

Grep the target project codebase for these signals. If multiple hits are found for a domain, include that architecture file.

> Do NOT grep `node_modules/`, `dist/`, `build/`, `.git/`, `vendor/`, `target/` directories.

## Signal table

| Signals to grep | Architecture file |
|---|---|
| `oauth`, `OAuth`, `jwt`, `JWT`, `jsonwebtoken`, `session`, `login`, `signIn`, `signUp`, `passport`, `auth0`, `oidc`, `OIDC`, `refresh_token`, `access_token` | `auth-flows` |
| `tenant`, `tenantId`, `tenant_id`, `orgId`, `org_id`, `workspace`, `multi-tenant`, `multiTenant`, `organization` (in schema/model context) | `multi-tenant` |
| `rateLimit`, `rate_limit`, `rateLimiter`, `throttle`, `sliding_window`, `slidingWindow`, `token_bucket`, `tokenBucket`, `too many requests`, `429` | `rate-limiting` |
| `webhook`, `Webhook`, `callback_url`, `callbackUrl`, `event_delivery`, `hmac`, `signature_verification`, `idempotency_key`, `idempotencyKey` | `webhook-patterns` |
| `EventEmitter`, `event_emitter`, `publish`, `subscribe`, `pubsub`, `PubSub`, `emit`, `on(`, `addEventListener`, `message_queue`, `messageQueue`, `CQRS`, `event_sourcing` | `event-driven` |
| `cache`, `Cache`, `redis.get`, `redis.set`, `memoize`, `invalidate`, `cache_key`, `cacheKey`, `TTL`, `ttl`, `LRU`, `lru` | `caching-strategies` |
| `migration`, `Migration`, `migrate`, `ALTER TABLE`, `CREATE TABLE`, `addColumn`, `add_column`, `schema_version`, `schemaVersion`, `up()`, `down()` | `database-migrations` |
| `queue`, `Queue`, `worker`, `Worker`, `job`, `Job`, `cron`, `Cron`, `background`, `async_task`, `asyncTask`, `scheduler`, `Scheduler`, `enqueue`, `dequeue` | `background-jobs` |
