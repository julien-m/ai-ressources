---
extends: [general]
---

# Rust Rules (Delta)

> These rules complement [`general.md`](general.md). Only Rust-specific conventions are listed here.

## Stack
- Build: **Cargo**, edition **2021** minimum (prefer latest stable)
- Async runtime: **Tokio** (default)
- Web: **Axum**, **Actix-web**
- Serialization: **serde** + **serde_json**
- Prefer zero-cost abstractions — minimize runtime overhead
- Must compile on Linux with stable Rust

## Type System
- Make illegal states unrepresentable
- No `unwrap()` / `expect()` in library/production code — use `Result<T, E>` and `Option<T>`
- Newtypes for domain concepts: `struct UserId(String)` vs bare `String`
- `struct` for data, `enum` for variants/state machines, `type` aliases only for readability
- Validate at boundaries with serde + custom deserializers or `validator` crate

## Modules
- `pub(crate)` over `pub` when external visibility is unnecessary
- Re-export at crate/module root for clean public API
- One module per file, mirror directory structure

```rust
// lib.rs
pub mod user;
pub mod billing;

// user/mod.rs
mod repository;
mod service;
pub use service::UserService;
```

## Style & Tooling
- **rustfmt** defaults, `cargo fmt` before every commit
- `cargo clippy -- -D warnings` (all warnings as errors)
- No `#[allow(unused)]` without justification
- `cargo audit` for dependency security

```bash
cargo fmt --check && cargo clippy -- -D warnings && cargo test && cargo build
```

## Pre-commit Validation

Before committing, all of these must pass with zero errors/warnings:

```bash
cargo check                       # type/borrow checking
cargo clippy -- -D warnings       # linting (warnings as errors)
cargo fmt --check                 # formatting
cargo test                        # tests
```

## Naming
- Variables/functions: `snake_case`. Types/traits/enums: `PascalCase`. Constants: `UPPER_SNAKE_CASE`
- Booleans: `is_active`, `has_credits`, `can_send_email`
- Files: `snake_case` (`user_service.rs`)

## Functions & Structs
- Free functions for stateless logic, structs with `impl` for services
- DI via `::new()` constructor
- Composition via traits (no inheritance in Rust)

```rust
pub struct UserService {
	repo: Box<dyn UserRepository>,
}

impl UserService {
	pub fn new(repo: Box<dyn UserRepository>) -> Self {
		Self { repo }
	}

	pub async fn create_user(&self, input: CreateUserInput) -> Result<CreateUserResult, UserError> {
		let user = self.repo.create(input).await?;
		Ok(CreateUserResult { user_id: user.id })
	}
}
```

## Error Handling
- `Result<T, E>` everywhere — never panic in production paths
- Domain error enums with **thiserror**
- **anyhow** only at application boundaries (CLI, main, scripts)
- Propagate with `?` operator

```rust
#[derive(Error, Debug)]
pub enum UserError {
	#[error("User already exists: {0}")]
	AlreadyExists(String),
	#[error("Database error")]
	Database(#[from] sqlx::Error),
}
```

## Async
- async/await with Tokio
- `tokio::join!` for parallel execution, `tokio::select!` for racing tasks
- Timeouts on all external calls: `timeout(Duration::from_secs(5), future).await??`
- `CancellationToken` for graceful shutdown

## Ownership & Borrowing
- Prefer borrowing (`&T`) over cloning
- `Cow<'_, str>` when a function may or may not need to allocate
- Avoid `Rc`/`Arc` unless shared ownership genuinely needed
- Prefer stack allocation — `Box` only for dynamic dispatch or large types
- Prefer iterators over indexed loops (`.iter()`, `.map()`, `.filter()` — more idiomatic and often optimized)

## Type Conversions
Implement `From<T>` / `Into<T>` for conversions between layers (DB model → domain → API DTO).

## Logging
- **tracing** crate for structured logging: `info!(user_id = %id, "User created")`

## Unsafe
- **Forbidden** in application code
- Allowed only in well-documented, reviewed, low-level library code
- Every `unsafe` block must have a `// SAFETY:` comment explaining invariants

## Testing
- `#[cfg(test)] mod tests` for unit tests, `tests/` directory for integration
- `#[tokio::test]` for async tests
- Mock via traits + mock implementations or `mockall`

## Rust Documentation
- `///` for public items, `//!` for module-level docs
- Include `# Arguments`, `# Errors`, `# Examples` sections
- Doc examples are compiled and tested by `cargo test`
- Document all `Result` error variants

### Inline Comment Triggers
All 15 triggers from [`general.md`](general.md) §25 apply. Use `//` for inline comments.

Additionally for Rust:
- **`unsafe` blocks** — require a `// SAFETY:` comment explaining why the invariants hold
- **`#[allow(...)]`** attributes — explain why the lint is suppressed
- **`mem::transmute`, `ptr::read`, raw pointer dereference** — explain the memory safety argument
- **Lifetime annotations on structs** — explain the ownership relationship when non-obvious

```rust
/// Creates a new user and returns the result.
///
/// # Errors
///
/// - `UserError::AlreadyExists` — if a user with this email already exists.
/// - `UserError::Database` — on connection or query failure.
pub async fn create_user(&self, input: CreateUserInput) -> Result<CreateUserResult, UserError> {
```
