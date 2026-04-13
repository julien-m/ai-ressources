# Build-Conventions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace LLM synthesis in conventions.init with a deterministic build script that resolves dependency chains and concatenates source files verbatim into per-domain convention files.

**Architecture:** A new `scripts/build-conventions.ts` script reads `extends` frontmatter from code-conventions files, resolves the dependency graph with deduplication, concatenates raw content, and writes per-domain files to `.conventions/`. conventions.init calls this script instead of dispatching ai-res-librarian agents. conventions.refresh uses the generated manifest.json for hash-based staleness detection.

**Tech Stack:** Bun, TypeScript, yaml (already in package.json), node:crypto (SHA256), node:fs

---

## Design Decisions (locked)

### Transversal files strategy — Option A

`conventions.init` Phase 4.1 passes **leaf/framework files plus any explicit transversal files** to the build script. The `extends` chain resolves `general` automatically for language/framework files, and resolves `database` automatically for `drizzle` and `prisma`. `testing`, `logging`, `architecture`, and `runtime-configs` are root/transversal files and must still be passed explicitly when they are detected for the `code` domain.

Example: `{"code": ["nextjs", "drizzle"]}` → build script resolves `[general, javascript, react, nextjs, database, javascript(dedup), drizzle]` = `[general, javascript, react, nextjs, database, drizzle]`.

### Manifest location

`conventions.manifest.json` lives in `.conventions/` of the **target project** (not in ai-ressources). It is written by `build-conventions.ts` alongside the domain files.

### conventions-preload freshness signal

Replace the `.last-updated` date comparison with: check if `.conventions/conventions.manifest.json` exists. If it does not → project is on old format → suggest `/conventions.refresh` once.

### Files excluded from extends graph

- `runtime-configs.md` — config reference only, not a convention chain file. Gets `extends: []` but is never included in the `code` array via extends resolution. Included only if conventions.init explicitly requests it via the `config` domain.
- `database.md` — root node (language-agnostic). Gets `extends: []`. Included via extends only by `drizzle.md` and `prisma.md`.

### Full extends graph (all 23 files with frontmatter)

| File | extends |
|------|---------|
| `general.md` | `[]` |
| `database.md` | `[]` |
| `testing.md` | `[]` |
| `logging.md` | `[]` |
| `architecture.md` | `[]` |
| `runtime-configs.md` | `[]` |
| `javascript.md` | `[general]` |
| `go.md` | `[general]` |
| `rust.md` | `[general]` |
| `python.md` | `[general]` |
| `swift-kotlin.md` | `[general]` |
| `delphi.md` | `[general]` |
| `react.md` | `[javascript]` |
| `tailwind.md` | `[javascript]` |
| `cloudflare.md` | `[javascript]` |
| `cli.md` | `[javascript]` |
| `astro.md` | `[javascript]` |
| `nextjs.md` | `[react]` |
| `tanstack.md` | `[react]` |
| `remotion.md` | `[react]` |
| `shadcn.md` | `[react, tailwind]` |
| `drizzle.md` | `[javascript, database]` |
| `prisma.md` | `[javascript, database]` |

### Required test cases (all must pass before Task 2 is done)

| Case | Input | Expected |
|------|-------|----------|
| Simple chain | `code: [nextjs]` | `general → javascript → react → nextjs`, each once |
| Deduplication | `code: [react, nextjs]` | `general` appears exactly once |
| Diamond | `code: [shadcn]` | `general → javascript → react → tailwind → shadcn`, each once |
| Direct cycle | Files `a extends [b]`, `b extends [a]`, input `code: [a]` | exits 0, stderr contains "Cycle", output contains `a` or `b` content |
| Missing file | `code: [nonexistent]` | exits 0, stderr contains "Missing" |
| Empty extends | `code: [general]` | exits 0, `code.md` contains general content |
| Flat domain | `legal: [cgu, rgpd]` | `legal.md` contains both in order |
| Manifest written | any | `conventions.manifest.json` exists, has `domains.code.sources` |

---

### Task 1: Add `extends` frontmatter to all code-conventions files

**Files:**
- Modify: `code-conventions/general.md`
- Modify: `code-conventions/javascript.md`
- Modify: `code-conventions/react.md`
- Modify: `code-conventions/nextjs.md`
- Modify: `code-conventions/astro.md`
- Modify: `code-conventions/tanstack.md`
- Modify: `code-conventions/shadcn.md`
- Modify: `code-conventions/tailwind.md`
- Modify: `code-conventions/cloudflare.md`
- Modify: `code-conventions/remotion.md`
- Modify: `code-conventions/cli.md`
- Modify: `code-conventions/go.md`
- Modify: `code-conventions/rust.md`
- Modify: `code-conventions/python.md`
- Modify: `code-conventions/swift-kotlin.md`
- Modify: `code-conventions/delphi.md`
- Modify: `code-conventions/database.md`
- Modify: `code-conventions/drizzle.md`
- Modify: `code-conventions/prisma.md`
- Modify: `code-conventions/testing.md`
- Modify: `code-conventions/logging.md`
- Modify: `code-conventions/architecture.md`
- Modify: `code-conventions/runtime-configs.md`

Each file gets a YAML frontmatter block inserted at the very top. Files with no parent get `extends: []`.

- [ ] **Step 1: Add frontmatter to root/transversal files (no extends)**

For each of these files, prepend `---\nextends: []\n---\n\n` before the existing first line:
- `code-conventions/general.md`
- `code-conventions/database.md`
- `code-conventions/testing.md`
- `code-conventions/logging.md`
- `code-conventions/architecture.md`
- `code-conventions/runtime-configs.md`

- [ ] **Step 2: Add frontmatter to language files (extends general)**

Prepend the following frontmatter to each file:

`code-conventions/javascript.md` → `---\nextends: [general]\n---\n\n`
`code-conventions/go.md` → `---\nextends: [general]\n---\n\n`
`code-conventions/rust.md` → `---\nextends: [general]\n---\n\n`
`code-conventions/python.md` → `---\nextends: [general]\n---\n\n`
`code-conventions/swift-kotlin.md` → `---\nextends: [general]\n---\n\n`
`code-conventions/delphi.md` → `---\nextends: [general]\n---\n\n`

- [ ] **Step 3: Add frontmatter to JS framework files**

`code-conventions/react.md` → `---\nextends: [javascript]\n---\n\n`
`code-conventions/tailwind.md` → `---\nextends: [javascript]\n---\n\n`
`code-conventions/cloudflare.md` → `---\nextends: [javascript]\n---\n\n`
`code-conventions/cli.md` → `---\nextends: [javascript]\n---\n\n`
`code-conventions/astro.md` → `---\nextends: [javascript]\n---\n\n`

- [ ] **Step 4: Add frontmatter to React framework files**

`code-conventions/nextjs.md` → `---\nextends: [react]\n---\n\n`
`code-conventions/tanstack.md` → `---\nextends: [react]\n---\n\n`
`code-conventions/remotion.md` → `---\nextends: [react]\n---\n\n`
`code-conventions/shadcn.md` → `---\nextends: [react, tailwind]\n---\n\n`

- [ ] **Step 5: Add frontmatter to database ORM files**

`code-conventions/drizzle.md` → `---\nextends: [javascript, database]\n---\n\n`
`code-conventions/prisma.md` → `---\nextends: [javascript, database]\n---\n\n`

- [ ] **Step 6: Verify frontmatter is parseable**

```bash
cd /Users/julienm/projects/ai-ressources
bun -e "
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { readdirSync } from 'fs';
const files = readdirSync('code-conventions').filter(f => f.endsWith('.md'));
for (const f of files) {
  const content = readFileSync('code-conventions/' + f, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) { console.error('MISSING frontmatter:', f); continue; }
  const fm = parse(match[1]);
  if (!Array.isArray(fm.extends)) { console.error('BAD extends in:', f, fm); continue; }
  console.log('OK', f, fm.extends);
}
"
```

Expected: 23 lines starting with `OK`, no `MISSING` or `BAD` lines.

- [ ] **Step 7: Commit**

```bash
cd /Users/julienm/projects/ai-ressources
git add code-conventions/
git commit -m "feat(conventions): add extends frontmatter to all code-conventions files"
```

---

### Task 2: Create `scripts/build-conventions.ts`

**Files:**
- Create: `scripts/build-conventions.ts`
- Create: `scripts/build-conventions.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `scripts/build-conventions.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// ---- helpers ----

function makeTmpDir(): string {
  const dir = join(tmpdir(), `build-conv-test-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function makeAiRes(base: string, files: Record<string, string>): void {
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(base, rel);
    mkdirSync(join(abs, ".."), { recursive: true });
    writeFileSync(abs, content, "utf-8");
  }
}

// ---- tests ----

describe("resolveCodeChain", () => {
  let aiResDir: string;
  let projectDir: string;

  beforeEach(() => {
    aiResDir = makeTmpDir();
    projectDir = makeTmpDir();
    makeAiRes(aiResDir, {
      "code-conventions/general.md": "---\nextends: []\n---\n# General\ngeneral rules",
      "code-conventions/javascript.md": "---\nextends: [general]\n---\n# JS\njs rules",
      "code-conventions/react.md": "---\nextends: [javascript]\n---\n# React\nreact rules",
      "code-conventions/nextjs.md": "---\nextends: [react]\n---\n# Next\nnext rules",
    });
  });

  afterEach(() => {
    rmSync(aiResDir, { recursive: true, force: true });
    rmSync(projectDir, { recursive: true, force: true });
  });

  it("resolves nextjs chain without duplicates", async () => {
    const result = await runBuild(aiResDir, projectDir, { code: ["nextjs"] });
    expect(result.exitCode).toBe(0);
    const code = readFileSync(join(projectDir, ".conventions", "code.md"), "utf-8");
    // general appears once
    expect(code.match(/general rules/g)?.length).toBe(1);
    // js appears once
    expect(code.match(/js rules/g)?.length).toBe(1);
    // react appears once
    expect(code.match(/react rules/g)?.length).toBe(1);
    // next appears once
    expect(code.match(/next rules/g)?.length).toBe(1);
    // order: general before js before react before next
    const gIdx = code.indexOf("general rules");
    const jIdx = code.indexOf("js rules");
    const rIdx = code.indexOf("react rules");
    const nIdx = code.indexOf("next rules");
    expect(gIdx).toBeLessThan(jIdx);
    expect(jIdx).toBeLessThan(rIdx);
    expect(rIdx).toBeLessThan(nIdx);
  });

  it("deduplicates when two items share ancestors", async () => {
    // react + nextjs both need general+js+react — no duplicate
    const result = await runBuild(aiResDir, projectDir, { code: ["react", "nextjs"] });
    expect(result.exitCode).toBe(0);
    const code = readFileSync(join(projectDir, ".conventions", "code.md"), "utf-8");
    expect(code.match(/general rules/g)?.length).toBe(1);
    expect(code.match(/react rules/g)?.length).toBe(1);
  });

  it("warns on cycle but does not crash", async () => {
    makeAiRes(aiResDir, {
      "code-conventions/a.md": "---\nextends: [b]\n---\n# A\na rules",
      "code-conventions/b.md": "---\nextends: [a]\n---\n# B\nb rules",
    });
    const result = await runBuild(aiResDir, projectDir, { code: ["a"] });
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain("Cycle");
  });

  it("handles diamond dependency — shared ancestor included exactly once", async () => {
    // shadcn-like: D extends [B, C], B extends [A], C extends [A]
    // expected order: A → B → C → D, A appears once
    makeAiRes(aiResDir, {
      "code-conventions/a.md": "---\nextends: []\n---\n# A\na rules",
      "code-conventions/b.md": "---\nextends: [a]\n---\n# B\nb rules",
      "code-conventions/c.md": "---\nextends: [a]\n---\n# C\nc rules",
      "code-conventions/d.md": "---\nextends: [b, c]\n---\n# D\nd rules",
    });
    const result = await runBuild(aiResDir, projectDir, { code: ["d"] });
    expect(result.exitCode).toBe(0);
    const code = readFileSync(join(projectDir, ".conventions", "code.md"), "utf-8");
    expect(code.match(/a rules/g)?.length).toBe(1);
    expect(code.match(/b rules/g)?.length).toBe(1);
    expect(code.match(/c rules/g)?.length).toBe(1);
    expect(code.match(/d rules/g)?.length).toBe(1);
    // A must appear before B and C
    expect(code.indexOf("a rules")).toBeLessThan(code.indexOf("b rules"));
    expect(code.indexOf("a rules")).toBeLessThan(code.indexOf("c rules"));
  });

  it("skips missing source file with warning", async () => {
    const result = await runBuild(aiResDir, projectDir, { code: ["nonexistent"] });
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain("Missing");
  });

  it("handles empty extends array without crashing", async () => {
    // general.md has extends: []
    const result = await runBuild(aiResDir, projectDir, { code: ["general"] });
    expect(result.exitCode).toBe(0);
    const code = readFileSync(join(projectDir, ".conventions", "code.md"), "utf-8");
    expect(code).toContain("general rules");
  });

  it("generates index.md and manifest.json", async () => {
    await runBuild(aiResDir, projectDir, { code: ["react"], legal: ["cgu"] });
    expect(existsSync(join(projectDir, ".conventions", "index.md"))).toBe(true);
    expect(existsSync(join(projectDir, ".conventions", "conventions.manifest.json"))).toBe(true);
    const manifest = JSON.parse(
      readFileSync(join(projectDir, ".conventions", "conventions.manifest.json"), "utf-8")
    );
    expect(manifest.domains.code).toBeDefined();
    expect(manifest.domains.code.sources).toContain("code-conventions/general.md");
  });

  it("flat domain concatenates files in order", async () => {
    makeAiRes(aiResDir, {
      "legal/cgu.md": "# CGU\ncgu content",
      "legal/rgpd.md": "# RGPD\nrgpd content",
    });
    await runBuild(aiResDir, projectDir, { legal: ["cgu", "rgpd"] });
    const legal = readFileSync(join(projectDir, ".conventions", "legal.md"), "utf-8");
    expect(legal).toContain("cgu content");
    expect(legal).toContain("rgpd content");
    expect(legal.indexOf("cgu content")).toBeLessThan(legal.indexOf("rgpd content"));
  });
});

// ---- helper: run the script as a subprocess ----
async function runBuild(
  aiResDir: string,
  projectDir: string,
  domains: Record<string, string[]>
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const scriptPath = new URL("./build-conventions.ts", import.meta.url).pathname;
  const proc = Bun.spawn(
    ["bun", "run", scriptPath, projectDir, JSON.stringify(domains)],
    {
      env: { ...process.env, AI_RESOURCES_PATH: aiResDir },
      stdout: "pipe",
      stderr: "pipe",
    }
  );
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;
  return { exitCode, stdout, stderr };
}
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/julienm/projects/ai-ressources
bun test scripts/build-conventions.test.ts 2>&1 | head -30
```

Expected: errors about missing `build-conventions.ts` module or missing functions.

- [ ] **Step 3: Create `scripts/build-conventions.ts`**

```typescript
#!/usr/bin/env bun
/**
 * build-conventions.ts — Build .conventions/ for a target project.
 *
 * Usage: bun run scripts/build-conventions.ts <project-dir> <domains-json>
 *
 * domains-json: JSON object mapping domain name to array of source names.
 * Example: {"code":["nextjs","drizzle"],"legal":["cgu-saas-type","rgpd-obligations"]}
 *
 * Environment:
 *   AI_RESOURCES_PATH — path to ai-ressources repo (default: parent of this script)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { parse as parseYaml } from "yaml";

const AI_RES_PATH = process.env.AI_RESOURCES_PATH ?? dirname(import.meta.dir);
const projectDir = process.argv[2];
const domainsArg = process.argv[3];

if (!projectDir || !domainsArg) {
  console.error("Usage: build-conventions.ts <project-dir> <domains-json>");
  process.exit(1);
}

const domains = JSON.parse(domainsArg) as Record<string, string[]>;
const outputDir = join(projectDir, ".conventions");
mkdirSync(outputDir, { recursive: true });

// ---- Frontmatter ----

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

/**
 * Read the `extends` array from a code-convention file's frontmatter.
 * @param name - File stem (e.g. "react" for code-conventions/react.md)
 * @returns Array of parent names, empty if none or missing
 */
function readExtends(name: string): string[] {
  const filePath = join(AI_RES_PATH, "code-conventions", `${name}.md`);
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, "utf-8");
  const match = content.match(FRONTMATTER_RE);
  if (!match) return [];
  const fm = parseYaml(match[1]) as { extends?: string[] };
  return Array.isArray(fm.extends) ? fm.extends : [];
}

/**
 * Remove YAML frontmatter from markdown content.
 * @param content - Raw markdown string
 * @returns Content without the leading frontmatter block
 */
function stripFrontmatter(content: string): string {
  return content.replace(FRONTMATTER_RE, "");
}

// ---- Graph resolution ----

/**
 * Recursively resolve the dependency chain for a code-convention file.
 * Uses post-order DFS so dependencies always appear before dependents.
 * Deduplication is handled by checking `result` array before adding.
 * Cycle detection uses `inProgress` set — warns and skips on cycle.
 *
 * @param name - File stem to resolve
 * @param result - Ordered list of resolved names (mutated in place)
 * @param inProgress - Set of names currently being resolved (cycle detection)
 */
function resolveChain(name: string, result: string[], inProgress: Set<string>): void {
  if (result.includes(name)) return;
  if (inProgress.has(name)) {
    console.warn(`⚠ Cycle detected involving: ${name} — skipping`);
    return;
  }
  inProgress.add(name);
  for (const dep of readExtends(name)) {
    resolveChain(dep, result, inProgress);
  }
  inProgress.delete(name);
  result.push(name);
}

/**
 * Resolve the full ordered dependency list for a set of code-convention names.
 * @param names - Top-level names requested (e.g. ["nextjs", "drizzle"])
 * @returns Deduplicated, topologically sorted list
 */
function resolveCodeFiles(names: string[]): string[] {
  const result: string[] = [];
  const inProgress = new Set<string>();
  for (const name of names) {
    resolveChain(name, result, inProgress);
  }
  return result;
}

// ---- Hashing ----

/**
 * Compute a short SHA256 hash of a file's contents.
 * @param filePath - Absolute path to the file
 * @returns 16-char hex string, or "missing" if file does not exist
 */
function hashFile(filePath: string): string {
  if (!existsSync(filePath)) return "missing";
  return createHash("sha256")
    .update(readFileSync(filePath))
    .digest("hex")
    .slice(0, 16);
}

/**
 * Compute a short SHA256 hash of a string.
 * @param s - Input string
 * @returns 16-char hex string
 */
function hashString(s: string): string {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

// ---- Domain builders ----

const SEPARATOR = (source: string): string =>
  `\n\n---\n<!-- source: ${source} -->\n---\n\n`;

interface DomainResult {
  file: string;
  sources: string[];
  hashes: Record<string, string>;
  outputHash: string;
}

/**
 * Build the code domain file by resolving the dependency graph and concatenating.
 * @param items - Code-convention names requested (e.g. ["nextjs", "drizzle"])
 * @returns Concatenated content and manifest metadata
 */
function buildCodeDomain(items: string[]): { content: string; meta: DomainResult } {
  const resolved = resolveCodeFiles(items);
  const parts: string[] = [];
  const sources: string[] = [];
  const hashes: Record<string, string> = {};

  for (const name of resolved) {
    const relPath = `code-conventions/${name}.md`;
    const absPath = join(AI_RES_PATH, relPath);
    if (!existsSync(absPath)) {
      console.warn(`⚠ Missing source: ${absPath}`);
      hashes[relPath] = "missing";
      continue;
    }
    const raw = readFileSync(absPath, "utf-8");
    parts.push(SEPARATOR(relPath) + stripFrontmatter(raw).trim());
    sources.push(relPath);
    hashes[relPath] = hashFile(absPath);
  }

  const content = parts.join("");
  return {
    content,
    meta: { file: ".conventions/code.md", sources, hashes, outputHash: hashString(content) },
  };
}

/**
 * Build a flat domain file by concatenating listed source files in order.
 * @param domainName - Output domain name (e.g. "legal")
 * @param items - Source file stems (e.g. ["cgu-saas-type", "rgpd-obligations"])
 * @param domainDir - Subdirectory within ai-ressources (e.g. "legal")
 * @returns Concatenated content and manifest metadata
 */
function buildFlatDomain(
  domainName: string,
  items: string[],
  domainDir: string
): { content: string; meta: DomainResult } {
  const parts: string[] = [];
  const sources: string[] = [];
  const hashes: Record<string, string> = {};

  for (const item of items) {
    const relPath = `${domainDir}/${item}.md`;
    const absPath = join(AI_RES_PATH, relPath);
    if (!existsSync(absPath)) {
      console.warn(`⚠ Missing source: ${absPath}`);
      hashes[relPath] = "missing";
      continue;
    }
    const raw = readFileSync(absPath, "utf-8");
    parts.push(SEPARATOR(relPath) + raw.trim());
    sources.push(relPath);
    hashes[relPath] = hashFile(absPath);
  }

  const content = parts.join("");
  return {
    content,
    meta: {
      file: `.conventions/${domainName}.md`,
      sources,
      hashes,
      outputHash: hashString(content),
    },
  };
}

// ---- Domain directory mapping ----

const DOMAIN_DIRS: Record<string, string> = {
  legal: "legal",
  pricing: "pricing-models",
  design: "design",
  architecture: "architecture",
  stack: "stack-ref",
  copywriting: "copywriting",
  seo: "seo",
  conventions: "conventions",
};

const DOMAIN_HINTS: Record<string, string> = {
  code: "Écrire du code, nommage, types, tests, logging, architecture",
  legal: "Pages CGU, RGPD, politique cookies, mentions légales",
  pricing: "Page pricing, modèles de facturation, tiers",
  design: "Composants UI, design tokens, layout, accessibilité",
  architecture: "Patterns d'architecture, auth, caching, webhooks",
  stack: "Choix de stack, comparaisons de vendors",
  copywriting: "Landing page, séquences email, taglines",
  seo: "SEO, Core Web Vitals, pages programmatiques",
};

// ---- Main loop ----

const manifestDomains: Record<string, DomainResult> = {};
const indexRows: string[] = [];

for (const [domainName, items] of Object.entries(domains)) {
  if (!items.length) continue;

  let content: string;
  let meta: DomainResult;

  if (domainName === "code") {
    ({ content, meta } = buildCodeDomain(items));
  } else {
    const domainDir = DOMAIN_DIRS[domainName] ?? domainName;
    ({ content, meta } = buildFlatDomain(domainName, items, domainDir));
  }

  if (!content.trim()) {
    console.warn(`⚠ Domain "${domainName}": no content generated — skipping`);
    continue;
  }

  const outPath = join(outputDir, `${domainName}.md`);
  writeFileSync(outPath, content, "utf-8");
  console.log(`✓ ${domainName}.md (${meta.sources.length} source(s))`);

  manifestDomains[domainName] = meta;
  const hint = DOMAIN_HINTS[domainName] ?? domainName;
  indexRows.push(`| ${domainName} | [${domainName}.md](${domainName}.md) | ${hint} |`);
}

// ---- index.md ----

const projectName = projectDir.split("/").at(-1) ?? "project";
const indexContent = [
  "---",
  `generated: ${new Date().toISOString().slice(0, 10)}`,
  `project: ${projectName}`,
  "---",
  "",
  `# Conventions — ${projectName}`,
  "",
  "| Domaine | Fichier | Charger quand |",
  "|---------|---------|---------------|",
  ...indexRows,
  "",
  "## Règle de priorité",
  "Dans `code.md` : la règle du fichier fils prime sur celle du parent.",
  "Ordre de concaténation : de la racine vers les feuilles (left-to-right dans `extends`).",
  "",
].join("\n");

writeFileSync(join(outputDir, "index.md"), indexContent, "utf-8");
console.log("✓ index.md");

// ---- conventions.manifest.json ----

const manifest = {
  generated: new Date().toISOString().slice(0, 10),
  project: projectName,
  aiResourcesPath: AI_RES_PATH,
  domains: manifestDomains,
};
writeFileSync(
  join(outputDir, "conventions.manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf-8"
);
console.log("✓ conventions.manifest.json");
console.log(`\n✓ .conventions/ built — ${Object.keys(manifestDomains).length} domain(s)`);
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/julienm/projects/ai-ressources
bun test scripts/build-conventions.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Smoke test against real ai-ressources**

```bash
cd /Users/julienm/projects/ai-ressources
TMPDIR=$(mktemp -d)
bun run scripts/build-conventions.ts "$TMPDIR" '{"code":["nextjs","drizzle"],"legal":["cgu-saas-type","rgpd-obligations"]}'
ls -la "$TMPDIR/.conventions/"
cat "$TMPDIR/.conventions/index.md"
```

Expected:
```
✓ code.md (N source(s))
✓ legal.md (2 source(s))
✓ index.md
✓ conventions.manifest.json
✓ .conventions/ built — 2 domain(s)
```

`index.md` doit contenir un tableau avec les deux domaines.
`code.md` doit contenir le contenu de `general.md` suivi de `javascript.md` suivi de `react.md` suivi de `nextjs.md` suivi de `drizzle.md` (dans cet ordre).

- [ ] **Step 6: Commit**

```bash
cd /Users/julienm/projects/ai-ressources
git add scripts/build-conventions.ts scripts/build-conventions.test.ts
git commit -m "feat(scripts): add build-conventions.ts — deterministic convention compiler"
```

---

### Task 3: Rewrite `conventions.init` Phase 4

**Files:**
- Modify: `claude/skills/conventions.init/SKILL.md:175-350` (Phase 4 section)

- [ ] **Step 1: Read current Phase 4 section**

```
Read claude/skills/conventions.init/SKILL.md lines 175-350
```

Identifier précisément les lignes à remplacer (de `### Phase 4` jusqu'à `### Phase 5`).

- [ ] **Step 2: Replace Phase 4 with script-based implementation**

Replace the entire Phase 4 section (from `### Phase 4: Generate` to just before `### Phase 5`) with:

```markdown
### Phase 4: Generate `.conventions/` via build script

This phase replaces LLM agent synthesis with a deterministic build script.

#### 4.1 Build the domains JSON

From the domains detected in Phase 2, construct a JSON object mapping domain names to arrays of source file stems.

**Code domain** — combine all detected code-convention file stems (without path, without `.md`):
```json
{
  "code": ["nextjs", "drizzle", "tanstack"]
}
```

Include in `code` array: language files (javascript, go, rust, python, delphi, swift-kotlin) + framework deltas (react, nextjs, shadcn, tailwind, cloudflare, tanstack, drizzle, prisma, remotion, cli, astro) + explicit transversal files (`architecture`, `logging`, `testing`, `runtime-configs`) that were detected in Phase 2.

Do NOT include `general` as a detected item when a language/framework file is already present — it is pulled automatically by the `extends` chain. Do NOT include `database` unless it is needed without `drizzle` or `prisma` — those two already pull it automatically. Include `architecture`, `logging`, `testing`, and `runtime-configs` explicitly when they are relevant because they are not pulled by the current `extends` graph.

**Other domains** — map domain name to array of source file stems:
```json
{
  "legal": ["cgu-saas-type", "rgpd-obligations", "cookie-policy"],
  "pricing": ["freemium"],
  "design": ["web-standards", "colors", "forms", "navigation"]
}
```

For flat domains, use the exact file stem (filename without `.md`) from the domain directory.

#### 4.2 Run the build script

```bash
bun run ~/projects/ai-ressources/scripts/build-conventions.ts <project-cwd> '<domains-json>'
```

The script writes:
- `.conventions/<domain>.md` — one file per detected domain
- `.conventions/index.md` — table of contents with loading hints
- `.conventions/conventions.manifest.json` — hashes and sources for refresh

If the script exits non-zero, report the error and stop.

#### 4.3 Display result

```
.conventions/ generated:
  ✓ code.md     — general + javascript + react + nextjs + drizzle (5 sources)
  ✓ legal.md    — 3 sources
  ✓ index.md
  ✓ conventions.manifest.json
```
```

- [ ] **Step 3: Remove Phase 4.0 (project context block) and budget allocation section**

These sections no longer exist — agent synthesis is gone. Delete them entirely.

- [ ] **Step 4: Verify the skill still reads correctly end-to-end**

Read the full updated SKILL.md and confirm:
- Phase 1-3 unchanged
- Phase 4 contains only `4.1 Build domains JSON`, `4.2 Run build script`, `4.3 Display result`
- No references to `ai-res-librarian` in Phase 4
- Phase 5 (gitignore) and Phase 6 (config audit) unchanged

- [ ] **Step 5: Commit**

```bash
cd /Users/julienm/projects/ai-ressources
git add claude/skills/conventions.init/SKILL.md
git commit -m "feat(conventions.init): replace LLM synthesis with build-conventions.ts script"
```

---

### Task 4: Rewrite `conventions.refresh` SKILL.md

**Files:**
- Modify: `claude/skills/conventions.refresh/SKILL.md`

- [ ] **Step 1: Read current file**

Read `claude/skills/conventions.refresh/SKILL.md` in full.

- [ ] **Step 2: Rewrite the entire file**

Replace the full content with:

```markdown
---
name: conventions.refresh
description: "Check if .conventions/ is stale and regenerate changed domains. Use when conventions may be outdated or after ai-ressources updates."
argument-hint: "[--full]"
---

# /conventions.refresh — Refresh Materialized Conventions

Check if `.conventions/` is up to date with `~/projects/ai-ressources/`, and regenerate stale domains.

## Prerequisites

- `.conventions/` must exist in the current project (run `/conventions.init` first)
- `~/projects/ai-ressources/` must exist

## Procedure

### Step 1: Locate the manifest

Look for `.conventions/conventions.manifest.json` in the current project root.

**If manifest does NOT exist** (old format or first refresh after migration):
→ Run in auto-full mode (see `--full` below). This creates the manifest.

**If manifest exists**: proceed to Step 2.

### Step 2: Hash check (default mode)

For each domain in `manifest.domains`:
1. For each file in `domain.sources`, compute the current SHA256 hash of the file in `~/projects/ai-ressources/`
2. Compare with `domain.hashes[file]` stored in the manifest
3. If any hash differs → domain is stale, add to rebuild list
4. If all hashes match → domain is fresh, skip

If rebuild list is empty → output `Conventions up to date.` and stop.

### Step 3: Rebuild stale domains

For each stale domain:

1. Read the `domain.sources` list from the manifest to know which files belong to this domain
2. Re-run the build script for this domain only:

```bash
bun run ~/projects/ai-ressources/scripts/build-conventions.ts <project-cwd> '<domain-json>'
```

Where `<domain-json>` contains only the stale domain(s).

3. Update the manifest hashes for the rebuilt domain(s).

### Step 4: Display result

```
Conventions refreshed:
  ✓ code.md regenerated (javascript.md changed)
  ─ legal.md up to date
```

---

### `--full` mode (re-detection)

Re-run the full stack detection and regenerate everything from scratch.

1. Read current `manifest.domains` to know which domains were previously detected (or skip if no manifest)
2. Re-run `/conventions.init` Phases 1-4 on the current project — but skip the user confirmation in Phase 3 (use existing detected domains as default, ask only if new domains are found or existing ones are missing)
3. Regenerate all domain files + manifest

Useful when:
- No manifest exists (migration from old single-file format)
- New packages were added to the project
- You want to force a full rebuild regardless of hashes

Output:
```
Full refresh: code.md, legal.md regenerated — manifest updated
```

## Rules

- Default mode MUST NOT re-detect the stack — use manifest sources only
- If a source file in the manifest no longer exists in ai-ressources, warn and skip that file (do not fail)
- After any rebuild, always update `conventions.manifest.json` with new hashes and `generated` date
- If `.conventions/` does not exist → suggest `/conventions.init` instead
```

- [ ] **Step 3: Commit**

```bash
cd /Users/julienm/projects/ai-ressources
git add claude/skills/conventions.refresh/SKILL.md
git commit -m "feat(conventions.refresh): rewrite with hash-based staleness detection via manifest"
```

---

### Task 5: Update `conventions-preload.md`

**Files:**
- Modify: `claude/rules/conventions-preload.md`

- [ ] **Step 1: Read the current file**

Read `claude/rules/conventions-preload.md` in full.

- [ ] **Step 2: Rewrite the file**

Replace the full content with:

```markdown
# Conventions Preload

**These rules apply when a `.conventions/` directory exists at the root of the current project.**

## What it is

`.conventions/` contains per-domain convention files compiled from `~/projects/ai-ressources/`. Each domain file contains the full raw content of all relevant source files, concatenated in dependency order.

## Loading

Before coding, designing, or producing anything covered by conventions:

1. **Read** `.conventions/index.md` — identifies which domain file to load for your task
2. **Read** the relevant domain file based on your current task:

| Task | File to read |
|------|-------------|
| Writing code, naming, types, tests, logging | `.conventions/code.md` |
| Legal pages, CGU, RGPD, cookies | `.conventions/legal.md` |
| Pricing page, billing models | `.conventions/pricing.md` |
| UI components, design tokens, layout | `.conventions/design.md` |
| Architecture patterns, auth, caching | `.conventions/architecture.md` |

Load only the domain file(s) relevant to the current task — not all files at once.

## Overrides

When `.conventions/` exists:

- **Replaces `/ai-res`** for all materialized domains. Do NOT call `/ai-res` for topics already covered.
- **Replaces `code.md` dispatcher** — do not load individual convention files from `~/projects/ai-ressources/`.

## Subagents

When dispatching a subagent that will code or design, **include the content of the relevant domain file directly in the subagent's prompt**. The subagent does NOT need to load conventions itself.

## Freshness

At the start of each session, check if `.conventions/conventions.manifest.json` exists:
- If it does NOT exist → suggest `/conventions.refresh` once (will auto-migrate). Do not block.
- If it exists → no freshness check needed (refresh handles staleness on demand).

## Initialization

If `.conventions/` does **not** exist and the project contains code or design files, suggest `/conventions.init` once at the start of the session. Do not block.
```

- [ ] **Step 3: Commit**

```bash
cd /Users/julienm/projects/ai-ressources
git add claude/rules/conventions-preload.md
git commit -m "feat(conventions-preload): update for multi-domain file structure"
```

---

### Task 6: Update `ai-res` skill and delete `ai-res-librarian`

**Files:**
- Modify: `claude/skills/ai-res/SKILL.md`
- Delete: `.claude/agents/ai-res-librarian.md`

- [ ] **Step 1: Read `ai-res` SKILL.md**

Read `claude/skills/ai-res/SKILL.md` in full.

- [ ] **Step 2: Remove all references to `ai-res-librarian` agent**

In `ai-res` SKILL.md:
- Find every mention of `ai-res-librarian`, `Spawn`, `spawn`, `agent` in the context of delegating to the librarian
- Replace Step 3 (Agent path) with direct file reading + concatenation:

Replace the current Step 3 section with:

```markdown
#### Step 3 — Direct path (default)

If the fast path did not match:

1. **Read** `compiled-index.txt` at the project root (`~/projects/ai-ressources/compiled-index.txt`)
2. Scan the compiled index for files matching the question (by description, use_when tags, domain)
3. **Read all matching files in parallel** (max 15 files)
4. Concatenate the raw content with source separators
5. Return the concatenated content directly — no synthesis, no summarization

If `compiled-index.txt` does not exist, use `Glob("~/projects/ai-ressources/**/*.md")` to find relevant files by name.
```

- [ ] **Step 3: Delete `ai-res-librarian` agent file**

```bash
rm /Users/julienm/projects/ai-ressources/.claude/agents/ai-res-librarian.md
```

- [ ] **Step 4: Verify no remaining references to librarian**

```bash
cd /Users/julienm/projects/ai-ressources
grep -r "ai-res-librarian" claude/ .claude/ --include="*.md" -l
```

Expected: no output (no files reference it anymore).

- [ ] **Step 5: Commit**

```bash
cd /Users/julienm/projects/ai-ressources
git add claude/skills/ai-res/SKILL.md
git rm .claude/agents/ai-res-librarian.md
git commit -m "feat(ai-res): remove librarian agent, read files directly"
```

---

### Task 7: Sync assets and final verification

**Files:**
- All modified assets in `claude/` need cc-hub symlink sync

- [ ] **Step 1: Sync all modified skills and rules via cc-hub**

Each modified asset must be re-linked. Run all four:

```bash
cc-hub skill link claude/skills/conventions.init/SKILL.md
cc-hub skill link claude/skills/conventions.refresh/SKILL.md
cc-hub skill link claude/skills/ai-res/SKILL.md
cc-hub rule link claude/rules/conventions-preload.md
```

Expected for each: `✓ Linked ...` (no errors).

- [ ] **Step 2: Run full test suite**

```bash
cd /Users/julienm/projects/ai-ressources
bun test scripts/build-conventions.test.ts
```

Expected: all tests pass.

- [ ] **Step 3: End-to-end smoke test**

```bash
cd /Users/julienm/projects/ai-ressources
TMPDIR=$(mktemp -d)
bun run scripts/build-conventions.ts "$TMPDIR" '{
  "code": ["nextjs", "drizzle", "tailwind", "shadcn"],
  "legal": ["cgu-saas-type", "rgpd-obligations"],
  "pricing": ["freemium", "per-seat"]
}'
echo "--- index.md ---"
cat "$TMPDIR/.conventions/index.md"
echo "--- manifest domains ---"
bun -e "const m = JSON.parse(require('fs').readFileSync('$TMPDIR/.conventions/conventions.manifest.json','utf-8')); console.log(Object.keys(m.domains))"
echo "--- code.md source count ---"
grep -c "source:" "$TMPDIR/.conventions/code.md"
```

Expected:
- `index.md` contient un tableau avec code, legal, pricing
- manifest.domains contient ["code", "legal", "pricing"]
- `code.md` contient plusieurs séparateurs `<!-- source: ... -->`
- general.md apparaît une seule fois dans code.md

- [ ] **Step 4: Verify general.md appears exactly once in code.md (shadcn depends on react+tailwind, both depend on javascript, javascript depends on general)**

```bash
grep -c "source: code-conventions/general.md" "$TMPDIR/.conventions/code.md"
```

Expected: `1`

- [ ] **Step 5: Final commit**

```bash
cd /Users/julienm/projects/ai-ressources
git add .
git status
# Verify only expected files are staged
git commit -m "chore: sync cc-hub assets after conventions system rewrite"
```
