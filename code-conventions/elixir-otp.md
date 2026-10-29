---
extends: [elixir]
---
# Elixir OTP, Memory and Native Boundaries

## When to use

Apply when adding processes, parallel work, caches or native computation. Start with ordinary functions; OTP processes provide state ownership, isolation and concurrency, not a mandatory wrapper around every module. Read [durable jobs](oban.md) for work that must survive restart and [Rust rules](rust.md) before native implementation.

## Process selection

| Need | Default | Limit |
|---|---|---|
| Stateless transformation | Plain module/functions | No GenServer service facade |
| Owned in-memory state or serialized coordination | GenServer under a supervisor | One mailbox can become a bottleneck; state is volatile |
| Bounded request-related parallel work | Task.Supervisor | Work can be lost on restart |
| Persistent retries, scheduling, external side effects | Oban | Requires database and active execution |
| Many dynamic stateful children | DynamicSupervisor + Registry if needed | Bound child count and define cleanup |

- Model the supervision tree around fault domains. Select `:one_for_one`, `:rest_for_one` or `:one_for_all` from dependency/recovery requirements; document child order, restart intensity, shutdown timeout and temporary/transient/permanent child policy.
- Make initialization/restart safe and idempotent; a crash after a provider side effect can cause a duplicate when retried. Never rely on `terminate/2` for guaranteed cleanup or durable persistence.
- Use monitors for observation, links for deliberately coupled failure. Understand exit propagation before using `Task.async/1`; for independently handled failures use supervised non-linked tasks and consume result plus `:DOWN` messages.
- Never perform lengthy HTTP, PDF rendering or heavy loops inside GenServer callbacks. Offload to a supervised worker and handle completion, timeout, cancellation and caller disappearance. `GenServer.call/3` timeout does not cancel server-side work.
- A GenServer serializes only its own process; it does not enforce reservation uniqueness across nodes. Put durable concurrency invariants in the database.

Bounded parallel example; supervisor is started in the application tree and limits come from validated configuration:

```elixir
Task.Supervisor.async_stream_nolink(MyApp.TaskSupervisor, items, &fetch/1,
  max_concurrency: limits.concurrency, timeout: limits.timeout_ms,
  on_timeout: :kill_task, ordered: false)
|> Enum.each(&record_result/1)
```

Handle both `{:ok, value}` and `{:exit, reason}` in `record_result/1`; use a durable job instead if completion must survive the request or node.

## Backpressure and memory

- Bound input size, active tasks, queue lengths, per-tenant work, query batches and retained results. Derive limits from CPU, memory, DB pool and downstream quotas; increasing concurrency can increase latency and memory.
- `cast` and ordinary sends do not offer automatic backpressure. Reject, defer or shed overload with an explicit admission policy; use demand-driven processing only if measured throughput requires a pipeline library.
- Observe `Process.info(pid, [:message_queue_len, :memory])`, `:erlang.memory/0`, scheduler utilization, DB checkout time and host RSS. Large binaries, ETS and native allocations require separate accounting; per-process GC does not bound total VM memory.
- Do not copy large assigns/state into task closures. Extract necessary values first. Stream file/body chunks with limits, close resources on completion/error and avoid retaining sub-binaries of large payloads unnecessarily.
- ETS is node-local, owned by a process and normally lost with its owner; define access mode, ownership/rebuild, size bounds, expiry and invalidation. Cachex is optional when its cache policy/expiry features justify a dependency; TTL alone is not a memory bound.
- Keep cache entries tenant/locale aware. Cache is disposable and never the authority for a booking, payment or signature. Choose PostgreSQL or another explicitly durable store for such state.

## Rust and other native work

| Boundary | Choose when | Required evidence |
|---|---|---|
| Pure Elixir | Work meets measured latency/cost budget | Representative baseline |
| Rustler NIF | Measured CPU hotspot, small stable API, in-VM risk accepted | Scheduler responsiveness, memory ownership, native tests |
| Supervised subprocess/Port | Local native tool needs process isolation | Framing, exit handling, limits and cleanup |
| Separate Rust HTTP service | Independent scaling/isolation or untrusted native dependency | Auth, versioned contract, timeouts, retries and reconciliation |

- A NIF runs inside the BEAM OS process. Rustler improves safe term/resource handling; it is not a sandbox. Native faults, unsafe libraries, aborts and allocation failures can still crash the VM or exhaust its memory.
- Keep ordinary NIFs very short (Erlang guidance is roughly a millisecond); use Rustler's `schedule = "DirtyCpu"` for longer CPU work, `DirtyIo` only for appropriate blocking I/O. Dirty schedulers are finite, not a solution for unlimited or uninterruptible work.
- Set input/output and native allocation limits, validate binaries, define resource lifetime and test concurrent calls. A BEAM timeout is not proof that native work stopped; use a subprocess/service when hard termination or crash isolation is required.
- Version request/result schemas, error categories, resource compatibility and native artifacts. Pin Rust toolchain/crates, target/ABI and supported OTP/NIF versions; test release loading on the production target, including precompiled artifact fallback policy if used.
- For subprocesses use executable + argument arrays, not shell-built user input; bound stdout/stderr, execution time, concurrency and child cleanup. For services enforce network/application authentication; a private address alone is not authorization.
- Read [Elixir testing](elixir-testing.md) for Cargo checks and real native integration checks. Do not introduce Rust for unmeasured speed or a universal claim that Elixir uses less memory than Node; compare representative resident memory, idle cost, p95 latency and throughput on equivalent infrastructure.

## Profiling and recovery

Use `mix profile.cprof`, `mix profile.eprof` or `mix profile.fprof` in an appropriate development/staging workload; account for profiler overhead. Use Observer in a permitted environment and targeted process inspection rather than dumping sensitive full state. Reproduce workload, warm-up and concurrency before comparing changes. Test child crashes, mailbox pressure, task timeout and node restart against durable business outcomes.

## Sources

Official references checked 2026-10-28:

- Consult [GenServer](https://hexdocs.pm/elixir/GenServer.html) and [Task.Supervisor](https://hexdocs.pm/elixir/Task.Supervisor.html) for process semantics.
- Consult [Erlang efficiency guidance](https://www.erlang.org/doc/system/efficiency_guide.html) and [Elixir debugging/profiling](https://hexdocs.pm/elixir/debugging.html) before optimizing.
- Consult [Rustler](https://hexdocs.pm/rustler/readme.html) and [Erlang NIF guidance](https://www.erlang.org/doc/system/nif.html) and [Rustler scheduling](https://docs.rs/rustler/latest/rustler/attr.nif.html) for native scheduling and VM safety.
