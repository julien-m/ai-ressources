---
last_updated: 2026-03-16
confidence: high
category: email
type: managed
pricing_model: [flat, per-usage]
free_tier: true
---

# Resend

> _Email developer-first avec React Email — le standard moderne pour les apps TypeScript._

## Ce que c'est
Resend est une plateforme d'envoi d'emails transactionnels et marketing créée par l'équipe derrière **React Email**. Lancée en 2023, elle a rapidement été adoptée comme standard dans l'écosystème Next.js/React. API simple, SDK TypeScript excellent, templates via React components versionnés dans le code.

## Produits / Features clés
- **Transactionnel** — Emails API-triggered (password reset, confirmations...)
- **Marketing** — Newsletters et campagnes (par contacts)
- **React Email** — Templates email en composants React
- **Webhooks** — Events (delivered, opened, bounced, clicked)
- **Analytics** — Logs, opens, clics par email
- **Inbound email** — Réception d'emails (webhooks)

## Free Tier
| Métrique | Limite |
|---|---|
| Emails transac/mois | 3 000 |
| Emails transac/jour | 100 |
| Marketing contacts | 1 000 |
| Marketing emails | Illimité |
| Domaines | 1 |
| Membres équipe | 1 |

## Pricing — Transactionnel
### Free — $0/mois (3K emails, 100/jour)
### Pro — $20/mois
| Métrique | Inclus | Overage |
|---|---|---|
| Emails/mois | 50 000 | $0.40/1K |
| Pas de limite journalière | ✅ | — |
| Domaines | 10 | — |
| Membres | 3 | — |

### Scale — $90/mois
| Métrique | Inclus | Overage |
|---|---|---|
| Emails/mois | 100 000 | $0.65/1K |
| IP dédiée | +$30/mois | — |
| Domaines | 100 | — |
| Membres | 10 | — |

### Enterprise — sur devis (> 1M emails)
### 💡 Exemples de calcul Transactionnel
- **Side-project, < 3K emails/mois** → Free : $0/mo
- **SaaS early, ~30K emails/mois** → Pro : $20/mo
- **SaaS en croissance, 80K emails/mois** → Scale : $90/mo
- **SaaS 150K emails/mois** → Scale + overage : $90 + 50 × $0.65 = **$122.50/mo**

## Pricing — Marketing
Tarification par taille de liste de contacts.

| Contacts | Prix/mois |
|---|---|
| 0–1 000 | $0 (Free) |
| 0–3 000 | $9/mois |
| 0–5 000 | $19/mois |
| 0–10 000 | $29/mois |
| 0–50 000 | $99/mois |

> Emails illimités inclus dans chaque plan marketing.

## Performances
| Métrique | Valeur |
|---|---|
| Délivrabilité | ✅ bonne (IP partagées bien gérées) |
| Délivrabilité + IP dédiée | ✅✅ (Scale plan) |
| DKIM / SPF / DMARC | ✅ configurables |
| Latence d'envoi | < 5 secondes |
| Inbound webhooks | ✅ |
## ✅ Quand utiliser
- Stack **TypeScript / Next.js** (intégration native)
- Templates **React Email** versionnés dans le code
- Side-project ou SaaS early-stage (free tier généreux)
- Besoin d'une API propre et d'un SDK moderne
## ❌ Quand ne PAS utiliser
- Volume > 500K emails/mois sans IP dédiée (délivrabilité peut dégrader)
- Besoin de **marketing email avancé** (automations, A/B testing) → Brevo
- Budget très serré à très gros volume → Amazon SES ($0.10/1K)
- Stack PHP/non-JS où le DX Resend est moins pertinent

## Disponibilité
- Accessible **partout dans le monde** via API HTTP
- Régions de sending : US (default), EU (disponible)
- Pas de restriction géographique pour les comptes
## Combinaisons stack optimales
- **Next.js + Vercel** → `Resend + react-email`
- **Hono + Cloudflare Workers** → `Resend HTTP API (edge-compatible)`
- **Templates versionnés** → `react-email + Resend SDK`
## Ressources
- [Documentation](https://resend.com/docs)
- [Pricing officiel](https://resend.com/pricing)
- [React Email](https://react.email)
