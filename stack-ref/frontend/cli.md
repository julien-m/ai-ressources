---
last_updated: 2026-03-17
confidence: high
category: frontend
type: cli
---

# CLI Tools

## Go — Recommandation principale
**Le meilleur choix pour un CLI qui fait des requêtes HTTP, de l'orchestration, ou de la manipulation de fichiers.**

- Compile en binaire statique sans dépendances (`CGO_ENABLED=0`)
- Cross-compilation triviale : `GOOS=windows GOARCH=amd64 go build` depuis macOS
- Temps de compilation rapide (secondes)
- Écosystème CLI excellent :
  - `cobra` — framework de commandes (sous-commandes, flags, autocomplete)
  - `bubbletea` — TUI interactifs (listes, spinners, formulaires terminal)
  - `lipgloss` — styling terminal (couleurs, borders, layout)
  - `viper` — gestion de config (yaml/env/flags)
- Concurrence native (goroutines) — parfait pour du parallélisme dans un CLI

**Cas d'usage typiques** : CLI APIs, déploiement, gestion ressources cloud, automatisation.

### Exemple coût binaire final
| OS | Taille typique |
|----|---------------|
| macOS arm64 | ~8–12 MB |
| Linux amd64 | ~8–12 MB |
| Windows amd64 | ~9–13 MB |

## Bun / TypeScript — Recommandation si interne ou rapidité
Pertinent quand **le CLI est interne** (pas distribué) ou qu'on veut aller vite dans l'écosystème TypeScript.

- `bun build --compile` → binaire autonome (~60–80 MB, inclut le runtime Bun)
- Partage de code avec le reste du projet (libs TS, types, utils)
- Zéro nouvelle langue à apprendre
- `bun shell` (`$`) pour les opérations système — remplace bash

**Limite pour distribution** : binaire plus lourd, peut dépendre de glibc sur Linux selon la cible. Préférer Go pour une vraie distribution multiplateforme publique.

## Rust — Pour les cas extrêmes
Pertinent si le CLI fait du **parsing binaire, manipulation système bas niveau, ou que les performances à l'extrême comptent**.

- Performances maximales, zéro runtime
- `clap` — parsing d'arguments excellent
- Binaire statique possible avec `musl`
- Overkill pour un CLI qui fait des requêtes HTTP
- Courbe d'apprentissage élevée, temps de compilation long

**Quand vraiment utiliser** : CLI qui traite de gros volumes de données locales (parsing logs, compression, cryptographie), ou quand Go ne suffit pas (rare).

## Arbre de décision
```
CLI ?
├── Distribution publique multiplateforme → Go
├── Usage interne / même projet TS → Bun/TypeScript
└── Parsing binaire / perf extrême / système bas niveau → Rust
```

## Comparatif
| Critère | Go | Bun/TS | Rust |
|---------|----|----|------|
| Binaire multiplateforme | ✅ trivial | ⚠️ lourd | ✅ possible |
| Vitesse dev | ✅ rapide | ✅ très rapide | ❌ lent |
| Perf runtime | ✅ excellente | ✅ bonne | ✅ maximale |
| Partage code projet TS | ❌ | ✅ | ❌ |
| TUI interactif | ✅ bubbletea | ⚠️ libs tierces | ✅ ratatui |
| Courbe apprentissage | ✅ faible | ✅ nulle | ❌ élevée |
## Combinaisons stack
- `Go + cobra + bubbletea` → CLI public distribué avec TUI
- `Go + cobra + viper` → CLI avec config fichier + env
- `Bun + TypeScript + $shell` → outil interne dev, même repo que l'app
- `Rust + clap` → CLI de traitement de données intensif
