#!/usr/bin/env bun

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const OUTPUT_PATH = join(ROOT, "compiled-index.txt");

function buildIndex(): string {
  const result = Bun.spawnSync(["bun", "run", "scripts/build-index.ts"], {
    cwd: ROOT,
    stderr: "pipe",
    stdout: "pipe",
  });

  if (result.exitCode !== 0) {
    const decoder = new TextDecoder();
    throw new Error(
      `build-index failed with exit ${result.exitCode}\n${decoder.decode(result.stdout)}${decoder.decode(result.stderr)}`,
    );
  }
  return readFileSync(OUTPUT_PATH, "utf-8");
}

describe("compiled index generation", () => {
  test("is byte-identical across repeated builds", () => {
    const firstBuild = buildIndex();
    const secondBuild = buildIndex();

    expect(secondBuild).toBe(firstBuild);
    expect(secondBuild).toContain(
      "# Generated deterministically from index.yaml and domain index files",
    );
  });
});
