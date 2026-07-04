# Web Standards

Breakpoints, spacing, typography, z-index, performance, and PWA conventions for web applications.

---

## Breakpoints

Tailwind-aligned defaults. Mobile-first: use `min-width` media queries.

| Token | Width (px) | Typical device | Tailwind prefix |
|-------|-----------|----------------|-----------------|
| `xs` | 0–479 | Small phone | (default) |
| `sm` | 480–639 | Large phone | `sm:` |
| `md` | 640–767 | Small tablet | `md:` |
| `lg` | 768–1023 | Tablet / small laptop | `lg:` |
| `xl` | 1024–1279 | Laptop / desktop | `xl:` |
| `2xl` | 1280+ | Large desktop | `2xl:` |
- **Design for `xs` first**, enhance upward
- Container max-widths: 640, 768, 1024, 1280px (or custom per project)
- Avoid device-specific breakpoints — size classes are more resilient

## Margins & Content Width

| Viewport | Side margins (px) | Max content width | Notes |
|----------|-------------------|-------------------|-------|
| xs (0–479) | 16 | 100% | Full bleed with padding |
| sm (480–639) | 16–24 | 100% | Still fluid |
| md (640–767) | 24 | 640px | Start constraining |
| lg (768–1023) | 24–32 | 768px | Comfortable reading |
| xl (1024–1279) | 32–40 | 960–1024px | Centered container |
| 2xl (1280+) | auto | 1120–1280px | Max-width + auto margins |
- Reading text: max **65–75 characters per line** (~640–720px at 16px body)
- Use `max-width` + `margin: 0 auto` — never stretch text to full viewport
- Touch targets: minimum **48 × 48px** (WCAG 2.5.8). Adjacent targets: min **8px** gap. Desktop: smaller OK if hover feedback exists

## Landing And Marketing Layout Caps

- Use `min-height: 100dvh` for full-height sections, never `h-screen`, to avoid mobile browser chrome jumps.
- Hero top padding maxes at roughly 6rem on desktop. If the hero feels low, adjust type or media scale rather than adding more top padding.
- Desktop nav must fit one line and stay under 80px tall.
- Hero copy must fit in the first viewport with CTAs visible. Keep subtext under 20 words when possible.
- Logo walls and trust strips sit under the hero, not inside the hero stack.

## Spacing Scale

Base unit: **4px**. Matches Tailwind default scale.
| Token | Value (px) | Tailwind class | Use case |
|-------|-----------|----------------|----------|
| `0.5` | 2 | `gap-0.5` | Hairline |
| `1` | 4 | `gap-1` | Tight inline |
| `2` | 8 | `gap-2` | Icon-to-text |
| `3` | 12 | `gap-3` | Compact padding |
| `4` | 16 | `gap-4` | Standard padding |
| `6` | 24 | `gap-6` | Section padding |
| `8` | 32 | `gap-8` | Section separation |
| `10` | 40 | `gap-10` | Large gaps |
| `12` | 48 | `gap-12` | Hero spacing |
| `16` | 64 | `gap-16` | Page sections |

## Typography

### Web Type Scale
| Role | Size (px) | Weight | Line height | Use case |
|------|----------|--------|-------------|----------|
| Display | 48–64 | Bold | 1.1–1.2 | Hero headlines |
| H1 | 36 | Bold | 1.2 | Page title |
| H2 | 28–30 | Semibold | 1.25 | Section title |
| H3 | 24 | Semibold | 1.3 | Subsection |
| H4 | 20 | Medium | 1.35 | Card title |
| Body L | 18 | Regular | 1.5 | Long-form reading |
| Body M | 16 | Regular | 1.5 | Default body |
| Body S | 14 | Regular | 1.45 | Secondary text |
| Label | 14 | Medium | 1.4 | Buttons, form labels |
| Caption | 12 | Regular | 1.4 | Helper text, timestamps |
### System Font Stacks
```css
/* Sans-serif (default) */
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
/* Monospace */
font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
/* Serif */
font-family: "Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif;
```
- Use `rem` units for font sizes — respects user browser settings
- Base: `1rem = 16px` (browser default)
- Minimum readable text: **12px** (0.75rem)

## Z-Index Scale

Standardized layers prevent z-index wars.
| Token | Value | Use case |
|-------|-------|----------|
| `z-base` | 0 | Default content |
| `z-dropdown` | 10 | Dropdowns, popovers |
| `z-sticky` | 20 | Sticky headers, floating buttons |
| `z-overlay` | 30 | Sidebars, drawers |
| `z-modal` | 40 | Modals, dialogs |
| `z-toast` | 50 | Toasts, snackbars |
| `z-tooltip` | 60 | Tooltips |
| `z-max` | 9999 | Emergency override only |
- **Never use arbitrary z-index values** — always use the scale
- Stacking contexts reset z-index — `isolation: isolate` to create explicit contexts

## Performance Budgets (Core Web Vitals)
| Metric | Good | Needs improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| **TTFB** (Time to First Byte) | ≤ 800ms | ≤ 1.8s | > 1.8s |
- Reserve space for images/embeds to prevent CLS (`aspect-ratio` or explicit dimensions)
- Lazy load below-the-fold images: `loading="lazy"`
- Preload critical fonts and LCP images
- See [../quality/ui-rules.md](../quality/ui-rules.md) for visual non-regression rules

## Implementation Guardrails

- Use CSS Grid instead of flex percentage math for multi-column layouts.
- Declare mobile collapse behavior for every multi-column section.
- Keep z-index on the named scale. If layering becomes complex, create an isolated stacking context intentionally.
- Reserve media dimensions with `aspect-ratio`, width/height, or fixed containers before loading.

## PWA Considerations
- `theme-color` meta tag for browser chrome coloring
- `viewport-fit=cover` + `env(safe-area-inset-*)` for notch/island handling
- `display: standalone` in manifest for app-like experience
- Service worker for offline fallback — at minimum, cache the app shell
- `prefers-color-scheme` media query for automatic dark mode
- Web Share API (`navigator.share()`) for native-like sharing on mobile

## Cross-References
- Spacing tokens: [../tokens/spacing.md](../tokens/spacing.md)
- Typography tokens: [../tokens/typography.md](../tokens/typography.md)
- Color tokens: [../tokens/colors.md](../tokens/colors.md)
- Platform comparison: [../tokens/cross-platform.md](../tokens/cross-platform.md)
- Apple HIG: [apple-hig.md](apple-hig.md)
- Material Design: [material-design.md](material-design.md)
