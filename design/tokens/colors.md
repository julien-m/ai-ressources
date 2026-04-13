# Color Tokens

Semantic color system for light mode, dark mode, and accessibility compliance.

## Semantic Color Roles

Use semantic names, never raw hex values in components.
|Role|Purpose|Light example|Dark example|
|----|-------|-------------|------------|
|`background`|Page/screen base|`#FFFFFF`|`#121212`|
|`surface`|Cards, sheets, elevated containers|`#FFFFFF`|`#1E1E1E`|
|`surface-variant`|Secondary surfaces, grouped backgrounds|`#F5F5F5`|`#2C2C2C`|
|`on-surface`|Primary text on surfaces|`#1A1A1A`|`#E5E5E5`|
|`on-surface-variant`|Secondary/muted text|`#6B6B6B`|`#A0A0A0`|
|`primary`|Brand, key actions, links|`#0066FF`|`#4D94FF`|
|`on-primary`|Text/icon on primary color|`#FFFFFF`|`#FFFFFF`|
|`accent`|Secondary emphasis, toggles|`#7C3AED`|`#A78BFA`|
|`success`|Positive states, confirmations|`#16A34A`|`#4ADE80`|
|`warning`|Caution, non-blocking alerts|`#D97706`|`#FBBF24`|
|`error`|Destructive, validation errors|`#DC2626`|`#F87171`|
|`info`|Neutral informational|`#2563EB`|`#60A5FA`|
|`border`|Dividers, input borders|`#E5E5E5`|`#3A3A3A`|
|`border-focus`|Focused input ring|`#0066FF`|`#4D94FF`|
|`disabled`|Inactive controls|`#D4D4D4`|`#404040`|
|`on-disabled`|Text on disabled controls|`#A3A3A3`|`#6B6B6B`|

## Platform System Colors
### iOS (UIColor / SwiftUI Color)
|Semantic|UIColor|Notes|
|--------|-------|-----|
|Label|`.label`|Adapts to light/dark automatically|
|Secondary label|`.secondaryLabel`|Muted text|
|System background|`.systemBackground`|Primary background|
|Grouped background|`.systemGroupedBackground`|Table/list background|
|Tint|`.tintColor`|App accent color|
|Separator|`.separator`|Thin dividers|
|System red/green/blue|`.systemRed`, `.systemGreen`, `.systemBlue`|Semantic status colors|

### Android (Material 3)
|Semantic|M3 token|Notes|
|--------|--------|-----|
|Primary|`colorPrimary`|Brand color|
|On Primary|`colorOnPrimary`|Text/icon on primary|
|Surface|`colorSurface`|Card, sheet backgrounds|
|On Surface|`colorOnSurface`|Primary text|
|Error|`colorError`|Validation, destructive|
|Outline|`colorOutline`|Borders, dividers|
|Surface Container|`colorSurfaceContainer`|Elevated surfaces|

### Web
- Use CSS custom properties: `var(--color-primary)`, `var(--color-surface)`
- Toggle via `prefers-color-scheme` media query or class-based theme switching
- Tailwind: map tokens to `theme.colors` in config

## Dark Mode Rules
- **No pure black** (`#000000`) backgrounds — use `#121212` or similar dark gray
- **Reduce saturation** on vivid colors — bright colors on dark backgrounds cause eye strain
- **Tonal elevation**: lighter surfaces = higher elevation (instead of shadows)
- **Invert carefully**: not all colors flip — success green stays green, but lighter
- Shadows are invisible on dark backgrounds — use border or tonal difference instead
- Test dark mode independently — don't assume auto-inversion works

## WCAG Contrast Requirements
|Level|Normal text (>=16px)|Large text (>=18px bold / 24px)|UI components|
|-----|--------------------|-----------------------------|-------------|
|**AA**|**4.5:1**|**3:1**|**3:1**|
|AAA|7:1|4.5:1|—|
- **AA is the minimum** for all shipping products
- Check both light and dark mode independently
- Placeholder text must also meet **4.5:1** (often overlooked)
- Disabled elements are exempt from contrast requirements
- Tool: WebAIM Contrast Checker

## Opacity Scale
|Token|Value|Use case|
|-----|-----|--------|
|`opacity-0`|0%|Fully transparent|
|`opacity-5`|5%|Hover overlay on dark surfaces|
|`opacity-10`|10%|Pressed state overlay|
|`opacity-20`|20%|Disabled overlay, scrim light|
|`opacity-40`|40%|Medium scrim|
|`opacity-60`|60%|Heavy scrim, backdrop|
|`opacity-80`|80%|Near-opaque overlay|
|`opacity-100`|100%|Fully opaque|

## Checklist
- [ ] All text meets **AA contrast** in both light and dark modes
- [ ] Semantic tokens used everywhere — no raw hex in components
- [ ] Dark mode tested on real devices (screen brightness matters)
- [ ] Color is never the **only** indicator — combine with icons, text, or patterns
- [ ] Focus rings visible in both themes (see [../quality/ui-rules.md](../quality/ui-rules.md))
- [ ] Status colors (success/warning/error) tested for color blindness (protanopia, deuteranopia)
- [ ] Opacity tokens used for overlays — no hardcoded rgba values
