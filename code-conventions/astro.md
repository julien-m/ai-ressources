# Astro Rules (Delta)

> These rules complement [`javascript.md`](javascript.md). Only Astro-specific conventions are listed here. When using React islands, [`react.md`](react.md) rules apply inside those components.

## Architecture

- Use Astro for content-heavy sites: blogs, docs, marketing, changelogs — not for stateful apps
- Islands architecture: pages are static HTML by default, interactive components hydrate on demand
- Organize pages in `src/pages/` — file-based routing, each `.astro` or `.md` file becomes a route
- Colocate page-specific components in `src/components/` — shared layouts in `src/layouts/`

## Component Syntax

- `.astro` components: frontmatter (fenced by `---`) for server-side logic, template below for HTML
- Access props via `Astro.props` — destructure in frontmatter
- Use `<slot />` for composition (equivalent to React `children`)
- Named slots: `<slot name="header" />` with `<Fragment slot="header">`

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<article>
  <h1>{title}</h1>
  <slot />
</article>
```

## Client Directives (Hydration)

- **Default is zero JS** — components render as static HTML unless a `client:*` directive is added
- `client:*` directives only work on **framework components** (e.g., React, Vue, Svelte, Solid, Preact) imported into `.astro` files — not on `.astro` components themselves
- Push interactivity to the smallest possible island

| Directive | When it hydrates |
|-----------|-----------------|
| `client:load` | Immediately on page load |
| `client:idle` | After page is idle (`requestIdleCallback`) |
| `client:visible` | When component enters viewport |
| `client:media="(max-width: 768px)"` | When media query matches |
| `client:only="react"` | Client-only, no SSR (specify framework) |

- Prefer `client:idle` or `client:visible` over `client:load` for non-critical interactivity
- Never use `client:load` on below-the-fold components
- `client:only` skips SSR entirely — use only when the component depends on browser APIs at render time

## Routing

- `src/pages/index.astro` → `/`
- `src/pages/blog/[slug].astro` → `/blog/:slug`
- `src/pages/docs/[...slug].astro` → `/docs/*` (catch-all)
- Static routes always win over dynamic routes at the same depth
- Use `getStaticPaths()` for dynamic routes in static mode

```astro
---
export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
const { post } = Astro.props;
---
```

## Content Collections

- Define collections in `src/content.config.ts` with Zod schemas
- Query with `getCollection()` and `getEntry()` — type-safe by default
- Markdown/MDX content rendered via `render(entry)` from `astro:content` (not `entry.render()`)
- Use the content layer API for external data sources (CMS, APIs)

```ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

## Data Fetching

- Fetch data in component frontmatter (runs at build time in static mode, at request time in SSR)
- Use `getCollection()` / `getEntry()` for content collections — not raw file reads
- Parallelize independent fetches with `Promise.all` in frontmatter
- Never fetch data client-side for content that can be resolved at build time

## Rendering Modes

- `output: 'static'` (default) — full static site generation, all pages pre-rendered at build time
- `output: 'server'` — all pages server-rendered on demand by default
- Per-page control in server mode: `export const prerender = true` to pre-render specific pages at build time
- For mostly-static sites with a few SSR pages: use `output: 'server'` and set `prerender = true` on the majority of pages

## Server Islands

- Use `server:defer` on components to render them asynchronously outside the main page render
- Deferred islands do not block initial page load — the page ships with a placeholder, then fetches the island HTML
- Use for personalized or slow content (user avatar, recommendations, dynamic pricing)
- Works on both `.astro` components and framework components

```astro
---
import Avatar from "../components/Avatar.astro";
---
<!-- Renders async, doesn't block page -->
<Avatar server:defer />
```

## View Transitions

- Import `<ClientRouter />` from `astro:transitions` in layouts for SPA-like navigation
- Use `transition:animate` for entry/exit animations (`fade`, `slide`, `none`)
- Use `transition:name` for cross-page element morphing
- Use `transition:persist` to keep interactive islands alive across navigations

## Middleware

- Define in `src/middleware.ts` — runs on every route (both SSR and prerendered during build)
- Use `defineMiddleware()` from `astro:middleware`
- Chain middleware with `sequence()`
- Store request-scoped data in `Astro.locals` (typed via `env.d.ts`)

## Image Optimization

- Use `<Image />` from `astro:assets` — never raw `<img>` for local images
- Provide `width` and `height` or use `inferSize` for remote images
- Use `<Picture />` for art direction with multiple formats/sizes
- Configure `image.domains` for allowed remote image sources

## Integrations

- Add via `npx astro add <integration>` — auto-configures `astro.config.mjs`
- `@astrojs/react` — React islands (also `@astrojs/vue`, `@astrojs/svelte`, `@astrojs/solid-js`)
- `@astrojs/tailwind` — Tailwind CSS (auto-applies base styles)
- `@astrojs/mdx` — MDX support in content collections and pages
- `@astrojs/sitemap` — auto-generated sitemap from routes

## Environment Variables

- `import.meta.env.PUBLIC_*` — exposed to client-side code
- `import.meta.env.*` (without `PUBLIC_` prefix) — server-only, available in frontmatter
- `import.meta.env.DEV` / `import.meta.env.PROD` — build mode flags
- Never prefix secrets with `PUBLIC_` — they will be bundled into client JS

## Anti-Patterns

- No `client:load` on every component — defeats the purpose of islands architecture
- No React/Vue for purely static content — use `.astro` components (zero JS)
- No `useEffect` for data fetching inside islands — fetch in Astro frontmatter and pass as props
- No global state management (Redux, Zustand) across islands — islands are isolated by design
- No `Astro.glob()` for content collections — use `getCollection()` instead (glob is legacy)
- No inline `<script>` for logic that belongs in a component island
- No SSR mode for fully static sites — unnecessary server cost
