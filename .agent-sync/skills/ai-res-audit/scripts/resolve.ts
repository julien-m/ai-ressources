import { existsSync, readFileSync, realpathSync } from "node:fs";
import { isAbsolute, join, relative } from "node:path";
import { parse } from "yaml";
import profiles from "../profiles.json";

type Target = { aliases: string[]; stack?: string; code?: string[] };

/** Resolve reading sources only; never connect, execute project code or write files. */
export function resolveAudit(args: string[], root = process.env.AIRESOURCES) {
  if (!root) throw new Error("AIRESOURCES is required; run the knowledge-base setup first");
  const base = realpathSync(root);
  if (!existsSync(join(base, "index.yaml"))) throw new Error("Invalid AIRESOURCES clone");
  const [domain, requested, ...options] = args;
  if (domain !== "database" && domain !== "code") throw new Error("Use database or code");
  const config = profiles[domain];
  const targets: Record<string, Target> = config.targets;
  const target = Object.keys(targets).find((name) => name === requested?.toLowerCase() || targets[name].aliases.includes(requested?.toLowerCase()));
  if (!target) throw new Error(`Unsupported ${domain} target; supported: ${Object.keys(targets).join(", ")}`);
  const deltas: string[] = [];
  for (let i = 0; i < options.length; i += 2) {
    if (options[i] !== "--with" || !options[i + 1]) throw new Error("Only --with <comma-separated-deltas> is accepted by the resolver");
    for (const delta of options[i + 1].split(",")) {
      if (!profiles.deltas.includes(delta)) throw new Error(`Unsupported delta: ${delta}`);
      deltas.push(delta);
    }
  }
  function source(path: string) {
    const actual = realpathSync(join(base, path));
    const rel = relative(base, actual);
    if (rel === ".." || rel.startsWith("../") || isAbsolute(rel)) throw new Error(`Source escapes clone: ${path}`);
    return actual;
  }
  const code: string[] = [];
  const visited = new Set<string>();
  const active = new Set<string>();
  function inherit(name: string) {
    if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid convention name: ${name}`);
    if (active.has(name)) throw new Error(`Convention inheritance cycle: ${name}`);
    if (visited.has(name)) return;
    active.add(name);
    const file = source(`code-conventions/${name}.md`);
    const content = readFileSync(file, "utf8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const parents = match ? parse(match[1])?.extends ?? [] : [];
    if (!Array.isArray(parents) || parents.some((p) => typeof p !== "string")) throw new Error(`Invalid extends in ${file}`);
    for (const parent of parents) inherit(parent);
    active.delete(name);
    visited.add(name);
    code.push(file);
  }
  const selected = targets[target];
  const shared = domain === "database" ? profiles.database.common : [];
  for (const name of [...profiles.common, ...shared, ...(selected.code ?? []), ...deltas]) inherit(name);
  return {
    domain, target, deltas: [...new Set(deltas)],
    sources: {
      code,
      architecture: domain === "database" ? profiles.database.architecture.map((s) => source(`architecture/${s}.md`)) : [],
      stack: selected.stack ? [source(`stack-ref/databases/${selected.stack}.md`)] : [],
    },
    notice: "Reading manifest only; no audit, database connection or tests have run. Verify current engine/runtime semantics from primary documentation.",
  };
}

if (import.meta.main) {
  try { process.stdout.write(JSON.stringify(resolveAudit(process.argv.slice(2)), null, 2) + "\n"); }
  catch (error) { process.stderr.write(`ERROR ai-res-audit routing: ${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 2; }
}
