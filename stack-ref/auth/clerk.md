---
last_updated: 2026-03-17
confidence: high
category: auth
type: managed
pricing_model: [free, per-mau]
free_tier: true
---

# Clerk

> _Auth hébergée clé en main — DX excellent, dashboard utilisateur inclus._

## Ce que c'est

Service d'authentification managé. Clerk héberge tout — users, sessions, tokens. Tu intègres leurs composants React et SDK. Pas de code auth à écrire.

## Free tier

- **10 000 MAU gratuits**
- Composants UI inclus (sign-in, sign-up, user profile, organization switcher)
- OAuth, email/password, magic link, SMS, passkeys

## Pricing

| MAU | Prix/mois |
|-----|-----------|
| 0–10k | Gratuit |
| 10k–100k | $25/mois (Pro) |
| 100k+ | ~$0.02/MAU |

> ⚠️ À 100k MAU → $2 000/mois. Coût à anticiper si croissance.

## Features clés

- Composants UI prébuiltés (personnalisables)
- Organizations / multi-tenant
- Dashboard admin hébergé pour gérer les users
- Webhooks sur events auth
- B2B auth natif (invitations, rôles par org)
- MFA, passkeys, device management

## ✅ Quand utiliser

- MVP rapide, pas envie de coder l'auth
- Équipe non-tech qui doit gérer les users via dashboard
- B2B SaaS avec organizations complexes
- Budget early stage avant d'atteindre 10k MAU (gratuit)

## ❌ Quand ne PAS utiliser

- Croissance > 10k MAU prévue rapidement → coût élevé
- Besoin de contrôle total sur les données → Better Auth
- Pas de budget à l'échelle → Better Auth

## Alternatives directes
- Better Auth (self-hosted, zéro coût à l'échelle)
- Supabase Auth (si déjà sur Supabase)

## Ressources
- [clerk.com](https://clerk.com)
- [Pricing](https://clerk.com/pricing)
