---
last_updated: 2026-03-16
confidence: high
category: payment
type: managed
pricing_model: [transaction-fee]
free_tier: true
---

# Lemon Squeezy

> _MoR pour indie makers et SaaS — TVA gérée, affiliés intégrés, racheté par Stripe en 2024._

## Ce que c'est
Lemon Squeezy est un **Merchant of Record** (MoR) ciblant les indépendants, créateurs et SaaS. Racheté par **Stripe** en juillet 2024 (produit indépendant maintenu). MoR signifie : Lemon Squeezy est le vendeur légal — ils gèrent la TVA mondiale, les chargebacks, et la compliance à votre place.

Inclut : checkout, abonnements, licence software (clés), programme d'affiliation natif, emails marketing.

## Pricing
### Frais de transaction
| Type | Frais |
|---|---|
| Standard | **5% + $0.50** par transaction |
| International (hors US) | **+1.5%** supplémentaire |
| Paiements récupérés via abandon de panier | **+5%** supplémentaire |

### Exemples de frais
- **€29 depuis France** → 5% + €0.50 + 1.5% = 6.5% + €0.50 = €1.885 + €0.50 = **€2.39** de frais
- **$99 depuis US** → 5% × $99 + $0.50 = $5.45 de frais
- **€99 depuis DE** → 6.5% × €99 + €0.50 = €6.44 + €0.50 = **€6.94** de frais

> 💡 Comparé à Stripe + gestion TVA manuelle, le delta de ~3.5% se justifie souvent par le temps économisé sur la conformité fiscale.

### Payouts
Lemon Squeezy paye par virement bancaire (SWIFT/SEPA). Frais de payout variables selon destination. Généralement gratuit ou quasi-gratuit pour SEPA.

## Disponibilité géographique
### Compte marchand (vous)
| Pays | Support |
|---|---|
| France | ✅ |
| EU | ✅ (plupart des pays) |
| Suisse | ✅ |
| Andorre 🇦🇩 | ❌ Non supporté comme pays de compte |
| US | ✅ |

> ⚠️ **Andorre** : Lemon Squeezy ne supporte pas les comptes marchands andorrans. Un entrepreneur andorran devrait s'inscrire via une entité dans un pays supporté.

### Clients (acheteurs)
| Pays | Support |
|---|---|
| EU / Monde | ✅ (Lemon Squeezy gère toutes les taxes) |
| Andorre 🇦🇩 | ✅ cartes acceptées, pas de TVA EU applicable |

### TVA et compliance (géré par LemonSqueezy)
En tant que MoR, Lemon Squeezy :
- Collecte et remet la TVA dans 100+ pays
- Gère la compliance EU VAT (OSS)
- Émet les factures aux clients
- Gère les remboursements et chargebacks
## ✅ Quand utiliser
- **Indépendant / micro-SaaS** voulant éviter les démarches fiscales EU
- Vente de **produits digitaux** (ebooks, templates, plugins, SaaS)
- Besoin d'un **programme d'affiliation** natif sans intégration tierce
- Marketplace simple de produits digitaux
- Budget limité et pas de comptable pour la TVA
## ❌ Quand ne PAS utiliser
- **Volume élevé** : à $10K MRR, 5%+$0.50 représente $500+/mois de frais (considérer Paddle ou Stripe + solution TVA)
- Produits physiques
- Besoin de checkout très customisé
- Compliance enterprise avec SLA garanti

## Comparaison avec Stripe
| | Stripe | Lemon Squeezy |
|---|---|---|
| Frais EU | 1.5% + €0.25 | 6.5% + $0.50 |
| Gestion TVA | ❌ vous | ✅ automatique |
| Affiliés | ❌ | ✅ natif |
| Setup | Complexe | Simple |
| Checkout customisable | ✅✅ | ✅ limité |
| Idéal pour | SaaS tech avec équipe | Solo / indie |
## Ressources
- [Documentation](https://docs.lemonsqueezy.com)
- [Pricing officiel](https://www.lemonsqueezy.com/pricing)
- [Frais détaillés](https://docs.lemonsqueezy.com/help/getting-started/fees)
