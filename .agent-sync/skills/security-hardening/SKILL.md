---
name: security-hardening
description: "Apply or update ai-ressources security profiles for production, public, or web-staging projects."
argument-hint: "--profile <baseline|production|public|web-staging|none>"
---

# $security-hardening / /security-hardening - Apply Security Profile

## Goal
Apply a conventions security profile to the current target project by delegating to `$conventions-refresh --security <profile>` when `.conventions/manifest.yaml` exists, or instructing `$conventions-init --security <profile>` when it does not.

## Execution context
- Mode: apply
- Month: 2026-06

## Anti-drift rules
- Execute procedure steps in order; do not skip or reorder.
- Stop on invalid cwd, missing profile, invalid profile, or failed delegated command.
- Never apply a fallback profile silently.
- Verification must be observable from files or command output.

## Inputs
- `--profile <baseline|production|public|web-staging|none>` is required.
- Valid profiles are defined in **Read** [`../conventions-init/references/security-profiles.md`](../conventions-init/references/security-profiles.md).

## Rules
- Run from the target project, never from `~/projects/ai-ressources`.
- Do not invent a separate security matrix; reuse the conventions-init matrix and templates.
- Never write literal secret values. Use secret names only, especially `STAGING_URL` for `web-staging`.
- `web-staging` requires a deployed staging URL stored as `secrets.STAGING_URL`.

## Procedure
1. Validate cwd is not `~/projects/ai-ressources`.
2. Parse `--profile`; stop if missing or invalid.
3. If `.conventions/manifest.yaml` exists, run `$conventions-refresh --security <profile>`.
4. If `.conventions/manifest.yaml` is missing, print: `Run $conventions-init --security <profile> first.`
5. If refresh ran, verify `.conventions/manifest.yaml` contains `stack.securityProfile: <profile>`; if init instruction was printed, skip verification and stop after reporting the instruction.
6. When refresh ran, report generated files and any required repository secrets.

## Failure handling
- Invalid cwd: `BLOCKED security-hardening - run from the target project, not ai-ressources`.
- Missing/invalid profile: `ERROR security-hardening type=invalid_profile profile=<value>`.
- Delegated command failure: preserve the `$conventions-refresh` error and stop.

## Done
- Security profile applied or clear init instruction printed.
- No literal secrets written.
- When refresh ran, generated workflow state matches `.conventions/manifest.yaml`; when manifest is missing, no workflow verification is required.
