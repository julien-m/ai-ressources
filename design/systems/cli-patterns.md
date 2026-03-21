# CLI Patterns

Conventions de design pour interfaces en ligne de commande : couleurs, typographie, composants, feedback, erreurs et TUI.
Basé sur l'analyse de : Claude Code, GitHub CLI, Vercel CLI, Stripe CLI, Bun, pnpm, Turborepo, Vite.

> Voir aussi : **Read** [`../tokens/colors.md`](../tokens/colors.md) (mapping couleurs sémantiques), **Read** [`../tokens/motion.md`](../tokens/motion.md) (timing spinners/animations), **Read** [`../tokens/typography.md`](../tokens/typography.md) (polices monospace)

---

## Philosophie fondatrice du bon design CLI

Une CLI n'est pas une interface dégradée d'une app graphique. C'est un médium à part entière avec ses propres règles. Les meilleures CLIs partagent trois principes :

**1. Signal/bruit maximal.** Chaque ligne affichée doit mériter sa place. Une CLI bavarde est une CLI qu'on apprend à ignorer — ce qui est le pire résultat possible.

**2. Feedback immédiat et progressif.** L'utilisateur ne doit jamais se demander si la commande tourne encore. Un spinner, une progress bar, ou simplement un log régulier signale que le processus est vivant.

**3. Erreurs actionnables.** Un message d'erreur qui dit quoi faire est dix fois plus utile qu'un message qui dit ce qui s'est passé.

---

## Les références et ce qu'elles font mieux que les autres

### Claude Code

Claude Code est la CLI la mieux designée de l'écosystème AI en 2026. Elle a résolu un problème unique : afficher des conversations longues, du code, des diffs et des états de progression dans un terminal sans créer de chaos visuel.

**Ce qui est exemplaire :**

- **Groupement sémantique** : les actions sont regroupées visuellement par contexte (lecture de fichier, écriture, exécution de commande). Chaque groupe a son propre "bloc" avec une ligne d'en-tête et un contenu indenté.
- **Indicateurs d'état en ligne** : `✓` (succès), `⚡` (en cours), `✗` (erreur) — toujours en début de ligne, jamais noyés dans le texte.
- **Coût token visible** : affichage du contexte utilisé et du coût estimé en bas de chaque réponse — transparence totale sur la consommation.
- **Diffs colorés** : vert pour les ajouts (`+`), rouge pour les suppressions (`-`), gris pour le contexte. Standard git, immédiatement lisible.
- **Input multi-ligne** : la zone de saisie est clairement délimitée, différente visuellement du reste de l'output.
- **Couleur sobre** : pas de couleurs flashy. Blanc/gris pour l'output standard, cyan pour les titres de section, vert/rouge uniquement pour les états.

**Palette Claude Code :**
```
Texte standard    : blanc #FFFFFF / gris clair
Titres sections   : cyan #00D7FF
Succès            : vert #00FF00 ou #22C55E
Erreur            : rouge #FF4444 ou #EF4444
Warning           : jaune #FFAA00
Info / metadata   : gris #888888
Code              : blanc sur fond légèrement plus sombre
Diff ajout (+)    : vert #22C55E sur fond vert très sombre
Diff suppression  : rouge #EF4444 sur fond rouge très sombre
```

---

### GitHub CLI (`gh`)

La référence absolue en termes d'UX CLI. `gh` a été conçu par une équipe qui a pensé chaque interaction.

**Ce qui est exemplaire :**

- **Output adaptatif** : si l'output est plus long que le terminal, `gh` ouvre automatiquement un pager (less). Si l'output est court, il s'affiche directement. L'utilisateur n'a jamais à gérer ce détail.
- **Tableaux alignés** : `gh pr list` affiche un tableau parfaitement aligné avec des colonnes de largeur dynamique (adaptées au contenu réel).
- **Couleurs sémantiques cohérentes** : vert = ouvert/actif, rouge = fermé/rejeté, violet = merged, gris = brouillon. Ces couleurs sont identiques à celles de GitHub.com — cohérence landing <> app absolue.
- **Confirmation interactive** : pour les actions destructives, `gh` demande une confirmation avec un prompt Y/n, la valeur par défaut clairement indiquée par la casse.
- **`--json` flag universel** : chaque commande peut retourner du JSON structuré. Toujours. Sans exception. Parfait pour le scripting.
- **Messages d'erreur avec suggestion** : si une commande échoue, `gh` suggère souvent la commande correcte ("Did you mean `gh pr view`?").

**Output type `gh pr list` :**
```
Showing 3 of 3 open pull requests in owner/repo

ID   TITLE                         BRANCH        CREATED
#42  feat: add dark mode support   feature/dark  about 2 hours ago
#38  fix: memory leak in parser    fix/memory    about 1 day ago
#31  docs: update README           docs/readme   about 3 days ago
```

---

### Vercel CLI

**Ce qui est exemplaire :**

- **Startup screen** : à chaque `vercel deploy`, un résumé clair de ce qui va se passer (projet, environnement, région) avant que quoi que ce soit ne commence.
- **Progress en temps réel** : chaque étape du déploiement s'affiche avec son statut et sa durée. Les étapes terminées restent visibles (pas de clear écran).
- **URL finale proéminente** : à la fin d'un déploiement réussi, l'URL est affichée en grand, facile à copier.
- **Cohérence avec le dashboard web** : les termes utilisés dans la CLI sont exactement les mêmes que dans le dashboard Vercel.

**Output type `vercel deploy` :**
```
Vercel CLI 39.1.0
? Set up and deploy "~/projects/my-app"? [Y/n] y
? Which scope do you want to deploy to? My Team
? Link to existing project? [y/N] n
? What's your project's name? my-app
? In which directory is your code located? ./

Auto-detected Project Settings (Next.js):
- Build Command: next build
- Development Command: next dev --port $PORT
- Install Command: `yarn install`, `npm install`, or `pnpm install`
- Output Directory: Next.js default

  Inspect: https://vercel.com/team/my-app/xyz [2s]
  Preview: https://my-app-git-main-team.vercel.app [45s]
  Deployed to production. Run `vercel --prod` to overwrite later.
```

---

### Stripe CLI

**Ce qui est exemplaire :**

- **Listen mode** : `stripe listen --forward-to localhost:3000` maintient une connexion active et affiche chaque webhook reçu en temps réel avec son type, son ID et son statut HTTP de réponse.
- **Coloration des méthodes HTTP** : GET en bleu, POST en vert, DELETE en rouge — convention universelle bien appliquée.
- **IDs en monospace** : les IDs Stripe (evt_xxx, pi_xxx) sont toujours affichés en monospace gris, clairement distincts du texte normal.
- **Timestamps précis** : chaque ligne de log commence par un timestamp HH:MM:SS en gris.

**Output type `stripe listen` :**
```
> Ready! Your webhook signing secret is whsec_xxx (^C to quit)
2026-03-21 14:23:45  --> payment_intent.created [evt_xxx]
2026-03-21 14:23:45 <--  [200] POST http://localhost:3000/webhook [evt_xxx]
2026-03-21 14:23:46  --> payment_intent.succeeded [evt_xxx]
2026-03-21 14:23:46 <--  [200] POST http://localhost:3000/webhook [evt_xxx]
```

---

### Bun CLI

**Ce qui est exemplaire :**

- **Vitesse comme identité** : Bun affiche toujours le temps d'exécution en fin de commande. Ce n'est pas anecdotique — c'est la promesse de la marque traduite en output CLI.
- **Minimalisme radical** : `bun install` affiche exactement ce dont on a besoin, rien de plus. Pas de barres de progression inutiles si l'install prend moins de 500ms.
- **Couleurs marque** : le rose/magenta de Bun est cohérent entre le logo, le site et la CLI.

**Output type `bun install` :**
```
bun install v1.1.0 (885e4ede)

+ express@4.18.2

1 packages installed [312ms]
```

---

### pnpm

**Ce qui est exemplaire :**

- **Progress bar multi-packages** : lors d'un install, pnpm affiche plusieurs progress bars simultanées (une par package en cours) — claire, non chaotique.
- **Résolution séparée de l'installation** : deux phases distinctes affichées (Resolving puis Downloading) ce qui donne une idée précise de où en est l'opération.
- **Deduplication visible** : pnpm affiche explicitement le nombre de packages dédupliqués — un signal fort de son modèle de stockage.

---

### Turborepo

**Ce qui est exemplaire :**

- **Groupement de tasks par package** : dans un monorepo, chaque package a son propre bloc d'output clairement délimité.
- **Cache hit très visible** : quand une task est servie depuis le cache, Turborepo affiche `FULL TURBO` en couleur vive. Le cache est une feature, pas un détail d'implémentation.
- **Summary final** : à la fin d'une run, un tableau récapitulatif (tasks réussies, échouées, cachées, durée totale) donne une vue d'ensemble immédiate.

**Output type `turbo build` :**
```
 Packages in scope: web, docs, ui
 Running build in 3 packages
 Remote caching disabled

web:build: cache miss, executing...
docs:build: cache hit, replaying output...
ui:build: cache miss, executing...

web:build: > next build
web:build: - info Creating an optimized production build...
docs:build: > next build [CACHED]

Tasks:    3 successful, 3 total
Cached:   1 cached, 3 total
Time:     4.231s >>> FULL TURBO
```

---

### Vite

**Ce qui est exemplaire :**

- **Startup screen** : le plus élégant de l'écosystème frontend. Logo ASCII + version + URLs locales/réseau clairement séparées.
- **Hot reload silencieux** : Vite ne spamme pas le terminal à chaque HMR update. Il affiche un `[vite] hmm update /src/App.tsx` discret et passe à autre chose.
- **Erreurs de build contextualisées** : ligne du fichier, extrait du code avec la ligne incriminée surlignée, message d'erreur clair.

**Output type `vite` :**
```
  VITE v5.0.0  ready in 243 ms

  ->  Local:   http://localhost:5173/
  ->  Network: http://192.168.1.42:5173/
  ->  press h + enter to show help
```

---

### Wrangler (Cloudflare CLI)

Wrangler est la CLI officielle pour développer et déployer sur Cloudflare Workers, Pages, D1, R2, KV, Durable Objects. Référence pour tout projet edge-native.

**Ce qui est exemplaire :**

- **Startup dev server très lisible** : version + séparateur + bindings détectés + box de raccourcis interactifs.
- **Préfixe de source sur chaque log** : `[wrangler:inf]`, `[wrangler:wrn]`, `[wrangler:err]`, `[mf:wrn]` (miniflare). Les logs sans préfixe viennent du code utilisateur. Convention excellente pour séparer outil / app.
- **Deploy output structuré** : taille + gzip + temps d'upload + URL finale.
- **Tail en production** : chaque requête = `METHOD URL - Status @ timestamp`, les `console.log` / `console.error` du Worker sont indentés en dessous avec préfixe `(log)` / `(error)`.
- **Bindings listing au démarrage** : D1, KV, R2 listés avec leur stockage local — l'utilisateur sait que tout est connecté avant de développer.
- **Migrations D1** : tableau des migrations pending + confirmation Y/n avant apply.
- **Secret management** : saisie masquée (dots), confirmation visuelle.

**Output type `wrangler dev` :**
```
 ⛅️ wrangler 3.x.x
─────────────────────────────────────
⎔ Starting local server...

[wrangler:inf] Ready on http://localhost:8787
[wrangler:inf] - http://127.0.0.1:8787
╭────────────────────────────────────────────╮
│  [b] open a browser, [d] open Devtools,    │
│  [l] turn off local mode, [c] clear console│
│  [x] to exit                               │
╰────────────────────────────────────────────╯
```

**Output type `wrangler tail` :**
```
Successfully created tail, now streaming logs from my-worker...

GET https://my-worker.workers.dev/ - Ok @ 2026-03-21T14:23:45Z
  (log) User authenticated: user_42
  (log) Cache hit: product:123

POST https://my-worker.workers.dev/api/data - Ok @ 2026-03-21T14:23:46Z
  (log) Processing payload: 1.2KB

GET https://my-worker.workers.dev/health - Ok @ 2026-03-21T14:23:47Z
  (error) TypeError: Cannot read property 'id' of undefined
    at Object.<anonymous> (worker.js:42:18)
```

**Output type `wrangler deploy` :**
```
⛅️ wrangler 3.x.x
─────────────────────────────────────
Total Upload: 45.21 KiB / gzip: 12.34 KiB
Worker Startup Time: 5 ms
Uploaded my-worker (2.34 sec)
Published my-worker (0.45 sec)
  https://my-worker.my-subdomain.workers.dev

Current Deployment ID: abc123def456
```

**Bindings listing :**
```
[wrangler:inf] D1 Databases:
[wrangler:inf]   my-db  (local)  → .wrangler/state/v3/d1/

[wrangler:inf] KV Namespaces:
[wrangler:inf]   MY_KV  → .wrangler/state/v3/kv/

[wrangler:inf] R2 Buckets:
[wrangler:inf]   my-bucket  → .wrangler/state/v3/r2/
```

**Migrations D1 :**
```
Migrations to be applied:
┌─────────────────────────────────────────┐
│ name                                    │
├─────────────────────────────────────────┤
│ 0001_create_users.sql                   │
│ 0002_add_sessions.sql                   │
└─────────────────────────────────────────┘

? Apply 2 pending migration(s) to my-db (local)? » (Y/n)

✅ Applied migration 0001_create_users.sql
✅ Applied migration 0002_add_sessions.sql
```

**Palette Wrangler :**
```
Icône principale  : ⛅️ (signature Cloudflare)
Séparateur        : ─────────────────── (ligne U+2500)
Succès            : ✨ (sparkle) ou ✅
En cours          : 🌀 (spinning globe)
Upload/réseau     : 🌍
Info              : [wrangler:inf] en gris
Warning           : [wrangler:wrn] en jaune
Erreur            : [wrangler:err] en rouge
```

Wrangler utilise les emojis de façon cohérente et modérée — pas décoratif, chaque emoji a une signification précise.

**Patterns réutilisables de Wrangler pour vos CLIs :**

- **Bindings listing au démarrage** : toujours afficher les ressources détectées au lancement (DB, cache, storage) — l'utilisateur doit savoir que tout est connecté.
- **Préfixe de source `[tool:level]`** : excellent pour séparer les logs de l'outil des logs de l'application de l'utilisateur.
- **Tail groupé par requête** : le format `METHOD URL - Status @ timestamp` + logs indentés est une convention lisible et dense pour le streaming de production.
- **Confirmation avant apply** : pour les migrations ou opérations modifiant des données, afficher un tableau de ce qui va se passer, puis Y/n.
- **`--format json` universel** : toujours prévoir pour le scripting et l'intégration.

---

## Système de couleurs ANSI

> Mapping vers les rôles sémantiques : voir **Read** [`../tokens/colors.md`](../tokens/colors.md)

### Couleurs de base (compatibles tous terminaux)

```
Noir        \x1b[30m   Fond noir   \x1b[40m
Rouge       \x1b[31m   Fond rouge  \x1b[41m
Vert        \x1b[32m   Fond vert   \x1b[42m
Jaune       \x1b[33m   Fond jaune  \x1b[43m
Bleu        \x1b[34m   Fond bleu   \x1b[44m
Magenta     \x1b[35m   Fond magenta\x1b[45m
Cyan        \x1b[36m   Fond cyan   \x1b[46m
Blanc       \x1b[37m   Fond blanc  \x1b[47m
Reset       \x1b[0m
Bold        \x1b[1m
Dim         \x1b[2m
```

### Usage sémantique — la convention universelle

| Contexte | Couleur | Rôle sémantique (tokens) | Usage |
|---|---|---|---|
| Succès | Vert | `success` | ✓ Opération réussie, fichier créé, test passé |
| Erreur | Rouge | `error` | ✗ Opération échouée, exception, validation failed |
| Warning | Jaune | `warning` | ⚠ Dépréciation, config manquante, comportement inattendu |
| Info | Cyan / Bleu | `info` | Information neutre, statut, URL |
| Metadata | Gris (Dim) | `on-surface-variant` | IDs, timestamps, chemins de fichiers, durées |
| Titre section | Cyan bold | `primary` | En-têtes de groupes, noms de steps |
| Code inline | Blanc sur fond sombre | `surface-variant` | Commandes, valeurs, noms de variables |
| Diff ajout | Vert | `success` | Lignes ajoutées (+) |
| Diff suppression | Rouge | `error` | Lignes supprimées (-) |
| Diff contexte | Gris | `on-surface-variant` | Lignes inchangées (contexte) |

### Règle des couleurs

**Ne jamais utiliser la couleur pour décorer — seulement pour signifier.**

Mauvais : afficher le nom du projet en bleu parce que c'est joli.
Bon : afficher "Error" en rouge parce que c'est une erreur.

**Toujours prévoir `NO_COLOR`** : si la variable d'environnement `NO_COLOR` est définie, désactiver toutes les couleurs. Standard industrie.

**Tester en 8 couleurs et en 256 couleurs.** Les terminaux basiques (CI, SSH) n'ont que 8 couleurs. Les couleurs RGB hex (#22C55E) ne fonctionnent que dans les terminaux modernes.

---

## Typographie CLI

> Polices monospace de référence par plateforme : voir **Read** [`../tokens/typography.md`](../tokens/typography.md)

Tout est monospace — mais les choix stylistiques restent nombreux.

### Hiérarchie visuelle sans police

```
# TITRE PRINCIPAL (uppercase + séparateur)
## Section (mixed case + espace avant)

Label standard :  valeur alignée
Label long     :  valeur alignée (espaces pour aligner les :)

  -> Sous-item indenté de 2 espaces
    -> Sous-sous-item indenté de 4 espaces

[info]    Message informatif
[warn]    Message d'avertissement
[error]   Message d'erreur
```

### Alignement des colonnes

Toujours aligner les tableaux sur la largeur du contenu réel, pas sur une largeur fixe.

```
# Mauvais — largeur fixe qui gaspille de l'espace
ID    TITLE                    STATUS
1     My task                  open
42    Another longer task      closed

# Bon — largeur dynamique
ID  TITLE                STATUS
1   My task              open
42  Another longer task  closed
```

### Troncature

Quand le contenu est trop long pour la largeur du terminal :
- Tronquer avec `…` (pas `...`) à la fin
- Priorité : ID > statut > date > titre (tronquer ce qui a le moins de valeur)
- Toujours afficher les colonnes critiques en entier

---

## Composants CLI

### Spinner

Utilisé pour les opérations dont on ne connaît pas la durée.

> Timing du spinner : utiliser le token `micro` (100ms) entre chaque frame — voir **Read** [`../tokens/motion.md`](../tokens/motion.md)

```
# Frames de base (compatibilité maximale)
⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏

# Frames simples (fallback)
- \ | /

# Pattern d'usage
⠋ Fetching dependencies...
⠙ Fetching dependencies...
✓ Fetched 142 dependencies in 2.3s
```

**Règles spinner :**
- Remplacer le spinner par ✓ ou ✗ à la fin (pas disparaître silencieusement)
- Toujours afficher ce que le spinner fait (pas juste un spinner seul)
- Pas de spinner pour les opérations < 100ms

### Progress bar

Utilisé pour les opérations dont on connaît la progression.

```
# Standard
Downloading  ████████████░░░░░░░░  60% (1.2 GB / 2.0 GB)

# Compact
[=====>    ] 50% Installing packages...

# Multi-tasks (Turborepo style)
web    ████████████████████ 100% build
docs   ████████░░░░░░░░░░░░  40% build
api    ██░░░░░░░░░░░░░░░░░░  10% build
```

**Règles progress bar :**
- Toujours afficher le % et/ou la valeur absolue
- Afficher le temps restant estimé si possible
- Largeur adaptative à la largeur du terminal

### Prompt interactif

Inspiré de `clack` — la meilleure librairie de prompts en 2026.

```
◆  What is your project name?
│  my-awesome-app
└

◆  Select a framework
│  ● Next.js
│  ○ Remix
│  ○ Astro
│  ○ SvelteKit
└

◆  Add TypeScript?
│  ○ Yes  ● No
└

◇  Project created successfully!
│
└  Run:  cd my-app && bun install
```

**Règles prompts :**
- Symboles `◆` (question active), `◇` (question répondue), `│` (guide vertical)
- Valeur par défaut clairement indiquée
- Navigation clavier : flèches pour les listes, Tab pour complétion, Ctrl+C pour annuler
- Ctrl+C -> message "Operation cancelled." propre (pas de stack trace)

### Table de données

```
┌─────────────────────────────────────────────────┐
│ Deployments                                     │
├────────────────┬───────────┬────────────────────┤
│ URL            │ Status    │ Created            │
├────────────────┼───────────┼────────────────────┤
│ my-app.vercel… │ ✓ Ready   │ 2 minutes ago      │
│ my-app-xyz.ve… │ ✓ Ready   │ 1 hour ago         │
│ my-app-abc.ve… │ ✗ Error   │ 2 hours ago        │
└────────────────┴───────────┴────────────────────┘
```

Ou version sans bordures (plus légère, style `gh`) :

```
DEPLOYMENT           STATUS    CREATED
my-app.vercel.app    Ready     2 minutes ago
my-app-xyz.vercel…   Ready     1 hour ago
my-app-abc.vercel…   Error     2 hours ago
```

### Messages de statut

```
# Succès
✓ Created project "my-app" in ./my-app
✓ Installed 142 packages in 1.23s

# Erreur
✗ Failed to connect to database
  -> Check that DATABASE_URL is set correctly
  -> Run `bun run db:check` to diagnose

# Warning
⚠ Deprecated: use `bun add` instead of `bun install`

# Info
i Using Node.js 20.11.0 (detected from .nvmrc)

# Tip (discret, gris)
  Tip: Run with --verbose for more details
```

### Diff

```
  src/components/Button.tsx

- import React from 'react'
+ import { forwardRef } from 'react'

  export const Button = ({ children, ...props }) => {
-   return <button className="btn" {...props}>{children}</button>
+   return (
+     <button
+       className="btn"
+       {...props}
+     >
+       {children}
+     </button>
+   )
  }
```

### Section groupée (style Claude Code)

```
● Reading file src/api/auth.ts...

  ╭─ src/api/auth.ts ──────────────────────────────╮
  │ export async function login(email, password) { │
  │   const user = await db.users.findOne(...)     │
  │   ...                                          │
  ╰────────────────────────────────────────────────╯

● Writing file src/api/auth.ts...

✓ File updated (3 changes)
```

---

## Structure et layout

### Anatomie d'une commande bien designée

```
[1] Ligne de démarrage
[2] Configuration détectée / contexte
[3] Steps en cours (avec spinner ou progress)
[4] Output de la commande
[5] Résumé final
[6] Prochaines étapes (optionnel)
```

Exemple complet :

```
[1] Deploying my-app to Vercel...

[2] Detected: Next.js 14.1.0
    Environment: Production
    Region: cdg1 (Paris)

[3] ⠋ Building...
    ✓ Built in 23s
    ⠋ Uploading...
    ✓ Uploaded 1,234 files

[4] Build output:
    Route (app)              Size    First Load JS
    ┌ ○ /                   5.3 kB  89.4 kB
    └ ○ /about              2.1 kB  86.2 kB

[5] ✓ Deployed to production in 31s
    URL: https://my-app.vercel.app

[6] Run `vercel logs` to see production logs
    Run `vercel rollback` to revert this deployment
```

### Verbosité progressive

```
# Mode normal (défaut)
✓ Deployed in 31s — https://my-app.vercel.app

# Mode verbose (--verbose)
[Afficher tout le détail des étapes]

# Mode silencieux (--quiet ou -q)
https://my-app.vercel.app

# Mode JSON (--json)
{ "url": "https://my-app.vercel.app", "status": "success", "duration": 31 }
```

**Règle :** toujours prévoir ces 4 modes. `--json` est indispensable pour l'automatisation.

### Largeur du terminal

```javascript
// Récupérer la largeur du terminal
const width = process.stdout.columns || 80

// Règles pratiques
// < 60 cols  : mode compact, pas de tableaux
// 60-100 cols : mode normal
// > 100 cols : on peut se permettre plus de colonnes
```

Ne jamais assumer 80 colonnes. Ne jamais dépasser la largeur du terminal.

---

## Gestion des erreurs

### Anatomie d'une bonne erreur CLI

```
✗ Error: Cannot connect to database

  Message    : Connection refused
  Host       : localhost:5432
  Timeout    : 5000ms

  Possible causes:
  -> PostgreSQL is not running
  -> Wrong DATABASE_URL in .env
  -> Firewall blocking port 5432

  To diagnose:
  $ pg_isready -h localhost -p 5432
  $ echo $DATABASE_URL
```

**Les 4 éléments d'une erreur actionnable :**
1. **Quoi** : ce qui s'est passé (court, en rouge)
2. **Contexte** : variables, valeurs, état au moment de l'erreur (gris)
3. **Pourquoi** : causes possibles (liste à puces)
4. **Comment** : commandes ou actions pour résoudre

### Exit codes

```
0  Succès
1  Erreur générale
2  Mauvaise utilisation de la commande (args invalides)
3  Erreur de configuration
4  Erreur réseau / timeout
5  Permission refusée
130 Interruption (Ctrl+C)
```

Toujours utiliser les exit codes corrects. Les scripts qui appellent votre CLI en dépendent.

### Gestion de Ctrl+C

```
# Mauvais
^C (curseur qui reste bloqué)

# Mauvais
^CError: process exited with signal SIGINT
    at process.<anonymous> (node:internal/...)
    at ...

# Bon
^C
✗ Operation cancelled.
```

Capturer SIGINT proprement, nettoyer les ressources, afficher un message court, exit avec code 130.

---

## Librairies recommandées (stack Bun/Node)

### Framework CLI complet

**`@clack/prompts`** — Les meilleurs prompts interactifs du marché en 2026. API propre, design opiniated mais excellent (les symboles ◆◇│ vus partout).

```typescript
import { intro, outro, text, select, confirm, spinner } from '@clack/prompts'

intro('create-my-app')

const name = await text({ message: 'Project name:', placeholder: 'my-app' })
const framework = await select({
  message: 'Framework:',
  options: [
    { value: 'next', label: 'Next.js' },
    { value: 'remix', label: 'Remix' },
  ]
})

const s = spinner()
s.start('Installing dependencies...')
await install()
s.stop('Installed successfully')

outro('Ready! Run: cd ' + name + ' && bun dev')
```

**`commander`** ou **`citty`** — Parsing des arguments et sous-commandes. `citty` est plus moderne (Nuxt team), `commander` est la référence établie.

### Couleurs et styles

**`chalk`** (Node) ou **`kleur`** (plus léger, Bun-friendly) — Couleurs ANSI.

```typescript
import chalk from 'chalk'

console.log(chalk.green('✓ Success'))
console.log(chalk.red('✗ Error'))
console.log(chalk.yellow('⚠ Warning'))
console.log(chalk.cyan.bold('-> Info'))
console.log(chalk.gray('  metadata'))
```

**`picocolors`** — Le plus léger (0 dépendances), suffisant pour la plupart des usages.

### Progress et spinners

**`ora`** — Spinner standard. Simple, fiable, bien maintenu.

```typescript
import ora from 'ora'
const spinner = ora('Fetching data...').start()
await fetchData()
spinner.succeed('Data fetched')
// ou spinner.fail('Failed to fetch data')
```

**`listr2`** — Pour les séquences de tasks multiples avec statuts indépendants. Idéal pour les scripts de setup multi-étapes.

```typescript
import { Listr } from 'listr2'

const tasks = new Listr([
  { title: 'Install dependencies', task: async () => await install() },
  { title: 'Build project', task: async () => await build() },
  { title: 'Run tests', task: async () => await test() },
])

await tasks.run()
```

### Tables et formatage

**`cli-table3`** — Tableaux avec bordures Unicode.
**`columnify`** — Colonnes sans bordures (style `gh`).

### Utilitaires

**`boxen`** — Encadrement de texte dans des boîtes Unicode.
**`figures`** — Symboles Unicode avec fallback ASCII (✓, ✗, ⚠, ->).
**`wrap-ansi`** — Wrap automatique du texte en respectant les codes ANSI.
**`terminal-link`** — Liens cliquables dans les terminaux qui le supportent.

---

## TUI — Terminal User Interface

Les TUI (Terminal User Interfaces) sont des interfaces interactives plein écran dans le terminal. Contrairement aux CLIs classiques (commande -> output -> fin), les TUI maintiennent un état, gèrent le rendu de l'écran entier et répondent aux événements clavier/souris en continu.

### Stacks recommandées par langage

| Langage | Stack | Description |
|---------|-------|-------------|
| **Go** | `bubbletea` + `lipgloss` + `bubbles` | Stack de référence. `bubbletea` est le framework ELM-like (Model-Update-View), `lipgloss` gère le styling (couleurs, borders, padding), `bubbles` fournit les composants réutilisables (spinner, text input, list, table, viewport). |
| **Node / Bun** | `ink` | React pour le terminal. Composants JSX, hooks, flexbox layout. Idéal si l'équipe connaît déjà React. |
| **Rust** | `ratatui` | Framework TUI performant avec immediate-mode rendering. Widgets riches (tableaux, graphes, onglets). Communauté active, successeur de `tui-rs`. |
| **Python** | `textual` + `rich` | `rich` pour le rendu riche (tableaux, markdown, syntax highlighting), `textual` pour les apps TUI complètes avec CSS-like styling et composants réactifs. |

### Architecture d'un TUI

Tous les frameworks TUI modernes convergent vers le même modèle :

```
┌─────────────────────────────────────────┐
│            Boucle principale            │
│                                         │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │  Model   │->│  Update  │->│  View  │ │
│  │ (state)  │  │ (events) │  │(render)│ │
│  └─────────┘  └──────────┘  └────────┘ │
│       ^                          │      │
│       └──────────────────────────┘      │
│                                         │
│  Events: clavier, souris, timer,        │
│          réseau, resize terminal        │
└─────────────────────────────────────────┘
```

- **Model** : l'état complet de l'application (curseur, données, mode actif)
- **Update** : reçoit un événement, retourne un nouveau state
- **View** : reçoit le state, retourne la représentation visuelle (string)

Ce pattern (ELM architecture) est explicite dans `bubbletea` et `ratatui`, implicite dans `ink` (via React) et `textual` (via son système réactif).

### Patterns de layout

#### Dashboard

```
┌─ Dashboard ──────────────────────────────────────────────┐
│                                                          │
│  ┌─ System Status ────────┐  ┌─ Recent Events ────────┐ │
│  │ CPU    ████████░░  80%  │  │ 14:23  Deploy #42 OK  │ │
│  │ Memory ██████░░░░  60%  │  │ 14:21  Test suite  OK │ │
│  │ Disk   ████░░░░░░  40%  │  │ 14:18  Build       OK │ │
│  │ Net    ██░░░░░░░░  20%  │  │ 14:15  Lint     WARN  │ │
│  └────────────────────────┘  │ 14:12  Deploy #41 OK  │ │
│                               └────────────────────────┘ │
│  ┌─ Active Services ─────────────────────────────────┐   │
│  │ NAME         STATUS    UPTIME     REQUESTS/s      │   │
│  │ api-prod     ✓ UP      14d 3h     1,234           │   │
│  │ api-staging  ✓ UP       2d 1h       456           │   │
│  │ worker       ✓ UP       7d 0h        89           │   │
│  │ cron         ⚠ WARN     1d 5h        12           │   │
│  └────────────────────────────────────────────────────┘   │
│                                                          │
│  [q] Quit  [r] Refresh  [/] Search  [?] Help            │
└──────────────────────────────────────────────────────────┘
```

**Principes :**
- Split panes pour organiser l'information par domaine
- La zone la plus importante en haut à gauche (lecture naturelle)
- Status bar en bas avec les raccourcis clavier disponibles
- Rafraîchissement automatique des données (timer events)

#### Visualiseur de logs

```
┌─ Logs ── api-prod ── Follow: ON ─────────────────────────┐
│                                                           │
│  14:23:45.123  INFO   Request  GET /api/users  200  45ms │
│  14:23:45.456  INFO   Request  POST /api/auth  201  12ms │
│  14:23:46.789  WARN   Slow query  SELECT * FROM...  892ms│
│  14:23:47.012  INFO   Request  GET /api/health 200   2ms │
│  14:23:48.345  ERROR  Connection refused  redis:6379     │
│  14:23:48.346  INFO   Retry  redis:6379  attempt 1/3    │
│  14:23:49.678  INFO   Reconnected  redis:6379           │
│  14:23:50.901  INFO   Request  GET /api/users  200  38ms │
│  14:23:51.234  INFO   Request  GET /api/users  200  41ms │
│  14:23:52.567  INFO   Cache hit  users:list  TTL: 245s   │
│                                                           │
│  ▼ Auto-scroll                                            │
├───────────────────────────────────────────────────────────┤
│ Filter: [ERROR|WARN          ]  Source: [api-prod  v]     │
│ [f] Filter  [s] Source  [p] Pause  [w] Wrap  [q] Quit    │
└───────────────────────────────────────────────────────────┘
```

**Principes :**
- Viewport scrollable avec auto-scroll en mode follow
- Coloration par niveau de log (INFO=gris, WARN=jaune, ERROR=rouge)
- Barre de filtre en bas pour filtrer en temps réel
- Timestamps alignés, colonnes fixes pour la structure
- Toggle pause/resume pour figer l'affichage

#### Navigateur de fichiers

```
┌─ Files ── ~/projects/my-app ─────────────────────────────┐
│                                                           │
│  ▸ .github/                                               │
│  ▸ node_modules/                         2,847 items      │
│  ▾ src/                                                   │
│    ▸ components/                            12 items      │
│    ▸ hooks/                                  4 items      │
│    ▸ utils/                                  7 items      │
│    ▸ api/                                    5 items      │
│    ● App.tsx                              2.3 kB          │  <-- curseur
│      index.tsx                            0.4 kB          │
│      main.tsx                             0.8 kB          │
│    package.json                           1.2 kB          │
│    tsconfig.json                          0.5 kB          │
│    README.md                              3.1 kB          │
│                                                           │
├─ Preview ── App.tsx ─────────────────────────────────────┤
│  1 │ import { BrowserRouter } from 'react-router-dom'    │
│  2 │ import { Layout } from './components/Layout'        │
│  3 │ import { Routes } from './Routes'                   │
│  4 │                                                      │
│  5 │ export function App() {                              │
│  6 │   return (                                           │
│  ...                                                      │
├───────────────────────────────────────────────────────────┤
│ [Enter] Open  [Space] Preview  [d] Delete  [r] Rename    │
└───────────────────────────────────────────────────────────┘
```

**Principes :**
- Vue arborescente avec expand/collapse (▸/▾)
- Curseur visible (●) pour l'item sélectionné
- Panneau de preview split en bas ou à droite
- Metadata alignée à droite (taille, nombre d'items)
- Raccourcis contextuels dans la status bar

### Gestion des entrées

#### Raccourcis clavier

| Catégorie | Touches | Convention |
|-----------|---------|------------|
| Navigation | `↑` `↓` `←` `→`, `j` `k` `h` `l` (vim) | Toujours supporter les flèches, vim en option |
| Pagination | `PgUp` `PgDn`, `g` (top) `G` (bottom) | Convention pager/vim |
| Sélection | `Enter` (confirmer), `Space` (toggle/preview) | Standard universel |
| Recherche | `/` (ouvrir), `n`/`N` (suivant/précédent) | Convention vim/less |
| Annulation | `Esc` (fermer panel/modal), `Ctrl+C` (quitter) | Ne jamais bloquer Ctrl+C |
| Actions | `q` (quitter), `r` (refresh), `?` (aide) | Conventions `htop`/`less` |

**Règles :**
- Toujours afficher les raccourcis disponibles dans la status bar
- `Ctrl+C` doit toujours quitter proprement — jamais le capturer pour autre chose
- `q` et `Esc` doivent avoir un comportement prévisible (fermer le contexte courant)
- Supporter les touches vi-like (`j`/`k`) en plus des flèches pour les utilisateurs avancés

#### Support souris

Le support souris est optionnel mais de plus en plus attendu :
- Clic pour sélectionner un item dans une liste
- Scroll pour naviguer dans un viewport
- Clic sur un onglet pour changer de vue
- Toujours désactiver proprement le mode souris à la sortie (sinon le terminal reste dans un état cassé)

`bubbletea` et `ratatui` gèrent le mode souris nativement. `ink` le supporte via des composants tiers.

#### Gestion du focus

Dans un TUI multi-panneaux :
- Un seul panneau a le focus à la fois
- Bordure du panneau actif en couleur vive (cyan, blanc bold), les autres en gris/dim
- `Tab` ou raccourci numérique (`1`, `2`, `3`) pour naviguer entre panneaux
- Le panneau actif capture les événements clavier

```
┌─ Panel 1 (actif) ════════════┐  ┌─ Panel 2 ─────────────┐
│                               │  │                        │
│  Contenu avec focus           │  │  Contenu sans focus    │
│  Bordure vive (cyan/bold)     │  │  Bordure gris/dim      │
│                               │  │                        │
└═══════════════════════════════┘  └────────────────────────┘
  [Tab] Changer de panneau  [1] Panel 1  [2] Panel 2
```

### Patterns de rendu

#### Alternate screen

Les TUI plein écran doivent utiliser l'alternate screen buffer du terminal :
- Entrer dans l'alternate screen au démarrage
- Quitter (restaurer le screen principal) à la sortie
- L'historique du terminal de l'utilisateur reste intact

Tous les frameworks majeurs (`bubbletea`, `ratatui`, `textual`, `ink`) gèrent cela automatiquement.

#### Responsive au resize

Le TUI doit se re-rendre correctement quand la fenêtre du terminal est redimensionnée :
- Écouter le signal `SIGWINCH` (resize)
- Recalculer le layout proportionnellement
- Définir des tailles minimales en dessous desquelles l'app affiche un message d'avertissement

```
# Si le terminal est trop petit :
┌──────────────────┐
│  Terminal trop    │
│  petit.           │
│  Min: 80x24      │
│  Actuel: 60x15   │
└──────────────────┘
```

#### Rafraîchissement

- **Données statiques** : re-rendre uniquement sur événement (clavier, souris)
- **Données live** (logs, métriques) : timer à intervalle configurable (1-5s par défaut)
- **Ne jamais re-rendre plus vite que le terminal ne peut afficher** — limiter à 60 FPS maximum, 30 FPS recommandé pour les TUI

> Mapping timing : le token `micro` (100ms) convient pour les spinners, `fast` (150ms) pour les transitions de focus, `normal` (250ms) pour les changements de panneau — voir **Read** [`../tokens/motion.md`](../tokens/motion.md)

---

## Conventions avancées

### Verbes standards

| Verbe | Usage |
|-------|-------|
| `create` / `new` | Créer une ressource |
| `list` / `ls` | Lister des ressources |
| `get` / `show` | Afficher une ressource |
| `update` / `set` | Modifier une ressource |
| `delete` / `remove` / `rm` | Supprimer une ressource |
| `deploy` / `publish` | Déployer |
| `init` | Initialiser un projet |
| `login` / `logout` | Authentification |
| `status` | État courant |
| `logs` | Logs en streaming |

Ordre des commandes dans `--help` : dans l'ordre du workflow (init → create → list → deploy), pas alphabétique.

### Flags standards

| Flag | Court | Usage |
|------|-------|-------|
| `--help` | `-h` | Afficher l'aide |
| `--version` | | Afficher la version |
| `--verbose` | `-v` | Verbosité accrue |
| `--quiet` | `-q` | Mode silencieux (erreurs uniquement) |
| `--json` | | Output JSON pour le parsing |
| `--no-color` | | Désactiver les couleurs |
| `--yes` | `-y` | Confirmer toutes les prompts (indispensable en CI) |
| `--dry-run` | | Simuler sans exécuter |
| `--force` | `-f` | Forcer (ignorer les warnings) |

**Règle :** `--json`, `--quiet` et `--yes` sont les 3 flags critiques pour l'automatisation. Si votre CLI est utilisée en CI, ils sont obligatoires.

### Help text

```
Usage: mycli <command> [options]

Commands:
  deploy    Deploy your application
  dev       Start development server
  logs      View deployment logs
  env       Manage environment variables

Options:
  -h, --help        Show this help message
  -v, --version     Show version number
  --verbose         Enable verbose output
  --quiet, -q       Suppress all output except errors
  --json            Output as JSON
  --no-color        Disable colored output

Examples:
  mycli deploy
  mycli deploy --prod
  mycli logs --follow
  mycli env add API_KEY=abc123

Run `mycli <command> --help` for command-specific help.
```

**Règles help text :**
- Toujours inclure des exemples concrets en bas
- `--help` disponible sur chaque sous-commande
- Commandes dans l'ordre du workflow (pas alphabétique)

### Configuration et `.env`

```
# Ordre de priorité (du plus au moins prioritaire)
1. Flags CLI (--api-key xyz)
2. Variables d'environnement (API_KEY=xyz)
3. Fichier de config local (.myclirc, mycli.config.ts)
4. Fichier de config global (~/.config/mycli/config.json)
5. Valeurs par défaut
```

Toujours indiquer quelle source est utilisée en mode `--verbose`.

### Mise à jour

```
╭───────────────────────────────────────────╮
│  Update available: 1.0.0 -> 1.2.3        │
│  Run: bun add -g mycli  to update        │
╰───────────────────────────────────────────╯
```

Afficher ce bandeau au-dessus du résultat, pas en dessous. Vérifier de façon asynchrone (sans bloquer la commande).

### CI/CD detection

Détecter automatiquement l'environnement CI pour adapter l'output :

```typescript
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true'

if (isCI) {
  // Pas de spinners (ils polluent les logs)
  // Pas de prompts interactifs (personne pour répondre)
  // Output sans couleurs si NO_COLOR est défini
  // Exit code non-zero en cas d'erreur (TOUJOURS)
}
```

---

## Checklist CLI

Avant de livrer une CLI :

**Output**
- [ ] Couleurs sémantiques (vert=succès, rouge=erreur, jaune=warning, cyan=info, gris=meta)
- [ ] `NO_COLOR` respecté
- [ ] Largeur du terminal respectée (pas de lignes tronquées)
- [ ] Mode `--verbose`, `--quiet`, `--json` disponibles

**Feedback**
- [ ] Spinner ou progress pour toute opération > 100ms
- [ ] Spinner remplacé par ✓ ou ✗ à la fin (jamais silencieux)
- [ ] Résumé final avec les informations importantes (URL, chemin, durée)
- [ ] Prochaines étapes suggérées après une opération réussie

**Erreurs**
- [ ] Messages d'erreur avec contexte + causes possibles + commandes de diagnostic
- [ ] Exit codes corrects (0=succès, 1+=erreur)
- [ ] Ctrl+C géré proprement (message court, exit 130)
- [ ] Pas de stack trace brut pour l'utilisateur final

**Compatibilité**
- [ ] Testé en 8 couleurs (CI, SSH)
- [ ] Testé sans TTY (`mycli | cat`)
- [ ] `--help` sur chaque commande et sous-commande
- [ ] Détection CI/CD pour adapter le comportement

**UX**
- [ ] Commandes dans l'ordre du workflow
- [ ] Valeurs par défaut sensées (pas besoin de tout configurer)
- [ ] Confirmation demandée avant toute action destructive
- [ ] `--dry-run` disponible sur les commandes qui modifient des données

**TUI (si applicable)**
- [ ] Alternate screen buffer utilisé (terminal restauré à la sortie)
- [ ] Resize terminal géré (`SIGWINCH`)
- [ ] Raccourcis clavier affichés dans la status bar
- [ ] `Ctrl+C` quitte proprement dans tous les cas
- [ ] Mode souris désactivé proprement à la sortie
- [ ] Taille minimale du terminal vérifiée

---

## Références croisées

| Fichier | Relation |
|---------|----------|
| **Read** [`../tokens/colors.md`](../tokens/colors.md) | Rôles sémantiques des couleurs — mapping ANSI vers les tokens `success`, `error`, `warning`, `info` |
| **Read** [`../tokens/motion.md`](../tokens/motion.md) | Tokens de timing pour spinners (`micro` = 100ms entre frames), transitions de focus (`fast`), changements de panneau (`normal`) |
| **Read** [`../tokens/typography.md`](../tokens/typography.md) | Polices monospace par plateforme (SF Mono, Roboto Mono, ui-monospace) — le terminal est 100% monospace |
| **Read** [`web-standards.md`](web-standards.md) | Patterns web équivalents — breakpoints et largeurs ne s'appliquent pas au terminal, mais les principes de responsive oui |
