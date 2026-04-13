---
extends: []
---

# Stack Commands

Mapping from stack detection markers to pre-commit commands and CI templates.
Used by `/conventions.init` Phase 7 (pre-commit hook) and Phase 8 (CI workflows).

## Stack Detection Table

| Stack Label | Markers | Pre-commit Commands | CI Template | CodeQL Language |
|---|---|---|---|---|
| TypeScript + Biome | tsconfig.json + (biome.json \| biome.jsonc) | `npx tsc --noEmit`, `npx biome check .` | ci-node | javascript-typescript |
| TypeScript + ESLint | tsconfig.json + (.eslintrc* \| eslint.config.*) | `npx tsc --noEmit`, `npx eslint .` | ci-node | javascript-typescript |
| TypeScript | tsconfig.json | `npx tsc --noEmit` | ci-node | javascript-typescript |
| Rust | Cargo.toml | `cargo check`, `cargo clippy -- -D warnings` | ci-rust | rust |
| Go | go.mod | `go build ./...`, `go vet ./...` | ci-go | go |
| Python | pyproject.toml \| setup.py | `ruff check .`, `mypy .` | ci-python | python |
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

### Tool existence guards

**Single-stack:** `command -v` check → `exit 1` if missing (fail-closed).

**Multi-stack:** `command -v` check → skip block if missing (warn, continue to next stack). Add `_ran=0` counter incremented per executed block. At the end, if `_ran` is still 0, exit 1 with "No tools found" error.
