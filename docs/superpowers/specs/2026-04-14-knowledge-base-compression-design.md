# Design: Compression sans perte — stack-ref/, code-conventions/, architecture/

**Date:** 2026-04-14
**Objectif:** Réduire ~12 600 lignes dans les 3 domaines restants sans perte d'information sémantique, en appliquant la même méthodologie que `design/` (-19.1%).

## Contexte

Après la compression de `design/` (12 982 → 10 496 lignes, -19.1%), trois domaines majeurs restent non-compressés :

| Domaine | Fichiers | Lignes actuelles | Taux cible |
|---------|---------|-----------------|-----------|
| `stack-ref/` | ~40 | ~6 175 | 20% si duplication mesurée >40%, sinon 15% |
| `code-conventions/` | 12 | ~3 816 | 15% |
| `architecture/` | 8 | ~2 605 | 15% |
| **Total** | ~60 | **~12 596** | — |

Ces fichiers sont consommés par les mêmes pipelines que `design/` : `build-conventions.ts`, `ai-res-librarian`, `.conventions/` compilés.

## Définitions — Zero-Loss Guarantee

### Ce qui EST de l'information (ne peut pas disparaître)
- **Valeurs discrètes** : versions, URLs, noms de services, flags CLI, configs par défaut
- **Règles normatives** : MUST/SHOULD/NEVER/toujours/jamais + verbes équivalents en contexte technique (required, default, mandatory, forbidden)
- **Conditions qualificantes** : "quand X", "si Y", "sauf Z", "unless", "when"
- **Chaînes de raisonnement** : "parce que", "car", "because", "afin de", "to avoid"
- **Cross-références** : liens Read, See Also, références à d'autres fichiers
- **Pour stack-ref/** spécifiquement : noms de flags, valeurs par défaut, tiers de pricing, limites de quota, table rows (chaque row = une décision)
- **Pour code-conventions/** spécifiquement : règles de nommage, contraintes de type, patterns obligatoires
- **Pour architecture/** spécifiquement : séquences de flux (ordre des steps), acteurs, conditions d'erreur

### Ce qui N'EST PAS de l'information (compressible)
- Lignes blanches décoratives
- Prose reformulant un tableau existant
- Headers boilerplate identiques répétés dans chaque section
- Répétition de structure entre variants (ex: chaque service re-listant les mêmes critères généraux)

## Architecture de compression

### Techniques communes (héritées de design/)

#### 1. Tables au lieu de prose répétitive
Quand une section répète la même structure N fois, convertir en table en préservant tous qualificateurs et raisonnements.

#### 2. Merge de sections dupliquées
Quand le même contenu apparaît 2+ fois (ex: critères généraux répétés par service dans stack-ref/), garder une instance canonique.

#### 3. Suppression lignes blanches excessives
- Max 1 ligne blanche entre sections `##`
- 0 ligne blanche entre sous-sections `###` sauf si nécessaire
- 0 ligne blanche dans les tables et listes

#### 4. Compaction ASCII diagrams
- Réduire padding interne (2 espaces max)
- Supprimer lignes blanches à l'intérieur des box
- Vérifier alignement monospace après compaction

#### 5. Consolidation cross-références
Quand "Read [file]" apparaît 10+ fois dans un fichier, créer index en tête de fichier.

### Techniques spécifiques par domaine

#### stack-ref/ : Decision-matrix consolidation
Les fichiers `quick-ref.md`, `decision-matrix.md` et les fichiers service individuels dupliquent souvent les mêmes critères de choix. **Pattern** : extraire une table de critères canonique unique, référencer depuis les fichiers service au lieu de répéter.

**Mesure préalable obligatoire** : avant compression, compter les sections/headings qui apparaissent dans 2+ fichiers du même domaine. Si duplication <40% → target 15%, si ≥40% → target 20%.

#### code-conventions/ : Baseline + Delta
Les fichiers language-specific répètent les règles générales puis ajoutent des deltas. **Pattern** : vérifier que le fichier général (`general.md` ou équivalent) est la source canonique; dans les fichiers language-specific, supprimer tout ce qui est identique au général et garder uniquement les overrides et les deltas.

#### architecture/ : Flow diagram compaction + condition tables
Les fichiers d'architecture contiennent des séquences de flux en prose et des diagrammes ASCII. **Pattern** : convertir les conditions d'erreur répétées (retry logic, auth failure, timeout) en table de cas, compacter les diagrammes ASCII.

## Contraintes

- **Zéro merge ou split de fichiers** — éditions contenu uniquement. Aucun fichier créé, renommé ou supprimé.
- **Pas de modification de structure de répertoires**
- **Pas de modification des pipelines** (build-conventions.ts, scripts/)
- **Pas de compression de conventions/** (208 lignes, déjà minimal)

## Validation

### Validation primaire — par fichier compressé

**Pour code-conventions/ et architecture/** :
1. Grep normative markers : `grep -c 'MUST\|SHOULD\|NEVER\|toujours\|jamais\|obligatoire\|interdit\|required\|forbidden'` → count ≥ original
2. Vérification cross-refs : tous les liens `Read [...]` préservés
3. `wc -l` → target ±5%

**Pour stack-ref/** (validation étendue) :
1. Normative markers comme ci-dessus
2. Table row count : `grep -c '|' fichier.md` → count ≥ original (chaque row = une décision qui doit survivre)
3. Code block line count : `grep -c '^\s*[a-zA-Z_-].*:' fichier.md` → options/flags préservés
4. `wc -l` → target ±5%

### Validation secondaire — cc-hub copilot diff review
Après chaque domaine, exécuter une review sémantique du diff git via cc-hub copilot avec instruction : *"Vérifier que aucune valeur discrète (flag, version, quota, default) n'a disparu, et que les chaînes de raisonnement (because, to avoid, afin de) sont intactes."*

### Rollback
- Un commit par domaine → revert granulaire
- Si cc-hub copilot détecte perte sémantique : `git revert` + ré-exécution avec compression plus conservatrice

## Exécution — Structure parallèle

### Phase 1 : Subagents parallèles (contenu uniquement)
3 subagents indépendants, un par domaine. Chaque subagent :
1. Mesure duplication (pour stack-ref/ uniquement)
2. Compresse les fichiers du domaine, plus gros en premier
3. Met à jour `<domain>/index.yaml` (last_reviewed) — uniquement le fichier index local
4. Valide chaque fichier (normative markers + table rows pour stack-ref/)
5. Rapport final : lignes avant/après par fichier

**Scope strict** : aucun subagent ne touche `compiled-index.txt`, `domain-catalog.md`, `.last-updated`.

### Phase 2 : Orchestrateur — sync shared files
Après réception des 3 rapports subagent :
1. `bun run scripts/build-index.ts` — régénère `compiled-index.txt`
2. `domain-catalog.md` — update last_reviewed dates (pas de création/suppression de fichiers → pas d'update d'entrées)
3. `date +%Y-%m-%d > .last-updated`
4. 3 commits domaine (un par domaine) + 1 commit index sync

### Format de commits
```
refactor(compress): stack-ref — N files, X→Y lines (-Z%)
refactor(compress): code-conventions — N files, X→Y lines (-Z%)
refactor(compress): architecture — N files, X→Y lines (-Z%)
refactor(compress): sync indexes post-compression
```

## Hors scope

- Créer de nouveaux fichiers ou répertoires
- Modifier `conventions/` (déjà minimal)
- Modifier les fichiers `design/` (déjà compressés)
- Modifier les pipelines scripts/
- Modifier `copywriting/`, `legal/`, `seo/` (non concernés)
