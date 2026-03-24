# Merchant of Record — Guide pour SaaS indie

Comprendre et choisir le modèle Merchant of Record (MoR) pour un SaaS en tant que développeur indépendant sous droit français.

## Définition

Le **Merchant of Record** (MoR) est l'entité légale qui apparaît comme vendeur sur la transaction. C'est le MoR — et non le développeur — qui :

- Émet la facture au client final.
- Collecte et reverse la TVA dans chaque pays.
- Gère les remboursements et les litiges (chargebacks).
- Assume la responsabilité fiscale et réglementaire de la vente.

Le développeur reçoit un versement net du MoR, diminué des frais et taxes.

### Schéma simplifié

| Modèle | Vendeur légal | Responsable TVA | Facture au client |
|--------|---------------|-----------------|-------------------|
| **MoR (Paddle, LemonSqueezy)** | Le MoR | Le MoR | Émise par le MoR |
| **Processeur de paiement (Stripe)** | Le développeur | Le développeur | Émise par le développeur |

## Comparatif des providers MoR

### Paddle

| Critère | Détail |
|---------|--------|
| Frais | 5 % + 0,50 € par transaction |
| Modèle MoR | Oui — Paddle est le vendeur légal |
| Couverture TVA | Mondiale (200+ pays) |
| Devises | 20+ devises |
| Produits supportés | SaaS, abonnements, licences, one-time |
| Facturation | Factures émises par Paddle au client |
| Checkout | Overlay ou inline, personnalisable |
| Payout | Mensuel ou bimensuel, virement bancaire |
| Dashboard | Complet (analytics, churn, MRR) |
| API | REST + webhooks |
| Limites | Pas de marketplace, pas adapté aux produits physiques |

### Lemon Squeezy

| Critère | Détail |
|---------|--------|
| Frais | 5 % + 0,50 € par transaction |
| Modèle MoR | Oui — Lemon Squeezy est le vendeur légal |
| Couverture TVA | Mondiale |
| Devises | 30+ devises |
| Produits supportés | SaaS, abonnements, produits numériques, licences |
| Facturation | Factures émises par Lemon Squeezy |
| Checkout | Overlay, personnalisable |
| Payout | Mensuel, virement bancaire ou PayPal |
| Dashboard | Moderne, orienté créateurs et indie devs |
| API | REST + webhooks |
| Limites | Plus récent, écosystème d'intégrations moins mature |

### Stripe (comparaison — PAS un MoR)

| Critère | Détail |
|---------|--------|
| Frais | 1,5 % + 0,25 € (EEE) / 3,25 % + 0,25 € (hors EEE) |
| Modèle MoR | **Non** — le développeur est le vendeur |
| Stripe Tax | Add-on : +0,5 % par transaction (calcul TVA uniquement) |
| Couverture TVA | Calcul automatique, mais **déclaration et versement à la charge du développeur** |
| Devises | 135+ devises |
| Facturation | À la charge du développeur (Stripe Invoicing ou outil tiers) |
| Produits supportés | Tout type |
| Avantages | Frais plus bas, contrôle total, écosystème très riche |
| Inconvénients | Responsabilité TVA, facturation, conformité à gérer soi-même |

## Table comparative synthétique

| Critère | Paddle | Lemon Squeezy | Stripe (ref.) |
|---------|--------|---------------|---------------|
| Est MoR | Oui | Oui | Non |
| Frais par transaction | 5 % + 0,50 € | 5 % + 0,50 € | ~1,5-3,25 % + 0,25 € |
| Gestion TVA incluse | Oui | Oui | Non (Stripe Tax = calcul seul) |
| Facturation client | Par le MoR | Par le MoR | Par le développeur |
| Couverture pays | 200+ | Mondiale | 47 pays (Stripe Tax) |
| Devises acceptées | 20+ | 30+ | 135+ |
| Payout | Bimensuel / mensuel | Mensuel | Glissant (J+2 à J+7) |
| Dashboard analytics | Oui | Oui | Basique (Stripe Dashboard) |
| API et webhooks | Oui | Oui | Oui (très complet) |
| Maturité | Élevée (2012) | Moyenne (2021) | Très élevée (2010) |
| Marketplace / multi-vendeur | Non | Non | Oui (Connect) |
| Produits physiques | Non | Limité | Oui |
| Self-serve refunds client | Configurable | Configurable | Non (via dashboard dev) |

## Avantages MoR pour un indie dev

### Zéro gestion TVA

- Pas d'inscription TVA dans chaque pays européen.
- Pas de déclaration OSS (One-Stop Shop).
- Pas de veille réglementaire sur les taux et seuils.
- Le MoR gère la TVA mondiale : collecte, déclaration, versement.

### Conformité automatique

- Factures conformes émises automatiquement.
- Gestion des règles de taxation par pays.
- Conformité avec les réglementations locales (ex : facture électronique Italie, Brésil, etc.).

### Réduction de la charge administrative

- Une seule facture à comptabiliser : celle du MoR vers le développeur.
- Pas de gestion des chargebacks ni des litiges de paiement.
- Pas de PCI-DSS à gérer.

### Simplicité de démarrage

- Pas besoin de numéro de TVA intracommunautaire dès le lancement.
- Pas de configuration complexe de la facturation.
- Focus sur le produit plutôt que sur la comptabilité.

## Inconvénients du modèle MoR

| Inconvénient | Impact | Mitigation |
|--------------|--------|------------|
| Frais plus élevés (~5 % vs ~1,5 %) | Marge réduite de ~3,5 points | Rentable si le temps gagné sur l'admin > le surcoût |
| Moins de contrôle sur le checkout | Expérience de paiement standardisée | Personnalisation possible (couleurs, logo) |
| Branding sur les factures | Le nom du MoR apparaît, pas celui du dev | Mention du nom du produit en sous-titre |
| Lock-in | Migration vers Stripe = reprendre la TVA | Anticiper et documenter les clients/abonnements |
| Délai de payout plus long | Trésorerie impactée vs Stripe (J+2) | Planifier le besoin en fonds de roulement |
| Support client indirect | Le MoR gère les litiges de paiement | Bien configurer les politiques de remboursement |
| Limitations produit | Pas de marketplace, pas de physique | Vérifier la compatibilité avant de s'engager |

## Quand choisir MoR vs Stripe direct

### Choisir un MoR si

- [ ] Solo dev ou petite équipe sans ressource admin/compta dédiée.
- [ ] Clients dans plusieurs pays (surtout hors France).
- [ ] Pas envie de gérer la TVA multi-pays (OSS, enregistrements locaux).
- [ ] Volume de transactions < 50 000 euros/an (le surcoût est absorbé par le gain de temps).
- [ ] Priorité : expédier le produit rapidement, pas optimiser les frais de paiement.

### Choisir Stripe direct si

- [ ] Clients principalement en France ou dans un seul pays.
- [ ] Volume élevé (> 100 000 euros/an) où 3,5 % de différence pèse.
- [ ] Besoin de contrôle total sur la facturation et l'expérience de paiement.
- [ ] Comptable ou expert-comptable déjà en place pour gérer la TVA.
- [ ] Besoins spécifiques : marketplace (Stripe Connect), produits physiques, paiements en personne.

### Zone grise (10 000 – 100 000 euros/an)

À ce stade, les deux options sont viables. Critère de départage : le temps disponible pour l'administratif. Si le développeur préfère coder plutôt que gérer la TVA, le MoR reste pertinent.

## Impact comptable

### Avec un MoR

| Flux | Document | Comptabilisation |
|------|----------|------------------|
| Vente au client | Facture émise par le MoR (pas par le dev) | Rien à enregistrer côté dev |
| Payout du MoR vers le dev | Relevé / facture du MoR | Produit (chiffre d'affaires) |
| Commission du MoR | Déduite du payout | Charge (frais de commission) |

Le développeur reçoit **une seule facture ou un relevé** du MoR chaque mois. La comptabilité se résume à enregistrer le payout net + la commission.

### Sans MoR (Stripe direct)

| Flux | Document | Comptabilisation |
|------|----------|------------------|
| Vente au client | Facture émise par le dev | Produit + TVA collectée |
| Encaissement Stripe | Relevé Stripe | Rapprochement bancaire |
| Frais Stripe | Relevé Stripe | Charge |
| TVA | Déclaration TVA (FR + OSS si multi-pays) | Reversement TVA |

Chaque transaction génère une écriture comptable. La TVA doit être déclarée et reversée.

## TVA intra-EU : OSS vs délégation MoR

### OSS vs MoR

| Aspect | OSS (Stripe + déclaration dev) | MoR (Paddle, LemonSqueezy) |
|--------|-------------------------------|----------------------------|
| Principe | Guichet unique TVA via impots.gouv.fr | Le MoR gère toute la TVA |
| Seuil | 10 000 euros ventes intra-UE B2C | Aucun seuil, pris en charge dès le départ |
| Déclaration | Trimestrielle, par le dev | Aucune (transparente) |
| Avantage | Frais de paiement plus bas | Zéro charge déclarative |
| Inconvénient | Charge déclarative, calcul des taux | Frais plus élevés |

### Résumé décisionnel

| Situation | Recommandation |
|-----------|----------------|
| < 10 000 euros ventes intra-UE B2C | Stripe + TVA française uniquement |
| > 10 000 euros ventes intra-UE B2C, dev solo | MoR (pas d'OSS à gérer) |
| > 10 000 euros ventes intra-UE B2C, comptable dispo | Stripe + OSS |
| Ventes mondiales (hors UE inclus) | MoR fortement recommandé |
| B2B uniquement (autoliquidation) | Stripe direct (TVA simplifiée) |

## Voir aussi
- [CGV SaaS](cgv-saas.md) — conditions de vente directe (alternative au MoR)
- [Usage-based pricing](../pricing-models/usage-based.md) — facturation complexe
- [Stripe](../stack-ref/payments/stripe.md) — paiement direct sans MoR
