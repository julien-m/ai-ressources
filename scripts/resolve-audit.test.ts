import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveAudit } from "../.agent-sync/skills/ai-res-audit/scripts/resolve";

const root = join(import.meta.dir, "..");
describe("audit source routing", () => {
  test("engine alias and ORM inheritance keep order, deduplicate and exclude unrelated profiles", () => {
    const result = resolveAudit(["database", "pg", "--with", "ecto,ecto"], root);
    const names = result.sources.code.map((p) => p.split("/").pop());
    expect(result.target).toBe("postgresql");
    expect(new Set(names).size).toBe(names.length);
    expect(names.indexOf("database.md")).toBeLessThan(names.indexOf("ecto.md"));
    expect(names).toContain("general.md");
    expect(names).not.toContain("prisma.md");
    expect(result.sources.stack.map((p) => p.split("/").pop())).toEqual(["postgres.md"]);
    expect(result.deltas).toEqual(["ecto"]);
  });
  test("all supported engines/languages resolve existing sources without guessing frameworks", () => {
    for (const domain of ["database", "code"]) {
      const targets = domain === "database" ? ["postgresql", "mysql", "sqlite", "cockroachdb"] : ["delphi", "typescript", "javascript", "rust", "elixir"];
      for (const target of targets) {
        const result = resolveAudit([domain, target], root);
        for (const source of Object.values(result.sources).flat()) expect(existsSync(source)).toBe(true);
        if (domain === "code") expect(result.sources.stack).toEqual([]);
        expect(result.deltas).toEqual([]);
      }
    }
  });
  test("unsupported profiles, path traversal and unintended runtime flags fail closed", () => {
    for (const args of [["database", "oracle"], ["database", "pg", "--with", "../secret"], ["code", "ts", "--execute"], ["database"], ["code", "ts", "--with"]]) {
      expect(() => resolveAudit(args, root)).toThrow();
    }
  });
  test("missing inheritance sources cannot produce an apparently complete manifest", () => {
    const base = mkdtempSync(join(tmpdir(), "audit-routing-"));
    try {
      writeFileSync(join(base, "index.yaml"), "domains: {}\n");
      mkdirSync(join(base, "code-conventions"));
      writeFileSync(join(base, "code-conventions/general.md"), "---\nextends: [missing]\n---\n");
      expect(() => resolveAudit(["code", "ts"], base)).toThrow();
    } finally { rmSync(base, { recursive: true, force: true }); }
  });
});
