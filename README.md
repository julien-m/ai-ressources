# ai-ressources

Reference knowledge base for building cross-platform SaaS applications, designed for humans and AI agents.

## Install

The knowledge base has no runtime dependency. Clone it anywhere and run the setup script to record its location:

```bash
git clone https://github.com/julien-m/ai-ressources.git
cd ai-ressources
./setup.sh
```

The script exports `AIRESOURCES` (the absolute path of the clone) from the shell profile selected from `$SHELL`. Override the profile with `AI_RESOURCES_SHELL_RC=/path/to/profile ./setup.sh`. Restart the shell or source the reported profile after setup.

`AIRESOURCES` is the only location contract:

- The portable skills read `$AIRESOURCES` and stop with a setup instruction when it is unset; the portable rules also accept an existing path recorded in the project manifest or index, without warning when resolution succeeds. They report an unresolved path only when the task needs the conventions, and suggest initialization or format refresh only during conventions setup or audit requests.
- `scripts/build-conventions.ts` honors `AIRESOURCES` and otherwise uses the clone that contains it. An empty value counts as unset. It records the resolved path in the generated `.conventions/manifest.yaml` (`ai_resources_path`) and `.conventions/index.md`; the skills read `$AIRESOURCES`, not that recorded path.
- [LiveSpec](https://github.com/julien-m/livespec) locates this knowledge base through the same variable.

To move the clone, rerun `./setup.sh` from the new location after updating the existing `export AIRESOURCES=` line it reports. The script single-quotes the path, so a directory name containing `$(...)`, backticks or quotes is never executed by the shell profile. If the profile still exports `AI_RESOURCES_PATH` from an earlier release, the script reports that line so you can remove it.

### Optional portable assets

Canonical portable skills and rules live under [`.agent-sync/`](.agent-sync/). They are not required to browse or consume the knowledge base.

When the global `conventions-preload` rule is installed, every website, web app and native UI task must load the layout/spacing rules, UI review rules and relevant platform guide directly from the resolved clone, even if the project has no conventions manifest or its index predates those sources. Read [the layout requirements](design/tokens/spacing.md#mandatory-layout-containers-in-product-code) and [the UI review rules](design/quality/ui-rules.md#layout--overlap). This is an agent instruction, not a runtime layout validator.

If `cc-hub` is already installed, link every portable asset to its supported providers:

```bash
./setup.sh --link-assets
```

`cc-hub` is an optional local convenience, not an installation prerequisite. Without it, point an agent directly at the relevant Markdown files or copy a selected directory from [`.agent-sync/skills/`](.agent-sync/skills/) into the skills directory documented by that agent provider. Keep `.agent-sync/` as the source of truth; generated provider directories are not canonical.

## Structure

```text
.agent-sync/       Portable global skills and rules
architecture/      Auth, multi-tenant, jobs, scheduling, reusable patterns
code-conventions/  Language-agnostic and per-language coding standards
conventions/       Naming, authority, diagrams, technical writing
copywriting/       Landing pages, email sequences, taglines
design/            Tokens, platform systems, components, quality
legal/             CGU, CGV, RGPD, privacy, cookies, MoR
models/            AI model catalog (chat, image, video, music)
pricing-models/    Freemium, flat-rate, per-seat, usage-based
seo/               Core Web Vitals, programmatic and technical SEO
stack-ref/         Vendor comparison sheets
templates/         Templates for new knowledge-base files
schemas/           JSON Schemas validating every index.yaml
scripts/           Index and conventions builders, with their tests
```

Content is written in English or French depending on the domain; legal templates target French law.

## Use the Knowledge Base

Each domain has an `index.yaml`; the root [`index.yaml`](index.yaml) describes every domain, and [`compiled-index.txt`](compiled-index.txt) is the generated flat routing index.

- **Read** [`code-conventions/general.md`](code-conventions/general.md) for cross-language foundations.
- **Read** [`design/index.yaml`](design/index.yaml) to route design questions.
- **Read** [`stack-ref/index.yaml`](stack-ref/index.yaml) to route vendor and platform questions.
- **Read** [`.agent-sync/rules/conventions-preload.md`](.agent-sync/rules/conventions-preload.md) for the portable loading workflow.

### Project initialization

- **Read** [shared initialization rules](code-conventions/general.md#project-initialization) before creating a project: record its role, stack, targets and creator/version, then use the corresponding official generator or IDE template. The language notes cover npm/Bun and web framework starters, Mix/Phoenix, Go modules, uv/Python frameworks, Cargo, SwiftPM/Xcode, Gradle/Android Studio and RAD Studio.
- Package metadata, web/mobile scaffolding and build/run commands are distinct. Preserve existing applications, review generated output and initialize without implicitly deploying.

### Contracts and polymorphism

- **Read** [modularity and polymorphism conventions](code-conventions/architecture.md#34-interface-based-modularity-and-polymorphism) for the shared preference: narrow capability contracts, interchangeable implementations, composition-time selection and semantic substitutability, including boundaries with one current implementation.
- **Read** [TypeScript/JavaScript](code-conventions/javascript.md), [Elixir](code-conventions/elixir.md), [Go](code-conventions/go.md), [Python](code-conventions/python.md), [Rust](code-conventions/rust.md), [Swift/Kotlin](code-conventions/swift-kotlin.md) and [Delphi/Pascal](code-conventions/delphi.md) for the language-specific mechanisms and official sources.

### Elixir and Phoenix

- **Read** [project choice and initialization](code-conventions/elixir.md#project-choice-and-initialization) before scaffolding: use Phoenix and `mix phx.new` for web/HTTP API projects; use `mix new` for a non-web business service or library, adding `--sup` when supervision is needed. Record the Phoenix decision explicitly.
- **Read** [Elixir conventions](code-conventions/elixir.md) for idioms, documentation, typespecs, module attributes, configuration, localization and adapters.
- **Read** [OTP and native boundaries](code-conventions/elixir-otp.md) for supervision, bounded concurrency, memory, profiling and Rustler versus isolated services.
- **Read** [Phoenix](code-conventions/phoenix.md) and [LiveView](code-conventions/phoenix-liveview.md) for API/UI choices, authorization, lifecycle and reconnect behavior.
- **Read** [Ecto](code-conventions/ecto.md) and [Oban](code-conventions/oban.md) for SQL constraints, migrations, transactional jobs, retries and active workers.
- **Read** [Elixir testing and CI](code-conventions/elixir-testing.md) for ExUnit, doctests, sandbox ownership, independent transaction races and isolated PostgreSQL CI.
- **Read** [REST/OpenApiSpex and Orval](code-conventions/openapi.md) for Phoenix API generation, deterministic contract export, TypeScript clients and API/SDK coherence tests.
- Discovery uses the existing [domain catalog](domain-catalog.md), [code index](code-conventions/index.yaml) and `extends` chains. Select only relevant deltas; for example `{"code":["phoenix-liveview","oban","elixir-testing"]}` is accepted by `scripts/build-conventions.ts <project-dir> <domains-json>`. This documentation does not select a product stack or certify an application's runtime tests.

### Multilingual Applications and Servers

- **Read** [internationalization conventions](code-conventions/internationalization.md) before adding product text: all user-facing messages use translation catalogs or platform resources, including errors, emails, notifications, documents and CLI output. Internal developer logs stay English.
- The guide covers locale isolation, API error ownership, fallback, plurals and formatting, with library choices for Delphi, JavaScript frameworks, Node.js, Elixir/Phoenix, Rust, Go, Python and native mobile. It defines reference policies; adopting it does not install dependencies or translate existing applications.
- Language and framework selections automatically include the guide in generated manifests and reading indexes through the general conventions' inheritance. Existing project manifests need a conventions refresh to acquire this source; read [the conventions lifecycle](#conventions-lifecycle) for initialization and refresh commands.

### Evidence-Based Database and Code Audits

Use `$ai-res-audit database postgresql` (or `/ai-res-audit` in Claude Code) to review a schema with shared conventions and engine-specific sources. Supported database profiles: PostgreSQL, MySQL, SQLite and CockroachDB. Select observed ORM/framework deltas with `--with ecto,prisma,drizzle` as appropriate; do not select unrelated adapters.

Use `$ai-res-audit code elixir` for code, with Delphi, TypeScript, JavaScript and Rust profiles also available. The resolver follows convention inheritance and prints the exact reading sources; it does not scan or test a database by itself.

Read [the audit skill](.agent-sync/skills/ai-res-audit/SKILL.md) for `review` (default), isolated `test`, and workload-based `performance` modes, evidence reporting and limitations. It preserves live data and project code, separates confirmed findings from unmeasured optimizations, and reports unavailable checks. Install with the existing portable-assets setup; there is no new database service or global runtime dependency beyond the existing Bun/YAML tooling.

### Code Planning and Review

Code conventions load before the first code plan, including in existing projects with missing, stale or design-only convention indexes. Read [the code planning and review gate](code-conventions/general.md#code-planning-and-evidence-based-plan-review): reviewers require module/contract decisions and planned verification, not a declaration that the conventions were read. The global preload rule supplies these sources and the gate to LiveSpec/APEX and delegated reviewers.

This is an agent loading and review requirement; it does not install a runtime checker or prove that future agents will always comply.

### Data Model Planning and Review

- Read [database conventions](code-conventions/database.md) before the first model plan or schema review: field usage, cardinalities, exhaustive closed sets, transitions, database constraints, query/index patterns, retention and verification are required plan inputs.
- Prefer normalized parent references, immutable versions and reusable SQL views; justify every copied identifier or snapshot. Preserve tenant isolation through enforced ownership paths and use bound parameters with prepared-query reuse where supported.
- Apply the [evidence-based plan review gate](code-conventions/database.md#01-evidence-based-plan-review-gate): cite concrete design evidence for each applicable convention, justify exceptions and non-applicability, and block data-model approval on missing or contradictory decisions. A file-read acknowledgment cannot pass the review; implementation tests remain a later phase.
- Apply [schema-warning triage](code-conventions/database.md#351-schema-warning-triage-and-intentional-exceptions) to each modeler/linter finding, including ignored items: fix actual defects, prove false positives or document permitted intentional exceptions before Ignore. Audits record incomplete access and never treat a hidden warning as validation.
- The installed global `conventions-preload` rule requires this reading before any data-model plan or review, including LiveSpec/APEX and existing projects with a missing, stale or design-only conventions index. The general conventions and catalog signals provide additional routes; refreshing generated indexes updates their routing metadata but is not a prerequisite for this global instruction. This is an agent reading requirement, not a runtime guarantee that every plan has applied it.

### Reusable Architecture Patterns

- **Read** [the guided navigation contract](architecture/guided-navigation.md) to define provider-neutral destination catalogs for natural-language help, route changes and scroll-to-anchor behavior. Applications supply their own routes, permissions and UI adapters; documentation adoption does not activate a runtime feature.

Each pattern explains a concrete use case, component selection, state ownership, lifecycle, failure recovery, examples and validation evidence. Sources support the design; application policies and vendor guarantees are distinguished explicitly.

- **Read** [the architecture pattern template](architecture/_template.md) when adding another reusable example.
- **Read** [Cloudflare job scheduling](architecture/cloudflare-job-scheduling.md) for editable execution times using Durable Objects and Queues, alternatives with Cron/Workflows, and the assessment of the linked DEV.to article.
- **Read** [Durable Object pooling in Cloudflare Containers](architecture/cloudflare-durable-object-pooling.md) for reducing always-awake actor costs, candidate workloads and checkpoint trade-offs; compare native hibernation first for reservation reminders.

### Reusable UX Resources

- **Read** [the Mobbin article review](design/references/mobbin-blog-review.md) for the 14 public articles reviewed on 2026-10-18, their limitations, and links to six practical resources: dashboards, onboarding, paywalls, streaks, UI research and homepage evidence.
- Each resource defines design decisions, data and interaction states, examples, accessibility and verification. Observations from external articles are separated from local recommendations; no conversion improvement is assumed.
- Design sub-domains in [the design index](design/index.yaml) route these resources independently for targeted convention loading.

## Conventions Lifecycle

`$conventions-init` in Codex or `/conventions-init` in Claude Code detects a target project's stack and can generate its `.conventions/` manifest/index, hooks, CI, and opt-in security workflows. `$conventions-refresh` or `/conventions-refresh` updates that materialized state when this knowledge base changes.

Security profiles are explicit: `none`, `baseline`, `production`, `public`, or `web-staging`. **Read** [the security profile reference](.agent-sync/skills/conventions-init/references/security-profiles.md) before selecting one.

## Public Maintenance

- **Read** [`CONTRIBUTING.md`](CONTRIBUTING.md) before changing knowledge-base content or portable assets.
- **Read** [`SECURITY.md`](SECURITY.md) for private disclosure guidance and scanner limits.
- **Read** [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for licensed adaptations and provenance.
- The repository is licensed under the [MIT License](LICENSE).
