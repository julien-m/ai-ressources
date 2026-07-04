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

## Empty States Matrix

Every list needs four empty states designed:

| State | When | Content | Visual |
|-------|------|---------|--------|
| **First use** | No data yet, user just started | Explanation + CTA ("Add your first...") | Illustration |
| **No results** | Search/filter returned nothing | "No results for [query]" + suggestions to adjust filters | Icon |
| **Error** | Network or server failure | Error message + retry button | Error icon |
| **Offline** | No connectivity | "You're offline" + cached data if available | Offline icon |

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
### Selection Modes

| Mode | Trigger | Use case |
|------|---------|----------|
| Tap / single click | Click on row | Navigate to detail / select one item |
| Long press + tap | Long press to enter multi-select, then tap | Multi-select (checkbox-like) |
| Checkbox column | Click checkbox | Multi-select for bulk actions (tables) |
| Shift+Click | Click first, Shift+Click last | Range selection (all items between) |
| Cmd/Ctrl+Click | Cmd+Click individual rows | Toggle individual selection (add/remove) |
| Select All | Checkbox in header / "Edit" button | Select all visible items; iOS uses edit mode (Edit button → row reordering, deletion) |

### Visual Feedback
- Selected row: subtle accent background (`rgba(accent, 0.08)`) + checkbox filled
- Hover (not selected): very subtle background change (`rgba(0,0,0,0.02)` light / `rgba(255,255,255,0.02)` dark)
- Multi-select active: show bulk action bar at top or bottom

### Bulk Action Bar

```
┌──────────────────────────────────────────────────────────────┐
│ 12 items selected    [Change status ▾] [Delete] [Export]  [×]│
└──────────────────────────────────────────────────────────────┘
```

- Appears when ≥1 item is selected; shows count ("3 selected")
- Provides contextual bulk actions (delete, move, share, export)
- "x" or "Clear selection" to deselect all; position: sticky top or bottom
- Destructive actions (Delete): require confirmation modal with count ("Delete 12 items?")
- "Done" or tap outside to exit selection mode
- Preserve selection on scroll — don't lose selections when rows recycle

### Select All — "All Pages" Pattern
1. First click: select all visible items on current page
2. Show banner: "All 25 items on this page are selected. **Select all 1,247 items?**"
3. If user clicks "Select all 1,247": switch to server-side selection (send "all" flag to API, not individual IDs)

## Performance & Virtual Lists
| Item count | Strategy | Notes |
|-----------|----------|-------|
| < 50 | Render all | No virtualization needed |
| 50–500 | Virtual list | Render visible + 5-10 buffer rows |
| 500–10,000 | Virtual list + pagination | Paginate at API level, virtualize within page |
| > 10,000 | Server-side pagination | Client-side virtualization alone is not enough |

### Implementation Rules
- **Fixed row height** (preferred): simpler — position calculated by index x height
- **Variable row height**: requires measuring or estimating — use a height cache, re-measure on resize
- **Buffer**: render 5-10 rows above and below viewport to prevent blank flashes during fast scroll
- **Scroll position preservation**: maintain scroll position on data updates — never jump to top
- **Placeholder rows**: show skeleton rows (same height as real rows) for loading ranges
- Never render 1000+ rows in the DOM (web) — virtualize
- Pre-calculate row heights when possible — avoids layout thrashing
- Skeleton screens during initial load (not spinners for list content)
- Image loading: lazy + placeholder + fade-in transition
- Debounce search-as-you-type: **300ms** minimum

### Scroll Indicators
- Show a scrollbar thumb representing total list height (even if only a fraction is rendered)
- Optional: "Showing X of Y items" counter; alphabet scrubber for sorted long lists (contacts pattern)

## Drag & Drop

Reordering items within a list, moving between columns (Kanban), or reorganizing hierarchical content.
### Visual Feedback

```
┌─────────────────────┐
│ ⠿ Item 1            │  ← Grip handle (6-dot icon), cursor: grab
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤  ← Drop zone indicator (dashed line or 2px colored bar)
│ ⠿ Item 3            │
└─────────────────────┘
       ┌─────────────────────┐
       │ ⠿ Item 2            │  ← Ghost element (50-70% opacity, follows cursor)
       └─────────────────────┘
```

### Mechanics
- **Grip handle**: 6-dot icon on left side. Do NOT make the entire row draggable (conflicts with text selection and click)
- **Cursors**: `grab` on hover, `grabbing` during drag
- **Placeholder**: original position shows empty space (same height) or dashed border
- **Animation**: items shift smoothly (200ms ease-out); Escape cancels and returns to original position
- **Drop target**: highlight the target container (e.g., Kanban column) when dragging over it as an alternative drop indicator
- **Touch**: long press (300-500ms) to initiate (prevents scroll conflict); haptic feedback on start; auto-scroll near edges

## Accordions / Collapsible Sections
### Anatomy

```
Collapsed: ▶ Section title [3 items]
Expanded:  ▼ Section title [3 items]
             Content line 1
             Content line 2
```

### Behavior
- **Chevron**: rotates 90deg with 200ms animation on expand/collapse
- **Click target**: entire header row (not just chevron)
- **Animation**: height slide (250ms ease-out). Use `max-height` transition or `grid-template-rows: 0fr → 1fr`
- **Multiple open**: default. Single open (accordion mode) when sections are mutually exclusive or space is limited
- **Default state**: per context — settings default open, FAQ default closed
- **Counter badge**: optional item count or summary in header ("3 items", "2 errors")
- **Nested**: max 2 levels (section → subsection); beyond that, use tree view. Indent 16-24px per level. Different chevron styles per level help distinguish depth

## Advanced Table Patterns
### Column Sorting

```
NAME             STATUS     CREATED        AMOUNT
───────────────────────────────────────────────────
Maya Lee         ● Active   Mar 20, 2026   $1,234
Noah Kim         ○ Invited  Mar 19, 2026   $567
```

- Click to cycle: unsorted → ascending → descending → unsorted
- Sort indicator shown in the column header (▲/▼ arrow next to the sorted column name)
- Single column sort by default; multi-column only if explicitly needed (power-user feature)
- Sorted column: optional subtle background tint (improves scanability)
- Default sort: most recent first for time-based data, alphabetical for names

### Sticky Headers & Columns
- **Sticky header**: `position: sticky; top: 0` — stays visible on vertical scroll
- **Sticky first column**: pinned left for wide tables with horizontal scroll
- **Shadow indicator**: subtle shadow on sticky edge (`box-shadow: 2px 0 4px rgba(0,0,0,0.1)`)
- **Z-index**: sticky header = `z-sticky` (20), intersection (header + first column) = +1

### Column Resizing
- Drag border between column headers; cursor: `col-resize` (4-6px hit zone)
- Minimum width per column: 80-120px to prevent unreadable content
- Persist column widths per user (localStorage or user settings)
- Double-click: auto-resize to fit content (shrink to widest cell value)

### Horizontal Scroll for Wide Tables
- Table container scrolls horizontally (NOT the page); first column stays sticky
- Fade or shadow at scroll edges to signal more content; scrollbar visible
- **Mobile**: 5+ columns → horizontal scroll with momentum. Consider card layout for narrow screens

### Row Expansion (Inline Detail)

```
│ Maya Lee    ● Active    Mar 20    $1,234    ▶ │
├─────────────────────────────────────────────────┤
│ Noah Adler  ○ Invited   Mar 19    $567      ▼ │
│ ┌─────────────────────────────────────────┐    │
│ │ Email: noah@north.co                    │    │
│ │ Role: Member · Invited by @maya         │    │
│ │ Last login: Never                       │    │
│ └─────────────────────────────────────────┘    │
│ Alice M.    ● Active    Mar 18    $890      ▶ │
```

- Chevron in last or first column to toggle; expanded content as inset row (different background, indented)
- Default: one row expanded at a time (configurable for multiple)
- Animation: slide-down (200ms)

## Keyboard Navigation Reference
| Context | Keys | Action |
|---------|------|--------|
| Accordions | Enter / Space | Toggle expand/collapse |
| Accordions | Arrow Down / Up | Move to next/previous section header |
| Accordions | Home / End | Jump to first/last section |
| Drag & Drop | Arrow keys (after select) | Move item up/down |
| Drag & Drop | Enter | Confirm new position |
| Drag & Drop | Escape | Cancel drag, return to original position |
| Virtual lists | Arrow keys | Must work across virtual boundaries — pre-render target row before focusing |

## Libraries by Platform & Pattern
| Pattern | Platform | Library | Notes |
|---------|----------|---------|-------|
| Virtualization | React | `@tanstack/react-virtual` | Most popular, supports variable heights |
| Virtualization | React | `react-window` | Lighter, fixed heights preferred |
| Virtualization | Vue | `vue-virtual-scroller` | Similar API to react-virtual |
| Virtualization | iOS | `UICollectionView` / `List` (SwiftUI) | Native, built-in |
| Virtualization | Android | `LazyColumn` (Compose) / `RecyclerView` | Native, built-in |
| Drag & Drop | React | `@dnd-kit/core` | Modern, accessible, multiple strategies |
| Drag & Drop | React | `react-beautiful-dnd` (deprecated) | Legacy, use dnd-kit instead |
| Drag & Drop | Vue | `vuedraggable` + Sortable.js | Standard for Vue |
| Drag & Drop | iOS | `.onDrag` / `.onDrop` (SwiftUI) | Native drag and drop |
| Drag & Drop | Android | `ItemTouchHelper` / Compose `detectDragGestures` | Native support |
| Cell recycling | iOS | `UITableView` / `UICollectionView` | Automatic with standard APIs |
| Cell recycling | Android | `RecyclerView` | Mandatory for long lists |
| Lazy loading | iOS | `LazyVStack` (SwiftUI) | Native lazy rendering |
| Lazy loading | Android | `LazyColumn` (Compose) | Native lazy rendering |

## Checklist

- [ ] Row heights meet minimum tap target (44pt / 48dp / 48px)
- [ ] All four empty states designed (first use, no results, error, offline)
- [ ] Pull-to-refresh uses native component (iOS/Android)
- [ ] Infinite scroll loads before user reaches the end
- [ ] Scroll position preserved on data load and back navigation
- [ ] Swipe actions have alternative access method (accessibility)
- [ ] Large lists use virtualization/recycling
- [ ] Skeleton screens for initial load, inline loader for pagination
- [ ] Selection mode has clear entry/exit and shows count
