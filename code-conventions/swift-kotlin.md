# Swift & Kotlin Rules (Delta)

> These rules complement [`general.md`](general.md). Shared when conventions align, language-specific where they diverge.

## Stack

### Swift
- Target: **iOS 16+** / **macOS 13+**
- UI: **SwiftUI** (preferred), UIKit when necessary
- Networking: **URLSession** (preferred), Alamofire if justified
- Dependencies: **Swift Package Manager**
- Architecture: **MVVM** or **TCA** (The Composable Architecture)

### Kotlin
- Target: **API 26+** (Android)
- UI: **Jetpack Compose** (preferred), XML Views when necessary
- Networking: **Ktor** or **Retrofit**
- DI: **Hilt** / **Koin**
- Build: **Gradle** (Kotlin DSL)
- Architecture: **MVVM** with **Clean Architecture** layers

## Type System
- Make illegal states unrepresentable
- Enums for state machines and fixed value sets
- Avoid force-unwrapping (Swift `!`) and unchecked casts (Kotlin `as`)

## Style
- Swift: **SwiftLint**, follow [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- Kotlin: **ktlint** / **detekt**, follow [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html)
- Follow idiomatic language naming conventions even if they differ from general rules (e.g. Swift argument labels, Kotlin `companion object` conventions)

## Constants
- Swift: `static let maxRetryCount = 5` (camelCase)
- Kotlin: `const val MAX_RETRY_COUNT = 5` (UPPER_SNAKE_CASE)

## Files
- One primary type per file, file name matches type: `UserService.swift` / `UserService.kt`

## Functions & Classes
- Prefer structs (Swift) / data classes (Kotlin) for value types
- Classes for services and stateful components
- Composition over inheritance, DI via constructor/init

### Swift

```swift
final class UserService {
	private let repo: UserRepository

	init(repo: UserRepository) {
		self.repo = repo
	}

	func createUser(input: CreateUserInput) async throws -> CreateUserResult {
		let user = try await repo.create(input)
		return CreateUserResult(userId: user.id)
	}
}
```

### Kotlin

```kotlin
class UserService(
	private val repo: UserRepository,
) {
	suspend fun createUser(input: CreateUserInput): CreateUserResult {
		val user = repo.create(input)
		return CreateUserResult(userId = user.id)
	}
}
```

## Error Handling

### Swift
- `enum UserError: Error { case alreadyExists(String), notFound, database(Error) }`
- `do/catch` at boundaries, propagate with `throws` / `async throws`
- Never use `try!`

### Kotlin
- `sealed class UserError : Exception()` with data/object subclasses
- `Result<T>` or sealed classes for expected failures
- Reserve exceptions for truly unexpected errors. No empty `catch` blocks

## Async

### Swift
- **Swift Concurrency**: `async/await`, `Task`, `TaskGroup`, `withThrowingTaskGroup`
- No completion handlers in new code
- `async let` for parallel execution: `async let user = ...; async let org = ...; let (u, o) = try await (user, org)`

### Kotlin
- **Coroutines**: `suspend`, `Flow`, `CoroutineScope`, `async/await`
- Structured concurrency, proper cancellation
- No callbacks in new code

## Testing
- Swift: **XCTest** or **Swift Testing** (`@Test`), async tests, mock via protocols
- Kotlin: **JUnit 5** + **MockK** / **Turbine** (Flows), `runTest` for coroutines

## Tooling
- Swift: `swiftlint`, `swift build`, `swift test`
- Kotlin: `./gradlew ktlintCheck`, `./gradlew detekt`, `./gradlew test`, `./gradlew build`

## Pre-commit Validation

Before committing, all of these must pass with zero errors/warnings:

**Swift:**
```bash
swiftlint             # linting
swift build           # compilation + type checking
swift test            # tests
```

**Kotlin:**
```bash
./gradlew ktlintCheck   # linting
./gradlew detekt        # static analysis
./gradlew build         # compilation
./gradlew test          # tests
```

## Reactive State
- Swift: `@Observable` (iOS 17+) or `ObservableObject` + `@Published` — single source of truth
- Kotlin: `StateFlow` / `MutableStateFlow`, collect with `repeatOnLifecycle`

## Navigation
- Swift: `NavigationStack` + `NavigationPath` (SwiftUI)
- Kotlin: **Jetpack Navigation** or **Voyager**, routes as sealed classes

## Logging
- Swift: `os.Logger` — `Logger(subsystem: "com.app", category: "user")`
- Kotlin: **Timber** — `Timber.i("User created: $id")`
- Log at boundaries only

## Memory Management
- Swift: `[weak self]` in closures to avoid retain cycles. Prefer value types (structs) over reference types
- Kotlin: avoid leaking `Activity`/`Context` references. Use `viewModelScope`/`lifecycleScope`. Cancel subscriptions in `onDestroy`/`onCleared`

## Swift & Kotlin Documentation
- Swift: `///` doc comments with `- Parameter`, `- Returns`, `- Throws`
- Kotlin: KDoc (`/** */`) with `@param`, `@return`, `@throws`
- Document all public types, enums (including cases/variants), and thrown errors
- Document types with semantic meaning, not just their name
