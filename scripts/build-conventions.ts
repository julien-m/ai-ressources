#!/usr/bin/env bun
/**
 * build-conventions.ts — Generate .conventions/ for a target project.
 *
 * Reads domain convention files from ai-ressources, resolves code-convention
 * dependency chains (extends), and writes per-domain .md files plus an index
 * and manifest into <project-dir>/.conventions/.
 *
 * Usage: bun run scripts/build-conventions.ts <project-dir> <domains-json>
 *
 * Environment:
 *   AI_RESOURCES_PATH — path to ai-ressources repo (default: parent of scripts/)
 *
 * domains-json example:
 *   {"code":["nextjs","drizzle"],"legal":["cgu-saas-type","rgpd-obligations"]}
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { createHash } from "node:crypto";
import { parse as parseYaml } from "yaml";

// ── Constants ─────────────────────────────────────────────────────────────────

const SCRIPT_DIR = dirname(import.meta.path);
const AI_RESOURCES_PATH = process.env.AI_RESOURCES_PATH ?? dirname(SCRIPT_DIR);

/** Maps domain key → subdirectory in ai-ressources */
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

/** Loading hints for index.md */
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

// ── Utilities ─────────────────────────────────────────────────────────────────

/** SHA256, truncated to 16 hex chars */
function sha256Short(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

/** Strip YAML frontmatter (--- ... ---) from a markdown string */
function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---\n?/, "");
}

/** Parse extends list from YAML frontmatter */
function parseExtends(content: string): string[] {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return [];
  try {
    const fm = parseYaml(match[1]) as Record<string, unknown>;
    const ext = fm?.extends;
    if (Array.isArray(ext)) return ext.filter((x) => typeof x === "string");
  } catch {
    // ignore parse errors
  }
  return [];
}

/** Separator comment between concatenated files */
function separator(rel: string): string {
  return `\n---\n<!-- source: ${rel} -->\n---\n\n`;
}

// ── Code domain: post-order DFS with dedup + cycle detection ─────────────────

type CodeConventionsDir = string; // absolute path to code-conventions/

function resolveCodeChain(
  names: string[],
  dir: CodeConventionsDir
): { order: string[]; warnings: string[] } {
  const order: string[] = [];
  const visited = new Set<string>();
  const warnings: string[] = [];

  function dfs(name: string, inProgress: Set<string>): void {
    if (visited.has(name)) return;

    const filePath = join(dir, `${name}.md`);
    if (!existsSync(filePath)) {
      warnings.push(`Missing code-convention file: ${name}.md`);
      visited.add(name); // mark to avoid repeated warnings
      return;
    }

    if (inProgress.has(name)) {
      warnings.push(`Cycle detected at: ${name}`);
      return;
    }

    const content = readFileSync(filePath, "utf-8");
    const parents = parseExtends(content);

    inProgress.add(name);

    for (const parent of parents) {
      dfs(parent, inProgress);
    }

    inProgress.delete(name);

    if (!visited.has(name)) {
      visited.add(name);
      order.push(name);
    }
  }

  const topLevel = new Set<string>();
  for (const name of names) {
    dfs(name, topLevel);
  }

  return { order, warnings };
}

/** Build code.md content and collect source paths */
function buildCodeDomain(
  names: string[],
  aiResPath: string
): { content: string; sources: string[]; warnings: string[] } {
  const dir = join(aiResPath, "code-conventions");
  const { order, warnings } = resolveCodeChain(names, dir);

  const parts: string[] = [];
  const sources: string[] = [];

  for (const name of order) {
    const filePath = join(dir, `${name}.md`);
    if (!existsSync(filePath)) continue;
    const rel = `code-conventions/${name}.md`;
    const raw = readFileSync(filePath, "utf-8");
    parts.push(separator(rel) + stripFrontmatter(raw).trimStart());
    sources.push(rel);
  }

  return { content: parts.join(""), sources, warnings };
}

/** Build a flat domain's content and collect source paths */
function buildFlatDomain(
  domainKey: string,
  fileNames: string[],
  aiResPath: string
): { content: string; sources: string[]; warnings: string[] } {
  const subDir = DOMAIN_DIRS[domainKey];
  if (!subDir) {
    return {
      content: "",
      sources: [],
      warnings: [`Unknown flat domain: ${domainKey}`],
    };
  }

  const dir = join(aiResPath, subDir);
  const parts: string[] = [];
  const sources: string[] = [];
  const warnings: string[] = [];

  for (const name of fileNames) {
    const filePath = join(dir, `${name}.md`);
    if (!existsSync(filePath)) {
      warnings.push(`Missing file: ${subDir}/${name}.md`);
      continue;
    }
    const rel = `${subDir}/${name}.md`;
    const raw = readFileSync(filePath, "utf-8");
    parts.push(separator(rel) + stripFrontmatter(raw).trimStart());
    sources.push(rel);
  }

  return { content: parts.join(""), sources, warnings };
}

// ── Main ──────────────────────────────────────────────────────────────────────

const [, , projectDirArg, domainsJsonArg] = process.argv;

if (!projectDirArg || !domainsJsonArg) {
  console.error("Usage: bun run scripts/build-conventions.ts <project-dir> <domains-json>");
  process.exit(1);
}

let domainsInput: Record<string, string[]>;
try {
  domainsInput = JSON.parse(domainsJsonArg);
} catch {
  console.error("Invalid domains JSON:", domainsJsonArg);
  process.exit(1);
}

const conventionsDir = join(projectDirArg, ".conventions");
mkdirSync(conventionsDir, { recursive: true });

const projectName = basename(projectDirArg);
const today = new Date().toISOString().slice(0, 10);

interface DomainManifestEntry {
  file: string;
  sources: string[];
  hashes: Record<string, string>;
  outputHash: string;
}

const manifest: {
  generated: string;
  project: string;
  aiResourcesPath: string;
  domains: Record<string, DomainManifestEntry>;
} = {
  generated: today,
  project: projectName,
  aiResourcesPath: AI_RESOURCES_PATH,
  domains: {},
};

const indexRows: Array<{ domain: string; file: string; hint: string }> = [];

for (const [domainKey, fileNames] of Object.entries(domainsInput)) {
  let content: string;
  let sources: string[];
  let warnings: string[];

  if (domainKey === "code") {
    ({ content, sources, warnings } = buildCodeDomain(fileNames, AI_RESOURCES_PATH));
  } else {
    ({ content, sources, warnings } = buildFlatDomain(domainKey, fileNames, AI_RESOURCES_PATH));
  }

  // Emit warnings to stderr
  for (const w of warnings) {
    process.stderr.write(`⚠ ${w}\n`);
  }

  const outputFile = `${domainKey}.md`;
  const outputPath = join(conventionsDir, outputFile);
  writeFileSync(outputPath, content, "utf-8");

  // Build hashes
  const hashes: Record<string, string> = {};
  for (const rel of sources) {
    const fullPath = join(AI_RESOURCES_PATH, rel);
    if (existsSync(fullPath)) {
      hashes[rel] = sha256Short(readFileSync(fullPath, "utf-8"));
    }
  }

  manifest.domains[domainKey] = {
    file: `.conventions/${outputFile}`,
    sources,
    hashes,
    outputHash: sha256Short(content),
  };

  indexRows.push({
    domain: domainKey,
    file: outputFile,
    hint: DOMAIN_HINTS[domainKey] ?? "",
  });

  console.log(`✓ .conventions/${outputFile} (${sources.length} source(s))`);
}

// ── Write manifest ────────────────────────────────────────────────────────────

const manifestPath = join(conventionsDir, "conventions.manifest.json");
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
console.log("✓ .conventions/conventions.manifest.json");

// ── Write index.md ────────────────────────────────────────────────────────────

const tableRows = indexRows
  .map((r) => `| ${r.domain} | [${r.file}](${r.file}) | ${r.hint} |`)
  .join("\n");

const indexMd = `---
generated: ${today}
project: ${projectName}
---

# Conventions — ${projectName}

| Domaine | Fichier | Charger quand |
|---------|---------|---------------|
${tableRows}

## Règle de priorité
Dans \`code.md\` : la règle du fichier fils prime sur celle du parent.
Ordre de concaténation : de la racine vers les feuilles (left-to-right dans \`extends\`).
`;

writeFileSync(join(conventionsDir, "index.md"), indexMd, "utf-8");
console.log("✓ .conventions/index.md");
