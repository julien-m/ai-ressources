# TypeScript CLI Conventions (Delta)

> Delta on [`javascript.md`](javascript.md). Load after it when building a Node.js/Bun CLI application.
> For visual/UX patterns (colors, spinners, tables, prompts), see [`../design/systems/cli-patterns.md`](../design/systems/cli-patterns.md).
> For runtime/language choice (Go vs TypeScript vs Rust), see [`../stack-ref/frontend/cli.md`](../stack-ref/frontend/cli.md).

---

## 1. Entry Point Architecture

Split every CLI entry point into a **fast path** and a **full path**.

```ts
// src/cli.ts — entry point
// Fast paths: no imports from the heavy application module
if (process.argv.includes('--version')) {
  console.log(VERSION)
  process.exit(0)
}
if (process.argv.includes('--help')) {
  // Minimal imports for help text only
  await import('./help.js')
  process.exit(0)
}

// Full path: dynamic import keeps startup fast by deferring module loading
const { run } = await import('./app.js')
await run()
```

**Why:** Dynamic import defers the cost of loading the full module graph until it's actually needed. `--version` and `--help` must be instant.

**Rule:** Never `import` the full application at the top of the entry point. Use `await import(...)` for the main module.

---

## 2. Command Registration (Commander.js)

Use **Commander.js** for argument parsing. Register commands declaratively; never `switch` on `process.argv` manually.

```ts
import { Command, InvalidArgumentError } from 'commander'

const program = new Command()
  .name('my-cli')
  .description('My CLI description')
  .version(VERSION)

program
  .command('deploy <environment>')
  .description('Deploy to the given environment')
  .option('-f, --force', 'Skip confirmation prompt')
  .option('--timeout <ms>', 'Timeout in milliseconds', parseIntArg, 30_000)
  .action(async (environment, opts) => {
    await deployCommand(environment, opts)
  })

await program.parseAsync()

function parseIntArg(value: string): number {
  const n = parseInt(value, 10)
  if (isNaN(n)) throw new InvalidArgumentError('Expected an integer.')
  return n
}
```

**Rules:**
- Use `InvalidArgumentError` for argument validation, not manual `process.exit`
- Provide `--json` flag on commands that produce structured output — allows scripting
- Use `.parseAsync()` not `.parse()` — async commands need it
- Register all commands in a dedicated `src/commands/` directory, one file per command

---

## 3. Module Structure

```
src/
├── cli.ts               # Entry point — fast path + dynamic import of app
├── app.ts               # Command registration, program setup
├── commands/            # One file per command (deploy.ts, init.ts, etc.)
├── services/            # Business logic — HTTP clients, file ops, config
├── utils/               # Pure utility functions — no I/O, no side effects
└── types/               # Shared TypeScript types and interfaces
```

**Rules:**
- `commands/` only wires arguments → service calls → output. No business logic
- `services/` owns all external I/O (HTTP, filesystem, OS calls)
- `utils/` is pure — functions that take input and return output, no side effects
- No `helpers/`, `misc/`, or `common/` catch-all folders (see `general.md §3`)

---

## 4. Build Pipeline (esbuild)

For distributable CLIs, use **esbuild** to transpile TypeScript to a single or tree-structured JavaScript bundle.

```ts
// build.mjs
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/cli.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  outfile: 'dist/cli.js',
  define: {
    'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
  },
})
```

**For internal/dev tools:** `bun build --compile src/cli.ts --outfile dist/my-cli` — produces a self-contained binary, no Node.js required.

**package.json scripts:**
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "node build.mjs",
    "dev": "bun run src/cli.ts"
  },
  "bin": {
    "my-cli": "./dist/cli.js"
  }
}
```

**Rules:**
- Always include a `bin` field for installable CLIs
- Add `#!/usr/bin/env node` shebang to the output entry point
- Run `typecheck` separately from `build` — esbuild does not type-check

---

## 5. Feature Flags / Build-Time Gates

Use **compile-time `define`** (esbuild/Bun) to gate experimental features. This enables dead-code elimination: disabled features produce zero runtime cost.

```ts
// feature-flags.ts
declare const __FEATURE_EXPERIMENTAL__: boolean

export function isFeatureEnabled(flag: string): boolean {
  // Values injected at build time via esbuild `define`
  // Dead code eliminated when false: if (false) { ... } → removed
  if (flag === 'EXPERIMENTAL') return __FEATURE_EXPERIMENTAL__
  return false
}
```

```ts
// esbuild define options
define: {
  '__FEATURE_EXPERIMENTAL__': String(process.env.ENABLE_EXPERIMENTAL === 'true'),
}
```

**Rules:**
- Never use runtime feature flags for security-critical gating — they can be bypassed
- Use runtime feature flags (env vars) for user-configurable behavior
- Use build-time flags only for features that need to be fully absent in production

---

## 6. Lazy Imports for Circular Dependencies

When circular dependencies arise between modules, use lazy `import()` (dynamic) to defer resolution:

```ts
// Lazy import to break circular dependency: moduleA → moduleB → moduleA
// This defers the import until the function is called, after all modules initialize
async function getHelper() {
  const { helperFn } = await import('./helpers.js')
  return helperFn
}
```

**Comment requirement:** Always add a comment explaining *why* the import is lazy (which circular dependency it breaks). A lazy import without explanation looks like a bug.

---

## 7. Startup Optimization

Parallelize all I/O that happens at CLI startup.

```ts
// Start all slow I/O in parallel at boot — don't await immediately
const configPromise = loadConfig()          // reads ~/.myapp/config.json
const credentialsPromise = loadCredentials() // reads from keychain or .env

// ... parse arguments, register commands ...

// Now await — by this point they may already be done
const [config, credentials] = await Promise.all([configPromise, credentialsPromise])
```

**Rules:**
- Never `await` at the top of the entry point for non-essential I/O
- Fire config reads, credential lookups, and remote calls before argument parsing
- Use `Promise.all` not sequential `await` for independent I/O operations

---

## 8. Error Handling

### 8.1 Custom Error Classes

Define one error class per error category:

```ts
export class ConfigError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
  ) {
    super(message)
    this.name = 'ConfigError'
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}
```

**Rule:** Always set `this.name` explicitly — minifiers may mangle class names, and `error.name` is used for logging and pattern matching.

### 8.2 Error Detection Utilities

```ts
// Use both instanceof (dev) and .name (minified prod builds)
export function isAuthError(e: unknown): e is AuthError {
  return e instanceof AuthError || (e instanceof Error && e.name === 'AuthError')
}

export function isNetworkError(e: unknown): e is NetworkError {
  return e instanceof NetworkError || (e instanceof Error && e.name === 'NetworkError')
}
```

### 8.3 CLI Error Boundary

Catch and format errors at the top-level boundary only — never silence errors in business logic:

```ts
// src/app.ts — top-level CLI error boundary
try {
  await program.parseAsync()
} catch (error) {
  if (isAuthError(error)) {
    console.error('Authentication failed. Run `my-cli auth login` to re-authenticate.')
    process.exit(1)
  }
  if (isNetworkError(error)) {
    console.error(`Network error: ${error.message}`)
    process.exit(1)
  }
  // Unknown error — show full stack in verbose mode
  if (process.env.DEBUG) {
    console.error(error)
  } else {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    console.error('Run with DEBUG=1 for full details.')
  }
  process.exit(1)
}
```

**Rules (delta on `general.md §7`):**
- CLI boundary catches and formats errors as user-readable messages with actionable next steps
- Always include a hint on what the user should do next (not just what went wrong)
- Use `process.exit(1)` on error, `process.exit(0)` on success — never omit the exit code
- Never swallow errors silently; always log at minimum with `console.error`

---

## 9. Discriminated Unions for Command Results

Use discriminated unions to represent command outcomes:

```ts
type CommandResult =
  | { type: 'success'; data: unknown }
  | { type: 'error'; message: string; hint?: string }
  | { type: 'cancelled' }

async function runCommand(): Promise<CommandResult> {
  try {
    const data = await doWork()
    return { type: 'success', data }
  } catch (e) {
    if (e instanceof AbortError) return { type: 'cancelled' }
    return { type: 'error', message: e instanceof Error ? e.message : String(e) }
  }
}

// Caller handles all cases exhaustively
const result = await runCommand()
switch (result.type) {
  case 'success': displaySuccess(result.data); break
  case 'error':   displayError(result.message, result.hint); process.exit(1); break
  case 'cancelled': console.log('Cancelled.'); break
}
```

---

## 10. Terminal Output

### 10.1 stdout vs stderr

- **stdout**: command output (data the user asked for, JSON `--json` output)
- **stderr**: status messages, errors, warnings, progress

```ts
// Correct: status → stderr, data → stdout
process.stderr.write(`Fetching data from ${url}...\n`)
process.stdout.write(JSON.stringify(result))
```

**Why:** Separating channels allows `my-cli get | jq .` to work without status messages polluting the JSON.

### 10.2 Colors

Use `chalk` (ESM) for terminal colors. Always check `NO_COLOR` and `--no-color`:

```ts
import chalk from 'chalk'

// chalk respects NO_COLOR and chalk.level automatically
const success = chalk.green('✓')
const error = chalk.red('✗')
const warn = chalk.yellow('⚠')
const info = chalk.gray('ℹ')
const code = chalk.cyan
```

### 10.3 Spinners / Progress

Use `ora` for spinners. Always `succeed()`, `fail()`, or `stop()` — never leave a spinner running:

```ts
import ora from 'ora'

const spinner = ora('Deploying...').start()
try {
  await deploy()
  spinner.succeed('Deployed successfully')
} catch (e) {
  spinner.fail(`Deployment failed: ${e instanceof Error ? e.message : String(e)}`)
  process.exit(1)
}
```

### 10.4 Structured Output (`--json`)

Every command that returns data **must** support a `--json` flag for scripting:

```ts
program
  .command('status')
  .option('--json', 'Output as JSON')
  .action(async (opts) => {
    const status = await getStatus()
    if (opts.json) {
      console.log(JSON.stringify(status, null, 2))
    } else {
      printStatusTable(status)
    }
  })
```

---

## 11. Interactive TUI (React/Ink)

Use **Ink** when the CLI needs an interactive, continuously-updating terminal UI (e.g., a chat loop, live progress tracker, interactive selection).

**When to use Ink:**
- Multi-step interactive sessions that update the display in place
- Real-time streaming output with formatted layout
- Interactive prompts with live state (selection lists, text input with validation)

**When NOT to use Ink:**
- Simple one-shot commands (use `chalk` + `ora` instead)
- Scripts and CI environments (Ink requires a TTY; always check `process.stdout.isTTY`)

```tsx
import React, { useState } from 'react'
import { render, Box, Text, useInput } from 'ink'

type Props = { items: string[] }

function SelectList({ items }: Props) {
  const [selected, setSelected] = useState(0)

  useInput((input, key) => {
    if (key.upArrow) setSelected(i => Math.max(0, i - 1))
    if (key.downArrow) setSelected(i => Math.min(items.length - 1, i + 1))
    if (key.return) {
      // handle selection
    }
  })

  return (
    <Box flexDirection="column">
      {items.map((item, i) => (
        <Text key={item} color={i === selected ? 'cyan' : undefined}>
          {i === selected ? '❯ ' : '  '}{item}
        </Text>
      ))}
    </Box>
  )
}

// Always check TTY before rendering Ink
if (!process.stdout.isTTY) {
  // Fallback: non-interactive output
  items.forEach(item => console.log(item))
} else {
  render(<SelectList items={items} />)
}
```

**tsconfig for Ink projects:**
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

---

## 12. ESM Imports in TypeScript CLI Projects

Follow the ESM-first conventions from `javascript.md`, with the additional rule:

- Use `.js` extension for local imports even in `.ts` files — TypeScript resolves them correctly, and the compiled output requires them

```ts
// ✓ Correct — .js extension in .ts source file
import { deployCommand } from './commands/deploy.js'
import type { Config } from './types/config.js'

// ✗ Wrong — extensionless imports break Node.js ESM resolution
import { deployCommand } from './commands/deploy'
```

**Why:** Node.js ESM does not perform automatic extension resolution. The `.js` extension must be present in the source so it survives TypeScript compilation unchanged.

---

## 13. Anti-Patterns (from Production CLI Analysis)

Documented from analysis of real CLI codebases. Avoid these patterns:

| Anti-pattern | Why it's harmful | Correct approach |
|---|---|---|
| `strict: false` in tsconfig | Misses whole categories of bugs at compile time | `strict: true` always (see `javascript.md`) |
| Silent `catch {}` blocks | Hides failures, makes debugging impossible | Log at minimum; re-throw if unrecoverable |
| Top-level `await` for I/O at import | Slows startup for commands that don't need it | Fire in background, `await` lazily before use |
| `process.exit()` in services | Breaks testability; services can't be unit tested | Throw an error; let the CLI boundary call `exit` |
| Non-interactive output mixed with interactive | Breaks piping, JSON parsing, CI environments | Separate stdout (data) from stderr (status) |
| Large monolithic command files (>300 LOC) | Hard to test, hard to read | Split into service layer + thin command handler |
| `require()` in ESM without comment | Looks like a bug; breaks tree-shaking | Only for lazy loading circular deps; always comment why |
| Hardcoded `.env` path assumptions | Breaks in different environments | Use a config library; respect `XDG_CONFIG_HOME` |

---

## 14. Environment Variables

Follow `general.md §12`, with CLI-specific additions:

```ts
import { z } from 'zod'

const envSchema = z.object({
  MY_CLI_API_KEY:   z.string().min(1),
  MY_CLI_BASE_URL:  z.string().url().default('https://api.example.com'),
  MY_CLI_TIMEOUT:   z.coerce.number().positive().default(30_000),
  DEBUG:            z.string().optional(),
  NO_COLOR:         z.string().optional(),
})

export function loadEnv() {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    console.error('Configuration error:')
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`)
    }
    process.exit(1)
  }
  return result.data
}
```

**Rules:**
- Call `loadEnv()` once at startup, before registering commands
- Always document every env var in `--help` output or README
- Respect `NO_COLOR` (chalk respects it automatically if you don't force `chalk.level`)
- Respect `XDG_CONFIG_HOME` for config file paths on Linux/macOS

---

## 15. Testing CLI Commands

```ts
// commands/deploy.test.ts
import { describe, it, expect, vi } from 'vitest'
import { deployCommand } from './deploy.js'
import * as deployService from '../services/deploy.js'

describe('deployCommand', () => {
  it('calls deployService with correct arguments', async () => {
    const spy = vi.spyOn(deployService, 'deploy').mockResolvedValue({ url: 'https://...' })

    await deployCommand('production', { force: false })

    expect(spy).toHaveBeenCalledWith('production', { force: false })
  })

  it('exits 1 on failure', async () => {
    vi.spyOn(deployService, 'deploy').mockRejectedValue(new Error('Network error'))
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    await expect(deployCommand('production', {})).rejects.toThrow('exit')
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})
```

**Rules:**
- Test commands by mocking the service layer — commands should have no business logic to test directly
- Never test against real network/filesystem in unit tests
- Use `vi.spyOn(process, 'exit')` to assert exit codes without actually exiting
- Test `--json` output paths separately to verify JSON structure

---

## Inline Comment Triggers (CLI-Specific)

All 15 triggers from `general.md §25` apply. Additionally for CLI code:

- **Dynamic `import()`** at top of entry point — explain which fast-path this enables
- **Lazy `import()`** inside a function — explain which circular dependency it breaks
- **`process.exit()`** in non-boundary code — explain why throwing is not sufficient
- **`// eslint-disable`** directives — explain which design constraint makes the rule impractical here
- **`isTTY` checks** — explain what the non-TTY fallback does and why
