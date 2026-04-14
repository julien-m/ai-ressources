---
last_updated: 2026-03-16
confidence: high
category: database
type: managed
pricing_model: [per-usage]
free_tier: true
---

# Neon

> _PostgreSQL serverless avec scale-to-zero, branching Git-like et séparation compute/storage._

## Ce que c'est
Neon est un PostgreSQL serverless managé basé sur une architecture qui sépare le stockage du calcul. Acquis par **Databricks** en mai 2025, ce qui a permis une baisse significative des prix (~25% compute, stockage de $1.75 → $0.35/GB-mois). Supporte le branching de DB (comme les branches Git), scale-to-zero natif, PITR instant. Open source. Hébergé sur AWS.

## Free Tier
| Métrique | Limite |
|---|---|
| Projets | 100 |
| Compute | 100 CU-heures/mois **par projet** |
| Stockage | 0.5 GB par projet |
| Scale-to-zero | ✅ (après 5 min d'inactivité) |
| Branches | 10 par projet |
| Taille max instance | 2 CU = 8 GB RAM |
| PITR | 6 heures |
| Neon Auth | 60K MAU inclus |

> ✅ Pas de carte bancaire, pas d'expiration. 100 CU-heures/mois ≈ DB active ~3h/jour à 1 CU.

## Pricing
### Free — $0/mois
Voir ci-dessus.

### Launch — usage-based (typique ~$15/mo)
| Métrique | Tarif |
|---|---|
| Compute | $0.106/CU-heure |
| Stockage DB | $0.35/GB-mois |
| Stockage PITR | $0.20/GB-mois |
| Branches extra | $0.002/heure |
| Egress | 100 GB inclus, puis $0.10/GB |

> 1 CU = 1 vCPU + 4 GB RAM. Jusqu'à 16 CU (64 GB RAM). PITR jusqu'à 7 jours.

### Scale — usage-based (typique ~$700/mo)
| Métrique | Tarif |
|---|---|
| Compute | $0.222/CU-heure |
| Stockage DB | $0.35/GB-mois |
| Stockage PITR | $0.20/GB-mois |
| Branches | 25 incluses, +$0.002/heure |

> Jusqu'à 56 CU (224 GB RAM). PITR 30 jours. SOC2, HIPAA, export metrics.

### 💡 Exemples de calcul
- **Side-project inactif (3h/jour, 1 CU, 1GB)** → Launch : 90 CU-h × $0.106 + 1GB × $0.35 = ~$9.90/mo
- **Petit SaaS (toujours actif, 0.25 CU, 5GB)** → Launch : 187.5 CU-h × $0.106 + 5 × $0.35 = ~$21.6/mo
- **App production (2 CU moyen, 20GB)** → Launch : 1440 CU-h × $0.106 + 20 × $0.35 = ~$159/mo

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : app SaaS · 20% MAU · ~100 req DB/utilisateur actif/jour · scale-to-zero joue en faveur des petites apps

| Palier | MAU | Compute actif/jour | DB size | Coût estimé | Notes |
|--------|-----|-------------------|---------|-------------|-------|
| **5k users** | 1k | 0.25 CU · 4h | ~1 GB | **$5–15/mo** | Scale-to-zero très avantageux |
| **15k users** | 3k | 0.25 CU · 8h | ~3 GB | **$10–20/mo** | Launch plan |
| **50k users** | 10k | 0.5 CU · 12h | ~10 GB | **$30–60/mo** | Compute augmente nettement |
| **100k users** | 20k | 1 CU · 16h | ~20 GB | **$80–130/mo** | Besoin compute permanent |
| **300k users** | 60k | 2 CU · 20h | ~60 GB | **$250–400/mo** | Scale plan recommandé |
| **1M users** | 200k | 4 CU · 22h | ~200 GB | **$700–1 200/mo** | Scale plan · envisager Postgres self-hosted |

> ⚠️ **Scale-to-zero a ses limites** : à partir de 100k users, le compute tourne presque en permanence et l'avantage scale-to-zero disparaît. Comparer avec Supabase Pro (forfait fixe) ou Postgres self-hosted sur Fly.io à ce niveau.

## Performances
| Métrique | Valeur |
|---|---|
| Cold start (scale-to-zero) | ~350ms (configurable) |
| Autoscaling | ✅ 0.25 → 16 CU selon charge |
| Latence typique | 1–10ms (même région) |
| Connection pooling | pgBouncer intégré (10K connexions) |
## ✅ Quand utiliser
- PostgreSQL serverless avec **scale-to-zero** (dev, staging, prod intermittente)
- Branching de DB pour preview/test environments (CI/CD)
- Workloads variables / bursty avec coûts proportionnels à l'usage
- Agents AI nécessitant des DB éphémères
- Équipe voulant Postgres sans gérer l'infra
## ❌ Quand ne PAS utiliser
- Workload constant haute fréquence (scale plan peut revenir cher vs instance fixe)
- Besoin de contrôle complet de l'infra / données souveraines
- Très gros volumes analytiques (préférer un warehouse)
- Si déjà sur Supabase et satisfait
## Combinaisons stack optimales
- **Next.js + Vercel** → `Neon + Drizzle + Vercel`
- **App serverless** → `Neon + Prisma/Drizzle + Hono`
- **CI/CD avec DB éphémère** → `Neon branching par PR`
## Alternatives directes
| Alternative | Différence clé |
|---|---|
| Supabase | BaaS complet (auth + storage + realtime) mais moins flexible sur compute |
| Turso | SQLite/edge, moins de features SQL, multi-tenant natif |
| PlanetScale | MySQL/Vitess, pas de free tier, très scalable |
| CockroachDB | Multi-région natif, plus cher, compatible Postgres |
## Ressources
- [Documentation](https://neon.tech/docs)
- [Pricing officiel](https://neon.com/pricing)
