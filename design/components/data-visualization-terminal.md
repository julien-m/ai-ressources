# Data Visualization - Terminal

Patterns de visualisation de donnees pour interfaces terminal (ASCII charts, sparklines, histogrammes). Extrait de `data-visualization.md`.

Voir [`data-visualization.md`](data-visualization.md), section **Chart Anatomy**, pour les couleurs semantiques, l'accessibilite, le responsive et les animations partages.

## Terminal — Visualisation

### Sparklines
Mini-graphiques inline en caracteres Unicode block elements. Usage principal : inline dans les tableaux, a cote des valeurs de metriques.

**Jeu de caracteres :** `▁ ▂ ▃ ▄ ▅ ▆ ▇ █` - chaque caractere represente un niveau relatif dans la plage min-max de la serie.

```
  Metrique            Valeur    Tendance 7j
  ─────────────────────────────────────────
  Requests/s          2,431     ▂▃▅▇▇▅▃▂  ↑ +12%
  Error rate          0.3%      ▁▁▂▁▁▁▁▁  → stable
  Latency p99         142ms     ▃▃▄▅▇▅▃▂  ↓ -8%
  Memory              78%       ▅▅▅▆▆▇▇▇  ↑ +5%
```

**Regles :** minimum 5 points, maximum 20 caracteres de large, normaliser sur le min-max local (pas global). Utiliser dans les contextes sans rendu graphique (CLI, logs, emails texte).

### Bar charts ASCII
#### Barres horizontales
```
Requests   ████████████████████████ 2,431
Errors     ██░░░░░░░░░░░░░░░░░░░░    89
Latency    ███████████░░░░░░░░░░░   142ms
Uptime     ████████████████████████ 99.9%
```

`█` = valeur remplie, `░` = espace restant jusqu'au max. Largeur fixe 24 caracteres. Label a gauche, valeur a droite. Trier par valeur decroissante sauf si l'ordre a un sens metier.

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

Moins courant en terminal, reserver aux distributions simples. Maximum 10-12 colonnes. Toujours afficher les labels d'axe X.

### Tableaux de metriques
```
  Metrique        Actuel     Precedent    Delta
  ──────────────────────────────────────────────
  Requetes        2,431/s    2,150/s      ↑ +13.1%
  Erreurs            89       102         ↓ -12.7%
  Latence p50       23ms      25ms        ↓ -8.0%
  Latence p99      142ms     168ms        ↓ -15.5%
  Memoire           78%       72%         ↑ +8.3%
```

**Regles de formatage :** aligner les nombres a droite, aligner les unites entre elles (ms avec ms, % avec %). Coloration ANSI conditionnelle selon la section **Chart Anatomy** du document parent. Separateur de ligne : `─`.

### Gauges / indicateurs
#### Barre de progression
```
CPU    [████████░░░░░░░░░░░░] 40%
Memory [████████████████░░░░] 78%
Disk   [██████████████████░░] 91%  ← WARN
```

20 caracteres de large entre crochets. Ajouter un indicateur textuel si le seuil d'alerte est depasse.

#### Indicateurs de statut
```
● API Gateway     OK       23ms
● Database        OK       12ms
● Cache           WARN     89ms    seuil: 50ms
● Queue           CRIT     timeout
○ Scheduler       DOWN     —
```

`●` (plein) = service actif, `○` (vide) = service inactif. Couleur ANSI selon couleurs semantiques ci-dessus.

---
