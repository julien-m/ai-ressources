# Conventions Manifest Architecture — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace compiled `.conventions/<domain>.md` files with a manifest-based reference system — `manifest.yaml` (exact ai-ressources paths + exclusion filters) + ultra-light `index.md` (routing table). Split the monolithic `design` domain into 6 task-focused sub-domains.

**Architecture:** Two-file convention system per project. `manifest.yaml` lists exact source file paths + optional exclusion filters per sub-domain. `index.md` is a 30–60 line routing table with dense keywords and direct file references. Claude reads the index to identify the sub-domain, then reads source files directly from ai-ressources. No compiled content. No duplication across projects. Always fresh.

**Tech Stack:** YAML, Markdown, TypeScript/Bun (`build-conventions.ts`), JSON Schema (YAML), cc-hub CLI

---

## File Map

| File | Change |
|------|--------|
| `design/components/data-visualization.md` | Remove `## Terminal — Visualisation` section (lines 93–170, keeping preceding `---` separator) |
| `design/components/data-visualization-terminal.md` | **Create** — extracted Terminal section |
| `design/components/realtime-streams.md` | Remove `## Terminal — Patterns specifiques` section (lines 133–144) |
| `design/components/realtime-streams-terminal.md` | **Create** — extracted Terminal section |
| `design/index.yaml` | Add `sub_domains:` block with 6 entries (no `exclude_sections` on dataviz/realtime since Terminal is extracted) |
| `schemas/domain-index.schema.yaml` | Add `sub_domains` property definition |
| `scripts/build-conventions.ts` | Refactor: generate `manifest.yaml` + `index.md`, no compiled content |
| `claude/rules/conventions-preload.md` | Rewrite loading procedure for manifest-based system |
| `.agent-sync/skills/conventions-init/SKILL.md` | Update Phase 3 display + Phase 4.0 JSON example + Phase 4.1 script behavior |
| `.agent-sync/skills/conventions-refresh/SKILL.md` | Rewrite for manifest-based system (date-vs-.last-updated staleness) |

---

## Tasks 1 & 2 are INDEPENDENT — run in parallel

### Task 1: Extract Terminal sections from design source files

**Files:**
- Modify: `design/components/data-visualization.md`
- Create: `design/components/data-visualization-terminal.md`
- Modify: `design/components/realtime-streams.md`
- Create: `design/components/realtime-streams-terminal.md`

- [ ] **Step 1: Confirm exact line ranges**

```bash
cd /Users/julienm/projects/ai-ressources
grep -n "^## Terminal\|^## Web\|^## Heartbeat" \
  design/components/data-visualization.md \
  design/components/realtime-streams.md
```

Expected:
```
data-visualization.md:93:## Terminal — Visualisation
data-visualization.md:171:## Web — Visualisation
realtime-streams.md:133:## Terminal — Patterns specifiques
realtime-streams.md:145:## Heartbeat et health check
```

Terminal section in `data-visualization.md` = lines **93–170**. The `---` separator on line 91 and blank on line 92 are the preceding section boundary — do NOT include them in the extracted file and do NOT delete them from the original.

Terminal section in `realtime-streams.md` = lines **133–144** (line 133 is the header, line 143 is the `---` separator closing it, line 144 is the blank line before the next section).

- [ ] **Step 2: Create data-visualization-terminal.md**

Create `design/components/data-visualization-terminal.md`:
```markdown
# Data Visualization — Terminal

Patterns de visualisation de données pour interfaces terminal (ASCII charts, sparklines, histogrammes). Extrait de `data-visualization.md`.

```
Then append lines **93–170** of `design/components/data-visualization.md` verbatim (starting at `## Terminal — Visualisation`, ending before line 171 `## Web — Visualisation`).

- [ ] **Step 3: Remove Terminal section from data-visualization.md**

Delete lines **93–170** from `design/components/data-visualization.md`. After deletion:
- Line 91 (`---`) and the `## Web — Visualisation` header should be adjacent (separated only by blank line 92)
- Verify:
```bash
wc -l design/components/data-visualization.md
# Expected: 368 - 78 = 290 lines
grep -n "^## " design/components/data-visualization.md
# Terminal section must be absent; Web — Visualisation must be present
```
Re-read the file around the deletion point to confirm no stray separators or broken headings.

- [ ] **Step 4: Create realtime-streams-terminal.md**

Create `design/components/realtime-streams-terminal.md`:
```markdown
# Realtime Streams — Terminal

Patterns spécifiques aux interfaces terminal pour flux temps réel (ANSI cursor, buffering CLI). Extrait de `realtime-streams.md`.

```
Then append lines **133–144** of `design/components/realtime-streams.md` verbatim (starting at `## Terminal — Patterns specifiques`, ending with the blank line before `## Heartbeat et health check`).

- [ ] **Step 5: Remove Terminal section from realtime-streams.md**

Delete lines **133–144** from `design/components/realtime-streams.md`. After deletion:
- `## Heartbeat et health check` should directly follow the `## Token Streaming (LLM)` section's closing `---` separator
- Verify:
```bash
wc -l design/components/realtime-streams.md
# Expected: 195 - 12 = 183 lines
grep -n "^## " design/components/realtime-streams.md
# Terminal section must be absent; Heartbeat must still be present
```
Re-read the file around the deletion point to confirm no stray separators.

- [ ] **Step 6: Verify line count conservation**

```bash
wc -l design/components/data-visualization.md \
       design/components/data-visualization-terminal.md \
       design/components/realtime-streams.md \
       design/components/realtime-streams-terminal.md
```

Sum: `data-visualization.md` + `data-visualization-terminal.md` minus the 4-line header = original 368. `realtime-streams.md` + `realtime-streams-terminal.md` minus 4-line header = original 195.

- [ ] **Step 7: Add new files to design/index.yaml components section**

In `design/index.yaml`, add after the `realtime-streams.md` entry:

```yaml
      - file: components/data-visualization-terminal.md
        description: "Data visualization for terminal interfaces: ASCII sparklines, histograms, status bars (extracted from data-visualization.md)"
        use_when: ["terminal data viz", "ASCII chart", "CLI dashboard", "terminal sparkline", "ANSI data viz"]
        questions_answered: ["ASCII sparkline pattern?", "Terminal histogram?", "CLI status bar?"]
        see_also: ["components/data-visualization.md"]

      - file: components/realtime-streams-terminal.md
        description: "Real-time streaming patterns for terminal interfaces: ANSI cursor control, CLI buffering (extracted from realtime-streams.md)"
        use_when: ["terminal streaming", "ANSI realtime", "CLI live output", "tail -f pattern", "terminal buffering"]
        questions_answered: ["Terminal streaming pattern?", "ANSI cursor streaming?"]
        see_also: ["components/realtime-streams.md"]
```

- [ ] **Step 8: Commit Task 1**

Use `/git.commit`. Message: `refactor(design): extract Terminal sections into separate files (data-viz, realtime)`

---

### Task 2: Add sub_domains schema and populate design/index.yaml

**Files:**
- Modify: `schemas/domain-index.schema.yaml`
- Modify: `design/index.yaml`

- [ ] **Step 1: Add sub_domains to domain-index schema**

In `schemas/domain-index.schema.yaml`, in the `properties:` block (after the `sections:` property — the schema uses `additionalProperties: false` at root, so `sub_domains` must be registered here or it fails validation):

```yaml
  sub_domains:
    type: object
    description: Named sub-domain groupings used by build-conventions to generate granular manifest entries. Keys must use the format "<domain>-<name>" (e.g., design-tokens).
    additionalProperties:
      type: object
      required: [label, keywords, sources]
      additionalProperties: false
      properties:
        label:
          type: string
          minLength: 1
        keywords:
          type: array
          items: {type: string}
          minItems: 1
        sources:
          type: array
          items: {type: string}
          minItems: 1
        exclude_columns:
          type: array
          items: {type: string}
        exclude_sections:
          type: array
          items: {type: string}
```

- [ ] **Step 2: Validate schema change doesn't break existing indexes (pre-sub_domains state)**

```bash
cd /Users/julienm/projects/ai-ressources
check-jsonschema --schemafile schemas/domain-index.schema.yaml design/index.yaml
check-jsonschema --schemafile schemas/domain-index.schema.yaml architecture/index.yaml
check-jsonschema --schemafile schemas/domain-index.schema.yaml code-conventions/index.yaml
```

All must pass before proceeding. If any fail, fix the schema first.

- [ ] **Step 3: Add sub_domains block to design/index.yaml**

**Important:** Task 1 must be complete before committing Task 2. The `design-dataviz` and `design-realtime` sub-domains reference source files WITHOUT `exclude_sections` because Task 1 physically extracts the Terminal sections. Do NOT add `exclude_sections` to these sub-domains.

Append at the end of `design/index.yaml` (after the `quality:` section):

```yaml

sub_domains:
  design-tokens:
    label: "Design tokens — colors, spacing, typography, motion"
    keywords: [CSS, colors, couleurs, spacing, typography, typo, motion, gradients, shadows, "CSS variables", border-radius, palette, "dark mode", "color scale"]
    sources:
      - tokens/colors.md
      - tokens/spacing.md
      - tokens/typography.md
      - tokens/motion.md
    exclude_columns: ["iOS (pt)", "Android (dp)", "Native (sp)"]

  design-components:
    label: "UI components — buttons, inputs, forms, modals, nav, toasts, lists"
    keywords: [button, input, form, toast, badge, modal, nav, sidebar, dropdown, avatar, list, feedback, alert, banner, skeleton, "empty state", navigation, breadcrumb, tabs, "icon button", "button group"]
    sources:
      - references/app-ui.md
      - components/buttons.md
      - components/forms.md
      - components/feedback.md
      - components/navigation.md
      - components/modals.md
      - components/lists.md

  design-views:
    label: "Pages & layouts — SaaS views, dashboard, settings, auth, mockup specs"
    keywords: [page, vue, layout, dashboard, settings, auth, SaaS, mockup, wireframe, "landing page", "app shell", "sidebar layout", "standard views", "view composition", "settings page", "activity log", "user management"]
    sources:
      - references/app-views.md
      - references/app-views-catalog.md
      - references/mockup-specs.md
      - systems/web-standards.md

  design-quality:
    label: "Quality & accessibility — a11y, WCAG, audit, UI rules, non-regression"
    keywords: [accessibilité, a11y, WCAG, audit, "keyboard nav", "screen reader", focus, ARIA, contrast, "color blind", "reduced motion", "non-regression", overflow, alignment, "visual QA"]
    sources:
      - quality/accessibility.md
      - quality/ui-rules.md

  design-dataviz:
    label: "Data visualization — charts, metrics, KPIs, dashboard, sparklines"
    keywords: [chart, graphe, metrics, dashboard, sparkline, KPI, "line chart", "bar chart", "area chart", histogram, "pie chart", "donut chart", "number formatting", "metric card", recharts, d3, tremor]
    sources:
      - components/data-visualization.md

  design-realtime:
    label: "Real-time UI — WebSocket, SSE, streaming LLM, token streaming"
    keywords: [WebSocket, SSE, "real-time", "temps réel", streaming, LLM, "token streaming", reconnect, "optimistic updates", "live updates", "chat UI", buffering, "socket.io", ably, pusher]
    sources:
      - components/realtime-streams.md
```

Note: no `exclude_sections` on `design-dataviz` or `design-realtime` — Task 1 extracts Terminal sections physically.

- [ ] **Step 4: Validate design/index.yaml post-edit**

```bash
cd /Users/julienm/projects/ai-ressources
check-jsonschema --schemafile schemas/domain-index.schema.yaml design/index.yaml
```

Expected: no errors.

- [ ] **Step 5: Commit Task 2** (after Task 1 is committed)

Use `/git.commit`. Message: `feat(conventions): add sub_domains schema + populate 6 design sub-domains in design/index.yaml`

---

## Task 3: Refactor build-conventions.ts — manifest generator (after Tasks 1 & 2)

**Files:**
- Modify: `scripts/build-conventions.ts`

**New behavior:** Resolve `design-*` keys from `design/index.yaml` sub_domains. Resolve code extends chain for file list (no content). Write `manifest.yaml` + `index.md`. **No compiled content. No per-domain `.md` files.**

**Output — manifest.yaml** (`.conventions/manifest.yaml`):
```yaml
ai_resources_path: /Users/julienm/projects/ai-ressources
generated: 2026-04-14
project: my-project

domains:
  design-tokens:
    label: Design tokens — colors, spacing, typography, motion
    keywords: [CSS, colors, spacing, typo, motion, gradients, shadows, "CSS variables"]
    sources:
      - design/tokens/colors.md
      - design/tokens/spacing.md
      - design/tokens/typography.md
      - design/tokens/motion.md
    exclude_columns: ["iOS (pt)", "Android (dp)", "Native (sp)"]

  code:
    label: "Code conventions — javascript, nextjs, drizzle"
    keywords: [code, tests, logging, naming, TypeScript, imports, architecture]
    sources:
      - code-conventions/general.md
      - code-conventions/javascript.md
      - code-conventions/nextjs.md
      - code-conventions/drizzle.md
```

**Output — index.md** (`.conventions/index.md`):
```markdown
# Conventions · my-project

> Match your task to domain keywords → **Read** the listed files from ai-ressources. Apply ⊘ exclusions mentally.
> `$AIRESOURCES` = `/Users/julienm/projects/ai-ressources`

## design-tokens [CSS, colors, spacing, typo, motion, gradients, shadows, CSS variables]
→ $AIRESOURCES/design/tokens/colors.md, spacing.md, typography.md, motion.md
⊘ colonnes: iOS (pt), Android (dp), Native (sp)

## design-components [button, input, form, toast, badge, modal, nav, sidebar, dropdown]
→ $AIRESOURCES/design/references/app-ui.md
→ $AIRESOURCES/design/components/buttons.md, forms.md, feedback.md, navigation.md, modals.md, lists.md
```

**Index `→` line format:** The directory prefix on each `→` line applies to ALL filenames listed on that line. Files from different directories appear on separate `→` lines:
```
→ $AIRESOURCES/design/tokens/colors.md, spacing.md, typography.md, motion.md
→ $AIRESOURCES/design/references/app-ui.md
```

- [ ] **Step 1: Read current build-conventions.ts in full**

```bash
cat /Users/julienm/projects/ai-ressources/scripts/build-conventions.ts
```

Review before modifying.

- [ ] **Step 2: Define new TypeScript types (replace old DomainManifestEntry)**

At top of file, replace old interface and manifest variable with:

```typescript
interface SubDomainDef {
  label: string;
  keywords: string[];
  sources: string[];
  exclude_columns?: string[];
  exclude_sections?: string[];
}

interface ManifestDomain {
  label: string;
  keywords: string[];
  sources: string[];
  exclude_columns?: string[];
  exclude_sections?: string[];
}

interface Manifest {
  ai_resources_path: string;
  generated: string;
  project: string;
  domains: Record<string, ManifestDomain>;
}
```

- [ ] **Step 3: Add resolveDesignSubDomain function**

Add after `resolveCodeChain`, before the main block:

```typescript
function resolveDesignSubDomain(
  domainKey: string,
  aiResPath: string,
  fileNamesIgnored: string[]
): { domain: ManifestDomain; warnings: string[] } {
  // Warn if caller passes a file list — design-* keys are resolved from index.yaml, not the caller's list
  if (fileNamesIgnored.length > 0) {
    process.stderr.write(`⚠  ${domainKey}: file list is ignored — sub-domain is resolved from design/index.yaml sub_domains\n`);
  }
  const indexPath = join(aiResPath, "design", "index.yaml");
  if (!existsSync(indexPath)) {
    return { domain: { label: domainKey, keywords: [], sources: [] }, warnings: [`Missing design/index.yaml`] };
  }
  const parsed = parseYaml(readFileSync(indexPath, "utf-8")) as Record<string, unknown>;
  const subDomains = parsed?.sub_domains as Record<string, SubDomainDef> | undefined;
  if (!subDomains?.[domainKey]) {
    return {
      domain: { label: domainKey, keywords: [], sources: [] },
      warnings: [`Unknown design sub-domain: ${domainKey} — add it to design/index.yaml sub_domains`],
    };
  }
  const def = subDomains[domainKey];
  const domain: ManifestDomain = {
    label: def.label,
    keywords: def.keywords,
    sources: def.sources.map((s) => `design/${s}`),
  };
  if (def.exclude_columns?.length) domain.exclude_columns = def.exclude_columns;
  if (def.exclude_sections?.length) domain.exclude_sections = def.exclude_sections;
  const warnings: string[] = [];
  for (const src of domain.sources) {
    if (!existsSync(join(aiResPath, src))) warnings.push(`Missing source: ${src}`);
  }
  return { domain, warnings };
}
```

- [ ] **Step 4: Add resolveCodeDomain (replaces buildCodeDomain entirely — delete buildCodeDomain in Step 8)**

```typescript
function resolveCodeDomain(
  names: string[],
  aiResPath: string
): { domain: ManifestDomain; warnings: string[] } {
  const dir = join(aiResPath, "code-conventions");
  const { order, warnings } = resolveCodeChain(names, dir);
  return {
    domain: {
      label: `Code conventions — ${names.join(", ")}`,
      keywords: ["code", "tests", "logging", "naming", "TypeScript", "imports", "architecture"],
      sources: order
        .filter((n) => existsSync(join(dir, `${n}.md`)))
        .map((n) => `code-conventions/${n}.md`),
    },
    warnings,
  };
}
```

- [ ] **Step 5: Add resolveFlatDomain (replaces buildFlatDomain — file list only, no content)**

```typescript
function resolveFlatDomain(
  domainKey: string,
  fileNames: string[],
  aiResPath: string
): { domain: ManifestDomain; warnings: string[] } {
  const subDir = DOMAIN_DIRS[domainKey];
  if (!subDir) {
    return { domain: { label: domainKey, keywords: [], sources: [] }, warnings: [`Unknown flat domain: ${domainKey}`] };
  }
  const warnings: string[] = [];
  const sources: string[] = [];
  for (const name of fileNames) {
    const rel = `${subDir}/${name}.md`;
    if (!existsSync(join(aiResPath, rel))) warnings.push(`Missing file: ${rel}`);
    else sources.push(rel);
  }
  // Note: flat domains emit empty keywords — routing for these domains relies on the index.md quick reference table
  return { domain: { label: `${domainKey} conventions`, keywords: [], sources }, warnings };
}
```

- [ ] **Step 6: Add buildIndexEntry helper**

```typescript
function buildIndexEntry(domainKey: string, domain: ManifestDomain): string {
  const kwLine = `## ${domainKey} [${domain.keywords.join(", ")}]`;

  // Group sources by directory. The directory prefix on each → line applies to ALL filenames on that line.
  // Files from different directories appear on separate → lines.
  const byDir = new Map<string, string[]>();
  for (const src of domain.sources) {
    const slash = src.lastIndexOf("/");
    const dir = slash >= 0 ? src.slice(0, slash) : ".";
    const file = slash >= 0 ? src.slice(slash + 1) : src;
    if (!byDir.has(dir)) byDir.set(dir, []);
    byDir.get(dir)!.push(file);
  }
  const sourceLines = [...byDir.entries()]
    .map(([dir, files]) => `→ $AIRESOURCES/${dir}/${files.join(", ")}`)
    .join("\n");

  const exclusions: string[] = [];
  if (domain.exclude_columns?.length) exclusions.push(`⊘ colonnes: ${domain.exclude_columns.join(", ")}`);
  if (domain.exclude_sections?.length) exclusions.push(`⊘ sections: ${domain.exclude_sections.map((s) => `"${s}"`).join(", ")}`);

  return [kwLine, sourceLines, ...exclusions].join("\n");
}
```

- [ ] **Step 7: Rewrite the main loop**

Replace the existing main loop (from manifest initialization through `writeFileSync index.md`) with:

```typescript
const manifest: Manifest = {
  ai_resources_path: AI_RESOURCES_PATH,
  generated: today,
  project: projectName,
  domains: {},
};

for (const [domainKey, fileNames] of Object.entries(domainsInput)) {
  let domain: ManifestDomain;
  let warnings: string[];

  if (domainKey === "code") {
    ({ domain, warnings } = resolveCodeDomain(fileNames, AI_RESOURCES_PATH));
  } else if (domainKey.startsWith("design-")) {
    ({ domain, warnings } = resolveDesignSubDomain(domainKey, AI_RESOURCES_PATH, fileNames));
  } else {
    ({ domain, warnings } = resolveFlatDomain(domainKey, fileNames, AI_RESOURCES_PATH));
  }

  for (const w of warnings) process.stderr.write(`⚠  ${w}\n`);
  manifest.domains[domainKey] = domain;
  console.log(`✓ ${domainKey} (${domain.sources.length} source(s))`);
}

// Write manifest.yaml
const { stringify: yamlStringify } = await import("yaml");
const manifestPath = join(conventionsDir, "manifest.yaml");
writeFileSync(manifestPath, yamlStringify(manifest, { lineWidth: 100 }), "utf-8");
console.log("✓ .conventions/manifest.yaml");

// Write index.md
const domainEntries = Object.entries(manifest.domains)
  .map(([key, domain]) => buildIndexEntry(key, domain))
  .join("\n\n");

const indexMd = `# Conventions · ${projectName}\n\n> Match your task to domain keywords → **Read** the listed files from ai-ressources. Apply ⊘ exclusions mentally.\n> \`$AIRESOURCES\` = \`${AI_RESOURCES_PATH}\`\n\n${domainEntries}\n`;

writeFileSync(join(conventionsDir, "index.md"), indexMd, "utf-8");
console.log("✓ .conventions/index.md");
```

- [ ] **Step 8: Remove dead code**

Delete: `buildFlatDomain`, `buildCodeDomain`, `sha256Short`, `separator`, `stripFrontmatter`, `DOMAIN_HINTS`, old `DomainManifestEntry` interface, old manifest initialization block, old `indexRows` array, `createHash` import.
Keep: `resolveCodeChain`, `parseExtends`, `DOMAIN_DIRS`, all remaining imports.

- [ ] **Step 9: Smoke test**

```bash
cd /Users/julienm/projects/ai-ressources
mkdir -p /tmp/test-conventions-project
bun run scripts/build-conventions.ts /tmp/test-conventions-project \
  '{"code":["javascript"],"design-tokens":[],"design-components":[],"design-realtime":[]}'

cat /tmp/test-conventions-project/.conventions/manifest.yaml
cat /tmp/test-conventions-project/.conventions/index.md

# CRITICAL: verify no compiled .md domain files exist
ls /tmp/test-conventions-project/.conventions/ \
  | grep -v 'manifest.yaml\|index.md' \
  && echo 'FAIL: unexpected files found' || echo 'PASS: no compiled domain files'

# Verify manifest round-trips correctly
bun -e "
  import { parse } from 'yaml';
  import { readFileSync } from 'fs';
  const m = parse(readFileSync('/tmp/test-conventions-project/.conventions/manifest.yaml','utf-8'));
  console.assert(Array.isArray(m.domains['design-tokens'].keywords) && m.domains['design-tokens'].keywords.length > 0, 'keywords must be non-empty array');
  console.assert(m.domains['design-tokens'].sources.length > 0, 'sources must be non-empty');
  console.log('PASS: manifest round-trip OK');
"

# Verify all source files listed in manifest actually exist on disk
bun -e "
  import { parse } from 'yaml';
  import { readFileSync, existsSync } from 'fs';
  const m = parse(readFileSync('/tmp/test-conventions-project/.conventions/manifest.yaml','utf-8'));
  for (const [key, dom] of Object.entries(m.domains)) {
    for (const src of dom.sources) {
      const full = m.ai_resources_path + '/' + src;
      if (!existsSync(full)) { console.error('FAIL missing:', full); process.exit(1); }
    }
  }
  console.log('PASS: all sources exist on disk');
"
```

- [ ] **Step 10: Commit Task 3**

Use `/git.commit`. Message: `feat(conventions): refactor build-conventions → manifest.yaml + light index.md, no compiled content`

---

## Tasks 4, 5, 6 are INDEPENDENT — run in parallel (all require Task 3)

### Task 4: Rewrite conventions-preload.md rule

**Files:**
- Modify: `claude/rules/conventions-preload.md`

- [ ] **Step 1: Read current conventions-preload.md**

```bash
cat /Users/julienm/projects/ai-ressources/claude/rules/conventions-preload.md
```

- [ ] **Step 2: Rewrite the file**

Replace the full content with:

```markdown
# Conventions Preload

**These rules apply when a `.conventions/` directory exists at the root of the current project.**

## What it is

`.conventions/` contains two files only:
- `index.md` — routing table (~30–60 lines): domain keywords + direct ai-ressources file paths
- `manifest.yaml` — machine-readable: exact source paths + exclusion filters per sub-domain

No compiled content. Source files live in ai-ressources and are read directly.

## Loading

**Before coding, designing, or producing anything covered by conventions:**

1. **Read** `.conventions/index.md` — scan domain keywords to identify your sub-domain
2. **Read** the source files listed for that sub-domain (`→` lines), directly from the `$AIRESOURCES` path shown in the index header
3. Apply `⊘` exclusions mentally when reading (e.g., ignore iOS/Android columns in token tables)

Load only the sub-domain(s) that match your task. Do not pre-load all sub-domains.

### Reading the index

Each entry in `index.md`:
```
## domain-name [kw1, kw2, kw3, ...]
→ $AIRESOURCES/dir/file1.md, file2.md
→ $AIRESOURCES/dir/file3.md
⊘ exclusion note  ← apply mentally when reading
```

The directory prefix on each `→` line applies to ALL filenames listed on that line.

### Sub-domain quick reference

| Task | Sub-domain |
|------|-----------|
| CSS, colors, spacing, typography, motion, dark mode | `design-tokens` |
| Button, input, form, toast, modal, nav, list, badge | `design-components` |
| Page layout, dashboard, settings, auth, mockup specs | `design-views` |
| a11y audit, WCAG, keyboard nav, ARIA, visual QA | `design-quality` |
| Charts, metrics, KPIs, data visualization | `design-dataviz` |
| WebSocket, SSE, streaming, LLM token output, real-time | `design-realtime` |
| Code, tests, logging, naming, imports, architecture | `code` |
| Legal pages, ToS, RGPD, cookies | `legal` |
| Pricing page, billing tiers | `pricing` |
| Marketing copy, landing page | `copywriting` |

**Sub-domain not in index?** Not configured for this project. Use `/ai-res` for ad-hoc, or re-run `/conventions-init` to add it.

## Overrides

When `.conventions/` exists:
- Do NOT call `/ai-res` for topics covered by the manifest
- Do NOT read ai-ressources source files directly without checking the index first — the manifest may declare `⊘` exclusions
- `/ai-res` remains valid for topics outside the manifest scope

## Subagents

When dispatching a subagent that will code or design:
1. Read `.conventions/index.md`
2. Identify the relevant sub-domain(s)
3. Read the source files for those sub-domains directly from ai-ressources (paths from `→` lines in index)
4. Include the content in the subagent prompt under `## Conventions`

The subagent does NOT need to load conventions itself — the dispatching agent reads and includes the content.

## Freshness

Conventions are always fresh — they reference ai-ressources source files directly. No hash comparison needed.

Check `.conventions/manifest.yaml` exists. If not found, or if `.conventions/` contains compiled `.md` domain files (e.g., `design.md`, `code.md` — old format), suggest `/conventions-refresh --full` once to migrate. Do not block.

## Initialization

If `.conventions/` does not exist and the project has code or design files, suggest `/conventions-init` once. Do not block.
```

- [ ] **Step 3: Verify file length**

```bash
wc -l claude/rules/conventions-preload.md
```

Expected: ≤ 80 lines.

- [ ] **Step 4: Sync to global Claude Code**

```bash
cc-hub rule link claude/rules/conventions-preload.md
```

- [ ] **Step 5: Commit Task 4**

Use `/git.commit`. Message: `feat(conventions): rewrite conventions-preload for manifest-based loading`

---

### Task 5: Update conventions-init skill — sub-domain detection + manifest output

**Files:**
- Modify: `.agent-sync/skills/conventions-init/SKILL.md`

- [ ] **Step 1: Read full conventions-init/SKILL.md**

```bash
cat /Users/julienm/projects/ai-ressources/.agent-sync/skills/conventions-init/SKILL.md
```

- [ ] **Step 2: Update Phase 2 — replace `design` with sub-domain detection signals**

Find the section in Phase 2 that handles `design` domain detection. Replace the `design` detection channel with these 6 sub-domain signals:

| Sub-domain | Detect when |
|------------|-------------|
| `design-tokens` | Any other design sub-domain is detected (always include — transversal, small) |
| `design-components` | `.tsx`/`.jsx`/`.svelte`/`.vue` component files exist, OR package has React, Vue, Svelte, Solid, shadcn, radix, headlessui, mantine, etc. |
| `design-views` | Project has Next.js, Nuxt, SvelteKit, Remix, Astro, OR `pages/`/`app/`/`routes/` directory exists |
| `design-quality` | Include whenever `design-components` or `design-views` is detected (accessibility is a default for any web UI) |
| `design-dataviz` | Package has recharts, chart.js, d3, victory, tremor, plotly, nivo, visx; OR source files contain `dashboard`/`metrics`/`analytics` |
| `design-realtime` | Package has ws, socket.io, ably, pusher, partykit; OR source files contain `WebSocket`/`EventSource`/`SSE`/`useWebSocket` |

Remove `design` from all domain detection tables and DOMAIN_DIRS references. It is no longer a valid standalone domain key.

- [ ] **Step 3: Update Phase 3 — confirmation display for design sub-domains**

Update the Phase 3 display format to show sub-domains individually:

```
Design:
  ✓ design-tokens [CSS, colors, spacing, typo, motion]
  ✓ design-components [button, form, modal, nav, toast]
  ✓ design-views [page, layout, dashboard, settings, auth]
  ✓ design-quality [a11y, WCAG, audit]
  (design-dataviz not detected — add if needed)
  (design-realtime not detected — add if needed)
```

- [ ] **Step 4: Update Phase 4.0 — domains JSON construction example**

Replace the old `"design": ["web-standards","forms","colors"]` example with the new `design-*` key format:

```json
{
  "code": ["nextjs", "drizzle"],
  "design-tokens": [],
  "design-components": [],
  "design-views": [],
  "design-quality": [],
  "legal": []
}
```

Note explicitly: `design-*` keys always pass `[]` — the build script reads source paths from `design/index.yaml sub_domains`, not from the caller's file list.

- [ ] **Step 5: Update Phase 4.1 — script expected output**

Update the output description:
```
✓ code (5 source(s))
✓ design-tokens (4 source(s))
✓ design-components (7 source(s))
✓ design-views (4 source(s))
✓ design-quality (2 source(s))
✓ .conventions/manifest.yaml
✓ .conventions/index.md
```

Update "verify output" step: `.conventions/` must contain ONLY `manifest.yaml` and `index.md`. NOT `design.md`, `code.md`, or `conventions.manifest.json`.

- [ ] **Step 6: Sync to global Claude Code**

```bash
cc-hub skill link .agent-sync/skills/conventions-init/SKILL.md
```

- [ ] **Step 7: Commit Task 5**

Use `/git.commit`. Message: `feat(conventions): update conventions-init for sub-domain detection and manifest output`

---

### Task 6: Rewrite conventions-refresh skill — manifest-based, date staleness

**Files:**
- Modify: `.agent-sync/skills/conventions-refresh/SKILL.md`

Current skill does hash-based staleness detection on compiled `.md` files. The new system has no compiled files. Staleness is detected by comparing `manifest.yaml`'s `generated` date against `.last-updated` from ai-ressources.

- [ ] **Step 1: Read full conventions-refresh/SKILL.md**

```bash
cat /Users/julienm/projects/ai-ressources/.agent-sync/skills/conventions-refresh/SKILL.md
```

- [ ] **Step 2: Rewrite the skill content**

Replace full content (keeping frontmatter) with:

```markdown
---
name: conventions-refresh
description: "Check if conventions are stale and regenerate from ai-ressources. Use when conventions may be outdated or after ai-ressources updates."
argument-hint: "[--full]"
---

# /conventions-refresh — Refresh Project Conventions

Check if `.conventions/` is current and reconfigure if needed. Content is always fresh (source files in ai-ressources are read directly). This command focuses on: migrating old format, detecting staleness via ai-ressources date, and reconfiguring when the project stack changes.

## Prerequisites

- Run from the **target project** directory (NOT ai-ressources)
- `~/projects/ai-ressources/` must exist

## Procedure

### Step 1: Detect format

**Case A — Old compiled format detected** (`.conventions/design.md` or `.conventions/conventions.manifest.json` exists):
1. Print: "Old compiled format detected. Migrating to manifest format."
2. Run `/conventions-init` Phases 1–4 (re-detects stack, generates `manifest.yaml` + `index.md`)
3. Delete old compiled files from `.conventions/`: all `*.md` files except `index.md`, and `conventions.manifest.json`
4. Print: "Migration complete. Old compiled files removed."
5. Stop here.

**Case B — No `.conventions/` or no `manifest.yaml`:**
1. Print: "No `.conventions/manifest.yaml` found. Run `/conventions-init` to set up."
2. Stop here.

**Case C — `manifest.yaml` exists:** proceed to Step 2.

### Step 2: Detect staleness via date comparison

```bash
# Read generated date from manifest
MANIFEST_DATE=$(grep "^generated:" .conventions/manifest.yaml | awk '{print $2}')

# Read last ai-ressources update date
AI_RES_PATH=$(grep "^ai_resources_path:" .conventions/manifest.yaml | awk '{print $2}')
LAST_UPDATED=$(cat "$AI_RES_PATH/.last-updated" 2>/dev/null || echo "unknown")

echo "Manifest generated: $MANIFEST_DATE"
echo "ai-ressources last updated: $LAST_UPDATED"
```

**If `.last-updated` does not exist:**
- Warn: "Cannot read `ai-ressources/.last-updated` — run `/conventions-refresh --full` to force refresh."
- Stop here.

**If `LAST_UPDATED` ≤ `MANIFEST_DATE`:** print "Conventions up to date." and stop.

**If `LAST_UPDATED` > `MANIFEST_DATE`:** ai-ressources has changed. Proceed to Step 3.

### Step 3: Rebuild manifest with same domains

Reconstruct the domains JSON from `manifest.yaml` keys:
- `design-*` keys → pass `[]`
- `code` key → pass source filenames (strip `code-conventions/` prefix and `.md` extension)
- other keys → pass source filenames (strip domain dir prefix and `.md` extension)

```bash
# Build domains JSON from manifest and re-run
DOMAINS_JSON=$(bun -e "
  import { parse } from 'yaml';
  import { readFileSync } from 'fs';
  const m = parse(readFileSync('.conventions/manifest.yaml','utf-8'));
  const domains = {};
  for (const [key, dom] of Object.entries(m.domains)) {
    if (key.startsWith('design-')) {
      domains[key] = [];
    } else if (key === 'code') {
      domains[key] = dom.sources.map(s => s.replace('code-conventions/','').replace('.md',''));
    } else {
      const prefix = Object.keys(dom.sources[0]?.split('/') || {}).join('/');
      domains[key] = dom.sources.map(s => s.split('/').pop().replace('.md',''));
    }
  }
  console.log(JSON.stringify(domains));
")
bun run ~/projects/ai-ressources/scripts/build-conventions.ts "$(pwd)" "$DOMAINS_JSON"
```

### Step 4: Stack tracking (unchanged from previous behavior)

Compare detected stack markers with what was last used. If markers changed, regenerate hook/CI config.

### --full flag

Skip staleness check. Re-run `/conventions-init` Phases 1–4 from scratch. Use when project stack changed significantly or when in doubt.

## What "refresh" does NOT do

- Does NOT recompile content (nothing to compile)
- Does NOT check SHA256 hashes of source files (date comparison replaces hash comparison)
- Does NOT generate domain `.md` files (manifest architecture produces only `manifest.yaml` + `index.md`)
```

- [ ] **Step 3: Sync to global Claude Code**

```bash
cc-hub skill link .agent-sync/skills/conventions-refresh/SKILL.md
```

- [ ] **Step 4: Commit Task 6**

Use `/git.commit`. Message: `feat(conventions): rewrite conventions-refresh for manifest-based system`

---

## Task 7: Sync indexes (after all Tasks complete)

**Files:**
- Modify: `index.yaml` (root)
- Modify: `domain-catalog.md`

- [ ] **Step 1: Update root index.yaml — last_reviewed for design, increment file_count**

```bash
cd /Users/julienm/projects/ai-ressources
grep -n "design:" index.yaml | head -5
```

Set `domains.design.last_reviewed: 2026-04-14` in root `index.yaml`.
Increment `file_count` by 2 (for the two new terminal files added in Task 1).

- [ ] **Step 2: Add terminal file signals to domain-catalog.md**

```bash
grep -n "data-visualization\|realtime-streams" domain-catalog.md | head -10
```

Add entries for the two new files with these exact signals:
- `data-visualization-terminal.md` → signals: `terminal chart`, `ASCII sparkline`, `CLI histogram`, `terminal dashboard`, `ANSI data viz`
- `realtime-streams-terminal.md` → signals: `terminal streaming`, `ANSI cursor`, `CLI live output`, `tail -f pattern`, `terminal buffering`

- [ ] **Step 3: Rebuild compiled-index.txt**

```bash
cd /Users/julienm/projects/ai-ressources
bun run build-index
```

If this exits non-zero: STOP. Report the error. Do not proceed to Step 4.

- [ ] **Step 4: Update .last-updated**

```bash
date +%Y-%m-%d > /Users/julienm/projects/ai-ressources/.last-updated
```

- [ ] **Step 5: Commit Task 7**

Use `/git.commit`. Message: `chore(sync): update indexes post conventions manifest architecture`

---

## Execution Order

```
Tasks 1 & 2 → parallel (Task 2 Step 5 commit waits for Task 1 to be committed)
      ↓
  Task 3
      ↓
Tasks 4, 5, 6 → parallel
      ↓
  Task 7
```

Total commits: 7 (one per task).

---

## Known trade-off (accepted)

`exclude_columns` on `design-tokens` (iOS/Android columns in token tables) is a "apply mentally" instruction with no enforcement. Physical extraction of iOS/Android columns is out of scope for this plan. Accepted trade-off — the Terminal sections (higher impact) are physically extracted; token columns are lower noise and deferred.
