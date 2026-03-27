# Package → Stack-Ref Mapping

Maps dependency names to their corresponding `stack-ref/` files in ai-ressources.

> **Dynamic scan**: The skill MUST also scan `~/projects/ai-ressources/stack-ref/` at runtime to catch files not listed here. This table accelerates matching but is not exhaustive.

## npm / bun packages

| Package pattern | Stack-ref path |
|---|---|
| `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js` | `payments/stripe` |
| `better-auth` | `auth/better-auth` |
| `@clerk/*` | `auth/clerk` |
| `next-auth`, `@auth/*` | `auth/authjs` |
| `@workos-inc/*`, `@workos/*` | `auth/workos` |
| `@supabase/*` | `platforms/supabase` + `auth/supabase-auth` + `databases/supabase-db` |
| `resend` | `email/resend` |
| `@sendgrid/*` | `email/sendgrid` |
| `postmark`, `postmark.js` | `email/postmark` |
| `@aws-sdk/client-ses` | `email/amazon-ses` |
| `mailgun.js`, `mailgun-js` | `email/mailgun` |
| `@libsql/client`, `@tursodatabase/*` | `databases/turso` |
| `@neondatabase/serverless`, `@neon/*` | `databases/neon` |
| `pg`, `postgres`, `@types/pg` | `databases/postgres` |
| `mysql2` | `databases/mysql` |
| `better-sqlite3`, `sql.js` | `databases/sqlite` |
| `redis`, `ioredis` | `databases/redis-self-hosted` |
| `@upstash/redis` | `databases/upstash-redis` |
| `convex` | `databases/convex` |
| `drizzle-orm`, `prisma`, `@prisma/client`, `kysely`, `knex` | Detect DB from config/connection string |
| `inngest` | `jobs/inngest` |
| `@trigger.dev/*` | `jobs/triggerdotdev` |
| `bullmq` | `jobs/bullmq` |
| `wrangler`, `@cloudflare/*` | `platforms/cloudflare` |
| `firebase`, `firebase-admin`, `@firebase/*` | `platforms/firebase` |
| `@vercel/*`, `vercel` | `platforms/vercel` |
| `meilisearch` | `search/meilisearch` |
| `@orama/*`, `orama` | `search/orama` |
| `typesense` | `search/typesense` |
| `algoliasearch`, `@algolia/*` | `search/algolia` |
| `openai` | `ai/openrouter` |
| `@anthropic-ai/*` | `ai/openrouter` |
| `ai`, `@ai-sdk/*` | `ai/vercel-ai-sdk` |
| `@aws-sdk/*` | `platforms/aws` |
| `@google-cloud/*` | `platforms/gcp` |
| `@lemon-squeezy/*`, `lemonsqueezy.ts` | `payments/lemon-squeezy` |
| `@mollie/api-client` | `payments/mollie` |
| `@paddle/paddle-node-sdk` | `payments/paddle` |
| `@notionhq/client` | `cms/notion-cms` |
| `@backblaze-b2/*`, `backblaze-b2` | `storage/backblaze-b2` |
| `@google-cloud/storage` | `storage/google-cloud-storage` |

## Go modules

| Module pattern | Stack-ref path |
|---|---|
| `github.com/stripe/stripe-go` | `payments/stripe` |
| `github.com/lib/pq`, `github.com/jackc/pgx` | `databases/postgres` |
| `github.com/go-sql-driver/mysql` | `databases/mysql` |
| `github.com/redis/go-redis` | `databases/redis-self-hosted` |
| `github.com/meilisearch/meilisearch-go` | `search/meilisearch` |
| `github.com/sashabaranov/go-openai` | `ai/openrouter` |
| `cloud.google.com/go/*` | `platforms/gcp` |
| `github.com/aws/aws-sdk-go*` | `platforms/aws` |

## Python packages

| Package pattern | Stack-ref path |
|---|---|
| `stripe` | `payments/stripe` |
| `psycopg2`, `asyncpg`, `sqlalchemy` | `databases/postgres` |
| `redis` | `databases/redis-self-hosted` |
| `openai` | `ai/openrouter` |
| `anthropic` | `ai/openrouter` |
| `boto3`, `botocore` | `platforms/aws` |
| `google-cloud-*` | `platforms/gcp` |
| `firebase-admin` | `platforms/firebase` |
| `meilisearch` | `search/meilisearch` |

## Rust crates

| Crate pattern | Stack-ref path |
|---|---|
| `stripe-rust` | `payments/stripe` |
| `tokio-postgres`, `sqlx` (postgres feature) | `databases/postgres` |
| `redis` | `databases/redis-self-hosted` |
| `aws-sdk-*` | `platforms/aws` |

## Platform config files (non-package signals)

| Signal | Stack-ref path |
|---|---|
| `wrangler.toml`, `wrangler.json` | `platforms/cloudflare` |
| `vercel.json`, `.vercel/` | `platforms/vercel` |
| `fly.toml` | `platforms/flyio` |
| `firebase.json`, `.firebaserc` | `platforms/firebase` |
| `infomaniak` in config | `platforms/infomaniak` |
