# Log Viewer

Patterns cross-platform de visualisation de logs : terminal (CLI) et web.
Couvre le streaming temps réel, le filtrage, les logs structurés JSON et les vues multi-service.

---

## Anatomie d'un log viewer

### Terminal

```
┌─────────────────────────────────────────────────────────────────────────┐
│ $ myapp logs --level warn,error --service api                          │
│ 14:32:01.123  WARN  [api]      Request timeout after 5000ms (id=a8f3) │
│ 14:32:01.456  ERROR [api]      Connection refused: db-primary:5432    │
│ 14:32:02.789  WARN  [api]      Retry 1/3 for db-primary              │
│ 14:32:03.012  ERROR [api]      Connection refused: db-primary:5432    │
│ 14:32:03.345  WARN  [api]      Retry 2/3 for db-primary              │
│ 14:32:04.567  ERROR [api]      Max retries exceeded, failover to      │
│                                db-replica:5432                         │
│ █                                                                      │
│ ── [q] quit  [p] pause  [f] filter  [/] search  [↑↓] scroll ──       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Web

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Live ●]  Logs — Production          [Last 1h ▾]  [Export ▾]  [⚙]   │
├──────────┬──────────────────────────────────────────┬──────────────────┤
│ FILTRES  │  TIMESTAMP     LVL   SERVICE   MESSAGE   │  DÉTAIL          │
│ Niveau   │  14:32:01.123  ⚠     api       Request   │  Timestamp       │
│ ☑ ERROR  │                                timeout…  │  2024-03-21      │
│ ☑ WARN   │  14:32:01.456  ✗     api       Connecti  │  14:32:01.456    │
│ ☐ INFO   │                                on refu…  │  Level: ERROR    │
│ ☐ DEBUG  │  14:32:02.789  ⚠     api       Retry 1/  │  Service: api    │
│ Service  │                                3 for d…  │                  │
│ ☑ api    │  14:32:03.012  ✗     api       Connecti  │  Message:        │
│ ☐ worker │                                on refu…  │  Connection      │
│ ☐ cron   │  14:32:03.345  ⚠     api       Retry 2/  │  refused:        │
│ Recherche│                                3 for d…  │  db-primary:5432 │
│ ┌──────┐ │  14:32:04.567  ✗     api       Max retr  │  Context:        │
│ └──────┘ │                                ies exc…  │  host: db-prim…  │
│ [Saved ▾]│  ── ↓ 12 new logs ──                     │  [Copy] [Link]   │
└──────────┴──────────────────────────────────────────┴──────────────────┘
```

### Éléments constitutifs

| Élément | Rôle | Priorité |
|---------|------|----------|
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

| Niveau | Terminal | Web (badge) | Icône | Usage |
|--------|----------|-------------|-------|-------|
| FATAL / CRITICAL | Rouge bold + bg | `--color-error` bg filled | ✗ | Crash imminent, perte de données |
| ERROR | Rouge | `--color-error` | ✗ | Erreur bloquante, action échouée |
| WARN | Jaune | `--color-warning` | ⚠ | Dégradation, retry, seuil atteint |
| INFO | Cyan / bleu | `--color-info` | ℹ | Événement métier, changement d'état |
| DEBUG | Gris | `--color-muted` | · | Détail technique, valeurs internes |
| TRACE | Gris dim | `--color-muted` opacité 50% | · | Flux d'exécution pas-à-pas |

- Terminal : codes ANSI standard (`\x1b[31m` rouge, `\x1b[33m` jaune, `\x1b[36m` cyan, `\x1b[90m` gris)
- Web : tokens sémantiques — **Read** [`../tokens/colors.md`](../tokens/colors.md)
- FATAL utilise un fond coloré (`bg-error`) pour se distinguer visuellement de ERROR
- TRACE masqué par défaut — activation explicite uniquement

---

## Terminal — Patterns

### Streaming (tail -f style)

Format par défaut en mode live : `HH:MM:SS.mmm  LEVEL  [service]  Message texte libre`

- Timestamp 24h avec millisecondes — jamais de date complète en mode stream (trop large)
- Niveau aligné sur 5 caractères (`FATAL`, `ERROR`, `WARN `, `INFO `, `DEBUG`, `TRACE`)
- Service entre crochets, tronqué à 10 caractères max (`[api]`, `[worker]`, `[scheduler…]`)
- Message sur le reste de la ligne, wrap autorisé si terminal > 120 cols

**Auto-scroll :** activé par défaut. Scroll vers le haut → désactivé, indicateur `── Paused (42 new) ── [Enter] resume ──`. `Enter`/`End` : réactivation ; `q`/`Ctrl+C` : quitter.

### Filtrage

Filtres combinables via flags CLI (AND entre filtres, OR entre valeurs d'un même flag) :

| Filtre | Flag | Exemple |
|--------|------|---------|
| Par niveau | `--level` | `--level error,warn` |
| Par service | `--service` | `--service api,worker` |
| Par texte (regex) | `--grep` | `--grep "timeout\|refused"` |
| Par plage horaire | `--since` / `--until` | `--since 1h --until 30m` |
| Par request ID | `--request-id` | `--request-id a8f3b2c1` |
| Exclure | `--exclude` | `--exclude "healthcheck"` |

```bash
myapp logs --level error,warn --service api --grep "timeout" --since 1h
```

### JSON structuré

**Mode collapsed (défaut) :** clés de premier niveau listées entre accolades.

```
14:32:01.123  ERROR  [api]  Connection refused: db-primary:5432  {host,port,retries}
```

**Mode expanded (`--json` / `--expand`) :**

```
14:32:01.123  ERROR  [api]  Connection refused: db-primary:5432
  { "host": "db-primary", "port": 5432, "retries": 3,
    "last_error": "ECONNREFUSED", "duration_ms": 15023 }
```

- JSON indenté 2 espaces, coloration syntaxique (clés cyan, strings vert, nombres jaune)
- Extraction via `--fields host,retries` ; compatible pipe `jq`

### Multi-service

**Mode interleaved (défaut) :** couleur auto-attribuée par service (cycle 6 couleurs), nom aligné.

```
14:32:01.123  INFO   api       ← Request POST /api/payments
14:32:01.124  DEBUG  worker    Processing job #4521
14:32:01.130  INFO   api       → 200 OK (7ms)
14:32:01.201  WARN   scheduler Cron job delayed: cleanup (drift: 3s)
14:32:01.205  INFO   worker    Job #4521 completed
```

**Mode grouped (`--group`) :** logs regroupés par service sous headers `── <service> ──`. Utile pour l'analyse post-mortem, pas pour le temps réel.

---

## Web — Patterns

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Header : titre + indicateur live + sélecteur de plage + actions    │
├──────────┬───────────────────────────────────────────────────────────┤
│ Sidebar  │  Table de logs (scroll vertical infini)                   │
│ filtres  │                                                           │
│ (240px)  │                                                           │
├──────────┴───────────────────────────────────────────────────────────┤
│  Footer : nombre de résultats + pagination/load more                │
└──────────────────────────────────────────────────────────────────────┘
```

| Breakpoint | Layout |
|-----------|--------|
| Desktop (> 1024px) | Sidebar + table + panneau détail (3 colonnes) |
| Tablet (768–1024px) | Sidebar rétractable + table (2 colonnes) |
| Mobile (< 768px) | Filtres en drawer + liste simplifiée (1 colonne) |

Sur mobile : level badge + message tronqué + timestamp relatif. Tap → détail plein écran.

### Table colonnes

| Colonne | Largeur | Comportement |
|---------|---------|-------------|
| Timestamp | 140px fixe | Toggle relatif/absolu via clic header |
| Level | 72px fixe | Badge coloré avec icône (cf. signalétique) |
| Service | 100px fixe | Tag filtrable — clic pour filtrer |
| Message | flex (reste) | Tronqué 1 ligne, expand au clic |
| Metadata | 40px (icône) | Icône `{…}` si présente, expand au clic |

Colonnes Timestamp, Level, Service triables ; Message non triable. Lignes ERROR/FATAL : fond teinté `bg-error` à 5% d'opacité.

### Histogram de distribution

Toujours affiché **au-dessus** du log viewer (jamais en dessous). Identifie les pics d'erreurs sans lire les logs.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ▐▌▌▌▌▐▌▌▌▐▌▌▌▌▌▌▐▌▐▌▌▌▌▌▐▌▌▌▌▌▐▌▐▌▌▌▌▐▌▌▌▌▌▐▌▌▌▌▌▌▐▌▐▌▌▌▌▌▌▐▌  │
│  14:00                      15:00                      16:00        │
└──────────────────────────────────────────────────────────────────────┘
```

- Hauteur 40–60px ; couleur proportionnelle aux erreurs (vert → jaune → rouge)
- Clic sur barre → filtre l'intervalle ; granularité auto selon largeur/plage
- Mode Live : barre la plus récente mise à jour en temps réel

### États visuels d'une ligne de log

| État | Fond | Bordure | Notes |
|------|------|---------|-------|
| Normal | Transparent | — | Alternance optionnelle (3% opacité) |
| Hover | `rgba(255,255,255,0.04)` | — | Transition `fast` (150ms) |
| Sélectionné | `rgba(255,255,255,0.08)` | Gauche 2px accent | Clic → sélection + ouverture détail |
| Expanded | Idem sélectionné | Idem | JSON/metadata affiché en dessous |
| Erreur | `rgba(239,68,68,0.08)` | — | Fond teinté pour ERROR et FATAL |

### Filtrage et recherche

**Barre de filtres :** toggles de niveau (couleur quand actif), menu déroulant services (checkboxes multi-sélection), recherche full-text sur message + metadata avec highlighting fond jaune.

**Faceted search (clic sur valeur) :** ajoute un chip filtrant (`[service:payment-api ×]`). Shift+clic → exclusion (`[NOT service:payment-api ×]`). Chips combinables en AND. Valeurs filtrables : level, service, host, toute clé metadata du JSON expandé.

**Filtres avancés :** presets nommés ("Erreurs API", "Timeouts worker") ; filtres encodés dans l'URL (`?level=error,warn&service=api&q=timeout`) pour partage ; `Cmd+K`/`Ctrl+K` pour focus recherche.

### Détail d'un log

Au clic sur une ligne, panneau latéral droit (slide-in, 400px) :

```
┌─────────────────────────────────┐
│  ✗ ERROR                   [×] │
│  14:32:01.456 (il y a 2 min)   │
│  Service : api                  │
│  ─────────────────────────────  │
│  Message :                      │
│  Connection refused:            │
│  db-primary:5432                │
│  ─────────────────────────────  │
│  Metadata :                     │
│  host        db-primary         │
│  port        5432               │
│  retries     3                  │
│  duration_ms 15023              │
│  request_id  a8f3b2c1           │
│  ─────────────────────────────  │
│  Stack trace :                  │
│  Error: ECONNREFUSED            │
│    at TCP.connect (net.js:1141) │
│    at Socket._connect (...)     │
│  ─────────────────────────────  │
│  [Copier JSON]  [Contexte ±5]  │
└─────────────────────────────────┘
```

- **Copier JSON** : copie l'entrée complète au format JSON dans le presse-papiers
- **Contexte +-5** : charge les 5 logs avant et après en vue inline
- Lien permanent (ancre URL) ; fermeture via `[x]`, `Escape`, ou clic extérieur
- Pattern de panneau : **Read** [`../components/modals.md`](../components/modals.md) (section slide-in)

### Temps réel

| État | Indicateur | Comportement |
|------|-----------|-------------|
| Connecté | `● Live` (vert) | Logs en temps réel |
| Déconnecté | `○ Disconnected` (gris) | Banner d'avertissement, tentative de reconnexion |
| Reconnexion | `◐ Reconnecting…` (jaune, pulse) | Backoff exponentiel (1s, 2s, 4s, 8s, max 30s) |
| Pause utilisateur | `❚❚ Paused` (bleu) | L'utilisateur a scrollé vers le haut |

Auto-scroll activé tant que l'utilisateur est en bas ; scroll vers le haut → pause + banner `↓ 42 nouveaux logs` (clic pour reprendre). Buffer 10 000 entrées max ; au-delà, purge des plus anciens avec `[Truncated: oldest logs removed]`.

---

## États et edge cases

| État | Affichage | Notes |
|------|----------|-------|
| Vide (aucun log) | Illustration + "Aucun log pour cette période" | Proposer d'élargir la plage ou modifier les filtres |
| Vide (filtres actifs) | "Aucun log correspondant" + bouton "Réinitialiser" | Afficher les filtres actifs sous le message |
| Connexion perdue | Banner jaune "Connexion perdue — reconnexion…" | Ne pas effacer les logs déjà affichés |
| Reconnexion réussie | Toast "Reconnecté" (3s) + remplissage du gap | Charger les logs manqués entre déconnexion et reconnexion |
| Volume élevé (> 1000/s) | "Sampling: 1 log sur 10 affiché" | Toggle pour désactiver le sampling |
| Log très long | Tronqué 3 lignes + "Voir plus" | Stack traces et JSON volumineux |
| Timezone | Timezone locale de l'utilisateur | Tooltip survol : valeur UTC ; option forcer UTC pour équipes distribuées |

---

## Accessibilité

### Lecteur d'écran
- Chaque ligne annonce : niveau, timestamp, service, message (dans cet ordre)
- ERROR/FATAL annoncés avec `role="alert"` (web) pour les nouveaux logs
- Badges de niveau : `aria-label` explicite ("Erreur", "Avertissement", etc.)
- Compteur nouveaux logs : `aria-live="polite"` region

### Navigation clavier

| Touche | Action |
|--------|--------|
| `j`/`↓`, `k`/`↑` | Log suivant / précédent |
| `Enter` / `Escape` | Ouvrir / fermer le détail |
| `/` | Focus recherche |
| `f` | Ouvrir/fermer filtres |
| `c` | Copier le log sélectionné (JSON) |
| `g` / `G` | Haut de liste / bas (reprendre auto-scroll) |

### Mouvement réduit
- `prefers-reduced-motion` : pas d'animation de scroll, transitions instantanées, slide-in → apparition directe, reconnexion sans pulse
- **Read** [`../tokens/motion.md`](../tokens/motion.md) pour les durées et courbes standard

### Contraste
- Couleurs de niveau : ratio minimum 4.5:1 sur fond clair et sombre
- Striping : contraste subtil (3% opacité) sans nuire à la lisibilité
- Highlighting recherche (fond jaune) : ratio suffisant avec texte noir

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
