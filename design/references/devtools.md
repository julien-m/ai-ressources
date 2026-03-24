# DevTools UI — Conventions et patterns de reference

> Guide pour construire des interfaces d'outils de developpement et d'infrastructure.
> Couvre : dashboards de metriques, log viewers, monitoring de statut, gestion de config,
> dashboards de containers, deploy platforms.
> Base sur : Axiom, Better Stack, Grafana, Datadog, Netdata, Portainer, Coolify,
> Railway, Cloudflare Dashboard, Uptime Kuma.
> Mis a jour : mars 2026.

---

## Philosophie fondatrice des DevTools UI

Les DevTools UI ont des contraintes radicalement differentes des SaaS produit grand public :

**1. La densite est une feature, pas un defaut.** Un ingenieur qui regarde son dashboard veut voir 20 metriques simultanement, pas 4. L'espace blanc genereux est une erreur dans ce contexte.

**2. L'information temps reel prime sur l'esthetique.** Les donnees qui changent chaque seconde doivent etre visibles sans rechargement. Le streaming, le live tail, les sparklines temps reel sont des attentes, pas des bonus. **Read** [`realtime-streams.md`](../components/realtime-streams.md) pour les patterns de streaming et live updates.

**3. Dark mode obligatoire.** Les ingenieurs travaillent souvent en environnement de faible luminosite, sur plusieurs ecrans, pendant de longues sessions. Le dark mode n'est pas un choix — c'est le mode par defaut de toutes les references du panel. **Read** [`colors.md`](../tokens/colors.md) pour les tokens de couleur dark mode.

**4. Les erreurs sont des urgences.** Contrairement au SaaS produit, une erreur dans un DevTool signifie souvent qu'un service est down. La couleur rouge doit declencher une reaction immediate.

**5. La lisibilite a haute densite.** Inter a 13px sur un fond sombre avec des lignes de separation tres subtiles. Pas de padding genereux. Chaque pixel compte. **Read** [`typography.md`](../tokens/typography.md) pour les tokens typographiques de reference.

---

## Les references et ce qu'elles font mieux que les autres

### Axiom

Axiom est la reference moderne du log management et de l'analytics de donnees en temps reel.

**Ce qui est exemplaire :**
- **Query builder visuel** : APL avec auto-completion, syntax highlighting, resultats qui s'actualisent en live pendant la frappe. **Read** [`cli-patterns.md`](../systems/cli-patterns.md) pour les conventions de query/command input.
- **Stream view** : log tail temps reel avec highlight des termes recherches, JSON inline collapsible, filtres rapides par clic sur n'importe quelle valeur. **Read** [`realtime-streams.md`](../components/realtime-streams.md) pour les patterns de streaming.
- **Histogram au-dessus du log viewer** : distribution temporelle des evenements en barres — voir les pics d'erreurs sans lire les logs. **Read** [`data-visualization.md`](../components/data-visualization.md) pour les conventions de graphes et histogrammes.
- **Dataset switcher** : passage instantane entre sources de donnees depuis la sidebar.

**Palette Axiom :**
```
Background principal  : #0d0d0d
Surface               : #161616
Border                : rgba(255,255,255,0.08)
Accent                : Violet #7C3AED
Log ERROR             : Rouge #EF4444
Log WARN              : Amber #F59E0B
Log INFO              : Bleu #3B82F6
Log DEBUG             : Gris #6B7280
Timestamp             : Gris #9CA3AF (monospace)
JSON string           : Vert #4ADE80
JSON number           : Amber #FCD34D
JSON boolean          : Bleu #60A5FA
JSON null             : Gris #6B7280
```

---

### Better Stack (Logtail)

Le log management le plus accessible, concu pour les equipes sans expertise ELK/Splunk.

**Ce qui est exemplaire :**
- **Log level badges pill colores** (pas juste du texte) — ERROR rouge, WARN orange, INFO bleu, DEBUG gris.
- **Contextual sidebar** : clic sur un log → panel droit avec JSON expande + logs adjacents + actions.
- **Time range picker** : presets (15min, 1h, 24h, 7d) + range custom. Standard absolu.
- **Live tail toggle** : bouton "Live" avec point rouge pulsant quand actif. **Read** [`motion.md`](../tokens/motion.md) pour les timings d'animation pulsante.
- **Search avec operateurs** : `level:error host:prod-1` — syntax claire, documentee inline.

---

### Grafana

Standard de l'industrie pour les dashboards de metriques. Open source, extensible.

**Ce qui est exemplaire :**
- **Grid layout de panels libres** : chaque dashboard = grille de panels independants (datasource, requete, type de visualisation propres).
- **Panel types** : Time series, Stat (grande valeur), Gauge, Bar chart, Pie, Table, Heatmap, Flame Graph, Log panel, Geomap. **Read** [`data-visualization.md`](../components/data-visualization.md) pour les conventions de chaque type de visualisation.
- **Variables de dashboard** : dropdowns qui filtrent tous les panels simultanement (env prod/staging/dev).
- **Alerting** : regles definies directement sur les panels, preview temps reel.
- **Annotations** : marqueurs verticaux sur les graphes (deploiements, incidents).

**Palette Grafana dark :**
```
Background          : #111217
Surface niveau 1    : #181b1f (panels)
Surface niveau 2    : #1f2329 (headers panel)
Border              : #2c3235
Texte primaire      : #d8d9da
Texte secondaire    : #9fa7b3
Accent              : Orange #ff780a
Success             : Vert #3d9970
Warning             : Orange #ff9830
Error               : Rouge #f2495c
```

---

### Datadog

La solution la plus complete : APM, logs, infrastructure, RUM, synthetics, security.

**Ce qui est exemplaire :**
- **Service Map** : graphe de dependances entre services avec etat de sante colore.
- **Flame Graph APM** : waterfall de spans colores par service — identifier ou le temps est passe. **Read** [`data-visualization.md`](../components/data-visualization.md) pour les patterns de visualisation de performance.
- **Faceted search** : sidebar gauche avec facettes (hostname, service, env, level) + compteurs — clic = filtre instantane.
- **Monitors** : alerting le plus avance du panel (conditions composites, anomaly detection, forecasting).
- **Dashboard templates** : bibliotheque pre-configuree pour chaque techno (Kubernetes, Redis, PostgreSQL...).

Fond `#1b2134` (bleu-nuit sombre), accent purple `#7C3AED`. Densite maximale assumee — concu pour experts.

---

### Portainer

Reference UI pour la gestion de containers Docker/Kubernetes. Standard de l'auto-hebergement.

**Ce qui est exemplaire :**
- **Container list** : tableau dense — Status badge, Name monospace, Image, CPU%, Memory + mini-bar. Actions au hover.
- **Container logs** : viewer integre avec live tail, ANSI colors preservees, search, download. **Read** [`log-viewer.md`](../components/log-viewer.md) pour les conventions detaillees du composant log viewer.
- **Stack management** : upload ou edition inline du docker-compose.yml, deploiement en 1 clic.

**Palette :**
```
Background    : #1b2a3b (bleu marine sombre)
Surface       : #253749
Accent        : Bleu #0db7f2 (couleur Docker)
Success       : Vert #23ae89
Warning       : Orange #f0a30a
Error         : Rouge #ef4444
```

---

### Coolify

Alternative open source a Heroku/Render, tres bien designee pour l'auto-hebergement.

**Ce qui est exemplaire :**
- **Application card** : status indicator anime + URL + derniere version + resource usage. **Read** [`motion.md`](../tokens/motion.md) pour les timings d'indicateurs animes.
- **Deploy log stream** : logs en streaming avec ANSI colors, collapsibles par etape (clone, build, deploy). **Read** [`realtime-streams.md`](../components/realtime-streams.md) pour les patterns de log streaming.
- **Env vars editor** : masquage par defaut, revelation par clic, import .env, groupement par prefixe.
- **Resource monitoring** : CPU/RAM/Disk temps reel avec graphes temporels simples.

---

### Railway

La deploy platform la plus designee visuellement. Rend l'infrastructure accessible.

**Ce qui est exemplaire :**
- **Canvas de services** : graphe ou chaque service est un node, les connexions (DB, Redis) sont des aretes. **Read** [`data-visualization.md`](../components/data-visualization.md) pour les conventions de graphes de dependances.
- **Deployment timeline** : historique avec statuts visuels (vert/rouge/anime) + durees.
- **Variable references** : `${{postgres.DATABASE_URL}}` auto-completees et linkees entre services.

**Palette :**
```
Background    : #0b0d0f
Surface       : #161b22
Accent        : Violet #7c3aed → gradient rose
Success       : Vert #22c55e
Error         : Rouge #ef4444
Building      : Amber #f59e0b (anime)
```

---

### Cloudflare Dashboard

Couvre DNS, Workers, Pages, R2, D1, KV, Analytics, Zero Trust.

**Ce qui est exemplaire :**
- **Analytics zone** : graphes trafic (requests, bandwidth, threats) avec selecteur de periode + legende interactive. **Read** [`data-visualization.md`](../components/data-visualization.md) pour les conventions de graphes temporels.
- **Workers analytics** : requests/sec, CPU time, errors — sparklines temps reel par worker.
- **DNS editor** : tableau de records avec inline editing, type selector, TTL, proxy toggle (cloud orange on/off). Le plus intuitif du marche.
- **Firewall rules** : visual builder (conditions + actions) + expression editor pour power users.

---

### Uptime Kuma

Reference du monitoring de statut open source. Design epure, self-hosted.

**Ce qui est exemplaire :**
- **Monitor list** : cards avec statut (Up/Down/Pending), uptime %, response time, historique 24h en segments colores.
- **Uptime history bar** : 90 segments de ~16min chacun, vert=up, rouge=down, tooltip au hover.
- **Status page publique** : genere une page type status.io depuis les monitors configures.
- **Incident history** : timeline des incidents avec duree et cause.

---

## Composants specifiques DevTools

### Metric Card (Stat panel)

**Read** [`data-visualization.md`](../components/data-visualization.md) pour les conventions generales des metric cards et sparklines.

```
+-----------------------------------+
| Requests / sec                    |  <- Label 12px gris
|                                   |
| 4,231                             |  <- Valeur 32-48px bold blanc
|                                   |
| ^ +12.3% vs last hour    ~~~~    |  <- Variation + sparkline
+-----------------------------------+
```

**Variante alerte (fond colore quand en alerte) :**
```
+-----------------------------------+  <- Fond rouge #1a0505
| Error Rate              ! Alert   |
|                                   |
| 4.21%                             |  <- Valeur en rouge
+-----------------------------------+
```

**Regles metric card :**
- Valeur principale : 32-48px, blanc, toujours lisible en premier. **Read** [`typography.md`](../tokens/typography.md) pour les tokens de taille.
- Label : 12px, gris secondaire
- Variation : vert si positive, rouge si negative (ou inverse selon la metrique)
- Sparkline : 40-60px de hauteur, meme couleur que la variation
- 4-6 cards max par rangee

---

### Time Series Graph

**Read** [`data-visualization.md`](../components/data-visualization.md) pour les conventions generales de graphes temporels.

```
+--------------------------------------------------------+
| CPU Usage %                          [1h] [6h] [24h]   |
|                                                         |
| 80% |                    /--\                           |
| 60% |              /-----/  \--\                        |
| 40% |         /----/            \----\                  |
| 20% |---------/                      \-------           |
|  0% |                                                   |
|     +--------------------------------------------------+
|     14:00        15:00        16:00        17:00        |
|                                                         |
| -- web-1  -- web-2  -- web-3                            |
+--------------------------------------------------------+
```

**Regles :**
- Axe Y : 4-5 graduations, labels gris secondaire
- Axe X : HH:MM pour < 24h, DD/MM pour > 24h
- Lignes : 1.5-2px, anti-aliase
- Area sous la courbe : 10-15% d'opacite
- Tooltip au hover : ligne verticale + valeurs de toutes les series
- Zoom : drag horizontal → reset au double-clic
- Jamais rouge/amber en premiere serie (reserves aux alertes)

---

### Log Viewer

**Read** [`log-viewer.md`](../components/log-viewer.md) pour les conventions detaillees du composant log viewer (filtrage, expansion, performance).

**Layout standard :**
```
+----------------------------------------------------------+
| [Search logs...] [Level v] [Service v] [Time v] [*Live]  |
+----------------------------------------------------------+
| ||||||||||||||||||||||||  <- Histogram distribution        |
+----------------------------------------------------------+
| 14:23:45.123 [ERROR] Payment failed: card declined        |
|   service: payment-api  host: prod-3  trace: abc123       |
| 14:23:44.891 [INFO ] Request received POST /payments      |
| 14:23:44.103 [WARN ] Rate limit approaching 80%           |
| 14:23:43.567 [DEBUG] Cache miss for key user:42           |
+----------------------------------------------------------+
```

**Couleurs de log levels — standard absolu :**

**Read** [`colors.md`](../tokens/colors.md) pour la reference complete des tokens de couleur.

```
FATAL / CRITICAL  : Rouge vif #FF4444 + fond rouge tres sombre
ERROR             : Rouge #EF4444
WARN              : Amber #F59E0B
INFO              : Bleu #3B82F6 (ou blanc selon le theme)
DEBUG             : Gris #6B7280
TRACE             : Gris clair #9CA3AF
```

**Etats visuels d'une log line :**

**Read** [`motion.md`](../tokens/motion.md) pour les timings de transition.

```
Normal    : fond transparent
Hover     : fond rgba(255,255,255,0.04), transition 100ms
Selected  : fond rgba(255,255,255,0.08) + bordure gauche 2px accent
Expanded  : idem + JSON expande en dessous
Error     : fond rgba(239,68,68,0.08), timestamp en rouge
```

**JSON expande au clic :**
```
v 14:23:45.123  ERROR  Payment failed: card declined
  {
    "level":    "error",           <- Cle gris, string vert
    "service":  "payment-api",
    "trace_id": "abc123def456",   <- Copiable au clic
    "duration": 1234,             <- Number amber
    "error": {
      "code":   "CARD_DECLINED"
    }
  }
```

**Regles histogram :**
- Toujours au-dessus du log viewer (jamais en dessous)
- Hauteur de barre proportionnelle au nombre d'evenements
- Couleur selon proportion d'erreurs : vert → jaune → rouge
- Clic sur une barre → filtre l'intervalle de temps

---

### Health Indicator

**Badge inline :**
```
* Operational       <- Vert, point pulsant si temps reel
* Degraded          <- Amber
* Partial Outage    <- Orange
* Major Outage      <- Rouge, point pulsant
* Maintenance       <- Gris, icone wrench
```

**Read** [`motion.md`](../tokens/motion.md) pour les timings d'animation pulsante des indicateurs de statut.

**Uptime history bar (style Uptime Kuma) :**
```
90 segments x ~16 minutes = 24h
# Vert  = UP
# Rouge = DOWN
# Gris  = No data
# Amber = Degraded
Tooltip : date/heure + etat + duree
```

**Card de service :**
```
+--------------------------------------------+
| * payment-api                prod          |
|                                            |
| Uptime: 99.97%    Response: 234ms          |
| ########################   <- History 24h  |
+--------------------------------------------+
```

---

### Environment Variables Editor

```
+----------------------------------------------------------+
| Environment Variables          [+ Add] [^ Import .env]    |
+----------------------------------------------------------+
| Production v                                              |
+----------------------------------------------------------+
| [lock] DATABASE_URL    ****************  [eye] [edit] [x] |
| [lock] API_KEY         ****************  [eye] [edit] [x] |
| [lock] STRIPE_SECRET   ****************  [eye] [edit] [x] |
|                                                           |
|    NODE_ENV        production         [edit] [x]          |
|    PORT            3000               [edit] [x]          |
+----------------------------------------------------------+
| ! 3 variables will trigger a redeploy                     |
+----------------------------------------------------------+
```

**Regles :**
- Secrets masques par defaut, reveles par clic (jamais auto-reveles)
- Distinction visuelle secrets (lock) vs variables publiques
- Validation inline : format URL pour DATABASE_URL, longueur minimale pour keys
- Import depuis .env : drag-and-drop ou textarea + parse
- Avertissement de redeploiement si pertinent
- Copier la valeur sans reveler (clipboard icon separe)
- Groupement par prefixe si > 10 variables (DB_, STRIPE_, AUTH_...)

---

### Container / Service List

```
+-----------------------------------------------------------------+
| Containers (4 running, 1 stopped)              [+ New] [Filter v]|
+-----------------------------------------------------------------+
| Status  Name           Image              CPU    MEM   Actions   |
+-----------------------------------------------------------------+
| *       web-app        nginx:1.24         0.2%   48MB  > # ~ x   |
| *       api            node:20-alpine     2.1%   124MB > # ~ x   |
| *       postgres       postgres:16        0.8%   312MB > # ~ x   |
| o       worker         node:20-alpine     --     --    > # ~ x   |
+-----------------------------------------------------------------+
  * Running  o Stopped  ! Starting  x Error
```

**Colonnes standard :**
- Status : indicator colore (pas de texte — trop large)
- Name : monospace, cliquable → detail
- Image : gris secondaire
- CPU % : barre de progression inline si > 0
- MEM : valeur + unite (MB/GB)
- Actions : icones au hover uniquement (reduire le bruit visuel)

---

### Config Editor

```
+----------------------------------------------------------+
| nginx.conf                    [Validate] [Save]           |
+----------------------------------------------------------+
|  1  server {                                              |
|  2    listen 80;                                          |
|| 3    server_name example.com;   <- Ligne erreur          |
|  4                                                        |
|  5    location / {                                        |
|  6      proxy_pass http://localhost:3000;                 |
|  7    }                                                   |
|  8  }                                                     |
+----------------------------------------------------------+
| x Line 3: server_name requires at least one hostname      |
+----------------------------------------------------------+
```

**Regles :**
- Numeros de ligne toujours visibles (gris tres clair)
- Syntax highlighting adapte au format du fichier
- Validation en temps reel (debounced 500ms)
- Erreurs : ligne surlignee + bordure gauche rouge + message en bas
- Warnings : bordure gauche amber
- Diff avec version precedente : vert/rouge en marge
- Ctrl+S pour sauvegarder, Ctrl+Z undo

---

### Deployment Timeline

```
+----------------------------------------------------------+
| ok  v1.4.2   2h ago    main     by julien    45s          |
| x   v1.4.1   5h ago    main     by julien    failed       |  <- Rouge
| ok  v1.4.0   1d ago    main     by marie     67s          |
+----------------------------------------------------------+
```

**Log stream d'un deploiement (clic) :**

**Read** [`realtime-streams.md`](../components/realtime-streams.md) pour les patterns de log streaming en temps reel.

```
v Clone repository                    ok 2s
  Cloning from github.com/user/repo
  ok Cloned branch main (abc1234)

v Install dependencies                ok 18s
  Running: bun install
  142 packages installed

v Build                               ok 23s
  Running: bun run build
  ok Build completed

v Deploy                              ok 2s
  ok Container started
  ok Health check passed
```

---

### Alerting Rules

```
+----------------------------------------------------------+
| * High Error Rate                         OK               |  <- Vert
|   Error rate > 1% for 5 minutes                           |
|   -> Slack #alerts, PagerDuty                              |
|   Last triggered: 2 hours ago                              |
+----------------------------------------------------------+
| * High Memory Usage              ! Firing  15min ago       |  <- Amber
|   Memory > 80% for 10 minutes                              |
|   -> Slack #alerts                                         |
+----------------------------------------------------------+
| o Database Pool                  - Inactive                |  <- Gris
|   Connection pool > 90%                                    |
+----------------------------------------------------------+
```

---

## Structure et layout

### Layout global standard

**Read** [`cli-patterns.md`](../systems/cli-patterns.md) pour les conventions de layout d'outils en ligne de commande.

```
+----------------------------------------------------------+
| Logo  App Name         [Search Cmd+K]      Avatar  gear    |  <- Topbar 56px
+--------+-------------------------------------------------+
|        |                                                  |
|Sidebar |  [Breadcrumb]                                    |
| 220px  |                                                  |
|        |  Zone de contenu principale                      |
|Overview|                                                  |
|Metrics |                                                  |
|Logs    |                                                  |
|Servers |                                                  |
|Config  |                                                  |
|Alerts  |                                                  |
|        |                                                  |
|Settings|                                                  |
+--------+-------------------------------------------------+
```

### Page Overview / Dashboard

```
[Time range v]  [Refresh]  [Auto-refresh: 30s v]

[Metric Card]  [Metric Card]  [Metric Card]  [Metric Card]   <- KPIs

[Time Series Graph — Requests/sec — full width]              <- Main graph

[Time Series — CPU]          [Time Series — Memory]          <- 2 colonnes

[Services Status List]       [Recent Logs (20 dernieres)]    <- 2 colonnes
```

### Page Logs

```
[Toolbar: Search | Level | Service | Time range | * Live]

[Histogram de distribution — 60px hauteur]

[Log stream — monospace 13px, dense]
  timestamp  [LEVEL]  message
  timestamp  [LEVEL]  message
  ...
```

### Page Servers / Containers

```
[Filter v]  [+ Add]

[Container list — table dense]

-> [Panel detail (slide depuis droite ou page dediee)]
     Name, Status, Image, Ports
     [CPU graph 30min]  [Memory graph 30min]
     [View logs]  [Restart]  [Stop]  [Remove]
```

### Page Config

```
[Tabs: App Config | Environment | Secrets | Domains]

[Config Editor ou Env Vars Editor selon le tab actif]

[Save]  [Discard changes]
[! These changes will trigger a redeploy]
```

---

## Conventions de densite

### DevTools vs SaaS produit

| Element | SaaS produit | DevTools |
|---|---|---|
| Padding section | 80-120px | 16-24px |
| Padding card | 24-32px | 12-16px |
| Row height table | 48-56px | 32-40px |
| Font size body | 16px | 13-14px |
| Font size label | 14px | 12px |
| Gap inter-elements | 16-24px | 8-12px |
| Colonnes dashboard | 2-3 | 4-6 |
| Mode par defaut | Light ou hybride | **Dark** |

### Densite adaptative par vue

- **Vue tableau** (logs, containers, deploys) : densite maximale — 32px/row, 13px
- **Vue graphes** (metriques) : densite medium — les graphes ont besoin d'espace
- **Vue formulaire** (config, env vars) : densite normale — inputs lisibles
- **Vue overview** : densite medium — compromis vue globale / lisibilite

---

## Systeme de couleurs DevTools

**Read** [`colors.md`](../tokens/colors.md) pour la reference complete des tokens de couleur et les conventions de theming.

### Palette universelle dark mode

```
Background principal  : #0d0d0d -> #111217
Surface niveau 1      : #161616 -> #1a1f2e (panels, cards)
Surface niveau 2      : #1f2329 -> #253040 (headers, hover)
Border                : rgba(255,255,255,0.06) -> 0.12
Texte primaire        : #e2e8f0 -> #f1f5f9
Texte secondaire      : #94a3b8 -> #64748b
Texte disabled        : #475569
```

### Couleurs semantiques — standard absolu invariant

```
Succes / Healthy / Up    : #22c55e (vert)
Warning / Degraded       : #f59e0b (amber)
Erreur / Down / Critical : #ef4444 (rouge)
Info / Neutral           : #3b82f6 (bleu)
En cours / Building      : #a855f7 (violet) ou accent brand
```

Ces couleurs sont invariantes entre les produits. Un ingenieur qui passe de Grafana a Datadog a Coolify retrouve les memes codes. Ne pas devier de cette convention.

### Couleurs de series de donnees (graphes)

```
Serie 1  : Bleu   #3b82f6
Serie 2  : Vert   #22c55e
Serie 3  : Amber  #f59e0b
Serie 4  : Violet #a855f7
Serie 5  : Cyan   #06b6d4
Serie 6  : Rose   #ec4899
Serie 7  : Indigo #6366f1
Serie 8  : Lime   #84cc16
```

Jamais rouge/amber en premieres series — reserves aux alertes.

---

## Typographie DevTools

**Read** [`typography.md`](../tokens/typography.md) pour les tokens typographiques de reference et les regles de fallback.

### Stack standard

```
Interface UI         : Inter, system-ui — 13-14px
Donnees techniques   : JetBrains Mono, Fira Code — 12-13px
Titres de section    : Inter Semibold — 14-16px
Labels metriques     : Inter — 12px, gris secondaire
Valeurs metriques    : Inter Bold — 28-48px
```

### Monospace — regle d'usage

```
TOUJOURS monospace :
- Log lines (timestamps, messages, valeurs)
- IDs de ressources (container ID, trace ID, request ID)
- Chemins de fichiers (/var/log/nginx/error.log)
- Commandes et code
- Valeurs d'environnement variables
- IP addresses, ports, hashes, UUIDs

JAMAIS monospace :
- Labels d'interface (boutons, titres, nav)
- Texte explicatif
- Valeurs metriques (CPU 23%, 1.2GB)
```

---

## Patterns d'interaction DevTools

### Time range picker — standard universel

```
[Last 15 minutes v]
|- Quick ranges
|   5min  15min  30min  1h  3h  6h  12h  24h  7d  30d
|- Custom range
|   From: [2026-03-21 14:00]
|   To:   [2026-03-21 15:00]
|                          [Apply]
```

### Live mode

**Read** [`realtime-streams.md`](../components/realtime-streams.md) pour les patterns complets de live mode et auto-refresh.

```
Inactif : [o Live]   <- Outline, gris
Actif   : [* Live]   <- Fond vert, point qui pulse
```

Quand Live actif : time range glissant, log viewer auto-scroll, graphes s'etendent en temps reel.

### Filtre par clic sur une valeur (faceted search)

```
Clic sur "payment-api" dans un log
-> Ajoute [service:payment-api x] dans la toolbar

Clic sur "ERROR" dans le level
-> Ajoute [level:error x]

Shift+clic -> exclusion
-> Ajoute [NOT service:payment-api x]
```

### Keyboard shortcuts DevTools

**Read** [`cli-patterns.md`](../systems/cli-patterns.md) pour les conventions de raccourcis clavier dans les outils developeur.

```
/           Focus search
Ctrl+K      Command palette
J / K       Navigate entre items (vim-style)
O           Expand item selectionne
R           Refresh
L           Toggle Live mode
Escape      Fermer panel / deselect
```

---

## Checklist DevTools UI

**Layout et densite**
- [ ] Dark mode par defaut (`#111217` ou equivalent)
- [ ] Densite elevee : 32-40px rows, 13-14px body, padding 12-16px
- [ ] Sidebar gauche avec navigation par section
- [ ] Topbar avec search global (Cmd+K) et time range picker

**Metriques**
- [ ] Metric cards : valeur large, label petit, variation %, sparkline
- [ ] Time series : tooltip hover, zoom drag, reset double-clic
- [ ] Couleurs de series distinctes (jamais rouge/amber en premier)
- [ ] Live mode avec auto-refresh configurable

**Logs**
- [ ] Histogram de distribution au-dessus du log viewer
- [ ] Log levels colores (ERROR rouge, WARN amber, INFO bleu, DEBUG gris)
- [ ] JSON expansion au clic sur une ligne
- [ ] Timestamps monospace gris
- [ ] Search + filtres + Live tail toggle
- [ ] Filtre par clic sur une valeur dans le log

**Services / Containers**
- [ ] Status indicators colores (vert, rouge, gris)
- [ ] CPU/Memory en colonnes avec mini-bar
- [ ] Actions au hover uniquement
- [ ] Clic -> panel detail ou page dediee

**Config / Env**
- [ ] Secrets masques par defaut, reveles par clic
- [ ] Validation inline avec messages d'erreur contextuels
- [ ] Import depuis .env
- [ ] Avertissement si modification -> redeploiement

**Alerting**
- [ ] Etat visible par badge (OK / Warning / Firing / Inactive)
- [ ] Historique des declenchements
- [ ] Canaux de notification configurables

**Conventions**
- [ ] Couleurs semantiques invariantes (vert/amber/rouge/bleu)
- [ ] Monospace pour toutes les donnees techniques
- [ ] Time range picker avec presets + custom
- [ ] Keyboard shortcuts documentes
- [ ] Filtre par clic sur valeur dans logs/tableaux
