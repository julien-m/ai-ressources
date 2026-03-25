# Component Blocks Catalog — Taxonomy and Template Patterns

> Reference catalog of UI blocks, section types, and page template compositions — for both marketing pages and application interfaces.
> Based on analysis of: shadcnblocks.com, Magic UI Pro, Tailark, shadcn/ui official (March 2026).
>
> **Purpose:** Know which blocks exist, where to place them, and in what order — so describing a page requires only a pattern name, not a component-by-component list.
>
> **See also:** [`landing-pages.md`](landing-pages.md) for design conventions, tone, branding, and visual references by product type.
> [`app-views-catalog.md`](app-views-catalog.md) for view compositions and app templates that reference blocks from this catalog.

---

## Two-layer architecture

UI components follow a strict two-layer separation:

| Layer | Role | Examples | Source |
|---|---|---|---|
| **Primitives** | Logic + accessibility + behavior (headless) | Dialog, Select, Tabs, Accordion, Toast | shadcn/ui + Radix UI |
| **Blocks** | Visual composition + layout (no logic) | Hero section, Pricing table, Feature grid | shadcnblocks, Magic UI, Tailark |

Blocks are pure arrangement — they assemble primitives with Tailwind layout classes. All complex behavior (focus trap, keyboard nav, aria attributes, open/close states) lives in the primitive layer. This catalog covers both **marketing blocks** (landing pages, conversion sections) and **application blocks** (dashboards, data views, settings, auth flows).

**Implication:** Blocks can be recreated from scratch with just a description. No dependency needed — only the primitives matter.

---

## Primitive components (shadcn/ui — ~75 components)

### Forms and input

Accordion, Checkbox, Collapsible, Combobox, Command, Date Picker, Field, Input, Input Group, Input OTP, Label, Native Select, Radio Group, Select, Slider, Textarea, Toggle, Toggle Group

### Data display

Calendar, Chart, Data Table, Pagination, Progress, Skeleton, Spinner, Table, Tabs

### Overlays and dialogs

Alert, Alert Dialog, Context Menu, Dialog, Drawer, Dropdown Menu, Hover Card, Popover, Sheet, Toast (Sonner), Tooltip

### Navigation and layout

Breadcrumb, Menubar, Navigation Menu, Resizable, Scroll Area, Sidebar

### Content and feedback

Aspect Ratio, Avatar, Badge, Button, Button Group, Card, Carousel, Empty State, Kbd, Separator, Switch, Typography

---

## Block types — Marketing section taxonomy

Every marketing page or landing page is composed from these section types. For application blocks, see the next section.

### Page structure

#### Header / Navbar

Top navigation bar with branding and primary actions.

**Anatomy:**

1. Logo — left-aligned, links to homepage
2. Navigation links — horizontal menu (5-7 items max)
3. CTA buttons — right-aligned (primary filled + secondary outline)
4. Optional: mega-menu dropdowns, search, notification bell
5. Mobile: hamburger menu → slide-out or full-screen overlay

**Variants:** sticky, transparent (over hero), mega-menu, flat (no dropdown), dropdown.

#### Footer

Bottom navigation with secondary links and legal.

**Anatomy:**

1. Column groups — 4-6 columns (Product, Resources, Company, Legal, Social)
2. Links — 4-8 per column, text only
3. Bottom bar — copyright + legal links (Privacy, Terms) + status badge (optional)
4. Optional: newsletter signup input, social icons, theme toggle

**Variants:** multi-column, minimal (single row), with newsletter signup.

#### Sidebar

Side navigation for documentation or app-like marketing sites.

**Anatomy:**

1. Hierarchical menu — collapsible sections with nested items
2. Active indicator — highlight on current page
3. Sticky position — follows scroll

**Variants:** collapsed (icon-only), expanded (with labels), icon-based.

### Hero and introduction

#### Hero

First impression section — the most important section on any page.

**Anatomy:**

1. H1 headline — value proposition in one phrase (56-100px, bold)
2. Subtitle — supporting description (18-20px, regular, 2 lines max)
3. CTA group — primary button (filled, accent color) + secondary button (outline)
4. Visual — screenshot, video, illustration, gradient, or interactive demo
5. Optional: social proof line ("Trusted by 10,000+ teams"), badge ("New: Feature X")

**Variants:** centered, left-aligned (text left / visual right), split with image, video background, gradient, interactive demo.

#### Banner / Topbar

Announcement bar above the header.

**Anatomy:**

1. Pill badge — colored label ("New", "Event", "Update")
2. Message text — short, one line
3. Link — "Learn more →" or "Register"
4. Dismiss X — optional

**Variants:** pill + text + link, dismissible, sticky, with countdown timer.

### Social proof and trust

#### Logo Bar

Client or partner logos strip.

**Anatomy:**

1. Label — "Trusted by..." or "Used by teams at" (14px, gray)
2. Logo row — 8-15 logos, equal height (~24-32px), grayscale or muted
3. Optional: horizontal auto-scroll animation

**Variants:** horizontal scroll, grid (2 rows), grayscale, color on hover.

#### Testimonials

Customer quotes and social proof.

**Anatomy:**

1. Quote text — in quotation marks or with quote icon
2. Author — avatar (40-48px) + name + role + company
3. Optional: star rating, company logo, video testimonial

**Variants:** single highlight (large quote), card grid (3 cards), carousel, avatar + quote side-by-side.

#### Stats / Metrics

Key numbers that demonstrate scale or impact.

**Anatomy:**

1. 3-4 stat items in a row
2. Per stat: large number (32-48px, bold) + label (14px, gray)
3. Optional: animated counter on scroll into view

**Variants:** inline counters, card grid, with icons, with trend arrows.

#### Press

Media mentions and press coverage.

**Anatomy:**

1. Media outlet logos — TechCrunch, Forbes, etc. (grayscale)
2. Optional: pull quote from article + attribution

**Variants:** logo + quote, badge-style, logo row only.

#### Awards

Certifications and recognition badges.

**Anatomy:**

1. Badge/icon grid — certification logos or custom badges
2. Label per badge — award name + year

**Variants:** icon grid, horizontal row, with descriptions.

### Core value communication

#### Features

Product capabilities showcase.

**Anatomy:**

1. Section title — "Features" or benefit-oriented heading
2. Feature items — each with: icon (24-32px) + title (18-20px bold) + description (14-16px, 2-3 lines)
3. Optional: screenshot or illustration per feature
4. Layout: grid (2-3 columns) or alternating left/right rows

**Variants:** bento grid, icon + title + description cards, alternating left/right with screenshots, feature cards.

#### Feature Scroll

Scroll-triggered progressive feature showcase.

**Anatomy:**

1. Sticky text panel — feature title + description (stays fixed)
2. Scrolling visual panel — screenshots or animations that change as user scrolls
3. Progress indicator — dots or line showing current feature

**Variants:** sticky text + scrolling visuals, sticky visuals + scrolling text.

#### Feature Slideshow

Carousel-based feature presentation.

**Anatomy:**

1. Tab or dot navigation — one per feature
2. Content area — title + description + visual per slide
3. Auto-advance — with pause on hover
4. Manual navigation — arrows or tab click

**Variants:** auto-advancing, tab-triggered, with thumbnail previews.

#### How It Works

Step-by-step process explanation.

**Anatomy:**

1. 3-5 steps in sequence
2. Per step: step number (circled or large) + title + description + optional icon/illustration
3. Connector — line, arrow, or dots between steps

**Variants:** numbered steps, timeline (vertical), connected dots, with illustrations.

#### Problem / Solution

Pain point identification then resolution.

**Anatomy:**

1. Problem section — pain point headline + description + optional "before" visual
2. Transition — visual separator or "→" arrow
3. Solution section — resolution headline + description + optional "after" visual

**Variants:** split layout (problem left / solution right), before/after slider, stacked.

#### Use Cases

Scenario-based value demonstration by persona or industry.

**Anatomy:**

1. Tab or card selector — one per use case / persona / industry
2. Content area — title + description + relevant screenshot + persona-specific benefits

**Variants:** cards by persona, cards by industry, tabbed with content swap.

#### Bento Grid

Mixed-size feature cards in asymmetric grid.

**Anatomy:**

1. Grid container — 2-4 columns with varying card sizes
2. Cards — each with: background (gradient, image, or solid) + title + optional description + optional visual/animation
3. Size hierarchy — 1 large card + 2-4 smaller cards to emphasize primary feature

**Variants:** 2x2, 3x3, asymmetric, with animations, with interactive demos.

#### Integration

Supported tools and platform logos.

**Anatomy:**

1. Section title — "Integrations" or "Works with your stack"
2. Logo grid — tool/platform logos (32-48px) in rows
3. Optional: per-logo tooltip or link to integration page
4. Optional: "and more..." link to full integrations page

**Variants:** logo grid with descriptions, categorized (by type), searchable.

#### Comparison Table

Feature comparison against alternatives or competitors.

**Anatomy:**

1. Column headers — "Us" (highlighted) + competitor names or "Others"
2. Feature rows — feature name + checkmark/dash per column
3. Highlight column — accent background or border on "us" column
4. Optional: pricing row at bottom

**Variants:** side-by-side columns, checkmark grid, with highlight on "us" column, anonymous competitors ("Others").

### Content and media

#### Gallery

Image or media showcase.

**Anatomy:**

1. Grid of images — 3-4 columns
2. Image cards — thumbnail + optional caption
3. Lightbox — click to expand full-size with navigation arrows

**Variants:** grid, masonry, lightbox, hover effects (zoom, overlay caption).

#### Blog

Article listing page.

**Anatomy:**

1. Featured article — large card at top (image + title + excerpt + author + date)
2. Article grid — cards below (3 columns: image + title + excerpt + date)
3. Pagination or "Load more"
4. Optional: category filter pills at top

**Variants:** grid, list, featured card + grid, with sidebar (categories, popular posts).

#### Blog Post

Single article layout.

**Anatomy:**

1. Header — title (H1) + author (avatar + name) + date + reading time
2. Hero image — full-width
3. Content — markdown rendered, ~700px max-width centered
4. Optional: table of contents sidebar, share buttons, related articles

**Variants:** with/without sidebar, with table of contents, with author bio at bottom.

#### Changelog

Product updates and release notes.

**Anatomy:**

1. Entries in reverse chronological order
2. Per entry: date + version tag + title + description + optional image/screenshot
3. Category badges — "New", "Fix", "Improvement"
4. Subscribe/follow button

**Variants:** chronological feed, editorial (magazine style with photos), cards.

#### Case Studies

Detailed customer success stories.

**Anatomy:**

1. Header — customer name + logo + industry + key metric ("↑ 150% conversion")
2. Challenge section — problem description
3. Solution section — how the product helped
4. Results section — metrics with before/after
5. Quote — testimonial from the customer

**Variants:** long-form with metrics, summary card, video case study.

#### Video / Demo

Product demonstration section.

**Anatomy:**

1. Video player — with play button overlay on thumbnail
2. Title + description — what the demo shows
3. CTA — "Try it yourself" or "Start free trial"

**Variants:** embedded (YouTube/Vimeo), autoplay hero (muted), lightbox (click to open), interactive demo.

#### Projects

Portfolio or work showcase.

**Anatomy:**

1. Grid of project cards — thumbnail + title + category + year
2. Hover effect — overlay with description or expanded view
3. Click — links to case study or project detail

**Variants:** grid, detailed cards, filterable by category.

### Conversion

#### Pricing

Subscription plans and pricing tiers.

**Anatomy:**

1. Toggle — monthly/yearly (yearly pre-selected, showing "Save X%")
2. Plan cards — 3-4 columns, each with: plan name + price + billing cycle + feature list (checkmarks) + CTA button
3. "Most popular" badge — on recommended plan (accent border, slightly elevated)
4. Differentiated CTAs — "Get started" (free), "Start trial" (paid), "Contact sales" (enterprise)
5. Optional: comparison table below for feature-by-feature detail
6. Optional: FAQ accordion below

**Variants:** 3-column cards, comparison table, toggle monthly/yearly, with enterprise "Contact us".

#### CTA

Call to action section — conversion push.

**Anatomy:**

1. Headline — action-oriented, repeats core value
2. Subtitle — supporting reason to act now
3. CTA buttons — primary + secondary (same pattern as hero)
4. Optional: background (gradient, image, accent color)

**Variants:** centered, split (text + visual), with background, inline (within content).

#### FAQ

Frequently asked questions.

**Anatomy:**

1. Section title — "Frequently Asked Questions"
2. Accordion items — question (clickable) + answer (collapsible)
3. Grouped by category (optional)
4. Optional: search bar at top
5. Optional: "Still have questions? Contact us" CTA at bottom

**Variants:** accordion, two-column, searchable, with categories.

#### Waitlist

Pre-launch signup capture.

**Anatomy:**

1. Headline — urgency or exclusivity ("Be the first to try...")
2. Email input — single field
3. Submit button — "Join waitlist" or "Get early access"
4. Social proof — "1,234 people already signed up"
5. Optional: countdown timer to launch

**Variants:** email input + CTA, with countdown, with social proof count.

### Authentication

#### Login

Sign-in section for marketing pages (landing-style, not in-app).

**Anatomy:**

1. Form card — centered, ~400px wide
2. Email + password inputs
3. "Remember me" checkbox + "Forgot password?" link
4. Submit button — full width
5. Social auth buttons — below divider ("or continue with")
6. Signup link — "Don't have an account? Sign up"

**Variants:** email/password, social only, magic link, with 2FA step.

#### Signup

Registration section for marketing pages.

**Anatomy:**

1. Form card — centered, or split layout (form + marketing)
2. Name + email + password inputs
3. Terms checkbox — with link to terms/privacy
4. Submit button — full width
5. Social auth buttons — below divider
6. Login link — "Already have an account? Log in"

**Variants:** single step, multi-step wizard, invite-only, with social proof sidebar.

### App and dashboard

#### Dashboard

Marketing-page dashboard preview section (showing the app in action).

**Anatomy:**

1. Screenshot or interactive embed of the actual dashboard
2. Annotation callouts — highlighting key features
3. Optional: animated data to show the dashboard "alive"

**Variants:** card grid preview, chart-heavy preview, KPI-focused preview.

#### Settings

Configuration page preview.

**Anatomy:**

1. Screenshot of the settings interface
2. Feature callouts — security, integrations, team management

**Variants:** tabbed preview, sectioned, form-based.

#### Empty State

No-data placeholder shown in marketing context.

**Anatomy:**

1. Illustration or icon
2. Headline + supportive description
3. CTA — "Get started" or "Create your first..."

**Variants:** illustration + CTA, minimal text, with tutorial link.

#### Application Shell

App layout wrapper shown in marketing context.

**Anatomy:**

1. Sidebar preview — navigation items
2. Header bar — search, notifications, avatar
3. Content area — placeholder or live data

**Variants:** sidebar + header + content, with dark mode toggle.

#### Data Table

Structured data display shown in marketing context.

**Anatomy:**

1. Column headers — sortable indicators
2. Sample rows — realistic data
3. Feature indicators — pagination, filtering, bulk actions

**Variants:** with pagination, with sorting, with filtering, with bulk actions.

### Specialized

#### Team

Team member showcase section.

**Anatomy:**

1. Grid of member cards — 3-4 columns
2. Per card: photo + name + role + optional social links
3. Optional: department grouping

**Variants:** photo grid, card with bio, circular photos, with social links.

#### About

Company or mission statement section.

**Anatomy:**

1. Headline — mission or vision statement
2. Body text — company story, values
3. Optional: founder photos, timeline, key milestones

**Variants:** narrative, timeline, with team photos, with values cards.

#### Careers

Job listings section.

**Anatomy:**

1. Section title — "Join us" or "Open positions"
2. Job cards or list — role title + department + location + type (full-time/remote)
3. Filter — by department or location
4. Apply CTA — per role

**Variants:** card grid, list, filterable, with department groups.

#### Timeline

Chronological events display (company history, milestones).

**Anatomy:**

1. Vertical or horizontal line
2. Event nodes — date + title + description
3. Direction — newest first or oldest first

**Variants:** vertical, horizontal, with images, alternating sides.

#### Community

Community links and engagement section.

**Anatomy:**

1. Platform cards — Discord, Slack, GitHub, Twitter
2. Per card: platform icon + member count + join CTA
3. Optional: recent community activity feed

**Variants:** card grid, icon row, with live member counts.

#### Contact

Contact form and information section.

**Anatomy:**

1. Contact form — name + email + subject + message + submit
2. Contact info — address, phone, email (beside or below form)
3. Optional: embedded map
4. Optional: office hours

**Variants:** form + info side-by-side, form only, with map, with office selector.

---

## Application block types — App section taxonomy

Application blocks are the building units for dashboards, admin panels, SaaS tools, and internal apps. Unlike marketing blocks (which persuade), application blocks help users **view data, take action, and configure their workspace**.

### Dashboard blocks

#### Metric Card

Single KPI display.

**Anatomy:**

1. Label — 13px, gray, names the metric
2. Value — 24px bold, the primary number
3. Variation % — green (up) / red (down), relative change
4. Sparkline — optional mini-chart showing trend

**Variants:** with/without sparkline, compact (no variation), full-width.

#### Chart Panel

Time-series or categorical visualization.

**Anatomy:**

1. Title — chart name
2. Period selector — pill buttons: 7d / 30d / 3m / 12m / custom
3. Chart area — the visualization itself (line, bar, or area)
4. Legend — series labels and colors
5. Tooltip — appears on hover with exact values

**Variants:** line, bar, area, stacked bar, multi-series.

#### Activity Feed

Chronological event list.

**Anatomy (per row):**

1. Avatar — 20-24px circle
2. Actor name — who performed the action
3. Action verb — what happened
4. Target — what was affected
5. Relative timestamp — e.g. "2h ago"
6. "View all" link — at bottom of the feed

**Variants:** compact (no avatar), detailed (with description), grouped by date.

#### Period Selector

Time range filter.

**Anatomy:**

1. Pill buttons — 7d / 30d / 3m / 12m
2. Custom date range picker — calendar-based start/end selection

**Variants:** pills only, dropdown, with comparison toggle ("vs previous period").

#### KPI Row

Horizontal row of 3-4 metric cards.

**Anatomy:**

1. 3-4 Metric Cards — in flex row, equal width
2. Responsive breakpoints — 2-column on tablet, 1-column on mobile

#### Onboarding Checklist

Getting-started progress tracker for new users.

**Anatomy:**

1. Title — "Getting started" or "Setup guide"
2. Progress indicator — bar or fraction (3/5 completed)
3. Checklist items — each with: checkbox + task label + optional description + status (done/pending/skipped)
4. Current task highlight — expanded with CTA button
5. Dismiss / "Don't show again" — link at bottom

**Variants:** card widget (dashboard corner), full-page, modal on first login, collapsible sidebar panel.

### Data blocks

#### Data Table

Structured data display with operations.

**Anatomy:**

1. Column headers — sortable, with sort direction indicator
2. Rows — 32-36px (dense) or 44-48px (comfortable) height
3. Pagination — page size selector + page navigation
4. Column visibility toggle — optional, shows/hides columns

**Variants:** dense, comfortable, with row selection checkboxes, with inline actions on hover.
**Mobile:** degraded — horizontal scroll required, consider card list alternative.

#### List+Detail

Master-detail split layout.

**Anatomy:**

1. Left panel — list of items, each with title + subtitle + meta
2. Right panel — detail view of the selected item

**Variants:** 40/60 split, 30/70 split, full-width list with slide-over detail, bottom sheet detail (mobile).
**Mobile:** full (adapted) — split view becomes push navigation (list → detail).

#### CRUD Table

Data Table extended with create/edit/delete.

**Anatomy:**

1. Header — title + "Add new" button
2. Data Table — the table itself (see Data Table block)
3. Row actions — edit / delete / duplicate via three-dot menu
4. Create/edit form — presented in Modal or Drawer Form

**Variants:** inline editing, modal editing, page-based editing.
**Mobile:** degraded — switches to card list with action sheets.

#### Search/Filter Bar

Query and filter interface.

**Anatomy:**

1. Search input — with Cmd+K keyboard hint
2. Filter dropdowns — status, date, assignee, etc.
3. Active filter pills — dismissible tags showing current filters
4. Clear all — removes all active filters

**Variants:** simple (search only), advanced (with saved filters), with facets.

#### Bulk Actions Bar

Operations on multiple selected items.

**Anatomy:**

1. Selection count — e.g. "3 selected"
2. Action buttons — delete, export, assign, tag
3. "Select all" / "Deselect" — toggle selection scope
4. Confirmation — required for destructive actions

Appears as a sticky bar when items are selected.

**Variants:** inline (replaces table header), floating bar, with batch progress indicator.

#### Filter/Facet Bar

Sidebar or horizontal faceted filtering.

**Anatomy:**

1. Filter groups — checkboxes or radio buttons per category
2. Count badges — number of results per option
3. "Clear all" — resets all filters
4. "Apply" — if not auto-apply mode

**Variants:** sidebar (vertical), horizontal pills, collapsible groups.
**Mobile:** degraded — moves to bottom sheet or modal filter.

#### Audit/Event Row

Single event in a timeline.

**Anatomy:**

1. Colored dot — status indicator
2. Event type label — what happened
3. Entity ID — monospace, with copy button
4. Metadata — additional context
5. Precise timestamp — full date/time

**Variants:** compact (one line), expanded (with payload details), grouped by entity.

#### Kanban/Board

Drag-and-drop column-based view for status workflows.

**Anatomy:**

1. Column headers — one per status (e.g., Todo / In Progress / Done), with item count badge
2. Cards per column — draggable, showing: title + assignee avatar + priority indicator + labels
3. "Add card" button — at bottom of each column (or top)
4. Column actions — collapse, add column, rename, delete (via ⋯ menu)
5. Drag handles — visual indicator on hover for card reordering

**Variants:** simple (3 columns), multi-status (5+ columns), swimlanes (grouped by assignee or priority), with WIP limits per column.
**Mobile:** degraded — single column view, swipe between columns.

#### Calendar/Scheduler

Date-based event display and management.

**Anatomy:**

1. View switcher — Day / Week / Month / Agenda toggle
2. Navigation — previous / today / next buttons + current date label
3. Grid — time slots (vertical) × days (horizontal) for day/week, date cells for month
4. Event blocks — colored by category, showing title + time + optional icon
5. Click-to-create — clicking empty slot opens event creation
6. Drag-to-resize — for event duration adjustment

**Variants:** month grid, week timeline, day timeline, agenda list, mini calendar (date picker sidebar).
**Mobile:** degraded — month view only, day view on tap. Week view hidden.

#### View Switcher

Toggle between different display modes for the same data.

**Anatomy:**

1. Toggle buttons — icon-based (grid / list / board / table / calendar)
2. Active state — filled icon or accent background
3. Positioned in App Header, aligned right

**Variants:** 2-mode (list/grid), 3-mode (list/grid/board), with saved/custom views dropdown.

### Auth blocks

#### Login Form

User authentication.

**Anatomy:**

1. Email input
2. Password input — with show/hide toggle
3. "Forgot password?" link
4. Submit button — full width
5. Divider — "or"
6. Social Auth Buttons
7. "Don't have an account? Sign up" link

**Variants:** email-only (magic link), with 2FA step, with SSO.

#### Signup Form

User registration.

**Anatomy:**

1. Name input
2. Email input
3. Password input — with strength indicator
4. Terms checkbox — required acceptance
5. Submit button
6. Divider — "or"
7. Social Auth Buttons
8. "Already have an account? Login" link

**Variants:** single step, multi-step wizard, invite-only (no email field).

#### Password Reset

Password recovery flow.

**Anatomy:**

1. Step 1 — email input + submit
2. Step 2 — confirmation message ("Check your email")
3. Step 3 (from email link) — new password + confirm password + submit

**Variants:** with security question, with SMS verification.

#### OTP Input

One-time password entry.

**Anatomy:**

1. 6 individual digit inputs — auto-focus next on fill
2. "Resend code" link — with cooldown timer
3. "Try another method" link

**Variants:** 4-digit, 6-digit, alphanumeric.

#### Social Auth Buttons

Third-party login providers.

**Anatomy:**

1. Vertical stack of buttons, each with:
   - Provider icon
   - "Continue with [Provider]" label
2. Common providers: Google, GitHub, Apple, Microsoft

**Variants:** icons only (compact), full buttons, horizontal row.

### Navigation blocks

#### App Sidebar

Primary application navigation.

**Anatomy:**

1. Workspace switcher — at top
2. Search / Cmd+K — global search trigger
3. Navigation items — icon (16px) + label, grouped by section with uppercase labels (11px)
4. User avatar / settings — at bottom
5. Active item indicator — accent background or colored text

**Variants:** expanded (with labels), collapsed (icons only), with nested sub-items.

#### Bottom Tab Bar

Mobile primary navigation.

**Anatomy:**

1. 4-5 tabs, each with:
   - Icon — 24px
   - Label — 10-12px
2. Active tab — filled icon + accent color
3. Badge dot — for notifications

**Variants:** 4 tabs, 5 tabs, with center FAB action button.

#### Breadcrumb Bar

Hierarchical location indicator.

**Anatomy:**

1. Home icon
2. Separator — `/` or `>`
3. Intermediate levels — clickable
4. Current page — not clickable, bold

**Variants:** simple, with dropdown for intermediate levels, truncated (`...`) for deep paths.

#### Command Palette

Global keyboard-driven navigation.

**Anatomy:**

1. Modal overlay
2. Search input
3. Results — grouped by category (Pages, Actions, Recent)
4. Keyboard navigation hints — arrows to navigate, Enter to select, Esc to close

**Variants:** simple search, with recent items, with actions (not just navigation).

#### App Header

Contextual top bar per view.

**Anatomy:**

1. View title + optional breadcrumb (left)
2. Filters / view toggles (left or center)
3. Actions (right) — export, create, settings

**Variants:** with tabs (sub-views), with period selector, minimal (title only).

### Settings blocks

#### Settings Sidebar

Internal settings navigation.

**Anatomy:**

1. Grouped menu items — Account / Workspace / Billing / Danger
2. Matches the app's main sidebar style
3. Active item highlighted

**Variants:** full sidebar, collapsible sections, tabs (horizontal alternative).

#### Form Section

Labeled group of settings fields.

**Anatomy:**

1. Section title
2. Description — optional explanatory text
3. Form fields — input, select, toggle, radio
4. "Save changes" button — active when form is dirty

**Variants:** with inline save per field, with sticky save button, read-only mode.

#### Danger Zone

Irreversible actions area.

**Anatomy:**

1. Visual separator — border-top or tinted red background
2. "Danger zone" label
3. Action description — what this does
4. Warning text — consequences
5. Destructive button — red, triggers confirmation modal

Always placed at the bottom of settings.

#### Toggle Matrix

Multi-channel notification preferences.

**Anatomy:**

1. Rows — notification types
2. Columns — channels (Email / Push / In-app)
3. Checkboxes at intersections
4. Disabled cells — with tooltip ("Required — cannot disable")
5. Group headers — Activity / Updates / Billing

**Mobile:** degraded — horizontal scroll or collapse to per-notification toggle list.

#### Avatar Upload

Profile image management.

**Anatomy:**

1. Current avatar — circle, 64-80px
2. "Change photo" button
3. "Remove" link
4. File picker — accepts jpg/png, max 2MB
5. Crop dialog — after file selection
6. Fallback — colored circle with user initials

### Content blocks — Display

#### Empty State

No-data placeholder.

**Anatomy:**

1. Illustration or icon — optional
2. Title — what would be here
3. Description — why it's empty + what to do
4. CTA button — primary action to fill the state

**Variants:** with illustration, text-only, with tutorial link.

#### Skeleton Loader

Content loading placeholder.

**Anatomy:**

1. Gray pulsing shapes matching the layout of the content being loaded
2. Specific skeletons for: metric card, table row, card, avatar + text, chart

**Variants:** by content type.

#### Error State

Error display.

**Anatomy:**

1. Error icon — red or orange
2. Title — e.g. "Something went wrong"
3. Description — what happened, in human terms
4. Retry button
5. "Contact support" link — optional

**Variants:** inline (within a section), full-page (404, 500), toast (transient).

#### Alert Banner

Contextual information or warning bar within a view.

**Anatomy:**

1. Color-coded background — info (blue), warning (yellow), error (red), success (green)
2. Icon — matching severity (info circle, warning triangle, error X, check)
3. Message text — concise, actionable
4. Action link or button — optional ("Upgrade now", "Fix this", "Learn more")
5. Dismiss X — optional, some alerts are persistent

**Variants:** inline (within a section), top-of-page (below header), sticky, dismissible, non-dismissible.

#### Code Block

Syntax-highlighted code display with copy functionality.

**Anatomy:**

1. Language label — top-right or top-left (e.g., "TypeScript", "bash")
2. Code content — monospace, syntax highlighted, line numbers (optional)
3. Copy button — top-right, with "Copied!" feedback (2s)
4. Optional filename tab — for multi-file display
5. Optional diff highlighting — green (added) / red (removed) lines

**Variants:** single file, multi-file tabs, with diff, with line highlighting, terminal style (dark bg + green/white text), collapsible (for long snippets).

#### Timeline

Vertical chronological history of an entity (deal, issue, order).

**Anatomy:**

1. Vertical line — connecting all events
2. Event nodes — colored dots on the line (color by event type)
3. Per event: timestamp (left or right of line) + event title + actor + optional description
4. Direction — newest first (default) or oldest first
5. "Load more" — at bottom if paginated

**Variants:** alternating left/right, single side, with collapsible details, with icons instead of dots, compact (no descriptions).

#### Media/File Library

File browser and media management.

**Anatomy:**

1. Grid/list toggle — switch between thumbnail grid and file list
2. Upload zone — drag-and-drop area or "Upload" button
3. File cards — thumbnail (image/video preview or file type icon) + filename + size + date + actions (⋯ menu: rename, delete, copy URL)
4. Folder navigation — breadcrumb or tree sidebar
5. Search/filter — by file type, date, name
6. Selection mode — multi-select with Bulk Actions Bar

**Variants:** grid view, list view, with folders, flat (no folders), with preview panel.

### Content blocks — Interactive

#### Rich Text Editor

Block-based content editing.

**Anatomy:**

1. Toolbar — bold, italic, heading, list, link, code, image
2. Editing area — centered, ~700px max-width
3. Slash command menu — `/` for block insertion

**Variants:** minimal (inline toolbar), full (fixed toolbar), Notion-style (floating toolbar on selection).
**Mobile:** degraded — toolbar becomes bottom sheet, reduced formatting options.

#### File Upload Zone

File upload interface.

**Anatomy:**

1. Dashed border drop zone
2. Cloud upload icon
3. "Drag and drop or click to browse" text
4. Accepted formats hint — e.g. "PNG, JPG up to 10MB"
5. Progress bar — during upload
6. File preview — after upload

**Variants:** single file, multi-file, with preview grid.

#### Comment Thread

Discussion on an entity.

**Anatomy:**

1. List of comments, each with:
   - Avatar
   - Author name
   - Relative timestamp
   - Markdown content
2. Reply input — at bottom, with mention autocomplete
3. "Load more" — if paginated

**Variants:** flat, threaded (nested replies), with reactions.

#### Chat Thread

Real-time messaging interface.

**Anatomy:**

1. Message list — scrollable, newest at bottom. Per message: avatar + author name + timestamp + content (markdown) + reactions
2. Typing indicator — "[User] is typing..." at bottom of list
3. Input composer — text input (multiline) + attachment button + emoji picker + send button
4. Auto-scroll — snaps to bottom on new message, unless user scrolled up

**Variants:** 1-on-1, group, with reply threads, with message reactions, with file attachments.

#### Wizard/Stepper

Multi-step guided flow.

**Anatomy:**

1. Step indicator — numbered dots or bar (current / completed / upcoming)
2. Step content area
3. "Back" / "Next" buttons
4. "Skip" link — optional

**Variants:** horizontal steps, vertical steps, with form validation per step.

#### Notifications Panel

In-app notification center.

**Anatomy:**

1. Bell icon trigger — in header, with unread count badge (red dot or number)
2. Dropdown panel — max 400px wide, positioned below bell
3. Notification rows — icon + title + description + relative timestamp + read/unread indicator (dot)
4. "Mark all as read" action — top right of panel
5. "View all" link — navigates to full Notifications Inbox page
6. Empty state — "No new notifications"

**Variants:** dropdown panel, slide-over drawer, full page inbox, grouped by date.

### Commerce blocks

#### Payment Widget

Payment input form.

**Anatomy:**

1. Amount display
2. Card input — number / expiry / CVC
3. Express checkout buttons — Apple Pay / Google Pay / Shop Pay (above the form)
4. Billing address — if required
5. Submit button — with amount displayed

**Variants:** card only, with express checkout, with saved payment methods.

#### Plan Selector

Subscription plan chooser.

**Anatomy:**

1. Toggle — monthly/yearly (yearly pre-selected, showing savings)
2. 3-4 plan cards in columns, each with:
   - Plan name
   - Price + billing cycle
   - Feature list with checkmarks
   - CTA button
3. "Most popular" badge — on recommended plan

**Variants:** 2-column, 3-column, comparison table below.

#### Invoice Table

Billing history.

**Anatomy:**

1. Table columns: date, description/invoice number, amount, status, download PDF action
2. Status badges — Paid (green) / Pending (orange) / Failed (red) / Refunded (gray)
3. Pagination — not infinite scroll (financial data requires explicit paging)

**Variants:** with filtering by status, with date range selector.

#### Payout Dashboard

Creator/merchant earnings overview.

**Anatomy:**

1. Total balance — large display
2. Pending / available split
3. Payout history table — date, amount, status, method
4. "Request payout" button
5. Payout method settings link

**Variants:** with chart, with multi-currency.

#### Usage Meter

Current consumption vs plan limit display.

**Anatomy:**

1. Resource label — "API calls", "Storage", "Team members"
2. Progress bar — filled proportionally (color shifts: green → yellow → red as approaching limit)
3. Usage text — "12,450 / 50,000" or "24.9%"
4. Threshold warning — text appears when >80% ("Approaching limit") or >100% ("Limit exceeded")
5. Upgrade CTA — "Upgrade plan" link, appears when >80%

**Variants:** horizontal bar, circular gauge, stacked (multiple resources), mini (inline in header or sidebar).

### Integration blocks

#### Modal/Drawer Form

Form presented in overlay.

**Anatomy:**

1. Overlay — modal (centered) or drawer (from right)
2. Title
3. Form fields
4. Cancel / submit buttons
5. Close — X button or click-outside to dismiss

**Variants:** modal (centered, max 600px), drawer (right side, full height), bottom sheet (mobile).

#### Integration Card

Third-party service connection.

**Anatomy:**

1. Service icon/logo
2. Service name
3. Connection status — Connected (green) / Not connected (gray)
4. Description
5. "Connect" / "Disconnect" button
6. Configuration link — if connected

**Variants:** card grid, list rows, with usage stats.

#### Permission Matrix

Role-based access control display.

**Anatomy:**

1. Rows — permissions/features
2. Columns — roles (Admin / Member / Viewer)
3. Indicators at intersections — checkmark / dash / lock icon
4. Group headers — by category

**Variants:** read-only display, editable (checkbox), with custom roles.
**Mobile:** desktop-only — too dense for small screens. Use simplified role-per-user list on mobile.

#### Saved Views

Persist and switch between custom filter/sort configurations.

**Anatomy:**

1. Current view name — displayed in App Header
2. Dropdown — list of saved views (name + optional icon/color)
3. "Save current view" — saves current filters/sort/columns as a named view
4. "Edit" / "Delete" per saved view
5. "Reset to default" — clears custom view

**Variants:** personal views only, shared team views, with view type indicator (table/board/calendar).

---

## Template patterns — Standard page compositions

### Pattern 1: SaaS / Product (14 sections)

The most common pattern for B2B/B2C apps.

```
Header
Hero
Logo Bar (social proof)
Problem
Solution
How It Works
Testimonial Highlight
Features
Testimonials
Pricing
FAQ
Blog
CTA
Footer
```

### Pattern 2: Developer Tool (13 sections)

Emphasizes examples, code, and community.

```
Header
Hero (with code snippet)
Logo Bar
Examples / Code Demos
Use Cases
Features
Stats
Testimonials
Pricing
Community
Blog
CTA
Footer
```

### Pattern 3: AI Product (9 sections)

Streamlined — lets the product speak through demos.

```
Header
Hero (with interactive demo)
Logo Bar
Features (Bento Grid)
Testimonials
Pricing
FAQ
CTA
Footer
```

### Pattern 4: Mobile App (12 sections)

Interactive feature discovery, scroll-heavy.

```
Header
Hero (app mockup)
Feature Scroll (sticky)
Bento Grid
Feature Highlight
Benefits
Features
Testimonials
Pricing
FAQ
CTA
Footer
```

### Pattern 5: Portfolio / Personal Brand (8 sections)

Linear storytelling, minimal conversion pressure.

```
Hero
About
Work / Experience
Education
Projects
Hackathons / Awards
Contact / CTA
Blog
```

### Pattern 6: Startup Minimal (11 sections)

Condensed, fast to build, focused on one product.

```
Header
Hero
Video Demo
CTA Buttons
"What is this?"
"Who is this for?"
"What's included?"
Tech Stack
Changelog
Navigation Links
Footer
```

### Pattern 7: Creator Platform

See `landing-pages.md` > Plateformes createurs.

```
Header
Hero (social proof rating + emotional H1)
Logo Bar / Creator showcase
Features (3 value props)
How It Works (3 steps)
Testimonials (real creators)
Pricing (freemium + premium)
FAQ
CTA (micro-copy: "free, no credit card")
Footer
```

---

## Universal section ordering rules

Every well-structured page follows this hierarchy:

1. **Top anchor** — Header (navigation) or Hero (if no header)
2. **Value establishment** — Hero + Problem/Solution or unique positioning
3. **Social proof** — Logos, companies, or early metrics (credibility before features)
4. **Core value** — Features, benefits, or workflow visualization
5. **Customer validation** — Testimonials, case studies, or stats
6. **Conversion funnel** — Pricing, FAQ, CTA (reduce friction in that order)
7. **Extended content** — Blog, changelog, community (optional, for SEO/retention)
8. **Bottom anchor** — Footer (navigation, legal, contact)

---

## How to use this catalog

When requesting a page, use this shorthand:

```
"Pattern SaaS for [product name]"
"Pattern Dev Tool with extra Community section"
"Pattern Mobile without Pricing"
```

The pattern name defines the section sequence. Override specific sections as needed:

```
"Pattern SaaS for TipBrace, replace Problem/Solution with Creator Showcase, add Testimonials after Features"
```

For individual sections, reference by block type:

```
"Add a Bento Grid features section after the hero"
"Replace the FAQ with a searchable FAQ"
"Use a split Hero with product screenshot on the right"
```

No need to list every component — the pattern carries the structure.

---

## Sources

| Source | What it provides | Access |
|---|---|---|
| [shadcn/ui](https://ui.shadcn.com) | 75+ primitive components (free, open source) | CLI: `npx shadcn@latest add [component]` |
| [shadcnblocks](https://www.shadcnblocks.com) | 1400+ visual blocks, 13 templates | Free blocks available, premium $149-$599 |
| [Magic UI](https://magicui.design) | Animated components (free, open source) | Copy/paste from docs |
| [Magic UI Pro](https://pro.magicui.design) | 9 templates, 50+ sections, Framer Motion | Premium |
| [Tailark](https://tailark.com) | Modern marketing blocks | Free |

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-03-25 | Initial catalog: marketing blocks (tables) + 7 landing page template patterns |
| 2.0 | 2026-03-25 | Added 53 application blocks with detailed anatomy across 9 categories. Added cross-references to app-views-catalog.md. Normalized marketing blocks to same anatomy format. Added mobile_support tags on 9 critical blocks. |
