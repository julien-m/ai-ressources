---
last_updated: 2026-03-16
confidence: high
category: database
type: managed
pricing_model: [per-usage, per-seat]
free_tier: true
---

# Convex

> _BaaS TypeScript-first avec base de données réactive temps réel — "Firebase s'il était conçu pour TypeScript"._

## Ce que c'est
Convex est une plateforme backend complète incluant une base de données réactive (document store avec consistance forte), des server functions (queries/mutations/actions en TypeScript), scheduling natif, file storage, auth intégrée, et WebSocket temps réel. Fondé en 2021 par d'ex-Dropbox (infra à l'échelle de l'exabyte). Financé par a16z. **Open source** (FSL-1.1-Apache-2.0). Self-hostable via Docker + Postgres.

Architecture interne : document store transactionnel, Postgres en dessous, Raft pour la cohérence.

## Free Tier
| Métrique | Limite |
|---|---|
| Function calls | 1M/mois |
| DB bandwidth | 1 GB/mois |
| Stockage DB | 512 MB |
| File storage | 1 GB |
| Vector storage | 256 MB |
| Membres équipe | 6 |
| Déploiements | 3 (dev/staging/prod) |

## Pricing
### Starter — pay-as-you-go (scale-to-zero)
Facturation à l'usage au-delà du free tier. Idéal pour projets variables.

| Métrique | Tarif overage |
|---|---|
| Function calls | $2/M appels |
| DB bandwidth | $0.20/GB |
| Stockage DB | $0.50/GB-mois |
| File storage | $0.021/GB-mois |

### Professional — $25/membre/mois
| Métrique | Inclus |
|---|---|
| Function calls | 25M/mois |
| DB bandwidth | 25 GB/mois |
| Stockage DB | 512 MB + usage |
| PITR | ✅ |
| Membres | facturation par siège |
| Support | Prioritaire |
| EU hosting | +30% surcharge |

### 💡 Exemples de calcul
- **Side-project solo, 500K calls/mois** → Free tier : $0/mo
- **App active, 5M calls/mois, solo dev** → Starter overage : ~$8/mo
- **Équipe 2 devs, 30M calls/mois** → Pro : 2 × $25 = $50/mo
- **EU hosting (RGPD)** → Pro : $50 × 1.30 = $65/mo

> ⚠️ EU hosting disponible sur tous les plans avec surcharge de +30%.

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : app SaaS · 20% MAU · ~100 function calls Convex/utilisateur actif/jour (chaque action = 1 call)

| Palier | MAU | Calls/mois | Coût estimé | Plan | Notes |
|--------|-----|-----------|-------------|------|-------|
| **5k users** | 1k | ~3M | **$0–8/mo** | Free / Starter | Free tier : 1M inclus, overage $2/M → $4 |
| **15k users** | 3k | ~9M | **$16/mo** | Starter | 8M overage × $2 = $16 |
| **50k users** | 10k | ~30M | **$35/mo** | Pro ($25) | Pro : 25M inclus, 5M overage × $2 = $10 |
| **100k users** | 20k | ~60M | **$95/mo** | Pro | 25M inclus, 35M × $2 = $70 + $25 |
| **300k users** | 60k | ~180M | **$335/mo** | Pro | 155M overage × $2 = $310 + $25 |
| **1M users** | 200k | ~600M | **~$1 175/mo** | Pro | 575M overage × $2 = $1 150 + $25 |

> ⚠️ **Modèle de facturation agressif à grande échelle** : Convex facture chaque function call — à 1M users, le coût explose (~$1 200/mo). Convex est excellent pour des **apps ≤ 100k users** actifs. Au-delà, envisager Supabase (MAU-based) ou une architecture événementielle custom. Ajouter +30% pour EU hosting.

## Performances
| Métrique | Valeur |
|---|---|
| Latence queries (cache) | < 5ms |
| Latence mutations | 10–50ms |
| Temps réel (WebSocket) | Propagation ~10ms |
| Cohérence | Forte (pas d'eventual consistency) |
## ✅ Quand utiliser
- App **temps réel** (collaboration, chat, dashboards live)
- Équipe **TypeScript-first** voulant éviter REST/GraphQL boilerplate
- Fullstack solo/petite équipe voulant éviter l'infra DB + API
- Apps où le **typage bout-en-bout** (DB → frontend) a de la valeur
- Agents AI ou apps génératives avec besoins temps réel
## ❌ Quand ne PAS utiliser
- SQL complexe (Convex est document store, pas relationnel SQL)
- Très gros volume de données structurées relationnelles
- Besoin d'extensions Postgres (pgvector en natif moins mature)
- Équipe habituée à Postgres ne voulant pas changer de paradigme
- Multi-région actif-actif (Convex est single-region)
## Combinaisons stack optimales
- **App collaborative Next.js** → `Convex + Next.js + Clerk`
- **Chat temps réel** → `Convex + React + Convex realtime queries`
- **Dashboard live** → `Convex mutations + live queries auto-refresh`

## Self-hosting
Convex backend est open-source. Self-hosting via Docker + PostgreSQL.

```bash
docker run -d convex/backend --storage postgres://...
```
## Alternatives directes
| Alternative | Différence clé |
|---|---|
| Firebase | NoSQL Google, offline natif, moins TypeScript-first |
| Supabase | Postgres SQL, BaaS plus traditionnel |
| PocketBase | Self-hosted BaaS minimaliste |
| Neon + tRPC | Postgres + API typée, plus de contrôle mais plus de config |
## Ressources
- [Documentation](https://docs.convex.dev)
- [Pricing officiel](https://convex.dev/pricing)
- [GitHub (open-source)](https://github.com/get-convex/convex-backend)
