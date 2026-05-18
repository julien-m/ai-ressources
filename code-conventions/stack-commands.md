---
extends: []
---
# Stack Commands

Mapping from stack detection markers to pre-commit commands and CI templates.
Used by `/conventions-init` Phase 7 (pre-commit hook) and Phase 8 (CI workflows).

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
| Rust | Cargo.toml | `cargo check`, `cargo clippy -- -D warnings` | ci-rust | rust |
| Go | go.mod | `go build ./...`, `go vet ./...` | ci-go | go |
| Python + pyright | pyproject.toml + [tool.pyright] | `if ! git diff --cached --quiet --diff-filter=ACMR -- '*.py'; then git diff --cached --name-only --diff-filter=ACMR -z -- '*.py' \| xargs -0 ruff check; fi`<br>`pyright` | ci-python | python |
| Python + mypy | pyproject.toml + (mypy.ini \| .mypy.ini \| [tool.mypy]) | `if ! git diff --cached --quiet --diff-filter=ACMR -- '*.py'; then git diff --cached --name-only --diff-filter=ACMR -z -- '*.py' \| xargs -0 ruff check; fi`<br>`mypy .` | ci-python | python |
| Python | pyproject.toml \| setup.py | `if ! git diff --cached --quiet --diff-filter=ACMR -- '*.py'; then git diff --cached --name-only --diff-filter=ACMR -z -- '*.py' \| xargs -0 ruff check; fi` | ci-python | python |
| Delphi | *.dproj \| *.dpr | `dcc32 {dpr_file} -Q -W` | — | — |
| C/C++ (CMake) | CMakeLists.txt | `cmake --build . --target all` | — | — |
| .NET / C# | *.sln \| *.csproj | `dotnet build --no-restore` | ci-dotnet | csharp |

## Detection Rules
### Within a stack family
Table rows are ordered by specificity — most specific first. Within a family (e.g., TypeScript variants), first match wins for label assignment.
### Across stack families
Each family (TypeScript, Rust, Go, Python, Delphi, C/C++, .NET) is detected independently. ALL matching families are included.
### Primary stack
For CI file naming: the first family in table order whose markers are found. Table order defines priority: TypeScript > Rust > Go > Python > Delphi > C/C++ > .NET.
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
