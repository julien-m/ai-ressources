# Python Rules (Delta)

> These rules complement [`general.md`](general.md). Only Python-specific conventions are listed here.

## Stack
- Runtime: **CPython 3.12+** (prefer latest stable)
- Package manager: **uv** (replaces pip/poetry)
- Web: **FastAPI**, **Django**, **Flask** if justified
- Serialization/validation: **Pydantic** for external data
- Prefer stdlib and minimal dependencies

## Typing Strategy
- Type hints on all public function signatures (parameters + return)
- `strict` mode in pyright (`"typeCheckingMode": "strict"`)
- Inference allowed for trivial local variables
- `Any` is forbidden unless explicitly justified with a comment
- Use `TypeAlias` for complex types: `UserList: TypeAlias = list[User]`
- Prefer modern syntax: `list[str]` over `List[str]`, `X | None` over `Optional[X]`
- Newtypes for domain concepts: `UserId = NewType("UserId", str)`
- Validate external data at boundaries with Pydantic models or dataclasses

## Style & Tooling
- **ruff check** (replaces flake8 + isort + pylint)
- **ruff format** (replaces black)
- Follow [PEP 8](https://peps.python.org/pep-0008/) conventions
- No committed code that fails ruff or pyright

## Pre-commit Validation

Before committing, all of these must pass with zero errors/warnings:

```bash
ruff check .              # linting
ruff format --check .     # formatting
pyright                   # type checking
pytest                    # tests
```

## Naming
- Variables/functions: `snake_case`. Classes: `PascalCase`. Constants: `UPPER_SNAKE_CASE`
- Booleans: `is_active`, `has_credits`, `can_retry`
- Private: `_private_method`, `_internal_field` (single underscore)
- Files and folders: **snake_case** (`user_service.py`, `verify_otp.py`)
- No dunder names outside protocol methods

## Functions & Classes
- Free functions for stateless logic, classes for services with state
- DI via `__init__` constructor
- Composition over inheritance
- Prefer `dataclasses` for data containers, Pydantic for validated external data
- Use `@staticmethod` only when the function logically belongs to the class but needs no instance state
- Avoid `@classmethod` for factory patterns — prefer standalone functions

```python
@dataclass(frozen=True)
class CreateUserInput:
    email: str
    name: str

class UserService:
    def __init__(self, repo: UserRepository) -> None:
        self._repo = repo

    async def create_user(self, input: CreateUserInput) -> CreateUserResult:
        user = await self._repo.create(input)
        return CreateUserResult(user_id=user.id)
```

## Error Handling
- Domain exception classes extending `Exception`
- Internal functions raise, boundaries catch
- Never bare `except:` or `except Exception:` without re-raise or logging
- Propagate with explicit raise — never silently return `None` on error

```python
class UserAlreadyExistsError(Exception):
    def __init__(self, email: str) -> None:
        super().__init__(f"User already exists: {email}")
        self.email = email
```

## Async
- `async`/`await` with **asyncio** (default) or **anyio** for portability
- `asyncio.TaskGroup` for structured concurrency (Python 3.11+)
- Timeouts on all external calls: `async with asyncio.timeout(5.0):`
- Never `await` in `__init__` — use async factory functions
- `asyncio.create_task()` must always be stored and awaited or cancelled

```python
async with asyncio.TaskGroup() as tg:
    user_task = tg.create_task(fetch_user(user_id))
    org_task = tg.create_task(fetch_org(org_id))
user, org = user_task.result(), org_task.result()
```

## Testing
- Framework: **pytest**, files named `test_*.py` or `*_test.py`
- Prefer `pytest.mark.parametrize` for data-driven tests
- Fixtures over setup/teardown methods
- `pytest-asyncio` for async tests with `@pytest.mark.asyncio`

## Python Documentation
- All public functions, classes, and modules must use **Google-style docstrings**
- No type annotations repeated in docstrings — types belong in signatures
- Describe: purpose, parameter meaning, return value, side effects

```python
def create_user(email: str, name: str) -> CreateUserResult:
    """Create a new user and return the result.

    Args:
        email: The user's email address, must be unique.
        name: Display name for the user profile.

    Returns:
        The created user result with the assigned user ID.

    Raises:
        UserAlreadyExistsError: If a user with this email already exists.
        DatabaseError: On connection or query failure.
    """
```

### Inline Comment Triggers
All 15 triggers from [`general.md`](general.md) SS25 apply. Use `#` for inline comments.

Additionally for Python:
- **`# type: ignore[code]`** — explain why pyright/mypy is bypassed
- **`# noqa: CODE`** — explain why the ruff/linter rule is suppressed
- **`# fmt: skip` / `# fmt: off`** — explain why auto-formatting is disabled
- **`__all__`** — document the intent of the public API surface
- **`if TYPE_CHECKING:`** — explain why the conditional import is needed (circular dependency)
- **`@overload`** — explain why multiple signatures are needed
- **`cast()`** — explain why the type system cannot infer the correct type
- **`asyncio.create_task()` without immediate await** — explain lifecycle: who awaits, who cancels

## Dangerous Patterns

The following patterns are **not forbidden** but require explicit justification in a comment. Their presence in code review must always be questioned:

- **`eval()` / `exec()`** — explain why dynamic code execution is necessary and how input is sanitized
- **`setattr()` / monkey-patching** — explain why static attribute access is not possible
- **Metaclasses / `__init_subclass__`** — explain the framework-level need
- **Bare `except Exception`** without re-raise — explain why all errors are intentionally swallowed
- **Mutable global state** (`global`, module-level mutable variables) — explain why dependency injection is not feasible
