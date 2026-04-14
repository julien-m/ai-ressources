---
last_updated: 2026-03-16
confidence: high
category: payment
type: managed
pricing_model: [transaction-fee]
free_tier: true
---

# Paddle

> _MoR enterprise pour SaaS — TVA mondiale gérée, analytics revenus, checkout optimisé._

## Ce que c'est
Paddle est un **Merchant of Record** (MoR) ciblant les SaaS en croissance et les entreprises logicielles. Plus mature et enterprise que Lemon Squeezy. Gère TVA, compliance, chargebacks, et abonnements complexes. Supporte usage-based billing. Fondé en 2012 (UK). Analyse de revenus (MRR/churn) incluse.

## Pricing
### Frais de transaction
| Type | Frais |
|---|---|
| Standard | **5% + $0.50** par transaction |
| International (hors US) | **Inclus** (pas de surcharge) |

> Paddle inclut les transactions internationales dans le prix standard — pas de frais supplémentaires pour clients hors US contrairement à Lemon Squeezy.

### Exemples de frais
- **€29 depuis France** → 5% × €29 + $0.50 = €1.45 + €0.50 ≈ **€1.95** de frais
- **$99 depuis US** → 5% × $99 + $0.50 = **$5.45** de frais
- **€99 depuis DE** → 5% × €99 + €0.50 = **€5.45** de frais

> 💡 Paddle est légèrement plus avantageux que Lemon Squeezy pour les clients EU (pas de +1.5% international).

## Disponibilité géographique
### Compte marchand (vous)
| Pays | Support |
|---|---|
| France | ✅ |
| EU (plupart) | ✅ |
| UK | ✅ |
| US | ✅ |
| Andorre 🇦🇩 | ❌ Non supporté comme pays de compte |

> ⚠️ **Andorre** : Paddle ne supporte pas les marchands andorrans. Même problème que Stripe et Lemon Squeezy — nécessite une entité légale dans un pays supporté.

### Clients (acheteurs)
| Pays | Support |
|---|---|
| EU / Monde | ✅ (Paddle gère toutes les taxes) |
| Andorre 🇦🇩 | ✅ cartes Visa/MC acceptées |

### TVA et compliance (géré par Paddle)
En tant que MoR, Paddle :
- Collecte et remet la TVA dans 200+ pays
- Gère la compliance EU VAT, GST, Sales Tax US
- Émet les factures conformes par pays
- Gère les chargebacks et remboursements
## ✅ Quand utiliser
- **SaaS B2B** nécessitant des factures conformes pour les entreprises clientes
- Vente internationale dans 50+ pays dès le lancement
- Besoin d'**analytics revenus** (MRR, churn, LTV) intégrées
- **Usage-based billing** ou modèles de facturation complexes
- Équipe technique qui ne veut pas gérer la compliance TVA
## ❌ Quand ne PAS utiliser
- Gros volume (> $200K MRR) : 5% devient très significatif → négocier Stripe ou considérer solutions custom
- Produits physiques ou marketplace non-SaaS
- Besoin de contrôle total du checkout (Paddle est moins personnalisable que Stripe)
- Support lent signalé sur les plans Starter — peut être problématique pour des incidents critiques

## Comparaison Paddle vs Lemon Squeezy
| | Paddle | Lemon Squeezy |
|---|---|---|
| Frais standard | 5% + $0.50 | 5% + $0.50 |
| Frais international | Inclus ✅ | +1.5% ⚠️ |
| Target | SaaS B2B | Indie / créateurs |
| Analytics revenus | ✅ excellent | ✅ basique |
| Usage-based billing | ✅ | ❌ limité |
| Programme affiliés | ✅ | ✅ natif |
| Complexité | Moyenne | Simple |
## Ressources
- [Documentation](https://developer.paddle.com)
- [Pricing officiel](https://www.paddle.com/pricing)
