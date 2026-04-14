# Spacing Tokens

Consistent spacing across iOS, Android, and Web. All values map to a shared semantic scale.

## Platform Base Units

|Platform|Unit|Base|Notes|
|--------|----|----|-----|
|iOS|pt|8pt|UIKit/SwiftUI layout unit|
|Android|dp|4dp|Density-independent pixel|
|Web|px|4px|CSS pixel (rem-based recommended)|

## Spacing Scale

Semantic tokens mapped to platform values. Use these names in code and design files.
|Token|iOS (pt)|Android (dp)|Web (px)|Use case|
|-----|--------|------------|--------|--------|
|`2xs`|2|2|2|Hairline gaps, icon-to-badge|
|`xs`|4|4|4|Inline icon-to-text, tight groups|
|`sm`|8|8|8|Related items within a component|
|`md`|12|12|12|Default padding inside components|
|`base`|16|16|16|Standard gap between components|
|`lg`|24|24|24|Section padding, card body|
|`xl`|32|32|32|Major section separation|
|`2xl`|40|40|40|Page-level vertical rhythm|
|`3xl`|48|48|48|Hero spacing, large gaps|
|`4xl`|64|64|64|Landing page sections|
|`5xl`|80|80|80|Max section separation|

## Screen Margins
|Context|iOS (pt)|Android (dp)|Web (px)|
|-------|--------|------------|--------|
|Phone portrait|16|16|16|
|Phone landscape|16|16|16|
|Tablet portrait|20|24|24–32|
|Tablet landscape|24|24|32–40|
|Desktop (<=1200px)|—|—|24–40|
|Desktop (>1200px)|—|—|auto (max-width container)|

## Component Internal Spacing
|Component|Horizontal padding|Vertical padding|Internal gap|
|---------|------------------|----------------|------------|
|Button|16–24|10–14|8 (icon-to-label)|
|Card|16|16|12 (between elements)|
|List row|16|12|8 (text-to-accessory)|
|Text input|12–16|12|4 (label-to-field)|
|Chip / tag|12|6|6 (icon-to-label)|
|Navigation bar|16|0 (height-defined)|8 (between items)|

## Vertical Rhythm
- Anchor vertical spacing to the **base unit** (8pt / 8dp / 8px) for visual consistency
- Headings: add `xl` (32) above, `md` (12) below
- Paragraphs: `base` (16) between blocks
- Form fields: `md` (12) between fields, `lg` (24) between field groups
- List rows: built into the row height — no extra vertical gap unless grouped
- Sections: `xl` (32) to `2xl` (40) between sections

## Guidelines
- Always use tokens, never magic numbers — makes platform-specific overrides trivial
- When in doubt, choose the **larger** spacing — whitespace is easier to reduce than to add
- Touch targets need adequate spacing even if visual spacing looks tight (see [cross-platform.md](cross-platform.md))
- Test spacing with Dynamic Type / font scaling enabled — tight spacing breaks first
