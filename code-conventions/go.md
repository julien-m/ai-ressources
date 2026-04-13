---
extends: [general]
---

# Go Rules (Delta)

> These rules complement [`general.md`](general.md). Only Go-specific conventions are listed here.

## Stack
- Go **1.22+**, prefer latest stable
- Web: **stdlib `net/http`** (preferred), **Chi**, **Gin** if justified
- Database: **sqlc** or **pgx** for PostgreSQL
- Config: **envconfig** or **viper**
- Prefer stdlib and minimal dependencies

## Type System
- Structs for all business objects
- Custom types to distinguish domain concepts: `type UserID string`, `type Email string`
- Avoid `interface{}` / `any` unless building truly generic utilities
- Validate external data at boundaries with struct tags + validation library or manual checks

## Project Layout

```
cmd/api/main.go
internal/user/{service,repository,handler,model}.go
internal/billing/
pkg/            (shared libraries if needed)
```

- `internal/` for private application code, `cmd/` for entry points
- One package per domain concept

## Style & Tooling
- **gofmt** (non-negotiable), **golangci-lint** strict, **go vet**
- Follow [Effective Go](https://go.dev/doc/effective_go) conventions
- No exported symbols without doc comments
- `go mod tidy` regularly, `govulncheck` for security auditing

```bash
gofmt -l . && go vet ./... && golangci-lint run && go test ./...
```

## Pre-commit Validation

Before committing, all of these must pass with zero errors/warnings:

```bash
go vet ./...          # static analysis
golangci-lint run     # linting
go test ./...         # tests
```

## Naming
- Exported: `PascalCase`. Unexported: `camelCase`
- Constants: `PascalCase` exported (`MaxRetryCount`), `camelCase` unexported
- Files and folders: **snake_case** (`user_service.go`, `verify_otp.go`)

## Interfaces
- Single-method interfaces use `-er` suffix: `Reader`, `Writer`, `Sender`
- Define interfaces **at the consumer**, not the implementor
- Keep small — prefer single-method interfaces
- Accept interfaces, return structs

```go
// Defined in service package, not repository package
type UserRepository interface {
	FindByID(ctx context.Context, id UserID) (*User, error)
	Create(ctx context.Context, input CreateUserInput) (*User, error)
}
```

## Service Pattern

```go
type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(ctx context.Context, input CreateUserInput) (CreateUserResult, error) {
	user, err := s.repo.Create(ctx, input)
	if err != nil {
		return CreateUserResult{}, fmt.Errorf("creating user: %w", err)
	}
	return CreateUserResult{UserID: user.ID}, nil
}
```

## Error Handling
- Always check errors — never `result, _ := doSomething()`
- Wrap with context: `fmt.Errorf("creating user: %w", err)`
- Define domain errors with `errors.New` or custom types. Check with `errors.Is`
- Never panic in production (except truly unrecoverable states at startup)

```go
var ErrUserAlreadyExists = errors.New("user already exists")

if errors.Is(err, ErrUserAlreadyExists) { /* handle */ }
```

## Context
- Always first parameter: `func (s *Svc) Do(ctx context.Context, ...) error`
- **Never store context in struct fields** — pass it through function parameters only
- Use for cancellation, timeouts, request-scoped values
- Propagate through entire call chain

## Concurrency
- `errgroup` for structured concurrency
- Channels for communication, mutexes for shared state
- No fire-and-forget goroutines — always manage lifecycle

```go
g, ctx := errgroup.WithContext(ctx)
g.Go(func() error { user, err = userRepo.FindByID(ctx, id); return err })
g.Go(func() error { org, err = orgRepo.FindByID(ctx, id); return err })
if err := g.Wait(); err != nil { return err }
```

## Testing
- Built-in `testing` package, files `*_test.go` in same package
- **Table-driven tests**. `testify/assert` if it improves readability

```go
tests := []struct {
	name    string
	input   CreateUserInput
	wantErr bool
}{
	{"valid user", CreateUserInput{Email: "a@b.com"}, false},
	{"empty email", CreateUserInput{Email: ""}, true},
}
for _, tt := range tests {
	t.Run(tt.name, func(t *testing.T) { /* ... */ })
}
```

## Logging
- **slog** (stdlib 1.21+) for structured logging
- `slog.Info("user created", "user_id", id)` / `slog.Error("payment failed", "error", err)`

## Go Documentation
- Doc comments start with the symbol name: `// UserService handles user-related operations.`
- Package comments in `doc.go`: `// Package user provides user management services.`
- Document error return conditions: `// Returns ErrUserNotFound if no user exists with that ID.`

### Inline Comment Triggers
All 15 triggers from [`general.md`](general.md) §25 apply. Use `//` for inline comments.

Additionally for Go:
- **`// nolint:`** directives — explain why the lint rule is suppressed
- **`go:embed`** directives — explain what is embedded and why
- **Type switch fallthrough** — explain the routing logic at the top of the switch
- **Goroutine launch** (`go func()`) — explain lifecycle: who waits, who cancels
