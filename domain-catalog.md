# Domain Catalog — Signal-to-Convention Mapping

> **This file is the single source of truth for mapping keyword signals to convention files.**
> Read by: `/conventions-init`, `/conventions-refresh`, `/audit`.
> When a consumer provides a list of keyword signals (from a stack file, dependencies, or project context), resolve each signal against the tables below to determine which convention files to include.

## How to Use

1. Receive a flat list of keyword signals (case-insensitive)
2. Match each signal against ALL tables below (a signal can match multiple categories)
3. Collect all matched file paths (union — no deduplication needed, handled downstream)
4. Unknown signals are silently ignored

## How to Maintain

When any `.md` file is created, renamed, or deleted in a domain directory (architecture/, code-conventions/, conventions/, copywriting/, design/, legal/, pricing-models/, seo/, stack-ref/, models/), update this catalog in the same pass.

---

## Code Conventions

**Base conventions (always include when any language is detected):**
- `code-conventions/general.md`
- `code-conventions/architecture.md`
- `code-conventions/logging.md`
- `code-conventions/testing.md`

| Signal | Convention file |
|---|---|
| `typescript`, `ts`, `.ts`, `.tsx`, `javascript`, `js`, `.js`, `.jsx`, `node`, `bun`, `deno` | `code-conventions/javascript.md` |
| `go`, `golang` | `code-conventions/go.md` |
| `rust`, `cargo` | `code-conventions/rust.md` |
| `elixir`, `mix`, `mix.exs`, `.ex`, `.exs`, `hex`, `gettext`, `localize` | `code-conventions/elixir.md` |
| `elixir`, `beam`, `otp`, `genserver`, `task.supervisor`, `ets`, `cachex`, `rustler`, `nif` | `code-conventions/elixir-otp.md` |
| `phoenix`, `phoenix-api`, `phoenix-channel`, `phoenix-pubsub` | `code-conventions/phoenix.md` |
| `liveview`, `phoenix-liveview`, `phoenix_live_view`, `heex` | `code-conventions/phoenix-liveview.md` |
| `ecto`, `ecto_sql`, `postgrex`, `ecto.multi`, `ecto-changeset` | `code-conventions/ecto.md` |
| `oban`, `oban-worker`, `oban-queue`, `oban-testing` | `code-conventions/oban.md` |
| `elixir`, `exunit`, `elixir-ci`, `sql-sandbox`, `conntest`, `liveviewtest`, `oban-testing`, `rustler` | `code-conventions/elixir-testing.md` |
| `swift`, `ios`, `macos`, `swiftui`, `uikit` | `code-conventions/swift-kotlin.md` |
| `kotlin`, `android`, `jetpack` | `code-conventions/swift-kotlin.md` |
| `delphi`, `pascal`, `.pas`, `.dfm`, `.dproj` | `code-conventions/delphi.md` |
| `python`, `py`, `.py`, `pip`, `uv`, `poetry`, `fastapi`, `django`, `flask`, `pydantic`, `pytest`, `ruff`, `pyright`, `mypy` | `code-conventions/python.md` |
| `sql`, `postgresql`, `mysql`, `sqlite`, `database`, `migration`, `schema` | `code-conventions/database.md` |
| `openapi`, `open_api_spex`, `openapispex`, `orval`, `rest-sdk`, `api-codegen`, `api-contract`, `sdk-generation` | `code-conventions/openapi.md` |
| `pre-commit` | `code-conventions/stack-commands.md` |
| `githooks` | `code-conventions/stack-commands.md` |
| `ci workflow` | `code-conventions/stack-commands.md` |
| `github actions` | `code-conventions/stack-commands.md` |
| `linter commands` | `code-conventions/stack-commands.md` |
| `security hardening`, `security profile`, `production security`, `public security`, `web staging` | `code-conventions/stack-commands.md` |
| `sast`, `sca`, `dast`, `semgrep`, `trivy`, `gitleaks`, `nuclei`, `zap` | `code-conventions/stack-commands.md` |

---

## Framework Deltas

| Signal | Convention file |
|---|---|
| `react`, `react-dom`, `.tsx`, `.jsx`, `jsx` | `code-conventions/react.md` |
| `next`, `next.js`, `nextjs`, `next.config` | `code-conventions/nextjs.md` |
| `shadcn`, `shadcn/ui`, `components/ui` | `code-conventions/shadcn.md` |
| `tailwind`, `tailwindcss`, `@tailwindcss`, `tailwind.config` | `code-conventions/tailwind.md` |
| `cloudflare`, `workers`, `hono`, `wrangler`, `wrangler.toml` | `code-conventions/cloudflare.md` |
| `tanstack`, `react-query`, `react-router`, `react-start`, `@tanstack` | `code-conventions/tanstack.md` |
| `drizzle`, `drizzle-orm`, `drizzle-kit`, `drizzle.config` | `code-conventions/drizzle.md` |
| `prisma`, `@prisma/client`, `prisma/schema.prisma` | `code-conventions/prisma.md` |
| `astro`, `@astrojs`, `astro.config`, `.astro` | `code-conventions/astro.md` |
| `cli`, `commander`, `parseArgs`, `ink`, `ora`, `chalk`, `bin`, `shebang`, `stdin`, `pipe` | `code-conventions/cli.md` |
| `remotion`, `@remotion`, `remotion.config` | `code-conventions/remotion.md` |

---

## Architecture Patterns

| Signal | Convention file |
|---|---|
| `oauth`, `jwt`, `session`, `auth`, `login`, `authentication`, `sign-in`, `mfa`, `2fa` | `architecture/auth-flows.md` |
| `cron`, `scheduled`, `background`, `worker`, `queue`, `job`, `task-scheduler`, `async-task` | `architecture/background-jobs.md` |
| `cloudflare-scheduler`, `cloudflare-scheduling`, `durable-objects`, `durableobjects`, `setalarm`, `cloudflare-queues`, `cloudflare-workflows` | `architecture/cloudflare-job-scheduling.md` |
| `cloudflare-containers`, `workerd`, `do-pool`, `durable-object-pooling`, `always-awake-actors`, `actor-pooling` | `architecture/cloudflare-durable-object-pooling.md` |
| `architecture-pattern-template`, `architecture-example`, `reference-architecture`, `reusable-pattern` | `architecture/_template.md` |
| `cache`, `caching`, `redis`, `memoize`, `ttl`, `lru`, `invalidation`, `cdn` | `architecture/caching-strategies.md` |
| `migration`, `migrate`, `schema-change`, `alter-table`, `versioning`, `expand-contract` | `architecture/database-migrations.md` |
| `event`, `pubsub`, `publish`, `subscribe`, `emit`, `cqrs`, `event-driven`, `event-sourcing`, `message-queue` | `architecture/event-driven.md` |
| `tenant`, `multi-tenant`, `workspace`, `org`, `organization`, `isolation`, `rls`, `row-level-security` | `architecture/multi-tenant.md` |
| `rate-limit`, `rate-limiting`, `throttle`, `429`, `token-bucket`, `sliding-window` | `architecture/rate-limiting.md` |
| `webhook`, `callback`, `idempotency`, `hmac`, `event-delivery`, `retry`, `dlq` | `architecture/webhook-patterns.md` |

---

## Stack-Ref (External Services & Platforms)

### AI
| Signal | Convention file |
|---|---|
| `openai`, `openrouter`, `gpt`, `claude`, `llm`, `ai-api` | `stack-ref/ai/openrouter.md` |
| `vercel-ai`, `ai-sdk`, `@ai-sdk` | `stack-ref/ai/vercel-ai-sdk.md` |
| `poyo`, `pyo` | `stack-ref/ai/pyo.md` |

### Auth
| Signal | Convention file |
|---|---|
| `better-auth` | `stack-ref/auth/better-auth.md` |
| `clerk`, `@clerk` | `stack-ref/auth/clerk.md` |
| `next-auth`, `authjs`, `auth.js`, `@auth` | `stack-ref/auth/authjs.md` |
| `workos`, `@workos` | `stack-ref/auth/workos.md` |
| `supabase-auth` | `stack-ref/auth/supabase-auth.md` |

### CMS
| Signal | Convention file |
|---|---|
| `notion-cms`, `notion` (as CMS) | `stack-ref/cms/notion-cms.md` |

### Databases
| Signal | Convention file |
|---|---|
| `turso`, `libsql`, `@tursodatabase` | `stack-ref/databases/turso.md` |
| `neon`, `@neondatabase` | `stack-ref/databases/neon.md` |
| `postgresql`, `postgres`, `pg`, `@types/pg` | `stack-ref/databases/postgres.md` |
| `mysql`, `mysql2` | `stack-ref/databases/mysql.md` |
| `sqlite`, `better-sqlite3`, `sql.js` | `stack-ref/databases/sqlite.md` |
| `redis` (self-hosted), `ioredis` | `stack-ref/databases/redis-self-hosted.md` |
| `upstash`, `@upstash/redis` | `stack-ref/databases/upstash-redis.md` |
| `d1`, `cloudflare-d1` | `stack-ref/databases/cloudflare-d1.md` |
| `kv`, `cloudflare-kv` | `stack-ref/databases/cloudflare-kv.md` |
| `convex` | `stack-ref/databases/convex.md` |
| `supabase-db`, `supabase` (database) | `stack-ref/databases/supabase-db.md` |
| `cockroachdb`, `cockroach` | `stack-ref/databases/cockroachdb.md` |
| `planetscale` | `stack-ref/databases/planetscale.md` |

### Email
| Signal | Convention file |
|---|---|
| `resend` | `stack-ref/email/resend.md` |
| `sendgrid`, `@sendgrid` | `stack-ref/email/sendgrid.md` |
| `postmark` | `stack-ref/email/postmark.md` |
| `ses`, `amazon-ses`, `@aws-sdk/client-ses` | `stack-ref/email/amazon-ses.md` |
| `mailgun` | `stack-ref/email/mailgun.md` |
| `brevo` | `stack-ref/email/brevo.md` |
| `ahasend` | `stack-ref/email/ahasend.md` |

### Frontend
| Signal | Convention file |
|---|---|
| `web`, `webapp`, `spa`, `ssr`, `website` | `stack-ref/frontend/web.md` |
| `mobile`, `react-native`, `expo`, `capacitor` | `stack-ref/frontend/mobile.md` |
| `desktop`, `electron`, `tauri` | `stack-ref/frontend/desktop.md` |
| `cli`, `command-line`, `terminal`, `parseArgs`, `commander`, `yargs`, `meow` | `stack-ref/frontend/cli.md` |

### Jobs
| Signal | Convention file |
|---|---|
| `inngest` | `stack-ref/jobs/inngest.md` |
| `trigger.dev`, `triggerdotdev`, `@trigger.dev` | `stack-ref/jobs/triggerdotdev.md` |
| `bullmq`, `bull` | `stack-ref/jobs/bullmq.md` |
| `cloudflare-queues` | `stack-ref/jobs/cloudflare-queues.md` |

### Operations
| Signal | Convention file |
|---|---|
| `notion-crm` | `stack-ref/ops/notion-crm.md` |
| `solo-saas`, `ops-stack` | `stack-ref/ops/solo-saas-ops-stack.md` |

### Payments
| Signal | Convention file |
|---|---|
| `stripe`, `@stripe` | `stack-ref/payments/stripe.md` |
| `lemon-squeezy`, `lemonsqueezy` | `stack-ref/payments/lemon-squeezy.md` |
| `mollie`, `@mollie` | `stack-ref/payments/mollie.md` |
| `paddle`, `@paddle` | `stack-ref/payments/paddle.md` |

### Platforms
| Signal | Convention file |
|---|---|
| `cloudflare` (platform), `workers`, `pages`, `wrangler` | `stack-ref/platforms/cloudflare.md` |
| `hash_in_range`, `cf.random_seed`, `cloudflare-rules`, `cloudflare-ab-testing`, `cloudflare-rollout` | `stack-ref/platforms/cloudflare.md` |
| `a/b testing` (Cloudflare), `traffic splitting` (HTTP rules), `request sampling`, `percentage rollout` (Cloudflare), `canary rollout` (Cloudflare rules) | `stack-ref/platforms/cloudflare.md` |
| `vercel`, `@vercel` | `stack-ref/platforms/vercel.md` |
| `firebase`, `firebase-admin`, `@firebase` | `stack-ref/platforms/firebase.md` |
| `fly.io`, `flyio`, `fly.toml` | `stack-ref/platforms/flyio.md` |
| `aws`, `amazon`, `@aws-sdk` | `stack-ref/platforms/aws.md` |
| `gcp`, `google-cloud`, `@google-cloud` | `stack-ref/platforms/gcp.md` |
| `supabase` (platform), `@supabase` | `stack-ref/platforms/supabase.md` |
| `infomaniak` | `stack-ref/platforms/infomaniak.md` |

### Search
| Signal | Convention file |
|---|---|
| `meilisearch` | `stack-ref/search/meilisearch.md` |
| `algolia`, `algoliasearch`, `@algolia` | `stack-ref/search/algolia.md` |
| `orama`, `@orama` | `stack-ref/search/orama.md` |
| `typesense` | `stack-ref/search/typesense.md` |

### Storage
| Signal | Convention file |
|---|---|
| `railway`, `railway-buckets`, `railway-storage` | `stack-ref/storage/railway-buckets.md` |
| `r2`, `cloudflare-r2` | `stack-ref/storage/cloudflare-r2.md` |
| `backblaze`, `b2`, `backblaze-b2` | `stack-ref/storage/backblaze-b2.md` |
| `gcs`, `google-cloud-storage`, `@google-cloud/storage` | `stack-ref/storage/google-cloud-storage.md` |

---

## Design

### Design Systems
| Signal | Convention file |
|---|---|
| `web`, `webapp`, `react`, `next`, `vue`, `svelte`, `html` | `design/systems/web-standards.md` |
| `design-system`, `design system`, `fluent`, `material`, `carbon`, `polaris`, `atlaskit`, `primer`, `govuk`, `uswds`, `bootstrap`, `radix`, `shadcn` | `design/systems/design-system-selection.md` |
| `ios`, `macos`, `swift`, `swiftui`, `apple` | `design/systems/apple-hig.md` |
| `android`, `kotlin`, `material`, `jetpack` | `design/systems/material-design.md` |
| `cli`, `terminal`, `command-line`, `tui` | `design/systems/cli-patterns.md` |

### Design Quality
| Signal | Convention file |
|---|---|
| `web`, `webapp`, `accessibility`, `wcag`, `a11y` | `design/quality/accessibility.md` |
| `ui`, `frontend`, `responsive`, `layout` | `design/quality/ui-rules.md` |
| `taste`, `anti-slop`, `ai-tell`, `placeholder`, `hero fit`, `cta wrap`, `bento`, `eyebrow` | `design/quality/design-taste.md` |

### Design Components (include selectively based on feature context)
| Signal | Convention file |
|---|---|
| `form`, `input`, `validation` | `design/components/forms.md` |
| `button`, `cta`, `action` | `design/components/buttons.md` |
| `modal`, `dialog`, `popup`, `overlay` | `design/components/modals.md` |
| `nav`, `navigation`, `sidebar`, `menu`, `breadcrumb` | `design/components/navigation.md` |
| `list`, `table`, `grid`, `collection` | `design/components/lists.md` |
| `toast`, `notification`, `alert`, `snackbar`, `feedback` | `design/components/feedback.md` |
| `chart`, `graph`, `dashboard`, `analytics`, `metrics`, `visualization` | `design/components/data-visualization.md` |
| `terminal chart`, `ASCII sparkline`, `CLI histogram`, `terminal dashboard`, `ANSI data viz` | `design/components/data-visualization-terminal.md` |
| `log`, `log-viewer`, `audit-trail` | `design/components/log-viewer.md` |
| `payment`, `checkout`, `billing`, `subscription`, `pricing` | `design/components/payment-flows.md` |
| `realtime`, `websocket`, `sse`, `live`, `streaming` | `design/components/realtime-streams.md` |
| `terminal streaming`, `ANSI cursor`, `CLI live output`, `tail -f pattern`, `terminal buffering` | `design/components/realtime-streams-terminal.md` |
| `email-template`, `transactional-email` | `design/components/email-templates.md` |

### Design Tokens (include when any UI work is detected)
| Signal | Convention file |
|---|---|
| Any UI signal (web, mobile, desktop) | `design/tokens/spacing.md` + `design/tokens/typography.md` + `design/tokens/colors.md` + `design/tokens/motion.md` |
| Cross-platform (iOS + Android, or web + mobile) | `design/tokens/cross-platform.md` |

### Design References (include selectively)
| Signal | Convention file |
|---|---|
| `webapp`, `app`, `saas` | `design/references/app-views.md` + `design/references/app-ui.md` |
| `landing-page`, `marketing`, `homepage` | `design/references/landing-pages.md` |
| `design-read`, `brief interpretation`, `vibe`, `aesthetic`, `audience` | `design/references/design-read-protocol.md` |
| `redesign`, `site refresh`, `visual overhaul`, `preserve brand` | `design/references/redesign-protocol.md` |
| `mockup`, `wireframe`, `pencil`, `figma` | `design/references/mockup-specs.md` |
| `devtools`, `developer-tools` | `design/references/devtools.md` |

---

## Copywriting

| Signal | Convention file |
|---|---|
| `landing-page`, `marketing`, `homepage`, `hero`, `cta` | `copywriting/landing-page.md` |
| `email`, `transactional-email`, `newsletter`, `drip`, `sequence` | `copywriting/email-sequences.md` |
| `tagline`, `slogan`, `value-proposition`, `headline` | `copywriting/taglines.md` |

---

## Conventions (Transversal)

| Signal | Convention file |
|---|---|
| `mermaid`, `gherkin`, `diagram`, `flowchart`, `sequence`, `state` | `conventions/diagrams.md` |
| `naming`, `file-name`, `directory`, `kebab-case` | `conventions/naming.md` |
| `convention-conflict`, `override`, `authority` | `conventions/authority.md` |
| `technical-writing`, `developer-docs`, `readme`, `tutorial`, `runbook`, `procedure` | `conventions/technical-writing.md` |
| `api-reference`, `docstring`, `code-sample`, `code-example`, `cli-help`, `developer-guide` | `conventions/technical-writing.md` |

---

## Legal (French/EU SaaS)

| Signal | Convention file |
|---|---|
| `cgu`, `terms-of-service`, `tos`, `conditions-generales` | `legal/cgu-saas-type.md` |
| `cgv`, `conditions-de-vente` | `legal/cgv-saas.md` |
| `rgpd`, `gdpr`, `data-protection`, `dpo` | `legal/rgpd-obligations.md` |
| `privacy`, `privacy-policy`, `politique-de-confidentialite` | `legal/privacy-policy.md` |
| `cookie`, `cookie-policy`, `cookie-banner`, `consent` | `legal/cookie-policy.md` |
| `mentions-legales`, `legal-notice` | `legal/mentions-legales.md` |
| `merchant-of-record`, `mor`, `reseller` | `legal/merchant-of-record.md` |

---

## Pricing Models

| Signal | Convention file |
|---|---|
| `freemium`, `free-tier`, `free-plan` | `pricing-models/freemium.md` |
| `flat-rate`, `fixed-price`, `monthly` | `pricing-models/flat-rate.md` |
| `per-seat`, `per-user`, `seat-based` | `pricing-models/per-seat.md` |
| `usage-based`, `pay-as-you-go`, `metered`, `consumption` | `pricing-models/usage-based.md` |

---

## SEO

| Signal | Convention file |
|---|---|
| `core-web-vitals`, `cwv`, `lcp`, `fid`, `cls`, `performance` | `seo/core-web-vitals.md` |
| `programmatic-seo`, `auto-generated-pages`, `template-pages` | `seo/programmatic.md` |
| `next-seo`, `nextjs-seo`, `sitemap`, `robots`, `metadata` | `seo/technical-nextjs.md` |

---

## AI Models (Reference)

| Signal | Convention file |
|---|---|
| `image-generation`, `dall-e`, `stable-diffusion`, `midjourney` | `models/image.md` |
| `video-generation`, `sora`, `runway`, `kling` | `models/video.md` |
| `chat-model`, `llm-model`, `model-selection` | `models/chat.md` |
| `music-generation`, `audio-generation` | `models/music.md` |

## Evidence-based UI resources

| Signal | Convention file |
|---|---|
| `dashboard`, `cockpit`, `KPI`, `analytics` | `design/components/dashboard-design.md` |
| `onboarding`, `activation`, `personalization`, `permissions` | `design/components/onboarding-design.md` |
| `paywall`, `upgrade`, `subscription`, `free trial` | `design/components/paywall-design.md` |
| `streak`, `habit`, `gamification`, `progress` | `design/components/streak-design.md` |
| `Mobbin`, `blog review`, `UX research` | `design/references/mobbin-blog-review.md` |
| `UI benchmark`, `MCP design`, `reference research` | `design/references/ui-reference-research.md` |
| `homepage`, `testimonial`, `bento`, `marketing proof` | `design/references/homepage-evidence.md` |

## Guided Navigation

| Signal | Convention file |
|---|---|
| `guided navigation`, `natural-language navigation`, `navigation guidée` | `architecture/guided-navigation.md` |
| `in-app help`, `aide contextuelle`, `destination catalog` | `architecture/guided-navigation.md` |
| `intent routing`, `scroll to anchor`, `anchor navigation` | `architecture/guided-navigation.md` |
