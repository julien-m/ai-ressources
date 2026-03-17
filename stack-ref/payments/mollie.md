---
last_updated: 2026-03-16
confidence: high
category: payment
type: managed
pricing_model: [transaction-fee]
free_tier: true
---

# Mollie

> _PSP européen natif — SEPA, iDEAL, Bancontact, sans frais mensuels, idéal EU._

## Ce que c'est

Mollie est un prestataire de services de paiement (PSP) néerlandais fondé en 2004. Très populaire en Europe, particulièrement aux Pays-Bas, Belgique, Allemagne, France. Supporte toutes les méthodes de paiement locales EU (iDEAL, Bancontact, SEPA Direct Debit, Klarna, etc.). Pas de frais mensuels sur le plan standard. **Important : Mollie n'est PAS un MoR** — vous restez responsable de la TVA.

## Pricing — Pay-as-you-go (pas de frais mensuels)

### Cartes bancaires

| Carte | Frais |
|---|---|
| Visa / Mastercard (EU) | ~1.8% + €0.25 |
| Visa / Mastercard (non-EU) | ~2.8% + €0.25 |
| American Express | ~2.8% + €0.25 |

> Les taux exacts varient selon le volume et le profil de risque. Ces chiffres sont indicatifs 2026.

### Méthodes locales EU

| Méthode | Frais |
|---|---|
| SEPA Direct Debit | €0.25/transaction |
| iDEAL (NL) | €0.29/transaction |
| Bancontact (BE) | €0.29/transaction |
| SOFORT / Klarna | variable (~0.9% + €0.25) |
| PayPal | ~1.8% + €0.25 (via Mollie) |
| TWINT (CH) | ~1.5% |
| Apple Pay / Google Pay | Même tarif que la carte sous-jacente |

### Plan Growth (volume)

Tarifs négociables à partir de ~€50K/mois de volume traité.

### 💡 Exemples de calcul

- **Abonnement €29 via carte EU** → ~1.8% × €29 + €0.25 = €0.52 + €0.25 = **€0.77** de frais
- **Virement SEPA €99** → **€0.25** fixe (ultra-cheap pour gros montants)
- **Comparaison Stripe EU** → Mollie (~1.8%+€0.25) vs Stripe (1.5%+€0.25) : Mollie légèrement plus cher sur % mais même order of magnitude

## Disponibilité géographique

### Compte marchand (vous)

| Pays | Support |
|---|---|
| France | ✅ |
| EU (27 pays) | ✅ |
| UK | ✅ (post-Brexit) |
| Suisse | ✅ |
| Andorre 🇦🇩 | ❌ |

> ⚠️ **Andorre** : Andorre n'est ni dans l'UE ni dans l'EEE. Mollie requiert une entité légale dans un pays EEE/UK pour créer un compte. Un entrepreneur andorran doit avoir une entité légale dans un pays supporté.

### Clients (acheteurs)

| Pays | Support |
|---|---|
| EU / EEE | ✅ toutes méthodes |
| Andorre 🇦🇩 | ✅ cartes Visa/MC acceptées, pas d'iDEAL/Bancontact natif |
| Hors EU | ⚠️ carte internationale (+frais) |

### TVA et Andorre

Mollie n'étant pas MoR, vous restez responsable de la TVA. Pour les clients andorrans :
- Andorre n'est pas dans l'espace TVA EU
- Pas de TVA EU à collecter pour les ventes B2C digitales en Andorre
- Vérifier avec votre comptable selon votre situation

## ✅ Quand utiliser

- Business EU nécessitant **méthodes locales** (iDEAL, Bancontact, SEPA)
- Besoin de SEPA Direct Debit (€0.25 fixe — imbattable pour B2B)
- Pas de frais mensuels sur le plan standard
- API développeur-friendly avec SDK TypeScript
- Checkout sur mesure avec méthodes locales EU

## ❌ Quand ne PAS utiliser

- Besoin de MoR (gestion TVA) → Lemon Squeezy ou Paddle
- Volume majoritairement US (Stripe US natif est moins cher)
- Checkout très simple sans méthodes locales (Stripe suffisant)

## Comparaison avec Stripe EU

| | Mollie | Stripe EU |
|---|---|---|
| Carte EU | ~1.8%+€0.25 | 1.5%+€0.25 |
| iDEAL | €0.29 | €0.29 |
| SEPA DD | €0.25 | €0.35 |
| Frais mensuels | $0 | $0 |
| Couverture EU | ✅✅ natif | ✅ bon |
| Documentation | ✅ bonne | ✅✅ excellente |

## Ressources

- [Documentation](https://docs.mollie.com)
- [Pricing officiel](https://www.mollie.com/fr/pricing)
