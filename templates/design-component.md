# [Component Name]

> **Template** — Copy this file to `design/components/<name>.md`, fill every section, remove this line.

---

## Intent

> What problem does this component solve? When should it be used vs a different component?

---

## Variants

| Variant | Description | Use case |
|---------|-------------|----------|
| Default | ... | ... |
| ... | ... | ... |

---

## States

| State | Visual cue | Interaction |
|-------|-----------|-------------|
| Default | ... | ... |
| Hover | ... | ... |
| Active / Pressed | ... | ... |
| Focused | Focus ring | Keyboard / pointer |
| Disabled | Reduced opacity | Non-interactive |
| Loading | Spinner / skeleton | Async action |
| Error | Error color + icon | Validation failed |
| Empty | Empty state illustration | No data |

---

## Anatomy

> Describe the internal structure: container, label, icon, helper text, etc.

- **Container** — ...
- **Label** — ...
- **Icon** (optional) — ...
- **Helper / error text** — ...

---

## Spacing and sizing

Refer to `design/tokens/spacing.md` for the base 8px grid.

| Property | Value |
|----------|-------|
| Height (default) | ... |
| Horizontal padding | ... |
| Gap (icon → label) | ... |
| Border radius | ... |

---

## Per-platform guidelines

### iOS (HIG)

- ...

### Android (Material 3)

- ...

### Web

- ...

---

## Accessibility (a11y)

- **ARIA role:** `...`
- **Keyboard:** Tab to focus; Enter/Space to activate.
- **Contrast:** meets WCAG 2.2 AA (4.5:1 for text, 3:1 for non-text).
- **Reduced motion:** disable animations if `prefers-reduced-motion: reduce`.
- **Touch target:** minimum 44×44 px (iOS) / 48×48 dp (Android).

---

## Design tokens used

- `color.*` — ...
- `space.*` — ...
- `type.*` — ...

---

## Do / Don't

| ✅ Do | ❌ Don't |
|-------|---------|
| ... | ... |

---

## Related components

- [`forms.md`](forms.md) — ...
- [`modals.md`](modals.md) — ...
