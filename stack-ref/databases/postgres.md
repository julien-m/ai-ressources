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
| Débit | Mesurer avec les volumes, transactions et accès concurrents attendus |
| Latence | Mesurer séparément les requêtes SQL et le trajet réseau entre l'application et la base |
| Concurrence | MVCC, bonne concurrence lectures/écritures |
| Extensions | pgvector, PostGIS, TimescaleDB, etc. |

## Clés et index

- Stocker les UUID en `uuid` natif (16 octets) et utiliser le même type pour les clés étrangères. UUIDv7 est le choix par défaut pour les nouvelles clés techniques des entités. PostgreSQL 18 propose `DEFAULT uuidv7()` pour une génération en base. Générer côté application lorsque l'ID doit être disponible avant l'écriture ou que la version déployée ne fournit pas cette fonction. Choisir `bigint GENERATED … AS IDENTITY` (8 octets) lorsqu'un générateur en base suffit et que la compacité des clés compte. Consulter [les fonctions UUID](https://www.postgresql.org/docs/18/functions-uuid.html) et [les colonnes d'identité](https://www.postgresql.org/docs/18/ddl-identity-columns.html).
- Le préfixe temporel d'UUIDv7 favorise la localité des insertions dans les B-tree qui indexent l'UUID. UUIDv4 distribue les insertions dans l'arbre. PostgreSQL référence les tuples dans ses index secondaires sans recopier systématiquement la clé primaire. Mesurer les tailles, les lectures et les écritures sur la charge cible avant de chiffrer l'écart. Lire [la structure des index PostgreSQL](https://www.postgresql.org/docs/18/indexam.html).
- PostgreSQL crée l'index d'une PK ou d'une contrainte `UNIQUE` et laisse le choix de l'index sur les colonnes référençantes d'une FK. Utiliser un B-tree pour les recherches ponctuelles et les plages sélectives. Envisager un index partiel pour un sous-ensemble souvent consulté si le planificateur peut déduire son prédicat de la requête, ou un BRIN pour des plages temporelles sur une grande table dont l'ordre physique suit la date. Lire [les contraintes](https://www.postgresql.org/docs/18/ddl-constraints.html), [les index partiels](https://www.postgresql.org/docs/18/indexes-partial.html) et [les index BRIN](https://www.postgresql.org/docs/18/brin.html).
- Comparer les plans et les blocs lus avec `EXPLAIN (ANALYZE, BUFFERS)` sur des requêtes représentatives. `ANALYZE` exécute la requête, donc mesurer les écritures dans un environnement de test. La taille seule d'une table ne justifie ni un index ni son retrait. Lire [la documentation d'EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html).

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
