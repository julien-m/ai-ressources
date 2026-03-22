# Architecture & Design Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 new reference files (4 architecture + 2 design) and update all index files to reach full SaaS pattern coverage.

**Architecture:** Each file is an independent markdown reference document following the established format (title, intro with cross-references, `---`, sections with tables/Mermaid/code). All 6 content tasks are parallelizable. Index updates happen last.

**Tech Stack:** Markdown, Mermaid diagrams, YAML index files.

**Spec:** `docs/superpowers/specs/2026-03-22-architecture-design-expansion-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `architecture/event-driven.md` | Event-driven + CQRS patterns |
| Create | `architecture/caching-strategies.md` | Multi-layer caching |
| Create | `architecture/background-jobs.md` | Job execution patterns |
| Create | `architecture/database-migrations.md` | Migration patterns |
| Create | `design/quality/accessibility.md` | WCAG 2.2 AA patterns |
| Create | `design/components/email-templates.md` | Email template patterns |
| Modify | `architecture/index.yaml` | Fix status + add 4 entries |
| Modify | `design/index.yaml` | Add 2 entries |
| Modify | `index.yaml` | Update counts + descriptions |

---

## Task 1: Event-Driven Architecture (PARALLEL)

**Files:**
- Create: `architecture/event-driven.md` (~350 lines)
- Reference: `architecture/webhook-patterns.md` (event structure format to reuse)
- Reference: `code-conventions/architecture.md` (layer placement cross-ref)

**Context for agent:** This is a markdown reference file for a knowledge base. Follow the exact format of existing files in `architecture/` — see `auth-flows.md` and `rate-limiting.md` for style. Start with `# Title`, one-line description, cross-reference paragraph to `architecture.md` for layer placement, `---`, then sections. Use Mermaid diagrams (sequenceDiagram for pub/sub, flowchart for CQRS). Use tables for decision matrices. No code fences except Mermaid and JSON examples.

- [ ] **Step 1: Read reference files for format**

Read these files to match format and style:
- `architecture/auth-flows.md` (first 50 lines — intro + cross-ref format)
- `architecture/webhook-patterns.md` (lines 15-30 — event structure JSON to reuse)
- `architecture/rate-limiting.md` (lines 1-50 — decision matrix table format)

- [ ] **Step 2: Write `architecture/event-driven.md`**

Content per spec — 7 sections:
1. **Overview** — when event-driven vs request/response. Decision matrix table.
2. **Event Design** — reuse webhook-patterns.md event envelope format for consistency. Naming, versioning, schema evolution.
3. **Patterns** — Pub/Sub (Mermaid sequenceDiagram: publisher → broker → N subscribers), Event Bus in-process (EventEmitter, typed events), Message Queue (Mermaid flowchart: producer → queue → consumer group), Event Sourcing (when to use vs avoid).
4. **CQRS** — command/query separation, separate read/write models. Mermaid flowchart: write path → event store → projections → read path.
5. **Delivery Guarantees** — at-most-once, at-least-once, exactly-once. Table comparing guarantees. Idempotency keys. DLQ.
6. **Infrastructure Mapping** — job-queue vendors (Inngest, Trigger.dev, BullMQ, Cloudflare Queues) → cross-ref `stack-ref/jobs/`. Pub/sub brokers (Redis Pub/Sub, AWS SNS/SQS) → note these are in `stack-ref/platforms/` or `stack-ref/databases/`.
7. **Anti-patterns** — event storms, circular deps, oversized events, missing correlation IDs.

Cross-references to include: `code-conventions/architecture.md` (intro paragraph, layer placement), `webhook-patterns.md` (event structure), `stack-ref/jobs/` (section 6, infrastructure mapping).

- [ ] **Step 3: Verify file**

Verify: file exists, starts with `# Event-Driven Architecture`, has `---` separator, contains at least 2 Mermaid diagrams, contains at least 2 tables, ~300-400 lines.

---

## Task 2: Caching Strategies (PARALLEL)

**Files:**
- Create: `architecture/caching-strategies.md` (~320 lines)
- Reference: `code-conventions/architecture.md` (layer placement)
- Reference: `architecture/rate-limiting.md` (Redis pattern style)
- Reference: `architecture/multi-tenant.md` (tenant cache key prefix)

**Context for agent:** Same format as Task 1. Markdown reference file. See `rate-limiting.md` for style — especially the algorithm decision matrix table and Mermaid flowcharts.

- [ ] **Step 1: Read reference files for format**

Read:
- `architecture/rate-limiting.md` (first 60 lines — decision matrix format)
- `architecture/multi-tenant.md` (search for "cache" or "tenant:{id}" — the tenant key prefix pattern)

- [ ] **Step 2: Write `architecture/caching-strategies.md`**

Content per spec — 7 sections:
1. **Cache Layers** — table: browser, CDN/edge, app/Redis, DB query cache. Columns: hit latency, scope, invalidation ease.
2. **Application-Level Caching** — in-memory (LRU, TTL), memoization (per-request vs long-lived), Node.js patterns (`Map` + TTL, `lru-cache`).
3. **Distributed Cache (Redis / KV)** — key design, serialization, patterns (cache-aside, read-through, write-through, write-behind). Mermaid flowchart for cache-aside. Stampede prevention.
4. **CDN / Edge Caching** — Cache-Control headers, surrogate keys, edge compute (Cloudflare Cache API, Vercel ISR).
5. **Invalidation Strategies** — TTL, event-driven, versioned keys, purge. Decision matrix.
6. **Cache Key Design** — namespacing, tenant isolation (cross-ref `multi-tenant.md` for the `tenant:{id}:{key}` pattern — do not duplicate), locale/variant. Anti-patterns.
7. **Monitoring** — hit ratio, eviction rate, latency percentiles.

Cross-references: `architecture.md` (layer), `rate-limiting.md` (Redis — "for Redis-based rate limiting, a specialized cache pattern"), `multi-tenant.md` (cache key namespacing).

- [ ] **Step 3: Verify file**

Verify: exists, `# Caching Strategies`, `---`, at least 1 Mermaid diagram, at least 2 tables, ~280-360 lines.

---

## Task 3: Background Jobs (PARALLEL)

**Files:**
- Create: `architecture/background-jobs.md` (~300 lines)
- Reference: `architecture/event-driven.md` (event-triggered jobs cross-ref)
- Reference: `architecture/webhook-patterns.md` (idempotency pattern — cross-ref, don't duplicate)
- Reference: `code-conventions/logging.md` (logging cross-ref)

**Context for agent:** Same format. See `webhook-patterns.md` for idempotency section — `background-jobs.md` should briefly summarize and cross-reference it, NOT duplicate the full pattern. Also cross-reference `event-driven.md` for event-triggered job patterns.

- [ ] **Step 1: Read reference files for format**

Read:
- `architecture/webhook-patterns.md` (search for "idempotency" section)
- `architecture/event-driven.md` (if already written — for event-triggered jobs context)
- `code-conventions/logging.md` (full file — it's short, ~39 lines)

- [ ] **Step 2: Write `architecture/background-jobs.md`**

Content per spec — 7 sections:
1. **Job Types** — table: fire-and-forget, delayed, scheduled/cron, workflow, event-triggered. With use cases.
2. **Execution Patterns** — Simple Queue (Mermaid flowchart), Fan-out, Workflow/Pipeline (Mermaid stateDiagram: step progression + rollback), Scheduled/Cron (distributed cron, leader election).
3. **Reliability** — retry strategies table (immediate, fixed, exponential backoff + jitter — formula + use case), DLQ (capture, inspect, replay), idempotency (brief + cross-ref `webhook-patterns.md`), timeout (heartbeat vs hard).
4. **Data Flow** — small payloads, reference IDs, large payload handling (R2/S3 + reference).
5. **Observability** — structured logging per job, metrics (queue depth, processing time, failure rate), tracing. Cross-ref `logging.md`.
6. **Concurrency Control** — rate limiting per queue, per-tenant fairness.
7. **Infrastructure Mapping** — Inngest (workflow), Trigger.dev (code-first), BullMQ (Redis), Cloudflare Queues (edge). Cross-ref `stack-ref/jobs/`.

Cross-references to include: `event-driven.md` (event-triggered jobs), `webhook-patterns.md` (idempotency pattern), `logging.md` (observability), `stack-ref/jobs/` (vendor comparison).

- [ ] **Step 3: Verify file**

Verify: exists, `# Background Jobs`, `---`, at least 2 Mermaid diagrams, at least 2 tables, ~260-340 lines.

---

## Task 4: Database Migrations (PARALLEL)

**Files:**
- Create: `architecture/database-migrations.md` (~280 lines)
- Reference: `code-conventions/database.md` (SQL conventions cross-ref)
- Reference: `architecture/multi-tenant.md` (per-tenant migrations)

**Context for agent:** Same format. See `multi-tenant.md` for cross-reference style.

- [ ] **Step 1: Read reference files for format**

Read:
- `code-conventions/database.md` (first 40 lines — format context)
- `architecture/multi-tenant.md` (search for "migration" — tenant migration context)

- [ ] **Step 2: Write `architecture/database-migrations.md`**

Content per spec — 7 sections:
1. **Migration Types** — table: schema (DDL), data (DML), combined, seed data. Risk level.
2. **Versioning** — sequential vs timestamp, naming convention, migration ledger. Tools: Drizzle, Prisma Migrate, raw SQL (Node/TS); Flyway, Liquibase (JVM — for completeness).
3. **Zero-Downtime Migrations (Expand/Contract)** — the 4-phase pattern. Mermaid flowchart: add new → migrate data → update code → remove old. Table of common DDL ops: safe/unsafe classification.
4. **Data Migrations** — backfill patterns (batch, cursor, background job), large tables (chunked, avoid locks), verification.
5. **Rollback Strategies** — forward-only vs reversible, down migrations, feature flags as safety net.
6. **Multi-Tenant Considerations** — per-tenant schema, migration ordering, canary migrations. Cross-ref `multi-tenant.md`.
7. **Anti-patterns** — mixing DDL/DML, non-reversible without backup, long locks, code before migration.

Cross-references: `database.md` (SQL conventions), `multi-tenant.md` (per-tenant migrations).

- [ ] **Step 3: Verify file**

Verify: exists, `# Database Migrations`, `---`, at least 1 Mermaid diagram, at least 2 tables, ~240-320 lines.

---

## Task 5: Accessibility Patterns (PARALLEL)

**Files:**
- Create: `design/quality/accessibility.md` (~350 lines)
- Reference: `design/tokens/colors.md` (contrast cross-ref)
- Reference: `design/tokens/motion.md` (reduced motion cross-ref)
- Reference: `design/components/forms.md` (forms cross-ref)
- Reference: `design/components/modals.md` (focus trapping cross-ref)
- Reference: `design/systems/web-standards.md` (touch targets — don't duplicate)
- Reference: `design/quality/ui-rules.md` (overlapping a11y rules — complement, don't duplicate)

**Context for agent:** This is a design quality file. See `ui-rules.md` for the style of quality files (rule-based, concise). But this file is longer and more structured — closer to `web-standards.md` in depth. Start with `# Accessibility`, one-line description, intro noting "For visual non-regression rules that complement this file, see `ui-rules.md`", `---`, then 9 sections per spec.

- [ ] **Step 1: Read reference files**

Read:
- `design/quality/ui-rules.md` (full — identify overlapping a11y content to complement not duplicate)
- `design/systems/web-standards.md` (lines 38-50 — touch targets section)
- `design/tokens/colors.md` (lines 1-10 — intro format for cross-ref style)

- [ ] **Step 2: Write `design/quality/accessibility.md`**

Content per spec — 9 sections:
1. **WCAG 2.2 AA Quick Reference** — table: 4 principles × most impactful criteria. Focused on what SaaS apps actually break.
2. **Color & Contrast** — ratios (4.5:1 text, 3:1 large/UI), tools, color-only indicators. Cross-ref `colors.md`.
3. **Keyboard Navigation** — tab order, `tabindex` (0, -1, never positive), focus indicators, skip links, shortcuts, common key patterns.
4. **Focus Management** — modal trapping (cross-ref `modals.md`), restoration, SPA route changes, `aria-live`.
5. **ARIA Patterns** — when to use, common roles table, `aria-label`/`labelledby`/`describedby`.
6. **Screen Readers** — heading hierarchy, landmarks, link text, image alt text.
7. **Motion & Reduced Motion** — `prefers-reduced-motion`, autoplay rules. Cross-ref `motion.md`.
8. **Forms** — visible labels, error messages (`aria-describedby` + `aria-live`), required fields. Cross-ref `forms.md`.
9. **Testing Checklist** — keyboard test, screen reader (VoiceOver, NVDA), axe-core, Lighthouse, contrast audit.

Cross-references to include: `colors.md` (contrast, section 2), `motion.md` (reduced motion, section 7), `forms.md` (form a11y, section 8), `modals.md` (focus trapping, section 4), `web-standards.md` (touch targets — complement, don't duplicate), `quality/ui-rules.md` (intro paragraph: "For visual non-regression rules that complement this file, see `ui-rules.md`").

- [ ] **Step 3: Verify file**

Verify: exists, `# Accessibility`, `---`, at least 3 tables, mentions `ui-rules.md` cross-ref, ~300-400 lines.

---

## Task 6: Email Templates (PARALLEL)

**Files:**
- Create: `design/components/email-templates.md` (~300 lines)
- Reference: `design/tokens/colors.md` (dark mode cross-ref)
- Reference: `design/tokens/typography.md` (font stacks cross-ref)
- Reference: `copywriting/email-sequences.md` (content cross-ref)

**Context for agent:** This is a design component file. See `payment-flows.md` or `data-visualization.md` for the style of component files (patterns with tables, code examples, anti-patterns section at end).

- [ ] **Step 1: Read reference files**

Read:
- `design/components/payment-flows.md` (first 40 lines — component file intro format)
- `design/tokens/typography.md` (first 20 lines — cross-ref style)
- `copywriting/email-sequences.md` (first 20 lines — cross-ref style)

- [ ] **Step 2: Write `design/components/email-templates.md`**

Content per spec — 8 sections:
1. **Layout Foundations** — table-based for Outlook, max 600px, hybrid coding, tools (MJML, React Email, Maizzle).
2. **Responsive Patterns** — mobile-first `@media`, column stacking, fluid images, font sizing (14px body, 22px headings), CTA 44px height.
3. **Dark Mode** — 3 client behaviors table, `prefers-color-scheme`, color-scheme meta, transparent PNG handling, logo variants. Cross-ref `colors.md`.
4. **Components** — header, hero, content block, CTA button (bulletproof VML), footer, divider.
5. **Client Quirks** — table from spec (Apple Mail, Gmail web/app, Outlook 2019+/com, Yahoo, Thunderbird) with CSS, dark mode, images, notes columns.
6. **Transactional vs Marketing** — comparison, shared base template.
7. **Testing** — Litmus, Email on Acid, test against Client Quirks table. Checklist. RTL out of scope.
8. **Anti-patterns** — image-only, tiny text, too many CTAs, no plain-text fallback, broken preview text.

Cross-references: `colors.md` (dark mode), `typography.md` (font stacks), `copywriting/email-sequences.md`.

- [ ] **Step 3: Verify file**

Verify: exists, `# Email Templates`, `---`, client quirks table present, at least 2 tables total, ~260-340 lines.

---

## Task 7: Update Index Files (SEQUENTIAL — after Tasks 1-6)

**Files:**
- Modify: `architecture/index.yaml`
- Modify: `design/index.yaml`
- Modify: `index.yaml` (root)

**Depends on:** Tasks 1-6 completed.

- [ ] **Step 1: Fix `architecture/index.yaml` — correct existing status**

Read `architecture/index.yaml`. Change `status: placeholder` to `status: complete` for all 4 existing entries (auth-flows, multi-tenant, rate-limiting, webhook-patterns).

- [ ] **Step 2: Add 4 new entries to `architecture/index.yaml`**

Add after the existing entries, matching the format:

```yaml
  - file: event-driven.md
    description: "Event-driven architecture, pub/sub, message queues, CQRS, event sourcing"
    status: complete

  - file: caching-strategies.md
    description: "Multi-layer caching: application, Redis/KV, CDN/edge, invalidation strategies"
    status: complete

  - file: background-jobs.md
    description: "Background job patterns: queues, workflows, retry, DLQ, observability"
    status: complete

  - file: database-migrations.md
    description: "Database migration patterns: versioning, zero-downtime, expand/contract, rollback"
    status: complete
```

- [ ] **Step 3: Add 2 new entries to `design/index.yaml`**

Read `design/index.yaml`. Add under the `components` section:

```yaml
      - file: components/email-templates.md
        description: "Email template patterns: responsive layout, dark mode, client quirks, components"
```

Add under the `quality` section:

```yaml
      - file: quality/accessibility.md
        description: "Accessibility patterns: WCAG 2.2 AA, ARIA, keyboard nav, focus management, screen readers"
```

- [ ] **Step 4: Update root `index.yaml`**

Read `index.yaml`. Update:
- `architecture.file_count`: 4 → 8
- `architecture.description`: add "event-driven/CQRS, caching, background jobs, database migrations"
- `design.file_count`: 22 → 24
- `design.description`: add "accessibility (WCAG), email templates"

- [ ] **Step 5: Verify all indexes**

Verify `architecture/index.yaml` has 8 entries, all `status: complete`. Verify `design/index.yaml` has entries for `email-templates.md` and `accessibility.md`. Verify root `index.yaml` shows `file_count: 8` for architecture and `file_count: 24` for design.
