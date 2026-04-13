# Apple Human Interface Guidelines

Quick reference for iOS/iPadOS/macOS layout, typography, color, and component specs.

---

## Layout Grid & Margins

| Device | Width (pt) | Margins (pt) | Notes |
|--------|-----------|--------------|-------|
| iPhone SE | 375 | 16 | Smallest supported |
| iPhone 15 | 393 | 16 | Standard size |
| iPhone 15 Pro Max | 430 | 16 | Largest phone |
| iPad Mini | 744 | 20 | Compact tablet |
| iPad Air / Pro 11" | 820 | 20 | Standard tablet |
| iPad Pro 12.9" | 1024 | 20 | Large tablet |
- No fixed column grid — Apple uses flexible spacing with system margins
- `layoutMargins` in UIKit / `.padding(.horizontal)` in SwiftUI handle device-appropriate margins
- Readable content width: max **672pt** for text-heavy content on iPad

## Safe Areas

| Inset | iPhone (notch) | iPhone (Dynamic Island) | iPad | Notes |
|-------|---------------|------------------------|------|-------|
| Top | 44pt | 59pt | 24pt | Status bar + notch/island |
| Bottom | 34pt | 34pt | 20pt | Home indicator |
| Left/Right | 0pt (portrait) | 0pt (portrait) | 0pt | 44pt in landscape for notch devices |
- **Always respect safe areas** — never place interactive content behind insets
- Dynamic Island: avoid placing content that competes with the island's live activities
- Use `safeAreaInset` in SwiftUI, `safeAreaLayoutGuide` in UIKit

## Tap Targets

- Minimum: **44 × 44pt** — non-negotiable for all interactive elements
- Recommended: **48 × 48pt** for primary actions
- Spacing between targets: minimum **8pt** to prevent mis-taps
- Small visual elements (icons) can be smaller if the tappable area meets 44pt

## Spacing Scale & Bar Heights

Apple doesn't publish a formal token scale, but these are the most common values in HIG components:

| Value | Common use |
|-------|-----------|
| 4pt | Tight inline spacing |
| 8pt | Icon-to-text, related items |
| 12pt | List row internal padding |
| 16pt | Screen margins, card padding |
| 20pt | Grouped table section spacing |
| 24pt | Large section gaps |
| 32pt | Major section separation |

| Element | Height (pt) |
|---------|------------|
| Status bar | 44 (notch) / 59 (Dynamic Island) / 20 (legacy) |
| Navigation bar | 44 |
| Large title nav bar | 96 |
| Tab bar | 49 |
| Toolbar | 44 |
| Search bar | 36 (field) + padding |

## Typography — SF Pro / Dynamic Type

| Style | Size (pt) | Weight | Leading (pt) |
|-------|----------|--------|--------------|
| Large Title | 34 | Bold | 41 |
| Title 1 | 28 | Bold | 34 |
| Title 2 | 22 | Bold | 28 |
| Title 3 | 20 | Semibold | 25 |
| Headline | 17 | Semibold | 22 |
| Body | 17 | Regular | 22 |
| Callout | 16 | Regular | 21 |
| Subheadline | 15 | Regular | 20 |
| Footnote | 13 | Regular | 18 |
| Caption 1 | 12 | Regular | 16 |
| Caption 2 | 11 | Regular | 13 |
- These are **default** sizes — Dynamic Type scales them based on user preference
- SF Pro Display is used automatically above 20pt, SF Pro Text below
- Always use `UIFont.preferredFont(forTextStyle:)` or SwiftUI `.font(.body)` — never hardcoded sizes

## Color

### System Colors (adapt to light/dark automatically)
`systemRed`, `systemOrange`, `systemYellow`, `systemGreen`, `systemMint`, `systemTeal`, `systemCyan`, `systemBlue`, `systemIndigo`, `systemPurple`, `systemPink`, `systemBrown`
### Semantic Colors
| Role | UIColor | Notes |
|------|---------|-------|
| Primary text | `.label` | Adapts to both modes |
| Secondary text | `.secondaryLabel` | Muted |
| Tertiary text | `.tertiaryLabel` | Very muted |
| Primary background | `.systemBackground` | White / near-black |
| Secondary background | `.secondarySystemBackground` | Slightly elevated |
| Grouped background | `.systemGroupedBackground` | Table/settings background |
| Separator | `.separator` | Standard divider |
| Tint | `.tintColor` | App accent |
- **Always use semantic colors** — never hardcode hex values for standard UI
- See [../tokens/colors.md](../tokens/colors.md) for the cross-platform color system

## SF Symbols

- **6,000+ icons** available, designed to align with SF Pro text
- Use symbol rendering modes: monochrome, hierarchical, palette, multicolor
- Symbols scale automatically with Dynamic Type
- Prefer SF Symbols over custom icons for standard actions (share, edit, delete, search)
- Symbol weight should match the accompanying text weight

## Component Specs — Quick Reference

| Component | Height (pt) | Notes |
|-----------|------------|-------|
| List row (default) | 44 | Minimum for tappable rows |
| List row (subtitle) | 58–64 | Two-line content |
| Button (standard) | 50 | System rounded rect |
| Segmented control | 32 | Default height |
| Switch | 31 × 51 | Fixed system size |
| Text field | 36 | Single line |
| Action sheet option | 57 | Per row |
| Alert button | 44 | Per button row |

## Cross-References

- Spacing tokens: [../tokens/spacing.md](../tokens/spacing.md)
- Typography tokens: [../tokens/typography.md](../tokens/typography.md)
- Platform comparison: [../tokens/cross-platform.md](../tokens/cross-platform.md)
- Material Design: [material-design.md](material-design.md)
- Web standards: [web-standards.md](web-standards.md)
