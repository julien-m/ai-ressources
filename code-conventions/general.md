---
extends: []
---
# General Rules (All Languages)

> These rules apply to **every language**. Language-specific files add deltas on top of these.
## Architecture & Code Rules
### 1. General Principles
- Explicit over implicit — always favor clarity
- Strong typing when the language supports it
- Minimal dependencies — prefer standard library
- All code must be formatted and linted automatically
### 2. Type Safety
- Use the type system to its fullest — avoid untyped containers (`any`, `object`, `void*`, `interface{}`)
- All public functions must have explicit input and output types
- Business objects must be explicitly typed
- Validate external data at system boundaries
### 3. Project Structure
- Organize by domain/feature, not by technical layer (e.g. `src/user/`, `src/billing/` — not `src/models/`, `src/controllers/`)
- Avoid catch-all folders: `utils/`, `helpers/`, `misc/`, `common/`
- One primary concept per file
- Clear separation: entry points, business logic, data access, external integrations
### 4. Style
- Automatic formatter — no manual formatting debates
- Linter with strict rules
- Consistent across the entire codebase
- No committed code that fails lint or format checks
### 5. Naming
- **Variables**: descriptive names, no single-letter names outside tiny loops. Booleans read naturally: `isActive`, `hasCredits`, `canRetry`, `shouldNotify`
- **Functions**: action verbs (`getUserById`, `createInvoice`). Avoid vague names: `handle`, `process`, `doStuff`
- **Types/Classes**: PascalCase (or language convention). No prefixes (`IUser`, `TUser`)
- **Constants**: UPPER_SNAKE_CASE for globals (or language convention). Centralize business values
- **Files/Folders**: consistent casing, names reflect content
### 6. Functions
- Small and focused: 20–30 lines maximum
- Single responsibility — one reason to change
- Prefer pure functions when possible (no side effects, deterministic)
- Explicit return types on public functions
- Avoid deep nesting — return early
### 7. Error Handling
- Never silently swallow errors
- Define domain-specific error types (not generic strings)
- Handle errors at boundaries: HTTP handlers, CLI, job processors
- Internal functions should propagate errors, not catch them
- Log errors with context (what failed, with which input)
### 8. Async / Concurrency
- Use the language's idiomatic async model
- Always handle async errors
- Parallelize independent operations
- Timeouts on all external calls
- Support cancellation where possible
- Never fire-and-forget without explicit intent
### 9. Testing
See [`testing.md`](testing.md) for all cross-cutting testing conventions (UI test identifiers, naming, mocking boundaries, test data, async, integration vs unit, coverage).
### 10. Tooling
Every project must enforce: formatter, linter, type checker (if applicable), test runner. All must pass in CI.
### 11. Data Validation
Always validate external data: HTTP requests, env vars, webhooks, file imports, message queues. Use a schema/validation library. Never trust external input.
### 12. Environment Variables
- Never use raw, unvalidated env vars
- Parse and validate at startup, fail fast if missing
- Type-coerce numeric and boolean values
### 13. API and DTO Rules
Never expose internal models directly. Separate: database entities, API DTOs, domain models. Transform between layers explicitly.
### 14. Magic Values
No hardcoded strings or numbers in business logic. Centralize in constants, enums, or config objects.
### 15. Dependency Injection
- Avoid implicit/global dependencies — pass via constructors or function parameters
- Constructors should only assign dependencies — no side effects
### 16. Separation of Responsibilities
- **Handlers/Controllers**: parse input, call services, return response
- **Services**: business logic
- **Repositories**: data access
- **Mappers**: transform between layers
- No layer leaks into another
### 17. Idempotent Operations
Critical operations (payments, creation, status changes) must be idempotent.
### 18. Limits and Pagination
Never load unlimited datasets. Always apply limits.
### 19. Logging
- Structured logging (key-value, JSON)
- Log at system boundaries only: HTTP, errors, major events
- Avoid excessive logging in business logic
- Include context: IDs, operation names, durations
- See `logging.md` for detailed sensitive data, redaction, and compliance rules
### 20. Time Handling
Centralize time access behind an abstraction — avoid scattering `Date.now()` / `time.Now()`. Enables deterministic testing.
### 21. External Calls
Every external call must include: timeout, error handling, retry strategy if applicable, circuit breaker for critical paths.
### 22. Security
- Never log sensitive data (passwords, tokens, PII) — see `logging.md` for detailed rules
- Never expose internal errors to API consumers
- Validate and sanitize all inputs
- Use parameterized queries (no string concatenation for SQL)

## Documentation Rules
### 23. Module Headers
Every file/module must start with a short description of its responsibility.
### 24. Public API Documentation
Every public function, class, type, or interface must include documentation comments explaining purpose, parameters, return values, and side effects.
### 25. Mandatory Inline Comment Triggers
The following code patterns **require** an inline comment explaining the "why". This is not optional — if the pattern appears, the comment must exist.

| # | Trigger | Expected comment |
|---|---------|------------------|
| 1 | **Magic constant** — numeric or string literal without self-evident meaning | Origin and rationale for the value |
| 2 | **Silent catch** — catch block that ignores, swallows, or returns a default | Why the error is intentionally ignored |
| 3 | **Diff/merge/sync algorithm** — logic comparing two states to produce actions | Strategy summary before the implementation |
| 4 | **Template/string building** — multi-line script, query, or document construction | End-to-end flow description of the generated output |
| 5 | **Non-trivial business branch** — if/else encoding a business rule, not just type narrowing | The business rule in plain language |
| 6 | **Non-obvious default value** — fallback that isn't zero/empty/null | Why this specific default was chosen |
| 7 | **Loop with early exit** — break/continue/return inside a loop body | What condition triggers the exit and why |
| 8 | **Backward compatibility code** — logic supporting an old format, schema, or API | What old version it supports and when it can be removed |
| 9 | **Order-dependent operations** — sequence where reordering would break correctness | Why this order matters (e.g., write-then-rename for atomicity) |
| 10 | **Non-trivial regex** — pattern longer than ~15 characters | What the pattern matches, in plain language |
| 11 | **System/shell interaction** — external process call, OS-specific behavior | The contract: expected inputs, outputs, exit codes, platform quirks |
| 12 | **Lossy data transformation** — conversion that intentionally discards information | What is lost and why it's acceptable |
| 13 | **Intentionally ignored parameter** — received argument not used in a code path | Why it's unused (distinguish from a bug) |
| 14 | **Arbitrary threshold/limit** — any bound not from a standard or spec | Where the number comes from and trade-offs |
| 15 | **High cyclomatic function** — function >20 lines with >2 nesting levels (excluding test bodies) | Strategy summary at the top of the function |
### 26. Comments Explain Why, Not What
Bad: `// increment counter` — Good: `// Retry up to 3 times because the service may temporarily reject requests`
### 27. Keep Comments Synchronized
Outdated comments are worse than no comments. Update comments immediately when logic changes.
### 28. No Trivial Comments
Do not comment code where the intent is obvious from the code itself. The following patterns must **not** be commented:

- Getters, setters, and trivial property access
- Import/require statements
- Function calls where the name is self-documenting (e.g., `validateCronExpression(expr)`)
- Simple assignments and variable declarations
- Types/interfaces whose name fully conveys their purpose
- Standard framework boilerplate (route registration, middleware setup)
- Test bodies — the test name is the documentation
### 29. Document Side Effects and Ownership
Side effects, ownership transfer, and cleanup responsibilities must always be documented.
### 30. Concise Documentation
Short description + parameters + return value. Avoid long explanations that repeat the code.

## External Data & Assets
### 31. Source-First Assets
When source URLs are provided, **always scrape them first** to extract assets and data. Never fall back to Wikipedia/Wikimedia/Google when official sources exist.
- Source URLs are the single source of truth for assets **and data** (extract `og:image`, hero images, metadata: titles, dates, prices, venue names)
- **Cross-validate user-provided data** against source pages — flag mismatches before using
- **Store assets locally** — never hotlink external URLs (they break)
- Fall back to generic sources only if no source URL exists
- Verify every image URL loads (HTTP 200). Wikimedia Commons URLs are fragile — avoid them

### 32. Frontend Taste Data
- Visible UI examples must use domain-specific names, messy-but-plausible metrics, and concrete copy.
- Do not commit `Jane Doe`, `John Smith`, `Acme`, `Lorem ipsum`, or fake-perfect metrics in user-facing examples.
- If data is illustrative, mark it as sample data in code or docs and keep it plausible for the domain.
