---
name: conventions.init
description: "Analyze a project's stack and generate a .conventions/ manifest + index. Use when setting up conventions for a new or existing project."
argument-hint: ""
---

# /conventions.init — Initialize Project Conventions

## Goal
Generate a `.conventions/` directory in the target project containing exactly `manifest.yaml` and `index.md`, plus configured `.gitignore`, `.githooks/pre-commit`, and `.github/workflows/*.yml` matching the detected stack — produced deterministically, with per-phase verification.

## Execution context
- Mode: apply
- Month: 2026-05

## Anti-drift rules (apply to all steps)
- Execute phases in the exact numbered order. Do NOT reorder, parallelise, merge, or skip any phase.
- Do NOT start phase N+1 until phase N success criteria are fully met and observed.
- Do NOT assume a phase already ran. Execute it and capture observable evidence (file paths, command output, exit codes).
- Run listed commands as written. If blocked by policy, stop and report: `BLOCKED at step N - policy_blocked - <one-line reason>`.
- Deterministic failure policy: `timeout=90s`, `max_retries=1` per command unless overridden.
- If a command fails after allowed retries, stop. Do NOT silently substitute alternative commands.
- "Probably works", "looks correct" are not success criteria — verification is mandatory.
- Confirmation gates (Phase 3, Phase 6) must surface to the user; never auto-confirm on the user's behalf.
- Never write secrets in generated files.

## Steps

### 1. Verify prerequisites and target context
**Prerequisite**: None.

**Required inputs/resources**:
- `pwd` (must be the target project, NOT `~/projects/ai-ressources/`)
- `~/projects/ai-ressources/` directory must exist

**Action**:
1. Run `pwd` and confirm path does not equal `~/projects/ai-ressources` (or its realpath).
2. Run `test -d ~/projects/ai-ressources && test -f ~/projects/ai-ressources/.last-updated`.

**Execution evidence**:
- Resolved `pwd` value
- Exit code of the directory check (must be 0)

**Success criteria**:
- pwd ≠ ai-ressources path
- ai-ressources tree present and readable

**If this step fails**:
- Retry once.
- On terminal failure: `ERROR step=1 type=missing_dependency retry_count=<n> timed_out=false message="<reason>"`. Stop.

---

### 2. Analyze the target project (Phase 1 — gather signals)
**Prerequisite**: Step 1 success criteria met.

**Required inputs/resources**:
- Project root files: `.specs/stacks/_default.md`, `package.json`, `go.mod`, `Cargo.toml`, `Podfile`, `*.dproj`, `requirements.txt`, `pyproject.toml`, `Gemfile`, `CLAUDE.md`
- Excluded paths: `node_modules/`, `dist/`, `build/`, `.git/`, `.conventions/`, `vendor/`, `target/`, `.next/`, `.nuxt/`, `.output/`

**Action**:
1. **Spec stack** — if `.specs/stacks/_default.md` exists, parse first table with `Layer` or `Technology` header; extract layer→choice pairs as `spec_signals`.
2. **Dependencies** — read each dependency file present; extract package/module names into `deps`.
3. **File extensions** — glob (excluding the paths above) into `extensions`.
4. **Project context** — read `CLAUDE.md` if present; extract declared stack, conventions, description into `claudeMd`.
5. **Project type** — deduce from the four signals above into `projectType`.

**Execution evidence**:
- Counts: `len(spec_signals)`, `len(deps)`, `len(extensions)`, `claudeMd present? y/n`
- Resolved `projectType` string

**Success criteria**:
- All present source files were read; absent files were skipped silently.
- At least one signal source returned data (greenfield-only with no `.specs/` and no deps must explicitly stop with `BLOCKED at step 2 - no_signals - cannot detect anything`).

**If this step fails**:
- Retry once for transient read errors.
- Terminal: `ERROR step=2 type=command_failed ...`. Stop.

---

### 3. Detect relevant domains (Phase 2 — channels)
**Prerequisite**: Step 2 success criteria met; signals available.

**Required inputs/resources**:
- **Read** [`references/package-mapping.md`](references/package-mapping.md)
- **Read** [`references/architecture-signals.md`](references/architecture-signals.md)
- **Read** [`references/project-type-signals.md`](references/project-type-signals.md)
- Dynamic scan of `~/projects/ai-ressources/{stack-ref,architecture,design,copywriting,code-conventions,conventions}/**/*.md`
- **Read** [`~/projects/ai-ressources/domain-catalog.md`](~/projects/ai-ressources/domain-catalog.md) (when caller-provided signals exist or when `spec_signals` non-empty)

**Action** (run channels in order, then union):
1. **Catalog-Based Detection** — if caller passed signals, match them against `domain-catalog.md`; collected paths are primary, never overridden by later channels.
2. **Channel 1 — file extensions → code-conventions** (language deltas):
   | Extensions | Source files (in `code-conventions/`) |
   |---|---|
   | `.ts/.tsx/.js/.jsx` | `general + architecture + logging + testing + javascript` |
   | `.go` | `general + architecture + logging + testing + go` |
   | `.rs` | `general + architecture + logging + testing + rust` |
   | `.swift/.kt` | `general + architecture + logging + testing + swift-kotlin` |
   | `.pas/.dfm/.dproj` | `general + architecture + logging + testing + delphi` |
   | `.sql`, `migration|schema` in path | `database` |
   | `.css/.scss` | `design/tokens/*` |
   | `.tsx/.jsx/.svelte/.vue` | `design/components/*` |
   | `.swift` UI / `.xib/.storyboard` | `design/systems/apple-hig + design/tokens/*` |
   | `.kt` UI / layout xml | `design/systems/material-design + design/tokens/*` |
   | `.pen` | `design/references/mockup-specs` |
   | `.md` w/ mermaid|gherkin OR `.specs/` exists | `conventions/diagrams` |
3. **Channel 1b — framework deltas** (deps + config files):
   | Signal | Delta |
   |---|---|
   | `react/.tsx JSX` | `react.md` |
   | `next, next.config.*` | `nextjs.md` |
   | `@shadcn/ui, components/ui/, components.json` | `shadcn.md` |
   | `tailwindcss, tailwind.config.*` | `tailwind.md` |
   | `wrangler.{toml,jsonc}, @cloudflare/*, hono` | `cloudflare.md` |
   | `@tanstack/react-{query,router,start}` | `tanstack.md` |
   | `drizzle-orm, drizzle-kit, drizzle.config.*` | `drizzle.md` |
   | `@prisma/client, prisma/schema.prisma` | `prisma.md` |
   | `remotion, @remotion/*, remotion.config.*` | `remotion.md` |
4. **Spec-Aware Detection** — resolve `spec_signals` through `domain-catalog.md`; union with channels above.
5. **Channel 2 — deps → stack-ref + architecture** via `package-mapping.md` and grep against `architecture-signals.md`.
6. **Channel 2b — deps → design-* sub-domains**:
   | Signal | Sub-domain |
   |---|---|
   | Any other `design-*` detected | `design-tokens` (always include) |
   | `react/vue/svelte/solid-js/@shadcn-ui/radix-ui/@radix-ui/*/@headlessui/*/@mantine/*` OR `.tsx/.jsx/.svelte/.vue` | `design-components` |
   | `next/nuxt/@sveltejs/kit/@remix-run/*/astro` OR `pages//app//routes/` | `design-views` |
   | `design-components` OR `design-views` detected | `design-quality` |
   | `recharts/chart.js/d3/victory/@tremor/*/plotly.js/nivo/@visx/*` OR `dashboard|metrics|analytics` in src | `design-dataviz` |
   | `ws/socket.io/ably/pusher-js/partysocket` OR `WebSocket|EventSource|SSE|useWebSocket` in src | `design-realtime` |
   `design` alone is NEVER valid — always a `design-*` sub-domain.
7. **Channel 3** — `references/project-type-signals.md` → design-*/copywriting/quality.

**Execution evidence**:
- Final `detectedDomains` map: `{category: [files]}` with explicit non-empty list per category, or `[]`.
- For each domain entry, the channel(s) that contributed it.

**Success criteria**:
- Every detection-category key is present in the canonical detection set: `code`, `design-tokens`, `design-components`, `design-views`, `design-quality`, `design-dataviz`, `design-realtime`, `copywriting`, `legal`, `pricing`, `diagrams`, **`stack`** (Channel 2 stack-ref/... results), **`architecture`** (Channel 2 architecture/... results). The first 11 are also valid manifest domain keys; `stack` and `architecture` are detection-only — at step 5 their files are folded into the `code` array (see Phase 4.0 mapping rules).
- No bare `design` key.
- Catalog results never overridden by later channels.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=3 type=verification_failed ...`. Stop.

---

### 4. Confirm detected domains with the user (Phase 3)
**Prerequisite**: Step 3 success criteria met.

**Required inputs/resources**:
- `detectedDomains` from step 3, project name from `pwd`.

**Action**:
1. Print the grouped summary (Code / Frameworks / Architecture / Stack / Design / Copywriting / Diagrams) with `✓` per detected item and `(... not detected — add if needed)` for absent design sub-domains.
2. End with `Confirm? (or add/remove domains)`.
3. Wait for explicit user reply. Apply add/remove instructions; re-print on edit.

**Execution evidence**:
- Verbatim user reply (`confirm` or edit list).
- Final confirmed `detectedDomains`.

**Success criteria**:
- User explicitly confirmed (no implicit assumption).
- Final domain set differs from step 3 only by user-requested edits.

**If this step fails**:
- Re-prompt up to 1 retry.
- Terminal (no reply): `BLOCKED at step 4 - awaiting_user_confirmation`. Stop.

---

### 5. Generate `.conventions/` via build-conventions.ts (Phase 4)
**Prerequisite**: Step 4 confirmed.

**Required inputs/resources**:
- Confirmed `detectedDomains`
- `~/projects/ai-ressources/scripts/build-conventions.ts`

**Action**:
1. **Construct domains JSON** (Phase 4.0 mapping rules, verbatim):
   - `design-*` keys → always `[]`.
   - `code` array contains explicit framework/language/transversal files (e.g. `nextjs`, `drizzle`, `testing`, `logging`, `runtime-configs`). Exclude `general` and `database` (auto-resolved via `extends`).
   - `legal`, `pricing`, etc. → as detected.
   - Greenfield (no code) → `code: []`.
2. Run:
   ```bash
   bun run ~/projects/ai-ressources/scripts/build-conventions.ts "$(pwd)" '<DOMAINS_JSON>'
   ```
   `timeout=90s`, `max_retries=1`.

**Execution evidence**:
- Captured stdout containing `✓` lines per domain plus `✓ .conventions/manifest.yaml` and `✓ .conventions/index.md`.
- `ls .conventions/` showing exactly `manifest.yaml` and `index.md`.

**Success criteria**:
- Exit code 0.
- `.conventions/` contains ONLY `manifest.yaml` + `index.md` — no `design.md`, `code.md`, `conventions.manifest.json`, or any per-domain `.md`.
- Each requested domain appears in `manifest.yaml`.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=5 type=command_failed retry_count=1 timed_out=<bool> message="<stderr>"`. Stop.

---

### 6. Update `.gitignore` for `.conventions/` (Phase 5)
**Prerequisite**: Step 5 success criteria met.

**Required inputs/resources**: project `.gitignore`, `.git/` presence.

**Action**:
- If `.gitignore` exists and lacks `.conventions/` → append `\n# Materialized conventions\n.conventions/\n`.
- If absent and `.git/` exists → create `.gitignore` with `.conventions/\n`.
- If no `.git/` → skip.

**Execution evidence**:
- Diff or hash of `.gitignore` before/after, or explicit "skipped (no .git)".

**Success criteria**:
- `.gitignore` either contains `.conventions/` or step skipped due to no git.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=6 type=command_failed ...`. Stop.

---

### 7. Config audit (Phase 6)
**Prerequisite**: Step 6 complete.

**Required inputs/resources**:
- **Read** [`~/projects/ai-ressources/code-conventions/runtime-configs.md`](~/projects/ai-ressources/code-conventions/runtime-configs.md)
- Project lockfiles + config files

**Action**:
1. Detect runtime via lockfile/config table; detect languages via step 2 extensions.
2. If no supported language → skip Phase 7 entry section ("Config audit: not applicable").
3. Audit `.gitignore` against language layers; append only missing patterns. Auto-apply, no confirmation.
4. Audit config files (TypeScript first):
   - Classify each item as `ok | fix | create | signal`.
5. Print grouped summary (`.gitignore`, `tsconfig.json`, `package.json`, Files to create, ℹ signals) and end with `Apply? (y/n, or list items to skip)`.
6. Wait for confirmation. Apply via JSON merge for `.json`. Auto-create files marked `auto`. Skip per user list. Display `Config audit: all checks passed ✓` if everything was `ok` (no prompt).

**Execution evidence**:
- Verbatim summary printed; user reply captured; per-item action log (`fixed`, `created`, `skipped`).

**Success criteria**:
- No file modified that the user explicitly skipped.
- All `fix`/`create` items either applied or recorded as skipped.

**If this step fails**:
- Retry once for filesystem writes.
- Terminal: `ERROR step=7 type=<command_failed|verification_failed> ...`. Stop.

---

### 8. Pre-commit hook (Phase 7)
**Prerequisite**: Step 7 complete.

**Required inputs/resources**:
- **Read** [`~/projects/ai-ressources/code-conventions/stack-commands.md`](~/projects/ai-ressources/code-conventions/stack-commands.md)
- Project root markers, existing `.githooks/pre-commit`

**Action**:
1. Detect stacks per `stack-commands.md`. If none → print `No supported stack detected — skipping pre-commit hook`. Skip rest of step.
2. If `.githooks/pre-commit` exists:
   - Sentinel `# @generated by conventions.init` present → overwrite without prompt.
   - No sentinel → ask user; await confirmation. No reply → `BLOCKED at step 8 - awaiting_user_confirmation`.
3. Generate POSIX `#!/bin/sh` script with sentinel, stack label, `set -e`, `check()` helper, per-stack tool guard (`command -v`) + `check` calls. Single-stack guard fails closed (`exit 1`); multi-stack uses `_ran=0` counter and warns when no tool found.
4. **Staged-file linters MUST use** `git diff --cached --name-only --diff-filter=ACMR -z -- '<pathspec>' | xargs -0 <linter>` — never newline splitting, never `eval "$file"` on filenames.
5. `chmod +x .githooks/pre-commit`.
6. If `.git/` present: `git config core.hooksPath .githooks`. Else print: `No .git/ found — run \`git config core.hooksPath .githooks\` after \`git init\``.
7. If `.githooks/` is in `.gitignore` → ask confirmation before removing; never auto-remove.
8. Print confirmation block (Stack / Commands / Location / Hook path).

**Execution evidence**:
- File `.githooks/pre-commit` exists with sentinel and exec bit (`ls -l`).
- `git config core.hooksPath` returns `.githooks` (when applicable).

**Success criteria**:
- Hook is executable, contains sentinel, and runs `set -e`.
- Hooks path configured or explicit "no .git" note printed.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=8 type=<command_failed|verification_failed> ...`. Stop.

---

### 9. CI workflows (Phase 8)
**Prerequisite**: Step 8 complete.

**Required inputs/resources**:
- `.git/` must exist (else skip entire step).
- **Read** [`references/templates/`](references/templates/)
- `gh` CLI for visibility check

**Action**:
1. List available templates in `references/templates/`.
2. Map detected stacks → CI templates per `stack-commands.md` "CI Template" column. Always include `security.yml`. Stacks with `—` → skip.
3. Repo visibility:
   ```bash
   gh repo view --json visibility -q '.visibility'
   ```
   - Public → include `codeql.yml`, replace `__LANGUAGES__` with comma-separated CodeQL identifiers.
   - Private or `gh` unavailable → skip CodeQL.
4. If npm/Node.js stack → generate `.github/dependabot.yml` from `dependabot-npm.yml`.
5. `mkdir -p .github/workflows`.
6. Per file:
   - Missing → create from template.
   - Sentinel `# @generated by conventions.init` present → overwrite.
   - No sentinel → diff + ask `replace / keep` (default `keep`).
7. Output filenames per table: `ci-node.yml/ci-python.yml/ci-go.yml/ci-rust.yml/ci-dotnet.yml → .github/workflows/ci.yml`; multi-stack additional → `.github/workflows/ci-<stack>.yml`. `security.yml`, `codeql.yml`, `dependabot-npm.yml → .github/dependabot.yml`.
8. Print summary block.

**Execution evidence**:
- File listing of `.github/workflows/` and `.github/dependabot.yml` after run.
- Captured user replies for each non-sentinel overwrite.

**Success criteria**:
- All applicable CI files written or explicitly kept on user choice.
- CodeQL state matches visibility detection.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=9 type=<command_failed|policy_blocked|verification_failed> ...`. Stop.

---

### 10. Manifest stack update + completion summary
**Prerequisite**: Step 9 complete (or skipped because no `.git/`).

**Required inputs/resources**: `.conventions/manifest.yaml`, results from steps 8–9.

**Action**:
1. Append `stack:` block to `manifest.yaml` (labels, markers, hookGenerated, ciGenerated[], dependabotGenerated). Done by the skill, NOT by `build-conventions.ts`.
2. Print final completion block: domains/sources, config audit counts, pre-commit confirmation, CI workflows summary.

**Execution evidence**:
- `grep -A6 '^stack:' .conventions/manifest.yaml` shows the block.
- Completion block printed verbatim.

**Success criteria**:
- `stack:` block present and parseable as YAML.
- Completion block printed.

**If this step fails**:
- Retry once.
- Terminal: `ERROR step=10 type=verification_failed ...`. Stop.

---

## Done
The task is complete when ALL of the following are true:
- [ ] Step 1 success criteria met (correct cwd, ai-ressources present)
- [ ] Step 2 success criteria met (signals gathered)
- [ ] Step 3 success criteria met (canonical domains map produced)
- [ ] Step 4 success criteria met (user confirmation captured)
- [ ] Step 5 success criteria met (`.conventions/` contains only `manifest.yaml` + `index.md`)
- [ ] Step 6 success criteria met (.gitignore handled or skipped)
- [ ] Step 7 success criteria met (config audit applied or all-ok)
- [ ] Step 8 success criteria met (hook installed or no-stack note)
- [ ] Step 9 success criteria met (CI files written or no-git skip)
- [ ] Step 10 success criteria met (manifest stack block + summary)
- [ ] No phase was skipped, reordered, parallelised
- [ ] No unresolved ambiguity remains
- [ ] Month is present in `Execution context`

Report: `DONE` or `BLOCKED at step N - <one-line reason>`.

## Final consistency check
- Every step has prerequisite, required inputs, action, evidence, success criteria, failure handling.
- Failure uses `timeout=90s, max_retries=1` and the canonical `ERROR step=N ...` line.
- Policy-block uses `BLOCKED at step N - policy_blocked - <reason>`.
- All actions and success criteria are observable.
- `.conventions/` end-state strictly equals `{manifest.yaml, index.md}` after step 5.

## Drift tests (mini-suite)
1. Skip Phase 3 user confirmation → expected: BLOCKED at step 4 (awaiting_user_confirmation).
2. Run `build-conventions.ts` before confirmation → expected: BLOCKED at step 5 (prerequisite unmet).
3. `.conventions/` ends with extra `code.md` → expected: BLOCKED at step 5 (success criterion violated).
4. `gh` unavailable on public repo → expected: CodeQL skipped + WARN, step 9 still passes.
5. Pre-commit hook generated using `eval "$file"` on staged files → expected: BLOCKED at step 8 (success criterion violated — must use `xargs -0`).
6. Phase 8 attempted with no `.git/` → expected: step 9 fully skipped, step 10 still required.
7. `bun run build-conventions.ts` exit ≠ 0 → expected: ERROR step=5 type=command_failed, no further steps.
