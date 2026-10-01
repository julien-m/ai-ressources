---
last_updated: 2026-10-01
confidence: high
category: jobs
type: managed
pricing_model: [free, per-operation]
free_tier: true
---

# Cloudflare Queues

Managed asynchronous message delivery for Cloudflare Workers and Durable Objects. Reviewed against official documentation on 2026-10-01; recheck limits and pricing before adoption.

## Delivery model

- Producers publish using a Queue binding; a consumer Worker processes batches. Delivery is **at least once**, with **no guaranteed publishing order**. Consumers must handle duplicates and out-of-order occurrences.
- A successful `send()` means the Queue accepted the message; it does not establish consumer success.
- Acknowledge successful messages individually with `ack()`; use `retry()` for retryable failures. Configure a DLQ for exhausted retries. Expired messages are deleted; a DLQ is not an indefinite audit store.
- Messages support relative delivery/retry delays up to 24 hours. Delay does not provide editable recurrence or cancellation of an individual queued message.

**Read** [delivery guarantees](https://developers.cloudflare.com/queues/reference/delivery-guarantees/), [ordering and producer behavior](https://developers.cloudflare.com/queues/reference/how-queues-works/) and [acknowledgements, retries and delays](https://developers.cloudflare.com/queues/configuration/batching-retries/).

## Selected limits

| Contract | Documented limit |
|---|---|
| Message size | 128 KB, including internal metadata |
| Delivery/retry delay | 24 hours |
| Push consumer wall-clock duration | 15 minutes; CPU budget is separate |
| Consumer CPU | Default 30 seconds; configurable up to 5 minutes on Workers Paid |
| Retention, Workers Free | 24 hours, not configurable |
| Retention, Workers Paid | Default 4 days; configurable up to 14 days |

**Read** [Queue limits](https://developers.cloudflare.com/queues/platform/limits/) for the complete constraints. Do not infer a universal Worker wall-clock timeout from its CPU budget.

## Pricing

| Plan | Included Queue operations | Additional Queue operations |
|---|---|---|
| Workers Free | 10,000/day | Subject to the free plan allowance |
| Workers Paid | 1,000,000/month | $0.40/million |

Billing counts operations per 64 KB chunk, not unique jobs. A small message normally costs one write, one read and one delete; retries add reads and DLQ forwarding adds work. Batch delivery still bills per message. Worker execution, DO scheduling and optional storage are additional cost drivers.

**Read** [official Queue pricing](https://developers.cloudflare.com/queues/platform/pricing/) before estimating a workload. The included allowance is not five million free messages per month.

## When to use

- Cloudflare-native asynchronous jobs, event delivery, buffering and bounded consumer work.
- Simple deferral within 24 hours when a relative delay suffices.
- DO alarm scheduling when users need editable dates or recurrence: **Read** [the Cloudflare job scheduling pattern](../../architecture/cloudflare-job-scheduling.md).

## When to choose another primitive

- Global periodic maintenance: Cron Triggers, optionally publishing to Queue.
- Durable multi-step waits/retries: Cloudflare Workflows; combine with Queue only for an actual buffering/fan-out need.
- Jobs exceeding the consumer's CPU or wall-clock budget: move the execution to an appropriate runtime; Queue may still dispatch it.
- Strict FIFO or priority semantics: choose an engine that provides the required contract, or add explicit sequencing/coordination.

**Read** [Workflows](https://developers.cloudflare.com/workflows/) and [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) for those alternatives.
