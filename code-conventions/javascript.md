---
extends: [general]
---
# TypeScript Rules (Delta)

> These rules complement [`general.md`](general.md). Only TypeScript/JavaScript-specific conventions are listed here.
## Stack
- Backend runtime: **Node.js** (dev tooling: **Bun** when useful)
- Frontend: **React**, **Next.js**, **Astro**
- TypeScript is mandatory, `strict` mode enabled
- Runtime validation: **Zod** (or equivalent) for external data

## Project choice and initialization

- Record the runtime, package manager, application/library role and web framework in the brief/README before generation. Use the framework's maintained generator for a framework app; do not assemble its skeleton by hand or initialize several competing starters in the same directory.
- For a plain Node.js package/service/CLI, create and enter the new project directory, then run `npm init` (or `npm init -y` after choosing metadata). This initializes `package.json`, not a TypeScript application. Install the selected local TypeScript version and run `npx tsc --init` when no framework generator supplies `tsconfig.json`; configure ESM, strict typing, build/test scripts and application versus library outputs explicitly.
- For a Bun project, run `bun init` in the new directory and choose the appropriate project kind; do not select a full-stack template for a plain library/CLI. Review the generated scripts, TypeScript settings and Bun-specific dependencies against the runtime actually selected.
- For Next.js, use `npx create-next-app@<generator_version> <project_path> --ts --app`; for Astro, use `npm create astro@<generator_version> -- <project_path>`. Choose the UI/rendering/deployment model first and review generated options. Read [Next.js rules](nextjs.md) and [Astro rules](astro.md) for the corresponding deltas.
- For a React client-only app when Vite is selected, use `npm create vite@<generator_version> <project_path> -- --template react-ts`. Vite is the selected build-tool generator, not a universal React CLI; do not use it instead of a chosen full-stack framework's generator. Read [React rules](react.md).
- For Cloudflare Workers, use C3: `npm create cloudflare@<generator_version> -- <project_path>`, select TypeScript and the required Worker/framework template, and skip deployment during initialization. Read [Cloudflare rules](cloudflare.md); package initialization or TypeScript configuration alone does not create a Worker project.
- Commands above show npm invocation syntax; when another package manager is selected, use its documented equivalent and keep one lockfile policy. Replace placeholders with selected compatible versions and actual paths. Consult [npm init](https://docs.npmjs.com/cli/v11/commands/npm-init/), [tsc CLI](https://www.typescriptlang.org/docs/handbook/compiler-options.html), [bun init](https://bun.sh/docs/runtime/templating/init), [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app), [Astro setup](https://docs.astro.build/en/install-and-setup/), [Vite scaffolding](https://vite.dev/guide/) and [Cloudflare C3](https://developers.cloudflare.com/workers/get-started/guide/).

## TypeScript Specifics
- `any` is forbidden unless explicitly justified
- Inference allowed only for trivial local variables
- Prefer `interface` for structured objects, `type` for unions/mapped types/compositions
- Prefer `Readonly<T>`, `ReadonlyArray<T>`, and `as const` to enforce immutability
- Never mutate function arguments — treat all parameters as read-only
- ESM only (`import/export`), no CommonJS. Prefer named exports. Source files use `.ts`

## Style
- Semicolons required, double quotes, tabs
- Files and folders: **kebab-case** (`user.service.ts`, `verify-otp.controller.ts`, `email-templates/`)
- Local constants may use camelCase

## Contracts and polymorphism
- Prefer narrow structural `interface` contracts for replaceable services/adapters and typed function contracts for a single operation. Inject implementations through constructors or function parameters; callers must not construct providers or branch on their names.
- Classes and plain objects can satisfy the same contract; `implements` is optional explicit checking for classes, not a requirement for substitution. Use generics to preserve relationships between input/output types; keep discriminated unions for closed domain variants.
- TypeScript contracts are erased at runtime: validate external data separately. In existing JavaScript, express object/function contracts with JSDoc `@typedef` / `@callback` and enable `checkJs` or `@ts-check`; keep new application code in TypeScript.
- Read [TypeScript compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) and [JavaScript typing](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) for the language mechanisms; apply the shared project design policy in [architecture conventions](architecture.md#34-interface-based-modularity-and-polymorphism).

## Functions & Classes
- Prefer **arrow functions**
- Prefer **classes for services and use cases** with constructor DI
- Prefer composition over inheritance

```ts
export class UserService {
	constructor(private readonly repo: UserRepository) {}

	createUser = async (input: CreateUserInput): Promise<CreateUserResult> => {
		const user = await this.repo.create(input);
		return { userId: user.id };
	};
}
```

## Error Handling
- Domain error classes extending `Error`: `export class UserAlreadyExistsError extends Error {}`
- Internal functions throw, boundaries catch

## Async
- async/await only (no `.then()` chains). Async functions return `Promise<T>`
- `Promise.all` for parallel independent operations
- `void sendEmail(user)` for explicit fire-and-forget
- `AbortController` for cancellable operations and timeouts

```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);
await fetch(url, { signal: controller.signal });
```

## Testing
- Framework: **Vitest**, files named `*.test.ts`

## Tooling
- **Biome** (lint + format — replaces ESLint + Prettier), **TypeScript** (`tsc --noEmit`), **Vitest**

```json
{
	"scripts": {
		"check": "biome check .",
		"check:fix": "biome check --write .",
		"typecheck": "tsc --noEmit",
		"test": "vitest run"
	}
}
```

## Pre-commit Validation
`tsc --noEmit && biome check . && vitest run` — all must pass with zero errors/warnings.

## Bun Projects (setup only)
When scaffolding a Bun project:
- devDependency: `@types/bun` (not the deprecated `bun-types`)
- tsconfig: `skipLibCheck: true`, `moduleResolution: "bundler"`, `target/module: "ESNext"`

## Magic Strings Pattern
```ts
export const SIGNATURE_STATUS = {
	DRAFT: "draft",
	PENDING: "pending",
	SIGNED: "signed",
} as const;

export type SignatureStatus = (typeof SIGNATURE_STATUS)[keyof typeof SIGNATURE_STATUS];
```

## Options Objects
Always type options objects — never `options: any`.

```ts
interface CreateUserOptions {
	sendEmail?: boolean;
}
```

## Public APIs Return Typed Objects
Public APIs should return typed objects, not anonymous ones: `interface CreateUserResult { userId: string }`.

## TS Documentation
- All public functions must use **JSDoc** — no TS types in JSDoc tags (`@param limit` not `@param {number} limit`)
- Describe: purpose, parameters meaning, return value, side effects
- `@throws` for every function that can throw, with the error type
- `@returns` to describe complex return structures (e.g. object shape)
- Keep documentation in sync with code — outdated JSDoc is worse than none
### Inline Comment Triggers
All 15 triggers from [`general.md`](general.md) §25 apply. Use `//` for inline comments. Additionally for TypeScript/JavaScript:
- **Type assertions** (`as`, `!`) — explain why the assertion is safe
- **`// biome-ignore`** directives — explain why the rule is suppressed
- **Dynamic `import()`** — explain why static import is not possible
