# Plan: Compression des conventions design

**Spec:** **Read** [`design-conventions-compression-design.md`](../specs/2026-04-13-design-conventions-compression-design.md)
**Date:** 2026-04-13
**Objectif:** ~13 000 → ~10 000 lignes (-23%) sans perte d'information sémantique
**Branche:** `compress/design-conventions`

## Modèle d'exécution

- Subagents parallèles (max 6 simultanés) écrivent les fichiers compressés **sans commiter**
- Un "warden" post-vague fait : index.yaml update + build-index.ts + .last-updated + commit unique par vague
- Validation cc-hub copilot après chaque vague commit

### Pré-requis : Glossaire terminologique

**AVANT toute compression**, extraire un glossaire de tous les termes nommés (noms de blocs, vues, patterns, composants) depuis les fichiers originaux. Ce glossaire est distribué à chaque subagent comme contrainte hard : aucun terme ne doit changer de nom.

### Auto-vérification par subagent

Chaque subagent DOIT avant de terminer :
1. `wc -l` du fichier → vérifier target ±5%
2. Grep normative markers (`MUST|SHOULD|NEVER|toujours|jamais|obligatoire|interdit`) → comparer count before/after → delta ≤ 0 interdit (aucun marker ne peut disparaître)
3. Vérifier que tous les `**Read**` et `See also` links sont préservés

### Rollback

Si cc-hub copilot détecte une perte sémantique dans un fichier :
1. `git revert` du commit de la vague concernée
2. Ré-exécuter les agents des fichiers problématiques avec compression plus conservatrice
3. Ne pas passer à la vague suivante tant que la vague courante n'est pas validée

---

## Phase 1 : Vague 1 — 8 fichiers >500 lignes

### Task 1.0 : Extraire glossaire terminologique
**Agent:** subagent read-only
**Action:** Lire les 8 fichiers originaux de la vague 1. Extraire tous les noms propres de composants, blocs, vues, patterns, tools. Sauvegarder dans `/tmp/compression-glossary.md`.

### Task 1.1 : Compresser `references/component-blocks-catalog.md` (1557 → ~1300)
**Fichier:** `design/references/component-blocks-catalog.md`
**Techniques:**
- Convertir les 60+ sections "Anatomy:" + numbered lists en tables compactes (Name | Elements | Layout)
- Fusionner variantes similaires en lignes de table
- Réduire blank lines de 2-3 à 1 entre sections
- Supprimer prose redondante dans les template patterns (garder code blocks seuls)
- Consolider "See also" en index unique en tête de fichier
**Contrainte:** Préserver tous les noms de blocs, catégories, et anatomies — termes du glossaire.

### Task 1.2 : Compresser `systems/cli-patterns.md` (1181 → ~960)
**Fichier:** `design/systems/cli-patterns.md`
**Techniques:**
- Fusionner les introductions de références CLI dupliquées (Wrangler/Vercel/Turborepo) en table comparative
- Merger table ANSI colors + "Usage sémantique" en une seule table
- Consolider les TUI architecture diagrams en template unique + instances
- Merger tables flags + verbs en une seule référence
- Supprimer trailing blank lines dans les code blocks
- Convertir "Règles :" répétées en liste unique par type de composant

### Task 1.3 : Compresser `references/app-views.md` (1152 → ~880)
**Fichier:** `design/references/app-views.md`
**Exécution:** SÉRIALISÉ avec Task 1.6 (cross-références mutuelles avec app-views-catalog)
**Techniques:**
- Compacter ASCII mockups (réduire padding interne, supprimer blank lines dans les box — vérifier alignement en monospace via terminal/VS Code)
- Fusionner "Éléments obligatoires" répétés en template réutilisé
- Merger "Conventions" inline avec les mockups au lieu de sections séparées
- Créer table "Status badge colors" unique au lieu de redéclarer dans chaque vue
- Intégrer checklist items dans leurs sections respectives

### Task 1.4 : Compresser `references/design-references.md` (932 → ~680)
**Fichier:** `design/references/design-references.md`
**Techniques:**
- Convertir les N structures entreprise identiques en tables structurées (Company | Mode | Audience | Accent | Signature)
- Condenser "Système de design" tables en notation compacte (BG: #000, Accent: #00FF00)
- Fusionner signatures visuelles en single-line format
- Supprimer sections "Cohérence landing ↔ app" séparées — intégrer le rating dans la description app
- Éliminer le "Tableau comparatif" de fin qui duplique les données des sections détaillées

### Task 1.5 : Compresser `references/devtools.md` (776 → ~610)
**Fichier:** `design/references/devtools.md`
**Techniques:**
- Consolider 26 instances "Read [file]" en un seul index de références en tête
- Fusionner 4 palettes de couleurs (Axiom/Grafana/Portainer/Railway) en une table unique
- Merger sections "Règles" redondantes en listes imbriquées
- Réduire blank lines excessives
- Standardiser labels ("Ce qui est exemplaire :" → format consistant)

### Task 1.6 : Compresser `references/app-views-catalog.md` (639 → ~495)
**Fichier:** `design/references/app-views-catalog.md`
**Exécution:** SÉRIALISÉ après Task 1.3 (partage du manifest de noms de vues)
**Techniques:**
- Convertir 27 définitions de vues (Purpose → Blocks → Layout → Mobile → Wireframe) en table
- Consolider traits en table unique (Trait | Views Added | Blocks Used | Notes)
- Convertir 9 app patterns en table (Pattern | Views | Traits | Navigation | Shorthand)
- Dédupliquer les 12 références wireframe identiques en footnote unique
- Compacter le changelog

### Task 1.7 : Compresser `references/app-ui.md` (608 → ~480)
**Fichier:** `design/references/app-ui.md`
**Techniques:**
- Consolider les 10 "Règle :" en liste de règles groupée
- Convertir les 4 sections domaine (E-commerce/Fintech/Healthcare/AI) en table (Domain | Key Views | Conventions | Navigation)
- Créer template "anatomy" réutilisable pour Event Timeline, Modal Layout, Settings
- Réduire blank lines (~25 lignes)
- Merger checklists dans leurs sections respectives

### Task 1.8 : Compresser `references/mockup-specs.md` (512 → ~420)
**Fichier:** `design/references/mockup-specs.md`
**Techniques:**
- Créer section "Anatomy Template" unique, référencer dans chaque composant
- Consolider 6 tables "Propriété | Valeur" en tables groupées par catégorie
- Convertir notes verbose en footnotes numérotées
- Dédupliquer "Règle" paragraphes en liste consolidée
- Supprimer cross-references footer redondant

### Task 1.9 : Checkpoint terminologique post-vague 1
**Agent:** subagent read-only
**Action:** Comparer le glossaire original (Task 1.0) avec les termes dans les 8 fichiers compressés. Lister tout changement. Vérifier cohérence des cross-références inter-fichiers.

### Task 1.10 : Warden — commit + index
**Action séquentielle:**
1. `git add` des 8 fichiers compressés
2. Mettre à jour `design/index.yaml` (last_reviewed → today)
3. `bun run scripts/build-index.ts`
4. `date +%Y-%m-%d > .last-updated`
5. Commit unique : "compress(design): wave 1 — 8 files >500 lines"

### Task 1.11 : Validation vague 1
**Agent:** cc-hub copilot
**Prompt:** "Ce diff compresse 8 fichiers de conventions design. Pour chaque fichier, vérifie qu'aucune information sémantique n'a été perdue — règles (MUST/SHOULD/NEVER), valeurs, qualificateurs (quand/si/sauf), chaînes de raisonnement (parce que/car/afin de), cross-références. Vérifie spécifiquement que les reasoning chains sont préservées, pas seulement les faits. Signale toute perte."
**Mesure:** `wc -l` before/after

---

## Phase 2 : Vague 2 — 9 fichiers 300-500 lignes

### Tasks 2.1-2.9 : Compresser les 9 fichiers moyens
**Exécution:** 3 batches de 3 subagents parallèles

**Batch A (parallèle):**
- 2.1: `components/payment-flows.md` (479 → ~350)
  - Compacter state diagrams box-drawing en notation simplifiée
  - Fusionner error handling table + conventions list (contenu similaire)
  - Convertir les 4 flows (Tip/Subscription/Purchase/Express) steps en table (Flow | Steps | Key Rules)
  - Extraire header/footer rules partagées en section unique
- 2.2: `components/data-visualization.md` (452 → ~355)
  - Fusionner terminal/web "Rules" en matrice comparative unique
  - Dédupliquer semantic color explanations (texte + table → table seule)
  - Créer section "chart anatomy" unique référencée par chaque type
  - Merger responsive design rules dupliquées
- 2.3: `components/log-viewer.md` (448 → ~320)
  - Fusionner Terminal/Web anatomy sections (80% identique) en table avec colonne platform
  - Unifier niveaux/signalétique table (variantes légères → footnotes)
  - Merger edge cases + error states en matrice unique (état × platform)
  - Consolider error communication rules

**Batch B (parallèle):**
- 2.4: `references/landing-pages.md` (423 → ~290)
  - Créer "Landing Page Convention Matrix" unique au lieu de 7 sections per-product (70% overlap)
  - Template "Structure hero typique" avec placeholders par type
  - Checklist master unique avec callouts type-specific
  - Extraire social proof + CTA hierarchy en section partagée
- 2.5: `quality/accessibility.md` (385 → ~310)
  - Fusionner 4 testing checklists (keyboard/screen reader/automated/contrast) en Testing Matrix
  - Dédupliquer contrast ratio info (intro table + détail → single source)
  - Remplacer descriptions dupliquées (button states, focus) par cross-refs vers fichiers composants
  - Lien WCAG standard pour critères au lieu de re-lister les noms
- 2.6: `components/feedback.md` (379 → ~270)
  - Créer template structure (Anatomy→Behavior→Implementation) unique référencé par Toast/Tooltip/Confirmation
  - Table "Platform Implementation Comparison" unique (rows = components, cols = platform)
  - Consolider animation specs en section "Motion rules" unique
  - Merger size matrices (spinners, avatars, badges) en "Component Sizing Reference"

**Batch C (parallèle):**
- 2.7: `components/buttons.md` (378 → ~260)
  - Créer "Size Matrix Reference" unique (actuellement en triple)
  - Master table des states (default/hover/active/focus/disabled/loading) applicable à tous
  - Merger platform equivalents en table unique (size variant × iOS × Android × Web)
  - Convertir per-component "Rules" en catégories de règles
- 2.8: `components/lists.md` (367 → ~270)
  - Extraire "List Component Anatomy Reference" unique
  - Consolider keyboard navigation en section référence unique
  - Créer "Empty States Matrix" partagée
  - Merger platform library tables en "Libraries by Platform & Pattern"
- 2.9: `components/navigation.md` (299 → ~230)
  - Créer "Responsive Breakpoint Matrix" (breakpoint × component type)
  - Template "Property Specification" unifié au lieu de per-component tables
  - Consolider "When to use" en decision tree unique
  - Table cross-platform unique (pattern × iOS × Android × Web)

### Task 2.10 : Warden — commit + index
Même protocole que Task 1.10.

### Task 2.11 : Validation vague 2
**Agent:** cc-hub copilot — même prompt semantic-depth que Task 1.11
**Mesure:** `wc -l` before/after

---

## Phase 3 : Vague 3 — 14 petits fichiers + nettoyage global (~895 lignes → ~750)

### Tasks 3.1-3.4 : Compresser les petits fichiers (2 batches de 4 + 2 batches de 3)

**Batch A:** 
- `components/email-templates.md` (278) — Merger template patterns, blank lines
- `components/realtime-streams.md` (211) — Consolider rules sections, blank lines
- `tokens/motion.md` (211) — Merger duration/easing tables, blank lines
- `quality/ui-rules.md` (254) — Consolider rules dupliquées

**Batch B:**
- `components/modals.md` (147) — Blank lines, merge anatomy/behavior
- `systems/material-design.md` (149) — Blank lines, compact tables
- `systems/web-standards.md` (144) — Blank lines, consolidate
- `systems/apple-hig.md` (135) — Blank lines, compact

**Batch C:**
- `components/forms.md` (125) — Blank lines, merge validation rules
- `tokens/cross-platform.md` (99) — Blank lines
- `tokens/colors.md` (105) — Compact tables
- `tokens/typography.md` (88) — Compact tables

**Batch D:**
- `tokens/spacing.md` (69) — Minimal compression (blank lines only)

**Technique commune:** Réduire blank lines, tables quand applicable, merge sections dupliquées.

### Task 3.5 : Nettoyage global
- Vérifier cohérence terminologique entre vagues 1/2/3
- Dernière passe blank lines sur tous les 31 fichiers
- Vérifier intégrité ASCII diagrams en monospace (terminal cat)

### Task 3.6 : Warden — commit + index
Même protocole que Task 1.10.

### Task 3.7 : Validation vague 3
**Agent:** cc-hub copilot — même prompt semantic-depth

---

## Phase 4 : Infrastructure finale

### Task 4.1 : Régénérer compiled-index.txt (déjà fait par wardens, vérification finale)
```bash
bun run scripts/build-index.ts
```

### Task 4.2 : Auditer index.yaml
Vérifier que `description`, `use_when`, `questions_answered` dans `design/index.yaml` reflètent toujours le contenu compressé. Mettre à jour si nécessaire.

### Task 4.3 : Mesure finale
`wc -l` total design/ — objectif : ≤ 10 500 (stretch : ≤ 10 000).

---

## Dépendances

```
Task 1.0 (glossaire)
→ Task 1.1, 1.2, 1.4, 1.5, 1.7, 1.8 (parallèle, 6 agents)
→ Task 1.3 (app-views) → Task 1.6 (app-views-catalog) [sérialisé]
→ Task 1.9 (checkpoint terminologie)
→ Task 1.10 (warden commit)
→ Task 1.11 (validation copilot)
→ Task 2.1-2.3 (batch A) → 2.4-2.6 (batch B) → 2.7-2.9 (batch C)
→ Task 2.10 (warden) → Task 2.11 (validation)
→ Task 3.1-3.4 (batches) → Task 3.5 (nettoyage) → Task 3.6 (warden) → Task 3.7 (validation)
→ Task 4.1-4.3 (infrastructure)
```

## Critères de succès

- [ ] Total design/ ≤ 10 500 lignes (stretch : ≤ 10 000)
- [ ] cc-hub copilot valide chaque vague sans perte sémantique
- [ ] `bun run scripts/build-index.ts` passe sans erreur
- [ ] Glossaire terminologique cohérent entre toutes les vagues
- [ ] Normative markers count ≥ original pour chaque fichier
- [ ] Tous les cross-références (Read, See Also) restent fonctionnels
- [ ] Branche `compress/design-conventions` prête à merge
