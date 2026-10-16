# Cloudflare Job Scheduling

Reusable pattern for user-defined execution times on Cloudflare: a Durable Object (DO) owns the schedule, an alarm makes an occurrence due, and a Queue delivers it to a consumer. Reviewed against official documentation on **2026-10-01**. This is an architecture reference; the examples are illustrative, with no deployed scheduler proof.

**Read** [background job conventions](background-jobs.md) for shared reliability rules, [Cloudflare conventions](../code-conventions/cloudflare.md) for runtime practices, and [the architecture pattern template](_template.md) when documenting another use case.

## Problem and selection

Example: a tenant requests a report tomorrow at 09:00 in `Europe/Paris`, then changes it to a daily report. The schedule must survive eviction and deployment, support updates, and tolerate delivery failures.

| Need | Start with | Trade-off / boundary |
|---|---|---|
| A few global recurring maintenance tasks | Workers Cron Trigger; optionally enqueue work | UTC schedules configured through Wrangler/dashboard/API; unsuitable as a separate trigger for every user |
| A simple relative delay of at most 24 hours | Queue `send(payload, { delaySeconds })` | No scheduler DO; delayed messages still need application state for cancellation/version checks |
| One small action tied to an existing stateful entity | Its DO alarm, executing directly | Queue optional; downstream retries and idempotency still required |
| User-specific one-off or recurring times, editable schedules | DO alarm + Queue | Application owns calendar, occurrence identity, recovery and lifecycle |
| Several durable steps, waits, retries or external events | Workflows; `step.sleepUntil()` for a future instant | Managed step state/retries; use DO scheduling only when independently editable recurrence warrants it |
| Large schedule inventory with minute-level tolerance | Cron dispatcher + indexed SQL due-job table + Queue | Application implements transactional claims, batching and recovery; benchmark database capacity |
| Hard deadline with tightly bounded latency | A system designed and measured for that deadline | Alarm timestamp is not an end-to-end execution-time SLA |

Queue delays are limited to 24 hours. Cron runs in UTC and configuration changes can take up to 15 minutes to propagate. Workflows supports durable sleeping until a date. **Read** [Queue delays](https://developers.cloudflare.com/queues/configuration/batching-retries/), [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) and [Workflow sleeping](https://developers.cloudflare.com/workflows/build/sleeping-and-retrying/) before choosing a primitive.

## Assessment of the article

**Read** [Shaikh Al Amin's DEV.to article, Building a Reliable Job Scheduler with Cloudflare Durable Objects and Queues](https://dev.to/shaikhalamin/building-a-reliable-job-scheduler-with-cloudflare-durable-objects-and-queues-3d27) for the motivating example. The article is useful for understanding schedule ownership and separating timers from workers; it is not a complete production reliability contract.

| Article design | Assessment / improvement |
|---|---|
| One DO per schedule | Good isolation baseline; sharding needs workload evidence |
| Alarm publishes to Queue | Keep the separation; add durable pending dispatch and occurrence IDs |
| SQL + DO + KV | Make ownership explicit; projections introduce synchronization work |
| Exact-time wording | Replace with measured scheduling and processing latency |
| Single-threaded means no races | Revalidate revisions around external asynchronous calls |
| Reused payload for every occurrence | Carry identifiers; fetch current authorized data during execution |
| Random 30–50 second offset | Only add jitter within an accepted lateness budget |
| Handwritten retries | Persist counters; distinguish alarm, dispatch and consumer retries |

These improvements are independently authored engineering recommendations informed by the official contracts linked throughout this reference. No article code is copied.

## Components and ownership

| Component | Responsibility | Durable state |
|---|---|---|
| API Worker | Authenticate owner, validate timing and job type, route commands | Optional application schedule directory and command outbox |
| Scheduler DO | Own executable schedule, revision, due occurrences and pending dispatch | SQLite-backed DO storage; one active alarm |
| Queue | Buffer accepted jobs and deliver to consumers | Messages subject to retention and retry policies |
| Consumer Worker | Validate message, claim occurrence, execute, store result, acknowledge | Atomic occurrence claim/result ledger and provider idempotency key |
| Optional SQL directory | List schedules by owner; reconcile unapplied commands and stalled jobs | Desired revision versus DO-applied revision, recovery status |
| Optional KV projection | Cache an administrative overview | Eventually consistent view; never cancellation, locks or deduplication authority |

- Start with one DO per schedule, routed using an unambiguous tenant/schedule key and `getByName()`. Use SQLite-backed classes and `new_sqlite_classes` migrations. A service binding/RPC interface can keep the scheduler internal; a separate scheduler Worker is optional.
- Each DO has one alarm. Multiple jobs per DO require an indexed due-event collection and an alarm for the earliest deadline; never repeatedly call `setAlarm()` expecting independent timers.
- Keep commands and local transitions transactional. DO events can interleave during external I/O; reread authoritative revision/state after `await queue.send()` before any further transition. Do not hold `blockConcurrencyWhile()` over external calls.
- SQL is optional unless global querying/reconciliation is required. If SQL owns desired configuration, persist its update and a command outbox together, apply commands idempotently to the DO, and expose desired/applied revisions. No SQL/DO/Queue distributed transaction is implied.

**Read** [DO storage practices](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/) and [SQLite storage transactions](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) for the storage/concurrency contract. **Read** [KV consistency](https://developers.cloudflare.com/kv/concepts/how-kv-works/) before introducing a read projection.

## Lifecycle and dispatch

```mermaid
sequenceDiagram
    participant API as API Worker
    participant DO as Scheduler DO
    participant Store as DO storage
    participant Q as Queue
    participant C as Consumer
    participant Ledger as Execution ledger
    API->>DO: Apply validated command with expected revision
    DO->>Store: Atomic schedule + revision + earliest alarm
    Store-->>DO: Durable commit
    DO-->>API: Applied revision and next due time
    Note over DO: Cloudflare invokes alarm()
    DO->>Store: Atomic occurrence + pending dispatch + next wake
    DO->>Q: Send occurrence with stable runId
    alt Send accepted
        DO->>Store: Record dispatch acceptance; recompute earliest alarm
        Q->>C: Deliver message, possibly repeatedly
        C->>Ledger: Atomic revision check + occurrence claim
        C->>C: Execute using provider idempotency key
        C->>Ledger: Persist outcome
        C-->>Q: Acknowledge this message
    else Send fails or acceptance is ambiguous
        DO->>Store: Keep pending occurrence; persist retry deadline
        Note over DO: Retry uses the same runId
    end
```

Scheduling pseudocode; the named operations are contracts to implement, not Cloudflare APIs or runnable code:

```text
onAlarm(now):
  localStorageTransaction:
    materializeDueOccurrencesBounded(now, missedRunPolicy)
    insertPendingDispatchIfAbsent(stableOccurrenceId)
    advanceCalendarCursorFromLogicalDueTime()
    armEarliest(nextCalendarDue, pendingDispatchRetryDue)
  for each bounded pending dispatch:
    try:
      await queue.send(occurrenceEnvelope)
    catch sendError:
      localStorageTransaction:
        persistRetryOrBlockedStateWithoutChangingOccurrenceId()
        recomputeEarliestAlarmFromCurrentRevision()
      continue
    localStorageTransaction:
      markOnlyThisDispatchAcceptedIfStillApplicable()
      recomputeEarliestAlarmFromCurrentRevision()
```

- The pending occurrence and its recovery alarm must commit **before** publishing. Schedule creation/update likewise commits configuration and alarm together. Use the documented storage transaction API; no network calls inside its callback. `transactionSync()` is for synchronous SQLite operations; use the appropriate transaction mechanism when alarm operations are included.
- A crash after Queue acceptance but before recording acceptance can publish twice. Preserve `runId` across retries; never mark a job sent before awaiting acceptance. A local outbox prevents forgetting the occurrence; it cannot provide exactly-once delivery across storage and Queue.
- Next wake is the earliest calendar occurrence or pending retry, including after commands, success and failure. Bound work per alarm to avoid starving commands; rearm promptly when more due work remains.
- Separate schedule state (`active`, `paused`, `cancelled`, `blocked`) from occurrence/dispatch state (`pending`, `enqueued`, `succeeded`, `failed`, `skipped`). For a one-off job, no next calendar occurrence exists, but its pending dispatch must remain recoverable.

## Delivery and retry contracts

- Both alarms and Queues use **at-least-once** semantics. Queues does not guarantee publishing order. Use stable occurrence identity, atomic claims and version-aware consumers. **Read** [alarm semantics](https://developers.cloudflare.com/durable-objects/api/alarms/), [Queue delivery guarantees](https://developers.cloudflare.com/queues/reference/delivery-guarantees/) and [Queue ordering](https://developers.cloudflare.com/queues/reference/how-queues-works/).
- Native alarm failures retry when the handler throws, with exponential backoff starting at 2 seconds and up to 6 retries. This budget is finite. If an error is caught and the handler returns, application retry requires a persisted deadline and rearmed alarm. Choose one explicit owner for dispatch retry; avoid accidentally stacking application and native policies.
- Consumer retry is separate: acknowledge each message only after durable success or an authorized skip. Use `retry()` for transient failures, respect downstream rate limits, and configure a DLQ for exhausted consumer retries. **Read** [Queue acknowledgement/retries](https://developers.cloudflare.com/queues/configuration/batching-retries/) and [DLQ behavior](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/).
- A producer send failure has never reached the Queue; a consumer DLQ cannot recover it. Persist `blocked` dispatch state after the application retry budget, alert, and provide explicit replay. For critical schedules, reconcile known schedule IDs and overdue pending work with an independently triggered watchdog; native retries alone do not guarantee indefinite recovery.
- Claims require a unique occurrence key and an atomic compare-and-set/insert. A claim needs lease expiry and fencing for crash recovery; a completed result needs retention covering retries, Queue retention and authorized replay. A read-then-write check or KV cache is insufficient.
- For an external side effect, pass `runId` as its idempotency key where supported. A crash after provider success but before saving the receipt otherwise leaves an ambiguous outcome; require provider reconciliation or a documented duplicate-risk policy. A local ledger alone cannot make arbitrary external APIs exactly once.

## Time, updates and cancellation

| Contract | Required decision |
|---|---|
| One-off | Require an explicit UTC/offset timestamp; reject invalid values and declare reject/run-now policy for past times |
| Calendar recurrence | Store cron/calendar rule plus IANA zone, then compute each next instant in UTC using a timezone-aware library |
| DST | Define handling of nonexistent local times (skip or shift) and repeated local times (once or twice); test the chosen library behavior |
| Fixed interval | Anchor to previous logical due time or an initial epoch; computing from completion time introduces drift |
| Missed occurrences | Choose skip, latest-only or bounded catch-up; retries preserve the original occurrence identity |
| Jitter | Default to zero for promised user times; optional deterministic nonnegative offset within a declared tolerance |
| Overlap | Use an atomic execution lease; choose skip, defer or allow concurrent occurrences explicitly |
| Update/pause/cancel | Compare expected revision, atomically change state and rearm/delete alarm; stale commands must fail or be idempotently ignored |
| Already queued | Queue messages are not individually cancelled by deleting a DO alarm; consumer checks authoritative cancellation/version state |
| Already started | Cancellation cannot undo an accepted external side effect; define the execution-claim boundary and compensation behavior |

For strict cancellation before execution claim, cancellation and claim must be serialized through the same authority (for example, DO RPC or one SQL transaction). A separate state read followed by a later claim has a race. Increasing `scheduleVersion` rejects older queued occurrences by default; preserving them requires an explicit policy.

## Concrete example

Illustrative one-off request after authentication; the server derives `tenantId` from the authenticated context:

```json
{
  "scheduleId": "report-42",
  "jobType": "generate-report",
  "timing": { "kind": "once", "at": "2026-10-02T09:00:00+02:00" },
  "payloadRef": "report-request-42"
}
```

The logical UTC deadline is `2026-10-02T07:00:00Z`. A daily alternative stores `{ "kind": "cron", "expression": "0 9 * * *", "timeZone": "Europe/Paris" }`; do not obtain tomorrow's local 09:00 by adding 24 hours to a UTC timestamp.

Illustrative Queue envelope; `schemaVersion` describes message format, while `scheduleVersion` describes configuration:

```json
{
  "schemaVersion": 1,
  "tenantId": "tenant-7",
  "scheduleId": "report-42",
  "scheduleVersion": 3,
  "scheduledFor": "2026-10-02T07:00:00Z",
  "runId": "tenant-7/report-42/v3/2026-10-02T07:00:00Z",
  "jobType": "generate-report",
  "payloadRef": "report-request-42"
}
```

IDs in this example have a restricted alphabet; production composite keys need unambiguous encoding. `runId` is derived once from tenant, schedule, revision and **logical** due time, never from retry time, jitter or Queue message ID. Resolve current report data and authorization at execution time; snapshots require an explicit versioned reference.

```gherkin
Feature: A report scheduled for a user-defined time
  Scenario: Tomorrow's report becomes due
    Given an active report schedule for 09:00 in Europe/Paris on 2026-10-02
    When its occurrence becomes due at 07:00 UTC
    Then the scheduler persists that occurrence before attempting dispatch
    And the consumer records report success before acknowledging the message

  Scenario: Dispatch is repeated after a crash
    Given Queue accepted an occurrence before the scheduler crashed
    When the pending occurrence is dispatched again
    Then both messages carry the same runId
    And the execution claim prevents concurrent duplicate work
    And any retried external effect uses the same provider idempotency key

  Scenario: A queued occurrence is cancelled before execution claim
    Given a queued report occurrence has not been claimed
    When its owner cancels the schedule through the claim authority
    Then a subsequent claim rejects that occurrence
    And the consumer records an authorized skip and acknowledges it
```

## Operations, security and optimization

- Validate mutually exclusive timing modes, allowed cron frequency, IANA zone, tenant quotas, expected revision and allowlisted job types. Bind job types to approved handlers/Queues; never accept arbitrary code, Queue names or fetch URLs from user input.
- Avoid sensitive payloads and logs; resolve secrets from Worker bindings during execution. Record identifiers, due/dispatch/start/finish timestamps, attempts and categorized errors. **Read** [logging conventions](../code-conventions/logging.md).
- `enqueued` means Queue accepted the job, not that the report exists. Persist consumer receipts; measure alarm lateness, dispatch latency, Queue wait, processing duration, blocked dispatch count, duplicate suppression, DLQ depth and stale projections.
- Prefer DO-owned state plus Queue initially. Add SQL for an actual listing/reconciliation need, and KV only for a measured cache need. Keep a SQL/DO command outbox if both are involved.
- Tune consumer batching and concurrency to downstream limits and the latency budget. Queue buffering already handles bursts; jitter is an optional business trade-off, not a prerequisite.
- Benchmark before consolidating schedules into tenant/hash shards. Index deadlines, bound catch-up batches, avoid one global scheduler DO, and preserve tenant fairness. Define how shard identities remain stable during resharding.
- Model costs from alarm invocations, DO storage operations, Queue operations/retries, consumer CPU and optional projections. Sleeping DOs do not require an application polling loop. Batch delivery does not eliminate per-message Queue operations. **Read** [Queue limits and pricing](../stack-ref/jobs/cloudflare-queues.md).
- For container pooling, compare billed awake time first: editable reminders that sleep between alarms usually do not match an always-awake actor benchmark. **Read** [DO pooling in Cloudflare Containers](cloudflare-durable-object-pooling.md) for candidate workloads, checkpoint trade-offs and the cost model.
- Retain audit/result state for the documented replay window, then clean up completed schedule state. Replayed messages must preserve `runId`; recreating a schedule requires a new identity or monotonic revision so old messages cannot become valid again.

## Validation before reuse

| Check | Expected evidence |
|---|---|
| Timing calculation | One-off, interval anchoring, DST gap/repeat, invalid cron and past-time fixtures |
| Persistence | Eviction/deployment preserves schedule, pending occurrence and next wake |
| Crash injection | Before send, after acceptance, before acceptance bookkeeping: no forgotten occurrence; stable runId |
| Concurrency | Update/cancel during external await cannot overwrite newer state; stale revisions fail |
| Consumer | Concurrent duplicate messages, lease expiry and provider-success/receipt-crash policy tested |
| Retry exhaustion | Producer blocked state/replay and consumer DLQ inspected independently |
| Recovery | Missed-run, overlap, projection/command reconciliation and watchdog policies exercised |
| Deployment | Actual Worker/DO/Queue receipts and measured due-to-start latency under representative load |

Local tests should use Cloudflare's Workers/DO test environment for storage and alarm interactions. Logic tests alone do not establish production timing, Queue behavior or external effect safety. **Read** [Cloudflare test APIs](https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/) before designing the runtime suite.

## Reuse decision

Adopt **DO + Queue** for independently editable user schedules with asynchronous execution. Use a simpler primitive for global cron or short relative delays; choose Workflows for durable multi-step execution. Before implementation, freeze timing tolerance, DST/missed-run policy, cancellation boundary, idempotency mechanism, authoritative state and recovery owner. Recheck vendor limits when consuming this dated reference.
