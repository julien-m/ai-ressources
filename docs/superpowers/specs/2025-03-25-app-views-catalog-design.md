# App Views Catalog — Design Spec

> **Date:** 2025-03-25
> **Status:** Approved
> **Audited by:** GPT-5.4 via cc-hub copilot

---

## Problem

No file in `design/references/` answers: "I'm building an app of type X — which views do I need, and which blocks go in each view?" The `component-blocks-catalog.md` solves this for landing pages but not for applications.

## Solution: 3-Layer Bottom-Up Architecture

```
Layer 3: App Templates    "SaaS B2B" → Dashboard, CRUD Manager, Settings, Billing...
              ↓ references
Layer 2: Views            "Dashboard" → Metric Card + Chart Panel + Activity Feed
              ↓ references
Layer 1: Blocks           "Metric Card" → label + value + variation % + sparkline
```

Each layer references the one below. No duplication — views are compositions of blocks, templates are compositions of views.

## Deliverables

### 1. Enrich `component-blocks-catalog.md` (Layer 1)

Add ~42 application blocks with detailed anatomy, organized in 8 categories:

| Category | Blocks | Count |
|---|---|---|
| Dashboard | Metric Card, Chart Panel, Activity Feed, Period Selector, KPI Row | 5 |
| Data | Data Table, List+Detail, CRUD Table, Search/Filter Bar, Bulk Actions Bar, Filter/Facet Bar, Audit/Event Row | 7 |
| Auth | Login Form, Signup Form, Password Reset, OTP Input, Social Auth Buttons | 5 |
| Navigation | App Sidebar, Bottom Tab Bar, Breadcrumb Bar, Command Palette, App Header | 5 |
| Settings | Settings Sidebar, Form Section, Danger Zone, Toggle Matrix, Avatar Upload | 5 |
| Content | Rich Text Editor, File Upload Zone, Empty State, Skeleton Loader, Error State, Comment Thread, Wizard/Stepper | 7 |
| Commerce | Payment Widget, Plan Selector, Invoice Table, Payout Dashboard | 4 |
| Integration | Modal/Drawer Form, Integration Card, Permission Matrix | 3 |

Each block documented with: constituent elements, order, expected data, variants.

### 2. Create `app-views-catalog.md` (Layers 2 + 3)

**Matrix (top of file):** Quick-reference table mapping app type → required views → optional views → critical blocks → traits.

**~20 generic views** named by function:
Dashboard, List+Detail, CRUD Manager, Analytics, Content Editor, User Profile, Login, Signup, Onboarding, Settings General, Settings Security, Settings Billing, Settings Team, Settings Notifications, Settings API Tokens, Public Page, Search Results, Activity Log, Help/FAQ, Error Pages.

Each view = list of block references from the catalog + mobile variant when significantly different. References `app-views.md` for detailed wireframes instead of duplicating.

**7 app templates:**
1. SaaS B2B (dashboard + CRUD + settings + billing)
2. Creator Platform (creator page + revenue dashboard + content management)
3. AI Conversational (chat + history sidebar + settings)
4. DevTool (logs + deployments + monitoring)
5. CRM (contacts + deals + pipeline + activity)
6. E-commerce Admin (products + orders + customers + analytics)
7. Mobile Consumer (bottom tabs + feed + profile)

**4 composable traits:**
- Auth: Login + Signup + Profile + Security
- Billing: Plans + Invoices + Payouts
- Team: Members + Invites + Roles
- API: Tokens + Webhooks + Logs

## Cross-References

- `component-blocks-catalog.md` ↔ `app-views-catalog.md` (blocks ↔ views)
- `app-views-catalog.md` → `app-ui.md` (visual conventions)
- `app-views-catalog.md` → `app-views.md` (detailed wireframes per view)

## Non-Goals

- No refactoring of `app-views.md` or `app-ui.md` — they are referenced, not replaced.
- No code generation — this is a reference catalog only.
- No desktop-native patterns (Electron/Tauri).

## Sources

| Source | Contribution |
|---|---|
| shadcnblocks.com | 14 Application Shells, 15+ Dashboards, 32+ Data Tables, 27+ Chart Cards, 26 Settings Panels |
| TailAdmin | 7 dashboard types (Analytics, E-commerce, CRM, SaaS, Stocks, Logistics) |
| Magic UI / Tailark | Marketing blocks reusable in app contexts (Pricing, FAQ, Blog) |
| shadcn/ui | 75+ primitive components |
| Existing files | app-ui.md (conventions), app-views.md (wireframes) |
