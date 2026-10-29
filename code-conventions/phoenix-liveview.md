---
extends: [phoenix]
---
# Phoenix LiveView Rules

## When to use

Choose LiveView for server-rendered interactive browser workflows when connected operation and server-owned UI state fit the product. Prefer a React/mobile API when independent frontend releases, rich offline interaction or native platform UI are requirements. LiveView can serve a mobile browser; it does not automatically produce native iOS/Android screens. Measure connection/memory cost before committing to a concurrency target.

## Lifecycle and state

- The initial HTTP render and connected mount are distinct executions. Keep `mount/3` repeatable; avoid duplicated side effects. Subscribe or start connection-dependent work only with `connected?(socket)`; unsubscribe/cleanup through owned lifecycle behavior.
- Keep durable business state in the database. Socket assigns are temporary and may disappear on disconnect/process failure/deploy; reload authorized state on mount/reconnect. Do not use a connected socket as the only record of a submitted booking/payment.
- Store minimal assigns, use function components for stateless reusable UI and LiveComponents only for meaningful component state/lifecycle. Use `assign_new` where appropriate and declare component attributes/slots.
- Use streams for large collections with stable DOM IDs, pagination and an explicit stream limit. Streams reduce retained collection state but do not automatically bound queries or browser DOM. Do not duplicate the complete collection in assigns.
- Avoid large captured socket/assigns in task closures. Pass only the needed IDs/values. Use `assign_async/3` or `start_async/3` and handle loading, success, failure, cancellation and stale completion; async helpers are not durable job execution.
- Do slow network/CPU work outside mount/event callbacks. Use Oban for work that must complete after disconnect; expose progress from persisted status. A reconnect may repeat a user command, so enforce idempotence in the context/database.

Illustrative async read; `scope` must already be authorized and the result bounded:

```elixir
assign_async(socket, :summary, fn ->
  {:ok, %{summary: Reports.summary(scope)}}
end)
```

## Security

- Authenticate in the HTTP pipeline and connected lifecycle (`on_mount`/mount). A Plug alone does not secure the stateful connection. `live_session` boundaries help navigation/session policy but do not authorize every event.
- Treat event params, URL params, hidden form fields and IDs as untrusted. Reauthorize the actor/tenant/resource in context operations for every mutation and sensitive read; hiding a button is not authorization.
- Handle logout, account suspension, role removal and tenant switch for existing sockets. Recheck permissions or disconnect invalidated sessions; never assume mount-time permissions remain valid indefinitely.
- Validate forms through changesets with explicit writable fields and enforce DB constraints at submit time. Keep server errors distinct from validation errors; report conflicts accessibly and let the user refresh/retry safely.
- Use HEEx escaping; never render untrusted text through `raw/1`. Restrict upload types, size and entry count; verify actual content and object ownership, scan if the product requires it, and clean abandoned uploads.
- Do not transmit secrets or unnecessary personal data in assigns rendered to the client, event payloads, PubSub messages or debug logs.

## User states and tests

- Render loading, empty, invalid, forbidden, conflict, disconnected/reconnecting and failed async states. Preserve user intent safely across recoverable errors; never indicate success before the authoritative write.
- Prefer stable `data-testid` selectors per shared testing rules. Test observable behavior with `live/2`, `element/2`, `render_click`, `render_change`, `render_submit`, patch/redirect assertions and `render_async` for async assigns/tasks.
- Cover disconnected render, connected access checks, tampered events, cross-tenant IDs, permission revocation, invalid forms and duplicate submission. Reconnect tests must verify persisted state, not merely reinsert assigns.
- Use LiveViewTest for server behavior; add browser tests for hooks, uploads, client JavaScript, actual disconnect/reconnect, accessibility and responsive layouts. Do not assume LiveViewTest executes JavaScript or proves browser rendering.
- Read [Elixir testing](elixir-testing.md) for sandbox ownership and task/mocking allowances before enabling concurrent tests.

## Sources

Official references checked 2026-10-28:

- Consult [LiveView security](https://hexdocs.pm/phoenix_live_view/security-model.html) for connection and event authorization.
- Consult [Phoenix.LiveView](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html) for lifecycle, streams and async operations.
- Consult [LiveViewTest](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveViewTest.html) for server-side testing capabilities and limitations.
