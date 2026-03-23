# Navigation

Sidebar, action menus, tabs, bottom nav, breadcrumbs, and product tour patterns across breakpoints.

---

## Sidebar — Responsive Behavior

### Desktop (>=1024px)

| Property | Value | Notes |
|----------|-------|-------|
| Visibility | Always visible, expanded | Icons + labels |
| Width | 200–240px | Convention from Linear, Vercel, Stripe, Notion |
| Position | Fixed left | Full viewport height |
| Active item | Accent background or colored text | Never both simultaneously |
| Hover | Subtle background elevation | 4–8% opacity tint |

#### Sidebar Structure

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
- Content: workspace switcher (top), search/Cmd+K, nav items, section groups

### Tablet (768–1023px)

Two options — project decides once, applies consistently:

| Option | Width | Content | Expand behavior |
|--------|-------|---------|-----------------|
| **Icon-only rail** | 56–64px | Icons only | Tooltip on hover, expand on hover or click |
| **Icon + condensed label** | 120–140px | Small labels under or beside icons | No expand needed |

- Transition: smooth width animation (250ms ease-in-out)
- User can toggle between collapsed/expanded (persist preference via localStorage or user settings)

### Mobile (<768px)

- **Hidden by default** — zero footprint when closed, not visible on initial page load

#### Trigger Button

| Property | Value | Notes |
|----------|-------|-------|
| Icon | Hamburger (three lines) or menu icon | Most common convention |
| Position | Top-left in header bar | Linear, GitHub, Notion pattern |
| Tap target | 44x44px minimum | Must have dedicated space, never overlapping other elements |

Alternative: top-right (less common, used by some apps).

#### Overlay Drawer

| Property | Value |
|----------|-------|
| Direction | Slides in from the left |
| Z-index | `z-overlay` (30) — above content, below modals |
| Backdrop | `rgba(0,0,0,0.5)` covering content area |
| Width | 80% of screen or 280px max |
| Open animation | Slide-in 250ms ease-out |
| Close animation | Slide-out 200ms ease-in |

#### Dismiss Triggers

- User taps a navigation item (navigates + closes)
- User taps the backdrop (outside the sidebar)
- User swipes left on the sidebar
- User presses Escape (if keyboard attached)

### Sidebar Scroll

- If nav items exceed viewport height, sidebar scrolls independently (`overflow-y: auto`)
- Workspace switcher and search stay pinned at top (`position: sticky`)
- Custom scrollbar styling optional: thin (4–6px), only visible on hover (WebKit: `::-webkit-scrollbar`)

---

## Action Menu — Responsive Collapse

### Wide Viewport (Desktop)

Actions displayed as individual buttons in the header/toolbar:

```
[Filter v]  [Sort v]  [+ New item]  [Export]  [Settings]
```

### Narrow Viewport (Tablet/Mobile)

Primary action stays visible, secondary actions collapse into overflow menu:

```
[+ New item]  [...]
```

| Property | Desktop/Tablet | Mobile |
|----------|---------------|--------|
| Overflow button | `...` (three dots) or `kebab` icon | Same |
| Menu type | Dropdown, right-aligned to button | Bottom sheet (action sheet pattern) |
| Item height | 36–40px | 48–56px (thumb-friendly) |
| Max items visible | 8–10 | 6–8 (scrollable beyond) |

### Collapse Priority

Define which actions remain visible (most important first) and which collapse. Use CSS container queries or media queries.

- **Rule**: the primary CTA (e.g., "+ New item") must NEVER be hidden in the overflow menu — it stays visible at all breakpoints
- Destructive actions (delete, archive) go inside overflow — never exposed as bare buttons on narrow screens

---

## Tabs — Horizontal

### Tab Anatomy

```
[Tab 1]  [Tab 2]  [Tab 3]                    [Optional action]
-------------------------------------------------------------
[Tab content]
```

| Property | Value | Notes |
|----------|-------|-------|
| Tab height | 40–48px | Consistent with header heights |
| Active indicator | 2px bottom border (accent) or filled pill background | Pick one style per project |
| Active text | Bold or accent color | Not both — pick one |
| Inactive text | Secondary color | From color tokens |
| Hover | Subtle background on the tab | 4–8% opacity tint |

- **Scrollable tabs**: if too many tabs for the container, horizontal scroll with fade edges (no wrapping)
- **Badge on tab**: notification count (e.g., "Issues (12)") — use secondary badge token
- **Icon + label** or **label only** — never icon-only for tabs (too ambiguous)

### Mobile Tabs

| Tab count | Behavior |
|-----------|----------|
| 2–3 tabs | Full-width, equal distribution |
| 4+ tabs | Scrollable horizontal with scroll indicator (fade edges or dots) |

- Swipe between tab panels on mobile (gesture navigation)
- Active indicator must move with the swipe (animated underline)

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

### Standard Item Pattern

```
┌──────────────────────────────────────────┐
│  [Home]  [Search]  [+Add]  [Notif]  [Me]│
└──────────────────────────────────────────┘
```

- Center item (Create/Add) optionally emphasized (larger icon, FAB-style)
- **Never use on web desktop** — bottom nav is mobile-only
- Badge: small dot (unread) or count (up to "99+") on icon

---

## Breadcrumbs

### Anatomy

```
Home  /  Projects  /  my-app  /  Settings
                                  ^^^^^^^^
                                  current (not a link)
```

| Property | Value | Notes |
|----------|-------|-------|
| Separator | `/` or `>` (chevron right) | Pick one per project |
| Current page | Plain text, bold or accent | Not a link |
| Parent pages | Links, secondary color | Clickable |
| Height | 32–40px | |
| Font size | 13–14px | Smaller than body text |

### Truncation

If depth exceeds available width:

```
Home  /  ...  /  Parent  /  Current
```

Show first item + `...` + last 2 levels.

### Mobile

- Hide breadcrumbs entirely, or show only a back arrow + parent name
- Breadcrumbs are a desktop/tablet pattern — on mobile, rely on back navigation

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
      │                      │  <- Spotlight overlay
      │  HIGHLIGHTED ELEMENT │     on target element
      │                      │
      └──────────────────────┘
```

| Property | Value |
|----------|-------|
| Spotlight | Dark overlay (rest of page), cut-out around target element, optional glow/pulse |
| Tooltip position | Auto: prefer top, fallback bottom/left/right |
| Progress | "Step X of Y" or dot indicator |
| Controls | "Next" (primary), "Skip" (ghost/text, always available), optional "Back" |
| Trigger | First-time user only (`tour_completed` in user prefs or localStorage) |
| Max steps | 5–7 (beyond that, fatigue — split into contextual tips) |
| Step transition | Spotlight moves with 300ms ease-in-out |
| Dismiss | Click outside or press Escape skips the tour |

- Never block interaction with highlighted element — user can click it to try it
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
| Responsive is mandatory | Web: mobile + tablet + desktop (3 breakpoints min). Native: phone + tablet (2 min). Exception: pure phone-only apps (rare, must be justified) |
| Sidebar position | Always LEFT — universal SaaS convention, do not innovate here |
| Active state | Always clearly visible — the user must know where they are at all times |
| Breakpoint transitions | Smooth, no layout jump. Use CSS transitions on width changes |
| Persist preferences | Collapsed sidebar, selected tab, layout mode — remember via localStorage or user settings |
| Keyboard navigation | All nav items reachable via Tab key. Active item via Enter/Space. Sidebar toggle via keyboard shortcut (e.g., `[` or `Cmd+\`) |

### Cross-Platform Comparison

| Pattern | iOS | Android | Web |
|---------|-----|---------|-----|
| Primary nav (phone) | Bottom tab bar | Bottom nav (M3) | Hamburger + drawer |
| Primary nav (tablet) | Sidebar or tab bar | Navigation rail (M3) | Sidebar (icon rail or expanded) |
| Primary nav (desktop) | Sidebar | Sidebar or nav rail | Sidebar (expanded) |
| Secondary nav | Segmented control / tabs | Tabs (M3) | Horizontal tabs |
| Back navigation | System back + nav bar | System back button | Breadcrumbs or back link |
| Search | Pull-down or nav bar search | Top app bar search icon | Cmd+K or search in sidebar |
