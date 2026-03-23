# Feedback & Indicators

Toasts, tooltips, confirmation patterns, skeleton loading, progress indicators, clipboard feedback, avatars, and dividers.

---

## Toasts / Snackbars

### Anatomy

```
┌──────────────────────────────────────────────┐
│ [Icon]  Message text              [Action] [x]│
└──────────────────────────────────────────────┘
```

- Icon: status indicator (checkmark, warning, error, info)
- Message: single line preferred, two lines max
- Action: optional text button (e.g., "Undo", "View", "Retry")
- Dismiss: x button or swipe away (mobile)

### Types

| Type | Icon | Color | Example |
|------|------|-------|---------|
| Success | Checkmark | Green accent | "Changes saved" |
| Error | X or warning | Red accent | "Failed to save. Try again." |
| Warning | Warning | Orange accent | "Your session expires in 5 minutes" |
| Info | Info circle | Blue accent | "New version available" |

### Behavior

| Property | Value | Notes |
|----------|-------|-------|
| Position (desktop) | Bottom-right | Linear/Stripe convention |
| Position (mobile) | Bottom-center | Full-width minus margins |
| Alternative position | Top-right | Vercel pattern |
| Duration (success/info) | 4-5s auto-dismiss | |
| Duration (error) | Persistent | Until user dismisses |
| Stacking | Max 3 visible | Newest on top, older pushed down or dismissed |
| Animation in | Slide-up + fade-in | 200ms |
| Animation out | Slide-down + fade-out | 150ms |
| Z-index | `z-toast` (50) | Above everything except tooltips |
| Width (desktop) | 280-480px | |
| Width (mobile) | Full-width minus margins | 16px margin each side |

- Action button: text style, no fill — "Undo", "View", "Retry"
- **Never use toast for critical errors that require user action** — use inline error or modal instead
- **Never stack more than 3** — oldest auto-dismisses when a 4th arrives

### Platform Implementation

| Platform | Component | Notes |
|----------|-----------|-------|
| iOS | Custom view or SPM library | No native toast — build or use a package |
| Android | `Snackbar` (Material 3) | Native component, supports action button |
| Web | Custom or library (sonner, react-hot-toast) | Use `role="status"` and `aria-live="polite"` |

---

## Tooltips

### When to Show

- **Mandatory**: icon-only buttons, truncated text, keyboard shortcuts on labeled buttons
- **Optional**: extra context on labeled buttons ("Cmd+K" on Search button)
- **Never**: on mobile (no hover) — use long-press or info icon instead

### Behavior

| Property | Value | Notes |
|----------|-------|-------|
| Show delay | 300ms | On hover |
| Hide delay | 150ms | On mouse leave |
| Focus trigger | Immediate | Keyboard focus shows instantly |
| Dismiss | Mouse leave, blur, Escape | |
| Position | Prefer top | Auto-reposition if clipped: top -> bottom -> right -> left |
| Arrow/caret | 6px triangle | Points to target element |
| Max width | 200-280px | |
| Font size | 12-13px | |
| Background | Inverted from theme | Dark tooltip on light, light on dark |
| Z-index | `z-tooltip` (60) | Highest layer |
| Animation in | Fade-in 150ms | |
| Animation out | Fade-out 100ms | |

- Content: text only, 1-2 lines max. For richer content, use a popover instead.
- Keyboard shortcut display: "Search Cmd+K" — command name + shortcut in same tooltip, shortcut in lighter color or `<kbd>` style

### Platform Behavior

| Platform | Trigger | Delay | Notes |
|----------|---------|-------|-------|
| Web | Hover + Focus | 300ms show, 150ms hide | Use `title` only as fallback |
| iOS | Long press or VoiceOver | Immediate on VO | Show as popover on long press |
| Android | Long press or TalkBack | 500ms | Material tooltip component |

---

## Confirmation Patterns

### Destructive Action Modal

```
┌───────────────────────────────────────┐
│ Delete workspace?                     │
│                                       │
│ This will permanently delete "My      │
│ Workspace" and all its data.          │
│ This action cannot be undone.         │
│                                       │
│ Type "My Workspace" to confirm:       │
│ ┌───────────────────────────────┐     │
│ │                               │     │
│ └───────────────────────────────┘     │
│                                       │
│              [Cancel]  [Delete]       │
│                            ^ Red      │
└───────────────────────────────────────┘
```

**Rules:**

- Destructive button: red, right-aligned
- Cancel: ghost/secondary, left of destructive
- Type-to-confirm: for high-severity actions (delete account, delete workspace) — user types the resource name
- Warning text: clearly state what will be lost and that it is irreversible
- **Never auto-focus the destructive button** — auto-focus Cancel or the text input

### Undo Pattern (Toast-based)

```
┌──────────────────────────────────────────┐
│ [check] Item archived            [Undo]  │
│   ████████░░░░░░ 5s                      │
└──────────────────────────────────────────┘
```

**When to use undo vs confirmation:**

| Pattern | When to use | Examples |
|---------|-------------|---------|
| **Undo** (preferred) | Reversible actions | Archive, move, mark as read, remove from list |
| **Confirmation modal** | Irreversible actions only | Delete permanently, revoke token, cancel subscription |

Undo is faster UX — action happens immediately, user can revert within a short window.

**Undo mechanics:**

- Toast with "Undo" action button
- Progress bar (5s countdown)
- Action is executed immediately but can be rolled back
- After timeout: toast disappears, action is finalized
- Clicking "Undo": action is reversed, toast updates to "Item restored"

---

## Skeleton Loading

### Anatomy

```
┌──────────────────────────────────────────┐
│ ████████░░░░░░░░░░░░░░░░░               │  <- Title placeholder
│ ██████████████░░░░░░░░░░░░░░░░░░░░░░░   │  <- Subtitle placeholder
│                                          │
│ ┌────────┐ ┌────────┐ ┌────────┐        │  <- Metric cards
│ │████░░░ │ │████░░░ │ │████░░░ │        │
│ │████████│ │████████│ │████████│        │
│ └────────┘ └────────┘ └────────┘        │
│                                          │
│ ████████████████░░░░░░░░░  ██░░ ██░░    │  <- Table row
│ ████████████████░░░░░░░░░  ██░░ ██░░    │  <- Table row
│ ████████████████░░░░░░░░░  ██░░ ██░░    │  <- Table row
└──────────────────────────────────────────┘
```

### Rules

- Shape matches the real content (text lines for text, circles for avatars, rectangles for images)
- **Animation**: shimmer/pulse effect — subtle left-to-right gradient sweep, 1.5s loop
- **Color**: neutral gray (`--color-surface-variant` or similar, 10-15% opacity over background)
- **Never mix skeleton and real content** in the same component — a card is either fully skeleton or fully loaded
- **Duration threshold**: if data loads in <200ms, do not show skeleton (avoid flash). Use a 200ms delay before showing.
- **Text placeholders**: rounded rectangles, varying widths (80%, 60%, 70%) to look natural
- **Image placeholders**: same aspect ratio as real images, with a subtle icon in center (optional)

### Platform Implementation

| Platform | Pattern | Notes |
|----------|---------|-------|
| Web | CSS shimmer animation | `background: linear-gradient(...)` animated with `@keyframes` |
| iOS | Redacted modifier (SwiftUI) or custom | `.redacted(reason: .placeholder)` |
| Android | Accompanist Placeholder (Compose) | Shimmer effect built-in |

---

## Progress Indicators

### Determinate Progress Bar

```
Label: 65% or "13 of 20"
┌──────────────────────────────────────────┐
│██████████████████████████░░░░░░░░░░░░░░░ │
└──────────────────────────────────────────┘
```

| Property | Value | Notes |
|----------|-------|-------|
| Height | 4-8px | |
| Border-radius | Full (pill shape) | |
| Fill color | Accent | Smooth animated transition on value change |
| Background | Surface-variant (gray) | |
| Label | Percentage or "X of Y" | Above or below the bar |

### Indeterminate Progress Bar

- Same height as determinate, but animated gradient sliding left-to-right continuously
- Use when total is unknown (uploading, processing)

### Stepper / Wizard

```
[1 check]---[2 *]---[3 o]---[4 o]
  Done       Active   Todo    Todo
```

| Element | Style | Behavior |
|---------|-------|----------|
| Completed step | Checkmark, accent color | Clickable (go back) |
| Active step | Filled circle, accent color, bold label | Current position |
| Future step | Empty circle, gray | Not clickable |
| Connector (completed) | Accent color line | Between completed steps |
| Connector (incomplete) | Gray line | Between incomplete steps |

- Mobile: horizontal scroll if 5+ steps, or show only current + adjacent steps
- Max steps: 3-7. If more, consider a different UX pattern (e.g., progress bar with labels)

### Spinner / Loading Indicator

| Size | Pixels | Use case |
|------|--------|----------|
| Small | 16px | Inline in buttons, fields |
| Medium | 24px | Section-level loading |
| Large | 40px | Page-level loading |

| Property | Value | Notes |
|----------|-------|-------|
| Animation | Rotation 600-800ms | Infinite, ease-in-out |
| Color | Accent or `currentColor` | Inherit from context |
| Use cases | Button loading, inline fetch, pull-to-refresh | |

- **Never use spinners for initial page load** — use skeleton instead
- Replace button label with spinner on loading state, keep button width stable

---

## Copy to Clipboard

### Trigger

- Click on a copy icon or "Copy" button adjacent to the content
- Or click directly on monospace text (IDs, tokens, URLs) — the whole field acts as trigger

### Feedback Sequence

```
[clipboard icon Copy]  ->  [check Copied!]  ->  (2s)  ->  [clipboard icon Copy]
```

| Property | Value | Notes |
|----------|-------|-------|
| Visual change | Icon: clipboard -> checkmark. Text: "Copy" -> "Copied!" | |
| Color flash | Brief green/accent | On the "Copied!" state |
| Revert duration | 2 seconds | Returns to default state |
| Animation | Smooth icon swap, fade 150ms | |
| Sound | None | Never add sound to clipboard operations |
| Fallback | Select text for manual copy | If Clipboard API is unavailable |

### Where to Use

Always provide copy buttons on monospace content:

- IDs (`pi_3xxx`)
- API tokens (`sk-prod-xxxx`)
- URLs
- Code snippets
- API keys
- CLI commands

---

## Avatars

### Sizes

| Size | Pixels | Use case |
|------|--------|----------|
| xs | 20-24px | Inline mentions, activity feeds, dense lists |
| sm | 28-32px | Comments, sidebar items, table rows |
| md | 40px | List items, card headers, team members |
| lg | 64-80px | Profile pages, settings, user detail |
| xl | 96-120px | Profile hero, onboarding |

### Shape

| Shape | Radius | Use case |
|-------|--------|----------|
| Circle | 50% | User avatars (universal convention) |
| Rounded square | 8px | Workspace/org logos, app icons |

### Fallback Priority

1. **User-uploaded image** — cropped to circle, `object-fit: cover`
2. **Initial(s) on colored background** — first letter of name, background color deterministic from name hash
3. **Generic silhouette icon** — last resort

### Avatar Groups / Stacks

```
[A1][A2][A3] +5
  ^overlap^
```

| Property | Value | Notes |
|----------|-------|-------|
| Overlap | -8px margin | Each avatar overlaps the previous |
| Border | 2px solid background color | Creates visual separation |
| Max visible | 3-5 faces | Then "+N" counter |
| "+N" counter | Same circle size, gray background, white text | |

### Presence Indicator

```
┌─────┐
│     │
│  A  │
│     ●  <- 8-10px dot at bottom-right
└─────┘
```

| State | Color | Notes |
|-------|-------|-------|
| Online | Green | Solid dot |
| Away | Yellow | Solid dot |
| Offline | Gray or absent | Hidden or dimmed dot |

- Border: 2px solid background color (matches avatar stack border pattern)

---

## Dividers / Separators

### When to Use Lines vs Spacing

| Pattern | When to use | Examples |
|---------|-------------|---------|
| **Line (1px border)** | Between heterogeneous items | Different content types, different sections |
| **Spacing only** | Between homogeneous items | Same type of card, same type of list row |

**Rule**: when in doubt, use spacing. Lines add visual noise.

### Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Color (light) | `--color-border` or `rgba(0,0,0,0.08)` | |
| Color (dark) | `rgba(255,255,255,0.08)` | |
| Height | 1px | Never thicker unless section divider |
| Section dividers | 2px weight, optionally with label | Heavier for major breaks |

### Full-width vs Inset

| Type | When to use | Alignment |
|------|-------------|-----------|
| **Full-width** | Major section breaks | Edge to edge |
| **Inset** | List items, within sections | Aligned to text start, not leading icon |

Inset dividers indent to match content padding — the line starts where the text starts, not where the row's leading icon starts. This is the convention across iOS and Material Design list components.
