# TypeScript CLI Conventions (Delta)

> Delta on [`javascript.md`](javascript.md). Load after it when building a Node.js/Bun CLI application.
> For visual/UX patterns (colors, spinners, tables, prompts), see [`../design/systems/cli-patterns.md`](../design/systems/cli-patterns.md).
> For runtime/language choice, see [`../stack-ref/frontend/cli.md`](../stack-ref/frontend/cli.md).

## Entry Point Architecture

Split every CLI entry point into a **fast path** and a **full path**:

```ts
// src/cli.ts — fast paths first, no heavy imports
if (process.argv.includes("--version")) {
	console.log(VERSION);
	process.exit(0);
}
// Full path: dynamic import defers the heavy module graph
const { run } = await import("./app.js");
await run();
```

- Never `import` the full application at the top of the entry point — use `await import(...)` for the main module
- `--version` and `--help` must be instant

## Command Registration (Commander.js)

- Use **Commander.js** for argument parsing — never `switch` on `process.argv` manually
- Use `InvalidArgumentError` for argument validation, not manual `process.exit`
- Use `.parseAsync()` not `.parse()` — async commands need it
- Register all commands in `src/commands/`, one file per command
- Every command that returns data **must** support `--json` for scripting

## Module Structure

```
src/
  cli.ts          # Entry point — fast path + dynamic import of app
  app.ts          # Command registration, program setup
  commands/       # One file per command — thin wiring only (args → service → output)
  services/       # Business logic — HTTP clients, file ops, config (owns all I/O)
  utils/          # Pure functions — no I/O, no side effects
  types/          # Shared TypeScript types and interfaces
```

- No `helpers/`, `misc/`, or `common/` catch-all folders (see `general.md §3`)
- `commands/` must not contain business logic — delegate to `services/`

## Build Pipeline

- **esbuild** for distributable CLIs — bundle to single ESM output
- **`bun build --compile`** for internal/dev tools — self-contained binary
- Always include `bin` field in `package.json` for installable CLIs
- Add `#!/usr/bin/env node` shebang to the output entry point
- Run `typecheck` separately from `build` — esbuild does not type-check
- Use esbuild `define` for build-time feature gates (dead-code elimination)

## Startup Optimization

Parallelize all I/O at startup — fire config reads and credential lookups before argument parsing:

```ts
const configPromise = loadConfig();
const credentialsPromise = loadCredentials();
// ... parse arguments ...
const [config, credentials] = await Promise.all([configPromise, credentialsPromise]);
```

- Never `await` at the top of the entry point for non-essential I/O
- Use `Promise.all` not sequential `await` for independent I/O operations

## Error Handling

### Custom Error Classes

- One error class per category — always set `this.name` explicitly (survives minification)
- Use dual detection: `instanceof` (dev) + `.name` check (minified prod builds)

### CLI Error Boundary

Top-level boundary catches and formats errors with actionable next steps:

```ts
try {
	await program.parseAsync();
} catch (error) {
	if (isAuthError(error)) {
		console.error("Authentication failed. Run `my-cli auth login` to re-authenticate.");
		process.exit(1);
	}
	console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
	console.error("Run with DEBUG=1 for full details.");
	process.exit(1);
}
```

- Always include a hint on what the user should do next
- Use `process.exit(1)` on error, `process.exit(0)` on success
- Never `process.exit()` in services — throw errors, let the boundary call `exit`
- Never swallow errors silently

## Terminal Output

### stdout vs stderr

- **stdout**: command data (JSON `--json` output, values)
- **stderr**: status messages, errors, warnings, progress, spinners

Separating channels allows `my-cli get | jq .` to work without pollution.

### Colors and Spinners

- `chalk` for colors — respects `NO_COLOR` automatically
- `ora` for spinners — always `succeed()`, `fail()`, or `stop()`, never leave running

## Interactive TUI (Ink)

- Use **Ink** (React for terminal) only for continuously-updating interactive UI — not for simple one-shot commands
- Always guard with `process.stdout.isTTY` — provide non-interactive fallback
- tsconfig: `"jsx": "react-jsx"`, `"jsxImportSource": "react"`

## ESM Imports

Use `.js` extension for local imports even in `.ts` files — Node.js ESM requires it:

```ts
// Correct — .js extension in .ts source file
import { deployCommand } from "./commands/deploy.js";
import type { Config } from "./types/config.js";
```

## Environment Variables

- Validate all env vars with Zod at startup, before registering commands
- Respect `NO_COLOR` and `XDG_CONFIG_HOME`
- Document every env var in `--help` output or README

## Testing

- Mock the service layer — commands should have no business logic to test directly
- Use `vi.spyOn(process, "exit")` to assert exit codes without actually exiting
- Test `--json` output paths separately to verify JSON structure
- Never test against real network/filesystem in unit tests

## Anti-Patterns

| Anti-pattern | Correct approach |
|---|---|
| `strict: false` in tsconfig | `strict: true` always |
| Silent `catch {}` blocks | Log at minimum; re-throw if unrecoverable |
| Top-level `await` for I/O at import | Fire in background, `await` lazily |
| `process.exit()` in services | Throw error; let CLI boundary call `exit` |
| Mixed stdout/stderr output | Data on stdout, status on stderr |
| Monolithic command files (>300 LOC) | Split: service layer + thin command handler |
| Hardcoded `.env` path assumptions | Respect `XDG_CONFIG_HOME` |

## Inline Comment Triggers (CLI-Specific)

All triggers from `general.md §25` apply. Additionally for CLI code:

- **Dynamic `import()`** at entry point — explain which fast-path this enables
- **Lazy `import()`** inside a function — explain which circular dependency it breaks
- **`process.exit()`** in non-boundary code — explain why throwing is not sufficient
- **`isTTY` checks** — explain what the non-TTY fallback does and why
