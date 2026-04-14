# Design Spec — CI Templates: Lint/Format sur fichiers modifiés

**Date :** 2026-04-14
**Scope :** 5 fichiers templates CI dans `claude/skills/conventions.init/references/templates/`
**Status :** Approved (auto-brainstorm)

---

## Contexte

Les templates CI générés par `conventions.init` Phase 8 manquent tous de steps lint/format. Le `typecheck`, `build`, et `test` sont présents mais aucun vérification de style ou de lint n'est exécutée en CI.

**Demande :** Ajouter lint/format sur les fichiers modifiés uniquement (diff-only), avec typecheck/build/test toujours en full codebase, et fallback full lint si un fichier de config linter change.

---

## Décisions de design

### D1 — Architecture : un template par langage + détection runtime
Un seul template par langage. Le linter actif est détecté au runtime CI via présence de fichiers de config (`if [ -f biome.json ]`). Pas de templates séparés par variante linter.

### D2 — Mécanisme changed-files : tj-actions/changed-files@v45
- `fetch-depth: 0` requis pour que l'action ait l'historique git complet
- Deux steps séparés : un pour les fichiers source, un pour les fichiers config linter
- La syntaxe `files_yaml` multi-groupe est version-sensitive → deux steps séparés est plus portable

> ⚠️ WARNING: tj-actions/changed-files est unpinné (version tag v45). En mars 2025, l'action a été compromise dans une attaque supply-chain. Pinner sur SHA avant usage en production.

### D3 — Fallback full-check sur changement de config
Si `steps.changed-cfg.outputs.any_changed == 'true'` → full lint.
Sinon si `steps.changed-src.outputs.any_changed == 'true'` → diff-only lint.
Sinon → skip (step conditionnel via `if:`).

Config prend la précédence sur sources quand les deux changent simultanément.

### D4 — Steps séparés lint et format
Un step "Format check" + un step "Lint" séparés pour des erreurs CI distinctes dans l'UI GitHub Actions.

### D5 — Go : diff natif golangci-lint
`golangci-lint run --new-from-rev=<base>` (support natif, pas de tj-actions pour Go).

Base ref calculée :
- Pull request : `origin/${{ github.base_ref }}`
- Push : `git rev-parse HEAD~1 2>/dev/null || echo HEAD` (fallback premier commit → full check)

> Force-push non supporté pour le diff-only Go (documenté dans commentaire template).

golangci-lint intègre gofmt et go vet → pas de steps séparés pour ces outils.

### D6 — Rust : full check uniquement
`cargo fmt --check` + `cargo clippy -- -D warnings` sur la codebase complète. Rust ne supporte pas le per-file.

### D7 — .NET : dotnet format --verify-no-changes
Full codebase. `dotnet format` ne supporte pas le per-file.

### D8 — Python : typecheck via détection robuste
Détection mypy : `grep -qE '^\[tool\.mypy' pyproject.toml 2>/dev/null` OU `test -f mypy.ini`.
Si détecté : `pip show mypy 2>/dev/null || pip install mypy -q` puis `mypy .`.
Inline TOML table syntax (`tool = { mypy = {...} }`) documenté comme hors scope.

### D9 — concurrency sur tous les templates
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### D10 — Pas de SHA pinning (avec avertissement)
Version tags maintenus. Chaque template inclut un commentaire explicite référençant l'incident mars 2025.

### D11 — Scope : 5 fichiers templates uniquement
Pas de changement aux SKILL.md ni à stack-commands.md. Les templates sont copiés verbatim par conventions.init Phase 8 → corriger les templates suffit.

### D12 — Caching linters (décision ajoutée après validation Codex)
| Template | Cache | Clé |
|---|---|---|
| Python | `~/.cache/pip` | hash `requirements.txt` / `pyproject.toml` |
| Go | `~/.cache/golangci-lint` + `~/go/pkg/mod` | golangci-lint version + `go.sum` |
| Rust | `~/.cargo/registry` + `~/.cargo/git` + `target/` | `Cargo.lock` |
| Node | géré par `setup-node cache: npm` | intégré |
| .NET | `~/.nuget/packages` | hash `*.csproj` / `*.sln` |

---

## Structure par template

### ci-python.yml
```
concurrency
checkout (fetch-depth: 0)
setup-python
cache pip
install deps
changed-files source (*.py)
changed-files config (pyproject.toml, ruff.toml, .ruff.toml)
format check: ruff format --check (diff-only / full / skip)
lint: ruff check (diff-only / full / skip)
typecheck: mypy . (full, conditionnel si mypy détecté)
test: pytest (full)
```

### ci-node.yml
```
concurrency
checkout (fetch-depth: 0)
setup-node (cache: npm)
npm ci
changed-files source (*.ts, *.tsx, *.js, *.jsx)
changed-files config (biome.json*, .eslintrc*, eslint.config.*, tsconfig*.json)
format check: biome format --check OU prettier --check (diff-only / full / skip)
lint: biome check OU eslint (diff-only / full / skip)
typecheck: npm run typecheck --if-present (full)
test: npm run test --if-present (full)
build: npm run build --if-present (full)
```

### ci-go.yml
```
concurrency
checkout (fetch-depth: 0)
setup-go (go-version-file: go.mod)
cache golangci-lint + go modules
install golangci-lint
compute base-rev (PR vs push)
lint: golangci-lint run --new-from-rev=$base_rev
test: go test ./... (full)
build: go build ./... (full)
```

### ci-rust.yml
```
concurrency
checkout
cache cargo
format check: cargo fmt --check (full)
lint: cargo clippy -- -D warnings (full)
test: cargo test --all-targets (full)
build: cargo build --all-targets (full)
```

### ci-dotnet.yml
```
concurrency
checkout
setup-dotnet
cache nuget
restore: dotnet restore
format check: dotnet format --verify-no-changes (full)
build: dotnet build --no-restore --configuration Release (full)
test: dotnet test --no-build --configuration Release (full)
```

---

## Edge cases

| Cas | Comportement |
|---|---|
| Pas de fichiers modifiés | `any_changed == 'false'` → step `if:` false → skip propre |
| Config + sources changent | Config prend la précédence → full lint |
| Premier commit repo Go | `HEAD~1` inexistant → fallback `HEAD` → full lint |
| Force-push Go | Non supporté pour diff-only (documenté) |
| mypy inline TOML syntax | Hors scope, documenté |
| Pas de linter détecté (Node sans biome ni eslint) | Steps lint/format skippés silencieusement |

---

## Fichiers modifiés

1. `claude/skills/conventions.init/references/templates/ci-python.yml`
2. `claude/skills/conventions.init/references/templates/ci-node.yml`
3. `claude/skills/conventions.init/references/templates/ci-go.yml`
4. `claude/skills/conventions.init/references/templates/ci-rust.yml`
5. `claude/skills/conventions.init/references/templates/ci-dotnet.yml`
