---
last_updated: 2026-03-16
confidence: high
category: database
type: managed
pricing_model: [flat, per-usage]
free_tier: true
---

# Supabase DB

> _PostgreSQL managé avec auth, storage, realtime et Edge Functions — la Firebase open-source._

## Ce que c'est

Supabase est un BaaS (Backend-as-a-Service) open-source construit sur PostgreSQL. Il inclut DB, auth, object storage (S3-compatible), realtime (WebSockets), Edge Functions (Deno), et un dashboard. Très populaire comme alternative à Firebase. Self-hostable. Levée de fonds Série C ($80M). Fondé en 2020.

Voir aussi [`platforms/supabase.md`](../platforms/supabase.md) pour le contexte complet de la plateforme.

## Free Tier

| Métrique | Limite |
|---|---|
| Projets actifs | 2 |
| Stockage DB | 500 MB |
| Stockage fichiers | 1 GB |
| Bande passante | 5 GB |
| Edge Functions | 500K invocations/mois |
| Auth | Unlimited users (rate limited) |
| Realtime | 200 connexions simultanées |
| Pause automatique | ✅ après 7 jours d'inactivité |

> ⚠️ Les projets free se pausent après 7 jours d'inactivité. Nécessite une réactivation manuelle.

## Pricing

### Free — $0/mois

### Pro — $25/mois par organisation

| Métrique | Inclus | Overage |
|---|---|---|
| DB | 8 GB | $0.125/GB |
| Stockage fichiers | 100 GB | $0.021/GB |
| Bande passante | 250 GB | $0.09/GB |
| Edge Functions | 2M invocations | $2/1M |
| Auth (MAU) | 100K | $0.00325/MAU |
| No pause auto | ✅ | — |

### Team — $599/mois (inclut plusieurs membres, PITR, SOC2)

### Enterprise — sur devis

### 💡 Exemples de calcul

- **Side-project actif, 2GB DB, 10GB fichiers** → Pro : $25 + 0 overage = $25/mo
- **SaaS 20GB DB, 200GB fichiers, 500K users** → Pro : $25 + (12GB × $0.125) + (100GB × $0.021) + (400K × $0.00325) = ~$47/mo

## 📊 Coût estimé par palier d'utilisateurs

> **Hypothèses** : app SaaS avec auth Supabase · 20% MAU · DB croissante avec la base

| Palier | MAU | DB size | Coût estimé | Plan | Notes |
|--------|-----|---------|-------------|------|-------|
| **5k users** | 1k | ~1 GB | **$0–25/mo** | Free / Pro | Free tier tient (500MB DB, 50k MAU) |
| **15k users** | 3k | ~3 GB | **$25/mo** | Pro | Tout inclus dans Pro |
| **50k users** | 10k | ~10 GB | **$25/mo** | Pro | 10k MAU << 100k inclus |
| **100k users** | 20k | ~20 GB | **$27/mo** | Pro | Stockage overage : 12GB × $0.125 = $1.50 |
| **300k users** | 60k | ~60 GB | **$32/mo** | Pro | 60k MAU inclus · stockage overage ~$6 |
| **1M users** | 200k | ~200 GB | **$380–500/mo** | Pro | MAU overage 100k × $0.00325 = $325 + storage $24 |

> ⚠️ **Cliff à 1M** : le palier MAU (100k inclus dans Pro) crée un saut important. Si ton app atteint 500k–1M users, anticiper le passage à Team ($599/mo) ou négocier Enterprise. En dessous de 300k users, Supabase est **très compétitif** (forfait quasi-fixe $25–32/mo).

## Performances

| Métrique | Valeur |
|---|---|
| DB (PostgreSQL) | Postgres standard, indexing complet |
| Realtime | WebSockets, < 100ms typique |
| Edge Functions | Deno runtime, < 50ms cold start |
| Connection pooler | PgBouncer intégré |

## ✅ Quand utiliser

- Besoin d'un **BaaS complet** (DB + auth + storage + realtime) en un seul service
- Remplacement de Firebase avec SQL + open-source
- Petite équipe voulant éviter de gérer plusieurs services
- App avec realtime (chat, collaboration)
- Self-hosting pour données souveraines

## ❌ Quand ne PAS utiliser

- Besoin de scale-to-zero (Supabase ne scale pas à zéro comme Neon)
- Multi-région natif sans configuration manuelle
- Workloads très compute-intensifs (préférer Neon scale)
- Si on utilise déjà Neon/Turso et qu'on n'a pas besoin du BaaS

## Combinaisons stack optimales

- **App fullstack** → `Supabase + Next.js + supabase-js`
- **App mobile** → `Supabase + Flutter/React Native`
- **Remplacement Firebase** → `Supabase + Supabase Auth + Storage`

## Alternatives directes

| Alternative | Différence clé |
|---|---|
| Firebase | Propriétaire Google, NoSQL (Firestore), meilleur offline |
| Neon | Postgres pur, scale-to-zero, pas de BaaS |
| PocketBase | Self-hosted BaaS minimaliste (Go, SQLite) |
| Convex | TypeScript-first, realtime natif, moins SQL |

## Ressources

- [Documentation](https://supabase.com/docs)
- [Pricing officiel](https://supabase.com/pricing)
