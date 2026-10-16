---
last_updated: 2026-10-16
confidence: high
category: storage
type: managed
pricing_model: [free, per-storage, per-operation]
free_tier: true
---

# Cloudflare R2

> S3-compatible object storage with free egress and native Workers integration. Compare with B2 + Cloudflare and Railway Buckets before selecting storage.

## What it is

Object storage accessible through S3 clients, public custom domains or a native Workers binding. Free egress means no charge per downloaded byte; API reads can still be billed.

## Pricing

Verified 2026-10-16; USD before taxes.

| Resource | Standard | Infrequent Access |
|----------|----------|-------------------|
| Storage | $0.015/GB-month | $0.01/GB-month |
| Class A operations | $4.50/million | $9/million |
| Class B operations | $0.36/million | $0.90/million |
| Retrieval | None | $0.01/GB |
| Egress | Free | Free |
| Minimum retention | None | 30 days |

Standard includes 10 GB-month storage, 1 million Class A operations and 10 million Class B operations each month. Infrequent Access has no corresponding free allowance. Billable usage is rounded up to billing units.

Example: 100 GB stored all month, 100,000 uploads and 1 million downloads cost **$1.35/month** in Standard: 90 billable GB-month and operations within free allowances. Multipart uploads may consume multiple operations. Workers and other attached services are billed separately.

## Features

- S3-compatible API, multipart uploads and presigned URLs.
- Native Workers binding; no universal latency guarantee.
- Public custom domains, Cloudflare caching and object lifecycle expiration.

## When to use

- Workers applications that benefit from a native storage binding.
- Files requiring automatic expiration or public delivery through a custom domain.
- Frequent downloads with predictable bandwidth charges.

## Trade-offs and alternatives

- Read [the B2 + Cloudflare reference](backblaze-b2.md) when lower storage cost matters: B2 traffic through Cloudflare also has free egress.
- Read [the Railway Buckets reference](railway-buckets.md) when the application already runs on Railway or API operation volume is high: Railway has free bucket operations at the same base storage rate as R2.
- Compare actual workload latency and throughput before selecting on performance; no provider is a universal winner.
- For short-lived files, avoid Infrequent Access minimum retention and retrieval charges unless the cost model justifies them.

## Stack combinations

- Workers + R2: native file access and application authorization.
- B2 + Cloudflare CDN/Worker: a separate lower-storage-cost option; R2 is not required to obtain free B2-to-Cloudflare egress.

## Sources

- Read [R2 pricing](https://developers.cloudflare.com/r2/pricing/) before estimating costs.
- Read [R2 documentation](https://developers.cloudflare.com/r2/) for API, public access and lifecycle configuration.
