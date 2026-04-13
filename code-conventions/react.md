---
extends: [javascript]
---

# React Rules (Delta)

> These rules complement [`javascript.md`](javascript.md). Only React-specific conventions are listed here.

## Component Design

- Prefer function components with hooks — no class components
- One component per file, named after the file (`user-card.tsx` → `UserCard`)
- Colocate component, types, and styles in the same directory
- Extract custom hooks when logic is reused across 2+ components
- Prefer composition over prop drilling — use children, render props, or context

## Hooks

- Follow the Rules of Hooks: top-level only, never conditional
- `useMemo` / `useCallback` only when needed: stabilizing references passed to memoized children, expensive computations, or after a measured performance problem — not by default on every value
- Custom hooks must start with `use` and encapsulate a single concern
- Prefer `useRef` for values that don't trigger re-renders (timers, DOM refs, previous values)
- Use `useId()` for accessible form labels — never generate IDs manually

## Re-render Prevention

- Move state down to the smallest component that needs it
- Lift expensive children above state changes via composition (children pattern)
- Split context providers by update frequency — avoid single giant context
- Avoid inline object/array/function creation in JSX props passed to memoized children or dependency arrays (creates new references every render)

```tsx
// BAD — new object every render, breaks React.memo on Chart
<Chart config={{ color: "red" }} />

// GOOD — stable reference (worthwhile when Chart is memoized or config is in a dependency array)
const chartConfig = useMemo(() => ({ color: "red" }), []);
<Chart config={chartConfig} />

// OK — inline prop is fine when the child is not memoized and there's no perf issue
<SimpleLabel style={{ color: "red" }} />
```

## Data Fetching

- Never fetch in `useEffect` for initial data — use framework loaders (Next.js, TanStack)
- Avoid sequential awaits (waterfalls) — parallelize with `Promise.all`
- Deduplicate requests with a cache layer (TanStack Query, SWR, or framework cache)

```tsx
// BAD — waterfall
const user = await getUser(id);
const posts = await getPosts(user.id);

// GOOD — parallel
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
```

## Event Handlers

- Name handlers with `handle` prefix: `handleClick`, `handleSubmit`
- Props callbacks use `on` prefix: `onClick`, `onSubmit`
- Never use anonymous arrow functions for complex handlers in JSX — extract to named functions
- Call `preventDefault()` on client-managed form submissions — not on forms using native submission (e.g., Next.js Server Actions)

## State Management

- Local state first (`useState`) — only escalate to context or external stores when needed
- Derive state from existing state instead of duplicating (`useMemo` over separate `useState`)
- Use `useReducer` for complex state transitions with multiple related fields
- Avoid syncing state between components — lift state up or use a shared store

## Error Boundaries

- Wrap route-level components with error boundaries
- Use `react-error-boundary` — provide `fallback` and `onReset`
- Never catch errors inside render — let them propagate to boundaries

## Keys

- Use stable, unique IDs for list keys — never array index (unless list is static and never reordered)
- Keys must be unique among siblings, not globally

## Performance

- Lazy-load heavy components with `React.lazy()` + `Suspense`
- Use `useTransition` for non-urgent state updates (search, filtering)
- Avoid deep component trees — flatten when possible
- Prefer SVG sprites or icon components over inline SVGs repeated in lists

## Anti-Patterns

- No `useEffect` for derived state — compute inline or `useMemo`
- No `useEffect` to sync parent/child state — restructure component hierarchy
- No `dangerouslySetInnerHTML` without sanitization
- No direct DOM manipulation (`document.querySelector`) — use refs
- No `forceUpdate` patterns — fix the state model instead
