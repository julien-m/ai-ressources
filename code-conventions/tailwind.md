# Tailwind CSS v4 Rules (Delta)

> These rules complement [`javascript.md`](javascript.md). Only Tailwind v4-specific conventions are listed here.

## v4 Configuration

- No `tailwind.config.ts` — v4 uses CSS-first configuration
- Use `@tailwindcss/vite` plugin (not PostCSS) for Vite projects
- Start CSS with `@import "tailwindcss";`
- Use `@plugin` directive for plugins (not `@import`)
- `@apply` is deprecated in v4 — use utility classes directly

## CSS Variables & Theming

Define CSS variables at `:root` and `.dark`, then map to Tailwind via `@theme inline`:

```css
@import "tailwindcss";

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
  --primary: hsl(221.2 83.2% 53.3%);
  --primary-foreground: hsl(210 40% 98%);
  --destructive: hsl(0 84.2% 60.2%);
  --muted: hsl(210 40% 96.1%);
  --muted-foreground: hsl(215.4 16.3% 46.9%);
  --border: hsl(214.3 31.8% 91.4%);
  --ring: hsl(221.2 83.2% 53.3%);
  --radius: 0.5rem;
}

.dark {
  --background: hsl(222.2 84% 4.9%);
  --foreground: hsl(210 40% 98%);
  /* ... dark overrides ... */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}
```

## Critical Rules

- Wrap color values with `hsl()` only in `:root` / `.dark` declarations
- Never double-wrap: `hsl(var(--color))` is wrong — use `var(--color)` directly in utilities
- Never put `:root` or `.dark` inside `@layer base` blocks
- Never nest `.dark { @theme { } }` — not supported
- Never define theme colors in `tailwind.config.ts` — use CSS variables

## Layout

- Use `flex gap-*` instead of `space-x-*` / `space-y-*` (gap works with wrapping)
- Use `size-*` for equal width/height (e.g., `size-10` instead of `w-10 h-10`)
- Mobile-first: write base styles for mobile, add responsive modifiers (`md:`, `lg:`)
- Use `container mx-auto px-4` for page-level containers

## Utilities

- `truncate` instead of `overflow-hidden text-ellipsis whitespace-nowrap`
- `cn()` (from shadcn) for conditional class merging — never string concatenation
- Prefer `text-foreground/50` opacity syntax over separate opacity utilities
- Use `ring-*` for focus indicators, not `outline-*`

## Dark Mode

- Automatic via CSS variables — no manual `dark:` prefixes needed when using semantic tokens
- Only use `dark:` for cases not covered by CSS variables (e.g., images, media)
- Never hardcode color values — always reference semantic tokens

## Responsive Design

- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- Always mobile-first — base classes are mobile, modifiers add desktop overrides
- Use `max-*` breakpoints sparingly — prefer min-width approach

## Anti-Patterns

- No `@apply` in v4 — compose utilities in JSX
- No `tailwind.config.ts` for theme — use `@theme inline` in CSS
- No raw color values (`bg-blue-500`) — use semantic tokens (`bg-primary`)
- No `!important` via `!` prefix — fix specificity at the source
- No deeply nested `@layer` rules — keep CSS flat
