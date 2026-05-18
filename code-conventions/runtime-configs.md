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

# Conventions
.conventions/
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
