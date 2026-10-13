#!/usr/bin/env bun
/**
 * build-conventions.ts — Generate .conventions/ manifest for a target project.
 *
 * Reads domain indexes from ai-ressources, resolves code-convention dependency
 * chains (extends), and writes a manifest.yaml (source references) plus a
 * lightweight index.md (routing table) into <project-dir>/.conventions/.
 *
 * No compiled content is written. Claude reads source files directly from
 * ai-ressources using the paths listed in manifest.yaml.
 *
 * Usage: bun run scripts/build-conventions.ts <project-dir> <domains-json>
 *
 * Environment:
 *   AIRESOURCES — path to the ai-ressources clone (default: parent of scripts/)
 *
 * domains-json example:
 *   {"code":["nextjs","drizzle"],"design-tokens":[],"legal":["cgu-saas-type"]}
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { parse as parseYaml } from "yaml";

// ── Constants ─────────────────────────────────────────────────────────────────

const SCRIPT_DIR = dirname(import.meta.path);
const AIRESOURCES_ROOT = process.env.AIRESOURCES || dirname(SCRIPT_DIR);

/** Maps domain key → subdirectory in ai-ressources */
const DOMAIN_DIRS: Record<string, string> = {
  legal: "legal",
  pricing: "pricing-models",
  architecture: "architecture",
  stack: "stack-ref",
  copywriting: "copywriting",
  seo: "seo",
  conventions: "conventions",
};

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Utilities ─────────────────────────────────────────────────────────────────

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

// ── Domain resolvers ──────────────────────────────────────────────────────────

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

// ── Index entry builder ───────────────────────────────────────────────────────

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

const manifest: Manifest = {
  ai_resources_path: AIRESOURCES_ROOT,
  generated: today,
  project: projectName,
  domains: {},
};

for (const [domainKey, fileNames] of Object.entries(domainsInput)) {
  let domain: ManifestDomain;
  let warnings: string[];

  if (domainKey === "code") {
    ({ domain, warnings } = resolveCodeDomain(fileNames, AIRESOURCES_ROOT));
  } else if (domainKey.startsWith("design-")) {
    ({ domain, warnings } = resolveDesignSubDomain(domainKey, AIRESOURCES_ROOT, fileNames));
  } else {
    ({ domain, warnings } = resolveFlatDomain(domainKey, fileNames, AIRESOURCES_ROOT));
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

const indexMd = `# Conventions · ${projectName}\n\n> Match your task to domain keywords → **Read** the listed files from ai-ressources. Apply ⊘ exclusions mentally.\n> \`$AIRESOURCES\` = \`${AIRESOURCES_ROOT}\`\n\n${domainEntries}\n`;

writeFileSync(join(conventionsDir, "index.md"), indexMd, "utf-8");
console.log("✓ .conventions/index.md");
