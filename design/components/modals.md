# Modals & Dialogs

Modal types, bottom sheets, dialog anatomy, focus management, dismiss patterns, and transitions.

---

## Modal Types — When to Use

| Type | iOS | Android | Web | When to use |
|------|-----|---------|-----|-------------|
| **Alert** | UIAlertController | AlertDialog | `<dialog>` / custom | Confirmation, destructive action, critical info |
| **Full-screen modal** | `.fullScreenCover` | Full-screen dialog | Route or overlay | Complex forms, multi-step flows, content creation |
| **Page sheet** | `.sheet` (default) | — | Slide-up panel | Single-task form, detail view, settings |
| **Bottom sheet** | UISheetPresentationController | BottomSheetDialog (M3) | Custom / library | Quick actions, filters, pickers, contextual info |
| **Action sheet** | UIAlertController (.actionSheet) | — | Custom | List of actions (destructive + cancel) |
| **Popover** | UIPopoverController | PopupMenu | Floating panel | Contextual options near trigger, tooltips |

### Decision Guide

- **Quick choice (2–5 options)** → Action sheet (iOS) / Bottom sheet (Android) / Dropdown (Web)
- **Confirmation before destructive action** → Alert dialog
- **Form with 1–3 fields** → Page sheet / Bottom sheet
- **Complex creation flow** → Full-screen modal
- **Contextual options near a button** → Popover / Popup menu

## Bottom Sheet Detents

### iOS (UISheetPresentationController / SwiftUI)

| Detent | Height | Use case |
|--------|--------|----------|
| `.small` (custom) | ~25% | Peek content, map overlay |
| `.medium` | ~50% | Default for quick actions, filters |
| `.large` | ~95% | Full content, long forms |
| Custom | Any fraction | App-specific needs |

- Default detent: `.medium` → user can drag to `.large`
- Grabber visible: **always show** (`prefersGrabberVisible = true`)
- Background interaction: optionally allow interaction behind `.medium` sheet

### Android (Material 3 Bottom Sheet)

| State | Behavior | Notes |
|-------|----------|-------|
| Collapsed | Peek height (56dp default) | Shows handle + summary |
| Half-expanded | ~50% viewport | Optional intermediate state |
| Expanded | Full content height | Scrollable if content overflows |

- Drag handle: **4dp × 32dp**, centered, always visible
- `ModalBottomSheet` blocks background, `BottomSheet` allows interaction

## Dialog Anatomy

| Element | iOS Alert | Android Dialog | Web Dialog |
|---------|-----------|----------------|------------|
| Title | Centered, bold | Left-aligned, headline | Left or center-aligned |
| Body | Centered | Left-aligned, body text | Left-aligned |
| Buttons | Stacked or side-by-side | Right-aligned (text buttons) | Right-aligned |
| Button order | Default left, destructive right | Cancel left, confirm right | Cancel left, confirm right |
| Destructive style | Red text | Red/error text | Red or outlined |
| Max width | System-defined | 280–560dp | 400–560px |

- **iOS**: 2 buttons side-by-side, 3+ buttons stacked vertically
- **Android**: always text buttons (not filled) in dialogs
- **Web**: use `<dialog>` element for native backdrop and focus management

### Button Label Rules

| Bad | Good |
|-----|------|
| "Yes" / "No" | "Delete" / "Cancel" |
| "OK" | "Save changes" |
| "Confirm" | "Remove account" |

- Button labels should describe the action, not answer a question
- Destructive button: red, positioned where the platform expects it

## Focus & Keyboard Trapping

| Rule | Implementation |
|------|---------------|
| Focus moves into modal on open | First focusable element or close button |
| Tab cycles within modal only | Focus trap (web: `inert` on background, or focus-trap library) |
| Escape closes modal | Keyboard listener on dialog |
| Focus returns to trigger on close | Save reference to trigger element before opening |
| Screen readers announce modal | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` (web) |

- **Focus trap is mandatory** — tab must never escape to background content
- iOS/Android handle this natively for system modals
- Web: use `<dialog>` element (auto-traps focus) or a library like `focus-trap`
- See [../quality/ui-rules.md](../quality/ui-rules.md) for modal accessibility rules

## Dismiss Patterns

| Method | iOS | Android | Web |
|--------|-----|---------|-----|
| **Close button** | X in top-left or top-right | X or back arrow | X in top-right |
| **Swipe down** | Default for sheets | Default for bottom sheets | Not native |
| **Back gesture/button** | Swipe from edge (if push nav) | System back | Browser back (if routed) |
| **Backdrop tap** | Bottom sheets, popovers | Bottom sheets, dialogs | Dialogs (optional) |
| **Escape key** | Hardware keyboards | Hardware keyboards | Always supported |
| **Explicit action** | "Save" / "Cancel" buttons | "OK" / "Cancel" buttons | "Save" / "Cancel" buttons |

- **Alerts**: dismiss only via button action — no backdrop tap, no swipe
- **Sheets**: swipe down + close button + cancel action
- **Destructive flows**: require explicit button — no accidental dismiss
- Unsaved changes: confirm before dismissing ("Discard changes?")

## Transitions

| Type | iOS | Android | Web |
|------|-----|---------|-----|
| Alert | Fade + scale | Fade + scale | Fade (or scale) |
| Page sheet | Slide up from bottom | Slide up | Slide up or fade |
| Full-screen | Slide up (covers fully) | Slide up or shared element | Fade or slide |
| Bottom sheet | Slide up with spring | Slide up | Slide up |
| Popover | Fade + scale from anchor | Fade from anchor | Fade + scale |

- Duration: **200–350ms** — fast enough to feel responsive, slow enough to track
- Easing: `easeOut` on open, `easeIn` on close (or spring on iOS)
- Respect `prefers-reduced-motion` — instant show/hide, no animation
- Backdrop: fade in/out `scrim` color (see [../tokens/colors.md](../tokens/colors.md))

## Nesting Rules

- **Avoid nested modals** — modal on top of modal is confusing
- If unavoidable: maximum **2 levels deep** (e.g., sheet → confirmation alert)
- Alerts on top of sheets: acceptable (confirmation before closing)
- Sheet on top of sheet: avoid — use navigation within the sheet instead
- Popover from a modal: acceptable for contextual info
- Never: full-screen modal from a full-screen modal

## Checklist

- [ ] Modal type matches the task complexity (alert for simple, sheet for forms)
- [ ] Focus trapped inside modal (web: verify with keyboard-only navigation)
- [ ] Focus returns to trigger element on close
- [ ] Escape key closes the modal (all platforms with keyboard)
- [ ] Backdrop tap behavior is intentional (dismiss or no-dismiss)
- [ ] Swipe-to-dismiss available for sheets and bottom sheets
- [ ] Destructive actions require explicit button confirmation
- [ ] Unsaved changes prompt before dismiss
- [ ] Transitions respect `prefers-reduced-motion`
- [ ] Screen readers announce modal with appropriate role/label
- [ ] No nested modals beyond 2 levels
- [ ] Button labels describe the action, not "Yes/No/OK"
- [ ] See [../quality/ui-rules.md](../quality/ui-rules.md) for modal focus and scroll-lock rules
