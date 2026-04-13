# Design: Compression des conventions design

**Date:** 2026-04-13
**Objectif:** Réduire ~13 000 → ~10 000 lignes dans `design/` sans perte d'information sémantique.

## Contexte

Les fichiers de conventions design dans `ai-ressources/design/` totalisent ~13 000 lignes réparties sur 31 fichiers `.md`. Ces fichiers sont consommés par :
1. Le pipeline `build-conventions.ts` qui compile les conventions dans `.conventions/design.md` pour d'autres projets
2. Les agents IA qui lisent les conventions pour générer du design conforme
3. Le `compiled-index.txt` pour le routage via `ai-res-librarian`

L'analyse révèle ~20-25% de redondance structurelle (prose répétitive, sections dupliquées, lignes blanches excessives, ASCII diagrams sur-espacés).

## Définitions

### "Information" (zero-loss guarantee)
Toute information sémantique incluant :
- **Valeurs discrètes** : dimensions, couleurs, breakpoints, noms de composants
- **Règles avec poids normatif** : must/should/prefer/avoid — le verbe modal fait partie de l'information
- **Conditions qualificantes** : "quand X", "si Y", "sauf Z"
- **Chaînes de raisonnement** : "parce que", "car", "afin de" — le pourquoi d'une règle
- **Cross-références** : liens Read, See Also, références à d'autres fichiers

**N'est PAS de l'information** : lignes blanches décoratives, répétition de structure entre sections, prose reformulant un tableau existant, headers boilerplate identiques.

## Architecture de compression

### Techniques (par ordre de priorité)

#### 1. Tables au lieu de prose répétitive (~600-800 lignes)
Quand une section répète la même structure N fois (Anatomy → Behavior → Rules), convertir en table.

**Contrainte** : chaque colonne de table doit capturer les qualificateurs et raisonnements de la prose originale. Une ligne de table qui omet un "because" viole la garantie zero-loss.

Exemple avant :
```
### Button Primary
- Height: 44px
- Use: main CTA
- Rule: prefer for single primary action because it draws maximum visual weight

### Button Secondary  
- Height: 40px
- Use: secondary actions
- Rule: use alongside primary to create visual hierarchy
```

Exemple après :
```
| Variant | Height | Use | Rule |
|---------|--------|-----|------|
| Primary | 44px | main CTA | Prefer for single primary action — draws maximum visual weight |
| Secondary | 40px | secondary actions | Use alongside primary — creates visual hierarchy |
```

#### 2. Merge de sections dupliquées (~400-500 lignes)
Quand le même contenu apparaît 2+ fois dans un fichier (palettes, responsive breakpoints, keyboard nav), garder une seule instance et référencer.

#### 3. Suppression lignes blanches excessives (~200-300 lignes)
- Max 1 ligne blanche entre sections majeures (##)
- 0 ligne blanche entre sous-sections (###) sauf si nécessaire à la lisibilité
- 0 ligne blanche dans les tables et listes

#### 4. Compaction ASCII diagrams (~300-400 lignes)
- Réduire padding interne (2 espaces max)
- Supprimer lignes blanches à l'intérieur des box
- **Vérification** : après compaction, cat le fichier en terminal ou ouvrir en VS Code pour confirmer que l'alignement monospace est préservé

#### 5. Consolidation cross-références (~100-150 lignes)
Quand "Read [file]" ou "See also" apparaît 10+ fois, créer un index unique en tête de fichier.

## Vagues d'exécution

### Vague 1 : 8 fichiers >500 lignes (8 357 lignes → ~6 625 estimé)

| Fichier | Lignes | Gain estimé | Techniques principales |
|---------|--------|-------------|----------------------|
| `references/component-blocks-catalog.md` | 1557 | ~250 | Anatomies → tables, blank lines |
| `systems/cli-patterns.md` | 1181 | ~210 | Refs dupliquées, palettes → table unique |
| `references/app-views.md` | 1152 | ~270 | ASCII mockups compact, boilerplate merge |
| `references/design-references.md` | 932 | ~250 | Structures entreprise → tables, merge cohérence |
| `references/devtools.md` | 776 | ~165 | Read refs → index, palettes → table |
| `references/app-views-catalog.md` | 639 | ~145 | View defs → tables, traits → table |
| `references/app-ui.md` | 608 | ~130 | Domaines → table, règles groupées |
| `references/mockup-specs.md` | 512 | ~100 | Anatomy template, tables groupées |

**Checkpoint post-vague 1** : extraire glossaire terminologique (noms de blocs, vues, patterns, composants) pour vérifier cohérence cross-refs avant vague 2.

### Vague 2 : 9 fichiers 300-500 lignes (3 618 lignes → ~2 700 estimé)

| Fichier | Lignes | Gain estimé |
|---------|--------|-------------|
| `components/payment-flows.md` | 479 | ~130 |
| `components/data-visualization.md` | 452 | ~95 |
| `components/log-viewer.md` | 448 | ~115 |
| `references/landing-pages.md` | 423 | ~130 |
| `quality/accessibility.md` | 385 | ~75 |
| `components/feedback.md` | 379 | ~100 |
| `components/buttons.md` | 378 | ~110 |
| `components/lists.md` | 367 | ~85 |
| `components/navigation.md` | 299 | ~70 |

### Vague 3 : 14 petits fichiers + nettoyage global (~895 lignes → ~750 estimé)

Fichiers <300 lignes : `email-templates` (278), `realtime-streams` (211), `motion` (211), `ui-rules` (254), `modals` (147), `material-design` (149), `web-standards` (144), `apple-hig` (135), `forms` (125), `cross-platform` (99), `colors` (105), `typography` (88), `spacing` (69).

Nettoyage global : lignes blanches résiduelles, cohérence terminologique finale.

## Validation

### Primaire : Test Q&A sémantique (toutes vagues)
Pour chaque fichier :
1. Extraire 5 questions depuis `questions_answered` dans `index.yaml` (ou inférer depuis les headings)
2. Répondre à chaque question depuis le fichier original
3. Après compression, vérifier que le fichier compressé produit des réponses équivalentes

### Auto-vérification par agent compresseur
Chaque agent DOIT vérifier avant de terminer :
1. `wc -l` → target ±5%
2. Grep normative markers (MUST/SHOULD/NEVER/toujours/jamais/obligatoire/interdit) → count ≥ original
3. Tous les liens Read/See Also préservés

### Secondaire : cc-hub copilot diff review
Pour chaque vague, cc-hub copilot examine le diff git avec instruction semantic-depth : vérifier reasoning chains, pas juste les faits.

### Mesure : wc -l before/after
Objectif total : ~13 000 → ~10 000 lignes (-23%).

## Infrastructure post-compression

Après chaque vague (via warden task) :
1. Mettre à jour `design/index.yaml` (last_reviewed)
2. `bun run scripts/build-index.ts` — régénérer `compiled-index.txt`
3. `date +%Y-%m-%d > .last-updated` — signaler freshness aux projets consommateurs

Après toutes les vagues :
4. Auditer `design/index.yaml` : vérifier que `description`, `use_when`, `questions_answered` restent exactes
5. `domain-catalog.md` : pas d'update nécessaire (in-place, pas de création/suppression/renommage)

## Rollback

- Commit unique par vague → revert granulaire par vague
- Si cc-hub copilot détecte perte sémantique : `git revert` du commit de vague, ré-exécuter agents des fichiers problématiques avec compression plus conservatrice
- Ne pas passer à la vague suivante tant que la vague courante n'est pas validée

## Hors scope

- Créer de nouveaux fichiers partagés (shared-refs.md etc.)
- Modifier la structure de répertoires
- Modifier le pipeline build-conventions.ts
- Compresser les fichiers hors design/ (code-conventions, copywriting, etc. — vague future possible)
