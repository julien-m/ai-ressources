#!/usr/bin/env bun
/**
 * build-conventions.test.ts - tests for build-conventions.ts
 *
 * The generator writes a manifest-only .conventions/ directory:
 * manifest.yaml + index.md. It does not compile per-domain markdown files.
 */

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { parse } from "yaml";

const SCRIPT = join(dirname(import.meta.dir), "scripts", "build-conventions.ts");

function makeFakeAiRes(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "ai-res-"));
  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf-8");
  }
  return dir;
}

function makeTmpProject(): string {
  return mkdtempSync(join(tmpdir(), "project-"));
}

async function runScript(
  aiResPath: string,
  projectDir: string,
  domainsJson: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const proc = Bun.spawn(["bun", "run", SCRIPT, projectDir, domainsJson], {
    env: { ...process.env, AI_RESOURCES_PATH: aiResPath },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

function readManifest(projectDir: string): any {
  return parse(readFileSync(join(projectDir, ".conventions", "manifest.yaml"), "utf-8"));
}

function sourceList(projectDir: string, domain: string): string[] {
  return readManifest(projectDir).domains[domain].sources;
}

function makeCodeConventionsFixture(): Record<string, string> {
  return {
    "code-conventions/general.md": "---\nextends: []\n---\n# General Rules\n\nGeneral content here.",
    "code-conventions/javascript.md": "---\nextends: [general]\n---\n# JavaScript Rules\n\nJS content here.",
    "code-conventions/react.md": "---\nextends: [javascript]\n---\n# React Rules\n\nReact content here.",
    "code-conventions/nextjs.md": "---\nextends: [react]\n---\n# Next.js Rules\n\nNextjs content here.",
    "code-conventions/drizzle.md": "---\nextends: [javascript]\n---\n# Drizzle Rules\n\nDrizzle content here.",
    "legal/cgu.md": "# CGU\n\nCGU content here.",
    "legal/rgpd.md": "# RGPD\n\nRGPD content here.",
  };
}

describe("build-conventions", () => {
  let aiRes = "";
  let project = "";

  beforeEach(() => {
    project = makeTmpProject();
  });

  afterEach(() => {
    if (aiRes) rmSync(aiRes, { recursive: true, force: true });
    if (project) rmSync(project, { recursive: true, force: true });
    aiRes = "";
    project = "";
  });

  test("simple chain: nextjs resolves general, javascript, react, nextjs in order", async () => {
    aiRes = makeFakeAiRes(makeCodeConventionsFixture());
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["nextjs"] }));

    expect(exitCode).toBe(0);
    expect(sourceList(project, "code")).toEqual([
      "code-conventions/general.md",
      "code-conventions/javascript.md",
      "code-conventions/react.md",
      "code-conventions/nextjs.md",
    ]);
  });

  test("deduplication: react + nextjs resolves shared ancestors once", async () => {
    aiRes = makeFakeAiRes(makeCodeConventionsFixture());
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["react", "nextjs"] }));

    expect(exitCode).toBe(0);
    const sources = sourceList(project, "code");
    expect(sources.filter((source) => source === "code-conventions/general.md")).toHaveLength(1);
    expect(sources.filter((source) => source === "code-conventions/javascript.md")).toHaveLength(1);
  });

  test("diamond dependency: shared ancestor appears exactly once", async () => {
    aiRes = makeFakeAiRes({
      "code-conventions/root.md": "---\nextends: []\n---\n# Root\n\nRoot content.",
      "code-conventions/b.md": "---\nextends: [root]\n---\n# B\n\nB content.",
      "code-conventions/c.md": "---\nextends: [root]\n---\n# C\n\nC content.",
      "code-conventions/a.md": "---\nextends: [b, c]\n---\n# A\n\nA content.",
    });
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["a"] }));

    expect(exitCode).toBe(0);
    expect(sourceList(project, "code").filter((source) => source === "code-conventions/root.md")).toHaveLength(1);
  });

  test("cycle detection: exits 0 and warns to stderr", async () => {
    aiRes = makeFakeAiRes({
      "code-conventions/a.md": "---\nextends: [b]\n---\n# A\n\nA content.",
      "code-conventions/b.md": "---\nextends: [a]\n---\n# B\n\nB content.",
    });
    const { exitCode, stderr } = await runScript(aiRes, project, JSON.stringify({ code: ["a"] }));

    expect(exitCode).toBe(0);
    expect(stderr.toLowerCase()).toContain("cycle");
  });

  test("missing file: exits 0 and warns to stderr", async () => {
    aiRes = makeFakeAiRes({
      "code-conventions/general.md": "---\nextends: []\n---\n# General\n\nGeneral content.",
    });
    const { exitCode, stderr } = await runScript(aiRes, project, JSON.stringify({ code: ["nonexistent"] }));

    expect(exitCode).toBe(0);
    expect(stderr.toLowerCase()).toContain("missing");
  });

  test("empty extends: general alone is listed in manifest", async () => {
    aiRes = makeFakeAiRes({
      "code-conventions/general.md": "---\nextends: []\n---\n# General Rules\n\nGeneral content here.",
    });
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["general"] }));

    expect(exitCode).toBe(0);
    expect(sourceList(project, "code")).toEqual(["code-conventions/general.md"]);
  });

  test("flat domain: legal sources are listed in request order", async () => {
    aiRes = makeFakeAiRes({
      "legal/cgu.md": "# CGU\n\nCGU content here.",
      "legal/rgpd.md": "# RGPD\n\nRGPD content here.",
    });
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ legal: ["cgu", "rgpd"] }));

    expect(exitCode).toBe(0);
    expect(sourceList(project, "legal")).toEqual(["legal/cgu.md", "legal/rgpd.md"]);
  });

  test("manifest-only directory is written with the current structure", async () => {
    aiRes = makeFakeAiRes(makeCodeConventionsFixture());
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["nextjs"] }));

    expect(exitCode).toBe(0);
    expect(existsSync(join(project, ".conventions", "manifest.yaml"))).toBe(true);
    expect(existsSync(join(project, ".conventions", "index.md"))).toBe(true);
    expect(existsSync(join(project, ".conventions", "code.md"))).toBe(false);
    expect(existsSync(join(project, ".conventions", "conventions.manifest.json"))).toBe(false);

    const manifest = readManifest(project);
    expect(typeof manifest.generated).toBe("string");
    expect(typeof manifest.project).toBe("string");
    expect(typeof manifest.ai_resources_path).toBe("string");
    expect(manifest.domains.code.sources).toEqual([
      "code-conventions/general.md",
      "code-conventions/javascript.md",
      "code-conventions/react.md",
      "code-conventions/nextjs.md",
    ]);
  });
});
