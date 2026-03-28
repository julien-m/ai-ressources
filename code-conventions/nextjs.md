# Next.js Rules (Delta)

> These rules complement [`react.md`](react.md) and [`javascript.md`](javascript.md). Only Next.js App Router conventions are listed here.

## Architecture

- Use App Router (`app/` directory) — Pages Router is legacy
- Organize by route segments: `app/dashboard/settings/page.tsx`
- Colocate route-specific components in the route directory
- Shared components go in `src/components/`, shared utilities in `src/lib/`

## Server vs Client Components

- **Default is Server Component** — only add `'use client'` when needed (interactivity, hooks, browser APIs)
- Push `'use client'` boundary as low as possible in the tree
- Never import server-only code in client components
- Never pass non-serializable props (functions, classes, Date) from server to client
- Use `server-only` package to prevent accidental client imports of sensitive code

```tsx
// BAD — entire page is client
'use client';
export default function Dashboard() { ... }

// GOOD — only interactive part is client
export default function Dashboard() {
  return <ServerData><InteractiveWidget /></ServerData>;
}
```

## Data Fetching

- Fetch data in Server Components — not in client `useEffect`
- Use `async` Server Components for direct data access
- Parallelize independent fetches with `Promise.all` — avoid sequential waterfalls
- Use `React.cache()` or `unstable_cache` for request deduplication
- Server Actions (`'use server'`) for mutations — not for reads

## File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI (required for route to be accessible) |
| `layout.tsx` | Shared layout (persists across navigations) |
| `loading.tsx` | Suspense fallback for the route |
| `error.tsx` | Error boundary for the route |
| `not-found.tsx` | 404 UI for the route |
| `route.ts` | API endpoint (cannot coexist with `page.tsx`) |
| `template.tsx` | Like layout but re-mounts on navigation |

## Dynamic Routes

- `[slug]` — dynamic segment
- `[...slug]` — catch-all segment
- `[[...slug]]` — optional catch-all
- `(group)` — route group (no URL impact, for layout organization)

## Metadata

- Use `export const metadata` for static metadata
- Use `export async function generateMetadata()` for dynamic metadata
- Always include `title`, `description`, and Open Graph tags

## Error Handling

- `error.tsx` must be a Client Component (`'use client'`)
- `global-error.tsx` at app root catches layout-level errors
- Use `notFound()` function to trigger `not-found.tsx`
- Use `redirect()` for server-side redirects — throws internally, do not wrap in try/catch

## Image & Font Optimization

- Always use `next/image` — never raw `<img>` tags
- Provide `width` and `height` or use `fill` with a sized container
- Use `next/font` for font loading — eliminates layout shift
- Configure `priority` on above-the-fold images

## Caching & Revalidation

- `fetch()` in Server Components is cached by default
- Use `revalidatePath()` / `revalidateTag()` after mutations
- `export const revalidate = 3600` for time-based revalidation
- `export const dynamic = 'force-dynamic'` to opt out of caching

## Security

- Validate all Server Action inputs with Zod
- Never expose database queries or secrets in client components
- Use `headers()` and `cookies()` only in server context
- CSRF protection is built-in for Server Actions

## Anti-Patterns

- No `useEffect` for initial data fetching — use Server Components or loaders
- No API routes (`route.ts`) just to fetch data for your own pages — fetch directly
- No `getServerSideProps` / `getStaticProps` — those are Pages Router
- No manual `fetch('/api/...')` from Server Components — call the function directly
