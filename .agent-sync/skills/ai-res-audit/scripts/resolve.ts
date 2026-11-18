import { readFileSync, realpathSync } from "node:fs";
import { basename, isAbsolute, join, relative } from "node:path";
import { parse } from "yaml";

type Entry = {
  file: string;
  applies_to?: string[];
  audit_targets?: Record<string, string[]>;
  priority?: number;
};

type DomainIndex = {
  files?: Entry[];
  coverage?: Record<string, string>;
  sections?: Record<string, { files: Entry[] }>;
};

function parseDeltas(options: string[]) {
  const deltas = new Set<string>();
  for (let i = 0; i < options.length; i += 2) {
    if (options[i] !== "--with" || !options[i + 1]) {
      throw new Error("Only --with <comma-separated-deltas> is accepted by the resolver");
    }
    for (const delta of options[i + 1].split(",")) {
      const name = delta.trim().toLowerCase();
      if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) throw new Error(`Invalid delta: ${delta}`);
      deltas.add(name);
    }
  }
  return [...deltas];
}

/** Resolve reading sources only; never connect, execute project code or write files. */
export function resolveAudit(args: string[], root = process.env.AIRESOURCES) {
  if (!root) throw new Error("AIRESOURCES is required; run the knowledge-base setup first");
  const base = realpathSync(root);
  const [domain, requested, ...options] = args;
  if (domain !== "database" && domain !== "code") throw new Error("Use database or code");
  const deltas = parseDeltas(options);

  function source(path: string) {
    const actual = realpathSync(join(base, path));
    const rel = relative(base, actual);
    if (rel === ".." || rel.startsWith("../") || isAbsolute(rel)) throw new Error(`Source escapes clone: ${path}`);
    return actual;
  }

  const catalog = parse(readFileSync(source("index.yaml"), "utf8"));
  function readIndex(name: string): DomainIndex {
    if (!Object.hasOwn(catalog?.domains ?? {}, name)) throw new Error(`Domain missing from index.yaml: ${name}`);
    return parse(readFileSync(source(`${name}/index.yaml`), "utf8"));
  }

  const codeIndex = readIndex("code-conventions");
  const entries = codeIndex.files ?? [];
  const shared = entries.filter((entry) => entry.applies_to?.includes("*"));
  const databaseRules = entries.filter((entry) => Object.hasOwn(entry.audit_targets ?? {}, "database"));
  const targetEntries = domain === "database"
    ? readIndex("stack-ref").sections?.databases?.files ?? []
    : entries;
  const selectors = targetEntries.flatMap((entry) =>
    Object.entries(entry.audit_targets ?? {})
      .filter(([target]) => domain === "database" || target !== "database")
      .map(([target, aliases]) => ({ target, aliases, entry })),
  );
  const name = (requested ?? "").trim().toLowerCase();
  const matches = selectors.filter(({ target, aliases }) => target === name || aliases.includes(name));
  if (!matches.length) {
    const indexedSelectors = selectors.flatMap(({ target, aliases }) => [target, ...aliases]);
    throw new Error(`Unsupported ${domain} target; indexed selectors: ${[...new Set(indexedSelectors)].join(", ")}`);
  }
  const target = matches[0].target;
  if (matches.some((match) => match.target !== target) || (domain === "database" && matches.length !== 1)) {
    throw new Error(`Ambiguous ${domain} target in the indexes: ${name}`);
  }
  if (!shared.length || (domain === "database" && !databaseRules.length)) {
    throw new Error(`Incomplete ${domain} routing in the indexes`);
  }

  const byName = new Map(
    entries.filter((entry) => /^[a-z0-9-]+\.md$/.test(entry.file)).map((entry) => [basename(entry.file, ".md"), entry]),
  );
  const explicit = deltas.map((delta) => {
    const entry = byName.get(delta);
    if (!entry) throw new Error(`Delta missing from code-conventions/index.yaml: ${delta}`);
    return entry;
  });

  const code: string[] = [];
  const visited = new Set<string>();
  const active = new Set<string>();
  function inherit(entry: Entry) {
    const file = source(`code-conventions/${entry.file}`);
    if (active.has(file)) throw new Error(`Convention inheritance cycle: ${entry.file}`);
    if (visited.has(file)) return;
    active.add(file);
    const content = readFileSync(file, "utf8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const parents = match ? parse(match[1])?.extends ?? [] : [];
    if (!Array.isArray(parents) || parents.some((parent) => typeof parent !== "string")) {
      throw new Error(`Invalid extends in ${file}`);
    }
    for (const parent of parents) {
      const indexedParent = byName.get(parent);
      if (!indexedParent) throw new Error(`Convention parent missing from index: ${parent} (from ${entry.file})`);
      inherit(indexedParent);
    }
    active.delete(file);
    visited.add(file);
    code.push(file);
  }

  const byPriority = (a: Entry, b: Entry) => (a.priority ?? Infinity) - (b.priority ?? Infinity);
  const specific = domain === "database"
    ? databaseRules
    : matches.map(({ entry }) => entry).filter((entry) => !shared.includes(entry));
  for (const entry of [...shared.sort(byPriority), ...specific.sort(byPriority), ...explicit]) inherit(entry);

  const architecture = domain === "database"
    ? (readIndex("architecture").files ?? [])
      .filter((entry) => Object.hasOwn(entry.audit_targets ?? {}, "database"))
      .map((entry) => source(`architecture/${entry.file}`))
    : [];

  const catalogCoverage = Object.entries(codeIndex.coverage ?? {})
    .find(([language]) => language.toLowerCase() === target)?.[1];

  return {
    domain,
    target,
    ...(domain === "code" && { languageCoverage: specific.length ? catalogCoverage ?? "unrated" : "shared-only" }),
    deltas,
    sources: {
      code,
      architecture,
      stack: domain === "database" ? [source(`stack-ref/${matches[0].entry.file}`)] : [],
    },
    notice: "Reading manifest only; no audit, database connection or tests have run. Verify current engine/runtime semantics from primary documentation.",
  };
}

if (import.meta.main) {
  try { process.stdout.write(JSON.stringify(resolveAudit(process.argv.slice(2)), null, 2) + "\n"); }
  catch (error) { process.stderr.write(`ERROR ai-res-audit routing: ${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 2; }
}
