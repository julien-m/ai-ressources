---
extends: [react]
---
# TanStack Rules (Delta)

> These rules complement [`react.md`](react.md) and [`javascript.md`](javascript.md). Covers TanStack Query v5, Router, and Start.
## Query v5
### Query Keys
- Always arrays: `['todos']`, `['todos', id]`, `['todos', { filter }]`
- Use `queryOptions()` factory for reusable, type-safe key+fn pairs:

```ts
export const todoQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['todos', id],
    queryFn: () => fetchTodo(id),
  });

// Usage
const { data } = useQuery(todoQueryOptions(id));
await queryClient.prefetchQuery(todoQueryOptions(id));
```
### State Naming
- `isPending` — no data yet (first load)
- `isLoading` — pending AND fetching (no cached data)
- `isFetching` — any background fetch in progress
- `gcTime` replaces `cacheTime` (v5 breaking change)
### Mutations
- Always invalidate related queries after mutation:

```ts
const mutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

- `onSuccess`/`onError` callbacks are for **mutations only** — never on `useQuery`
- Use `useMutationState` to track mutations without prop drilling
- Optimistic updates via `variables` field from pending mutations
### Configuration
- Set `staleTime` based on data volatility (default 0 = always stale)
- Use `QueryErrorResetBoundary` + `react-error-boundary` for error recovery
- `networkMode`: `'online'` (default), `'always'`, `'offlineFirst'`
- Never use `enabled` with `useSuspenseQuery` — it defeats the purpose

## Router
### File-Based Routing
- `src/routes/index.tsx` → `/`
- `src/routes/posts.$postId.tsx` → `/posts/:postId`
- `src/routes/_layout.tsx` → layout wrapper
- `src/routes/__root.tsx` → root layout (required)
- Route groups: `src/routes/_auth/` (prefix with underscore)
### Type-Safe Navigation
```ts
import { Link } from '@tanstack/react-router';

<Link to="/posts/$postId" params={{ postId: '123' }}>View Post</Link>
```
### Search Params
- Define with `validateSearch` for type-safe URL state
- Use `useSearch()` to read, `useNavigate()` to update
- Prefer search params over React state for shareable/bookmarkable UI state
### Data Loading
- Use `loader` for route data — runs before component renders
- Use `beforeLoad` for auth guards and redirects
- Loaders run on server (SSR) but on **client during navigation**

## Start
### Server Functions
- Use `createServerFn()` for server-side logic:

```ts
import { createServerFn } from '@tanstack/react-start';

const getUser = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return db.query.users.findFirst({ where: eq(users.id, data.id) });
  });
```

- Always validate inputs with Zod
- Wrap all server logic in `createServerFn()` — loaders run on client during navigation
### Middleware
- Composable: auth, logging, rate limiting
- Request middleware for all server requests
- Server function middleware for additional validation
### Configuration
- `tanstackStart()` must precede `@vitejs/plugin-react` in Vite config
- Never enable `verbatimModuleSyntax` — causes server bundle leakage
- Cloudflare: set `"main": "@tanstack/react-start/server-entry"` in `wrangler.jsonc`
### Query Integration
- Preload in loaders, consume with `useSuspenseQuery`:

```ts
export const Route = createFileRoute('/posts/$postId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postQueryOptions(params.postId)),
  component: PostPage,
});

function PostPage() {
  const { postId } = Route.useParams();
  const { data } = useSuspenseQuery(postQueryOptions(postId));
}
```

## Anti-Patterns
- No v4 function overloads — v5 requires object syntax only
- No `cacheTime` — renamed to `gcTime`
- No query callbacks (`onSuccess`/`onError`) on `useQuery`
- No `useEffect` + `fetch` — use Query or route loaders
- No manual cache updates when `invalidateQueries` suffices
