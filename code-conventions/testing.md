# Testing Rules (Cross-Cutting)

> These rules complement [`general.md`](general.md) §9 (Testing), §8 (Async) and [`architecture.md`](architecture.md) §26 (Testing Boundaries).
> This file supersedes general.md §9 for detailed testing patterns.
> Language deltas keep their own runner/framework choices — this file covers cross-cutting patterns only.

## 1. UI Test Identifiers

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

## 2. Test Structure & Naming

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

## 3. Mocking Boundaries

> Extends [`general.md`](general.md) §9 and [`architecture.md`](architecture.md) §26 with detailed per-layer guidance.

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

## 4. Test Data

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

## 5. Async Testing

> Extends [`general.md`](general.md) §8 (Async) with test-specific patterns.

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

## 6. Integration vs Unit Boundaries

> Extends [`architecture.md`](architecture.md) §26 (Testing Boundaries) with explicit layer-to-test-type mapping.

### Test Type by Layer

Mapped to the layer model from [`architecture.md`](architecture.md):

| Layer | Test type | What to mock |
|---|---|---|
| Handler / Controller | Integration | Service (injected fake) |
| Service | Unit | Repository (injected fake) |
| Repository | Integration | Real DB (testcontainer or in-memory) |
| Gateway / Client | Integration | Local mock HTTP server |

### Rule

Business logic is tested with unit tests. Boundaries (HTTP, DB, filesystem) are tested with integration tests. Never test business logic through an HTTP request.

---

## 7. Coverage Philosophy

Prioritize business logic and edge case coverage. Do not chase percentage metrics at the cost of test quality.

- Cover: business rules, validation logic, error paths, boundary conditions
- Skip: glue code, trivial getters/setters, framework boilerplate, generated code
- No mandatory coverage threshold — a well-tested 60% is better than a poorly-tested 90%
