---
last_updated: 2026-03-16
confidence: high
category: database
type: self-hosted
pricing_model: [free]
free_tier: true
---

# PostgreSQL (self-hosted)

> _La base de données relationnelle open-source la plus avancée au monde._

## Ce que c'est
PostgreSQL (Postgres) est un SGBD relationnel open-source, BSD-licensed, développé depuis 1986 à UC Berkeley. Standard de facto pour les applications web sérieuses. Supporte JSON(B), arrays, full-text search, extensions (pgvector, PostGIS, TimescaleDB...), transactions ACID, triggers, CTEs récursives, window functions, etc.

Auto-hébergeable partout : Docker, Linux, macOS, Infomaniak Jelastic, Fly.io, AWS EC2, etc.

## Free Tier
**Gratuit** à héberger soi-même. Coût = hébergement uniquement.

## Pricing (self-hosted estimé)
| Option | Prix estimé |
|---|---|
| Docker local / dev | $0 |
| Fly.io (256MB RAM) | ~$2/mo |
| Infomaniak Jelastic (512MB RAM) | ~€5/mo |
| AWS RDS t3.micro | ~$15/mo |
| Infomaniak Public Cloud (1 vCPU, 2GB) | ~€15/mo |
| AWS RDS t3.medium | ~$55/mo |

### 💡 Comparaison managed vs self-hosted
- **Self-hosted 1GB RAM sur Fly.io** → ~$10/mo (compute + storage)
- **Neon Launch équivalent** → ~$15/mo (mais scale-to-zero, zéro gestion)
- **Supabase Pro** → $25/mo (mais BaaS complet inclus)

## Performances
| Métrique | Valeur |
|---|---|
| Throughput | Dépend du hardware (10K–100K+ req/s) |
| Latence | < 1ms (local), 1–5ms (même datacenter) |
| Concurrence | MVCC, bonne concurrence lectures/écritures |
| Extensions | pgvector, PostGIS, TimescaleDB, etc. |
## ✅ Quand utiliser
- Contrôle total des données (souveraineté, RGPD strict)
- Workloads SQL complexes nécessitant des extensions spécifiques
- Déjà une infra Docker/VPS gérée
- Budget faible si déjà un VPS (coût marginal ~$0)
- Migrations complexes où le managed ajouterait des contraintes
## ❌ Quand ne PAS utiliser
- Pas de temps/compétence pour gérer backups, failover, mises à jour
- Besoin de scale-to-zero ou scaling automatique
- Équipe petite sans expertise ops
- Prototype rapide (préférer Neon free ou Supabase free)
## Combinaisons stack optimales
- **VPS existant** → `Postgres + Docker Compose + pgbackrest`
- **Fly.io** → `Postgres Fly managed (fly postgres create)`
- **Infomaniak** → `Jelastic PostgreSQL module`
## Alternatives directes
| Alternative | Différence clé |
|---|---|
| Neon | Postgres managé scale-to-zero, moins de gestion |
| Supabase | BaaS sur Postgres, ready-to-use |
| MySQL | Autre SQL populaire, moins de features avancées |

## Extensions populaires
| Extension | Usage |
|---|---|
| pgvector | Embeddings / RAG / IA |
| PostGIS | Géospatial |
| TimescaleDB | Time-series |
| pg_cron | Jobs schedulés dans la DB |
| uuid-ossp | UUIDs automatiques |
## Ressources
- [Documentation](https://www.postgresql.org/docs/)
- [pgvector](https://github.com/pgvector/pgvector)
- [Fly.io Postgres](https://fly.io/docs/postgres/)
