# Design Spec: Architecture & Design Expansion (Points 3 & 4)

Expansion of the ai-ressources knowledge base with 4 new architecture files and 2 new design files to reach full coverage of common SaaS patterns.

---

## Context

The repo currently has 4 architecture files (auth-flows, multi-tenant, rate-limiting, webhook-patterns) and 22 design files. All are complete and substantial (250-1200 lines). This expansion fills the remaining gaps identified in the coverage audit.

## Scope

### Point 3 — Architecture (4 new files)

| File | Lines (target) | Description |
|------|---------------|-------------|
| `architecture/event-driven.md` | ~350 | Event-driven architecture + CQRS patterns |
| `architecture/caching-strategies.md` | ~320 | Multi-layer caching: app, Redis/KV, CDN/edge |
| `architecture/background-jobs.md` | ~300 | Job execution patterns, retry, DLQ, idempotency |
| `architecture/database-migrations.md` | ~280 | Versioning, zero-downtime, expand/contract |

### Point 4 — Design (2 new files)

| File | Lines (target) | Description |
|------|---------------|-------------|
| `design/quality/accessibility.md` | ~350 | WCAG 2.2 AA, ARIA, keyboard, focus, screen readers |
| `design/components/email-templates.md` | ~300 | Responsive email layout, dark mode, client quirks |

---

## Architecture Files — Detailed Design

### 1. `architecture/event-driven.md` (~350 lines)

**Intro paragraph:** Event-driven architecture patterns for SaaS: event bus, message queues, pub/sub, CQRS, event sourcing. Cross-reference to architecture.md for layer placement.

**Sections:**

1. **Overview** — when to use event-driven vs request/response. Decision matrix.
2. **Event Design** — event envelope structure (reuse webhook-patterns.md format for consistency), naming conventions, versioning, schema evolution.
3. **Patterns**
   - **Pub/Sub** — fan-out, topic-based routing. Mermaid sequence diagram showing publisher → broker → N subscribers.
   - **Event Bus (in-process)** — for monoliths. EventEmitter pattern, typed events, decoupling modules without network overhead.
   - **Message Queue** — point-to-point delivery, ordering guarantees, partitioning. Mermaid flowchart: producer → queue → consumer group.
   - **Event Sourcing** — storing events as source of truth, projections, snapshotting. When to use (audit-critical domains) vs when to avoid (simple CRUD).
4. **CQRS** — command/query separation, separate read/write models, eventual consistency. Mermaid flowchart showing write path → event store → projections → read path.
5. **Delivery Guarantees** — at-most-once, at-least-once, exactly-once (and why it's hard). Idempotency keys. Dead letter queues. Table comparing guarantees across patterns.
6. **Infrastructure Mapping** — which pattern maps to which service. Job-queue vendors (Inngest, Trigger.dev, BullMQ, Cloudflare Queues) → cross-reference stack-ref/jobs/. Pub/sub brokers (Redis Pub/Sub, AWS SNS/SQS) → note that these are platform-level services covered in stack-ref/platforms/ or stack-ref/databases/, not in stack-ref/jobs/.
7. **Anti-patterns** — event storms, circular dependencies, oversized events, missing correlation IDs.

### 2. `architecture/caching-strategies.md` (~320 lines)

**Intro paragraph:** Multi-layer caching strategies for SaaS: application-level, distributed cache, CDN/edge. Invalidation patterns and consistency trade-offs.

**Sections:**

1. **Cache Layers** — table showing the 4 layers (browser, CDN/edge, application/Redis, database query cache) with hit latency, scope, invalidation ease.
2. **Application-Level Caching**
   - In-memory (LRU, TTL). When to use: hot paths, config, feature flags.
   - Memoization patterns (per-request vs long-lived).
   - Node.js: `Map` + TTL wrapper, `lru-cache`. Platform-agnostic patterns.
3. **Distributed Cache (Redis / KV)**
   - Key design: namespace, versioning, TTL strategy.
   - Serialization: JSON vs MessagePack.
   - Patterns: cache-aside (lazy), read-through, write-through, write-behind.
   - Mermaid flowchart for cache-aside pattern.
   - Stampede prevention: lock, probabilistic early expiration, stale-while-revalidate.
4. **CDN / Edge Caching**
   - Cache-Control headers: `public`, `private`, `s-maxage`, `stale-while-revalidate`, `stale-if-error`.
   - Surrogate keys / cache tags for targeted invalidation.
   - Edge compute caching (Cloudflare Workers Cache API, Vercel ISR).
5. **Invalidation Strategies** — TTL-based, event-driven invalidation, versioned keys, purge APIs. Decision matrix: consistency requirement vs complexity.
6. **Cache Key Design** — namespacing, tenant isolation, locale/variant handling. Anti-patterns: keys with user input, unbounded key spaces.
7. **Monitoring** — hit ratio, eviction rate, latency percentiles. Alerting thresholds.

### 3. `architecture/background-jobs.md` (~300 lines)

**Intro paragraph:** Background job execution patterns for SaaS: queues, scheduled jobs, workflows. Retry strategies, idempotency, observability. Cross-reference to stack-ref/jobs/ for vendor comparison.

**Sections:**

1. **Job Types** — table: fire-and-forget, delayed, scheduled/cron, workflow/multi-step, event-triggered. With use cases.
2. **Execution Patterns**
   - **Simple Queue** — FIFO, priority queues, concurrency control. Mermaid flowchart.
   - **Fan-out** — one event triggers N independent jobs.
   - **Workflow / Pipeline** — sequential steps with compensation on failure. Mermaid stateDiagram showing step progression + rollback.
   - **Scheduled / Cron** — distributed cron, leader election, clock drift handling.
3. **Reliability**
   - Retry strategies: immediate, fixed delay, exponential backoff + jitter. Table with formula and use case.
   - Dead letter queues: capture, inspect, replay.
   - Idempotency: brief summary + cross-reference webhook-patterns.md which documents the full pattern (Redis SET NX, idempotency key design). Do not duplicate.
   - Timeout handling: heartbeat-based vs hard timeout.
4. **Data Flow** — job payload design (small payloads, reference IDs not full objects), input/output serialization, large payload handling (store in R2/S3, pass reference).
5. **Observability** — structured logging per job, metrics (queue depth, processing time, failure rate), tracing across job chains. Cross-reference logging.md.
6. **Concurrency Control** — rate limiting per queue, per-tenant fairness, resource-based throttling.
7. **Infrastructure Mapping** — Inngest (workflow), Trigger.dev (code-first), BullMQ (Redis), Cloudflare Queues (edge). Cross-reference stack-ref/jobs/.

### 4. `architecture/database-migrations.md` (~280 lines)

**Intro paragraph:** Database migration patterns for SaaS: schema versioning, zero-downtime migrations, data migrations, rollback strategies.

**Sections:**

1. **Migration Types** — table: schema migration (DDL), data migration (DML), combined, seed data. Risk level per type.
2. **Versioning**
   - Sequential numbering vs timestamp-based.
   - Migration file naming convention.
   - Migration table/ledger: tracking applied migrations.
   - Tools: Drizzle, Prisma Migrate, raw SQL files (Node/TypeScript ecosystem); Flyway, Liquibase (JVM ecosystem — mention for completeness, not primary target).
3. **Zero-Downtime Migrations (Expand/Contract)**
   - The expand/contract pattern: add new → migrate data → update code → remove old.
   - Mermaid flowchart showing the 4-phase deployment.
   - Common operations: add column (safe), rename column (unsafe → expand/contract), drop column (unsafe → contract after deploy), add index (CONCURRENTLY).
   - Table of common DDL operations with safe/unsafe classification.
4. **Data Migrations**
   - Backfill patterns: batch processing, cursor-based, background job.
   - Handling large tables (millions of rows): chunked updates, avoiding locks.
   - Verification: row count checks, data integrity assertions.
5. **Rollback Strategies**
   - Forward-only vs reversible migrations. When each is appropriate.
   - Down migrations: limitations, when they're safe.
   - Feature flags as migration safety net: code supports old AND new schema during transition.
6. **Multi-Tenant Considerations** — per-tenant schema migrations, migration ordering, tenant-aware rollout (canary migrations).
7. **Anti-patterns** — mixing DDL and DML in one migration, non-reversible operations without backup, long-running locks, deploying code before migration completes.

---

## Design Files — Detailed Design

### 5. `design/quality/accessibility.md` (~350 lines)

**Intro paragraph:** Accessibility patterns for web and native applications. WCAG 2.2 AA compliance, ARIA, keyboard navigation, focus management, screen readers.

**Sections:**

1. **WCAG 2.2 AA Quick Reference** — table of the 4 principles (Perceivable, Operable, Understandable, Robust) with the most impactful success criteria per principle. Not an exhaustive list — focused on what SaaS apps actually break.
2. **Color & Contrast**
   - Minimum contrast ratios: 4.5:1 text, 3:1 large text, 3:1 UI components.
   - Tools for checking: Chrome DevTools, axe, Lighthouse.
   - Color-only indicators: never rely on color alone (add icons, text, patterns).
   - Cross-reference colors.md for semantic color system.
3. **Keyboard Navigation**
   - Tab order: logical, follows visual layout. `tabindex` usage (0, -1, never positive).
   - Focus indicators: visible, high-contrast (2px solid, 3:1 contrast minimum).
   - Skip links: skip-to-content pattern.
   - Keyboard shortcuts: discoverability, conflicts, `aria-keyshortcuts`.
   - Common patterns: Enter to activate, Space to toggle, Escape to dismiss, Arrow keys for composite widgets.
4. **Focus Management**
   - Focus trapping in modals/dialogs. Cross-reference modals.md.
   - Focus restoration after modal close.
   - Focus on route change (SPA): announce new content or move focus to heading.
   - `aria-live` regions for dynamic content updates.
5. **ARIA Patterns**
   - When to use ARIA (only when native HTML is insufficient).
   - Common roles: `alert`, `dialog`, `tablist`/`tab`/`tabpanel`, `menu`/`menuitem`, `combobox`, `tree`.
   - Table of common components → required ARIA attributes.
   - `aria-label`, `aria-labelledby`, `aria-describedby`: when to use which.
6. **Screen Readers**
   - How screen readers navigate: headings, landmarks, links, form controls.
   - Heading hierarchy: one `h1`, logical nesting, never skip levels.
   - Landmarks: `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`. One `<main>` per page.
   - Meaningful link text (never "click here").
   - Image alt text: decorative (`alt=""`), informative (describe content), functional (describe action).
7. **Motion & Reduced Motion**
   - `prefers-reduced-motion` media query: respect it always.
   - Autoplay: never autoplay video/audio with sound. Respect user settings.
   - Cross-reference motion.md for duration/easing tokens.
8. **Forms**
   - Every input needs a visible label (not just placeholder).
   - Error messages: associated with input via `aria-describedby`, announced with `aria-live`.
   - Required fields: `aria-required` + visual indicator (not color alone).
   - Cross-reference forms.md.
9. **Testing Checklist** — keyboard-only navigation test, screen reader test (VoiceOver, NVDA), automated tools (axe-core, Lighthouse), color contrast audit.

### 6. `design/components/email-templates.md` (~300 lines)

**Intro paragraph:** Email template patterns for SaaS: responsive layout, dark mode, component library, client rendering quirks.

**Sections:**

1. **Layout Foundations**
   - Table-based layout (still required for Outlook). Why flexbox/grid don't work in email.
   - Maximum width: 600px. Mobile: fluid 100%.
   - Hybrid coding: `<table>` for structure + `<div>` fallback for modern clients.
   - Tools: MJML, React Email, Maizzle, plain HTML tables.
2. **Responsive Patterns**
   - Mobile-first with `@media` overrides for desktop (inverted from web).
   - Stacking columns: 2-column → 1-column on mobile.
   - Fluid images: `max-width: 100%; height: auto;`.
   - Font sizing: minimum 14px body, 22px headings on mobile.
   - CTA buttons: minimum 44px height, full-width on mobile.
3. **Dark Mode**
   - Three client behaviors: auto-inversion (Apple Mail), partial inversion (Gmail), none (some Outlook).
   - `@media (prefers-color-scheme: dark)` support: Apple Mail, Outlook.com, Hey.
   - Color-scheme meta tag: `<meta name="color-scheme" content="light dark">`.
   - Transparent PNGs: add a background color or use light borders to survive inversion.
   - Logos: provide light + dark variants or use SVG with `currentColor`.
4. **Components**
   - **Header**: logo (max 200px wide), navigation links (max 3-4).
   - **Hero**: image or gradient background, headline + subheadline + CTA.
   - **Content block**: icon + text or image + text side-by-side (stacking on mobile).
   - **CTA Button**: bulletproof buttons (VML for Outlook, `<a>` with padding for others).
   - **Footer**: unsubscribe link (required by law), company address, social links.
   - **Divider**: `<hr>` or `<table>` with border-bottom.
5. **Client Quirks** — table of rendering differences:

   | Client | CSS Support | Dark Mode | Images | Notes |
   |--------|-----------|-----------|--------|-------|
   | Apple Mail | Excellent | Auto-invert | Auto-load | Best rendering |
   | Gmail (web) | Strips `<style>`, inlines only | Partial | Auto-load | Inline CSS only |
   | Gmail (app) | Strips `<style>` | Partial | Auto-load | Same as web |
   | Outlook 2019+ | Word rendering engine | None | Blocked by default | Use VML for buttons/backgrounds |
   | Outlook.com | Good | Auto-invert | Auto-load | Different from desktop |
   | Yahoo | Good | None | Auto-load | |
   | Thunderbird | Good | Via extension | Auto-load | |

6. **Transactional vs Marketing**
   - Transactional: plain, single CTA, no unsubscribe required, immediate delivery.
   - Marketing: branded, multiple sections, unsubscribe required, respect frequency.
   - Shared base template: header + footer consistent, content area differs.
7. **Testing** — Litmus, Email on Acid, manual testing against the clients listed in the Client Quirks table above. Checklist: links work, images have alt text, unsubscribe works, plain-text fallback, RTL rendering noted as out of scope.
8. **Anti-patterns** — image-only emails, tiny text, too many CTAs, no plain-text fallback, broken preview text.

---

## Index Updates

### `architecture/index.yaml`

**Step 1 (data correction):** Update the 4 existing entries from `status: placeholder` to `status: complete` — these files were fully written in the previous commit but the index was never corrected.

**Step 2:** Add 4 new entries for the new files.

### `design/index.yaml`

Add 2 new entries under `components` and `quality` sections.

### `index.yaml` (root)

Update `architecture.file_count` from 4 to 8, update `design.file_count` from 22 to 24. Update descriptions to mention new topics.

---

## Cross-References

New files should cross-reference existing files where relevant:

| New file | Cross-references |
|----------|-----------------|
| event-driven.md | webhook-patterns.md (event structure), architecture.md (layer placement), stack-ref/jobs/ |
| caching-strategies.md | architecture.md (layer placement), rate-limiting.md (Redis — "for Redis-based rate limiting, a specialized cache pattern"), multi-tenant.md (cache key namespacing with tenant prefix) |
| background-jobs.md | event-driven.md (event-triggered jobs), webhook-patterns.md (idempotency pattern), logging.md, stack-ref/jobs/ |
| database-migrations.md | database.md (SQL conventions), multi-tenant.md (per-tenant migrations) |
| accessibility.md | colors.md (contrast), motion.md (reduced motion), forms.md, modals.md, web-standards.md, quality/ui-rules.md (visual non-regression rules that complement this file) |
| email-templates.md | colors.md (dark mode), typography.md (font stacks), copywriting/email-sequences.md |

---

## Out of Scope

- **Dark mode dedicated file** — already covered in colors.md + per-system files
- **i18n patterns** — valid topic but not in the original points 3 & 4
- **Monitoring/observability architecture** — partially covered in background-jobs and caching, full file is a separate expansion
- **API versioning** — could be a future architecture file, not in scope here
