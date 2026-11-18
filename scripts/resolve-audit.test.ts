import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { parse } from "yaml";
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
  test("every indexed engine and language selector resolves its sources", () => {
    type Entry = { file: string; audit_targets?: Record<string, string[]> };
    const code: Entry[] = parse(readFileSync(join(root, "code-conventions/index.yaml"), "utf8")).files;
    const engines: Entry[] = parse(readFileSync(join(root, "stack-ref/index.yaml"), "utf8")).sections.databases.files;
    for (const entry of code) {
      for (const [target, aliases] of Object.entries(entry.audit_targets ?? {})) {
        if (target === "database") continue;
        for (const selector of [target, ...aliases]) {
          const result = resolveAudit(["code", selector], root);
          expect(result.target).toBe(target);
          expect(result.sources.code).toContain(join(root, "code-conventions", entry.file));
          expect(result.sources.stack).toEqual([]);
          expect(result.deltas).toEqual([]);
        }
      }
    }
    for (const entry of engines) {
      for (const [target, aliases] of Object.entries(entry.audit_targets ?? {})) {
        for (const selector of [target, ...aliases]) {
          const result = resolveAudit(["database", selector], root);
          expect(result.sources.stack).toEqual([join(root, "stack-ref", entry.file)]);
          expect(result.target).toBe(target);
          for (const source of Object.values(result.sources).flat()) expect(existsSync(source)).toBe(true);
        }
      }
    }
  });

  const sharedOnlySelectors = {
    java: ["java"],
    c: ["c"],
    cpp: ["cpp", "c++", "cxx"],
    csharp: ["csharp", "c#"],
    "objective-c": ["objective-c", "objc"],
    shell: ["shell"],
    sh: ["sh", "posix-sh"],
    bash: ["bash"],
    zsh: ["zsh"],
    html: ["html"],
    css: ["css"],
  };
  test.each(Object.entries(sharedOnlySelectors))("%s only resolves shared code conventions", (target, selectors) => {
    const index = parse(readFileSync(join(root, "code-conventions/index.yaml"), "utf8"));
    const shared = index.files
      .filter((entry: { applies_to?: string[] }) => entry.applies_to?.includes("*"))
      .map((entry: { file: string }) => entry.file)
      .sort();

    for (const selector of selectors) {
      const result = resolveAudit(["code", selector], root);
      expect(result.target).toBe(target);
      expect(result.languageCoverage).toBe("shared-only");
      expect(result.sources.code.map((path) => basename(path)).sort()).toEqual(shared);
    }
  });

  test.each([
    ["pascal", "delphi", "legacy", "delphi.md"],
    ["swift", "swift", "partial", "swift-kotlin.md"],
    ["kotlin", "kotlin", "partial", "swift-kotlin.md"],
    ["python", "python", "full", "python.md"],
    ["rust", "rust", "partial", "rust.md"],
    ["go", "go", "full", "go.md"],
    ["js", "javascript", "partial", "javascript.md"],
    ["ts", "typescript", "full", "javascript.md"],
    ["elixir", "elixir", "full", "elixir.md"],
    ["sql", "sql", "partial", "database.md"],
  ])("%s reports language-specific catalog coverage", (selector, target, coverage, file) => {
    const result = resolveAudit(["code", selector], root);
    expect(result.target).toBe(target);
    expect(result.languageCoverage).toBe(coverage);
    expect(result.sources.code.map((path) => basename(path))).toContain(file);
    expect(result.sources.stack).toEqual([]);
  });

  test("Phoenix is an explicit Elixir framework delta with indexed inheritance", () => {
    expect(() => resolveAudit(["code", "phoenix"], root)).toThrow("Unsupported code target");
    const elixir = resolveAudit(["code", "elixir"], root);
    const phoenix = resolveAudit(["code", "elixir", "--with", "phoenix"], root);
    expect(phoenix.target).toBe("elixir");
    expect(phoenix.deltas).toEqual(["phoenix"]);
    expect(phoenix.languageCoverage).toBe(elixir.languageCoverage);
    expect(phoenix.sources.code.map((path) => basename(path))).toEqual([
      ...elixir.sources.code.map((path) => basename(path)),
      "database.md",
      "ecto.md",
      "phoenix.md",
    ]);
    expect(() => resolveAudit(["code", "android"], root)).toThrow("Unsupported code target");
    expect(() => resolveAudit(["database", "sql"], root)).toThrow("Unsupported database target");
  });

  test("TypeScript excludes unrelated integration files and can opt into an indexed delta", () => {
    const result = resolveAudit(["code", "ts"], root);
    const names = result.sources.code.map((path) => basename(path));
    expect(names).toContain("javascript.md");
    expect(names).toContain("architecture.md");
    expect(names.indexOf("internationalization.md")).toBeLessThan(names.indexOf("general.md"));
    expect(names).not.toContain("cli.md");
    expect(names).not.toContain("openapi.md");
    const withCli = resolveAudit(["code", "ts", "--with", "cli"], root);
    expect(withCli.sources.code.map((path) => basename(path))).toEqual([...names, "cli.md"]);
  });

  test("code audits can read the shared architecture, allocation and object reuse guidance", () => {
    for (const language of ["typescript", "rust", "go"]) {
      const result = resolveAudit(["code", language], root);
      const sources = new Map(result.sources.code.map((path) => [basename(path), readFileSync(path, "utf8")]));

      expect(sources.get("architecture.md")).toContain("### Worked TypeScript architecture examples");
      expect(sources.get("architecture.md")).toContain("### 15.1. Priority Work and Cooperative Cancellation");
      expect(sources.get("general.md")).toContain("#### Worked example on reserving and reusing capacity");
      expect(sources.get("general.md")).toContain("#### Shared Resource Caches and Object Reuse");
    }
  });

  test("database audits can include consumer conventions with the engine and schema sources", () => {
    const result = resolveAudit(["database", "sqlite", "--with", "swift-kotlin"], root);
    expect(result.sources.code.map((path) => basename(path))).toContain("swift-kotlin.md");
    expect(result.sources.code.map((path) => basename(path))).toContain("database.md");
    expect(result.sources.architecture.map((path) => basename(path))).toContain("database-migrations.md");
  });

  test("unsupported profiles, path traversal and unintended runtime flags fail closed", () => {
    for (const args of [["database", "oracle"], ["database", "pg", "--with", "../secret"], ["code", "ts", "--execute"], ["database"], ["code", "ts", "--with"]]) {
      expect(() => resolveAudit(args, root)).toThrow();
    }
  });
  test("a new indexed language and shared convention need no resolver changes", () => {
    const base = mkdtempSync(join(tmpdir(), "audit-routing-"));
    try {
      writeFileSync(join(base, "index.yaml"), "domains: {code-conventions: {}}\n");
      const conventions = join(base, "code-conventions");
      mkdirSync(conventions);
      writeFileSync(join(conventions, "index.yaml"), `files:
  - file: shared-policy.md
    applies_to: ["*"]
  - file: supporting-policy.md
  - file: example-language.md
    audit_targets: {synthetic-language: [synthetic-alias]}
`);
      writeFileSync(join(conventions, "shared-policy.md"), "# Shared policy\n");
      writeFileSync(join(conventions, "supporting-policy.md"), "# Supporting policy\n");
      const language = join(conventions, "example-language.md");
      writeFileSync(language, "---\nextends: [supporting-policy]\n---\n");
      const result = resolveAudit(["code", "synthetic-alias"], base);
      expect(result.target).toBe("synthetic-language");
      expect(result.languageCoverage).toBe("unrated");
      expect(result.sources.code.map((path) => basename(path))).toEqual([
        "shared-policy.md",
        "supporting-policy.md",
        "example-language.md",
      ]);

      writeFileSync(language, "---\nextends: [missing]\n---\n");
      expect(() => resolveAudit(["code", "synthetic-language"], base)).toThrow("Convention parent missing from index");
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  });
});
