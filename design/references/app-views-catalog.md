# App Views Catalog — View Compositions and App Templates

> Reference catalog of application views (composed from blocks) and app templates (composed from views).
> Each view references blocks defined in [`component-blocks-catalog.md`](component-blocks-catalog.md).
> For detailed wireframes of each view, see [`app-views.md`](app-views.md).
> For visual conventions and patterns, see [`app-ui.md`](app-ui.md).
>
> **Purpose:** Know which views an app needs and which blocks go in each view — so describing an app requires only a template name, not a screen-by-screen spec.

---

## Quick-reference matrix

| App Type | Required Views | Optional Views | Key Blocks | Traits |
|----------|---------------|----------------|------------|--------|
| SaaS B2B | Dashboard, CRUD Manager, Settings (General/Billing/Team) | Analytics, Activity Log, Help/FAQ | Data Table, Metric Card, Chart Panel | Auth, Billing, Team, API |
| Creator Platform | Dashboard, Content Editor, Public Page, Settings (General/Billing) | Analytics, Supporters List+Detail, Help/FAQ | Payout Dashboard, Payment Widget, Activity Feed | Auth, Billing |
| AI Conversational | Chat View, Settings (General/Security) | Analytics, Activity Log, Help/FAQ | Chat Thread, Rich Text Editor, Command Palette | Auth |
| DevTool | Dashboard, Activity Log, Settings (General/API Tokens/Team) | Analytics, CRUD Manager | Chart Panel, Data Table, Audit/Event Row | Auth, Team, API |
| Project/Issue Tracker | Dashboard, Board, List+Detail (Issues), Activity Log, Settings | Analytics, Calendar | Kanban/Board, Data Table, Comment Thread, View Switcher | Auth, Team, Notifications |
| CRM | Dashboard, List+Detail (Contacts), List+Detail (Deals), Board (Pipeline), Activity Log, Settings | Analytics, Calendar, Help/FAQ | Data Table, Kanban/Board, Filter/Facet Bar, Comment Thread | Auth, Team |
| E-commerce Admin | Dashboard, CRUD Manager (Products), List+Detail (Orders), List+Detail (Customers), Settings (General/Billing) | Analytics, Activity Log | Data Table, Metric Card, Invoice Table | Auth, Team |
| Internal Tool | Dashboard, CRUD Manager, Activity Log, Settings (General/Team/Integrations) | List+Detail, Analytics | Data Table, Permission Matrix, Audit/Event Row | Auth (SSO), Team, Audit |
| Mobile Consumer | Feed, Profile, Settings (General/Notifications) | Search Results, Activity Log | Bottom Tab Bar, Empty State | Auth, Notifications |

---

## Composable traits

Traits are reusable bundles of views and blocks. When a trait applies, its views and blocks are added to any template.

| Trait | When | Views Added | Blocks Used | Notes |
|-------|------|-------------|-------------|-------|
| Auth | When the app has user accounts. | Login, Signup, Password Reset, User Profile, Settings Security, Onboarding | Login Form, Signup Form, Password Reset, OTP Input, Social Auth Buttons, Avatar Upload | **SSO variant (Internal Tools):** Login+Signup replaced by single SSO redirect page. Password Reset and OTP N/A. Social Auth Buttons replaced by SSO provider buttons (Okta, Azure AD, Google Workspace). |
| Billing | When the app has paid plans or payments. | Settings Billing, Billing Upgrade Flow | Plan Selector, Invoice Table, Payment Widget, Usage Meter, Payout Dashboard (if creator/marketplace) | |
| Team | When the app has multi-user organizations. | Settings Team | Permission Matrix, Toggle Matrix (notification preferences) | |
| API | When the app exposes an API to developers. | Settings API Tokens | CRUD Table (tokens), Audit/Event Row (API logs) | |
| Notifications | When the app needs an in-app notification system. | Notifications Inbox, Settings Notifications | Notifications Panel, Toggle Matrix | |
| Integrations | When the app connects to third-party services. | Settings Integrations | Integration Card, Modal/Drawer Form | |
| Audit | When the app requires compliance or audit trail. | Activity Log (mandatory, not optional) | Audit/Event Row, Filter/Facet Bar, Data Table | |

---

## View types — Compositions

Wireframe references use these shorthands:
- **[AV]** = see [`app-views.md`](app-views.md)
- **[AU]** = see [`app-ui.md`](app-ui.md)

### Dashboard

**Purpose:** Overview of key metrics and recent activity after login.

**Blocks:** KPI Row (3-4 Metric Cards) + Chart Panel (main time-series) + Activity Feed (recent events) + Period Selector.

**Layout:** KPI Row full-width top, Chart Panel full-width below, Activity Feed underneath.

**Mobile:** KPI Row becomes horizontal scroll. Chart Panel simplified (no tooltip). Activity Feed becomes primary content.

**Wireframe:** [AV] > Dashboard / Overview.

### List+Detail

**Purpose:** Browse a collection and inspect individual items.

**Blocks:** Data Table or list (left panel) + detail panel (right). App Header with Search/Filter Bar. Detail panel contains: entity header, properties, Activity Feed, Comment Thread.

**Layout:** Split view — list 40% / detail 60%. On selection, detail panel populates.

**Mobile:** Full-screen list, tap navigates to full-screen detail (push navigation). No split.

**Wireframe:** [AU] > Structure and layout > Variante avec panneau de detail.

### CRUD Manager

**Purpose:** Full create/read/update/delete for an entity.

**Blocks:** App Header ("+ Add new" button) + CRUD Table + Modal/Drawer Form (for create/edit) + Bulk Actions Bar.

**Layout:** Header top, Table fills remaining space. Modal overlays on create/edit.

**Mobile:** Table becomes card list. Create via full-screen form (not modal).

### Analytics

**Purpose:** Detailed metrics and trends beyond the dashboard overview.

**Blocks:** Period Selector + multiple Chart Panels (2-3) + KPI Row + Data Table (breakdown by dimension) + Filter/Facet Bar.

**Layout:** Period Selector top, KPI Row below, Charts in 2-column grid, Table underneath.

**Mobile:** Charts stack vertically, full-width. Table horizontal scroll.

### Content Editor

**Purpose:** Create and edit rich content (posts, docs, pages).

**Blocks:** Rich Text Editor (centered, ~700px) + App Header (title + status + publish action) + File Upload Zone (for media).

**Layout:** Header top, Editor centered. Optional sidebar for properties/metadata.

**Mobile:** Full-width editor, toolbar becomes bottom sheet.

**Wireframe:** [AU] > Vues types > Document editor.

### User Profile

**Purpose:** View and edit personal account information.

**Blocks:** Avatar Upload + Form Section (display name, email with verified badge, role read-only, theme preference) + Danger Zone (delete account).

**Layout:** Single column, centered (~600px max-width). Avatar at top.

**Mobile:** Same layout, full-width.

**Wireframe:** [AV] > Settings -- Profile.

### Login

**Purpose:** User authentication.

**Blocks:** Login Form (centered on page). Optional: company logo above, background illustration.

**Layout:** Centered card (~400px) on full-page background.

**Mobile:** Full-width card, no side padding.

### Signup

**Purpose:** New user registration.

**Blocks:** Signup Form (centered). Optional: social proof sidebar (on desktop).

**Layout:** Centered card or split layout (form left, marketing right).

**Mobile:** Full-width form only, marketing content hidden.

### Onboarding

**Purpose:** Guide new users to first value.

**Blocks:** Wizard/Stepper (2-4 steps) + Onboarding Checklist (persistent, shown on Dashboard after initial flow) + Form Section (per step: workspace name, invite team, first action). Progress indicator at top.

**Layout:** Centered card with step content. "Skip" always available. After completion, Onboarding Checklist widget appears on Dashboard.

**Mobile:** Full-screen steps, swipeable.

### Settings General

**Purpose:** Workspace/organization configuration.

**Blocks:** Settings Sidebar (left) + Form Section (workspace name, URL/slug, logo upload, timezone, language) + Danger Zone (delete workspace).

**Layout:** Settings Sidebar 240px left, Form content right.

**Mobile:** Settings Sidebar becomes top menu/tabs. Form full-width.

**Wireframe:** [AV] > Settings -- General.

### Settings Security

**Purpose:** Password, 2FA, and session management.

**Blocks:** Form Section (password change: current + new + confirm + strength indicator) + Form Section (2FA: status + setup/disable) + Data Table (active sessions: device + location + last active + revoke).

**Layout:** Sections stacked vertically. Within Settings layout.

**Wireframe:** [AV] > Settings -- Security.

### Settings Billing

**Purpose:** Plan, payment method, and invoices.

**Blocks:** Plan Selector (current plan card with usage bar + "Change plan") + Payment Widget (saved method + update) + Invoice Table (history with PDF download).

**Layout:** Plan card full-width top, Payment method below, Invoice table underneath.

**Wireframe:** [AV] > Settings -- Billing.

### Settings Team

**Purpose:** Member and invitation management.

**Blocks:** App Header ("Invite" button) + Data Table (members: avatar + name + email + role dropdown + actions) + Data Table (pending invites: email + role + sent date + resend/revoke) + Modal/Drawer Form (invite flow: emails + role selector).

**Layout:** Members table, Pending invites section below, Invite modal on action.

**Wireframe:** [AV] > Settings -- Team / Members.

### Settings Notifications

**Purpose:** Notification preferences per channel and type.

**Blocks:** Toggle Matrix (rows: notification types grouped by category, columns: Email/Push/In-app) + Form Section (global "Pause all" toggle at top).

**Layout:** Single section, full-width matrix.

**Wireframe:** [AV] > Settings -- Notifications.

### Settings API Tokens

**Purpose:** API key management.

**Blocks:** CRUD Table (tokens: name + scopes + created + last used + masked value with copy) + Modal/Drawer Form (create token: name + scopes checkboxes + expiration). One-time display dialog after creation.

**Layout:** Table with "New token" button in header. Modal for creation.

**Wireframe:** [AV] > Settings -- API Tokens.

### Public Page

**Purpose:** Public-facing page for an entity (creator profile, product page, company page).

**Blocks:** Hero-style header (banner + avatar + name + bio) + content tabs (About / Products / Posts) + Payment Widget or CTA. Uses marketing blocks from the catalog.

**Layout:** Full-width banner, centered content (~800px), tabs, content below.

**Mobile:** Stacked, tabs become scrollable horizontal pills.

### Search Results

**Purpose:** Global search results display.

**Blocks:** Search/Filter Bar (top, prominent) + results list (grouped by entity type: title + snippet + meta + entity badge) + Filter/Facet Bar (optional sidebar).

**Layout:** Search bar full-width top, Results below, optionally with left filter sidebar.

**Mobile:** Search bar sticky top. Filters in bottom sheet. Results full-width.

### Activity Log

**Purpose:** Complete audit trail of system events.

**Blocks:** Data Table or timeline of Audit/Event Rows + Filter/Facet Bar (by actor, action type, date) + Search/Filter Bar + Period Selector.

**Layout:** Filters top, Timeline/table below. Each row: colored dot + event type + actor + entity + timestamp.

**Mobile:** Simplified timeline, filters in bottom sheet.

### Help/FAQ

**Purpose:** Self-service help and common questions.

**Blocks:** Search/Filter Bar (top) + FAQ accordion sections (grouped by category) + optional Contact form or link.

**Layout:** Search top, Accordion sections below, Contact CTA at bottom. Uses the FAQ block from the marketing catalog.

### Board

**Purpose:** Kanban/column-based view for status-driven workflows (issues, deals, tasks).

**Blocks:** Kanban/Board + App Header (with View Switcher to toggle List/Board) + Search/Filter Bar + Bulk Actions Bar.

**Layout:** Columns fill horizontal space, horizontal scroll if many columns. Cards stack vertically in each column.

**Mobile:** Single column visible at a time, swipe between columns. Or fallback to list view.

**Wireframe:** [AU] > PM / Issue tracker > Vue Board.

### Calendar

**Purpose:** Date-based event or schedule management.

**Blocks:** Calendar/Scheduler + App Header (with view switcher: Day/Week/Month) + Modal/Drawer Form (for event creation/edit).

**Layout:** Calendar fills main content area. Event creation via click on time slot → modal.

**Mobile:** Month view default, day view on date tap. Week view hidden on mobile.

### Notifications Inbox

**Purpose:** Full-page view of all notifications with management.

**Blocks:** Data Table or list (notification rows: icon + title + description + timestamp + read/unread dot) + Filter/Facet Bar (by type, read/unread) + Bulk Actions Bar ("Mark all read", "Clear all").

**Layout:** Full-width list, grouped by date (Today / Earlier / This week).

**Mobile:** Same layout, full-width. Swipe-to-dismiss or swipe-to-mark-read.

### Settings Integrations

**Purpose:** Manage connected third-party services.

**Blocks:** Integration Card grid (connected services + available services) + Modal/Drawer Form (configuration per integration).

**Layout:** Grid of Integration Cards, grouped: "Connected" (top) + "Available" (below).

**Wireframe:** [AV] > Settings sections.

### Media Library

**Purpose:** Browse, upload, and manage files and media assets.

**Blocks:** Media/File Library + App Header ("Upload" button + View Switcher grid/list) + Search/Filter Bar + Bulk Actions Bar.

**Layout:** Grid of file cards (4-6 columns) or list view. Upload zone at top or via button.

**Mobile:** 2-column grid. Upload via system file picker.

### Chat View

**Purpose:** Real-time conversational interface for AI assistants or messaging.

**Blocks:** Chat Thread (message list + composer + typing indicator) + App Sidebar (conversation history as nav items, "New chat" at top) + App Header (model selector + share button) + Code Block (for code responses) + Empty State (new conversation prompt).

**Layout:** Sidebar left (conversation list) + main area: message thread (scrollable, centered ~700px) + input composer fixed at bottom.

**Mobile:** Sidebar hidden (hamburger menu). Full-screen chat. Input composer sticky bottom with attachment and voice buttons.

**Wireframe:** [AU] > AI conversationnel section.

### Billing Upgrade Flow

**Purpose:** Guided upgrade path from free to paid plan (distinct from Settings Billing which manages existing subscription).

**Blocks:** Plan Selector (centered, with feature comparison) + Payment Widget + Wizard/Stepper (optional, for multi-step: choose plan → enter payment → confirm) + Usage Meter (showing current usage vs limits as motivation).

**Layout:** Centered card (~800px), step-by-step or single-page. Often displayed as modal overlay or dedicated full-page.

**Mobile:** Full-screen flow, one step per screen.

### Error Pages

**Purpose:** HTTP error display (404, 500, 403).

**Blocks:** Error State (full-page variant). Centered: error code + illustration + title + description + "Go home" button + optional search.

**Layout:** Centered on full page, no sidebar, no header (or minimal header).

---

## App template patterns

### Pattern 1: SaaS B2B

The most common pattern for B2B applications. Dashboard-centric with CRUD operations and team management.

**Views:** Dashboard, CRUD Manager (primary entity), List+Detail (secondary entities), Analytics, Activity Log, Settings General, Settings Billing, Settings Team, Settings Notifications.
**Traits:** Auth + Billing + Team + API
**Navigation:** App Sidebar (expanded, with section groups)
**Shorthand:** `"App Pattern SaaS B2B for [product name]"` | `"… without API trait"` | `"… with extra Content Editor view"`

### Pattern 2: Creator Platform

For platforms where creators publish content, receive payments, and manage their audience.

**Views:** Dashboard (revenue-focused: earnings chart, recent supporters, payout status), Content Editor, CRUD Manager (products/tiers), List+Detail (supporters/customers), Public Page (creator profile), Analytics (traffic, conversion, churn), Settings General, Settings Billing.
**Traits:** Auth + Billing
**Navigation:** App Sidebar (compact, creator-focused sections: Content / Audience / Earnings / Settings)
**Shorthand:** `"App Pattern Creator Platform for [product name]"` | `"… with Team trait"`

### Pattern 3: AI Conversational

For AI chat interfaces with conversation history.

**Views:** Chat View, Settings General, Settings Security.
**Traits:** Auth
**Navigation:** App Sidebar (conversation history as nav items, "New chat" at top)
**Note:** Chat View is a standard view type defined in this catalog. Follows conventions from [AU] > AI conversationnel section.
**Shorthand:** `"App Pattern AI Chat for [product name]"` | `"… with Billing trait"`

### Pattern 4: DevTool

For developer-facing tools: monitoring, deployments, logs.

**Views:** Dashboard (deployments, uptime, error rate), Activity Log (deployment events, errors), List+Detail (projects/services), Analytics (performance metrics, usage), Settings General, Settings API Tokens, Settings Team.
**Traits:** Auth + Team + API
**Navigation:** App Sidebar (project switcher at top, deployment-focused sections)
**Shorthand:** `"App Pattern DevTool for [product name]"` | `"… with Billing trait"`

### Pattern 5: CRM

For managing contacts, deals, and sales pipeline.

**Views:** Dashboard (pipeline value, deal velocity, win rate), List+Detail (Contacts — filter/facet heavy), List+Detail (Deals — with pipeline/kanban view option), Board (Pipeline — deals as cards by stage), Activity Log (per contact/deal), CRUD Manager (companies), Analytics (sales funnel, revenue forecast), Settings General, Settings Team.
**Traits:** Auth + Team
**Navigation:** App Sidebar (Contacts / Deals / Companies / Reports / Settings)
**Shorthand:** `"App Pattern CRM for [product name]"` | `"… with API trait"`

### Pattern 6: E-commerce Admin

For managing an online store: products, orders, customers, analytics.

**Views:** Dashboard (revenue, orders today, conversion rate, top products), CRUD Manager (Products — with image upload, variants, pricing), List+Detail (Orders — status workflow: pending, processing, shipped, delivered), List+Detail (Customers — order history in detail panel), Analytics (sales by period, by product, by channel), Activity Log, Settings General, Settings Billing.
**Traits:** Auth + Team
**Navigation:** App Sidebar (Products / Orders / Customers / Analytics / Settings)
**Shorthand:** `"App Pattern E-commerce Admin for [product name]"` | `"… with API trait"`

### Pattern 7: Mobile Consumer

For consumer-facing mobile apps with feed-based content consumption.

**Views:** Feed (custom — scrollable content cards, pull-to-refresh, infinite scroll), Search Results (with discovery/explore features), User Profile (own + others), Settings General, Settings Notifications.
**Traits:** Auth
**Navigation:** Bottom Tab Bar (4-5 tabs: Home / Search / [Action] / Notifications / Profile)
**Note:** Feed is a specialized view. Follows conventions from [AU] > Responsive et mobile section.
**Shorthand:** `"App Pattern Mobile Consumer for [product name]"` | `"… with Billing trait"` | `"… with extra Content Editor"`

### Pattern 8: Project / Issue Tracker

For team productivity tools with issue tracking, sprints, and project management (Linear, Jira, Asana pattern).

**Views:** Dashboard (sprint progress, velocity, burndown), Board (Kanban — primary view, Todo/In Progress/Done), List+Detail (Issues — grouping by status, priority, assignee), Activity Log (per issue and global), Analytics (velocity, cycle time, bug rate), Settings General, Settings Team, Settings Notifications.
**Traits:** Auth + Team + Notifications
**Navigation:** App Sidebar (project switcher at top, Views section: Board / List / Calendar, then Settings)
**Note:** Board and List+Detail views should be switchable via View Switcher in the App Header. Follows conventions from [AU] > PM / Issue tracker section.
**Shorthand:** `"App Pattern Project Tracker for [product name]"` | `"… with API trait"` | `"… with Calendar view"`

### Pattern 9: Internal Tool / Admin Panel

For restricted-access admin interfaces, back-office tools, and internal dashboards (Retool, Django Admin, Metabase pattern).

**Views:** Dashboard (system health, key metrics, recent activity), CRUD Manager (primary entities — users, records, config), List+Detail (secondary entities), Activity Log (mandatory — audit trail), Settings General, Settings Team, Settings Integrations.
**Traits:** Auth (SSO/LDAP variant — no public signup) + Team + Audit
**Navigation:** App Sidebar (flat structure, admin-focused sections: Overview / Data / Users / System / Audit)
**Note:** No public signup — access is invite-only or SSO/LDAP. Permission Matrix is heavily used. Billing trait rarely applies (internal tools are not billed per-user). Follows a more utilitarian design — dense tables, minimal marketing elements.
**Shorthand:** `"App Pattern Internal Tool for [product name]"` | `"… with API trait"` | `"… with Integrations trait"`

---

## Universal view ordering rules

Every well-structured app follows this hierarchy in its sidebar/navigation:

1. **Dashboard / Home** — always first
2. **Primary entity views** — the core objects the user works with (issues, contacts, products)
3. **Secondary entity views** — supporting objects (customers, companies, tags)
4. **Activity / Logs** — historical views
5. **Analytics / Reports** — derived data views
6. **Settings** — always last (or in user menu)

---

## How to use this catalog

When requesting an app, use this shorthand:

```
"App Pattern SaaS B2B for TaskFlow"
"App Pattern Creator Platform without Analytics, add Help/FAQ"
"App Pattern DevTool with Billing trait, replace Activity Log with custom Monitoring view"
```

The pattern name defines the view set. Override specific views as needed:

```
"App Pattern CRM for DealPipe, add Content Editor for email templates, remove Analytics"
```

For individual views, reference by view type:

```
"Add a CRUD Manager view for Tags after the main List+Detail"
"Replace Dashboard with a simplified KPI Row + Activity Feed only"
```

For traits:

```
"Add Team trait to this app"
"Remove API trait — no developer-facing API"
```

The Billing Upgrade Flow view is automatically included with the Billing trait. It activates when a user needs to upgrade (from free to paid, or between plans). It is distinct from Settings Billing which manages an existing subscription.

No need to list every block — the view carries the structure, and the view references the blocks.

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-03-25 | Initial catalog: 9 app types in matrix, 7 composable traits (Auth with SSO variant, Billing, Team, API, Notifications, Integrations, Audit), 27 views with block references and mobile variants, 9 app template patterns, universal ordering rules, shorthand syntax guide. |
