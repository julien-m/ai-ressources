---
extends: [general]
---
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

## Project choice and initialization

- Record native app versus package/library/command-line service, target platforms and the selected UI/build stack before generation. Use the matching official project creator; a package generator is not an iOS/Android app generator.
### Swift
- For a Swift package, create and enter a new directory, then run `swift package init --type library` or `swift package init --type executable` according to its role. Review the generated manifest, source/test targets, supported platforms and toolchain requirements.
- For an iOS/macOS app, use Xcode's **File > New > Project** and the matching platform **App** template, choosing Swift/SwiftUI when appropriate. Configure the actual product/bundle identifiers, deployment targets and signing settings. `swift package init` does not generate an Xcode app's lifecycle, bundle or signing setup; `xcodebuild` builds existing projects rather than creating them.
- Read [SwiftPM package creation](https://github.com/swiftlang/swift-package-manager/blob/main/Sources/PackageManagerDocs/Documentation.docc/CreatingSwiftPackage.md) and [Apple app project creation](https://developer.apple.com/documentation/xcode/creating-an-xcode-project-for-an-app).
### Kotlin
- For Android, use Android Studio's **New Project** wizard and the appropriate template (for example **Empty Activity** for Compose), selecting Kotlin, package identifier and minimum SDK. Keep the generated Android Gradle plugin configuration and Gradle Wrapper; do not substitute a JVM console template for an Android application.
- For a non-Android Kotlin/JVM command-line application/service, create and enter the new directory and run `gradle init --type kotlin-application --dsl kotlin`; use `--type kotlin-library` for a library. Bootstrap with the selected compatible Gradle installation, then use the generated wrapper (`./gradlew`) for subsequent builds. These templates do not generate an Android app or choose a server framework.
- Review the selected JDK/toolchain, generated plugins, source sets, tests and wrapper files. Read [Android project creation](https://developer.android.com/studio/projects/create-project) and [Gradle Build Init](https://docs.gradle.org/current/userguide/build_init_plugin.html).

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

## Contracts and polymorphism
### Swift
- Prefer small `protocol` capabilities for adapters and replaceable services; structs, enums and classes can conform. Inject through initializers or function parameters and keep provider selection outside business callers.
- Use generic constraints or `some P` to preserve a concrete conforming type; use `any P` for existential storage/runtime substitution when needed. An opaque result has one hidden underlying type for that declaration, not arbitrary branch-dependent types. Respect associated-type constraints rather than adding casts to escape them.
- Declare operations that must dispatch through the protocol as requirements; an extension-only helper is not a customizable protocol requirement. Preserve actor isolation and `Sendable` guarantees in concurrent contracts.
- Read [Swift protocols](https://docs.swift.org/latest/documentation/the-swift-programming-language/protocols/) and [opaque and boxed protocol types](https://docs.swift.org/latest/documentation/the-swift-programming-language/opaquetypes/).
### Kotlin
- Prefer small `interface` capabilities injected through constructors; use `fun interface` or function types for one operation and interface delegation (`by`) to compose implementations without an inheritance hierarchy.
- Use generics for type relationships and sealed classes/interfaces for closed domain variants with exhaustive `when`; use ordinary interfaces for an extensible provider set. Extension functions resolve statically and do not replace virtual interface members.
- Keep `suspend`, cancellation and ownership guarantees explicit in contracts. Read [Kotlin interfaces](https://kotlinlang.org/docs/interfaces.html) and [delegation](https://kotlinlang.org/docs/delegation.html); apply the shared policy for both languages in [architecture conventions](architecture.md#34-interface-based-modularity-and-polymorphism).

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

## Pre-commit Validation
**Swift:** `swiftlint && swift build && swift test`
**Kotlin:** `./gradlew ktlintCheck && ./gradlew detekt && ./gradlew build && ./gradlew test`

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
### Inline Comment Triggers
All 15 triggers from [`general.md`](general.md) §25 apply. Use `//` for inline comments. Additionally for Swift & Kotlin:
- **`@available` / `@Deprecated`** — include migration guidance (what to use instead)
- **Force unwrap** (`!` in Swift) — explain why the value is guaranteed non-nil
- **`@unchecked Sendable`** (Swift) — explain why the type is safe to send across actors
- **`@Suppress` annotations** (Kotlin) — explain why the warning is suppressed
