# Log Viewer

Patterns cross-platform de visualisation de logs : terminal (CLI) et web.
Couvre le streaming temps réel, le filtrage, les logs structurés JSON et les vues multi-service.

---

## Anatomie d'un log viewer

### Terminal

```
┌─────────────────────────────────────────────────────────────────────────┐
│ $ myapp logs --level warn,error --service api                          │
│                                                                        │
│ 14:32:01.123  WARN  [api]      Request timeout after 5000ms (id=a8f3) │
│ 14:32:01.456  ERROR [api]      Connection refused: db-primary:5432    │
│ 14:32:02.789  WARN  [api]      Retry 1/3 for db-primary              │
│ 14:32:03.012  ERROR [api]      Connection refused: db-primary:5432    │
│ 14:32:03.345  WARN  [api]      Retry 2/3 for db-primary              │
│ 14:32:04.567  ERROR [api]      Max retries exceeded, failover to      │
│                                db-replica:5432                         │
│ █                                                                      │
│                                                                        │
│ ── [q] quit  [p] pause  [f] filter  [/] search  [↑↓] scroll ──       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Web

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Live ●]  Logs — Production          [Last 1h ▾]  [Export ▾]  [⚙]   │
├──────────┬──────────────────────────────────────────┬──────────────────┤
│ FILTRES  │  TIMESTAMP     LVL   SERVICE   MESSAGE   │  DÉTAIL          │
│          │                                           │                  │
│ Niveau   │  14:32:01.123  ⚠     api       Request   │  Timestamp       │
│ ☑ ERROR  │                                timeout…  │  2024-03-21      │
│ ☑ WARN   │  14:32:01.456  ✗     api       Connecti  │  14:32:01.456    │
│ ☐ INFO   │                                on refu…  │                  │
│ ☐ DEBUG  │  14:32:02.789  ⚠     api       Retry 1/  │  Level: ERROR    │
│          │                                3 for d…  │  Service: api    │
│ Service  │  14:32:03.012  ✗     api       Connecti  │                  │
│ ☑ api    │                                on refu…  │  Message:        │
│ ☐ worker │  14:32:03.345  ⚠     api       Retry 2/  │  Connection      │
│ ☐ cron   │                                3 for d…  │  refused:        │
│          │  14:32:04.567  ✗     api       Max retr  │  db-primary:5432 │
│ Recherche│                                ies exc…  │                  │
│ ┌──────┐ │                                           │  Context:        │
│ │      │ │  ── ↓ 12 new logs ──                     │  host: db-prim…  │
│ └──────┘ │                                           │  port: 5432      │
│          │                                           │  retries: 3      │
│ [Saved ▾]│                                           │  [Copy] [Link]   │
└──────────┴──────────────────────────────────────────┴──────────────────┘
```

### Éléments constitutifs

| Élément | Rôle | Priorité d'affichage |
|---------|------|---------------------|
| Timestamp | Horodatage précis (ms) | P0 — toujours visible |
| Level | Sévérité du log | P0 — toujours visible |
| Message | Contenu principal | P0 — toujours visible |
| Service / Source | Origine du log | P1 — visible si multi-service |
| Metadata / Context | Données structurées complémentaires | P2 — sur demande (expand/clic) |
| Request ID / Trace ID | Corrélation inter-services | P2 — sur demande |
| Stack trace | Pile d'appels (erreurs) | P3 — expand uniquement |

**Priorité en espace limité :** quand la largeur est réduite (mobile, terminal < 80 cols), masquer dans l'ordre inverse : stack trace > metadata > service > level badge (garder la couleur). Ne jamais masquer timestamp ni message.

---

## Niveaux de log et signalétique

| Niveau | Couleur terminal | Couleur web (badge) | Icône | Usage |
|--------|-----------------|---------------------|-------|-------|
| FATAL / CRITICAL | Rouge bold + bg | `--color-error` bg filled | ✗ | Crash imminent, perte de données |
| ERROR | Rouge | `--color-error` | ✗ | Erreur bloquante, action échouée |
| WARN | Jaune | `--color-warning` | ⚠ | Dégradation, retry, seuil atteint |
| INFO | Cyan / bleu | `--color-info` | ℹ | Événement métier, changement d'état |
| DEBUG | Gris | `--color-muted` | · | Détail technique, valeurs internes |
| TRACE | Gris dim | `--color-muted` opacité 50% | · | Flux d'exécution pas-à-pas |

- Terminal : utiliser les codes ANSI standard (`\x1b[31m` rouge, `\x1b[33m` jaune, `\x1b[36m` cyan, `\x1b[90m` gris)
- Web : s'appuyer sur les tokens sémantiques — **Read** [`../tokens/colors.md`](../tokens/colors.md)
- FATAL utilise un fond coloré (`bg-error`) pour se distinguer visuellement de ERROR
- Le niveau TRACE est masqué par défaut dans tous les contextes — activation explicite uniquement

---

## Terminal — Patterns

### Streaming (tail -f style)

Format de sortie par défaut en mode live :

```
HH:MM:SS.mmm  LEVEL  [service]  Message texte libre
```

**Règles :**

- Timestamp en format 24h avec millisecondes — jamais de date complète en mode stream (trop large)
- Niveau aligné sur 5 caractères (`FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`)
- Service entre crochets, tronqué à 10 caractères max (`[api]`, `[worker]`, `[scheduler…]`)
- Message sur le reste de la ligne, wrap autorisé si terminal > 120 cols

**Auto-scroll :**

- Par défaut : auto-scroll activé (suit les nouveaux logs)
- L'utilisateur scrolle vers le haut : auto-scroll désactivé automatiquement
- Indicateur en bas : `── Paused (42 new) ── [Enter] resume ──`
- `Enter` ou `End` : retour en bas + réactivation de l'auto-scroll
- `q` ou `Ctrl+C` : quitter le mode stream

### Filtrage

Filtres combinables via flags CLI :

| Filtre | Flag | Exemple |
|--------|------|---------|
| Par niveau | `--level` | `--level error,warn` |
| Par service | `--service` | `--service api,worker` |
| Par texte (regex) | `--grep` | `--grep "timeout\|refused"` |
| Par plage horaire | `--since` / `--until` | `--since 1h --until 30m` |
| Par request ID | `--request-id` | `--request-id a8f3b2c1` |
| Exclure | `--exclude` | `--exclude "healthcheck"` |

**Combinaison :**

```bash
myapp logs --level error,warn --service api --grep "timeout" --since 1h
```

Les filtres s'appliquent en AND. Plusieurs valeurs d'un même flag s'appliquent en OR.

### JSON structuré

Quand les logs sont en JSON (format structuré), deux modes d'affichage :

**Mode collapsed (défaut) :**

```
14:32:01.123  ERROR  [api]  Connection refused: db-primary:5432  {host,port,retries}
```

Le JSON est résumé entre accolades : seules les clés de premier niveau sont listées.

**Mode expanded (`--json` ou `--expand`) :**

```
14:32:01.123  ERROR  [api]  Connection refused: db-primary:5432
  {
    "host": "db-primary",
    "port": 5432,
    "retries": 3,
    "last_error": "ECONNREFUSED",
    "duration_ms": 15023
  }
```

- JSON indenté avec 2 espaces, coloration syntaxique (clés en cyan, strings en vert, nombres en jaune)
- Extraction de champs spécifiques via `--fields` : `--fields host,retries` n'affiche que ces clés
- Compatible pipe avec `jq` : `myapp logs --output json | jq '.host'`

### Multi-service

Quand plusieurs services émettent des logs simultanément :

**Mode interleaved (défaut) :**

```
14:32:01.123  INFO   api       ← Request POST /api/payments
14:32:01.124  DEBUG  worker    Processing job #4521
14:32:01.130  INFO   api       → 200 OK (7ms)
14:32:01.201  WARN   scheduler Cron job delayed: cleanup (drift: 3s)
14:32:01.205  INFO   worker    Job #4521 completed
```

- Chaque service a une couleur attribuée automatiquement (cycle de 6 couleurs distinctes)
- Le nom de service est affiché en couleur comme préfixe, aligné sur le plus long

**Mode grouped (`--group`) :**

```
── api ──────────────────────────────
14:32:01.123  INFO   ← Request POST /api/payments
14:32:01.130  INFO   → 200 OK (7ms)

── worker ───────────────────────────
14:32:01.124  DEBUG  Processing job #4521
14:32:01.205  INFO   Job #4521 completed

── scheduler ────────────────────────
14:32:01.201  WARN   Cron job delayed: cleanup (drift: 3s)
```

- Utile pour l'analyse post-mortem, pas pour le temps réel
- Chaque groupe est séparé par un header avec le nom du service

---

## Web — Patterns

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Header : titre + indicateur live + sélecteur de plage + actions    │
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│ Sidebar  │  Table de logs                                            │
│ filtres  │  (scroll vertical infini)                                 │
│ (240px)  │                                                           │
│          │                                                           │
├──────────┴───────────────────────────────────────────────────────────┤
│  Footer : nombre de résultats + pagination/load more                │
└──────────────────────────────────────────────────────────────────────┘
```

**Responsive :**

| Breakpoint | Layout |
|-----------|--------|
| Desktop (> 1024px) | Sidebar + table + panneau détail (3 colonnes) |
| Tablet (768–1024px) | Sidebar rétractable + table (2 colonnes) |
| Mobile (< 768px) | Filtres en drawer + liste simplifiée (1 colonne) |

Sur mobile, la vue liste affiche : level badge + message tronqué + timestamp relatif. Le tap ouvre le détail en plein écran.

### Table colonnes

| Colonne | Largeur | Comportement |
|---------|---------|-------------|
| Timestamp | 140px fixe | Toggle relatif ("2m ago") / absolu ("14:32:01.123") via clic sur header |
| Level | 72px fixe | Badge coloré avec icône (cf. signalétique ci-dessus) |
| Service | 100px fixe | Tag filtrable — clic pour filtrer sur ce service |
| Message | flex (reste) | Tronqué à 1 ligne, expand au clic sur la ligne |
| Metadata | 40px (icône) | Icône `{…}` si metadata présente, expand au clic |

- Les colonnes Timestamp, Level et Service sont triables
- La colonne Message ne se trie pas (pas de sens sur du texte libre)
- Les lignes d'erreur (ERROR, FATAL) ont un fond teinté léger (`bg-error` à 5% d'opacité)

### Histogram de distribution

Toujours affiché **au-dessus** du log viewer (jamais en dessous). Permet d'identifier les pics d'erreurs sans lire les logs.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ▐▌▌▌▌▐▌▌▌▐▌▌▌▌▌▌▐▌▐▌▌▌▌▌▐▌▌▌▌▌▐▌▐▌▌▌▌▐▌▌▌▌▌▐▌▌▌▌▌▌▐▌▐▌▌▌▌▌▌▐▌  │
│  14:00                      15:00                      16:00        │
└──────────────────────────────────────────────────────────────────────┘
```

**Règles :**

- Hauteur : 40–60px (suffisant pour voir les variations, sans prendre trop de place)
- Couleur des barres proportionnelle à la proportion d'erreurs dans l'intervalle : vert → jaune → rouge
- Clic sur une barre → filtre l'intervalle de temps correspondant
- Granularité automatique : adapte le nombre de barres à la largeur et à la plage temporelle
- En mode Live : la barre la plus récente se met à jour en temps réel

### États visuels d'une ligne de log

| État | Fond | Bordure | Notes |
|------|------|---------|-------|
| Normal | Transparent | — | Alternance optionnelle (3% opacité) pour lisibilité |
| Hover | `rgba(255,255,255,0.04)` | — | Transition `fast` (150ms) |
| Sélectionné | `rgba(255,255,255,0.08)` | Gauche 2px accent | Clic → sélection + ouverture détail |
| Expanded | Idem sélectionné | Idem | JSON / metadata affiché en dessous |
| Erreur | `rgba(239,68,68,0.08)` | — | Fond teinté pour ERROR et FATAL |

### Filtrage et recherche

**Barre de filtres :**

```
┌──────────────────────────────────────────────────────────────────────┐
│ [ERROR ●] [WARN ●] [INFO ○] [DEBUG ○]   [api ▾]   🔍 "timeout"   │
└──────────────────────────────────────────────────────────────────────┘
```

- Toggles de niveau : activés/désactivés au clic, couleur du niveau quand actif
- Menu déroulant de services : checkboxes multi-sélection
- Champ de recherche full-text : recherche sur le message + les metadata
- Highlighting des termes trouvés dans les résultats (fond jaune)

**Filtre par clic sur une valeur (faceted search) :**

```
Clic sur "payment-api" dans un log
→ Ajoute [service:payment-api ×] dans la toolbar

Clic sur "ERROR" dans le level
→ Ajoute [level:error ×]

Shift+clic → exclusion
→ Ajoute [NOT service:payment-api ×]
```

- Chaque filtre actif apparaît comme un chip dans la toolbar avec un bouton `×` pour le supprimer
- Les chips sont combinables (AND entre eux)
- Valeurs filtrables : level, service, host, et toute clé de metadata cliquée dans le JSON expandé

**Filtres avancés :**

- Sauvegarde de filtres nommés (presets) : "Erreurs API", "Timeouts worker"
- Filtres encodés dans l'URL (query params) : `?level=error,warn&service=api&q=timeout`
- Partage d'une vue filtrée via copie d'URL
- Raccourci clavier `Cmd+K` / `Ctrl+K` pour focus sur la recherche

### Détail d'un log

Au clic sur une ligne, ouverture d'un panneau latéral droit (slide-in, 400px) :

```
┌─────────────────────────────────┐
│  ✗ ERROR                   [×] │
│  14:32:01.456 (il y a 2 min)   │
│  Service : api                  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Message :                      │
│  Connection refused:            │
│  db-primary:5432                │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Metadata :                     │
│  host        db-primary         │
│  port        5432               │
│  retries     3                  │
│  duration_ms 15023              │
│  request_id  a8f3b2c1           │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Stack trace :                  │
│  Error: ECONNREFUSED            │
│    at TCP.connect (net.js:1141) │
│    at Socket._connect (...)     │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  [Copier JSON]  [Contexte ±5]  │
│                                 │
└─────────────────────────────────┘
```

- **Copier JSON** : copie l'entrée complète au format JSON dans le presse-papiers
- **Contexte +-5** : charge les 5 logs avant et après dans une vue inline
- Lien permanent vers ce log spécifique (ancre URL)
- Fermeture : clic sur `[x]`, `Escape`, ou clic en dehors
- Pattern de panneau : **Read** [`../components/modals.md`](../components/modals.md) (section slide-in)

### Temps réel

**Connexion WebSocket / SSE :**

| État | Indicateur | Comportement |
|------|-----------|-------------|
| Connecté | `● Live` (vert) | Logs arrivent en temps réel |
| Déconnecté | `○ Disconnected` (gris) | Banner d'avertissement, tentative de reconnexion |
| Reconnexion | `◐ Reconnecting…` (jaune, pulse) | Backoff exponentiel (1s, 2s, 4s, 8s, max 30s) |
| Pause utilisateur | `❚❚ Paused` (bleu) | L'utilisateur a scrollé vers le haut |

**Auto-scroll et indicateur de nouveaux logs :**

- Auto-scroll activé tant que l'utilisateur est en bas de la table
- Si l'utilisateur scrolle vers le haut : pause automatique
- Banner flottant en bas : `↓ 42 nouveaux logs` — clic pour reprendre l'auto-scroll
- Les logs continuent d'arriver en mémoire (buffer de 10 000 entrées max)
- Au-delà du buffer : les logs les plus anciens sont purgés, indicateur `[Truncated: oldest logs removed]`

---

## États et edge cases

| État | Affichage | Notes |
|------|----------|-------|
| Vide (aucun log) | Illustration + "Aucun log pour cette période" | Proposer d'élargir la plage ou de modifier les filtres |
| Vide (filtres actifs) | "Aucun log correspondant aux filtres" + bouton "Réinitialiser" | Afficher les filtres actifs sous le message |
| Connexion perdue | Banner jaune "Connexion perdue — reconnexion…" | Ne pas effacer les logs déjà affichés |
| Reconnexion réussie | Toast "Reconnecté" (3s) + remplissage du gap | Charger les logs manqués entre la déconnexion et la reconnexion |
| Volume élevé (> 1000/s) | Indicateur "Sampling: 1 log sur 10 affiché" | Permettre de désactiver le sampling via toggle |
| Log très long | Message tronqué à 3 lignes, bouton "Voir plus" | Stack traces et JSON volumineux |
| Timezone | Affichage en timezone locale de l'utilisateur | Tooltip au survol du timestamp : valeur UTC |

**Timezone :**

- Par défaut : timezone locale du navigateur / système
- Tooltip au survol d'un timestamp : `UTC: 2024-03-21T13:32:01.456Z`
- Option de configuration : forcer UTC pour les équipes distribuées

---

## Accessibilité

### Lecteur d'écran

- Chaque ligne de log annonce : niveau, timestamp, service, message (dans cet ordre)
- Les niveaux ERROR et FATAL sont annoncés avec `role="alert"` (web) pour les nouveaux logs
- Les badges de niveau ont un `aria-label` explicite : "Erreur", "Avertissement", etc.
- Le compteur de nouveaux logs (`↓ 42 nouveaux logs`) est une `aria-live="polite"` region

### Navigation clavier

| Touche | Action |
|--------|--------|
| `j` / `↓` | Log suivant |
| `k` / `↑` | Log précédent |
| `Enter` | Ouvrir le détail du log sélectionné |
| `Escape` | Fermer le panneau de détail |
| `/` | Focus sur la recherche |
| `f` | Ouvrir/fermer le panneau de filtres |
| `c` | Copier le log sélectionné (JSON) |
| `g` | Aller en haut de la liste |
| `G` | Aller en bas (reprendre l'auto-scroll) |

### Mouvement réduit

- Si `prefers-reduced-motion` activé : pas d'animation de scroll, transitions instantanées
- Le slide-in du panneau de détail devient une apparition directe
- L'indicateur de reconnexion ne pulse pas — texte statique uniquement
- **Read** [`../tokens/motion.md`](../tokens/motion.md) pour les durées et courbes standard

### Contraste

- Les couleurs de niveau respectent un ratio minimum de 4.5:1 sur fond clair et fond sombre
- Les lignes alternées (striping) utilisent un contraste subtil (3% d'opacité) qui ne nuit pas à la lisibilité
- Le highlighting de recherche (fond jaune) maintient un ratio suffisant avec le texte noir

---

## Guidelines

- **Timestamp d'abord** — le timestamp est toujours la première information visible ; c'est l'ancre temporelle de tout diagnostic
- **Couleur = niveau** — la couleur ne doit encoder que le niveau de sévérité, jamais le service ou une autre dimension
- **Filtres combinables et persistants** — les filtres s'appliquent en AND, sont reflétés dans l'URL (web) ou le flag (CLI), et survivent au rafraîchissement
- **Pas de perte silencieuse** — si des logs sont échantillonnés, tronqués ou purgés du buffer, l'utilisateur doit en être informé explicitement
- **Expansion progressive** — afficher le minimum par défaut (1 ligne), révéler les détails sur demande (metadata, JSON, stack trace)
- **Temps réel sans surprise** — l'auto-scroll ne doit jamais interrompre une lecture en cours ; utiliser un indicateur non intrusif pour signaler les nouveaux logs
- **Terminal et web cohérents** — les mêmes niveaux, couleurs sémantiques et logiques de filtrage s'appliquent aux deux plateformes ; seule l'interaction change
- **JSON natif** — tout log doit être copiable/exportable en JSON structuré, que la source soit du texte brut ou du JSON
- **Timezone explicite** — toujours afficher en timezone locale avec accès facile à l'UTC ; ne jamais laisser d'ambiguïté sur le fuseau horaire
- **Performance** — limiter le DOM visible (virtualisation) à 200 lignes max en web ; en terminal, ne pas dépasser le buffer de 10 000 lignes en mémoire
