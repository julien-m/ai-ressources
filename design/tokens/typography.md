# Typography Tokens

Type scales and font conventions across iOS, Android, and Web.

## Platform Font Defaults

|Platform|System font|Monospace|Serif fallback|
|--------|-----------|---------|--------------|
|iOS|SF Pro (Text/Display)|SF Mono|New York|
|Android|Roboto|Roboto Mono|Noto Serif|
|Web|system-ui stack|ui-monospace stack|Georgia, serif|
### Web System Font Stack
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

## Type Scale

Semantic roles mapped across platforms. Sizes in pt (iOS), sp (Android), px (Web).
|Role|iOS (pt)|Android (sp)|Web (px)|Weight|Use case|
|----|--------|------------|--------|------|--------|
|Display L|34|57|57|Bold|Hero, marketing|
|Display M|28|45|45|Bold|Feature headings|
|Display S|22|36|36|Bold|Page titles (large)|
|Heading L|22|32|32|Semibold|Page title|
|Heading M|20|28|28|Semibold|Section title|
|Heading S|17|24|24|Semibold|Card title|
|Title|17|22|20|Medium|Nav bar, list headers|
|Subtitle|15|16|16|Medium|Supporting heading|
|Body L|17|16|18|Regular|Long-form reading|
|Body M|15|14|16|Regular|Default body text|
|Body S|13|12|14|Regular|Secondary text|
|Label L|15|14|14|Medium|Button text, form labels|
|Label M|13|12|13|Medium|Tags, badges|
|Label S|11|11|12|Medium|Captions, timestamps|
|Caption|11|11|12|Regular|Helper text, footnotes|

## Line Height
|Platform|Rule|Typical ratio|
|--------|----|-------------|
|iOS|System-managed via Dynamic Type|~1.2× for headings, ~1.4× for body|
|Android|Material 3 defines explicit line heights per role|~1.15× headings, ~1.4× body|
|Web|Set explicitly in CSS|**1.25** headings, **1.5** body, **1.4** UI text|
- Never use `line-height: 1` on multi-line text
- Minimum line height for readability: **1.3×** on body text

## Font Weight Mapping
|Token|CSS value|iOS|Android|
|-----|---------|---|-------|
|Thin|100|.ultraLight|Thin|
|Light|300|.light|Light|
|Regular|400|.regular|Normal|
|Medium|500|.medium|Medium|
|Semibold|600|.semibold|SemiBold|
|Bold|700|.bold|Bold|
|Heavy|800|.heavy|ExtraBold|
|Black|900|.black|Black|

## Dynamic Type / Font Scaling
|Platform|Mechanism|Range|
|--------|---------|-----|
|iOS|Dynamic Type categories (xSmall → AX5)|~0.8×–3.5× default|
|Android|Font scale in accessibility settings|0.85×–2.0× default|
|Web|`rem` units + browser zoom + `prefers-reduced-data`|User-controlled|
- **Always use relative units** (`rem`, `sp`, Dynamic Type styles) — never fixed `px`/`pt`
- Test at **largest** accessibility size — layout must not break
- Long text at large sizes should wrap, never truncate critical content
- Ensure touch targets grow proportionally with text

## Best Practices
- Limit to **2–3 weights** per screen for visual hierarchy
- Heading + body is enough for most screens — avoid using all scale levels
- Monospace only for code, data tables, or numeric alignment
- Prefer **semibold** over bold for UI labels — less visual noise
- Minimum text size: **11pt** (iOS), **12sp** (Android), **12px** (Web)
- Test with real content — "Lorem ipsum" hides line-break problems
- See [colors.md](colors.md) for text contrast requirements
