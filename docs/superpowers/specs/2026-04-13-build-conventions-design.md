# Design — Nouveau système de conventions déterministe

**Date :** 2026-04-13
**Statut :** Approuvé

---

## Problème

L'agent `ai-res-librarian` (modèle Haiku) synthétise les conventions lors de `conventions-init`. Cette synthèse est lossy : des règles entières sont omises (ex: JSDoc dans `javascript.md`). Le système est non-déterministe et dépendant de la qualité de sortie d'un LLM.

## Solution

Remplacer la synthèse LLM par une **compilation déterministe** : le script lit les fichiers sources, résout les dépendances, concatène le contenu brut, écrit les fichiers de sortie. Zéro LLM dans la phase d'écriture.

---

## Architecture

```
conventions-init (Phase 1-3: détection stack + confirmation)
    ↓
    liste de domaines : { code: [nextjs, drizzle, testing], legal: [...], ... }
    ↓
scripts/build-conventions.ts
    ↓
.conventions/
  ├── index.md
  ├── code.md
  ├── legal.md        (si détecté)
  ├── pricing.md      (si détecté)
  ├── design.md       (si détecté)
  ├── architecture.md (si détecté)
  └── conventions.manifest.json
```

---

## Composant 1 — Frontmatter `extends` dans code-conventions

Chaque fichier `code-conventions/*.md` déclare ses parents :

```yaml
---
extends: [javascript]
---
```

**Mapping complet :**

| Fichier | extends |
|---------|---------|
| `general.md` | `[]` (racine) |
| `javascript.md` | `[general]` |
| `react.md` | `[javascript]` |
| `nextjs.md` | `[react]` |
| `astro.md` | `[javascript]` |
| `tanstack.md` | `[react]` |
| `shadcn.md` | `[react, tailwind]` |
| `tailwind.md` | `[javascript]` |
| `cloudflare.md` | `[javascript]` |
| `remotion.md` | `[react]` |
| `cli.md` | `[javascript]` |
| `go.md` | `[general]` |
| `rust.md` | `[general]` |
| `python.md` | `[general]` |
| `swift-kotlin.md` | `[general]` |
| `delphi.md` | `[general]` |
| `database.md` | `[]` (indépendant) |
| `drizzle.md` | `[javascript, database]` |
| `prisma.md` | `[javascript, database]` |
| `testing.md` | `[]` (transversal) |
| `logging.md` | `[]` (transversal) |
| `architecture.md` | `[]` (transversal) |
| `runtime-configs.md` | `[]` (transversal) |

**Résolution de conflits :** ordre left-to-right dans `extends`, dernier prime. `extends: [react, tailwind]` = tailwind écrase react si conflit sur le même sujet.

**Note :** avec ce graphe, `general` est hérité automatiquement par les fichiers langage/framework, et `database` est hérité automatiquement par `drizzle` et `prisma`. `testing`, `logging`, `architecture` et `runtime-configs` restent des fichiers transversaux explicites : ils doivent être ajoutés au domaine `code` quand ils sont détectés.

---

## Composant 2 — `scripts/build-conventions.ts`

### Interface CLI

```
bun run scripts/build-conventions.ts <project-dir> <domains-json>
```

`domains-json` = JSON stringifié passé par `conventions-init` :

```json
{
  "code": ["nextjs", "drizzle", "tanstack"],
  "legal": ["cgu-saas-type", "rgpd-obligations", "cookie-policy"],
  "pricing": ["freemium"],
  "design": ["web-standards", "colors", "forms", "navigation"]
}
```

### Algorithme — domaine code (graphe)

```
Pour chaque item dans domains.code :
  résoudre(item, visited=Set, inProgress=Set):
    if visited.has(item) → return
    if inProgress.has(item) → warn("cycle") + return
    inProgress.add(item)
    for dep of readExtends(item): résoudre(dep)
    inProgress.delete(item)
    visited.add(item)     ← Set maintient l'ordre d'insertion

concat dans l'ordre du Set → code.md
```

### Algorithme — autres domaines (liste plate)

```
Pour chaque fichier dans domains.legal :
  lire le contenu de legal/<fichier>.md
  concaténer avec séparateur

→ legal.md
```

### Séparateur entre fichiers

```markdown
---
<!-- source: code-conventions/react.md -->
---
```

Permet traçabilité et navigation dans le fichier final.

### Output — `conventions.manifest.json`

```json
{
  "generated": "2026-04-13",
  "project": "monprojet",
  "aiResourcesPath": "~/projects/ai-ressources",
  "domains": {
    "code": {
      "file": ".conventions/code.md",
      "sources": [
        "code-conventions/general.md",
        "code-conventions/javascript.md",
        "code-conventions/react.md",
        "code-conventions/nextjs.md",
        "code-conventions/drizzle.md",
        "code-conventions/tanstack.md"
      ],
      "hashes": {
        "code-conventions/general.md": "a3f9c2...",
        "code-conventions/javascript.md": "b1e4d7..."
      },
      "outputHash": "c5a2f1..."
    },
    "legal": { ... }
  }
}
```

### Output — `index.md`

```markdown
---
generated: 2026-04-13
project: monprojet
---

# Conventions — monprojet

| Domaine | Fichier | Charger quand |
|---------|---------|---------------|
| Code | [code.md](code.md) | Écrire du code, nommage, types, tests, logging |
| Legal | [legal.md](legal.md) | Pages CGU, RGPD, politique cookies |
| Pricing | [pricing.md](pricing.md) | Page pricing, modèles de facturation |

## Règle de priorité
Dans `code.md` : règle du fichier fils prime sur celle du parent. Ordre de concat : general → javascript → react → nextjs.
```

---

## Composant 3 — Modifications `conventions-init`

### Phase 4 — complètement réécrite

**Avant :** dispatch d'agents `ai-res-librarian` par catégorie → synthèse → assemblage

**Après :**
1. Construire le JSON des domaines détectés (Phases 1-3 inchangées)
2. Appeler `bun run scripts/build-conventions.ts <cwd> <domains-json>`
3. Le script écrit tous les fichiers

Phase 4.0 (project context block) → **supprimée**  
Phase 4.1 (dispatch agents) → **remplacée par l'appel script**  
Phase 4.2 (assemble file) → **géré par le script**  
Limite 400 lignes → **supprimée**

---

## Composant 4 — Modifications `conventions-refresh`

### Nouveau comportement

```
conventions-refresh :
  1. Cherche .conventions/conventions.manifest.json
  2. Si absent → auto-full (migration transparente)
  3. Si présent :
     Pour chaque domaine dans manifest.domains :
       hash actuel des sources == manifest.hashes ?
       → Oui : skip
       → Non : rebuild ce domaine via build-conventions.ts (domaine seul)
  4. Met à jour le manifest

conventions-refresh --full :
  Re-exécute conventions-init Phases 1-4 sans phase de confirmation interactive
  (équivalent conventions-init sur projet existant)
```

---

## Composant 5 — Modifications `conventions-preload.md`

**Avant :** "Read `.conventions/conventions.md`"

**Après :**
```
Avant de coder, designer ou produire :
1. Read `.conventions/index.md`
2. Identifier le domaine pertinent pour la tâche en cours
3. Read le fichier domaine correspondant (code.md pour du code, legal.md pour du légal, etc.)

Subagents : inclure le contenu du fichier domaine pertinent dans le prompt.
Freshness : si pas de manifest → suggérer /conventions-refresh une fois.
```

---

## Composant 6 — Suppression `ai-res-librarian`

Fichier `.claude/agents/ai-res-librarian.md` → **supprimé**.

Le skill `/ai-res` continue d'exister pour les requêtes ad-hoc hors-projet. Il identifie les fichiers pertinents via le compiled-index et les concatène directement (sans spawner d'agent).

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `scripts/build-conventions.ts` | Créer |
| `code-conventions/*.md` (23 fichiers) | Ajouter frontmatter `extends` |
| `.agent-sync/skills/conventions-init/SKILL.md` | Réécrire Phase 4 |
| `.agent-sync/skills/conventions-refresh/SKILL.md` | Réécrire entièrement |
| `claude/rules/conventions-preload.md` | Réécrire |
| `claude/skills/ai-res/SKILL.md` | Supprimer références à librarian |
| `.claude/agents/ai-res-librarian.md` | Supprimer |
| `package.json` | Inchangé |

---

## Edge cases

- **Cycle dans extends :** warn + skip le fichier cyclique. Ne pas crasher.
- **Fichier source manquant :** warn + continuer. Conserver une trace dans le manifest via le hash `"missing"`.
- **Domaine vide (0 fichiers détectés) :** ne pas créer le fichier domaine, ne pas l'ajouter à l'index.
- **Projet sans `.conventions/` :** le script le crée.
