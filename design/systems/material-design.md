# Material Design 3

Quick reference for Android layout, typography, color, elevation, shape, and component specs.

---

## Layout Grid

Base unit: **4dp**. All spacing and sizing should be multiples of 4.

### Breakpoints & Grid

| Breakpoint | Width (dp) | Columns | Margins (dp) | Gutters (dp) |
|------------|-----------|---------|--------------|--------------|
| Compact | 0–599 | 4 | 16 | 8 |
| Medium | 600–839 | 8 | 24 | 16 |
| Expanded | 840–1199 | 12 | 24 | 24 |
| Large | 1200–1599 | 12 | 24 | 24 |
| Extra-large | 1600+ | 12 | 24 | 24 |

- Use `WindowSizeClass` in Jetpack Compose for responsive layouts
- Compact = phone, Medium = foldable/small tablet, Expanded = tablet/desktop

## Tap Targets

- Minimum touch target: **48 × 48dp** — Material 3 requirement
- Visual element can be smaller (e.g., 24dp icon) if touch area is 48dp
- Minimum spacing between touch targets: **8dp**

## Spacing Tokens

| Value (dp) | Use case |
|-----------|----------|
| 4 | Tight inline gaps |
| 8 | Icon-to-text, related items |
| 12 | Compact padding |
| 16 | Standard padding, margins (compact) |
| 24 | Card body padding, section gaps |
| 32 | Large section separation |
| 48 | Hero spacing |
| 64 | Page-level separation |

## Typography — M3 Type Scale

All sizes in sp (scale-independent pixels). Font: Roboto (default) or custom via `MaterialTheme.typography`.

| Role | Size (sp) | Weight | Line height (sp) | Tracking (sp) |
|------|----------|--------|------------------|---------------|
| Display Large | 57 | Regular | 64 | −0.25 |
| Display Medium | 45 | Regular | 52 | 0 |
| Display Small | 36 | Regular | 44 | 0 |
| Headline Large | 32 | Regular | 40 | 0 |
| Headline Medium | 28 | Regular | 36 | 0 |
| Headline Small | 24 | Regular | 32 | 0 |
| Title Large | 22 | Regular | 28 | 0 |
| Title Medium | 16 | Medium | 24 | 0.15 |
| Title Small | 14 | Medium | 20 | 0.1 |
| Body Large | 16 | Regular | 24 | 0.5 |
| Body Medium | 14 | Regular | 20 | 0.25 |
| Body Small | 12 | Regular | 16 | 0.4 |
| Label Large | 14 | Medium | 20 | 0.1 |
| Label Medium | 12 | Medium | 16 | 0.5 |
| Label Small | 11 | Medium | 16 | 0.5 |

- Always use `MaterialTheme.typography.bodyMedium` etc. — never hardcode sizes
- Font scaling: Android respects system font size settings via sp units

## Dynamic Color & Color Scheme

Material 3 defines **29 color roles** in a scheme. Key roles:

| Role | Purpose |
|------|---------|
| `primary` | Key actions, FABs, active states |
| `onPrimary` | Content on primary surfaces |
| `primaryContainer` | Less prominent primary surfaces |
| `secondary` | Supporting actions, chips, toggles |
| `tertiary` | Complementary accents |
| `surface` | Backgrounds, cards |
| `surfaceVariant` | Differentiated surfaces |
| `onSurface` | Primary text/icons |
| `onSurfaceVariant` | Secondary text/icons |
| `error` | Error states |
| `outline` | Borders, dividers |
| `outlineVariant` | Subtle borders |
| `inverseSurface` | Snackbar, tooltip backgrounds |
| `scrim` | Modal overlay |

- **Dynamic Color** (Android 12+): scheme generated from user's wallpaper
- Always provide a fallback baseline scheme for older devices
- Use `dynamicColorScheme()` in Compose with `MaterialTheme(colorScheme = ...)`
- See [../tokens/colors.md](../tokens/colors.md) for the cross-platform color system

## Elevation & Surfaces

Material 3 uses **tonal elevation** (surface color shifts) instead of shadows.

| Level | Elevation (dp) | Use case |
|-------|---------------|----------|
| 0 | 0 | Background |
| 1 | 1 | Cards, navigation rail |
| 2 | 3 | FAB, elevated cards |
| 3 | 6 | Top app bar (scrolled), bottom sheets |
| 4 | 8 | Navigation drawer |
| 5 | 12 | Dialogs, menus |

- Higher elevation = lighter tint on surface color (in dark theme especially)
- Shadows still exist but are secondary to tonal shifts

## Shape Scale

| Category | Corner radius (dp) | Components |
|----------|-------------------|------------|
| None | 0 | — |
| Extra Small | 4 | Text fields, tooltips |
| Small | 8 | Chips, snackbars |
| Medium | 12 | Cards, dialogs |
| Large | 16 | FAB, navigation drawer |
| Extra Large | 28 | Bottom sheets, large FAB |
| Full | 50% | Badges, circular icons |

## Component Specs — Quick Reference

| Component | Height (dp) | Notes |
|-----------|------------|-------|
| Top app bar (small) | 64 | Standard |
| Top app bar (large) | 152 | Collapsing title |
| Bottom nav bar | 80 | With labels |
| Navigation rail | 80 (width) | Tablet/desktop side nav |
| FAB | 56 | Standard |
| FAB (small) | 40 | Compact |
| FAB (large) | 96 | Expanded |
| Button (filled) | 40 | Standard |
| List item (one-line) | 56 | Standard |
| List item (two-line) | 72 | With subtitle |
| List item (three-line) | 88 | With body text |
| Text field (filled) | 56 | Including label |
| Chip | 32 | Standard |
| Switch | 32 | Standard |
| Dialog | — | Min width 280, max 560 |
| Bottom sheet | — | Drag handle: 4dp × 32dp |

## Cross-References

- Spacing tokens: [../tokens/spacing.md](../tokens/spacing.md)
- Typography tokens: [../tokens/typography.md](../tokens/typography.md)
- Platform comparison: [../tokens/cross-platform.md](../tokens/cross-platform.md)
- Apple HIG: [apple-hig.md](apple-hig.md)
- Web standards: [web-standards.md](web-standards.md)
