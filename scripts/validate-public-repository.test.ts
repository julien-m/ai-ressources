#!/usr/bin/env bun

import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";

const ROOT = join(import.meta.dir, "..");
const temporaryDirectories: Array<string> = [];

function readRepoFile(path: string): string {
	return readFileSync(join(ROOT, path), "utf-8");
}

const HARDCODED_CLONE = ["projects", "ai-ressources"].join("/");
const LEGACY_VARIABLE = ["AI", "RESOURCES", "PATH"].join("_");

function makeTemporaryDirectory(prefix: string): string {
	const directory = mkdtempSync(join(tmpdir(), prefix));
	temporaryDirectories.push(directory);
	return directory;
}

/** Tracked and untracked (not ignored) portable files that hardcode the clone location. */
function findHardcodedLocations(root: string): Array<string> {
	const listed = Bun.spawnSync(
		["git", "ls-files", "--cached", "--others", "--exclude-standard", "--", ".agent-sync", "scripts", "setup.sh"],
		{ cwd: root },
	);
	if (listed.exitCode !== 0) throw new Error(listed.stderr.toString());
	return listed.stdout
		.toString()
		.split("\n")
		.filter((path) => path && existsSync(join(root, path)))
		.filter((path) => {
			const content = readFileSync(join(root, path), "utf-8");
			// setup.sh names the legacy variable only to flag it in old shell profiles.
			return content.includes(HARDCODED_CLONE) || (path !== "setup.sh" && content.includes(LEGACY_VARIABLE));
		});
}

function runSetup(setupPath: string, home: string, shellProfile: string) {
	return Bun.spawnSync(["bash", setupPath], {
		cwd: home,
		env: { ...process.env, AI_RESOURCES_SHELL_RC: shellProfile, HOME: home, SHELL: "/bin/bash" },
	});
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

	test("portable assets locate the clone through AIRESOURCES only", () => {
		expect(findHardcodedLocations(ROOT)).toEqual([]);
	});

	test("the hardcoded-location guard also inspects untracked files", () => {
		const repository = makeTemporaryDirectory("ai-ressources-guard-");
		Bun.spawnSync(["git", "init", "-q"], { cwd: repository });
		mkdirSync(join(repository, ".agent-sync", "skills", "draft"), { recursive: true });
		writeFileSync(join(repository, ".agent-sync", "skills", "draft", "SKILL.md"), `Read ~/${HARDCODED_CLONE}/index.yaml\n`);

		expect(findHardcodedLocations(repository)).toEqual([".agent-sync/skills/draft/SKILL.md"]);
	});

	test("setup quotes the clone path so the shell profile never executes it", () => {
		const sandbox = makeTemporaryDirectory("ai-ressources-quote-");
		const clone = join(sandbox, "clone $(touch pwned-dollar) `touch pwned-tick` it's \"q\" \\x");
		mkdirSync(clone);
		writeFileSync(join(clone, "setup.sh"), readRepoFile("setup.sh"));
		const shellProfile = join(sandbox, "profile");

		const result = runSetup(join(clone, "setup.sh"), sandbox, shellProfile);
		expect(result.exitCode).toBe(0);

		for (const shell of ["bash", "zsh"]) {
			const loaded = Bun.spawnSync([shell, "-c", '. "$1"; printf %s "$AIRESOURCES"', "load", shellProfile], { cwd: sandbox });
			expect(loaded.exitCode).toBe(0);
			expect(loaded.stdout.toString()).toBe(clone);
		}
		expect(existsSync(join(sandbox, "pwned-dollar"))).toBe(false);
		expect(existsSync(join(sandbox, "pwned-tick"))).toBe(false);
	});

	test("setup flags a legacy location variable left in the shell profile", () => {
		const home = makeTemporaryDirectory("ai-ressources-legacy-");
		const shellProfile = join(home, "profile");
		writeFileSync(shellProfile, `# ai-ressources knowledge base\nexport ${LEGACY_VARIABLE}="/old/clone"\n`);

		const result = runSetup(join(ROOT, "setup.sh"), home, shellProfile);
		const output = `${result.stdout}${result.stderr}`;

		expect(result.exitCode).toBe(0);
		expect(output).toContain(`${shellProfile}:2 still exports ${LEGACY_VARIABLE}`);
		expect(output).toContain("Remove that line");
	});

	test("setup accepts an AIRESOURCES line written in the previous double-quoted format", () => {
		const home = makeTemporaryDirectory("ai-ressources-previous-");
		const shellProfile = join(home, "profile");
		writeFileSync(shellProfile, `export AIRESOURCES="${ROOT}"\n`);

		const result = runSetup(join(ROOT, "setup.sh"), home, shellProfile);

		expect(result.exitCode).toBe(0);
		expect(result.stdout.toString()).toContain("AIRESOURCES already configured");
		expect(readFileSync(shellProfile, "utf-8").match(/^export AIRESOURCES=/gm)).toHaveLength(1);
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
		expect(readFileSync(shellProfile, "utf-8")).toContain(`export AIRESOURCES='${ROOT}'`);
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
