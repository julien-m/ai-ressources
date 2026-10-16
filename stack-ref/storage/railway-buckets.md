---
last_updated: 2026-10-16
confidence: high
category: storage
type: managed
pricing_model: [free, per-storage]
free_tier: true
open_source: false
---

# Railway Buckets

> Consider alongside Backblaze B2 + Cloudflare and Cloudflare R2 when choosing object storage, especially for apps already hosted on Railway or workloads with many API operations.

## What it is

Private S3-compatible object storage integrated with Railway projects. Railway also hosts applications, containers and databases; bucket pricing is separate from service compute, volumes and network usage.

## Features

- S3 clients, presigned URLs, multipart uploads and object tagging.
- Separate buckets and credentials per environment; credentials can be injected into services.
- Free unlimited bucket egress and S3 API operations.

## Pricing

Verified 2026-10-16; USD before taxes.

| Resource | Price or limit |
|----------|----------------|
| Storage | $0.015/GB-month; no minimum retention or retrieval fee |
| Bucket API operations and direct downloads | Free |
| Free plan | Up to 10 GB-month; storage consumes the shared $1 monthly credit |
| Hobby | $5/month including $5 usage; combined bucket capacity limited to 1 TB |
| Pro | $20/month including $20 usage; no bucket capacity limit listed |
| Service egress | $0.05/GB, including backend-to-bucket uploads and files relayed to clients |

Paid-plan credits cover usage rather than adding to it: $15 total usage costs $15 on Hobby, or $20 on Pro. Free-plan credit exhaustion suspends bucket access until renewal or upgrade.

### Comparison with R2 and B2 + Cloudflare

Base storage estimates before free allowances, Railway plan minimums and optional Cloudflare services; 1 TB = 1,000 GB. Downloads use buckets directly or Cloudflare for B2, without a Railway backend relay.

| Monthly workload | Railway Buckets | R2 Standard | B2 + Cloudflare |
|------------------|-----------------|-------------|-----------------|
| 1 TB stored, 1 TB downloaded | $15 | $15 + billable operations | From $6.95 |
| 1 TB stored, 10 TB downloaded | $15 | $15 + billable operations | From $6.95 |
| 10 TB stored, 100 TB downloaded | $150 (Pro required) | $150 + billable operations | From $69.50 |

Read [the R2 reference](cloudflare-r2.md) for operation allowances and [the B2 reference](backblaze-b2.md) for Cloudflare routing and pricing conditions.

## Performance evidence

- User-reported signal (2026-10-16): Railway posts on X reportedly showed better performance statistics than R2 and B2.
- Evidence status: the exact posts, measurements and methodology were not retrieved; no independent benchmark was run. This is a reason to evaluate Railway, not proof of a universal speed advantage.
- Before choosing on speed, compare upload/download throughput, time to first byte, p50/p95 latency and errors for the actual file sizes, client/compute regions and concurrency. Measure B2 through Cloudflare, separating warm-cache and cold-cache reads.

## Technical limits

As documented on 2026-10-16: no public buckets, object versioning, object locks or bucket lifecycle configuration. The supported-feature list also marks server-side encryption as not yet supported; verify current encryption guarantees before storing sensitive data.

## When to use

- Apps already on Railway that benefit from shared project configuration.
- Many small objects or frequent operations, where R2 operation charges matter.
- Private files served through presigned URLs and workloads selected by representative performance measurements.

## When to prefer an alternative

- Lowest active-storage cost with Cloudflare delivery: B2 + Cloudflare.
- Native Workers bindings or automatic object expiration: R2.
- Required versioning, immutable retention or other unsupported bucket features: assess B2 or another provider.

## Stack combinations

- Railway application + Railway Buckets: integrated setup; prefer direct client uploads/downloads to avoid service egress.
- Railway application + B2 + Cloudflare: lower storage price with separate providers.
- Cloudflare Workers + R2: native storage binding.

## Sources

- Read [Railway bucket documentation](https://docs.railway.com/storage-buckets) for supported features.
- Read [bucket billing](https://docs.railway.com/storage-buckets/billing) and [plan pricing](https://docs.railway.com/pricing/plans) before estimating a bill.
- Consult [Railway on X](https://x.com/Railway) to locate the exact performance posts; this profile alone does not establish benchmark results.

Recheck prices, limits and feature availability before implementation, or after three months.
