# Quick Reference — Stack Decisions

> Condensed decision guide for the most common questions. For full details, see [decision-matrix.md](decision-matrix.md) and individual category files.

```yaml
last_updated: 2026-03-26
source: decision-matrix.md
```

---

## All-in-one Platforms (auth + DB + hosting)

| Platform | Auth | DB | Realtime | Free tier | Prod price | SQL | RGPD EU | Open-source |
|----------|------|----|----------|-----------|------------|-----|---------|-------------|
| **Supabase** | GoTrue (50k MAU free) | PostgreSQL managed | WebSockets | 2 projects, 500 MB | $25/mo (Pro) | Yes | EU regions | Yes |
| **Firebase** | Unlimited MAU free | Firestore (NoSQL) | Native | Spark plan | $0-5/mo (pay-as-you-go) | No | US default | No |
| **Convex** | Convex Auth / Clerk | Document store | First-class | 1M calls/mo | ~$16/mo (15k users) | No | EU (+30%) | FSL |

### When to pick what

```
All-in-one platform?
├── Web app (SaaS, dashboard, CRUD) → Supabase
├── Mobile iOS/Android (offline sync, push) → Firebase
├── Realtime TypeScript (chat, collab, live) → Convex + Clerk
└── Ultra-cheap edge, DIY auth → Cloudflare + Better Auth
```

---

## Hosting Platforms — Quick Compare

| Platform | Best for | Free tier | Prod start | Edge | Containers |
|----------|----------|-----------|------------|------|------------|
| **Vercel** | Next.js / Astro frontend | Hobby plan | $20/mo (Pro) | Edge functions | No |
| **Cloudflare** | 100% edge, lowest cost | 100k req/day | $5/mo (Paid) | Native | No (Workers) |
| **Fly.io** | Docker, multi-region | 3 shared VMs | ~$5-10/mo | No | Yes |
| **Supabase** | Full-stack web (auth+DB+storage) | 2 projects | $25/mo (Pro) | No | No |
| **Firebase** | Mobile-first (iOS/Android) | Spark plan | Pay-as-you-go | No | No |
| **AWS** | Enterprise, full control | 12mo free tier | ~$50+/mo | CloudFront | ECS/EKS |
| **Infomaniak** | EU sovereign (FR/CH) | None | ~€25/mo | No | Yes |
| **GCP** | Cloud Run, EU residency | 2M req/mo | ~$10/mo | No | Cloud Run |

---

## Auth — Quick Compare

| Provider | Type | Free tier | Prod price | SSO/SAML | Self-hosted | Best for |
|----------|------|-----------|------------|----------|-------------|----------|
| **Better Auth** | Open-source | Unlimited | $0 | Plugin | Yes | Full control, any stack |
| **Auth.js** | Open-source | Unlimited | $0 | No | Yes | Next.js + OAuth |
| **Clerk** | Managed | 10k MAU | $25+/mo | Yes ($) | No | DX, prebuilt UI |
| **Supabase Auth** | Platform | 50k MAU | Included in Pro | No | Yes | Supabase stack |
| **WorkOS** | Enterprise | 1M MAU | $299+/mo | Native | No | Enterprise SAML/SCIM |

---

## Databases — Quick Compare

| DB | Type | Free tier | Prod price | Edge | Best for |
|----|------|-----------|------------|------|----------|
| **Supabase** | Postgres managed | 500 MB | $25/mo | No | Full-stack web |
| **Neon** | Serverless Postgres | 512 MB | $19/mo | No | Branching, scale-to-zero |
| **Turso** | Edge SQLite | 9 GB | $29/mo | Yes | Multi-tenant, edge |
| **D1** | Edge SQLite (CF) | 5 GB | $0.75/GB | Yes | CF Workers |
| **Convex** | Document store | 1M calls | $25/mo | No | Realtime TypeScript |
| **Upstash Redis** | Serverless Redis | 10k cmd/day | $10/mo | Yes | Cache, sessions, rate-limit |

---

## Recommended Stacks by Profile

| Profile | Stack | Cost (early) | Cost (growth) |
|---------|-------|-------------|---------------|
| **Micro-SaaS solo** | CF Workers + D1 + KV + R2 + Better Auth + Resend + Lemon Squeezy | $0 | $5-15/mo |
| **SaaS Next.js** | Vercel + Neon + Upstash + Better Auth + Resend + Stripe | $0-20/mo | $40-80/mo |
| **App AI-powered** | Vercel + Neon + Upstash + AI SDK + OpenRouter + Better Auth | $20-30/mo | $40-80 + tokens |
| **Containerized** | Fly.io + Supabase + Inngest + Postmark + Stripe | $20-35/mo | $60-100/mo |
| **EU sovereign** | Infomaniak + Postgres + Better Auth + Brevo + Mollie | €25-40/mo | €55-90/mo |

---

## Quick Decision Keys

| Question | Answer |
|----------|--------|
| Cheapest at all scales? | Cloudflare (Workers + D1 + KV + R2) |
| Best all-in-one web? | Supabase |
| Best all-in-one mobile? | Firebase |
| Scale-to-zero? | Neon, Turso, Upstash, CF Workers |
| Auth self-hosted TS? | Better Auth |
| Auth enterprise SAML? | WorkOS |
| VAT delegation? | Lemon Squeezy or Paddle |
| Best email DX? | Resend |
| Cheapest email at scale? | Amazon SES |
| EU data residency? | Infomaniak or GCP EU |
| Zero budget prototype? | CF free + Neon free + Resend free = $0 |
