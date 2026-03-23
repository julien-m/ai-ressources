# UI Visual Non-Regression Rules

Rules to catch before every deploy. If any of these break, it's a bug.

---

## Text

- Never truncate text unintentionally (`text-overflow: ellipsis` must be a deliberate choice, not a band-aid)
- Never let text overflow its container
- Never place text on a same-color or low-contrast background (WCAG minimum contrast ratio: **4.5:1**)
- Never use a fixed font size that breaks on small screens
- Always handle long content: a 40-character username, a product title with no spaces

## Layout / Overlap

- Never let two elements overlap unintentionally
- Never make a button or link unreachable (hidden behind another element, broken z-index)
- Never let an element escape the viewport horizontally
- Unintentional horizontal scroll = bug

## Missing States

What we rarely code but always happens:

- **Empty state** — empty list, no results, first-time use
- **Loading state** — skeleton or spinner, never a blank screen
- **Error state** — network down, API failure
- **Disabled state** — disabled button must be visually distinct
- **Extreme content** — 1 character vs 500 characters in the same component

## Images

- Never render an image without a fallback if it fails to load
- Preserve aspect ratio (no stretched or squashed images)
- Alt text always present

## Responsive / Mobile

- Never use a tap target smaller than **44pt** (iOS) / **48dp** (Android)
- Content must remain usable with the virtual keyboard open (inputs not hidden behind it)
- Respect safe areas (no content under the notch or home bar)
- Side margins on mobile (text must never touch the screen edge)

## Forms

- Label always visible (not just a placeholder that disappears on focus)
- Focus state always visible (outline, border — never invisible)
- Error message specific and positioned next to the relevant field
- Submit button disabled during submission (prevent double-submit)

## Animations / Motion

- Respect `prefers-reduced-motion` (disable or reduce animations)
- Never let an animation block interaction (button unreachable during a transition)
- No layout shift after load (CLS — content that "jumps")

## Dark Mode

- Never hardcode colors that break in dark mode (white background on a dark container)
- Shadows, borders and dividers must adapt to both themes
- Images and icons must remain legible in both modes (black logo on black background)

## Accessibility Beyond Contrast

- Never rely on hover-only interactions (tooltip, menu) — must work with touch and keyboard
- Logical focus order (tab order follows visual flow)
- Never use an icon alone without an accessible label (`aria-label` or tooltip)
- Respect `prefers-color-scheme` and `prefers-contrast`

## Modals / Dialogs

- Focus trap active (tab must not escape the modal)
- Body scroll locked while modal is open
- Closeable via Escape and backdrop click
- Focus restored to the trigger element on close

## Perceived Performance

- No content layout shift after load (reserve space for images, embeds, fonts)
- Page transitions without a white flash between routes
- Optimistic UI on frequent actions (like, toggle, save)

## Internationalization

- Layouts must hold when text expands 30–50% in translation (German is unforgiving)
- RTL support if applicable
- Localized date and number formats

## Mockup Fidelity

When a visual mockup or reference image exists (AI-generated or user-provided), treat it as an implementation spec — not inspiration.

- **Save mockups** in the repo (`docs/mockups/` or equivalent) as source of truth
- **Extract exact values** before coding: colors (hex), spacing (px), font sizes, font weights, line-heights, border radii, shadow values. Don't approximate — measure from the mockup
- **Describe layout precisely** when delegating CSS work: positions in px, sizes, colors, effects — not vague terms like "timeline with photos"
- **Include the mockup** (file path or pixel-precise description) in any subagent/teammate context that touches layout or CSS
- **Specify all viewports**: mobile layout AND desktop behavior (centering, max-width, breakpoints)
- **Define interaction states**: mockups are static — explicitly specify hover, active, focus, and disabled states for every interactive element. If the mockup doesn't show them, decide and document before implementing
- **Sanity-check AI-generated mockups**: AI mockups may show impossible layouts (overlapping elements, inconsistent spacing, text that doesn't fit). Identify and resolve conflicts before implementing — don't blindly reproduce a broken layout
- **Screenshot after implementation** (Playwright or equivalent) and compare visually to the mockup before marking a task complete
- **Match intensity of effects**: if the mockup shows a strong glow, implement a strong glow — don't default to subtle

## Responsive — Mandatory Rule

Responsiveness is NOT optional. Every application must support multiple form factors:

- **Web applications**: mobile (< 768px) + tablet (768–1023px) + desktop (≥ 1024px) — minimum 3 breakpoints
- **Native mobile applications**: phone + tablet — minimum 2 form factors
- **Exception**: phone-only apps (must be explicitly justified — rare in 2026)

No layout, component, or view may be designed for a single viewport only. If it works on desktop, it must degrade gracefully on mobile — and vice versa.

Breakpoints reference (Tailwind-aligned, mobile-first):

| Token | Range | Target |
|-------|-------|--------|
| xs | 0–479px | Small phone |
| sm | 480–639px | Large phone |
| md | 640–767px | Small tablet |
| lg | 768–1023px | Tablet / small laptop |
| xl | 1024–1279px | Laptop / desktop |
| 2xl | 1280+px | Large desktop |

## Cursors

Every interactive element must use the correct CSS cursor to signal its affordance:

| Element type | Cursor | Notes |
|-------------|--------|-------|
| Buttons, links, clickable cards | `pointer` | Hand icon — signals "this is clickable" |
| Text inputs, textareas | `text` | I-beam — signals "this is editable" |
| Selectable/copyable text | `text` | I-beam, even if not editable (allows selection) |
| Disabled buttons/controls | `not-allowed` | Slash circle — signals "this is not available" |
| Draggable elements | `grab` (idle), `grabbing` (active) | Signals drag-and-drop affordance |
| Resizable edges (columns, panels) | `col-resize` or `row-resize` | Signals resize affordance |
| Loading/processing | `wait` or `progress` | Signals system is working (use sparingly) |
| Default (non-interactive areas) | `default` | Arrow — signals "nothing to interact with here" |

**Rules:**
- Never use `default` (arrow) cursor on a clickable element — this is a common bug that confuses users
- Never use `pointer` on non-clickable text — this falsely suggests interactivity
- Draggable items: show `grab` on hover, switch to `grabbing` on mousedown
- Ensure cursor changes are consistent across all interactive components

## Scrollbars

Unintentional scrollbars are bugs. Audit scrollbar behavior for every component and view.

**Prevention:**
- Never let child elements overflow parent containers unintentionally
- Use `overflow: hidden` on containers that should not scroll, `overflow: auto` on containers that may scroll
- Never use `overflow: scroll` (always shows scrollbar) — prefer `overflow: auto` (shows only when needed)
- Test at multiple viewport sizes — a container that fits at 1440px may overflow at 1024px

**Styling (web):**
- Thin scrollbars: 6-8px width (use `scrollbar-width: thin` or WebKit pseudo-elements)
- Color: match theme (subtle gray, not default OS blue/gray)
- Show on hover/scroll only (`scrollbar-gutter: stable` to reserve space without showing)
- Mobile: hide custom scrollbars — use native momentum scrolling

**Audit checklist:**
- [ ] No horizontal scroll on any view (unless explicitly a horizontal scroll container like tabs or carousel)
- [ ] No double scrollbars (parent + child both scrolling vertically)
- [ ] Sidebar scrolls independently from main content
- [ ] Modal body scrolls if content overflows, but page behind does not
- [ ] Tables with many columns: horizontal scroll on the table container, not the page

## Alignment

Consistent alignment prevents visual chaos. Every element must be deliberately aligned.

**Text alignment:**
- Labels, titles, descriptions: **left-aligned** (LTR) or right-aligned (RTL)
- Numbers, prices, percentages: **right-aligned** in tables and columns (aligns decimal points)
- Center alignment: only for very short content (buttons labels, empty state messages, single-line headers)

**Vertical alignment within rows:**
- Single-line rows: **center vertically** (align-items: center)
- Multi-line rows (title + subtitle): **top-aligned** (align-items: flex-start)
- Icon + text: icon centered to first line of text, not to the whole text block

**Grid alignment:**
- All elements on the same row must share the same baseline or vertical center
- Cards in a grid: same height per row (use CSS Grid `auto-rows` or `align-items: stretch`)
- Form labels: consistent width (or consistent position — above or beside, not mixed)

**Common alignment bugs:**
- [ ] Buttons in a group are not the same height
- [ ] Avatar and text in a row are not vertically centered
- [ ] Table columns are not consistently aligned (mixing left and center)
- [ ] Cards in a grid have inconsistent heights (varying content length)

## Image Fitting

Images must always fit their container correctly. Never stretch, squash, or overflow.

**Object-fit rules:**

| Content type | object-fit | Behavior | Use case |
|-------------|-----------|----------|----------|
| Avatars, profile photos | `cover` | Fill container, crop edges | Always circular or square, cropped to center |
| Thumbnails, cards | `cover` | Fill container, crop edges | Product images, video thumbnails, hero images |
| Logos, illustrations | `contain` | Fit inside, preserve aspect ratio, may letterbox | Company logos, icons, SVG illustrations |
| Screenshots, diagrams | `contain` | Fit inside, preserve aspect ratio | Documentation, mockups, full-width previews |
| Background images | `cover` | Fill area, crop edges | Hero sections, cards with background image |

**Rules:**
- **Never distort aspect ratio** — `object-fit: fill` (the default) stretches. Always set `cover` or `contain`.
- **Always set dimensions** on image containers (width + height or aspect-ratio) to prevent CLS (layout shift)
- **Fallback**: if image fails to load, show a neutral placeholder (gray background + subtle icon or initial)
- **Border-radius**: avatars = 50% (circle), cards = match card border-radius, logos = 0 (sharp edges)
- **Lazy loading**: `loading="lazy"` for below-fold images, eager for above-fold/LCP images

## Truncation

Text that exceeds its container must be handled deliberately — never hidden without indication.

**Single-line truncation:**
```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```
- Use for: table cells, list item titles, sidebar labels, card titles
- **Always add tooltip on hover** showing the full text (mandatory — truncated text without tooltip is inaccessible)

**Multi-line clamping:**
```css
display: -webkit-box;
-webkit-line-clamp: 2; /* or 3 */
-webkit-box-orient: vertical;
overflow: hidden;
```
- Use for: card descriptions (2-3 lines), preview text, notification messages
- Add "Show more" link if full content is important

**Rules:**
- Never truncate essential identifiers (IDs, emails, dates) — these must always be fully visible or expandable
- Truncation is always a deliberate design choice, never an accident (as per existing Text rules)
- Test with extreme content: 5-character name AND 50-character name in the same component

## Dividers

**When to use lines vs spacing:**
- **Lines (1px border)**: between heterogeneous content (different sections, different content types)
- **Spacing only**: between homogeneous content (same type of list rows, same type of cards)
- **When in doubt**: use spacing. Lines add visual noise.

**Specifications:**
- Color: `--color-border` or `rgba(0,0,0,0.08)` (light mode) / `rgba(255,255,255,0.08)` (dark mode)
- Height: 1px — never thicker unless it's a named section divider
- Full-width: for major section breaks
- Inset (indented): for list items (indent matches content padding, not edge-to-edge)
