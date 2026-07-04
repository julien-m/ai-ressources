# Design Read Protocol

Attribution: adapted from the Fable anti-slop frontend guidance.
Scope: first-pass interpretation for landing pages, portfolios, marketing sites, and redesigns.

## Output Contract

Before code or visual generation, write one line:

```text
Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>.
```

If the brief genuinely diverges, ask exactly one clarifying question. If the signals are clear, do not ask.

## Signals To Read

| Signal | What to extract |
|---|---|
| Page kind | SaaS landing, consumer landing, portfolio, agency site, event page, editorial, redesign |
| Vibe words | Minimal, calm, Linear-style, Awwwards, brutalist, premium consumer, Apple-like, playful, serious B2B |
| References | URLs, screenshots, named products, competitor brands |
| Audience | Technical buyer, consumer, recruiter, public-sector user, regulated buyer, creator |
| Existing assets | Logo, palette, typography, photography, screenshots, product UI |
| Quiet constraints | Accessibility, trust, regulation, kids, healthcare, finance, government |

## Dial Inference

Use three dials to constrain design decisions.

| Context | Variance | Motion | Density |
|---|---:|---:|---:|
| Minimal, clean, calm, editorial, Linear-style | 5-6 | 3-4 | 2-3 |
| Premium consumer, luxury, Apple-like, brand-led | 7-8 | 5-7 | 3-4 |
| Playful, wild, Dribbble, Awwwards, agency | 9-10 | 8-10 | 3-4 |
| Generic marketing page | 7-9 | 6-8 | 3-5 |
| Trust-first, public sector, regulated, accessibility-critical | 3-4 | 2-3 | 4-5 |
| Redesign preserve | Match existing | Existing +1 | Match existing |
| Redesign overhaul | Existing +2 | Existing +2 | Match existing |

## Anti-Default Discipline

- Do not infer "modern" as purple gradient, centered hero, three cards, and glass panels.
- Do not infer "premium" as beige, brass, espresso, and serif unless the brand earns it.
- Do not infer "creative" as random serif emphasis inside a sans headline.
- Do not infer "devtool" as dark mode only; validate product, audience, and proof needs.
- Let audience and proof requirements pick the aesthetic before personal taste.

## Handoff

- **Read** [`../systems/design-system-selection.md`](../systems/design-system-selection.md) after the design read.
- **Read** [`../quality/design-taste.md`](../quality/design-taste.md) before final visual QA.
