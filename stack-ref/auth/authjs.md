---
last_updated: 2026-03-17
confidence: high
category: auth
type: self-hosted
pricing_model: [open-source]
free_tier: true
---

# Auth.js (NextAuth v5)

> _L'ancêtre — très répandu, en cours de modernisation vers v5._

## Ce que c'est
La lib auth la plus utilisée dans l'écosystème Next.js. Auth.js v5 est la réécriture moderne de NextAuth, framework-agnostic (Next.js, SvelteKit, Express...). Gère OAuth, credentials, magic links.

## Features clés
- OAuth providers : 50+ (Google, GitHub, Discord, Slack, Apple...)
- Email/magic link
- Credentials (email/password custom)
- Adapters DB : Prisma, Drizzle, MongoDB, Supabase...
- Sessions JWT ou DB
- Middleware Next.js pour les routes protégées

## Free tier / Pricing
Open-source MIT. Gratuit.
## ✅ Quand utiliser
- Projet Next.js existant déjà sur NextAuth v4 (migration v5)
- OAuth uniquement (pas besoin d'email/password complexe)
- Équipe déjà familière avec l'API NextAuth
- Besoin du plus grand nombre d'OAuth providers
## ❌ Quand ne PAS utiliser
- Nouveau projet → **Better Auth** est plus moderne et complet
- Besoin de multi-tenant / organizations → Better Auth
- Besoin de 2FA, passkeys out-of-the-box → Better Auth
## Alternatives directes
- Better Auth (plus moderne, recommandé pour nouveaux projets)
- Clerk (si on veut du hébergé)
## Ressources
- [authjs.dev](https://authjs.dev)
