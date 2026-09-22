#!/usr/bin/env bun

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");

function readRepoFile(path: string): string {
  return readFileSync(join(ROOT, path), "utf-8");
}

describe("generated gitignore exclusions", () => {
  test("conventions-init phase 5 excludes materialized conventions and local agent state", () => {
    const content = readRepoFile(".agent-sync/skills/conventions-init/SKILL.md");
    const phase5 = content.slice(content.indexOf("### 6. Update `.gitignore`"), content.indexOf("### 7. Config audit"));

    expect(phase5).toContain(".conventions/");
    expect(phase5).toContain(".claude/");
    expect(phase5).toContain(".agents/");
  });

  test("conventions-refresh refreshes gitignore exclusions before stack tracking", () => {
    const content = readRepoFile(".agent-sync/skills/conventions-refresh/SKILL.md");

    expect(content).toContain("Ensure `.gitignore` exclusions");
    expect(content).toContain(".conventions/");
    expect(content).toContain(".claude/");
    expect(content).toContain(".agents/");
  });

  test("conventions-refresh Step 7 emits a Step 7 failure receipt", () => {
    const content = readRepoFile(".agent-sync/skills/conventions-refresh/SKILL.md");
    const step7 = content.slice(content.indexOf("### 7. Stack tracking"), content.indexOf("## Done"));

    expect(step7).toContain("ERROR step=7 type=<command_failed|verification_failed>");
    expect(step7).not.toContain("ERROR step=6");
  });

  test("runtime config common gitignore layer includes local agent state", () => {
    const content = readRepoFile("code-conventions/runtime-configs.md");
    const commonLayer = content.slice(content.indexOf("### Layer: common"), content.indexOf("### Layer: typescript"));

    expect(commonLayer).toContain(".conventions/");
    expect(commonLayer).toContain(".claude/");
    expect(commonLayer).toContain(".agents/");
  });
});
