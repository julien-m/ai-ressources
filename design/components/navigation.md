# Navigation

Sidebar, action menus, tabs, bottom nav, breadcrumbs, and product tour patterns across breakpoints.

---

## Responsive Breakpoint Matrix

| Component | Desktop (>=1024px) | Tablet (768–1023px) | Mobile (<768px) |
|-----------|-------------------|---------------------|-----------------|
| **Sidebar** | Always visible, expanded (200–240px), fixed left, full height | Icon-only rail (56–64px) OR icon+condensed label (120–140px) — pick once, apply consistently | Hidden by default; hamburger trigger (top-left, 44x44px min); overlay drawer (slide-left, 80%/280px max, z-overlay 30) |
| **Action menu** | All actions as individual buttons in toolbar | Primary action visible + overflow `...` | Primary CTA visible + bottom sheet overflow (48–56px items) |
| **Tabs** | Standard horizontal, scrollable if overflow | Same as desktop | 2–3: full-width equal; 4+: scrollable horizontal with fade/dots; swipe between panels |
| **Breadcrumbs** | Full path with separator (`/` or `>`) | Same as desktop | Hide entirely OR back arrow + parent name only |
| **Bottom nav** | NEVER use on web desktop — mobile-only | N/A | 3–5 items (4 ideal); iOS: 49pt+safe area; Android: 80dp |

---

## Sidebar

### Desktop Structure

```
┌──────────────────────┐
│ [Workspace switcher] │  ← sticky top
│ [Search / Cmd+K]     │
├──────────────────────┤
│ [Nav item — active]  │
│ [Nav item]           │
│ [Nav item]           │
├──────────────────────┤
│ Section Group        │
│   [Nav item]         │
│   [Nav item]         │
├──────────────────────┤
│ Section Group        │
│   [Nav item]         │
│   [Nav item]         │
└──────────────────────┘
```

- Workspace switcher and search stay pinned at top (sticky)
- Section groups are collapsible with a disclosure chevron
- Active item: accent background or colored text — NEVER both simultaneously
- Hover: subtle background elevation (4–8% opacity tint)
- Width convention: 200–240px (Linear, Vercel, Stripe, Notion)

### Tablet Options

| Option | Width | Content | Expand behavior |
|--------|-------|---------|-----------------|
| **Icon-only rail** | 56–64px | Icons only | Tooltip on hover, expand on hover or click |
| **Icon + condensed label** | 120–140px | Small labels under or beside icons | No expand needed |

- Transition: smooth width animation (250ms ease-in-out)
- User can toggle collapsed/expanded (persist preference via localStorage or user settings)

### Mobile Drawer

| Property | Value |
|----------|-------|
| Trigger | Hamburger icon, top-left header (alt: top-right, less common) |
| Tap target | 44x44px minimum, dedicated space, NEVER overlapping other elements |
| Direction | Slides in from left |
| Z-index | `z-overlay` (30) — above content, below modals |
| Backdrop | `rgba(0,0,0,0.5)` covering content area |
| Width | 80% of screen or 280px max |
| Open/Close | Slide-in 250ms ease-out / Slide-out 200ms ease-in |

**Dismiss triggers**: tap nav item (navigates+closes), tap backdrop, swipe left, press Escape (keyboard).

### Scroll Behavior

- If nav items exceed viewport height: independent scroll (`overflow-y: auto`)
- Workspace switcher and search stay pinned (`position: sticky`)
- Custom scrollbar optional: thin (4–6px), visible on hover (WebKit: `::-webkit-scrollbar`)

---

## Action Menu — Responsive Collapse

**Desktop**: `[Filter v]  [Sort v]  [+ New item]  [Export]  [Settings]`
**Mobile**: `[+ New item]  [...]`

| Property | Desktop/Tablet | Mobile |
|----------|---------------|--------|
| Overflow button | `...` (three dots) or `kebab` icon | Same |
| Menu type | Dropdown, right-aligned | Bottom sheet (action sheet) |
| Item height | 36–40px | 48–56px (thumb-friendly) |
| Max items visible | 8–10 | 6–8 (scrollable beyond) |

### Collapse Priority

Define which actions remain visible (most important first) and which collapse into the overflow menu.

- Primary CTA (e.g., "+ New item") MUST NEVER be hidden in the overflow — visible at all breakpoints
- Destructive actions (delete, archive) always inside overflow — NEVER exposed as bare buttons on narrow screens
- Use CSS container queries or media queries to control collapse

---

## Tabs — Horizontal

### Anatomy

```
[Tab 1]  [Tab 2]  [Tab 3]                    [Optional action]
-------------------------------------------------------------
[Tab content]
```

| Property | Value | Notes |
|----------|-------|-------|
| Height | 40–48px | Consistent with header heights |
| Active indicator | 2px bottom border (accent) or filled pill background | Pick one per project |
| Active text | Bold or accent color | Not both — pick one |
| Inactive text | Secondary color | From color tokens |
| Hover | Subtle background (4–8% opacity tint) | |

- **Scrollable tabs**: horizontal scroll with fade edges if overflow (no wrapping)
- **Badge**: notification count (e.g., "Issues (12)") — secondary badge token
- **Icon + label** or **label only** — NEVER icon-only for tabs (too ambiguous)
- Mobile swipe: active indicator MUST move with the swipe (animated underline)

---

## Bottom Navigation (Mobile Native)

| Property | iOS | Android |
|----------|-----|---------|
| Items | 3–5 max (4 ideal) | 3–5 max (4 ideal) |
| Icon size | 24pt | 24dp |
| Label size | 10pt | 12dp |
| Bar height | 49pt + safe area inset | 80dp |
| Active state | Accent color icon + label | Accent color icon + label (M3: indicator pill) |
| Inactive state | Gray icon + label | Gray icon + label |

```
┌──────────────────────────────────────────┐
│  [Home]  [Search]  [+Add]  [Notif]  [Me]│
└──────────────────────────────────────────┘
```

- Center item (Create/Add) optionally emphasized (larger icon, FAB-style)
- **NEVER use on web desktop** — bottom nav is mobile-only
- Badge: small dot (unread) or count (up to "99+") on icon

---

## Breadcrumbs

```
Home  /  Projects  /  my-app  /  Settings
                                  ^^^^^^^^ current (not a link)
```

| Property | Value | Notes |
|----------|-------|-------|
| Separator | `/` or `>` (chevron right) | Pick one per project |
| Current page | Plain text, bold or accent | Not a link |
| Parent pages | Links, secondary color | Clickable |
| Height | 32–40px | |
| Font size | 13–14px | Smaller than body text |

**Truncation** (depth exceeds width): `Home  /  ...  /  Parent  /  Current` — show first item + `...` + last 2 levels.
**Mobile**: hide breadcrumbs entirely, or show only back arrow + parent name. Breadcrumbs are a desktop/tablet pattern.

---

## Product Tour / Onboarding Guide

### Guided Tour (Step-by-Step)

```
      ┌─────────────────────────────┐
      │ Step 2 of 5                 │
      │                             │
      │ This is your dashboard      │
      │ View your metrics and       │
      │ recent activity here.       │
      │                             │
      │ [Skip]           [Next ->]  │
      └─────────────────────────────┘
              v
      ┌──────────────────────┐
      │  HIGHLIGHTED ELEMENT │  ← Spotlight overlay
      └──────────────────────┘
```

| Property | Value |
|----------|-------|
| Spotlight | Dark overlay, cut-out around target, optional glow/pulse |
| Tooltip position | Auto: prefer top, fallback bottom/left/right |
| Progress | "Step X of Y" or dot indicator |
| Controls | "Next" (primary), "Skip" (ghost/text, always available), optional "Back" |
| Trigger | First-time user only (`tour_completed` in user prefs or localStorage) |
| Max steps | 5–7 (beyond that, fatigue — split into contextual tips) |
| Step transition | Spotlight moves with 300ms ease-in-out |
| Dismiss | Click outside or press Escape skips the tour |

- NEVER block interaction with highlighted element — user can click it to try it
- Store completion state per tour (users may have multiple tours for different features)

### Coachmarks (Lightweight Alternative)

| Property | Value |
|----------|-------|
| Indicator | Pulsing dot, 8–12px, accent color |
| On click | Opens tooltip with explanation |
| Persistence | Across sessions until interacted with or dismissed |
| Max simultaneous | 2–3 (cognitive overload beyond that) |

Use for: feature announcements, new UI elements, subtle guidance.

### Contextual Help

- `?` icon in section headers or near complex features
- Opens tooltip or links to documentation
- Always available (not just first-time) — different from tour

---

## General Navigation Rules

| Rule | Detail |
|------|--------|
| Responsive is mandatory | Web: mobile+tablet+desktop (3 breakpoints min). Native: phone+tablet (2 min). Exception: pure phone-only apps (rare, must be justified) |
| Sidebar position | ALWAYS LEFT — universal SaaS convention, do not innovate here |
| Active state | ALWAYS clearly visible — user MUST know where they are at all times |
| Breakpoint transitions | Smooth, no layout jump. Use CSS transitions on width changes |
| Persist preferences | Collapsed sidebar, selected tab, layout mode — remember via localStorage or user settings |
| Keyboard navigation | All nav items reachable via Tab. Active item via Enter/Space. Sidebar toggle via shortcut (e.g., `[` or `Cmd+\`) |

### Cross-Platform Comparison

| Pattern | iOS | Android | Web |
|---------|-----|---------|-----|
| Primary nav (phone) | Bottom tab bar | Bottom nav (M3) | Hamburger + drawer |
| Primary nav (tablet) | Sidebar or tab bar | Navigation rail (M3) | Sidebar (icon rail or expanded) |
| Primary nav (desktop) | Sidebar | Sidebar or nav rail | Sidebar (expanded) |
| Secondary nav | Segmented control / tabs | Tabs (M3) | Horizontal tabs |
| Back navigation | System back + nav bar | System back button | Breadcrumbs or back link |
| Search | Pull-down or nav bar search | Top app bar search icon | Cmd+K or search in sidebar |
