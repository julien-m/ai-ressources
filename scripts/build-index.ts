#!/usr/bin/env bun
/**
 * build-index.ts — Compile all domain index.yaml files into a flat routing index.
 *
 * Reads the root index.yaml, then each domain's index.yaml, and generates
 * compiled-index.txt with one line per file in pipe-delimited format.
 *
 * Usage: bun run scripts/build-index.ts
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { parse } from "yaml";

const BASE = dirname(import.meta.dir);

const DOMAIN_STATUS = {
	DEPRECATED: "deprecated",
} as const;

interface DomainEntry {
	description: string;
	status?: string;
	file_count?: number;
	subdirectories?: string[];
}

interface FileEntry {
	file: string;
	description: string;
	status?: string;
	use_when?: string[];
	questions_answered?: string[];
}

interface DomainIndex {
	files?: FileEntry[];
	sections?: Record<string, { description: string; files: FileEntry[] }>;
}

/**
 * Parse a YAML file and return its typed content.
 * @param path - Absolute path to the YAML file
 * @returns Parsed content or null if the file is missing or malformed
 * @throws Never — errors are logged and null is returned
 */
const readYaml = <T>(path: string): T | null => {
	if (!existsSync(path)) {
		console.warn(`⚠ File not found: ${path}`);
		return null;
	}
	try {
		const content = readFileSync(path, "utf-8");
		const parsed = parse(content);
		if (parsed === null || typeof parsed !== "object") {
			console.error(`❌ Invalid YAML structure in ${path}: expected an object`);
			return null;
		}
		return parsed as T;
	} catch (error) {
		console.error(`❌ Failed to parse ${path}:`, error instanceof Error ? error.message : error);
		return null;
	}
};

/**
 * Check whether a file path refers to a quick-ref document.
 * @param filePath - Relative file path from the domain
 * @returns True if the path contains "quick-ref"
 */
const isQuickRef = (filePath: string): boolean => {
	return filePath.includes("quick-ref");
};

/**
 * Resolve a domain-relative file path to a project-relative path.
 * @param domain - Domain name (e.g. "stack-ref")
 * @param file - File path, possibly starting with "../" for cross-domain references
 * @returns Normalized project-relative path
 */
const normalizePath = (domain: string, file: string): string => {
	if (file.startsWith("../")) {
		return file.replace("../", "");
	}
	return `${domain}/${file}`;
};

/**
 * Format a file entry as a pipe-delimited line for the compiled index.
 * @param domain - Domain name
 * @param entry - File entry from the domain index
 * @returns Formatted line with path, description, and optional use_when tags
 */
const formatLine = (domain: string, entry: FileEntry): string => {
	const fullPath = normalizePath(domain, entry.file);
	const prefix = isQuickRef(entry.file) ? "[QUICK-REF] " : "";
	const useWhen = entry.use_when?.length ? ` | ${entry.use_when.join(", ")}` : "";
	return `${prefix}${fullPath} | ${entry.description}${useWhen}`;
};

// Read root index
const rootIndex = readYaml<{ domains: Record<string, DomainEntry> }>(
	join(BASE, "index.yaml")
);

if (!rootIndex?.domains) {
	console.error("❌ Cannot read root index.yaml");
	process.exit(1);
}

const lines: string[] = [
	"# ai-ressources compiled index",
	"# Format: path | description [| use_when tags]",
	"# [QUICK-REF] = read first for common questions in this domain",
	"# Generated deterministically from index.yaml and domain index files",
	"",
];

let totalFiles = 0;
let missingFiles = 0;
const domainNames = Object.keys(rootIndex.domains);

for (const domain of domainNames) {
	const domainInfo = rootIndex.domains[domain];

	if (domainInfo.status === DOMAIN_STATUS.DEPRECATED) continue;

	const domainIndexPath = join(BASE, domain, "index.yaml");
	const domainIndex = readYaml<DomainIndex>(domainIndexPath);

	if (!domainIndex) {
		console.warn(`⚠ Skipping domain "${domain}" — no index.yaml`);
		continue;
	}

	const entries: FileEntry[] = [];

	if (domainIndex.files) {
		entries.push(...domainIndex.files);
	}

	if (domainIndex.sections) {
		for (const section of Object.values(domainIndex.sections)) {
			if (section.files) {
				entries.push(...section.files);
			}
		}
	}

	if (entries.length === 0) continue;

	// Quick-refs first, then alphabetical
	entries.sort((a, b) => {
		const aQuick = isQuickRef(a.file) ? 0 : 1;
		const bQuick = isQuickRef(b.file) ? 0 : 1;
		if (aQuick !== bQuick) return aQuick - bQuick;
		return a.file.localeCompare(b.file);
	});

	lines.push(`## ${domain}`);

	for (const entry of entries) {
		// Resolve file path — handle relative paths like ../conventions/diagrams.md
		const resolvedPath = entry.file.startsWith("../")
			? join(BASE, entry.file.replace("../", ""))
			: join(BASE, domain, entry.file);

		if (!existsSync(resolvedPath)) {
			console.warn(`⚠ Missing file: ${resolvedPath} (referenced in ${domain}/index.yaml)`);
			missingFiles++;
		}

		lines.push(formatLine(domain, entry));
		totalFiles++;
	}

	lines.push("");
}

const output = lines.join("\n");
const outputPath = join(BASE, "compiled-index.txt");
writeFileSync(outputPath, output, "utf-8");

console.log(`✓ Generated ${outputPath}`);
console.log(`  ${domainNames.length} domains, ${totalFiles} files indexed`);
if (missingFiles > 0) {
	console.warn(`  ⚠ ${missingFiles} referenced files not found on disk`);
}
console.log(`  Size: ${(Buffer.byteLength(output) / 1024).toFixed(1)} KB`);
