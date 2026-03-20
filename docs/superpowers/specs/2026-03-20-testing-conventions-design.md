# Design Spec: Cross-Language Testing Conventions

**Date:** 2026-03-20
**Status:** Implemented
**Scope:** ai-ressources — `code-conventions/testing.md` + dispatcher integration

---

## Problem

Testing conventions in ai-ressources are scattered across 5+ files (general.md §9, javascript.md, go.md, swift-kotlin.md, rust.md) with no dedicated cross-cutting reference. Key areas are missing entirely:

- **UI test identifiers** — no convention for `data-testid`, `accessibilityIdentifier`, `testTag` across platforms
- **Mocking boundaries** — general.md §9 mentions "mock external deps only" but doesn't formalize by layer
- **Test data management** — no guidance on factories vs fixtures
- **Async testing patterns** — no cross-language patterns for polling, timeouts, race conditions
- **Integration vs unit boundaries** — no mapping to the layer model defined in architecture.md

AI agents generating UI code have no reference for adding stable test identifiers, leading to inconsistent or missing testability.

## Decision

Create `code-conventions/testing.md` as a **cross-cutting convention file** (same role as `architecture.md` and `logging.md`). It complements the existing language deltas — it does NOT duplicate their runner/framework choices.

> These rules complement `general.md` §9 (Testing), §8 (Async) and `architecture.md` §26 (Testing Boundaries). `testing.md` supersedes general.md §9 for detailed testing patterns — general.md §9 becomes a one-line pointer to this file.

### What testing.md covers (new cross-cutting patterns)

1. UI test identifiers — per-platform attribute, naming convention, AI instructions
2. Test structure & naming — cross-language naming patterns
3. Mocking boundaries — what to mock by layer, fakes over mocks
4. Test data — factory/builder pattern, no shared mutable state
5. Async testing — polling over sleep, explicit timeouts
6. Integration vs unit boundaries — test type by architectural layer
7. Coverage philosophy — prioritize business logic, not metrics

### What stays in language deltas (not duplicated)

- Framework/runner choice (Vitest, `testing`, `cargo test`, XCTest, JUnit 5)
- File naming (`*.test.ts`, `*_test.go`, `mod tests`)
- Language-specific tooling (ESLint, clippy, etc.)

### Load order change

```
general.md → architecture.md → logging.md → testing.md → <delta langue> → database.md
```

`testing.md` is loaded **always** when coding (not just when writing tests), because UI test identifiers must be added when writing production UI code.

---

## Section 1 — UI Test Identifiers

> Applies only when the project includes a user-facing UI layer. Skip for CLI tools, backend APIs, and libraries.

### Universal Rule

Every interactive UI element and every observable state must expose a **stable test identifier**, decoupled from styling, layout, and business logic.

### Platform Mapping

| Platform | Attribute | UI Test Framework |
|---|---|---|
| Web (React, Leptos, Yew, any HTML) | `data-testid` | Playwright |
| iOS/macOS — SwiftUI | `.accessibilityIdentifier()` | XCUITest |
| iOS/macOS — UIKit/AppKit | `.accessibilityIdentifier =` / `setAccessibilityIdentifier()` | XCUITest |
| Android — Compose | `Modifier.semantics { testTag = "..." }` | Espresso (UI) / UI Automator (E2E) |
| Android — XML | `android:contentDescription` | Espresso (UI) / Appium (E2E) |
| Flutter | `Key('...')` / `Semantics(label: '...')` | flutter_test |
| Tauri, Wails (WebView) | `data-testid` (HTML frontend) | Playwright |
| Desktop native Rust (egui, iced) | N/A — test logic in pure Rust, UI via screenshot comparison | cargo test |
| Desktop native Go (Fyne) | N/A — same approach as egui | go test |

### Naming Convention (all platforms)

```
{feature}-{element}-{variant?}
```

- Kebab-case only
- Never use CSS class or style in the identifier
- Dynamic elements include business ID: `artifact-item-{id}`
- Observable states (toasts, modals, loaders) get their own identifier

Examples: `import-modal`, `import-validate-btn`, `import-progress-label`, `artifact-item-42`, `toast-success`, `toast-error`, `dropzone`

### Code Examples

**Web (React):**
```tsx
<button data-testid="import-validate-btn">Validate</button>
<div data-testid="import-modal">...</div>
<ul data-testid="artifacts-list">...</ul>

// ❌ never use class or id for tests
<button class="btn-primary">Validate</button>
```

**iOS/macOS (SwiftUI):**
```swift
Button("Validate") { }
  .accessibilityIdentifier("import-validate-btn")

List(artifacts) { artifact in
  ArtifactRow(artifact)
    .accessibilityIdentifier("artifact-item-\(artifact.id)")
}
```

**Android (Compose):**
```kotlin
Button(
  onClick = { },
  modifier = Modifier.semantics { testTag = "import-validate-btn" }
) { Text("Validate") }
```

**Flutter:**
```dart
ElevatedButton(
  key: const Key('import-validate-btn'),
  onPressed: () {},
  child: const Text('Validate'),
)
```

**Tauri / Wails:** Apply Web rules (`data-testid`) — the frontend is HTML.

**Desktop native Rust (egui, iced):** No standardized UI test protocol. Separate business logic from UI and test logic in pure Rust. For UI: screenshot pixel comparison via `cargo test`.

### AI Instructions

When generating or modifying any UI component:
1. Add the platform-appropriate test identifier to every interactive element
2. Add test identifiers to every observable state (modals, toasts, lists, loaders)
3. Follow the naming convention above
4. Never use styling attributes as test identifiers
5. Use the Gherkin spec (if present) to determine which elements need identifiers

---

## Section 2 — Test Structure & Naming

### Naming Convention

Test names describe **behavior**, not implementation. Reading the name tells you what broke without opening the file.

| Language | Pattern | Example |
|---|---|---|
| TypeScript | `describe` / `it("should ...")` | `it("should reject expired tokens")` |
| Go | `Test_Verb_Condition_Expected` | `Test_Validate_ExpiredToken_ReturnsError` |
| Rust | `fn verb_condition_expected()` | `fn validate_expired_token_returns_error()` |
| Swift | `func testVerbConditionExpected()` | `func testValidateExpiredTokenReturnsError()` |
| Kotlin | `` fun `should verb when condition`() `` | `` fun `should reject when token expired`() `` |
| Delphi | `procedure TestVerbConditionExpected` | `procedure TestValidateExpiredTokenReturnsError` |
| Dart | `test('should verb when condition', ...)` | `test('should reject expired tokens', ...)` |

### File Organization

Tests live next to the code they test (colocation), except when the language dictates otherwise:
- **Go**: `_test.go` in the same package (enforced by language)
- **Rust**: `mod tests` inline for unit tests, `tests/` directory for integration tests
- **Delphi**: `Tests/` directory with DUnitX test project
- **Dart**: `test/` directory mirroring `lib/` structure
- **All others**: `*.test.ts`, `*.test.swift`, `*.test.kt` alongside source files

---

## Section 3 — Mocking Boundaries

> Extends `general.md` §9 and `architecture.md` §26 with detailed per-layer guidance.

### What to Mock

| Mock this | Examples | Why |
|---|---|---|
| Repositories / DB access | In-memory fake, testcontainer | Isolate business logic |
| HTTP clients / external APIs | Response stub, local mock server | No network dependency |
| Filesystem, clock, random | Injected abstractions | Deterministic tests |

### What to Never Mock

| Never mock this | Why |
|---|---|
| The service under test | You're cheating on what you verify |
| Domain logic (calculations, validations) | That's literally what you're testing |
| Value objects / DTOs | No side effects, no need |

### Fakes Over Mocks

Prefer fakes (an `InMemoryUserRepository` implementing the interface) over mocks (`vi.mock()`, `mockk<>()` with `when/thenReturn`). Mocks verify calls were made. Fakes verify behavior works.

**Exception:** Spies are OK to verify a side-effect happened (email sent, event published) — but only on output ports, never on internal logic.

---

## Section 4 — Test Data

### Rules

- Use **factories/builders**, not static JSON fixtures
- Each test shows only the fields **relevant to the scenario** — everything else is auto-generated with valid defaults
- Each test builds its **own data** — no shared mutable state between tests
- **Cleanup explicitly** for integration tests (transaction rollback or truncate)

### Factory Idioms by Language

| Language | Idiom |
|---|---|
| TypeScript | `buildUser(overrides?: Partial<User>)` |
| Go | `NewTestUser(t, func(u *User) { u.Role = "admin" })` |
| Rust | `UserBuilder::default().role(Role::Admin).build()` |
| Swift | `User.stub(role: .admin)` |
| Kotlin | `aUser(role = Role.ADMIN)` |
| Delphi | `TUserBuilder.Create.WithRole(urAdmin).Build` |
| Dart | `buildUser(role: Role.admin)` |

### Anti-Patterns

- 200-line JSON/YAML fixture imported in 15 tests — impossible to tell which field matters for which test
- Shared data between tests (`beforeAll` creating a user reused everywhere) — coupling, flaky tests, execution order matters

---

## Section 5 — Async Testing

> Extends `general.md` §8 (Async) with test-specific patterns.

### Rule

Never use arbitrary `sleep`. Use explicit polling with condition and timeout.

### Patterns

- **Polling**: `expect.poll()` (Vitest), `Eventually` (Go testify), `XCTNSPredicateExpectation` (Swift), `awaitility` (Kotlin)
- **Event-driven**: Await a signal/callback, not a delay
- **Explicit timeout**: Always bound the wait, fail-fast if exceeded

### Anti-Patterns

```typescript
// ❌ Arbitrary sleep — fragile, slow, flaky
await sleep(3000)
expect(getStatus(jobId)).toBe("completed")

// ✅ Explicit polling with condition
await expect.poll(() => getStatus(jobId), { timeout: 5000 })
  .toBe("completed")
```

---

## Section 6 — Integration vs Unit Boundaries

> Extends `architecture.md` §26 (Testing Boundaries) with explicit layer-to-test-type mapping.

### Test Type by Layer

Mapped to the layer model from `architecture.md`:

| Layer | Test type | What to mock |
|---|---|---|
| Handler / Controller | Integration | Service (injected fake) |
| Service | Unit | Repository (injected fake) |
| Repository | Integration | Real DB (testcontainer or in-memory) |
| Gateway / Client | Integration | Local mock HTTP server |

### Rule

Business logic is tested with unit tests. Boundaries (HTTP, DB, filesystem) are tested with integration tests. Never test business logic through an HTTP request.

---

## Section 7 — Coverage Philosophy

Prioritize business logic and edge case coverage. Do not chase percentage metrics at the cost of test quality.

- Cover: business rules, validation logic, error paths, boundary conditions
- Skip: glue code, trivial getters/setters, framework boilerplate, generated code
- No mandatory coverage threshold — a well-tested 60% is better than a poorly-tested 90%

---

## Implementation Plan

1. Create `code-conventions/testing.md` with the 7 sections above
2. Update `claude/rules/code.md` dispatcher:
   - Add `testing.md` to the always-load list (step 2, between logging and language delta)
   - Update the load order description
   - Add `✓ testing` to the display rule confirmation block
3. Update `code-conventions/index.yaml` — add testing.md entry
4. Update root `index.yaml` — increment `code-conventions.file_count` from 9 to 10
5. Trim `general.md` §9 to a one-line pointer to `testing.md` (avoid two sources of truth)

## Files Changed

| File | Action |
|---|---|
| `code-conventions/testing.md` | **Create** — new cross-cutting convention file (7 sections) |
| `claude/rules/code.md` | **Edit** — add testing.md to load order, always-load list, and display block |
| `code-conventions/index.yaml` | **Edit** — add testing.md entry |
| `index.yaml` | **Edit** — increment file_count from 9 to 10 |
| `code-conventions/general.md` | **Edit** — trim §9 to pointer to testing.md |
