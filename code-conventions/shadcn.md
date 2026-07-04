---
extends: [react, tailwind]
---
# shadcn/ui Rules (Delta)

> These rules complement [`react.md`](react.md) and [`tailwind.md`](tailwind.md). Only shadcn/ui-specific conventions are listed here.
## Core Principles
1. **Search before building** — `npx shadcn@latest search -q "keyword"` to check if a component exists
2. **Compose primitives** — combine existing components (Sidebar + Card + Table), never reinvent
3. **Use built-in variants** — `variant="outline"`, `size="sm"` instead of custom CSS
4. **Use semantic tokens** — `bg-primary`, `text-muted-foreground`, never raw `bg-blue-500`
5. **Never ship registry defaults unchanged** — customize copy, spacing, data, icon family, and visual rhythm for the brief

## CLI Workflow
```bash
npx shadcn@latest add button card dialog    # install components
npx shadcn@latest add --dry-run sidebar     # preview without writing
npx shadcn@latest add --diff sidebar        # show what changes
npx shadcn@latest docs button dialog        # open docs
npx shadcn@latest search -q "sidebar"       # search registry
```

## Component Composition
- Items must be inside their Group containers: `SelectItem` → `SelectGroup`, `CommandItem` → `CommandGroup`
- Dialog/Sheet/Drawer always require a `Title` (accessibility)
- Avatar always needs `AvatarFallback`
- `TabsTrigger` must be inside `TabsList`
- Use `asChild` for custom trigger elements (Radix pattern)

## Forms
- Always use `FieldGroup` + `Field` for form layout — never raw divs with `space-y-*`
- `InputGroup` uses `InputGroupInput` / `InputGroupTextarea` for icon+input combos
- 2-7 choices → `ToggleGroup`, not radio buttons
- `FieldSet` + `FieldLegend` for grouped controls
- Validation: `data-invalid` and `aria-invalid` attributes

```tsx
// BAD — manual layout
<div className="space-y-4">
  <label>Name</label>
  <Input />
</div>

// GOOD — structured form
<FieldGroup>
  <Field>
    <Label>Name</Label>
    <Input />
    <FieldDescription>Your full name</FieldDescription>
  </Field>
</FieldGroup>
```

## Layout & Styling
- Use `flex gap-*` instead of `space-x-*` / `space-y-*`
- Use `size-*` for equal width/height (e.g., `size-10` for icon containers)
- Use `truncate` shorthand for text overflow
- Use `cn()` for conditional class merging — never string concatenation
- No manual `z-index` on overlays — Dialog/Sheet/Popover manage stacking automatically
- No manual `dark:` overrides — rely on CSS variable theming

## Icons
- Icons in buttons use `data-icon="inline-start"` or `data-icon="inline-end"`
- Pass icons as component references, not strings
- No sizing classes on icons inside buttons — sizing is handled by the button variant

## Color Tokens
| Token | Usage |
|-------|-------|
| `background` / `foreground` | Page background and text |
| `card` / `card-foreground` | Card surfaces |
| `primary` / `primary-foreground` | Primary actions |
| `secondary` / `secondary-foreground` | Secondary actions |
| `muted` / `muted-foreground` | Subtle backgrounds and text |
| `accent` / `accent-foreground` | Hover states |
| `destructive` / `destructive-foreground` | Errors, delete actions |
| `border` | Default borders |
| `ring` | Focus rings |

## Anti-Patterns
- No custom CSS for what a variant already provides
- No `className` overriding component internals (padding, colors) — use variants
- No building custom modals/tooltips/dropdowns — use Dialog/Tooltip/DropdownMenu
- No inline styles — always Tailwind utilities
- No importing from `@radix-ui` directly — use the shadcn wrapper
- No default placeholder content from examples (`Acme`, generic teams, perfect metrics)
