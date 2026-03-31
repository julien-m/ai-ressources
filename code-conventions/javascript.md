# TypeScript Rules (Delta)

> These rules complement [`general.md`](general.md). Only TypeScript/JavaScript-specific conventions are listed here.

## Stack
- Backend runtime: **Node.js** (dev tooling: **Bun** when useful)
- Frontend: **React**, **Next.js**, **Astro**
- TypeScript is mandatory, `strict` mode enabled
- Runtime validation: **Zod** (or equivalent) for external data

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
- **ESLint**, **Prettier**, **TypeScript** (`tsc --noEmit`), **Vitest**

```json
{
	"scripts": {
		"lint": "eslint .",
		"format": "prettier . --write",
		"typecheck": "tsc --noEmit",
		"test": "vitest run"
	}
}
```

## Pre-commit Validation

Before committing, all of these must pass with zero errors/warnings:

```bash
tsc --noEmit          # type checking (or bunx tsc --noEmit for Bun projects)
eslint .              # linting
vitest run            # tests
```

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
All 15 triggers from [`general.md`](general.md) §25 apply. Use `//` for inline comments.

Additionally for TypeScript/JavaScript:
- **Type assertions** (`as`, `!`) — explain why the assertion is safe
- **`// eslint-disable`** directives — explain why the rule is suppressed
- **Dynamic `import()`** — explain why static import is not possible
