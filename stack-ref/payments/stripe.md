---
last_updated: 2026-03-16
confidence: high
category: payment
type: managed
pricing_model: [transaction-fee]
free_tier: true
---

# Stripe

> _Le standard mondial du paiement développeur — API first, flexible, mais sans gestion TVA._

## Ce que c'est
Stripe est le leader mondial des paiements en ligne pour les développeurs. Créé en 2010 par Patrick et John Collison. Supporte 135+ devises, 100+ méthodes de paiement, abonnements, marketplaces, etc. **Important : Stripe n'est PAS un Merchant of Record** — vous restez responsable de la collecte et déclaration de la TVA.

En 2024, Stripe a acquis Lemon Squeezy. En 2026, ils testent en private beta leur propre solution MoR (+3.5% supplémentaire).

## ⚠️ Stripe ≠ MoR — Impact TVA
Avec Stripe, **vous** devez :
- Calculer la TVA par pays client
- La collecter dans vos prix
- La déclarer dans chaque pays EU (ou utiliser le guichet unique OSS)
- Gérer la conformité par vous-même

→ Pour éviter ça : Lemon Squeezy ou Paddle (MoR).

## Pricing — Standard (pay-as-you-go)
### Frais de base par région
| Région | Carte locale | Carte internationale | Conversion devise |
|---|---|---|---|
| EU (ex: France) | 1.5% + €0.25 | 3.0% + €0.25 | +1.0% |
| US | 2.9% + $0.30 | 3.9% + $0.30 | +1.0% |
| UK | 1.5% + 20p | 3.25% + 20p | +1.0% |

> Amex : ~0.5-1% supplémentaire selon région.

### Frais additionnels
| Service | Frais |
|---|---|
| Litige/chargeback | $15 (non remboursé si perdu) |
| Paiement manuel (keyed-in) | +0.5% |
| Radar (anti-fraude) | $0.05-$0.07/transaction |
| Stripe Billing (abonnements) | +0.7% par transaction |
| Stripe Invoicing | +0.4-0.5% |
| Paiement instantané (Instant Payouts) | 1% |
| ACH (US uniquement) | 0.8% (max $5) |

### Pricing Enterprise (> $1M/an de volume)
Tarifs interchange+ négociables, typiquement 2.2%+$0.30 pour US.

### 💡 Exemples de calcul
- **Abonnement $49/mois, client EU** → 1.5%×$49 + €0.25 = ~€0.99 par transaction
- **Abonnement $49/mois, client US → FR (international)** → 3.0%×$49 + €0.25 = ~€1.72
- **$50K/mois de volume EU (tout local)** → ~1.5% × $50K + 1000 × €0.25 = ~$1000/mo
- **SaaS avec 100 abonnements €29/mo EU** → Stripe Billing : (1.5% + 0.7%) × €29 × 100 = ~€63.8/mo

## Disponibilité géographique
### Compte marchand (vous)
| Pays | Support |
|---|---|
| France | ✅ |
| Suisse | ✅ |
| EU (27 pays) | ✅ |
| Andorre 🇦🇩 | ❌ Pas de compte Stripe marchand andorran |
| 46 pays total | ✅ |

> ⚠️ **Andorre** : Pas dans l'EEE, Stripe ne supporte pas les comptes marchands andorrans. Un entrepreneur andorran devrait créer une entité légale dans un pays Stripe supporté (France, Espagne...).

### Clients (acheteurs)
| Pays | Support |
|---|---|
| EU / EEE | ✅ toutes cartes |
| Andorre 🇦🇩 | ✅ cartes Visa/MC andorranes acceptées |
| Monde | ✅ 135+ pays |

### TVA Andorre
Andorre n'est pas dans l'UE ni dans l'espace TVA EU. Si vous vendez à un client andorran, il n'y a pas de TVA EU à appliquer (Andorre a sa propre taxe indirecte, l'IGI, qui vous concerne généralement pas en tant que vendeur étranger digital).
## ✅ Quand utiliser
- Contrôle total sur le checkout et l'expérience de paiement
- Équipe capable de gérer la TVA soi-même (comptable, Taxjar, etc.)
- Vente principalement dans 1-2 pays
- Marketplace ou plateforme (Stripe Connect)
- Besoin d'une API très complète et flexible
## ❌ Quand ne PAS utiliser
- Indépendant/solo vendant à une clientèle internationale EU → **Lemon Squeezy/Paddle**
- Pas de ressources pour gérer la conformité TVA → **MoR**
- Volume > $1M/an sans négociation (chercher des alternatives plus compétitives)
## Combinaisons stack optimales
- **SaaS EU simple** → `Stripe + stripe-js + Stripe Billing`
- **Marketplace** → `Stripe Connect`
- **Abonnements avec facturation** → `Stripe Billing + Stripe Invoicing`
## Ressources
- [Documentation](https://stripe.com/docs)
- [Pricing officiel](https://stripe.com/pricing)
- [Stripe EU pricing](https://stripe.com/fr/pricing)
