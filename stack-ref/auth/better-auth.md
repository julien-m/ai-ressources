---
last_updated: 2026-03-17
confidence: high
category: auth
type: self-hosted
pricing_model: [open-source]
free_tier: true
---

# Better Auth

> _La référence auth TypeScript moderne — self-hosted, batteries included, zéro vendor lock-in._

> ⭐ **Préférence personnelle** — choix par défaut pour tout projet TypeScript.

## Ce que c'est

Lib d'authentification TypeScript open-source. Tourne dans ton backend (Node/Bun/Edge), stocke dans ta DB, expose des endpoints REST + SDK client. Pas de pricing par MAU, pas de limite d'utilisateurs.

## Features clés

- Email/password, magic link, OAuth (Google, GitHub, Discord, Apple...)
- 2FA (TOTP), passkeys, anonymous auth
- Sessions stockées dans ta DB (SQLite, Postgres, MySQL, D1...)
- **Organizations / teams / multi-tenant** natif (plugin officiel)
- Admin panel plugin
- SDK React avec hooks (`useSession`, `signIn`, `signOut`)
- Compatible : Next.js, Hono, Elysia, Express, Cloudflare Workers, Bun

## Free tier / Pricing

Open-source MIT. **Zéro coût.** Tu payes uniquement ton infra DB.

## ✅ Quand utiliser

- Projet TypeScript, contrôle total sur l'auth
- Multi-tenant / organizations sans surcoût
- Pas de budget Clerk
- DB déjà présente → auth dans la même DB
- Cloudflare Workers / edge

## ❌ Quand ne PAS utiliser

- Dashboard utilisateur hébergé clé en main → Clerk
- Équipe non-tech qui gère les users manuellement → Clerk
- Projet non-TypeScript

## Combinaisons stack
- `Better Auth + Drizzle + Neon` → SaaS Next.js standard
- `Better Auth + D1` → auth Cloudflare Workers edge
- `Better Auth + Turso` → auth edge multi-région

## Ressources
- [better-auth.com](https://better-auth.com)
- [GitHub](https://github.com/better-auth/better-auth)
