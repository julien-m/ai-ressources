# Buttons & Controls

Button variants, sizes, states, toggles, dropdowns, segmented controls, and chips.

## Button Variants

| Variant | Visual treatment | Use case | Limit |
|---------|-----------------|----------|-------|
| **Primary** | Filled, accent color, high contrast | Main CTA | 1 per view max |
| **Secondary** | Outlined border or subtle fill | Secondary actions alongside primary | No limit |
| **Ghost/Tertiary** | Text-only or transparent background | Toolbar actions, less important actions | No limit |
| **Destructive** | Red fill or red outlined | Delete, remove, revoke, disconnect | 1 per context |
| **Icon-only** | Square, same height as equivalent size | Compact actions (edit, copy, close) | Must have `aria-label` + tooltip |

### Variant Hierarchy
```
[■ Primary] [□ Secondary] [Ghost]  ◄── More prominent → Less ──►
[■ Destructive] — always visually distinct
[🔲 Icon-only] — always paired with tooltip
```
- Primary button draws the eye — never compete with two primaries in one view
- Destructive buttons should not also be primary-styled unless it is the sole CTA (e.g., "Delete account" confirmation)
- Ghost buttons in toolbars gain a subtle background on hover to confirm interactivity

## Size Matrix Reference

All button-like controls share a common size scale. Platform equivalents in parentheses.

| Size | Height | Pad H | Font | Icon | iOS (pt) | Android (dp) | Web (px) | Use case |
|------|--------|-------|------|------|----------|--------------|----------|----------|
| `sm` | 28–32px | 12px | 13px | 14px | 28 | 32 | 28–32 | Inline actions, table rows, compact UI |
| `md` | 36–40px | 16px | 14px | 16px | 34 | 40 | 36–40 | Default for most forms and dialogs |
| `lg` | 44–48px | 20–24px | 16px | 18px | 44 | 48 | 44–48 | Primary CTAs, hero sections, onboarding |

- Icon-only buttons are square: height = width (e.g., 36×36px for `md`)
- Border-radius: 6–8px (most SaaS apps), or `full` (999px) for pill-shaped CTAs

## Master States

Applies to all button variants (primary, secondary, ghost, destructive, icon-only).

| State | Visual treatment | Cursor | Notes |
|-------|-----------------|--------|-------|
| **Default** | Base variant appearance | `pointer` | — |
| **Hover** | Slightly lighter/darker bg (5–10% shift) | `pointer` | Web only — no hover on touch devices |
| **Active/Pressed** | Darker bg + `scale(0.98)` | `pointer` | Short duration (100ms), feels tactile |
| **Focus** | 2px outline, 2px offset, 3:1 contrast | — | Keyboard only (`:focus-visible`) |
| **Disabled** | 40% opacity, no bg shift | `not-allowed` | No hover effect, no click handler |
| **Loading** | Spinner replaces/precedes label, disabled | `not-allowed` | Width must not change (use `min-width`) |

### Focus Ring
```
2px offset → [ 2px ring → [ Button ] ]
```
- Color: accent or high-contrast from **Read** [`../tokens/colors.md`](../tokens/colors.md)
- Use `:focus-visible` (web) — not `:focus` — to avoid ring on mouse click
- Ring must have 3:1 contrast against surrounding background

### Loading State
```
[  Save  ] → [ ◌ Save ] (spinner before label) OR [ ◌ ] (spinner replaces label)
```
- Set `min-width` to button's default rendered width before entering loading state
- Always disable during loading — prevent double-submit. Spinner: 16px (matches icon slot)
- Never change label text to "Saving..." — the width shift is disorienting
- For long operations (>3s), consider progress indicator or background task notification

## Button Content
### Allowed Combinations
| Pattern | Example | Notes |
|---------|---------|-------|
| Icon + Label | `[+ Add item]` | Leading icon most common |
| Label only | `[Submit]` | Default for most actions |
| Icon only | `[✕]` | Requires `aria-label` + tooltip |
| Label + Badge | `[Notifications 3]` | Trailing badge/count |
| Label + Trailing indicator | `[Export ▾]` `[Docs ↗]` | Dropdown chevron or external link only |

### Forbidden
- Two icons (leading + trailing) — except dropdown chevron or external link indicator
- Icon trailing without semantic meaning — ↗ (external link) and ▾ (dropdown) are the only valid trailing icons
- Truncated labels — if the label doesn't fit, use a shorter label or icon-only
- Wrapped desktop CTA labels — keep primary CTA labels to 1-3 words or widen the button
- Duplicate CTA intent labels on one page — choose one label for each intent and reuse it

## Button Groups
### Horizontal Group
```
[Cancel]  8px  [  Save  ]  8px  [Delete]
 Ghost           Primary        Destructive
```
- Gap: 8px between buttons; no merged borders — each button visually independent
- Primary at trailing end (right in LTR); destructive separated or at opposite end
### Split Button
```
┌──────────────┬─────┐
│     Save     │  ▾  │  Primary action + dropdown trigger
└──────────────┴─────┘
```
- Dropdown offers alternatives: "Save as draft", "Save and close"
- 1px divider between action and chevron; chevron has its own hover/active state
## Toggles / Switches
### Anatomy
```
OFF: [●○○○○○○○○○○] Gray track, left thumb
ON:  [○○○○○○○○○○●] Accent track, right thumb
```
### Dimensions
| Platform | Width | Height | Thumb diameter |
|----------|-------|--------|---------------|
| iOS (`UISwitch`) | 51pt | 31pt | 27pt |
| Android (M3 Switch) | 52dp | 32dp | 24dp (off) / 28dp (on) |
| Web | 36–44px | 20–24px | 16–20px |

### States
| State | Track color | Thumb | Notes |
|-------|------------|-------|-------|
| Off | Gray (`neutral-300`) | Left | Default inactive |
| On | Accent color | Right | Active state |
| Disabled off | Gray at 40% opacity | Left, reduced opacity | Non-interactive |
| Disabled on | Accent at 40% opacity | Right, reduced opacity | Locked on |

### Rules
- Transition: **150ms ease-out** slide. Respect `prefers-reduced-motion` (instant change, no slide)
- Always paired with a visible label — never a standalone toggle without text
- Immediate effect: toggles apply instantly (no save button needed). If save step required, use a **checkbox** instead
- Tap target: entire row (label + toggle) should be tappable, not just the toggle
## Dropdowns / Select
### Trigger
```
┌──────────────────────────────────────┐
│  [Selected value]              [▾]   │
└──────────────────────────────────────┘
```
| Property | Value | Notes |
|----------|-------|-------|
| Height | Same as text inputs (40–48px web, 36pt iOS, 56dp Android) | Visual consistency with form fields |
| Trailing icon | Chevron ▾ | Rotates 180° when open (optional) |
| Content | Placeholder or selected value | Placeholder in muted color |
| Border | Matching form field borders | See **Read** [`forms.md`](forms.md) |

### Dropdown Menu
| Property | Value |
|----------|-------|
| Max visible items | 5–7, then scroll |
| Item height | 36–40px |
| Max width | Match trigger or content width (whichever larger) |
| Z-index | `z-dropdown` (10) |
| Shadow | `elevation-2` — subtle drop shadow |
| Border-radius | 8px |

### Item States
| State | Visual treatment |
|-------|-----------------|
| Default | No background |
| Hover | Subtle background (`neutral-100`) |
| Selected | Checkmark ✓ leading or accent background |
| Disabled | 40% opacity, not clickable |

### Grouped Items
```
┌──────────────────────────┐
│  RECENT                  │  ← uppercase, 11px, muted color, non-clickable
│  ○ Last week / ○ Last month
├──────────────────────────┤  ← 1px separator
│  CUSTOM                  │
│  ○ Custom range...       │
└──────────────────────────┘
```
- Separator between groups: 1px line or 8px spacing
- Search input at top when list has **10+ items** — always autofocused

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open menu / select item |
| `↑` / `↓` | Navigate items |
| `Escape` | Close menu |
| Type-ahead | Jump to matching item |
| `Home` / `End` | First / last item |

## Segmented Controls
### Anatomy
```
[ List ] [▓ Board ▓] [Calendar]  ← selected = filled accent
```
| Property | Value |
|----------|-------|
| Height | 32–36px |
| Segment padding | 12–16px horizontal |
| Options | 2–5 max |
| Selected | Filled accent or inverted background |
| Unselected | Ghost / transparent |
| Animation | Sliding indicator, 200ms ease-out |

### Platform Equivalents
| Platform | Component | Notes |
|----------|-----------|-------|
| iOS | `UISegmentedControl` / SwiftUI `Picker(.segmented)` | Native styling, system animations |
| Android | Material 3 `SegmentedButton` | Single-select or multi-select variants |
| Web | Custom — radio group with visual treatment | Use `role="radiogroup"` + `role="radio"` |

### Rules
- Use for: view modes (List/Board/Calendar), theme (Light/Dark/System), time periods
- Beyond 5 options: use **tabs** or **dropdown** instead
- Equal-width segments preferred — avoids layout shifts on selection change
- Each segment must have a clear, short label (1–2 words max)

## Chips / Pills / Tags
### Status Badges (Non-Interactive)
```
[● Active]  [● Pending]  [● Failed]  [ Draft ]
  Green       Orange        Red        Gray
```
| Property | Value |
|----------|-------|
| Height | 20–24px |
| Padding | 6–8px horizontal |
| Border-radius | `full` (999px) |
| Font size | 12px |
| Dot prefix | 8px circle, optional for emphasis |
| Colors | Semantic — see **Read** [`../tokens/colors.md`](../tokens/colors.md) |

### Interactive Chips
```
[React] (selectable, toggle on/off)    [TypeScript ✕] (removable, trailing ×)
```
| Property | Value |
|----------|-------|
| Height | 28–32px |
| Padding | 8–12px horizontal |
| Border-radius | `full` (999px) or 6px |
| Selected state | Accent background or accent border |
| Remove icon | 16px ×, trailing position |

### Use Cases
| Type | Behavior | Example |
|------|----------|---------|
| Filter chips | Toggle on/off, multi-select | Status filters, tag filters |
| Input chips | Removable, represent entered values | Email recipients, multi-select tags |
| Suggestion chips | Single tap to apply | Search suggestions, quick replies |
| Status badges | Non-interactive, display only | Order status, user role |

## General Rules
### Cursor & Touch Targets
- `pointer` on all interactive controls; `not-allowed` on disabled; `default` only on non-interactive (status badges, labels)
- Never use `default` arrow cursor on a clickable element

| Platform | Minimum touch target |
|----------|---------------------|
| iOS | 44 × 44pt |
| Android | 48 × 48dp |
| Web | 44 × 44px (WCAG), 48 × 48px (recommended) |

- If visual size < minimum (e.g., 28px icon button), extend hit area with padding or margin
- Mobile: minimum **12px gap** between adjacent touch targets; Web: minimum **8px gap**

### Disabled State Communication
- Never rely solely on color change — always combine: reduced opacity (40%), cursor `not-allowed`, optional tooltip explaining why ("Complete all required fields to continue")
- Remove from tab order (`tabindex="-1"`) or use `aria-disabled="true"` instead of `disabled` when tooltip needed (native `disabled` prevents tooltip hover)

## Checklist
- [ ] Only one primary button per view
- [ ] Primary and ghost buttons pass contrast on their actual background
- [ ] Loading state preserves button width
- [ ] Desktop CTA text stays on one line
- [ ] Icon-only buttons have `aria-label` and tooltip
- [ ] All icon-only buttons have `aria-label` and tooltip
- [ ] Button sizes match platform conventions (44pt iOS, 48dp Android, 44–48px web)
- [ ] Touch targets meet minimums even if visual size is smaller
- [ ] Focus ring visible on keyboard navigation (`:focus-visible`)
- [ ] Disabled buttons use opacity + cursor + optional tooltip (not color alone)
- [ ] Loading state preserves button width (use `min-width`)
- [ ] Toggles have visible labels and apply immediately (no save button)
- [ ] Dropdowns support keyboard navigation (arrows, escape, type-ahead)
- [ ] Dropdowns with 10+ items include a search input
- [ ] Segmented controls limited to 2–5 options
- [ ] Destructive buttons are visually distinct (red) and positioned intentionally
- [ ] See **Read** [`../quality/ui-rules.md`](../quality/ui-rules.md) for additional interaction rules
