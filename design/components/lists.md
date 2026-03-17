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
