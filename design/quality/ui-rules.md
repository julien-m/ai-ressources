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
