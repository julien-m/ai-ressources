# Project Type → Design / Copywriting / Quality Mapping

Maps detected project types to additional convention files from `design/`, `copywriting/`, and `design/quality/`.

## How to detect project type

| Signal | Project type |
|---|---|
| `.tsx`/`.jsx` + React/Vue/Svelte/Next/Nuxt + routes/pages | Web app with UI |
| `index.html` + marketing copy + no app routes | Landing page / marketing site |
| Email templates, `resend`, `sendgrid`, transactional email code | App with transactional emails |
| `bin` field in package.json, CLI framework (commander, yargs, clap, cobra) | CLI |
| Dashboard routes, admin panel, charts/metrics components | Dashboard / admin |
| Stripe/payment integration, checkout flows | App with payments |
| WebSocket, SSE, real-time subscriptions, live updates | App with realtime |
| `.swift`/`.kt` + UI components + mobile navigation | Mobile app |
| `.specs/` directory exists | LiveSpec project |
| Any UI components, forms, modals, buttons in the codebase | Project with UI |

## Type → files mapping

| Project type | Files to include |
|---|---|
| Web app with UI | `design/quality/accessibility.md` + `design/quality/ui-rules.md` + `design/references/app-views.md` + `design/references/app-ui.md` |
| Landing page / marketing site | `copywriting/landing-page.md` + `copywriting/taglines.md` + `design/references/landing-pages.md` |
| App with transactional emails | `copywriting/email-sequences.md` + `design/components/email-templates.md` |
| CLI | `design/systems/cli-patterns.md` |
| Dashboard / admin | `design/components/data-visualization.md` + `design/components/log-viewer.md` + `design/components/navigation.md` |
| App with payments | `design/components/payment-flows.md` |
| App with realtime | `design/components/realtime-streams.md` |
| Mobile app | Design system already covered by `design/ios` or `design/android` from Channel 1 |
| LiveSpec project | `conventions/diagrams.md` |
| Project with UI (selective) | `design/components/buttons.md` + `design/components/navigation.md` + `design/components/feedback.md` + `design/components/forms.md` + `design/components/modals.md` + `design/components/lists.md` — include only those relevant to the project, not all systematically |

## Rules

- A project can match multiple types (e.g., "Web app with UI" + "App with payments" + "Dashboard")
- Merge all matched files, deduplicate
- When UI components are detected, only include component files for components actually used or likely needed — do not dump all 11 component files
- `design/references/mockup-specs.md` is only included if `.pen` files are detected (handled by Channel 1)
