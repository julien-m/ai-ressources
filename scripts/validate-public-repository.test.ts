#!/usr/bin/env bun

import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";

const ROOT = join(import.meta.dir, "..");
const temporaryDirectories: Array<string> = [];

function readRepoFile(path: string): string {
	return readFileSync(join(ROOT, path), "utf-8");
}

afterEach(() => {
	for (const directory of temporaryDirectories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

describe("public repository contracts", () => {
	test("README and setup use .agent-sync as the canonical source", () => {
		const readme = readRepoFile("README.md");
		const setup = readRepoFile("setup.sh");

		expect(readme).toContain(".agent-sync/");
		expect(setup).toContain("/.agent-sync/skills/");
		expect(setup).toContain("/.agent-sync/rules/");
		expect(`${readme}\n${setup}`).not.toContain("claude/skills");
		expect(`${readme}\n${setup}`).not.toContain("claude/rules");
	});

	test("setup succeeds without linking assets", () => {
		const temporaryDirectory = mkdtempSync(join(tmpdir(), "ai-ressources-setup-"));
		temporaryDirectories.push(temporaryDirectory);
		const shellProfile = join(temporaryDirectory, "profile");

		const result = Bun.spawnSync(["bash", join(ROOT, "setup.sh")], {
			env: {
				...process.env,
				AI_RESOURCES_SHELL_RC: shellProfile,
				HOME: temporaryDirectory,
				SHELL: "/bin/bash",
			},
		});

		expect(result.exitCode).toBe(0);
		expect(readFileSync(shellProfile, "utf-8")).toContain(`export AI_RESOURCES_PATH="${ROOT}"`);
		expect(result.stdout.toString()).toContain("Portable asset linking skipped");
	});

	test("license, disclosure guidance, and third-party notice are present", () => {
		expect(readRepoFile("LICENSE")).toContain("Copyright (c) 2026 julien-m");
		expect(readRepoFile("SECURITY.md")).toContain("GitHub private vulnerability reporting");

		const notices = readRepoFile("THIRD_PARTY_NOTICES.md");
		expect(notices).toContain("ccbc15639c97057cbfcf32ecebc38ef716e4bb37");
		expect(notices).toContain("Copyright (c) 2026 Leonxlnx");
	});

	test("public CI and dependency maintenance configuration are parseable", () => {
		const continuousIntegration = parse(readRepoFile(".github/workflows/ci.yaml"));
		const security = parse(readRepoFile(".github/workflows/security.yaml"));
		const dependabot = parse(readRepoFile(".github/dependabot.yml"));

		expect(continuousIntegration.jobs["repository-checks"]).toBeDefined();
		expect(continuousIntegration.jobs["repository-checks"].steps).toContainEqual(
			expect.objectContaining({ uses: "actions/checkout@v7" }),
		);
		expect(security.permissions).toEqual({
			contents: "read",
			"pull-requests": "read",
		});
		expect(security.jobs["secret-scan"].steps).toContainEqual(
			expect.objectContaining({ uses: "gitleaks/gitleaks-action@v3" }),
		);
		expect(security.jobs["dependency-audit"].steps).toContainEqual(
			expect.objectContaining({ run: "bun audit --audit-level=high" }),
		);
		expect(security.jobs["filesystem-scan"].steps).toContainEqual(
			expect.objectContaining({ uses: "aquasecurity/trivy-action@v0.36.0" }),
		);
		expect(dependabot.updates).toHaveLength(2);
	});
});
