# Security Profiles

Use security hardening as an explicit profile persisted in `.conventions/manifest.yaml` under `stack.securityProfile`.

## Profiles

| Profile | Use when | Generated security |
|---|---|---|
| `none` | Throwaway, local-only, or intentionally unscanned repos | No security workflow |
| `baseline` | Default private projects and backwards-compatible init behavior | Gitleaks + Trivy filesystem scan |
| `production` | Projects expected to run in production | Baseline + stack SAST/SCA/misconfig jobs |
| `public` | Public repositories or published packages | Production + CodeQL and Dependabot where stack supports them |
| `web-staging` | Deployed web apps with a staging URL | Production + staged DAST against `${{ secrets.STAGING_URL }}` |

Default: `baseline` for `$conventions-init`; `keep` for `$conventions-refresh`.

## Stack Matrix

| Stack / context | Baseline | Production | Public | Web-staging |
|---|---|---|---|---|
| Any repo | Gitleaks; Trivy fs `vuln,secret,misconfig` | Same | Same | Same |
| JS/TS | None additional | Semgrep `p/owasp-top-ten`, `p/javascript`, `p/typescript`; npm/pnpm/yarn audit when lockfile exists | CodeQL `javascript-typescript` when public | Same |
| Python | None additional | Semgrep Python; `pip-audit` when dependency files exist; optional Bandit | CodeQL `python` when public | Same |
| Go | None additional | `govulncheck`; optional `gosec` | CodeQL `go` when public | Same |
| Rust | None additional | `cargo audit`; optional `cargo deny` when configured | CodeQL `rust` when public | Same |
| .NET / C# | None additional | `dotnet list package --vulnerable`; Semgrep C# if configured | CodeQL `csharp` when public | Same |
| Docker / IaC | Trivy detects present files | Trivy misconfig remains artifacted by severity policy | Same | Same |
| Deployed web app | None | None unless a web profile is requested | None unless a web profile is requested | Nuclei + ZAP baseline against `STAGING_URL` |

## Rules

- DAST is application-context dependent, not language dependent.
- Semgrep configs are stack-specific. `p/javascript` is JS/TS-oriented, not universal.
- Generated workflows must contain secret references only, never literal secret values.
- `web-staging` must validate `secrets.STAGING_URL` before running DAST.
- JS/TS `production` uses `security-production-js-ts.yml`; JS/TS `web-staging` uses `security-production-web-js-ts.yml`.
- `securityMatrixVersion` is `2026-06-30`.
