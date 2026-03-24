# File & Directory Naming Conventions

## Rules

| Rule | Value | Example |
|------|-------|---------|
| Case | kebab-case only | `auth-flows.md`, `stack-ref/` |
| Markdown extension | `.md` | Never `.markdown` |
| Index extension | `.yaml` | Never `.yml` |
| Templates | Prefix with `_` | `_template.md` |
| Spaces | Forbidden | Use hyphens instead |
| Accents / special chars | Forbidden | ASCII only in paths |

## macOS Warning

macOS APFS is **case-insensitive** by default. `Auth-Flows.md` and `auth-flows.md` are the same file locally but different on Linux CI.

Always use the **exact casing** of the real file: lowercase kebab-case.

## Encoding

| Setting | Value |
|---------|-------|
| Charset | UTF-8 (no BOM) |
| Line endings | LF (`\n`) — never CRLF |
| YAML indent | 2 spaces |
| Trailing whitespace | Forbidden (except Markdown) |

These are enforced by `.editorconfig` at the repo root.
