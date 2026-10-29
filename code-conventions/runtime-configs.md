---
extends: []
---
# Runtime Configurations

Expected configuration defaults per runtime and language. Used by `/conventions-init` Phase 6 (Config Audit).

Structure: `##` per language, `###` per config file. Each config section specifies expected keys, values, and behavior when the file is missing.

## TypeScript
### Runtime detection
First match wins:

| Signal | Runtime |
|---|---|
| `bun.lock` or `bunfig.toml` | Bun |
| `deno.json` or `deno.lock` | Deno |
| `pnpm-lock.yaml` | Node + pnpm |
| `yarn.lock` | Node + yarn |
| `package-lock.json` | Node + npm |
| `package.json` (no lockfile) | Node + npm (fallback) |

No JS/TS files detected = skip TypeScript config audit.
### Config: tsconfig.json
Create if missing: **confirm**

| Runtime | Key | Expected |
|---|---|---|
| All | `compilerOptions.strict` | `true` |
| All | `compilerOptions.esModuleInterop` | `true` |
| All | `compilerOptions.skipLibCheck` | `true` |
| All | `compilerOptions.forceConsistentCasingInImports` | `true` |
| Bun | `compilerOptions.moduleResolution` | `"bundler"` |
| Bun | `compilerOptions.target` | `"ESNext"` |
| Bun | `compilerOptions.module` | `"ESNext"` |
| Deno | `compilerOptions.lib` | includes `"deno.ns"` |
| Node | `compilerOptions.moduleResolution` | `"node16"` or `"nodenext"` |
| Node | `compilerOptions.target` | `"ES2022"` or higher |
| Node | `compilerOptions.module` | `"node16"` or `"nodenext"` |
### Config: package.json
Create if missing: **confirm**

| Runtime | Key | Expected | If missing |
|---|---|---|---|
| All | `type` | `"module"` | auto |
| All | `scripts.typecheck` | exists | auto |
| All | `scripts.lint` | exists | signal |
| All | `scripts.test` | exists | signal |
| Bun | `devDependencies.@types/bun` | present | — |
| Bun | `scripts.typecheck` | `"bunx tsc --noEmit"` | — |
### Config: .nvmrc / .node-version
- **Node (all):** create `.nvmrc` with current LTS if missing — auto
- **Bun:** create `.node-version` if missing — auto
- **Deno:** skip
### Config: .editorconfig
Create if missing: **auto**

```ini
root = true

[*]
indent_style = tab
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.prisma]
indent_style = space
indent_size = 2
```
### Config: biome
Create if missing: **auto**

**All runtimes (except Deno):** check `biome.json` or `biome.jsonc` exists.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "formatter": {
    "indentStyle": "tab",
    "lineWidth": 120
  },
  "linter": {
    "enabled": true
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
```
### Config: vitest.config.ts
**All runtimes:** check existence when `vitest` is in devDependencies. If missing — signal only.
### Config: bunfig.toml
**Bun only:** no required defaults — file presence is enough signal.
### Config: .npmrc
Create if missing (pnpm only): **auto**

```ini
shamefully-hoist=true
```
---
## Elixir

Applies when `mix.exs` exists. Read [Elixir rules](elixir.md) and [test/CI commands](elixir-testing.md) before creating configuration; use Mix rather than a JavaScript package manager for BEAM dependencies.

| File | Expected contract | If missing |
|---|---|---|
| `.tool-versions` or equivalent | Exact compatible Elixir and Erlang/OTP versions, reused by CI/release builds | Select/test a pair; do not write an unverified latest version |
| `mix.exs` | OTP app identity, Elixir requirement, dependencies and reviewed aliases | Use project scaffolding; preserve existing application settings |
| `mix.lock` | Committed application dependency resolution | Generate with `mix deps.get`, review diff |
| `.formatter.exs` | Inputs covering `mix.exs`, config, lib and test; chosen dependency imports and HEEx plugin if LiveView | Use generated defaults then adapt |
| `config/runtime.exs` | Validated deployment env, secrets, pool/concurrency/deadline limits | Add when runtime deployment settings are needed; never put secrets in module attributes |
| `config/test.exs` | Isolated test database and SQL Sandbox when Ecto is used; Oban manual mode when installed | Keep test credentials separate; never fall back to production |
| `test/test_helper.exs` | ExUnit startup and sandbox mode if applicable | Use the generated test setup |

Credo configuration and Dialyxir/PLT settings apply only when selected by the project. A Rustler crate also needs its Rust toolchain/lock/build configuration and matching production target. Generated files still require review.

---
## .gitignore Patterns
Language-independent. Composed in layers — common first, then per detected language.
### Layer: common
Always applied:

```gitignore
# OS — Windows
Thumbs.db

# OS — macOS
.DS_Store
.AppleDouble
.LSOverride
._*
.Spotlight-V100
.Trashes
.fseventsd
.DocumentRevisions-V100
.TemporaryItems

# IDE
.idea/
.vscode/
.zed/
*.swp
*.swo

# Environment
.env
.env.*
!.env.example

# Logs
*.log

# Conventions and local agent state
.conventions/
.claude/
.agents/
```

> `.vscode/` is skippable if the user explicitly opts out (team shares VS Code settings).
### Layer: typescript
```gitignore
node_modules/
dist/
build/
.output/
coverage/
.tsbuildinfo
.next/
.nuxt/
.astro/
.turbo/
.bun/
.npm/
.yarn/
.pnpm-store/
```
### Layer: go
```gitignore
bin/
*.exe
vendor/
```
### Layer: elixir

Commit `mix.lock`, migrations and non-secret runtime config; do not ignore `priv/` wholesale because it may contain required migrations, translations and release assets.

```gitignore
_build/
deps/
cover/
doc/
*.ez
erl_crash.dump
```

For Rustler, also apply the Rust layer; retain the native crate source and application lockfile.

### Layer: rust
```gitignore
target/
*.pdb
```
### Layer: delphi
```gitignore
*.dcu
*.exe
*.dll
*.bpl
*.dcp
*.map
*.drc
__history/
__recovery/
Win32/
Win64/
```
### Layer: python
```gitignore
__pycache__/
*.pyc
.venv/
*.egg-info/
.mypy_cache/
.ruff_cache/
```
### Layer: swift
Apple development (iOS, macOS, watchOS, tvOS, visionOS). For solo/small-team projects, lockfiles (`Package.resolved`, `Podfile.lock`) are committed for build reproducibility — only the resolved dependency trees and build artifacts are ignored.

```gitignore
# Xcode build artifacts
build/
DerivedData/
*.dSYM
*.dSYM.zip
*.xcarchive
*.xcresult
*.hmap
*.ipa
*.app
*.app.dSYM

# Xcode user-specific
xcuserdata/
*.xcuserstate
*.xccheckout
*.moved-aside
*.perspectivev3
!default.perspectivev3

# Xcode workspace local state
*.xcworkspace/xcuserdata/
*.xcodeproj/xcuserdata/
*.xcodeproj/project.xcworkspace/xcuserdata/
*.xcodeproj/project.xcworkspace/xcshareddata/IDEWorkspaceChecks.plist

# Swift Package Manager
.build/
.swiftpm/
# Note: Package.resolved IS committed (lockfile for reproducibility)

# CocoaPods
Pods/
# Note: Podfile.lock IS committed

# Carthage
Carthage/Build/
Carthage/Checkouts/

# Fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/**/*.png
fastlane/test_output

# Provisioning / signing (sensitive)
*.mobileprovision
*.cer
*.p12
*.p8

# Coverage (Xcode/llvm)
*.gcno
*.gcda
```
### Layer: kotlin
```gitignore
build/
.gradle/
```
