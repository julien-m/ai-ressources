# Lists

Row anatomy, scroll patterns, empty states, swipe actions, and performance.

---

## List Row Anatomy & Heights

| Row type | iOS (pt) | Android (dp) | Web (px) | Content |
|----------|----------|--------------|----------|---------|
| Single-line | 44 | 56 | 48 | Title only |
| Two-line | 58–64 | 72 | 64 | Title + subtitle |
| Three-line | 76–88 | 88 | 80 | Title + subtitle + body |
| With thumbnail | 64–72 | 72 | 72 | Avatar/image + text |
| With large image | 88–96 | 88 | 88 | Prominent visual + text |

### Row Structure

```
┌──────────────────────────────────────────────┐
│ [Leading]  [Title]                [Trailing] │
│            [Subtitle]             [Accessory] │
│            [Body text]                        │
└──────────────────────────────────────────────┘
```

- Leading: avatar, icon, thumbnail, checkbox, or drag handle
- Trailing: chevron, badge, switch, timestamp, or action icon
- Minimum row height: **44pt** (iOS) / **48dp** (Android) for tappable rows
- Separators: full-width or inset (aligned to text, not leading icon)

## Pull-to-Refresh

| Platform | Implementation | Notes |
|----------|---------------|-------|
| iOS | `UIRefreshControl` / `.refreshable` (SwiftUI) | Native physics, always use system component |
| Android | `SwipeRefreshLayout` / Compose `pullRefresh` | Material indicator style |
| Web | Custom implementation | Not a browser standard — use a library or build carefully |

- Show a loading indicator — never refresh silently
- Disable if the list is in an error state (offer retry button instead)
- Haptic feedback on trigger point (iOS)

## Infinite Scroll & Pagination

| Pattern | When to use | Notes |
|---------|------------|-------|
| **Infinite scroll** | Feed-like content (social, activity) | Load next page when ~2 screens from bottom |
| **Load more button** | Search results, catalogs | User controls when to load more |
| **Paginated** | Data tables, admin interfaces | Page numbers, explicit navigation |

- Show a loading indicator at the bottom while fetching the next page
- Keep scroll position on new data load — never jump to top
- Handle reaching the end: hide loader, show "No more items"
- Retry on failure: show inline error with retry button, don't toast

## Empty States

Every list needs four empty states designed:

| State | When | Content |
|-------|------|---------|
| **First use** | No data yet, user just started | Illustration + explanation + CTA ("Add your first...") |
| **No results** | Search/filter returned nothing | "No results for [query]" + suggestions to adjust filters |
| **Error** | Network or server failure | Error message + retry button |
| **Offline** | No connectivity | "You're offline" + cached data if available |

- Empty states are **not blank screens** — always provide guidance
- Center vertically in the available space
- Icon or illustration: **64–120pt/dp/px** — large enough to be noticed
- CTA button if there's an action the user can take
- See [../quality/ui-rules.md](../quality/ui-rules.md) — missing empty state = bug

## Swipe Actions

| Platform | Direction | Convention |
|----------|-----------|-----------|
| iOS | Left swipe: destructive (delete) | Red background, trash icon |
| iOS | Right swipe: primary action (archive, pin) | Colored background, action icon |
| Android | Left/right: varies by app | Less standardized, often uses bottom sheet instead |
| Web | Not expected | Use inline action buttons or context menu |

- **Maximum 3 actions per swipe direction** (iOS guideline)
- Destructive actions require confirmation (swipe full-width or alert)
- Provide alternative access to swipe actions (long press, edit mode, or overflow menu)
- Swipe actions must be discoverable — first-time hint animation recommended

## Selection & Bulk Actions

| Pattern | When | Notes |
|---------|------|-------|
| Tap to select | Single selection (radio-like) | Checkmark accessory |
| Long press + tap | Multi-select (checkbox-like) | Enter edit mode, select additional with tap |
| Select all | Bulk operations | "Select All" in toolbar/header |
| Edit mode | iOS convention | "Edit" button → row reordering, deletion |

- Show a contextual toolbar with bulk actions (delete, move, share, export)
- Display selection count: "3 selected"
- "Done" or tap outside to exit selection mode
- Preserve selection on scroll — don't lose selections when rows recycle

## Performance

| Technique | Platform | Notes |
|-----------|----------|-------|
| **Cell recycling** | iOS (UITableView/UICollectionView) | Automatic with standard APIs |
| **RecyclerView** | Android | Mandatory for long lists |
| **Virtualization** | Web (react-window, TanStack Virtual) | Render only visible rows |
| **Lazy loading** | All | LazyVStack (SwiftUI), LazyColumn (Compose) |

- Never render 1000+ rows in the DOM (web) — virtualize
- Pre-calculate row heights when possible — avoids layout thrashing
- Skeleton screens during initial load (not spinners for list content)
- Image loading: lazy + placeholder + fade-in transition
- Debounce search-as-you-type: **300ms** minimum

## Checklist

- [ ] Row heights meet minimum tap target (44pt / 48dp / 48px)
- [ ] All four empty states are designed (first use, no results, error, offline)
- [ ] Pull-to-refresh uses native component (iOS/Android)
- [ ] Infinite scroll loads before user reaches the end
- [ ] Scroll position preserved on data load and back navigation
- [ ] Swipe actions have alternative access method (accessibility)
- [ ] Large lists use virtualization/recycling
- [ ] Skeleton screens for initial load, inline loader for pagination
- [ ] Selection mode has clear entry/exit and shows count

---

## Virtual Lists / Windowing

For lists with 100+ items, rendering all DOM nodes kills performance. Virtual lists render only visible items + a small buffer.

### When to Use

| Item count | Strategy | Notes |
|-----------|----------|-------|
| < 50 | Render all | No virtualization needed |
| 50–500 | Virtual list | Render visible + 5-10 buffer rows |
| 500–10,000 | Virtual list + pagination | Paginate at API level, virtualize within page |
| > 10,000 | Server-side pagination | Client-side virtualization alone is not enough |

### Implementation Rules
- **Fixed row height** (preferred): much simpler — all rows same height, position calculated by index × height
- **Variable row height**: requires measuring or estimating — use a height cache, re-measure on resize
- **Buffer**: render 5-10 rows above and below viewport to prevent blank flashes during fast scroll
- **Scroll position preservation**: when data updates (new items, filter change), maintain scroll position — never jump to top
- **Placeholder rows**: if data is loading for a visible range, show skeleton rows (same height as real rows)
- **Keyboard navigation**: arrow keys must work across virtual boundaries — pre-render the target row before focusing it

### Platform Libraries
| Platform | Library | Notes |
|----------|---------|-------|
| React | `@tanstack/react-virtual` (TanStack Virtual) | Most popular, supports variable heights |
| React | `react-window` | Lighter, fixed heights preferred |
| Vue | `vue-virtual-scroller` | Similar API to react-virtual |
| iOS | `UICollectionView` / `List` (SwiftUI) | Native virtualization built-in |
| Android | `LazyColumn` (Compose) / `RecyclerView` | Native virtualization built-in |

### Scroll Indicators
- Show a scrollbar thumb that represents total list height (even if only a fraction is rendered)
- Optional: "Showing X of Y items" counter at bottom or top
- Optional: alphabet scrubber for alphabetically sorted long lists (contacts pattern)

---

## Drag & Drop

Reordering items within a list, moving between columns (Kanban), or reorganizing hierarchical content.

### Visual Feedback

```
Before drag:
┌─────────────────────┐
│ ⠿ Item 1            │   ← Grip handle (6-dot icon)
├─────────────────────┤
│ ⠿ Item 2            │   ← cursor: grab
├─────────────────────┤
│ ⠿ Item 3            │
└─────────────────────┘

During drag:
┌─────────────────────┐
│ ⠿ Item 1            │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤   ← Drop zone indicator (dashed line or colored bar)
│ ⠿ Item 3            │
└─────────────────────┘
       ┌─────────────────────┐
       │ ⠿ Item 2            │   ← Ghost/dragged element (semi-transparent, follows cursor)
       └─────────────────────┘
```

### Mechanics
- **Grip handle**: 6-dot icon or drag handle on left side of row. Do NOT make the entire row draggable (conflicts with text selection and click)
- **Cursors**: `grab` on handle hover, `grabbing` during drag
- **Ghost element**: semi-transparent (50-70% opacity) clone of the dragged item, follows cursor/touch
- **Drop zone**: highlight where the item will land — use a 2px colored line between items, or highlight the target container (Kanban column)
- **Placeholder**: the original position shows an empty space (same height) or a dashed border
- **Animation**: items shift smoothly (200ms ease-out) to make room for the drop zone
- **Cancel**: press Escape to cancel drag, item returns to original position
- **Accessibility**: keyboard alternative — select item, use arrow keys to move, Enter to confirm position

### Touch Behavior
- **Long press** (300-500ms) to initiate drag on touch devices (prevents conflict with scroll)
- **Haptic feedback** on drag start (iOS: UIImpactFeedbackGenerator, Android: HapticFeedback)
- **Auto-scroll**: when dragging near top/bottom edge, scroll the container

### Platform Libraries
| Platform | Library | Notes |
|----------|---------|-------|
| React | `@dnd-kit/core` | Modern, accessible, supports multiple strategies |
| React | `react-beautiful-dnd` (deprecated) | Legacy, use dnd-kit instead |
| Vue | `vuedraggable` + Sortable.js | Standard for Vue |
| iOS | `.onDrag` / `.onDrop` (SwiftUI) | Native drag and drop |
| Android | `ItemTouchHelper` / Compose `detectDragGestures` | Native support |

---

## Selection Patterns

How users select one or multiple items in lists and tables.

### Selection Modes

| Mode | Trigger | Use case |
|------|---------|----------|
| Single click | Click on row | Navigate to detail / select one item |
| Checkbox | Click checkbox column | Multi-select for bulk actions |
| Shift+Click | Click first, Shift+Click last | Range selection (all items between) |
| Cmd/Ctrl+Click | Cmd+Click individual rows | Toggle individual selection (add/remove) |
| Select All | Checkbox in table header | Select all visible items (or all items with confirmation) |

### Visual Feedback
- Selected row: subtle accent background (e.g., `rgba(accent, 0.08)`) + checkbox filled
- Hover (not selected): very subtle background change (`rgba(0,0,0,0.02)` light / `rgba(255,255,255,0.02)` dark)
- Multi-select active: show bulk action bar (appears at top or bottom of table)

### Bulk Action Bar

```
┌──────────────────────────────────────────────────────────────┐
│ 12 items selected    [Change status ▾] [Delete] [Export]  [×]│
└──────────────────────────────────────────────────────────────┘
```

- Appears when ≥1 item is selected
- Shows count of selected items
- Provides bulk actions (contextual to the list type)
- "x" or "Clear selection" to deselect all
- Position: sticky top (below header) or sticky bottom
- Destructive actions (Delete): require confirmation modal with count ("Delete 12 items?")

### Select All — "All pages" Pattern
When user clicks "Select All" in header:
1. First click: select all visible items on current page
2. Show banner: "All 25 items on this page are selected. **Select all 1,247 items?**"
3. If user clicks "Select all 1,247": switch to server-side selection (send "all" flag to API, not individual IDs)

---

## Accordions / Collapsible Sections

Expandable content sections that show/hide detail.

### Anatomy

```
Collapsed:
┌──────────────────────────────────────────┐
│ ▶ Section title              [3 items]   │
└──────────────────────────────────────────┘

Expanded:
┌──────────────────────────────────────────┐
│ ▼ Section title              [3 items]   │
├──────────────────────────────────────────┤
│   Content line 1                         │
│   Content line 2                         │
│   Content line 3                         │
└──────────────────────────────────────────┘
```

### Behavior
- **Chevron icon**: collapsed → expanded (rotates 90 degrees with 200ms animation)
- **Click target**: entire header row is clickable (not just the chevron)
- **Animation**: content slides down/up with height animation (250ms ease-out). Use `max-height` transition or `grid-template-rows: 0fr → 1fr`.
- **Multiple open**: default behavior — multiple sections can be open simultaneously
- **Single open (accordion mode)**: opening one section closes others. Use when sections are mutually exclusive or screen space is limited.
- **Default state**: define per context — settings sections typically default open, FAQ sections default closed
- **Counter badge**: optionally show item count or summary in the header (e.g., "3 items", "2 errors")

### Nested Accordions
- Maximum nesting: 2 levels (section → subsection). Beyond 2 levels, use a tree view instead.
- Indent each level by 16-24px
- Different chevron styles per level help distinguish depth

### Keyboard
- Enter/Space: toggle expand/collapse
- Arrow Down: move to next section header
- Arrow Up: move to previous section header
- Home/End: jump to first/last section

---

## Advanced Table Patterns

Extensions to basic list/table layout for data-dense views.

### Column Sorting

```
NAME             STATUS     CREATED        AMOUNT
───────────────────────────────────────────────────
Jane Doe         ● Active   Mar 20, 2026   $1,234
John Smith       ○ Invited  Mar 19, 2026   $567
```

- **Sort indicator**: unsorted, ascending, descending — shown in the column header
- **Click to cycle**: unsorted → ascending → descending → unsorted
- **Single column sort** by default. Multi-column sort only if explicitly needed (power-user feature).
- **Sorted column**: subtle background tint on the entire column (optional, improves scanability)
- **Default sort**: most recent first (descending date) for time-based data, alphabetical for names

### Sticky Headers & Columns

- **Sticky header**: table header row stays visible when scrolling vertically (`position: sticky; top: 0`)
- **Sticky first column**: for wide tables with horizontal scroll, first column (usually name/identifier) stays pinned left
- **Shadow indicator**: subtle shadow on the sticky edge to signal that content scrolls behind it (e.g., `box-shadow: 2px 0 4px rgba(0,0,0,0.1)` on sticky column)
- **Z-index**: sticky header = `z-sticky` (20), intersection (header + first column) = +1 above both

### Column Resizing

- **Trigger**: drag the border between column headers
- **Cursor**: `col-resize` on hover over the border area (4-6px hit zone)
- **Minimum width**: each column has a minimum (typically 80-120px) to prevent content from becoming unreadable
- **Persist**: save column widths per user (localStorage or user settings)
- **Double-click**: auto-resize to fit content (shrink to widest cell value)

### Horizontal Scroll for Wide Tables

- When a table has too many columns for the viewport:
  - The table container scrolls horizontally (NOT the page)
  - First column stays sticky
  - Fade or shadow at the scroll edges to signal more content
  - Horizontal scrollbar visible (or scroll hint arrows on hover)
- **Mobile**: tables with 5+ columns → allow horizontal scroll with momentum scrolling. Consider an alternative layout (cards) for truly narrow screens.

### Row Expansion (Inline Detail)

```
│ Jane Doe    ● Active    Mar 20    $1,234    ▶ │
├─────────────────────────────────────────────────┤
│ John Smith  ○ Invited   Mar 19    $567      ▼ │
│ ┌─────────────────────────────────────────┐    │
│ │ Email: john@example.com                 │    │
│ │ Role: Member · Invited by @jane         │    │
│ │ Last login: Never                       │    │
│ └─────────────────────────────────────────┘    │
│ Alice M.    ● Active    Mar 18    $890      ▶ │
```

- Chevron in last column or first column to toggle expansion
- Expanded content appears as an inset row below (different background color, slightly indented)
- Only one row expanded at a time (default) or multiple (configurable)
- Animation: slide-down (200ms)
