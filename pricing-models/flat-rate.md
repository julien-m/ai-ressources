# Flat-Rate

Modele de pricing a prix unique : un seul plan, un seul prix, toutes les fonctionnalites incluses.

## Definition

Le flat-rate est le modele le plus simple. Chaque client paie le meme montant mensuel ou annuel, independamment de son usage ou de la taille de son equipe. Pas de tiers, pas de matrice de features, pas de calculatrice.

## Quand c'est le bon choix

| Critere | Indicateur favorable |
|---------|---------------------|
| Audience homogene | Les clients ont des besoins et des tailles similaires |
| Produit simple | Peu de fonctionnalites, proposition de valeur claire |
| Positionnement anti-complexite | Differenciation par la simplicite face a des concurrents multi-tiers |
| Equipe reduite | Pas de capacity a gerer une matrice de plans complexe |
| Phase early-stage | Tester le marche sans complexite de packaging |

## Avantages

### Pour le builder

- **Simplicite operationnelle** : pas de logique de gating, pas de plan management, billing trivial
- **Previsibilite du revenu** : MRR = nombre de clients x prix (pas de variance d'usage)
- **Pas de friction dans le produit** : aucun upgrade wall, aucun feature lock
- **Communication claire** : une seule page pricing, un seul pitch
- **Support simplifie** : pas de questions "quel plan me convient"

### Pour le client

- **Transparence totale** : pas de surprise, pas de surcout cache
- **Acces complet** : toutes les features des le jour 1
- **Decision d'achat rapide** : pas de comparaison de plans, pas d'analyse cout/benefice par tier

## Inconvenients

| Inconvenient | Impact | Mitigation |
|--------------|--------|------------|
| Pas de capture de surplus | Les gros clients paient le meme prix que les petits | Ajouter un tier enterprise custom |
| Pas d'upsell path | Revenu par client plafonne | Compenser par du volume ou des add-ons |
| Taille unique | Ne convient pas si les besoins varient beaucoup | Ajouter des limites d'usage soft |
| Sous-monetisation enterprise | Les grandes equipes obtiennent un deal excessif | Introduire un seuil "contactez-nous" |
| Difficulte a augmenter le prix | Toute hausse affecte 100% de la base | Grandfathering + communication anticipee |

## Variantes

### Flat-rate pur

Un prix, tout inclus, aucune limite. Le modele Basecamp historique.

### Flat-rate + add-ons

Prix de base fixe, avec des modules optionnels factures en supplement.

| Produit | Base flat | Add-ons |
|---------|-----------|---------|
| Basecamp | $99/mois (equipe illimitee) | Aucun (pur) |
| Hey.com | $99/an | Domaine custom |
| Carrd | $19/an (Pro) | Aucun |

### Flat-rate + limite d'usage

Prix fixe mais avec un plafond genereux. Au-dela, facturation supplementaire ou passage a un plan custom.

## Exemples concrets

| Produit | Prix | Inclus | Positionnement |
|---------|------|--------|----------------|
| Basecamp | $99/mois | Users illimites, projets illimites, 500 Go stockage | Anti-per-seat, simplicite |
| Hey.com | $99/an | 1 boite email, stockage genereux | Anti-Gmail, vie privee |
| Carrd | $19/an (Pro Std) | 10 sites, formulaires, analytics | Simplicite, landing pages |
| Pika | $8/mois (Standard) | 150 credits/mois, toutes features | Entree de gamme IA video |

### Cas Basecamp : le manifeste flat-rate

Basecamp a fait du flat-rate un positionnement marketing. Leur argument : "les autres outils punissent la croissance de votre equipe, pas nous." C'est un choix delibere de sacrifier l'ARPU enterprise pour maximiser la simplicite et la confiance.

## Flat-rate vs tiered : table comparative

| Dimension | Flat-rate | Tiered |
|-----------|-----------|--------|
| Simplicite | Maximale | Complexe (3-4 plans a designer) |
| Revenue ceiling par client | Fixe | Extensible via upsell |
| Segmentation marche | Aucune | Fine (persona par tier) |
| Cout d'implementation | Minimal | Significatif (gating, billing, UI) |
| Taux de conversion page pricing | Eleve (pas de decision) | Variable (paradoxe du choix) |
| Expansion revenue | Nulle (hors add-ons) | Forte (upgrade path) |
| Adapte au PLG | Moyen | Fort |
| Adapte au sales-led | Faible | Fort |

## Psychologie du pricing flat

### Transparence et confiance

Le flat-rate elimine l'anxiete du "vais-je payer plus que prevu". Dans un marche sature de plans complexes, cette transparence est un avantage concurrentiel reel.

### Effet "all-inclusive"

Le client percoit qu'il obtient tout pour un prix raisonnable. Meme s'il n'utilise que 30% des features, la perception de valeur est elevee.

### Reduction de la friction d'achat

Pas de comparaison de plans, pas de peur de choisir le mauvais tier. La decision se reduit a : "est-ce que ca vaut $X/mois pour moi ?" — binaire et rapide.

### Ancrage simple

Un seul prix = un seul point d'ancrage. Le client compare directement avec le cout de ne pas utiliser le produit, plutot qu'avec d'autres tiers du meme produit.

## Quand evoluer vers du tiered

### Signaux d'alerte

1. **Dispersion des profils clients** : des solopreneurs et des equipes de 200 paient le meme prix
2. **Demandes enterprise recurrentes** : SSO, SAML, SLA, audit logs
3. **Churn des petits clients** : le prix est trop eleve pour les petits, trop bas pour les gros
4. **Stagnation du MRR** : pas d'expansion revenue possible
5. **Features premium sous-utilisees** : des features couteuses a maintenir utilisees par 5% des clients

### Strategie de transition

| Etape | Action |
|-------|--------|
| 1 | Identifier 2-3 axes de segmentation (taille equipe, usage, features avancees) |
| 2 | Creer un tier enterprise "contactez-nous" (sans toucher au flat existant) |
| 3 | Ajouter un tier starter moins cher en dessous du flat actuel |
| 4 | Le flat existant devient le tier "standard" — grandfathering pour les clients actuels |
| 5 | Monitorer les metriques : conversion, ARPU, churn par segment |

### Decision rapide

- **Garder le flat-rate** si l'audience est homogene, le produit est simple, et la croissance vient du volume.
- **Passer au tiered** si les profils clients divergent fortement et que l'expansion revenue est critique.
- **Flat-rate + enterprise custom** est le meilleur compromis intermediaire.
