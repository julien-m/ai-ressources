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

- The portable skills read `$AIRESOURCES` and stop with a setup instruction when it is unset; the portable rules report the missing variable and continue without cross-cutting conventions.
- `scripts/build-conventions.ts` honors `AIRESOURCES` and otherwise uses the clone that contains it. An empty value counts as unset. It records the resolved path in the generated `.conventions/manifest.yaml` (`ai_resources_path`) and `.conventions/index.md`; the skills read `$AIRESOURCES`, not that recorded path.
- [LiveSpec](https://github.com/julien-m/livespec) locates this knowledge base through the same variable.

To move the clone, rerun `./setup.sh` from the new location after updating the existing `export AIRESOURCES=` line it reports.

### Optional portable assets

Canonical portable skills and rules live under [`.agent-sync/`](.agent-sync/). They are not required to browse or consume the knowledge base.

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

### Reusable Architecture Patterns

Each pattern explains a concrete use case, component selection, state ownership, lifecycle, failure recovery, examples and validation evidence. Sources support the design; application policies and vendor guarantees are distinguished explicitly.

- **Read** [the architecture pattern template](architecture/_template.md) when adding another reusable example.
- **Read** [Cloudflare job scheduling](architecture/cloudflare-job-scheduling.md) for editable execution times using Durable Objects and Queues, alternatives with Cron/Workflows, and the assessment of the linked DEV.to article.

## Conventions Lifecycle

`$conventions-init` in Codex or `/conventions-init` in Claude Code detects a target project's stack and can generate its `.conventions/` manifest/index, hooks, CI, and opt-in security workflows. `$conventions-refresh` or `/conventions-refresh` updates that materialized state when this knowledge base changes.

Security profiles are explicit: `none`, `baseline`, `production`, `public`, or `web-staging`. **Read** [the security profile reference](.agent-sync/skills/conventions-init/references/security-profiles.md) before selecting one.

## Public Maintenance

- **Read** [`CONTRIBUTING.md`](CONTRIBUTING.md) before changing knowledge-base content or portable assets.
- **Read** [`SECURITY.md`](SECURITY.md) for private disclosure guidance and scanner limits.
- **Read** [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for licensed adaptations and provenance.
- The repository is licensed under the [MIT License](LICENSE).
