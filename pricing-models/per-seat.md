# Per-Seat

Modele de pricing ou chaque utilisateur (siege) est facture individuellement. Le revenu croit lineairement avec l'adoption dans l'organisation.

## Mecanique

Le prix est calcule par utilisateur et par periode de facturation. Deux approches principales :

| Type | Definition | Avantage | Inconvenient |
|------|-----------|----------|--------------|
| Per-seat provisionne | Facturation de chaque compte cree, actif ou non | Previsible, simple | Penalise les comptes dormants |
| Per-active-user | Facturation uniquement des users actifs sur la periode | Juste, pas de gaspillage | Revenu moins previsible |

**Tendance 2025-2026** : le per-active-user gagne du terrain. Slack a popularise le modele — les utilisateurs inactifs ne sont pas factures, ce qui reduit la friction d'adoption.

## Variantes

### Per-seat strict

Chaque utilisateur = meme prix, quel que soit le volume.

### Per-seat avec bandes de volume

| Bande | Prix / user / mois |
|-------|--------------------|
| 1-5 users | 15 EUR |
| 6-20 users | 12 EUR |
| 21-100 users | 9 EUR |
| 101+ | Sur devis |

### Per-seat avec roles differencies

| Role | Prix |
|------|------|
| Admin / Full user | 20 EUR/mois |
| Member / Standard | 12 EUR/mois |
| Viewer / Guest | Gratuit ou 3 EUR/mois |

**Exemple** : Notion facture les membres avec edition, mais les guests en lecture sont gratuits. Linear facture uniquement les membres actifs.

### Per-seat + feature tiers

Chaque tier a un prix par siege different. L'organisation choisit un tier, puis paie par siege a ce tarif.

| Tier | Prix / user / mois | Features |
|------|--------------------|----------|
| Starter | 8 EUR | Core features |
| Pro | 15 EUR | + integrations, analytics |
| Enterprise | Sur devis | + SSO, SAML, audit, SLA |

## Remises volume et enterprise

### Paliers de remise

| Volume | Remise typique |
|--------|----------------|
| 1-50 | 0% (prix affiche) |
| 51-200 | 10-15% |
| 201-500 | 15-25% |
| 500+ | 25-40% (negocie) |

### Negociation enterprise

- **Engagement annuel** : remise 15-20% vs mensuel
- **Commit minimum** : l'entreprise s'engage sur un nombre minimum de sieges
- **True-up trimestriel** : ajustement a la hausse si depassement du commit
- **Ramp deal** : prix progressif sur 12-18 mois pour les grandes migrations

## Shadow IT et seat sharing

### Le probleme

Quand le prix par siege est eleve, les utilisateurs partagent des comptes. Cela fausse les metriques, degrade la securite, et cree une mauvaise experience.

### Signaux de detection

- Sessions simultanees depuis des IP/appareils differents
- Patterns d'usage anormaux (connexions a des heures incompatibles)
- Un seul compte avec une activite disproportionnee

### Strategies de prevention

| Strategie | Approche |
|-----------|----------|
| Prix raisonnable | Reduire l'incitation au partage en baissant le prix par siege |
| Guests gratuits | Offrir des sieges lecture seule gratuits (elimine le partage pour "juste regarder") |
| SSO obligatoire | Chaque employe a son propre compte, pas de partage possible |
| Valeur par utilisateur | Personnalisation, notifications, historique — chaque user veut son propre compte |
| Session unique | Limiter a une session active par compte |

## Metriques cles

| Metrique | Definition | Benchmark |
|----------|-----------|-----------|
| ARPU | Revenu moyen par utilisateur | Variable par secteur |
| Seat utilization | % de sieges provisionnes reellement actifs | > 70% sain |
| Expansion revenue | Croissance MRR via ajout de sieges (pas de nouveaux clients) | 20-40% du MRR growth |
| Net seat expansion | Sieges ajoutes - sieges retires par periode | Positif = sain |
| Contraction rate | % de revenu perdu par reduction de sieges | < 3%/mois |
| Time-to-seat-expansion | Delai entre premier achat et ajout de sieges | 30-90 jours ideal |

## Exemples concrets

| Produit | Modele | Prix indicatif | Particularite |
|---------|--------|----------------|---------------|
| Slack | Per-active-user + tiers | 7-13 EUR/user/mois | Inactifs non factures |
| GitHub | Per-seat + tiers | 4-21 USD/user/mois | Free tier genereux |
| Jira | Per-seat bandes | 8-16 USD/user/mois | Remises volume agressives |
| Linear | Per-active-user + tiers | 8-12 USD/user/mois | Guests gratuits |
| Notion | Per-member | 8-15 USD/member/mois | Guests lecture gratuits |
| Figma | Per-editor | 12-75 USD/editor/mois | Viewers gratuits |
| Datadog | Per-host + per-seat pour certains modules | Variable | Hybride usage + seat |

## Modeles hybrides

### Per-seat + usage

Facturation par siege pour l'acces a la plateforme, plus une composante variable liee a la consommation.

| Produit | Composante siege | Composante usage |
|---------|-----------------|-----------------|
| Datadog | Par host / par user selon le module | Par volume de logs, traces, metrics |
| Snowflake | Pas de per-seat | Pure consommation compute + stockage |
| Postman | Par seat | Par appels API monitoring |

### Per-seat + feature tiers

Le tier determine les fonctionnalites accessibles, le nombre de sieges determine le cout total. C'est le modele dominant en B2B SaaS.

## Anti-patterns

| Anti-pattern | Consequence | Correction |
|--------------|-------------|------------|
| Prix par siege trop eleve (> 30 EUR pour un outil non-critique) | Partage de comptes, resistance a l'adoption | Reduire le prix, ajouter des guests gratuits |
| Pas de tier gratuit ou d'essai | Barriere a l'adoption, pas de PLG | Ajouter un free tier ou trial |
| Facturation des viewers au meme prix que les editors | Les managers n'ont pas acces, perte de visibilite | Differentier les roles et les prix |
| Pas de remise volume | Les gros clients partent vers un concurrent | Introduire des paliers de remise |
| True-up annuel sans visibilite | Bill shock en fin d'annee | True-up trimestriel avec dashboard de suivi |
| Pas d'expansion motion | Les equipes stagnent sur le nombre de sieges initial | Onboarding d'equipe, invitations facilitees |

## Table de decision : quand per-seat est adapte

| Critere | Per-seat adapte | Per-seat non adapte |
|---------|-----------------|---------------------|
| Valeur liee au nombre d'utilisateurs | Oui (collaboration, communication) | Non (valeur liee a l'usage ou au volume) |
| Usage homogene entre users | Oui | Non (gros ecart entre power users et viewers) |
| Produit de collaboration | Oui (plus de users = plus de valeur) | Non applicable |
| Audience enterprise / equipes | Oui | Non (individus, developpeurs solo) |
| Expansion revenue souhaitee | Oui (croissance organique via ajout de sieges) | Limitee si equipes stables |
| Effet reseau interne | Oui (Slack, Notion) | Faible (outils individuels) |

### Decision rapide

- **Choisir per-seat** si la valeur du produit augmente avec le nombre d'utilisateurs dans l'organisation et que l'usage est relativement homogene.
- **Eviter per-seat** si la valeur est concentree sur quelques power users ou si le produit est consomme individuellement sans collaboration.
- **Preferer per-active-user** au per-seat provisionne pour reduire la friction d'adoption et aligner le cout sur la valeur recue.

## Voir aussi
- [CGV SaaS](../legal/cgv-saas.md) — conditions de vente par siège
- [Multi-tenant](../architecture/multi-tenant.md) — isolation des données par organisation
- [Auth flows](../architecture/auth-flows.md) — gestion des membres et invitations
