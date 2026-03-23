# Buttons & Controls

Button variants, sizes, states, toggles, dropdowns, segmented controls, and chips.

---

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
┌─────────────────────────────────────────────────┐
│  [■ Primary]  [□ Secondary]  [  Ghost  ]        │
│  ◄── More prominent              Less ──►       │
│                                                  │
│  [■ Destructive]  — always visually distinct     │
│  [🔲 Icon-only]   — always paired with tooltip   │
└─────────────────────────────────────────────────┘
```

- Primary button draws the eye — never compete with two primaries in one view
- Destructive buttons should not also be primary-styled unless it is the sole CTA (e.g., "Delete account" confirmation)
- Ghost buttons in toolbars gain a subtle background on hover to confirm interactivity

## Button Sizes

| Size | Height (web) | Padding H | Font size | Icon size | Use case |
|------|-------------|-----------|-----------|-----------|----------|
| `sm` | 28–32px | 12px | 13px | 14px | Inline actions, table rows, compact UI |
| `md` | 36–40px | 16px | 14px | 16px | Default for most forms and dialogs |
| `lg` | 44–48px | 20–24px | 16px | 18px | Primary CTAs, hero sections, onboarding |

### Platform Equivalents

| Size | iOS (pt) | Android (dp) | Web (px) |
|------|----------|--------------|----------|
| Small | 28 | 32 | 28–32 |
| Medium | 34 | 40 | 36–40 |
| Large | 44 | 48 | 44–48 |

- Icon-only buttons are square: height = width (e.g., 36×36px for `md`)
- Border-radius: 6–8px (most SaaS apps), or `full` (999px) for pill-shaped CTAs

## Button States

| State | Visual treatment | Cursor | Notes |
|-------|-----------------|--------|-------|
| **Default** | Base variant appearance | `pointer` | — |
| **Hover** | Slightly lighter or darker background (5–10% shift) | `pointer` | Web only — no hover on touch devices |
| **Active/Pressed** | Darker background + `scale(0.98)` | `pointer` | Short duration (100ms), feels tactile |
| **Focus** | 2px outline, 2px offset, 3:1 contrast ratio | — | Keyboard navigation only (`:focus-visible`) |
| **Disabled** | 40% opacity, no background shift | `not-allowed` | No hover effect, no click handler |
| **Loading** | Spinner replaces or precedes label, button disabled | `not-allowed` | Width must not change (use `min-width`) |

### Focus Ring Anatomy

```
                  2px offset
              ┌──────────────────┐
              │ ┌──────────────┐ │
  2px ring →  │ │   Button     │ │
              │ └──────────────┘ │
              └──────────────────┘
```

- Focus ring color: accent color or high-contrast color from **Read** [`../tokens/colors.md`](../tokens/colors.md)
- Use `:focus-visible` (web) — not `:focus` — to avoid showing ring on mouse click
- Ring must have 3:1 contrast against surrounding background

### Loading State Rules

```
  Default         Loading
┌──────────┐    ┌──────────┐
│   Save   │ →  │ ◌  Save  │   spinner before label
└──────────┘    └──────────┘
                    OR
                ┌──────────┐
                │    ◌     │   spinner replaces label
                └──────────┘
```

- Set `min-width` equal to the button's default rendered width before entering loading state
- Disable the button during loading — prevent double-submit
- Spinner size: 16px (matches icon slot)
- Never change label text to "Saving..." — the width shift is disorienting

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

## Button Groups

### Horizontal Group

```
┌────────┐  8px  ┌────────────┐  8px  ┌────────┐
│ Cancel │       │    Save    │       │ Delete │
└────────┘       └────────────┘       └────────┘
  Ghost             Primary           Destructive
```

- Gap: 8px between buttons
- No merged borders — each button is visually independent
- Primary button positioned at the trailing end (right in LTR)
- Destructive button separated or at the opposite end from primary

### Split Button

```
┌──────────────┬─────┐
│     Save     │  ▾  │
└──────────────┴─────┘
  Primary action  Dropdown trigger (chevron)
```

- Primary action + dropdown trigger share a visual container
- Dropdown offers alternatives: "Save as draft", "Save and close"
- Separator: 1px divider between action and chevron
- Chevron section has its own hover/active state

## Toggles / Switches

### Anatomy

```
  OFF                      ON
┌──────────────┐     ┌──────────────┐
│ ●○○○○○○○○○○ │     │ ○○○○○○○○○○● │
└──────────────┘     └──────────────┘
  Gray track            Accent track
  Left thumb            Right thumb
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
| Off | Gray (`neutral-300`) | Left position | Default inactive |
| On | Accent color | Right position | Active state |
| Disabled off | Gray at 40% opacity | Left, reduced opacity | Non-interactive |
| Disabled on | Accent at 40% opacity | Right, reduced opacity | Locked on |

### Rules

- Transition: thumb slides with **150ms ease-out** animation
- Always paired with a visible label — never a standalone toggle without text
- Immediate effect: toggles apply instantly (no save button needed)
- If the action requires a save step, use a **checkbox** instead
- Tap target: the entire row (label + toggle) should be tappable, not just the toggle
- Respect `prefers-reduced-motion` — instant position change, no slide

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
| Max width | Match trigger width or content width (whichever is larger) |
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
│  RECENT                  │  ← Section label: uppercase, 11px, non-clickable
│  ○ Last week             │
│  ○ Last month            │
├──────────────────────────┤  ← 1px separator
│  CUSTOM                  │
│  ○ Custom range...       │
└──────────────────────────┘
```

- Section labels: uppercase, 11px font, muted color, non-clickable
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
┌─────────────────────────────────────┐
│  [  List  ] [▓ Board ▓] [Calendar] │
└─────────────────────────────────────┘
             ↑ Selected segment (filled)
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
  [● Active]   [● Pending]   [● Failed]   [  Draft  ]
    Green         Orange         Red          Gray
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
  ┌────────────────┐    ┌──────────────────┐
  │  React         │    │  TypeScript  ✕   │
  └────────────────┘    └──────────────────┘
    Selectable chip       Removable chip
    (toggle on/off)       (trailing × icon)
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

### Cursor

- `pointer` on all interactive controls — buttons, toggles, dropdowns, selectable chips
- `not-allowed` on disabled controls
- `default` only on non-interactive elements (status badges, labels)
- Never use `default` arrow cursor on a clickable element

### Touch Targets

| Platform | Minimum touch target |
|----------|---------------------|
| iOS | 44 × 44pt |
| Android | 48 × 48dp |
| Web | 44 × 44px (WCAG), 48 × 48px (recommended) |

- If visual size is smaller than the minimum (e.g., 28px icon button), extend the hit area with padding or margin
- Mobile: minimum **12px gap** between adjacent touch targets to prevent mis-taps
- Web: minimum **8px gap** between adjacent buttons

### Disabled State Communication

- Never rely solely on color change — always combine:
  - Reduced opacity (40%)
  - Cursor: `not-allowed`
  - Optional tooltip explaining why the control is disabled ("Complete all required fields to continue")
- Remove from tab order (`tabindex="-1"`) or use `aria-disabled="true"` instead of `disabled` attribute when tooltip is needed (native `disabled` prevents tooltip hover)

### Loading State

- Spinner: 16px, matching the icon slot
- Keep button width stable — set `min-width` before entering loading state
- Never change label text during loading ("Save" to "Saving..." causes width shift)
- Disable the button during loading to prevent double-submit
- For long operations (>3s), consider a progress indicator or background task notification

## Checklist

- [ ] Only one primary button per view
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
