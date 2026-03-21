# Data Visualization

Patterns de visualisation de donnees cross-platform : terminal (ASCII) et web. Metriques, charts, sparklines, tableaux de bord.

---

## Metric Cards

Carte affichant une valeur unique avec contexte : label, valeur, indicateur de tendance, delta.

### Structure

```
┌──────────────┐
│ Label        │  ← texte 13px gris (web) / secondaryLabel (natif)
│ 12,345       │  ← valeur 24px bold
│ ↑ +12.3%     │  ← tendance coloree (vert=hausse, rouge=baisse)
└──────────────┘
```

### Rangee de 4 metric cards (layout standard)

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Revenue      │ │ Users        │ │ Conv. rate   │ │ Errors       │
│ $12,345      │ │ 1,234        │ │ 89.2%        │ │ 42           │
│ ↑ +12.3%     │ │ ↓ -3.1%      │ │ → 0.0%       │ │ ↑ +8.5%      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Indicateurs de tendance

| Symbole | Signification | Couleur |
|---------|---------------|---------|
| ↑ | Hausse | Vert (positif) ou rouge (si metrique negative comme erreurs) |
| ↓ | Baisse | Rouge (negatif) ou vert (si metrique negative) |
| → | Stable | Gris neutre |

Le sens de la couleur depend de la semantique de la metrique : pour "Revenue", hausse = vert ; pour "Errors", hausse = rouge.

### Delta

- Pourcentage : `+12.3%`, `-3.1%`, `0.0%`
- Absolu (optionnel) : `+1,234`, `-89`
- Periode de comparaison : toujours afficher "vs 7j" ou "vs mois precedent"

### Etats

| Etat | Affichage |
|------|-----------|
| Loading | Skeleton rectangle anime (label + valeur + delta) |
| Erreur | Valeur remplacee par `—`, message discret sous la carte |
| No data | `—` + texte "Aucune donnee" en gris |
| Tendance positive | Delta en vert + fleche ↑ |
| Tendance negative | Delta en rouge + fleche ↓ |
| Stable | Delta en gris + fleche → |

Voir **Read** [`../references/app-views.md`](../references/app-views.md) (section Dashboard) pour le layout complet.

---

## Terminal — Visualisation

### Sparklines

Mini-graphiques inline en caracteres Unicode block elements.

**Jeu de caracteres :**

```
▁ ▂ ▃ ▄ ▅ ▆ ▇ █
```

Chaque caractere represente un niveau relatif dans la plage min–max de la serie.

**Usage :** inline dans les tableaux, a cote des valeurs de metriques.

**Exemple :**

```
  Metrique            Valeur    Tendance 7j
  ─────────────────────────────────────────
  Requests/s          2,431     ▂▃▅▇▇▅▃▂  ↑ +12%
  Error rate          0.3%      ▁▁▂▁▁▁▁▁  → stable
  Latency p99         142ms     ▃▃▄▅▇▅▃▂  ↓ -8%
  Memory              78%       ▅▅▅▆▆▇▇▇  ↑ +5%
```

**Regles :**
- Minimum 5 points pour un sparkline lisible
- Maximum 20 caracteres de large
- Normaliser sur le min–max local de la serie (pas global)
- Utiliser dans les contextes ou un vrai graphique n'est pas possible (CLI, logs, emails texte)

### Bar charts ASCII

#### Barres horizontales

```
Requests   ████████████████████████ 2,431
Errors     ██░░░░░░░░░░░░░░░░░░░░    89
Latency    ███████████░░░░░░░░░░░   142ms
Uptime     ████████████████████████ 99.9%
```

- `█` = valeur remplie, `░` = espace restant jusqu'au max
- Largeur fixe de la barre : 24 caracteres
- Label aligne a gauche, valeur alignee a droite
- Trier par valeur decroissante sauf si l'ordre a un sens metier

#### Barres verticales (histogrammes)

```
    █
    █ █
  █ █ █
  █ █ █ █
  █ █ █ █ █
  ─────────
  L  M  M  J  V
```

- Moins courant en terminal, reserver aux distributions simples
- Maximum 10-12 colonnes
- Toujours afficher les labels d'axe X

### Tableaux de metriques

Colonnes alignees avec unites et comparaison.

```
  Metrique        Actuel     Precedent    Delta
  ──────────────────────────────────────────────
  Requetes        2,431/s    2,150/s      ↑ +13.1%
  Erreurs            89       102         ↓ -12.7%
  Latence p50       23ms      25ms        ↓ -8.0%
  Latence p99      142ms     168ms        ↓ -15.5%
  Memoire           78%       72%         ↑ +8.3%
```

**Regles de formatage :**
- Aligner les nombres a droite dans chaque colonne
- Aligner les unites entre elles (ms avec ms, % avec %)
- Coloration conditionnelle (si le terminal supporte ANSI) :
  - Vert : valeur saine / amelioration
  - Rouge : valeur critique / degradation
  - Jaune : valeur en zone d'attention (seuil approche)
- Separateur de ligne : `─` (tiret horizontal Unicode)

### Gauges / indicateurs

#### Barre de progression

```
CPU    [████████░░░░░░░░░░░░] 40%
Memory [████████████████░░░░] 78%
Disk   [██████████████████░░] 91%  ← WARN
```

- 20 caracteres de large entre crochets
- Ajouter un indicateur textuel si le seuil d'alerte est depasse

#### Indicateurs de statut

```
● API Gateway     OK       23ms
● Database        OK       12ms
● Cache           WARN     89ms    seuil: 50ms
● Queue           CRIT     timeout
○ Scheduler       DOWN     —
```

- `●` (plein) = service actif, `○` (vide) = service inactif
- Couleur ANSI : vert=OK, jaune=WARN, rouge=CRIT, gris=DOWN

---

## Web — Visualisation

### Types de charts

| Type | Usage | Quand utiliser | Quand eviter |
|------|-------|----------------|--------------|
| Line chart | Evolution temporelle | Metriques continues, tendances | Peu de points (<5) |
| Bar chart | Comparaisons | Categories distinctes, classements | Trop de categories (>12) |
| Area chart | Volume cumule | Stacked data, part de marche | Trop de series (>4) |
| Pie / Donut | Proportions | Distribution simple (3-5 parts) | Plus de 5 segments |
| Heatmap | Densite / patterns | Activite par heure/jour, correlations | Donnees sans axes temporels/categoriels |
| Gauge | Valeur unique vs objectif | KPI, sante systeme | Comparaisons multiples |
| Table + sparkline | Detail + tendance | Classements, top N | Donnees sans tendance temporelle |

**Regle absolue :** pas de pie chart sur les dashboards principaux (voir [`../references/app-views.md`](../references/app-views.md)). Preferer les bar charts pour les comparaisons de proportions.

### Axes et labels

**Axe Y :**
- Toujours commencer a 0 (sauf si la variation est << au range, ex: temperature corporelle 36-40)
- Afficher 4-6 graduations horizontales
- Unites dans le label d'axe, pas repetees sur chaque graduation

**Axe X temporel — grain adaptatif :**

| Periode affichee | Grain | Format label |
|------------------|-------|--------------|
| < 1 heure | 5 min | `14:05` |
| 1-24 heures | 1 heure | `14h` |
| 1-7 jours | 1 jour | `Lun 12` |
| 1-3 mois | 1 semaine | `Sem 12` |
| 3-12 mois | 1 mois | `Mar` |
| > 1 an | 1 trimestre | `Q1 2026` |

**Labels :**
- Pas de rotation > 45 degres
- Tronquer avec `...` si le label depasse la largeur de colonne
- Afficher 1 label sur 2 si les labels se chevauchent
- Grid lines : trait leger (#E5E7EB / opacity 0.15), pas de fond colore

### Couleurs

**Palette sequentielle (une serie) :**
- Du clair au fonce dans une meme teinte
- Exemple : bleu-100 → bleu-300 → bleu-500 → bleu-700

**Palette categorielle (multi-series) :**
- Maximum 6 couleurs distinctes
- Si > 6 series : regrouper les moins significatives dans "Autres"
- Couleurs suffisamment contrastees entre elles

**Couleurs semantiques :**

| Statut | Couleur | Usage |
|--------|---------|-------|
| Sain / succes | Vert (#10B981) | Valeurs dans les seuils normaux |
| Attention | Jaune (#F59E0B) | Seuil approche, degradation legere |
| Critique / erreur | Rouge (#EF4444) | Seuil depasse, erreur, incident |
| Neutre / inactif | Gris (#9CA3AF) | Pas de donnees, desactive |

**Accessibilite :**
- Ne pas s'appuyer uniquement sur la couleur : ajouter un pattern (hachures, pointilles) ou une forme (carre, cercle, triangle)
- Ratio de contraste minimum 3:1 entre series adjacentes
- Tester avec simulateur daltonisme (protanopie, deuteranopie)

Voir **Read** [`../tokens/colors.md`](../tokens/colors.md) pour la palette complete.

### Tooltips et interactions

**Hover (desktop) :**
- Tooltip avec valeur exacte + date/heure formatee
- Ligne verticale (crosshair) sur les line/area charts
- Highlight de la serie survolee, dimming des autres

**Click :**
- Drill-down vers une vue detaillee (ex: clic sur un jour → vue horaire)
- Filtrer les donnees (ex: clic sur une legende → toggle serie)

**Drag :**
- Selection de plage temporelle pour zoom
- Brush horizontal sur l'axe X

**Mobile (touch) :**
- Tap = equivalent hover (affiche tooltip)
- Long press = equivalent click (drill-down)
- Pinch = zoom / dezoom
- Swipe horizontal = defilement temporel

**Animations :**
- Entree : draw progressif des lignes (300-500ms, ease-out)
- Transition entre etats : morph des barres/points (200-300ms)
- Pas d'animation au survol (reaction instantanee)

Voir **Read** [`../tokens/motion.md`](../tokens/motion.md) pour les courbes et durees standard.

### Responsive

| Breakpoint | Layout | Legende | Interactions |
|------------|--------|---------|--------------|
| < 640px | Chart pleine largeur | En dessous du chart | Touch: tap pour tooltip |
| 640-1024px | Chart + legende cote a cote (2 series max) | A droite si peu d'items | Touch + hover |
| > 1024px | Grid de charts (2-3 colonnes) | Position libre | Hover + click |

**Regles mobile :**
- Hauteur minimum du chart : 200px
- Touch targets des points/barres : minimum 44x44px
- Simplifier les labels d'axe (moins de graduations)
- Desactiver le drag-to-zoom si le chart est dans un scroll vertical

### Empty states

| Etat | Affichage | Action |
|------|-----------|--------|
| No data | Illustration + "Aucune donnee disponible" | CTA : "Connectez une source de donnees" |
| Error loading | Icone erreur + "Impossible de charger les donnees" | Bouton "Reessayer" |
| Partial data | Afficher les donnees disponibles + indicateur zones manquantes | Message : "Donnees partielles — certaines sources sont indisponibles" |
| Filtered to empty | "Aucun resultat pour ces filtres" | Bouton "Reinitialiser les filtres" |

- Toujours conserver la structure du layout (metric cards, charts) meme en etat vide
- Ne jamais afficher une page blanche

---

## Dashboard layout

### Structure standard

```
┌──────────────────────────────────────────────────────────────┐
│ Dashboard                         [7 jours ▾] [Exporter]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─── 3col ──┐ ┌─── 3col ──┐ ┌─── 3col ──┐ ┌─── 3col ──┐   │
│ │ Metrique 1│ │ Metrique 2│ │ Metrique 3│ │ Metrique 4│    │
│ │ $12,345   │ │ 1,234     │ │ 89.2%     │ │ 42        │    │
│ │ ↑ +12.3%  │ │ ↓ -3.1%   │ │ → 0.0%    │ │ ↑ +8.5%   │    │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘    │
│                                                              │
│ ┌────────────────── 12col ──────────────────┐               │
│ │                                            │               │
│ │   Graphique principal (line/area chart)     │               │
│ │   pleine largeur                           │               │
│ │                                            │               │
│ └────────────────────────────────────────────┘               │
│                                                              │
│ ┌──────── 6col ────────┐ ┌──────── 6col ────────┐           │
│ │                      │ │                       │           │
│ │  Chart secondaire 1  │ │  Chart secondaire 2   │           │
│ │  (bar chart)         │ │  (table + sparklines) │           │
│ │                      │ │                       │           │
│ └──────────────────────┘ └───────────────────────┘           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Grille

| Element | Colonnes | Notes |
|---------|----------|-------|
| Metric card | 3/12 | 4 cartes sur une rangee |
| Chart principal | 12/12 | Pleine largeur |
| Chart secondaire | 6/12 | 2 charts cote a cote |
| Table avec sparklines | 6/12 ou 12/12 | Pleine largeur si beaucoup de colonnes |
| Chart petit (widget) | 4/12 | 3 par rangee |

### Responsive dashboard

| Breakpoint | Metric cards | Charts | Tables |
|------------|-------------|--------|--------|
| < 640px | 2 par rangee, empiles | 12/12, empiles verticalement | Scroll horizontal |
| 640-1024px | 4 par rangee | Principal 12/12, secondaires 6/12 | Colonnes reduites |
| > 1024px | 4 par rangee | Layout complet (schema ci-dessus) | Toutes colonnes visibles |

---

## Formatage des nombres

| Plage | Format | Exemple |
|-------|--------|---------|
| < 1 000 | Tel quel | `842` |
| 1 000 - 9 999 | Separateur de milliers | `1,234` |
| 10K - 999K | Notation abregee | `12.3K`, `142K` |
| 1M+ | Notation abregee | `1.2M`, `3.4B` |

### Pourcentages

| Cas | Format | Exemple |
|-----|--------|---------|
| Valeur < 1% | 2 decimales | `0.34%` |
| Valeur 1-10% | 1 decimale | `3.2%` |
| Valeur > 10% | 0 decimale | `42%` |
| Delta | Toujours 1 decimale + signe | `+12.3%`, `-3.1%` |

### Durees

| Plage | Format | Exemple |
|-------|--------|---------|
| < 1s | Millisecondes | `142ms` |
| 1s - 59s | Secondes + decimale | `2.3s` |
| 1min - 59min | Minutes + secondes | `1m 23s` |
| 1h+ | Heures + minutes | `2h 15m` |
| 1j+ | Jours + heures | `3j 12h` |

### Taille (bytes)

| Plage | Format | Exemple |
|-------|--------|---------|
| < 1 KB | Bytes | `842 B` |
| 1 KB - 999 KB | Kilobytes | `1.2 KB` |
| 1 MB - 999 MB | Megabytes | `3.4 MB` |
| 1 GB+ | Gigabytes | `1.2 GB` |

**Regles :**
- Toujours 1 decimale pour les notations abregees (sauf si `.0`)
- Aligner les unites dans les colonnes de tableaux
- Utiliser l'espace insecable entre la valeur et l'unite
- Separateur de milliers : `,` (en contexte anglophone) ou ` ` (espace fine en contexte francophone)

---

## Temps reel

### Intervalles de rafraichissement

| Contexte | Intervalle | Notes |
|----------|-----------|-------|
| Monitoring systeme | 1-5s | Metriques serveur, alertes |
| Dashboard operationnel | 5-15s | Metriques business temps reel |
| Dashboard analytique | 30s-60s | Agregats, tendances |
| Rapport | Manuel (bouton refresh) | Pas d'auto-refresh |

### Transition entre valeurs

- Animer le changement de valeur numerique (compteur qui defile)
- Duree : 300ms, ease-out
- Flash subtil (background pulse) pour attirer l'attention sur un changement significatif
- Ne pas animer les sparklines a chaque update (redessin direct)

Voir **Read** [`../tokens/motion.md`](../tokens/motion.md) pour les courbes et durees standard.

### Indicateur de fraicheur

```
Derniere mise a jour : il y a 5s        ● Live
Derniere mise a jour : il y a 2min       ● Live
Derniere mise a jour : il y a 15min      ○ Pause (onglet inactif)
```

- Afficher le timestamp relatif en bas ou en haut du dashboard
- Pastille verte `●` si l'auto-refresh est actif
- Pastille grise `○` si pause (onglet inactif, perte de connexion)
- Pause automatique de l'auto-refresh quand l'onglet est en arriere-plan (Page Visibility API)
- Reprendre l'auto-refresh avec un refresh immediat quand l'onglet redevient actif

### Gestion des erreurs temps reel

- Si une source de donnees echoue : afficher la derniere valeur connue + indicateur "stale"
- Apres 3 echecs consecutifs : afficher un bandeau d'avertissement
- Ne jamais afficher `0` ou une valeur vide a cause d'une erreur reseau

---

## Guidelines

- **Hierarchie visuelle :** metric cards en haut (vue d'ensemble), charts au milieu (detail), tables en bas (donnees brutes)
- **Pas de pie charts** sur les dashboards principaux — utiliser des bar charts pour les comparaisons de proportions
- **Accessibilite :** ne jamais encoder l'information uniquement par la couleur — ajouter texte, icone ou pattern
- **Formatage coherent :** utiliser les memes regles de formatage des nombres dans toute l'application
- **Axe Y a zero :** toujours commencer l'axe Y a 0 pour eviter les distorsions visuelles
- **Limiter les series :** maximum 4-6 series par chart — au-dela, regrouper dans "Autres" ou utiliser des filtres
- **Terminal vs Web :** les patterns terminal (sparklines, barres ASCII) sont des fallbacks pour les contextes sans rendu graphique — pas des substituts aux charts web
- **Mobile first :** concevoir le layout mobile d'abord, puis enrichir pour les ecrans larges
- **Temps reel :** ajuster l'intervalle de rafraichissement au contexte — trop frequent = charge inutile, trop rare = donnees obsoletes
- **Empty states :** toujours prevoir les 4 etats (no data, error, partial, filtered empty) — ne jamais afficher une page blanche
- **Unites :** toujours afficher l'unite a cote de la valeur — un nombre sans unite est ambigu
