---
extends: []
---
# Stack Commands

Mapping from stack detection markers to pre-commit commands and CI templates.
Used by `/conventions-init` Phase 7 (pre-commit hook), Phase 8 (CI workflows), and security profile generation.

## Stack Detection Table

> **Staged-file linters:** use `git diff --cached --quiet --diff-filter=ACMR -- <pathspecs>` to guard, then
> `git diff --cached --name-only --diff-filter=ACMR -z -- <pathspecs> | xargs -0 <linter>` to invoke.
> The `-z`/`xargs -0` pipeline is safe for filenames containing spaces. Type checkers and build tools always
> run on the full project.

| Stack Label | Markers | Pre-commit Commands | CI Template | CodeQL Language |
|---|---|---|---|---|
| TypeScript + Biome | tsconfig.json + (biome.json \| biome.jsonc) | `npx tsc --noEmit`<br>`if ! git diff --cached --quiet --diff-filter=ACMR -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.json'; then git diff --cached --name-only --diff-filter=ACMR -z -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.json' \| xargs -0 npx biome check; fi` | ci-node | javascript-typescript |
| TypeScript + ESLint | tsconfig.json + (.eslintrc* \| eslint.config.*) | `npx tsc --noEmit`<br>`if ! git diff --cached --quiet --diff-filter=ACMR -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs'; then git diff --cached --name-only --diff-filter=ACMR -z -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' \| xargs -0 npx eslint; fi` | ci-node | javascript-typescript |
| TypeScript | tsconfig.json | `npx tsc --noEmit` | ci-node | javascript-typescript |
| Elixir / Phoenix | mix.exs (Phoenix/Ecto/Oban detected from dependencies) | `mix format --check-formatted`, `MIX_ENV=test mix compile --warnings-as-errors`, `mix test` | Application-specific; read [Elixir CI](elixir-testing.md) | — |
| Rust | Cargo.toml | `cargo check`, `cargo clippy -- -D warnings` | ci-rust | rust |
| Go | go.mod | `go build ./...`, `go vet ./...` | ci-go | go |
| Python + pyright | pyproject.toml + [tool.pyright] | `if ! git diff --cached --quiet --diff-filter=ACMR -- '*.py'; then git diff --cached --name-only --diff-filter=ACMR -z -- '*.py' \| xargs -0 ruff check; fi`<br>`pyright` | ci-python | python |
| Python + mypy | pyproject.toml + (mypy.ini \| .mypy.ini \| [tool.mypy]) | `if ! git diff --cached --quiet --diff-filter=ACMR -- '*.py'; then git diff --cached --name-only --diff-filter=ACMR -z -- '*.py' \| xargs -0 ruff check; fi`<br>`mypy .` | ci-python | python |
| Python | pyproject.toml \| setup.py | `if ! git diff --cached --quiet --diff-filter=ACMR -- '*.py'; then git diff --cached --name-only --diff-filter=ACMR -z -- '*.py' \| xargs -0 ruff check; fi` | ci-python | python |
| Delphi | *.dproj \| *.dpr | `dcc32 {dpr_file} -Q -W` | — | — |
| C/C++ (CMake) | CMakeLists.txt | `cmake --build . --target all` | — | — |
| .NET / C# | *.sln \| *.csproj | `dotnet build --no-restore` | ci-dotnet | csharp |

## Security Profile Matrix

Profiles are opt-in through `$conventions-init --security <profile>` / `/conventions-init --security <profile>`, `$conventions-refresh --security <profile>` / `/conventions-refresh --security <profile>`, or `$security-hardening --profile <profile>` / `/security-hardening --profile <profile>`.

| Profile | Scope | Workflow template | Stack additions |
|---|---|---|---|
| `none` | No security workflow | — | — |
| `baseline` | Default private-project posture | `security-baseline.yml` | Gitleaks + Trivy filesystem `vuln,secret,misconfig` |
| `production` | Production-bound projects | `security-production-js-ts.yml` for JS/TS; other stack-specific `security-production-*.yml` when available, else baseline with warning | JS/TS: Semgrep OWASP + JS/TS configs and npm/pnpm/yarn audit; Python: Semgrep Python + pip-audit; Go: govulncheck; Rust: cargo audit; .NET: vulnerable package check |
| `public` | Public repos or published packages | Production template + CodeQL/Dependabot when supported | Uses CodeQL Language column and dependency update template |
| `web-staging` | Deployed web apps with staging URL | `security-production-web-js-ts.yml` for JS/TS web apps | Production scans + Nuclei/ZAP DAST against `secrets.STAGING_URL` |

DAST is app-context dependent, not language dependent. Do not add Nuclei/ZAP just because a language is detected; require a deployed web app and `web-staging`.

## Detection Rules
### Within a stack family
Table rows are ordered by specificity — most specific first. Within a family (e.g., TypeScript variants), first match wins for label assignment.
### Across stack families
Each family (TypeScript, Elixir, Rust, Go, Python, Delphi, C/C++, .NET) is detected independently. ALL matching families are included.
### Primary stack
For CI file naming: the first family in table order whose markers are found. Table order defines priority: TypeScript > Elixir > Rust > Go > Python > Delphi > C/C++ > .NET.
### Linter sub-detection (TypeScript)
1. `biome.json` or `biome.jsonc` → Biome
2. `.eslintrc`, `.eslintrc.js`, `.eslintrc.cjs`, `.eslintrc.json`, `eslint.config.js`, `eslint.config.mjs` → ESLint
3. Neither → TypeScript only (no linter command)
### Type checker sub-detection (Python)
1. `[tool.pyright]` section in `pyproject.toml` → pyright
2. `mypy.ini`, `.mypy.ini`, or `[tool.mypy]` section in `pyproject.toml` → mypy
3. Neither → Python only (no type checker command)
### Tool existence guards
**Single-stack:** `command -v` check → `exit 1` if missing (fail-closed).

**Multi-stack:** `command -v` check → skip block if missing (warn, continue to next stack). Add `_ran=0` counter incremented per executed block. At the end, if `_ran` is still 0, exit 1 with "No tools found" error.

## Elixir detection and validation

- `mix.exs` identifies a Mix family independently of a React/TypeScript frontend or Rust crate. Use `mix.lock` and dependency declarations to refine Phoenix, `phoenix_live_view`, `ecto_sql`, `postgrex` and `oban` routing; a Mix file alone does not imply every framework.
- Read [Elixir tests and CI](elixir-testing.md) for dependency resolution, DB preparation, test groups, optional Credo/Dialyxir/ExDoc and isolated PostgreSQL service prerequisites. Commands require the pinned toolchain and a test DB where applicable.
- No portable `ci-elixir` template or CodeQL Elixir language is supplied here. Adapt the documented CI example in the application; do not claim the portable generator implements a new template. Unsupported security tooling uses the existing profile fallback with an explicit gap.
- Read [runtime configs](runtime-configs.md) for version files, formatter, secrets, sandbox and ignore patterns. Keep all matching frontend/native checks in multi-stack repositories.

## OpenAPI and generated clients

Detect `:open_api_spex` in Mix dependencies and `orval.config.*` / `orval` in client dependencies. Read [REST/OpenAPI coherence commands](openapi.md) for offline export, document lint, locked SDK generation, generated/untracked diff gates, strict consumer compilation and runtime contract tests; add these to the application CI alongside its Elixir/TypeScript families. No new portable CI template is implied.
