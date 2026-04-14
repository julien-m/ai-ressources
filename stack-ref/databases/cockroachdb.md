---
last_updated: 2026-03-16
confidence: medium
category: database
type: managed
pricing_model: [per-usage, flat]
free_tier: true
---

# CockroachDB

> _PostgreSQL-compatible distribué, multi-région natif, conçu pour survivre aux pannes datacenter._

## Ce que c'est
CockroachDB est une base de données SQL distribuée, compatible wire PostgreSQL, conçue pour la tolérance aux pannes totales (zéro downtime) et le déploiement multi-région actif-actif. Architecture inspirée de Google Spanner. Créée par des ex-Google (Andy Kimball, Spencer Kimball). Open source (BSL + Apache). Utilisé par Bose, Comcast, et autres enterprises.

Stack interne : Go, Raft consensus, TigerBeetle-style transactions.

## Free Tier (Serverless)
| Métrique | Limite |
|---|---|
| Stockage | 10 GB |
| Compute | 50M RUs/mois (Request Units) |
| Clusters | illimité |
| Régions | 1 (shared) |

> ⚠️ Le free tier serverless partage des ressources. Pas de SLA.

## Pricing
### Serverless — usage-based
| Métrique | Tarif |
|---|---|
| RUs (Request Units) | $1/10M RUs (au-delà du free) |
| Stockage | $1/GiB-mois (au-delà de 10GB) |

> 1 RU ≈ 1 batch simple de lecture/écriture

### Dedicated — à partir de ~$295/mois
Cluster dédié avec nœuds réservés. Pricing basé sur les vCPUs et le stockage.

| Config | Prix estimé |
|---|---|
| 2 vCPU, 8 GB RAM, 1 région | ~$295/mo |
| 3 nœuds × 4 vCPU, 3 régions | ~$900+/mo |

### 💡 Exemples de calcul
- **Prototype / staging** → Serverless free : $0/mo
- **App production 1 région** → Dedicated 2vCPU : ~$295/mo
- **SaaS global multi-région** → Dedicated 3 régions : $900+/mo

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : app SaaS · 20% MAU · ~280 RU/utilisateur actif/jour (80 reads × 1 RU + 20 writes × 10 RU) · stockage ~0.2 KB/user

| Palier | MAU | RU/mois | Stockage | Coût estimé | Plan | Notes |
|--------|-----|---------|----------|-------------|------|-------|
| **5k users** | 1k | ~8.4M | ~1 GB | **$0/mo** | Serverless free | 8.4M < 10M inclus |
| **15k users** | 3k | ~25.2M | ~3 GB | **$2/mo** | Serverless | 15M overage × $0.10 = $1.5 |
| **50k users** | 10k | ~84M | ~10 GB | **$7/mo** | Serverless | 74M overage = $7.40 |
| **100k users** | 20k | ~168M | ~20 GB | **$27/mo** | Serverless | RU: $15.8 + stockage 10GB × $1 = $10 |
| **300k users** | 60k | ~504M | ~60 GB | **$95/mo** | Serverless | RU: $45 + stockage 50GB × $1 = $50 |
| **1M users** | 200k | ~1.68B | ~200 GB | **$360/mo** | Serverless ou Dedicated | RU: $168 + stockage $190 → Dedicated 2vCPU $295 plus prévisible |

> 💡 **Quand passer Dedicated** : au-delà de ~$200/mo en Serverless, un cluster Dedicated 2 vCPU ($295/mo) devient plus économique et prévisible. CockroachDB brille dans les architectures **multi-région** avec forte consistance — pour une app mono-région, Neon ou Supabase sont moins chers.

## Performances
| Métrique | Valeur |
|---|---|
| Latence (même région) | 5–20ms |
| Latence (multi-région) | 50–200ms (cross-region write) |
| Throughput | Horizontal scaling natif |
| Disponibilité | 99.999% (5 nines) sur dedicated |
| RTO / RPO | Quasi-zéro (Raft replication) |
## ✅ Quand utiliser
- Besoin de **haute disponibilité sans downtime** (pas de failover manuel)
- App multi-région **active-active** (pas master/replica)
- Régulations de localité des données (GDPR data residency)
- Transactions globales avec **consistency forte** (pas eventual)
- Scale horizontal illimité sur PostgreSQL-compatible
## ❌ Quand ne PAS utiliser
- Petit projet / budget limité (Neon ou Supabase sont beaucoup moins chers)
- Besoin uniquement d'une DB single-région simple
- Latence ultra-basse (<5ms) pour writes (la coordination Raft ajoute de la latence)
- Stack SQLite ou MySQL (pas compatible)
## Combinaisons stack optimales
- **SaaS global enterprise** → `CockroachDB + Prisma/Drizzle + Cloud Run`
- **Fintech / banking** → `CockroachDB Dedicated + compliance settings`
## Alternatives directes
| Alternative | Différence clé |
|---|---|
| Neon | Postgres serverless scale-to-zero, mono-région, moins cher |
| PlanetScale | MySQL/Vitess, horizontal scale, pas de multi-région natif |
| Google Spanner | Enterprise, très cher, Google Cloud only |
| AWS Aurora Global | Multi-région mais replication lag (pas actif-actif) |
## Ressources
- [Documentation](https://www.cockroachlabs.com/docs/)
- [Pricing officiel](https://www.cockroachlabs.com/pricing/)
