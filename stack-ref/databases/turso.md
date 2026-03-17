---
last_updated: 2026-03-16
confidence: high
category: database
type: managed+edge
pricing_model: [per-usage, flat]
free_tier: true
---

# Turso (libSQL)

> _SQLite à l'edge — latence microseconde, multi-tenant, réplication globale._

## Ce que c'est

Turso est un service de base de données managé basé sur **libSQL** (fork open-source de SQLite par Turso). Architecture diskless sur S3 Express + multi-tenant massif. Idéal pour le pattern "1 DB par tenant". Fondé par Glauber Costa (ex-ScyllaDB). Infrastructure basée sur AWS, migré depuis Fly.io en 2024.

**libSQL** est un fork compatible SQLite avec extensions : writes concurrents, HTTP API, réplication.

## Free Tier

| Métrique | Limite |
|---|---|
| Databases | 100 (actives) |
| Monthly Active Databases | 100 |
| Stockage total | 5 GB |
| Rows lus/mois | 500 millions |
| Rows écrits/mois | 10 millions |
| Syncs embarqués | 3 GB/mois |
| PITR (restauration) | 1 jour |

> Pas de carte bancaire requise pour le free tier.

## Pricing

### Free — $0/mois

### Developer — $4.99/mois _(ou $3.99/mois annuel)_

| Métrique | Inclus | Overage |
|---|---|---|
| Active DBs | 500 | +$0.20/DB/mois |
| Stockage | 9 GB | +$0.75/GB |
| Rows lus | 2.5 milliards | +$1/milliard |
| Rows écrits | 25 millions | +$1/million |
| Syncs | 10 GB | +$0.35/GB |
| PITR | 10 jours | — |

### Scaler — $24.92/mois _(ou ~$19.99/mois annuel)_

| Métrique | Inclus | Overage |
|---|---|---|
| Active DBs | 2 500 | +$0.05/DB/mois |
| Stockage | 24 GB | +$0.50/GB |
| Rows lus | 100 milliards | +$0.80/milliard |
| Rows écrits | 100 millions | +$0.80/million |
| Syncs | 24 GB | +$0.25/GB |
| PITR | 30 jours | — |

### Pro — $416.58/mois

Pour les workloads massifs : 250B rows lus inclus, SSO, BYOK, HIPAA, SOC2.

### 💡 Exemples de calcul

- **Side-project, 10 users, DB active 3h/jour** → Free tier suffit
- **App multi-tenant 200 tenants, ~1GB data** → Developer $4.99/mo
- **SaaS 2000 tenants, 10GB data, usage modéré** → Scaler ~$25/mo

## 📊 Coût estimé par palier d'utilisateurs

> **Hypothèses** : app SaaS · 20% MAU · ~100 req DB/utilisateur actif/jour · 80% lectures / 20% écritures

| Palier | MAU | Req/mois | Coût estimé | Plan | Notes |
|--------|-----|----------|-------------|------|-------|
| **5k users** | 1k | ~3M | **$0–5/mo** | Free / Developer | Très largement dans le free tier |
| **15k users** | 3k | ~9M | **$5/mo** | Developer | 9M lus << 2.5B inclus |
| **50k users** | 10k | ~30M | **$5/mo** | Developer | 30M lus << 2.5B inclus |
| **100k users** | 20k | ~60M | **$5/mo** | Developer | 60M lus << 2.5B inclus |
| **300k users** | 60k | ~180M | **$25/mo** | Scaler | Écrits (36M) couverts par Scaler (100M inclus) |
| **1M users** | 200k | ~600M | **$25–40/mo** | Scaler | 600M lus << 100B inclus · écrits overage ~$16 |

> 🏆 **Rapport qualité/prix exceptionnel** : Turso est l'option SQL la moins chère à toutes les échelles grâce au billing par rows et non par compute. À 1M users, ~$40/mo là où Neon ou Supabase dépassent $300-500/mo.

## Performances

| Métrique | Valeur |
|---|---|
| Latence (même région) | < 1ms |
| Latence (replica edge) | 1–10ms |
| Pas de cold start | ✅ (architecture multi-tenant) |
| Réplication | 3 à 6+ régions selon plan |

## ✅ Quand utiliser

- Architecture **database-per-tenant** (1 SQLite = 1 client)
- App mobile avec embedded replica (offline writes)
- Edge computing nécessitant du SQL
- Prototype nécessitant SQLite en prod managée
- Données géographiquement distribuées (faible latence par région)

## ❌ Quand ne PAS utiliser

- Workloads PostgreSQL complexes (pas de full SQL compatibility)
- Requêtes analytiques lourdes / JOIN complexes
- Besoin de Postgres extensions (pgvector, PostGIS, etc.)
- Équipe déjà experte en Postgres → préférer Neon/Supabase

## Combinaisons stack optimales

- **SaaS multi-tenant edge** → `Turso + Cloudflare Workers + Drizzle ORM`
- **App mobile local-first** → `Turso embedded replica + libSQL`
- **Side-project solo** → `Turso free + Bun + Hono`

## Alternatives directes

| Alternative | Différence clé |
|---|---|
| Cloudflare D1 | SQLite dans Workers, mais lié à Cloudflare |
| SQLite self-hosted | Gratuit mais pas de réplication managée |
| Neon | PostgreSQL, plus de features SQL, scale-to-zero |
| Supabase | BaaS complet, Postgres, plus cher |

## Ressources

- [Documentation](https://docs.turso.tech)
- [Pricing officiel](https://turso.tech/pricing)
- [libSQL GitHub](https://github.com/tursodatabase/libsql)
