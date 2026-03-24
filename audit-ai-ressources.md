# Audit — Knowledge Base `julien-m/ai-ressources`

> **Audience** : humain (lecture) + agent Claude Code (auto-vérification et application continue).
> **Date** : 2026-03-24
> **Scope** : audit complet de la structure, des conventions, du routage agent, et des optimisations à prévoir pour un usage local Claude Code sur macOS.

---

## Table des matières

1. [Forces de l'architecture actuelle](#1-forces-de-larchitecture-actuelle)
2. [Points critiques et gaps](#2-points-critiques-et-gaps)
3. [Recommandations concrètes](#3-recommandations-concrètes)
4. [Logique d'application des conventions et hiérarchisation](#4-logique-dapplication-des-conventions-et-hiérarchisation)
5. [Conseils spécifiques usage agent local macOS](#5-conseils-spécifiques-usage-agent-local-macos)
6. [Sections exportables — À charger / imposer à Claude](#6-sections-exportables--à-charger--imposer-à-claude)

---

## 1. Forces de l'architecture actuelle

### 1.1 Architecture par domaines — pattern "knowledge base agent-first"

La structuration en dossiers thématiques autonomes (`architecture/`, `code-conventions/`, `design/`, `stack-ref/`, etc.) est exactement le bon pattern pour une consommation agent :

- **Isolation claire** : chaque domaine est auto-suffisant, avec son propre `index.yaml`.
- **Chargement sélectif** : un agent peut lire uniquement l'index d'un domaine pour décider quels fichiers charger, sans crawler l'ensemble du repo.
- **Scalabilité** : ajouter un nouveau domaine (ex. `monitoring/`) ne perturbe pas les autres.

### 1.2 Index YAML omniprésents — "table des matières machine-first"

Chaque dossier contient un `index.yaml` décrivant ses fichiers avec une description lisible par un agent. Le root `index.yaml` joue le rôle de manifeste global.

Points forts observés :
- Descriptions concises et précises (`description:` field)
- Champs `status` (complete / active / placeholder)
- Champ `file_count` pour les domaines complexes
- Listes `files:` avec description par fichier (ex. `code-conventions/index.yaml`, `design/index.yaml`)

### 1.3 Dispatcher de conventions — `claude/rules/code.md`

Le fichier `claude/rules/code.md` implémente un **dispatcher de chargement** très bien conçu :

- Ordre de chargement explicite : `general.md` → `architecture.md` → `logging.md` → `testing.md` → delta langage → `database.md`
- Guard clause : "n'activer que pour les tâches de code"
- Couverture multilangage : JS/TS, Go, Rust, Swift/Kotlin, Delphi, SQL
- Extension design : routage vers les tokens et composants design selon la plateforme cible (iOS, Android, Web, cross-platform)
- Bloc de confirmation affiché avant de coder (`⚙ Code Conventions Loaded`)

### 1.4 Skill `/ai-res` — chargement à la demande

Le skill `claude/skills/ai-res/SKILL.md` fournit un **point d'entrée on-demand** :

- Base path hardcodée : `/Users/julienm/projects/ai-ressources/`
- Alias pratiques : `stack` → `stack-ref`, `code` → `code-conventions`, `pricing` → `pricing-models`
- Règle de chargement sélectif (lire l'index d'abord, ne charger que les fichiers pertinents)
- Gestion des placeholders : signalement explicite si un fichier est vide

### 1.5 Règles `.claude/` — automatisation de la maintenance

- `update-index-on-file-change.md` : force la mise à jour de l'index dès qu'un fichier est créé/renommé/supprimé — élimine la dérive silencieuse.
- `sync-claude-assets.md` : impose la synchronisation des assets Claude (skills, rules) via `cc-hub` après chaque modification.

### 1.6 Templates `stack-ref/_templates/` — standardisation vendor

Le template `_template.md` impose une structure stricte pour chaque fiche vendor :

- Métadonnées YAML (`last_updated`, `confidence`, `category`, `type`, `pricing_model`, `free_tier`, `open_source`)
- Sections standardisées : description, pricing (free tier + plans), limites techniques, ✅ quand utiliser, ❌ quand NE PAS utiliser, stack optimale, alternatives

### 1.7 Couverture thématique — SaaS full-stack

Architecture, conventions de code (10 fichiers), design (27 fichiers), stack-ref (50+ fichiers), legal, SEO, pricing, copywriting : la couverture est exceptionnellement large pour une knowledge base solo/small team.

### 1.8 Règle "cross-cutting" — langue anglaise

La règle "All code, comments, and documentation must be written in English" est clairement posée dans `claude/rules/code.md`, éliminant une source fréquente de dérive.

---

## 2. Points critiques et gaps

### 2.1 Absence de schéma formel pour `index.yaml`

**Problème** : Les `index.yaml` n'ont pas de schéma JSON Schema / YAML Schema défini. Les champs varient légèrement entre domaines (ex. `files:` présent dans `code-conventions/index.yaml` et `design/index.yaml` mais pas structuré de la même façon dans tous les domaines ; `domains:` dans le root). Sans validation automatique, le format peut dériver.

**Risque agent** : Un champ manquant ou une clé mal orthographiée (`applies_to` vs `appliesTo`) peut casser le routage ou provoquer un chargement incorrect.

### 2.2 Pas de champ `applies_to` ni `priority` dans les index

**Problème** : Aucun index ne porte de métadonnées `applies_to` (langage/plateforme cible) ni `priority`/`precedence`. L'agent doit inférer quels fichiers sont pertinents à partir des descriptions textuelles.

**Risque agent** : Claude peut charger des fichiers non pertinents (ex. charger `swift-kotlin.md` pour une tâche Node.js) ou manquer des fichiers critiques.

### 2.3 Absence de règle d'autorité / conflict resolution

**Problème** : Si `code-conventions/general.md` dit "X" et `code-conventions/javascript.md` dit "Y", la règle qui prime n'est pas formellement documentée. Il n'existe pas de document "Authority & Precedence" dans le repo.

**Risque agent** : En cas de conflit, Claude interprétera selon son jugement, introduisant de la variabilité dans les outputs.

### 2.4 Base path hardcodée dans le skill `/ai-res`

**Problème** : `claude/skills/ai-res/SKILL.md` contient `/Users/julienm/projects/ai-ressources/` en dur. Si le repo est cloné ailleurs (machine différente, CI, autre utilisateur), le skill échoue silencieusement ou charge les mauvais fichiers.

**Risque agent** : Portabilité nulle. Sur une nouvelle machine ou un second chemin de clone, le skill est inutilisable sans modification manuelle.

### 2.5 Pas de validation automatique (CI / lint)

**Problème** : Le repo ne contient ni pipeline CI, ni YAML linter, ni Markdown linter, ni link checker. La qualité repose uniquement sur la discipline manuelle.

**Risque** : Les index peuvent se désynchroniser (ex. un fichier supprimé mais encore référencé dans `index.yaml`), des liens cassés s'accumulent, des YAML mal formés passent inaperçus.

### 2.6 Conventions de nommage de fichiers non documentées au niveau repo

**Problème** : Les fichiers utilisent `kebab-case` de façon cohérente, mais cette convention n'est pas formellement documentée dans `conventions/`. Un contributeur humain ou un agent pourrait créer `AuthFlows.md` ou `auth_flows.md`.

**Risque agent** : Sur macOS (APFS case-insensitive), `Auth-Flows.md` et `auth-flows.md` sont le même fichier. En CI Linux (case-sensitive), ça casse. Sans règle explicite, Claude peut générer des paths inconsistants.

### 2.7 Sections manquantes dans les docs d'architecture

**Problème** : Les fichiers `architecture/*.md` n'ont pas de structure standardisée. Il manque systématiquement :
- **Decision** : quand utiliser ce pattern
- **Default choice** : ce que Claude doit choisir par défaut
- **Anti-patterns**
- **Checklist "before merge"**

**Risque agent** : Claude peut implémenter un pattern architectural sans avoir les garde-fous nécessaires.

### 2.8 Design tokens sans table de mapping cross-platform complète

**Problème** : Les tokens design (couleurs, spacing, typography) existent, mais la table de mapping `px / pt / dp / sp` cross-platform (iOS/Android/Web) n'est pas garantie complète ou à jour dans tous les fichiers.

**Risque agent** : Claude peut utiliser des valeurs px pour du code Swift/Kotlin, ou des pt pour du web.

### 2.9 Champs `last_reviewed` absents des index

**Problème** : Aucun index ne porte de date de dernière révision. Les fiches `stack-ref` ont bien `last_updated` et `confidence` dans leur front matter YAML, mais les conventions de code et design n'ont pas d'indicateur de fraîcheur.

**Risque agent** : Claude peut appliquer des conventions obsolètes sans le savoir.

### 2.10 Pas de section "limitations connues / legacy" par technologie

**Problème** : Pour Delphi, Rust, Swift/Kotlin, il n'est pas documenté si ces conventions sont "best effort" ou "fully maintained". Un agent n'a aucun signal de confiance différencié.

---

## 3. Recommandations concrètes

### 3.1 Définir un schéma `index.yaml` standard

Créer `conventions/index-schema.md` documentant les champs obligatoires et optionnels pour tous les `index.yaml` du repo.

**Schéma recommandé pour les index de domaine :**

```yaml
# Champs obligatoires
domain: string              # Identifiant slug du domaine (ex: "code-conventions")
description: string         # Description courte (1-2 phrases)
status: complete | partial | placeholder | active

# Champs optionnels mais fortement recommandés
last_reviewed: YYYY-MM-DD   # Date de dernière vérification
maintainer: string          # Owner (ex: "julienm")
file_count: integer

# Pour chaque entrée files[] ou sections{}
files:
  - file: string            # Chemin relatif au dossier (kebab-case, .md)
    description: string     # Ce que contient le fichier (1 phrase)
    applies_to: [string]    # Optionnel : langages/plateformes (ex: ["TS", "JS"])
    status: complete | partial | placeholder  # Optionnel
    priority: integer       # Optionnel : ordre de chargement (1 = premier)
    last_reviewed: YYYY-MM-DD  # Optionnel
```

### 3.2 Ajouter `applies_to` dans `code-conventions/index.yaml`

Exemple concret :

```yaml
files:
  - file: general.md
    description: "Shared rules for all languages"
    applies_to: ["*"]
    priority: 1

  - file: javascript.md
    description: "TypeScript/Node.js/React conventions"
    applies_to: ["TypeScript", "JavaScript", "Node", "React", "Next.js"]
    priority: 5

  - file: go.md
    description: "Go-specific patterns"
    applies_to: ["Go"]
    priority: 5

  - file: swift-kotlin.md
    description: "iOS/Android native conventions"
    applies_to: ["Swift", "Kotlin"]
    priority: 5
    status: partial

  - file: delphi.md
    description: "Delphi/Pascal conventions"
    applies_to: ["Delphi", "Pascal"]
    priority: 5
    status: partial
```

### 3.3 Créer un document `AUTHORITY.md` — règle d'autorité et de priorité

Créer `code-conventions/AUTHORITY.md` (ou `conventions/authority.md`) avec la hiérarchie formelle :

```
Niveau 1 (le plus autoritaire) :
  → claude/rules/code.md          (dispatcher — charge, ne définit pas)
  → code-conventions/general.md   (règles fondamentales, toutes langues)

Niveau 2 :
  → code-conventions/architecture.md
  → code-conventions/logging.md
  → code-conventions/testing.md
  → code-conventions/database.md

Niveau 3 (delta langage) :
  → code-conventions/javascript.md
  → code-conventions/go.md
  → code-conventions/rust.md
  → code-conventions/swift-kotlin.md
  → code-conventions/delphi.md

Niveau 4 (contexte projet — overrides locaux possibles) :
  → CONVENTIONS.md dans le projet cible (s'il existe)

Règle de conflit :
  → Le niveau le plus bas (delta langage) prime sur general.md
    SAUF si general.md contient une règle marquée "ABSOLUTE" ou "non-overridable"
  → En cas de doute, toujours appliquer le niveau le plus restrictif
```

### 3.4 Rendre la base path configurable dans le skill `/ai-res`

Modifier `claude/skills/ai-res/SKILL.md` pour que la base path soit résolue dynamiquement :

```markdown
## Base path

Résolution dans l'ordre de priorité :
1. Variable d'environnement `AI_RESOURCES_PATH` (si définie)
2. Chemin par défaut : `~/projects/ai-ressources/`
3. Fallback : `~/ai-ressources/`

L'agent doit vérifier que le chemin existe avant de charger les fichiers.
```

### 3.5 Documenter les conventions de nommage de fichiers dans `conventions/`

Ajouter ou compléter un fichier `conventions/naming.md` :

```markdown
## Conventions de nommage — Fichiers et dossiers

- **Casse** : kebab-case uniquement (`auth-flows.md`, `stack-ref/`, `code-conventions/`)
- **Extension** : `.md` pour Markdown, `.yaml` pour les index (pas `.yml`)
- **Index** : toujours nommé `index.yaml` (jamais `INDEX.yaml` ou `index.yml`)
- **Templates** : préfixe `_` pour les templates non-contenu (`_template.md`)
- **Pas d'espaces** dans les noms de fichiers ou dossiers
- **Pas de caractères spéciaux** (accents, tirets bas hors templates)

⚠️ macOS est case-insensitive (APFS) — la casse exacte doit correspondre au système de fichiers
réel pour éviter les cassures en CI Linux (case-sensitive).
```

### 3.6 Ajouter une section standard dans les docs `architecture/*.md`

Chaque fichier d'architecture devrait suivre ce template :

```markdown
## Décision — Quand utiliser ce pattern

## Contraintes et limites

## Choix par défaut (ce que Claude doit implémenter sauf instruction contraire)

## Anti-patterns à éviter

## Checklist avant merge
- [ ] ...
```

### 3.7 Ajouter des champs `last_reviewed` et `coverage` dans les index

Exemple dans `code-conventions/index.yaml` :

```yaml
domain: code-conventions
last_reviewed: 2026-03-24
coverage:
  TypeScript: full
  JavaScript: full
  Go: full
  Rust: partial
  Swift: partial
  Kotlin: partial
  Delphi: best-effort
```

### 3.8 Ajouter une validation YAML minimale

Même sans CI complet, ajouter un script de validation local :

```bash
# Dans la racine du repo, créer validate.sh :
#!/bin/bash
set -e
# Valider tous les index.yaml
find . -name "index.yaml" -not -path "./.git/*" | while read f; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" && echo "✓ $f" || echo "✗ $f"
done
```

### 3.9 Documenter le niveau de maintenance par technologie

Dans `code-conventions/index.yaml` ou dans `README.md` :

```yaml
coverage:
  TypeScript: full      # Pleinement maintenu, prioritaire
  JavaScript: full
  Go: full
  REST: full            # Via architecture/ et general.md
  Kotlin: partial       # Maintenu best-effort
  Swift: partial
  Delphi: legacy        # Maintenu, mais évolue peu
  Rust: partial
```

---

## 4. Logique d'application des conventions et hiérarchisation

### 4.1 Flux de chargement recommandé pour Claude Code

```
TÂCHE REÇUE
    │
    ▼
Est-ce une tâche de CODE ?
    │
    ├─ NON → Ne pas charger code-conventions/
    │        (questions, review, doc, config)
    │
    └─ OUI
          │
          ▼
    Détecter le(s) langage(s) cible(s)
          │
          ▼
    Charger dans l'ordre :
    1. code-conventions/general.md        ← TOUJOURS
    2. code-conventions/architecture.md   ← TOUJOURS
    3. code-conventions/logging.md        ← TOUJOURS
    4. code-conventions/testing.md        ← TOUJOURS
    5. code-conventions/<langage>.md      ← SI applicable
    6. code-conventions/database.md       ← SI SQL/DB impliqué
          │
          ▼
    Tâche frontend / UI ?
    ├─ iOS    → design/systems/apple-hig.md + tokens/
    ├─ Android→ design/systems/material-design.md + tokens/
    ├─ Web    → design/systems/web-standards.md + tokens/
    └─ Cross  → design/tokens/cross-platform.md + composants pertinents
          │
          ▼
    Afficher bloc de confirmation :
    ⚙ Code Conventions Loaded
      ✓ general
      ✓ architecture
      ✓ logging
      ✓ testing
      ✓ <langage>
      ✓ design/<système> (si applicable)
          │
          ▼
    COMMENCER À CODER
```

### 4.2 Règles de priorité en cas de conflit

| Niveau | Source | Priorité | Override possible |
|--------|--------|----------|-------------------|
| 1 | `general.md` | Base | Oui, par niveaux inférieurs |
| 2 | `architecture.md`, `logging.md`, `testing.md`, `database.md` | Cross-cutting | Oui, par langage si justifié |
| 3 | `javascript.md`, `go.md`, `swift-kotlin.md`, `delphi.md`, `rust.md` | Delta langage | Oui, par projet local |
| 4 | `CONVENTIONS.md` dans le projet cible | Projet local | Non — niveau le plus haut |

**Règle d'or** : le niveau le plus spécifique (delta langage) prime sur le général — sauf pour les règles explicitement marquées non-overridable (sécurité, logging PII, anti-patterns absolus).

### 4.3 Règle de chargement design

| Contexte | Fichiers à charger |
|----------|--------------------|
| iOS uniquement | `apple-hig.md` + `spacing.md` + `typography.md` + `colors.md` |
| Android uniquement | `material-design.md` + `spacing.md` + `typography.md` + `colors.md` |
| Web uniquement | `web-standards.md` + `spacing.md` + `typography.md` + `colors.md` |
| Cross-platform | `cross-platform.md` + composants pertinents |
| Maquettage / mockup | `mockup-specs.md` (valeurs px explicites, ne pas utiliser en code) |
| CLI / TUI | `cli-patterns.md` |

### 4.4 Règles de non-dérive — à appliquer absolument

Les règles suivantes ne sont **jamais overridables** :

1. **Langue** : tout code, commentaire, doc technique → anglais uniquement
2. **PII / sécurité** : ne jamais logger de données sensibles (passwords, tokens, PII) — voir `logging.md`
3. **Validation d'entrée** : toujours valider les données externes aux frontières système
4. **Pas de `any`** en TypeScript sauf justification explicite
5. **Tests** : toute nouvelle logique métier doit avoir un test — voir `testing.md`

---

## 5. Conseils spécifiques usage agent local macOS

### 5.1 Casse des fichiers (APFS case-insensitive)

**Problème** : macOS APFS est case-insensitive par défaut. `Auth-Flows.md` et `auth-flows.md` sont identiques localement mais différents en CI Linux.

**Règles à appliquer** :

```
TOUJOURS utiliser la casse exacte du fichier réel (kebab-case, minuscules).
Exemple correct   : code-conventions/general.md
Exemple incorrect : Code-Conventions/General.md
```

**Validation recommandée** :

```bash
# Détecter les conflits de casse (exécuter depuis la racine du repo)
find . -not -path "./.git/*" -type f | sort -f | awk 'BEGIN{prev=""} {
  lower=tolower($0)
  if (lower==prev) print "CONFLIT CASSE: " $0
  prev=lower
}'
```

### 5.2 Encodage et fins de lignes

| Convention | Valeur |
|------------|--------|
| Encodage | UTF-8 (sans BOM) |
| Fins de lignes | LF (`\n`) — **pas** CRLF |
| Indentation YAML | 2 espaces |
| Indentation Markdown | 2 espaces pour les listes imbriquées |
| Trailing whitespace | Interdit |

**Configurer `.editorconfig`** à la racine du repo (si absent) :

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.yaml]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

### 5.3 Chargement local — path resolution

Quand Claude Code consomme le repo en local sur macOS :

```
Base path recommandée : ~/projects/ai-ressources/
Variable d'env recommandée : AI_RESOURCES_PATH=$HOME/projects/ai-ressources

Point d'entrée unique :
  1. Lire $AI_RESOURCES_PATH/index.yaml
  2. Identifier les domaines pertinents pour la tâche
  3. Lire $AI_RESOURCES_PATH/<domaine>/index.yaml
  4. Sélectionner les fichiers pertinents (ne PAS bulk-loader)
  5. Lire uniquement les fichiers sélectionnés
```

**Ne jamais faire** :
- Crawler récursivement tout le repo à chaque tâche
- Charger tous les fichiers d'un domaine sans filtrage
- Utiliser un chemin absolu hardcodé autre que via variable d'env

### 5.4 Performance de chargement — règle du "load minimal"

Pour éviter de saturer le contexte de Claude et ralentir les tâches :

| Règle | Détail |
|-------|--------|
| Maximum 6-8 fichiers par tâche | general + arch + logging + testing + 1 delta langage + 1-2 design si besoin |
| Lire l'index avant le contenu | Toujours lire `index.yaml` du domaine pour choisir les fichiers |
| Ne pas recharger entre sous-tâches | Une fois chargé en début de session, ne pas recharger |
| Placeholders = skip | Si un fichier a `status: placeholder`, l'ignorer et le signaler |

### 5.5 Validation avant commit (hook git recommandé)

Ajouter un hook `pre-commit` minimal pour le repo :

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Valider les YAML
echo "Validating YAML..."
find . -name "*.yaml" -not -path "./.git/*" | while read f; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" 2>&1
  if [ $? -ne 0 ]; then
    echo "ERREUR YAML: $f"
    exit 1
  fi
done

# Vérifier les liens internes dans les index
echo "Checking index references..."
python3 - <<'EOF'
import yaml, os, sys
errors = []
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d != '.git']
    for f in files:
        if f == 'index.yaml':
            path = os.path.join(root, f)
            data = yaml.safe_load(open(path))
            # Vérification basique : les fichiers listés existent
            files_list = []
            if isinstance(data, dict):
                for v in data.values():
                    if isinstance(v, list):
                        for item in v:
                            if isinstance(item, dict) and 'file' in item:
                                files_list.append(item['file'])
            for ref in files_list:
                full = os.path.join(root, ref)
                if not os.path.exists(full):
                    errors.append(f"{path}: fichier référencé introuvable → {ref}")
if errors:
    for e in errors: print(f"ERREUR: {e}")
    sys.exit(1)
EOF

echo "✓ Validation OK"
```

### 5.6 Règles spécifiques macOS à documenter pour Claude

```markdown
Sur macOS local avec Claude Code :
- Le FS est case-insensitive : utiliser UNIQUEMENT kebab-case minuscules pour tous les paths
- Les fins de lignes sont LF : vérifier que l'éditeur ne convertit pas en CRLF
- Le chemin ~ est résolu vers /Users/<username> : utiliser $HOME en scripts
- APFS supporte les symlinks : cc-hub peut utiliser des symlinks pour sync des assets Claude
- Éviter les caractères non-ASCII dans les noms de fichiers (accents, etc.)
- Préférer les chemins relatifs dans les index YAML pour la portabilité
```

---

## 6. Sections exportables — À charger / imposer à Claude

> **Usage** : Ces sections sont conçues pour être copiées et données directement à Claude Code au début d'une session, d'un projet, ou d'un CLAUDE.md de projet. Elles constituent les "règles d'or" non-négociables.

---

### 6.1 Bloc d'identité de la knowledge base

```markdown
## Knowledge Base — ai-ressources

Base path locale : ~/projects/ai-ressources/ (ou $AI_RESOURCES_PATH)
Point d'entrée : index.yaml (root)

Domaines disponibles :
- architecture/      → Patterns SaaS (auth, multi-tenant, rate-limiting, webhooks, events, cache, jobs, migrations)
- code-conventions/  → Conventions de code (general + architecture + logging + testing + delta langage)
- design/            → Tokens, systèmes (HIG/M3/Web/CLI), composants, qualité, références
- stack-ref/         → Fiches vendor (auth, DB, email, payments, platforms, jobs, search, storage, AI, CMS, frontend)
- conventions/       → Conventions transversales (diagrammes)
- copywriting/       → Templates copywriting SaaS
- legal/             → CGU, RGPD, mentions légales, merchant of record
- pricing-models/    → Modèles de pricing SaaS
- seo/               → Core Web Vitals, SEO programmatique, Next.js SEO

Règle de chargement : lire l'index du domaine d'abord, sélectionner uniquement les fichiers pertinents.
Ne jamais bulk-loader un domaine entier.
```

---

### 6.2 Règles d'or — Non-négociables

```markdown
## Règles absolues (non-overridables)

1. LANGUE : Tout code, commentaire, variable, doc technique → anglais uniquement.
   Exception : contenu utilisateur (ex: textes d'interface en français si le produit est FR).

2. CONVENTIONS : Avant tout code, charger les conventions dans l'ordre :
   general.md → architecture.md → logging.md → testing.md → <langage>.md → database.md (si SQL)

3. SÉCURITÉ : Jamais logger passwords, tokens, clés API, données PII. Voir logging.md.

4. VALIDATION : Toujours valider les données externes aux frontières (HTTP, env vars, webhooks).

5. TYPAGE : Pas de `any` en TypeScript sans justification explicite documentée.

6. IDEMPOTENCE : Toute opération critique (paiement, création, changement de statut) doit être idempotente.

7. CHEMINS : kebab-case minuscules uniquement pour tous les fichiers et dossiers.
   Respecter la casse exacte (case-sensitive en CI même si macOS est case-insensitive).

8. INDEX : Après toute création/suppression/renommage de fichier, mettre à jour index.yaml immédiatement.
```

---

### 6.3 Dispatcher de chargement des conventions — Version condensée

```markdown
## Dispatcher — Chargement des conventions de code

UNIQUEMENT pour les tâches de CODE (pas pour les questions, reviews, doc, config).

Ordre de chargement obligatoire :
1. code-conventions/general.md          ← toujours
2. code-conventions/architecture.md     ← toujours
3. code-conventions/logging.md          ← toujours
4. code-conventions/testing.md          ← toujours
5. code-conventions/<langage>.md        ← selon détection :
   - TypeScript / JavaScript / Node / React / Next.js → javascript.md
   - Go → go.md
   - Swift / Kotlin → swift-kotlin.md
   - Rust → rust.md
   - Delphi / Pascal → delphi.md
   - SQL → database.md (en plus du reste)
   - REST seul → general.md + architecture.md suffisent
6. code-conventions/database.md         ← si SQL impliqué

Pour les tâches frontend / UI, ajouter selon plateforme :
- iOS    → design/systems/apple-hig.md + design/tokens/spacing.md + typography.md + colors.md
- Android→ design/systems/material-design.md + design/tokens/...
- Web    → design/systems/web-standards.md + design/tokens/...
- Cross  → design/tokens/cross-platform.md + composants pertinents

Après chargement, afficher :
⚙ Code Conventions Loaded
  ✓ general
  ✓ architecture
  ✓ logging
  ✓ testing
  ✓ <langage>
  ✓ database (si chargé)
  ✓ design/<système> (si chargé)
```

---

### 6.4 Checklist d'auto-vérification avant livraison de code

```markdown
## Checklist conformité — À valider avant tout commit / livraison

### Code
- [ ] Tout le code est en anglais (variables, fonctions, commentaires, types)
- [ ] Pas de `any` non justifié (TypeScript)
- [ ] Toutes les fonctions publiques ont des types explicites
- [ ] Pas de magic values — constantes centralisées
- [ ] Fonctions ≤ 30 lignes, responsabilité unique
- [ ] Pas de nesting profond — early returns utilisés
- [ ] Erreurs propagées, jamais avalées silencieusement
- [ ] Données externes validées à la frontière

### Sécurité / Logging
- [ ] Aucune donnée sensible loggée (passwords, tokens, PII)
- [ ] Erreurs internes non exposées aux consumers d'API
- [ ] Inputs sanitisés et validés
- [ ] Requêtes SQL paramétrées (pas de concaténation)

### Tests
- [ ] Toute logique métier nouvelle couverte par un test
- [ ] Tests nommés selon convention (voir testing.md)
- [ ] Mocks limités aux frontières (pas de mock interne)

### Architecture
- [ ] Pas de leak entre couches (handler → service → repo)
- [ ] Opérations critiques idempotentes
- [ ] Pagination / limites sur toutes les requêtes de liste
- [ ] Timeouts sur tous les appels externes

### Documentation
- [ ] Chaque fichier/module commence par une description de responsabilité
- [ ] Fonctions publiques documentées (JSDoc, godoc, etc.)
- [ ] Commentaires expliquent le POURQUOI, pas le QUOI

### Repo (si modification de la knowledge base)
- [ ] index.yaml du domaine mis à jour
- [ ] Nommage kebab-case respecté
- [ ] Encodage UTF-8, LF, pas de trailing whitespace
```

---

### 6.5 Hiérarchie des conventions — Référence rapide

```markdown
## Hiérarchie des conventions (du plus général au plus spécifique)

Niveau 1 — Fondations (toutes langues)
  code-conventions/general.md

Niveau 2 — Cross-cutting
  code-conventions/architecture.md
  code-conventions/logging.md
  code-conventions/testing.md
  code-conventions/database.md  (si applicable)

Niveau 3 — Delta langage (surcharge le Niveau 1-2 pour ce langage)
  code-conventions/javascript.md  → TypeScript, JavaScript, Node, React, Next.js
  code-conventions/go.md          → Go
  code-conventions/swift-kotlin.md → Swift, Kotlin
  code-conventions/rust.md        → Rust
  code-conventions/delphi.md      → Delphi, Pascal

Niveau 4 — Projet local (override possible, documenté dans CONVENTIONS.md du projet)

Règle de conflit : le niveau le plus spécifique prime.
Exception : les règles de sécurité/logging de general.md et logging.md sont absolues.

Coverage par technologie :
  TypeScript / JavaScript : full (prioritaire)
  Go                      : full (prioritaire)
  REST                    : full (via general + architecture)
  Kotlin                  : partial / best-effort
  Swift                   : partial / best-effort
  Delphi                  : legacy / best-effort
  Rust                    : partial
```

---

*Fin de l'audit — `audit-ai-ressources.md` — 2026-03-24*
