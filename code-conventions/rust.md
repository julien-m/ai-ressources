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

## Project choice and initialization

- Record executable/service versus library and the selected async/web stack. Use `cargo new <project_path> --bin` for a new executable or service, and `cargo new <project_path> --lib` for a reusable library; do not hand-build the Cargo manifest and initial source skeleton.
- Use `cargo init --bin` or `cargo init --lib` only when deliberately initializing an existing directory that is not already a Cargo package, after inspecting its contents. Preserve existing package/workspace identities; do not regenerate over them.
- Cargo initializes a package, not an Axum/Actix server. Add the selected runtime/framework and minimal entry point following its documentation; do not require an unrelated third-party template. Review edition, toolchain, generated files and dependency/lockfile policy.
- Read [cargo new](https://doc.rust-lang.org/cargo/commands/cargo-new.html) and [cargo init](https://doc.rust-lang.org/cargo/commands/cargo-init.html) for supported options.

## Application and library contracts
- Identify who consumes each API: application-internal code, another workspace crate, or external users. A `lib.rs` alone does not make an API a published compatibility promise.
- Keep application code concrete and direct; add generics, builders and custom iterator types for actual contract needs, not speculative reuse. Preserve the capability boundaries required by the architecture rules.
- Declare the minimum supported Rust version (MSRV) with `package.rust-version`; distinguish it from the edition and development toolchain. Verify supported targets/features on the MSRV and current stable in CI; do not introduce newer syntax or dependencies without reviewing that policy.
- Read [Cargo's Rust version policy](https://doc.rust-lang.org/cargo/reference/rust-version.html) before changing toolchain support.

## Type System
- Make illegal states unrepresentable
- No `unwrap()` / `expect()` in library/production code — use `Result<T, E>` and `Option<T>`
- Newtypes for domain concepts: `struct UserId(String)` vs bare `String`
- `struct` for data, `enum` for variants/state machines, `type` aliases only for readability
- Validate at boundaries with serde + custom deserializers or `validator` crate
- Keep invariant-bearing fields private and validate construction and mutation. Deserialization must use the same validation boundary; deriving `Deserialize` on a wrapper does not validate its invariant by itself.
- Use `PathBuf` / `&Path` for paths and `Duration` for elapsed spans. Replace ambiguous mode flags with enums or named methods; a clear boolean setter such as `set_enabled(bool)` does not require an enum.

## Standard trait contracts
- Implement applicable standard traits on public types: `Debug`, `Clone`, equality/ordering, `Hash`, `Default` and `Display`. Derive when field semantics match the public contract; redact secrets in `Debug`, and do not invent defaults or cloning for unique resources.
- Keep `PartialEq`, `Eq`, `PartialOrd` and `Ord` consistent. When `Hash` is implemented, equal values must hash equally. A custom comparison that ignores a field requires reviewing every derived comparison/hash implementation, not automatically hand-writing all traits.
- Implement `Default` alongside a zero-argument `new()` when a meaningful default exists, and make them agree. Use `FromStr` for textual parsing; provide `is_empty()` with collection-like `len()`.
- Add `#[must_use]` where ignoring a returned value violates its contract; do not annotate every function mechanically.
- Read the [common-trait guidelines](https://rust-lang.github.io/api-guidelines/interoperability.html), [Ord contract](https://doc.rust-lang.org/std/cmp/trait.Ord.html) and [Hash/Eq contract](https://doc.rust-lang.org/std/hash/trait.Hash.html) when implementing these traits.

## Modules
- `pub(crate)` over `pub` when external visibility is unnecessary
- Re-export at crate/module root for clean public API
- One module per file, mirror directory structure
- Avoid exposing third-party types or ownership containers merely because the implementation uses them. An intentional `Box<dyn Trait>`, shared handle or integration type may belong in a public contract; document ownership and compatibility costs.
- Use `#[non_exhaustive]` for externally consumed enums/structs only when future extension is intended; retain exhaustive matching for closed domain variants. Seal a trait only when downstream implementations are deliberately unsupported.
- Review public signature, field, variant, bound, feature and trait changes for SemVer compatibility; deprecate before planned removal where feasible. Read [API future-proofing](https://rust-lang.github.io/api-guidelines/future-proofing.html) and [Cargo's compatibility rules](https://doc.rust-lang.org/cargo/reference/semver.html).

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
- Configure selected lints centrally with `[lints]` or `[workspace.lints]`; workspace members must opt in with `[lints] workspace = true`. Keep warning-as-error policy in CI rather than a blanket `#![deny(warnings)]` in library source.
- Select pedantic/restriction lints for the project's role and MSRV; do not enable the entire restriction group. Consider `undocumented_unsafe_blocks`, `unsafe_op_in_unsafe_fn`, `missing_errors_doc`, `missing_panics_doc` and `missing_docs` where applicable. A lint is a check, not proof that code is sound or fully documented.
- Prefer narrowly scoped `#[expect(..., reason = "...")]` when the MSRV supports it (Rust 1.81+), so obsolete suppressions warn. Otherwise use a scoped, explained `#[allow]`; generated code/framework conventions may need justified exceptions.
- Read [Clippy usage](https://doc.rust-lang.org/clippy/usage.html) and [lint attributes](https://doc.rust-lang.org/reference/attributes/diagnostics.html#lint-check-attributes) before changing lint policy.

## Pre-commit Validation
All must pass with zero errors/warnings:

```bash
cargo check && cargo clippy -- -D warnings && cargo fmt --check && cargo test
```

- In workspaces, cover the intended members/targets explicitly, including examples and tests (`--workspace`, `--all-targets` where appropriate). Check default features, supported no-default builds and meaningful feature combinations; use `--all-features` only when the combined configuration is supported. It does not replace separate configuration checks or doctests.
- Build public API docs with `cargo doc --no-deps`, enabling `missing_docs` and failing CI on rustdoc warnings, including broken intra-doc links. Preserve existing rustdoc flags when configuring strictness; `cargo doc` alone does not enforce missing documentation.
- Report actual commands, toolchain, feature/target selection and results; an unavailable platform or MSRV check remains unverified. Read [Cargo features](https://doc.rust-lang.org/cargo/reference/features.html) and [rustdoc lints](https://doc.rust-lang.org/rustdoc/lints.html).

## Naming
- Variables/functions: `snake_case`. Types/traits/enums: `PascalCase`. Constants: `UPPER_SNAKE_CASE`
- Booleans: `is_active`, `has_credits`, `can_send_email`
- Files: `snake_case` (`user_service.rs`)
- Getters normally omit `get_`; conversion prefixes express ownership/cost: `as_` for a cheap borrowed view, `to_` for a conversion that may do work, `into_` for consuming the source. Follow established framework and protocol names where required.

## Traits and polymorphism
- Prefer narrow traits for replaceable dependencies and capabilities. Use `T: Trait` / `impl Trait` for static dispatch when retaining the concrete type suits composition; use `&dyn Trait`, `Box<dyn Trait>` or `Arc<dyn Trait>` when runtime substitution or heterogeneous storage requires type erasure and the ownership model fits.
- Dynamic dispatch requires a dyn-compatible trait. Native `async fn` trait methods are not directly dyn-compatible: choose static dispatch or an explicit boxed-future/justified adapter solution instead of assuming `Box<dyn Trait>` works for every async service.
- Keep enums and exhaustive matching for closed variants; use trait implementations for extensible behavior. Respect coherence/orphan rules; wrap external types in a local newtype when needed. Constructors wire implementations; business logic calls the trait contract.
- Read [Rust trait objects](https://doc.rust-lang.org/book/ch18-02-trait-objects.html) and [dyn compatibility](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility); apply the shared policy in [architecture conventions](architecture.md#34-interface-based-modularity-and-polymorphism).

## Functions & Structs
- Free functions for stateless logic, structs with `impl` for services
- DI via `::new()` constructor
- Composition via traits (no inheritance in Rust)

```rust
pub trait Renderer { fn draw(&self, scene: &Scene); }
pub struct View<R: Renderer> { renderer: R }
impl<R: Renderer> View<R> {
    pub fn draw(&self, scene: &Scene) { self.renderer.draw(scene); }
}
```

## Error Handling
- `Result<T, E>` everywhere — never panic in production paths
- Domain error enums with **thiserror**
- **anyhow** only at application boundaries (CLI, main, scripts)
- Propagate with `?` operator
- Distinguish normal absence (`Option<T>`) from actionable failure (`Result<T, E>`); an infallible function need not return `Result`. Preserve typed domain failures internally and add safe context at application boundaries.
- Public library error types implement `Debug`, `Display` and `std::error::Error`, preserving wrapped causes through `source()`. Require `Send + Sync + 'static` when the API's threading/lifetime contract needs it; do not impose those bounds on every local error.
- Do not replace a forbidden `unwrap()` with `expect()` as a lint workaround. Apply the production panic policy above; describe any explicitly approved invariant-panic exception, its justification and reachable conditions in `# Panics`.
- Keep fallible shutdown explicit (`close` / `shutdown` returning `Result`); `Drop` performs bounded best-effort cleanup without panicking. Async cleanup needs an explicit lifecycle because `Drop` cannot await it.

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
- Keep shared invariants under a coherent lock; keep critical sections short and avoid callbacks or external work under the lock. Prefer a synchronous mutex for short data-only access without `.await`; use Tokio's async mutex when holding a guard across `.await` is actually required. Review contention, ordering and cancellation in either case.
- Release synchronous mutex guards before `.await`; a future compiling on a local executor is not evidence of deadlock safety. A Tokio guard may cross `.await` by design, with an explicit protected-resource contract.
- Treat a poisoned `std::sync::Mutex` as potentially inconsistent state. Propagate the failure, stop at an application boundary, or recover only after validating/restoring the protected invariants; `into_inner()` alone is not recovery proof. Tokio's mutex does not use poisoning, so review consistency after panic/cancellation separately.
- Do not block async executor threads with blocking I/O or long CPU work. Use `spawn_blocking` for suitable bounded blocking work or a dedicated bounded CPU executor; supervise completion and account for blocking tasks that cannot be aborted once started.
- Assert `Send` / `Sync` for types/futures when the consuming executor or API requires them, without forcing those bounds on intentionally thread-local APIs.
- Read [Tokio mutex guidance](https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html), [standard mutex poisoning](https://doc.rust-lang.org/std/sync/struct.Mutex.html#poisoning) and [spawn_blocking limitations](https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html).

## Ownership & Borrowing
- Prefer borrowing (`&T`) over cloning
- For read-only parameters prefer `&str`, `&[T]`, `&Path` and `&T` over `&String`, `&Vec<T>` and `&Box<T>`, unless container-specific operations are needed. Use `&mut T` for in-place mutation and take `T` by value when storing/consuming it instead of cloning an input borrow internally.
- Before cloning to resolve a borrow conflict, shorten the borrow, split disjoint fields, or transfer ownership with `mem::take`, `mem::replace` or `Option::take` when the replacement preserves invariants, including error paths. Intentional clones of small immutable data or shared handles remain valid.
- `Cow<'_, str>` when a function may or may not need to allocate
- Avoid `Rc`/`Arc` unless shared ownership genuinely needed
- Prefer direct ownership; use `Box` for a required heap allocation, recursive type indirection or trait object, not by habit. Choose borrowed/owned fields according to the actual lifetime contract rather than banning references in structs.
- Prefer iterators over indexed loops (`.iter()`, `.map()`, `.filter()` — more idiomatic and often optimized)

## Type Conversions
- Implement `From<T>` for infallible conversions and `TryFrom<T>` when validation, range or precision can fail. Their blanket implementations provide `Into` / `TryInto`; do not implement those directly when the corresponding `From` / `TryFrom` implementation is available.
- Prefer checked conversions and arithmetic at external numeric boundaries. An intentional lossy `as` cast needs a documented accepted loss; do not silently truncate, wrap or equate an invalid value with absence.
- Read the [standard conversion guidelines](https://rust-lang.github.io/api-guidelines/interoperability.html#conversions-use-the-standard-traits-from-asref-asmut-c-conv-traits) before defining conversions between layers.

## Logging
- **tracing** crate for structured logging: `info!(user_id = %id, "User created")`

## Unsafe
- **Forbidden** in application code
- Allowed only in well-documented, reviewed, low-level library code
- Every `unsafe` block must have a `// SAFETY:` comment explaining invariants
- Document caller obligations under `# Safety` on unsafe APIs and verify that every safe entry point preserves the invariants. A comment or passing Miri run does not establish soundness for every execution.

## Testing
- `#[cfg(test)] mod tests` for unit tests, `tests/` directory for integration
- `#[tokio::test]` for async tests
- Mock via traits + mock implementations or `mockall`
- Test comparison/hash consistency, validated construction and conversion boundaries when custom behavior creates a risk. Use property tests for meaningful invariant ranges; reuse adequate examples instead of adding tests of compiler guarantees.
- Run doctests through `cargo test`; `--all-targets` alone does not include them. For retained unsafe code use Miri where supported; fuzz parsers of untrusted input when justified by risk, without treating either tool as a universal proof.
- When maintaining reusable lint presets, keep deliberate violations that verify selected diagnostics actually fire and include a clean case against false positives. Compile complete Rust examples in documentation; fragments need declared context and explicit skip reasons, not a claim that every block ran.

## Porting and review evidence
- Before porting, inventory observable inputs, results, errors, ordering/tie-breaking, numeric limits, text/Unicode behavior and empty cases. Preserve behavior with characterization/differential tests; obtain agreement on deliberate semantic differences instead of assuming unusual inputs are irrelevant.
- Port contracts into Rust types rather than copying the source language's structure. Map original tests and APIs to their Rust equivalents and document preserved quirks and accepted differences.
- In reviews, locate each finding, cite its contract/source and explain the concrete consequence. Prioritize correctness, soundness and compatibility before style; distinguish executed tool results from reading-only observations.

## Rust Documentation
- `///` for public items, `//!` for module-level docs
- Include `# Arguments`, `# Errors`, `# Examples` sections
- Doc examples are compiled and tested by `cargo test`
- Document all `Result` error variants
- Add `# Panics` and `# Safety` where applicable, link related types with intra-doc links, and document ownership transfer, side effects and cleanup beyond what signatures express. Prefer `?` in copyable fallible examples, using rustdoc hidden setup when necessary.
### Inline Comment Triggers
All 15 triggers from [`general.md`](general.md) §25 apply. Use `//` for inline comments. Additionally for Rust:
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

## Further reading
- Consult [BeautifulRust](https://github.com/morganlinton/BeautifulRust/tree/b9718436d77ee7bcf17cdcb6aa27628feb95d97a) for the synthesis, review/porting methods and lint/example verification approach that informed these additions. Its opinionated defaults are not blanket requirements here; use the primary sources linked above to resolve Rust behavior.
