# Accessibility

Accessibility patterns for web and native applications. WCAG 2.2 AA compliance, ARIA, keyboard navigation, focus management, screen readers.

For visual non-regression rules that complement this file, see **Read** [`ui-rules.md`](ui-rules.md).

---

## WCAG 2.2 AA Quick Reference

Focus on the criteria SaaS applications most commonly violate. For full criterion descriptions, see [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa#principle1).

### Perceivable

| Criterion | Level | What it means | Common violation |
|-----------|-------|---------------|------------------|
| 1.1.1 Non-text Content | A | All non-text content has a text alternative | Missing `alt` on images, unlabeled icon buttons |
| 1.3.1 Info and Relationships | A | Structure and relationships are programmatically determinable | Using `<div>` instead of `<table>`, headings via font-size only |
| 1.3.5 Identify Input Purpose | AA | Input purpose can be programmatically determined | Missing `autocomplete` attributes on login/address forms |
| 1.4.3 Contrast (Minimum) | AA | Text has sufficient contrast against its background | Light gray placeholder text, low-contrast disabled states |
| 1.4.11 Non-text Contrast | AA | UI components and graphics have sufficient contrast | Invisible form borders, low-contrast toggle switches |
| 1.4.13 Content on Hover or Focus | AA | Content triggered by hover/focus is dismissible and persistent | Tooltips that vanish when moving to them, no Escape to dismiss |

### Operable

| Criterion | Level | What it means | Common violation |
|-----------|-------|---------------|------------------|
| 2.1.1 Keyboard | A | All functionality available via keyboard | Dropdown menus, custom sliders, drag-and-drop without keyboard alternative |
| 2.1.2 No Keyboard Trap | A | Keyboard focus can always be moved away from any component | Modals without Escape support, embedded widgets that capture Tab |
| 2.4.3 Focus Order | A | Focus order preserves meaning and operability | Tab order jumps between sidebar and main content unpredictably |
| 2.4.7 Focus Visible | AA | Keyboard focus indicator is visible | `outline: none` without replacement, focus ring removed for aesthetics |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused element is not entirely hidden by other content | Fixed navigation bar covers the focused element |
| 2.5.8 Target Size (Minimum) | AA | Touch/click targets are at least 24x24 CSS pixels | Tiny icon buttons, close buttons in compact UI |

### Understandable

| Criterion | Level | What it means | Common violation |
|-----------|-------|---------------|------------------|
| 3.1.1 Language of Page | A | Page language is programmatically identified | Missing `lang` attribute on `<html>` |
| 3.2.2 On Input | A | Changing a setting does not cause unexpected context change | Select dropdown that navigates on change without warning |
| 3.3.1 Error Identification | A | Errors are identified and described in text | Red border only, no error message text |
| 3.3.2 Labels or Instructions | A | Form inputs have labels or instructions | Placeholder-only inputs (label disappears on focus) |
| 3.3.3 Error Suggestion | AA | Error messages suggest how to fix the problem | "Invalid input" with no hint about expected format |

### Robust

| Criterion | Level | What it means | Common violation |
|-----------|-------|---------------|------------------|
| 4.1.2 Name, Role, Value | A | Custom components expose name, role, and state to assistive tech | Custom checkbox without `role="checkbox"` and `aria-checked` |
| 4.1.3 Status Messages | AA | Status messages are announced without receiving focus | Toast notifications invisible to screen readers |

---

## Color & Contrast
### Minimum contrast ratios

| Element | Ratio | Notes |
|---------|-------|-------|
| Normal text (< 18pt / < 14pt bold) | **4.5:1** | All body text, labels, form values, placeholder text |
| Large text (>= 18pt / >= 14pt bold) | **3:1** | Headings, hero text |
| UI components and graphical objects | **3:1** | Borders, icons, focus indicators, chart elements |
| Disabled elements | No requirement | But should still be perceivable as "something is here" |

### Tools
- **Chrome DevTools** — color picker shows contrast ratio inline
- **axe DevTools** — catches contrast failures automatically
- **Lighthouse** — accessibility audit includes contrast checks
- **Colour Contrast Analyser (CCA)** — standalone, supports eyedropper from any screen

### Color-only indicators
Never rely on color alone to convey information:
- Form errors: red border **+** error text **+** error icon
- Status badges: colored dot **+** text label ("Active", "Failed")
- Charts: color **+** pattern/shape **+** label
- Links in body text: color **+** underline (or underline on hover/focus minimum)

For the full semantic color system, see **Read** [`colors.md`](../tokens/colors.md).

---

## Keyboard Navigation
### Tab order
- Must follow the visual reading flow (left-to-right, top-to-bottom in LTR layouts)
- Never create a tab order that jumps unexpectedly between page sections
- Test by pressing Tab from the top of the page — the path should feel logical

### `tabindex` usage

| Value | Meaning | When to use |
|-------|---------|-------------|
| `0` | Focusable in DOM order | Custom interactive elements (`<div role="button">`) |
| `-1` | Focusable via JS only, not in tab order | Elements receiving programmatic focus (modal container, SPA route target) |
| Positive (1, 2, ...) | **Never use** | Breaks natural order, creates maintenance nightmares |

### Focus indicators
- Must be **visible** — never remove `outline` without a replacement
- Minimum style: **2px solid** outline with **3:1 contrast** against the background
- Use `outline-offset` to prevent overlapping content
- `:focus-visible` for keyboard-only focus (hides ring on mouse click)

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Skip links
First focusable element on the page: "Skip to main content" linking to `#main-content` (`<main>`). Visually hidden until focused:

```css
.skip-link { position: absolute; top: -100%; left: 0; }
.skip-link:focus { top: 0; z-index: 9999; }
```

### Key patterns for interactive widgets

| Key | Action |
|-----|--------|
| **Enter** | Activate buttons, links, submit |
| **Space** | Toggle checkboxes, switches, expand/collapse |
| **Escape** | Close modals, dismiss popups, clear combobox |
| **Arrow keys** | Navigate within composite widgets (tabs, menus, tree, listbox) |
| **Home / End** | Jump to first/last item in a list or composite widget |
| **Tab** | Move to the next focusable element (not within composite widgets) |

### Custom keyboard shortcuts
- Document all shortcuts (help dialog or `?` shortcut)
- Never conflict with browser or OS shortcuts
- Use `aria-keyshortcuts` to expose shortcuts to assistive tech
- Always provide a non-keyboard way to perform the same action

---

## Focus Management
### Modal / dialog focus trapping
- When a modal opens: move focus to the first focusable element inside (or the modal container)
- Tab and Shift+Tab cycle within the modal only — focus must not escape
- Escape closes the modal
- On close: restore focus to the element that triggered the modal

For implementation patterns, see **Read** [`modals.md`](../components/modals.md).

### SPA route changes
When the route changes without a full page reload:
1. **Announce the new page** via `aria-live="polite"` region, or
2. **Move focus** to the new page's `<h1>` or `<main>` element
3. Update `document.title` to reflect the current page

If neither happens, screen reader users have no idea the page changed.

### `aria-live` regions

| Value | When to use |
|-------|-------------|
| `polite` | Non-urgent updates (toast success, search results count, status change) |
| `assertive` | Urgent updates (error alerts, session expiry warning) |
| `off` | Default, no announcements |

Rules:
- The live region must exist in the DOM **before** content is injected
- Do not live-announce every keystroke (e.g., search results) — debounce
- `aria-atomic="true"` to re-announce the entire region on change
- Keep announcements concise — screen readers read the full content

---

## ARIA Patterns
### When to use ARIA
1. **First rule of ARIA**: if you can use a native HTML element, do that instead
2. ARIA does not add behavior — it only adds semantics. A `<div role="button">` still needs a click handler and Enter/Space key handling
3. Wrong ARIA is worse than no ARIA — it actively misleads assistive tech

### Common roles and required attributes

| Role | Required attributes | Notes |
|------|---------------------|-------|
| `alert` | — | Automatically announced, use sparingly |
| `dialog` | `aria-label` or `aria-labelledby` | Must trap focus, see Focus Management |
| `tablist` / `tab` / `tabpanel` | `aria-selected`, `aria-controls`, `aria-labelledby` | Arrow keys navigate tabs, Tab moves into panel |
| `menu` / `menuitem` | `aria-haspopup`, `aria-expanded` | Arrow keys navigate, Enter activates, Escape closes |
| `combobox` | `aria-expanded`, `aria-controls`, `aria-activedescendant` | Input + listbox pattern, complex — follow APG |
| `tree` / `treeitem` | `aria-expanded`, `aria-level`, `aria-setsize`, `aria-posinset` | File explorers, nested navigation |
| `status` | — | Implicit `aria-live="polite"`, use for non-urgent updates |

### Labeling strategies

| Attribute | When to use |
|-----------|-------------|
| `aria-label` | No visible text available (icon-only button, close button) |
| `aria-labelledby` | Visible text exists elsewhere — point to its `id`. Preferred over `aria-label` when both options exist |
| `aria-describedby` | Supplemental info (form field hints, error messages). Read after the label |

For full ARIA authoring patterns, refer to the [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/).

---

## Screen Readers
### How screen readers navigate
Users do not read top-to-bottom. Primary navigation strategies:
1. **Headings** — jump between headings (most common). Heading hierarchy is critical
2. **Landmarks** — jump between page regions (`<main>`, `<nav>`, `<aside>`)
3. **Links** — list all links on the page, scan by link text
4. **Form controls** — jump between inputs, buttons
5. **Tables** — navigate by row/column

### Heading hierarchy
- One `<h1>` per page — the page title
- Logical nesting: `h1` > `h2` > `h3` — never skip levels (no `h1` then `h3`)
- Headings describe the section content (not "Section 1", but "Billing Settings")
- Do not use headings for visual styling — use CSS instead

### Landmarks

| Element | Role | Guideline |
|---------|------|-----------|
| `<main>` | `main` | One per page. The primary content area |
| `<nav>` | `navigation` | Label each nav if multiple exist (`aria-label="Primary"`, `aria-label="Breadcrumb"`) |
| `<aside>` | `complementary` | Sidebar, related content |
| `<header>` | `banner` | Page header (when direct child of `<body>`) |
| `<footer>` | `contentinfo` | Page footer (when direct child of `<body>`) |
| `<section>` | `region` | Only becomes a landmark when labeled (`aria-label` or `aria-labelledby`) |

### Meaningful link text
- **Never**: "click here", "read more", "learn more" (ambiguous out of context)
- **Always**: describe the destination — "View billing history", "Read the API documentation"
- If a link wraps an image, the `alt` text serves as the link text

### Image alt text

| Image type | `alt` value | Example |
|------------|-------------|---------|
| Decorative | `alt=""` (empty) | Background patterns, visual separators |
| Informative | Describe what the image shows | `alt="Bar chart showing revenue growth from $1M to $3M in 2024"` |
| Functional (inside a link or button) | Describe the action | `alt="Download invoice PDF"` |
| Text in image | Reproduce the text | `alt="Sale: 50% off all plans"` |
| Complex (chart, diagram) | Brief alt + longer description nearby | `alt="Q4 revenue breakdown"` + data table |

---

## Motion & Reduced Motion
### `prefers-reduced-motion`
Always respect this media query. Non-negotiable.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Alternative: opt-in for motion — animate only under `@media (prefers-reduced-motion: no-preference)`, base state has no animation.

### Autoplay rules
- **Never** autoplay video or audio with sound
- Autoplay muted video is acceptable if it can be paused
- With `prefers-reduced-motion: reduce`, show a static thumbnail instead

### Flashing content
- No content flashes more than 3 times per second (WCAG 2.3.1)
- This includes hero animations, loading indicators, and notification badges

For the full motion token system, see **Read** [`motion.md`](../tokens/motion.md).

---

## Forms
### Labels
- Every input must have a **visible label** — placeholders are not labels
- Placeholders disappear on focus, causing users to forget what the field expects
- Associate labels programmatically: `<label for="email">` or wrap the input in `<label>`
- Group related fields with `<fieldset>` and `<legend>` (radio groups, address blocks)

### Error handling
- Display error text **next to the field**, not only at the top of the form
- Connect errors to the field: `aria-describedby="email-error"`
- Use `aria-invalid="true"` on fields with errors
- Announce errors dynamically with `aria-live="assertive"` or by moving focus to the first error
- Provide specific suggestions: "Email must include @" not "Invalid input"

### Required fields
- Mark required fields with `aria-required="true"` **and** a visual indicator
- The visual indicator must not rely on color alone (asterisk `*` + "(required)" for critical forms)
- Explain the required indicator if using `*`: "Fields marked with * are required"

### Autocomplete
- Add `autocomplete` attributes to common fields (name, email, address, credit card)
- Helps password managers and assistive tech fill forms accurately
- Required by WCAG 1.3.5 for user-related inputs

For complete form component patterns, see **Read** [`forms.md`](../components/forms.md).

---

## Testing Matrix

| Category | Check | Tool / Method |
|----------|-------|---------------|
| **Keyboard** | Tab through entire page — focus order is logical | Manual |
| | All interactive elements reachable and operable | Manual |
| | Focus indicator always visible | Manual |
| | Modals trap focus and restore on close | Manual |
| | Skip link present and functional | Manual |
| | No keyboard traps | Manual |
| **Screen reader** | VoiceOver (macOS/iOS) with Safari | VoiceOver |
| | NVDA (Windows) with Firefox or Chrome | NVDA |
| | Page title descriptive, updates on route change | SR |
| | Heading hierarchy logical (no skipped levels) | SR |
| | All images have appropriate `alt` text | SR |
| | Form inputs announced with label and state | SR |
| | Dynamic content changes announced via live regions | SR |
| | Links and buttons have meaningful accessible names | SR |
| **Automated** | axe-core in CI — zero violations for critical/serious | axe-core |
| | Lighthouse accessibility score >= 95 | Lighthouse |
| | jsx-a11y lint (React) or equivalent framework linter | ESLint |
| | Pa11y CI pipeline regression checks | Pa11y |
| **Contrast** | All text meets 4.5:1 (normal) or 3:1 (large) | CCA / DevTools |
| | UI components and icons meet 3:1 | CCA / DevTools |
| | Focus indicators meet 3:1 | CCA / DevTools |
| | Checked in both light and dark mode | CCA / DevTools |
| | No information conveyed by color alone | Manual |
