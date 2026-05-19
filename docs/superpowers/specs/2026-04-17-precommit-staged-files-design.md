# Design : Pre-commit hooks — staged-file awareness

**Date:** 2026-04-17
**Skill:** conventions-init

---

## Contexte et problème

Les hooks pre-commit générés par `/conventions-init` utilisent des commandes qui analysent **tout le projet** :

```sh
check "npx biome check ."
check "ruff check ."
check "npx eslint ."
```

C'est lent (scan inutile de fichiers non commités) et incohérent avec les CI templates, qui limitent déjà l'analyse aux fichiers modifiés.

---

## Solution

### 1. Pattern staged-file dans les hooks générés

Les linters/formatters (Biome, ESLint, Ruff) passent en mode **staged-only** avec une collecte de fichiers sûre pour les noms contenant des espaces :

```sh
if ! git diff --cached --quiet --diff-filter=ACMR -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.json'; then
  printf "→ npx biome check (staged files)\n"
  git diff --cached --name-only --diff-filter=ACMR -z -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.json' \
    | xargs -0 npx biome check
fi
```

Ce pattern évite deux erreurs classiques :
- `tr '\n' ' '` casse les chemins contenant des espaces
- `check "..."` repose sur `eval`, donc réintroduit un parsing shell fragile pour les noms de fichiers

Les outils qui nécessitent le projet complet restent inchangés :
- `npx tsc --noEmit` — typecheck cross-fichiers
- `cargo check`, `cargo clippy` — compilation Rust
- `go build ./...`, `go vet ./...` — build Go
- `pyright`, `mypy .` — typecheck Python

---

## Architecture des changements

### `.agent-sync/skills/conventions-init/SKILL.md` — Phase 7

Les exemples de hooks TypeScript + Biome et Python + Ruff sont mis à jour pour montrer le pattern staged-file complet, incluant :
- Détection de présence via `git diff --cached --quiet --diff-filter=ACMR -- <pathspecs>`
- Passage des fichiers via `git diff ... -z | xargs -0 ...`
- Maintien des commandes whole-project pour typecheck

### `code-conventions/stack-commands.md`

Le tableau source de vérité pour les stacks reprend le même pattern `ACMR` et la même pipeline `-z | xargs -0`, afin que la doc de référence et les exemples générés restent synchronisés.

### `docs/superpowers/plans/2026-04-17-precommit-staged-files.md`

Le plan est recentré sur le scope réel du patch : documentation de `conventions-init` + mise à jour des documents de support. Les changements plus larges restent explicitement en follow-up.

---

## Comportement attendu

### Avant (hooks générés aujourd'hui)

```sh
check "npx tsc --noEmit"
check "npx biome check ."   # ← scan tout le projet
```

### Après (hooks générés par la doc mise à jour le 2026-04-17)

```sh
check "npx tsc --noEmit"

if ! git diff --cached --quiet --diff-filter=ACMR -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.json'; then
  printf "→ npx biome check (staged files)\n"
  git diff --cached --name-only --diff-filter=ACMR -z -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.json' \
    | xargs -0 npx biome check
fi
```

---

## Edge cases

| Cas | Comportement |
|-----|-------------|
| Commit de `.md` uniquement | `git diff --cached --quiet --diff-filter=ACMR -- <pathspecs>` retourne succès → linter skippé, tsc continue |
| Commit d'un seul fichier `.ts` | Biome check sur ce fichier uniquement |
| Nom de fichier avec espaces | Supporté via `-z` et `xargs -0` |
| Stack TypeScript sans Biome/ESLint | Pas de linter staged-only à générer |
| Stack multi (TS + Python) | Chaque linter a son propre bloc `git diff --cached --quiet --diff-filter=ACMR` avec ses pathspecs dédiés |

---

## Non-scope

- `.agent-sync/skills/conventions-refresh/SKILL.md` — follow-up explicite, hors scope de ce patch
- CI templates — déjà corrigés avant ce patch
- lint-staged — non, zéro dépendance extra
- Python mypy / pyright — restent whole-project (typecheck cross-fichiers)
