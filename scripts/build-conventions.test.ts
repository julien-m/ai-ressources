#!/usr/bin/env bun
/**
 * build-conventions.test.ts — TDD tests for build-conventions.ts
 *
 * Tests run the script as a subprocess with a temp AI_RESOURCES_PATH.
 */

import { test, expect, beforeEach, afterEach, describe } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";

const SCRIPT = join(dirname(import.meta.dir), "scripts", "build-conventions.ts");

// ── Helpers ──────────────────────────────────────────────────────────────────

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
  const proc = Bun.spawn(
    ["bun", "run", SCRIPT, projectDir, domainsJson],
    {
      env: { ...process.env, AI_RESOURCES_PATH: aiResPath },
      stdout: "pipe",
      stderr: "pipe",
    }
  );
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

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

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("build-conventions", () => {
  let aiRes: string;
  let project: string;

  beforeEach(() => {
    project = makeTmpProject();
  });

  afterEach(() => {
    if (aiRes) rmSync(aiRes, { recursive: true, force: true });
    if (project) rmSync(project, { recursive: true, force: true });
  });

  // 1. Simple chain
  test("simple chain: nextjs resolves general → javascript → react → nextjs in order", async () => {
    aiRes = makeFakeAiRes(makeCodeConventionsFixture());
    const { exitCode, stderr } = await runScript(aiRes, project, JSON.stringify({ code: ["nextjs"] }));

    expect(exitCode).toBe(0);
    const codeMd = readFileSync(join(project, ".conventions", "code.md"), "utf-8");

    // All four files must appear as source comments in order
    const generalIdx = codeMd.indexOf("source: code-conventions/general.md");
    const jsIdx = codeMd.indexOf("source: code-conventions/javascript.md");
    const reactIdx = codeMd.indexOf("source: code-conventions/react.md");
    const nextjsIdx = codeMd.indexOf("source: code-conventions/nextjs.md");

    expect(generalIdx).toBeGreaterThanOrEqual(0);
    expect(jsIdx).toBeGreaterThan(generalIdx);
    expect(reactIdx).toBeGreaterThan(jsIdx);
    expect(nextjsIdx).toBeGreaterThan(reactIdx);
  });

  // 2. Deduplication
  test("deduplication: react + nextjs → general appears exactly once", async () => {
    aiRes = makeFakeAiRes(makeCodeConventionsFixture());
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["react", "nextjs"] }));

    expect(exitCode).toBe(0);
    const codeMd = readFileSync(join(project, ".conventions", "code.md"), "utf-8");
    const count = (codeMd.match(/source: code-conventions\/general\.md/g) ?? []).length;
    expect(count).toBe(1);
  });

  // 3. Diamond dependency
  test("diamond dependency: shared ancestor appears exactly once", async () => {
    aiRes = makeFakeAiRes({
      "code-conventions/root.md": "---\nextends: []\n---\n# Root\n\nRoot content.",
      "code-conventions/b.md": "---\nextends: [root]\n---\n# B\n\nB content.",
      "code-conventions/c.md": "---\nextends: [root]\n---\n# C\n\nC content.",
      "code-conventions/a.md": "---\nextends: [b, c]\n---\n# A\n\nA content.",
    });
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["a"] }));

    expect(exitCode).toBe(0);
    const codeMd = readFileSync(join(project, ".conventions", "code.md"), "utf-8");
    const count = (codeMd.match(/source: code-conventions\/root\.md/g) ?? []).length;
    expect(count).toBe(1);
  });

  // 4. Cycle detection
  test("cycle detection: exits 0 and warns to stderr", async () => {
    aiRes = makeFakeAiRes({
      "code-conventions/a.md": "---\nextends: [b]\n---\n# A\n\nA content.",
      "code-conventions/b.md": "---\nextends: [a]\n---\n# B\n\nB content.",
    });
    const { exitCode, stderr } = await runScript(aiRes, project, JSON.stringify({ code: ["a"] }));

    expect(exitCode).toBe(0);
    expect(stderr.toLowerCase()).toContain("cycle");
  });

  // 5. Missing file
  test("missing file: exits 0 and warns to stderr", async () => {
    aiRes = makeFakeAiRes({
      "code-conventions/general.md": "---\nextends: []\n---\n# General\n\nGeneral content.",
    });
    const { exitCode, stderr } = await runScript(aiRes, project, JSON.stringify({ code: ["nonexistent"] }));

    expect(exitCode).toBe(0);
    expect(stderr.toLowerCase()).toContain("missing");
  });

  // 6. Empty extends
  test("empty extends: general alone works fine", async () => {
    aiRes = makeFakeAiRes({
      "code-conventions/general.md": "---\nextends: []\n---\n# General Rules\n\nGeneral content here.",
    });
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["general"] }));

    expect(exitCode).toBe(0);
    const codeMd = readFileSync(join(project, ".conventions", "code.md"), "utf-8");
    expect(codeMd).toContain("General content here.");
  });

  // 7. Flat domain
  test("flat domain: legal.md contains both files in order", async () => {
    aiRes = makeFakeAiRes({
      "legal/cgu.md": "# CGU\n\nCGU content here.",
      "legal/rgpd.md": "# RGPD\n\nRGPD content here.",
    });
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ legal: ["cgu", "rgpd"] }));

    expect(exitCode).toBe(0);
    const legalMd = readFileSync(join(project, ".conventions", "legal.md"), "utf-8");
    const cguIdx = legalMd.indexOf("CGU content here.");
    const rgpdIdx = legalMd.indexOf("RGPD content here.");
    expect(cguIdx).toBeGreaterThanOrEqual(0);
    expect(rgpdIdx).toBeGreaterThan(cguIdx);
  });

  // 8. Manifest written
  test("manifest written with correct structure", async () => {
    aiRes = makeFakeAiRes(makeCodeConventionsFixture());
    const { exitCode } = await runScript(aiRes, project, JSON.stringify({ code: ["nextjs"] }));

    expect(exitCode).toBe(0);
    const manifestPath = join(project, ".conventions", "conventions.manifest.json");
    expect(existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    expect(typeof manifest.generated).toBe("string");
    expect(typeof manifest.project).toBe("string");
    expect(typeof manifest.aiResourcesPath).toBe("string");
    expect(typeof manifest.domains).toBe("object");
    expect(typeof manifest.domains.code).toBe("object");
    expect(typeof manifest.domains.code.file).toBe("string");
    expect(Array.isArray(manifest.domains.code.sources)).toBe(true);
    expect(typeof manifest.domains.code.hashes).toBe("object");
    expect(typeof manifest.domains.code.outputHash).toBe("string");
  });
});
