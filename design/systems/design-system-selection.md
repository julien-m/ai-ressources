# Design System Selection

Attribution: adapted from the MIT-licensed [Taste Skill](../../THIRD_PARTY_NOTICES.md#taste-skill).
Scope: choosing an official design system, component foundation, or honest custom aesthetic.

## Selection Rules

- Use one design system per project.
- If the brief matches an official ecosystem, use the official package instead of recreating it by hand.
- If the brief names an aesthetic rather than a system, say so and implement it with native CSS, Tailwind, or a maintained component foundation.
- Before importing any package, inspect the project dependency list and output the install command if missing.

## Official Systems

| Brief reads as | Reach for | Notes |
|---|---|---|
| Microsoft, enterprise SaaS, internal dashboard | `@fluentui/react-components` or Fluent Web Components | Official Fluent UI tokens and accessibility |
| Google-flavored product | `@material/web` plus Material 3 tokens | Official Material implementation |
| IBM enterprise analytics | `@carbon/react` plus `@carbon/styles` | Mature dense-data patterns |
| Shopify app surface | Polaris web components or Polaris React | Expected inside Shopify admin contexts |
| Atlassian or Jira-like product | `@atlaskit/*` plus `@atlaskit/tokens` | Official Atlassian system |
| GitHub-style devtool or community page | `@primer/css`, `@primer/react`, or `@primer/react-brand` | Use Brand variant for marketing |
| UK public-sector service | `govuk-frontend` | Regulatory/user expectation |
| US public-sector service | `uswds` | Regulatory/user expectation |
| Fast local-business or agency MVP | Bootstrap 5.3 | Boring, fast, resilient |
| Accessible React foundation | `@radix-ui/themes` | Primitives plus theme |
| Owned modern SaaS components | shadcn/ui | Own the code and customize beyond defaults |
| Tailwind-first indie or AI marketing | Tailwind v4 utilities | Pair with explicit tokens and QA |

## Honest Aesthetic Implementations

| Aesthetic | Implementation |
|---|---|
| Glassmorphism | `backdrop-filter`, borders, highlights, solid fallback |
| Bento | CSS Grid with mixed cell sizes |
| Brutalism | Native CSS, raw borders, mono, sharp contrast |
| Editorial | Asymmetric grid, disciplined type, restrained imagery |
| Dark tech | Mono, single neon accent, terminal motifs |
| Aurora or mesh | SVG or layered gradients, not generic AI-purple |
| Kinetic typography | Native CSS, Motion, or GSAP for justified scroll experiences |
| Apple Liquid Glass on web | Approximation only: backdrop blur, layered borders, highlights |

## Install Command References

```bash
npm install @material/web
npm install @fluentui/react-components
npm install @carbon/react @carbon/styles
npm install @radix-ui/themes
npx shadcn@latest add button card dialog
npm install @primer/css
npm install govuk-frontend
npm install @uswds/uswds
npm install bootstrap
```

## Cross-References

- **Read** [`../references/design-read-protocol.md`](../references/design-read-protocol.md) before selecting.
- **Read** [`web-standards.md`](web-standards.md) for web layout and performance.
- **Read** [`../quality/design-taste.md`](../quality/design-taste.md) before shipping.
