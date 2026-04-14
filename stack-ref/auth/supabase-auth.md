---
last_updated: 2026-03-17
confidence: high
category: auth
type: managed
pricing_model: [free, per-mau]
free_tier: true
---

# Supabase Auth

> _Auth intégrée à Supabase — pertinente uniquement si déjà sur Supabase._

## Ce que c'est
Le système d'auth intégré à Supabase. Basé sur GoTrue (open-source). Gère email/password, OAuth, magic link, phone OTP. S'intègre nativement avec Row Level Security (RLS) Postgres.

## Free tier
- **50 000 MAU gratuits** sur le plan Supabase Free
- Ensuite inclus dans les plans Supabase ($25/mois Pro)

## Features clés
- Email/password, OAuth (20+ providers), magic link, phone OTP
- JWT intégrés avec les policies RLS Postgres
- Multi-factor auth (TOTP)
- SDK JS/TS, Flutter, Swift, Python
## ✅ Quand utiliser
- Déjà sur Supabase — auth incluse, zéro overhead
- Besoin de RLS Postgres avec contexte utilisateur natif
## ❌ Quand ne PAS utiliser
- Pas sur Supabase → Better Auth ou Clerk
- Multi-tenant organizations complexes → Better Auth ou Clerk

---
