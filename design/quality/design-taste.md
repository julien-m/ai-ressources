# Design Taste QA

Attribution: adapted from the MIT-licensed [Taste Skill](../../THIRD_PARTY_NOTICES.md#taste-skill).
Scope: landing pages, portfolios, marketing sites, and redesign QA. Not a replacement for product-app, dashboard, or data-table conventions.

## Read Before Use

- **Read** [`../references/design-read-protocol.md`](../references/design-read-protocol.md) before choosing an aesthetic direction.
- **Read** [`../systems/design-system-selection.md`](../systems/design-system-selection.md) before adding a UI library.
- **Read** [`../references/redesign-protocol.md`](../references/redesign-protocol.md) before changing an existing visual system.
- **Read** [`ui-rules.md`](ui-rules.md) for baseline non-regression checks.

## Anti-Default Rules

- Do not default to AI-purple gradients, dark mesh heroes, centered hero plus three equal cards, glassmorphism everywhere, or Inter plus slate.
- Pick one accent color per page and audit it across nav, CTAs, links, states, charts, badges, and footer.
- Pick one corner-radius system and follow it. Document exceptions, for example pill buttons plus 8px inputs.
- Use cards only when elevation communicates hierarchy. Prefer borders, dividers, and space for simple grouping.
- Keep hero text to one focused moment: optional eyebrow, headline, short subtext, and CTA group. Move trust strips, pricing notes, feature bullets, and logo walls below.
- Count eyebrows mechanically. Use at most one small uppercase eyebrow per three sections.
- Avoid split headers as filler. Stack headline and body unless the second column contains a real visual or interaction.
- Do not repeat the same section layout family more than once on a landing page.

## AI Tell Ban

| Tell | Replace with |
|---|---|
| `Jane Doe`, `John Smith`, `Acme`, `Lorem ipsum` | Domain-specific names, companies, and copy |
| Perfect metrics like `99.99%`, `50%`, `1234567` | Organic data such as `47.2%`, `18,420`, `3.7h` |
| Generic labels like `Step 1`, `Stage 2`, `Phase 03` | Verb-noun labels such as `Install`, `Configure`, `Ship` |
| "Trusted by teams worldwide" with no proof | Named logos, real testimonials, or no claim |
| Emoji as default iconography | Icon-library glyphs with labels |
| Hand-rolled SVG icon paths | A single installed icon family |

## Landing Pre-Flight

- Hero fits in the initial viewport on desktop and mobile.
- Desktop nav renders on one line and stays under 80px tall.
- CTA labels do not wrap at desktop. Shorten to 1-3 words or widen the button.
- Each CTA intent has one label across the page. Do not mix "Get in touch", "Contact us", and "Start a project".
- Button, form, placeholder, helper, and focus colors pass WCAG AA.
- Primary imagery shows the product, place, person, gameplay, or state being sold. Avoid generic atmospheric stock.
- Bento grids have exactly as many cells as content items and at least 2 visual treatments in a multi-cell grid.
- Every multi-column section declares its mobile collapse.
- Animations respect `prefers-reduced-motion` and never block interaction.

## Delivery Check

- [ ] Design read is explicit.
- [ ] Design system or aesthetic family is justified.
- [ ] One accent, one radius rule, one icon family.
- [ ] No banned AI tells remain.
- [ ] Hero, nav, CTA, forms, and bento checks pass.
- [ ] Screenshots or visual review cover desktop and mobile.
