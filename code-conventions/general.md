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
- Tests must be deterministic
- Test business logic and edge cases
- Mock only external dependencies (database, network, filesystem, time)
- Name tests clearly: describe scenario and expected outcome

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

### 25. Inline Comments for Complex Logic
Use comments to explain intent of processing steps in multi-step operations.

### 26. Comments Explain Why, Not What
Bad: `// increment counter` — Good: `// Retry up to 3 times because the service may temporarily reject requests`

### 27. Keep Comments Synchronized
Outdated comments are worse than no comments. Update comments immediately when logic changes.

### 28. No Trivial Comments
Only document meaningful logic or decisions. Don't comment obvious code.

### 29. Document Side Effects and Ownership
Side effects, ownership transfer, and cleanup responsibilities must always be documented.

### 30. Concise Documentation
Short description + parameters + return value. Avoid long explanations that repeat the code.
