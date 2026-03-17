---
last_updated: 2026-03-16
confidence: high
category: platform
type: edge
pricing_model: [flat, per-usage]
free_tier: true
---

# Cloudflare

> _Edge computing mondial — Workers, Pages, R2, D1, KV, AI, Zero Trust en un seul écosystème._

## Ce que c'est

Cloudflare est une plateforme edge qui combine CDN, DNS, sécurité (DDoS, WAF), compute (Workers), storage (R2, D1, KV), et IA. Réseau de 300+ PoPs dans le monde. Modèle edge-first : le code s'exécute au plus proche de l'utilisateur. Idéal pour les apps sans cold starts, globalement distribuées.

## Produits / Features clés

- **Workers** — Serverless JS/TS/Wasm à l'edge (V8 isolates, pas Node.js)
- **Pages** — Déploiement frontend + Pages Functions (Workers derrière)
- **R2** — Object storage S3-compatible, **sans frais d'egress**
- **D1** — SQLite edge (voir `databases/cloudflare-d1.md`)
- **KV** — Store clé-valeur eventually consistent (voir `databases/cloudflare-kv.md`)
- **Durable Objects** — State persistant transactionnel par objet (WebSockets, coordination)
- **AI** — Inférence IA à l'edge (Workers AI, Vectorize pour embeddings)
- **Queues** — Message queues durables entre Workers
- **Cron Triggers** — Cron jobs pour Workers
- **Zero Trust / Access** — Auth + tunnels privés (Cloudflare Access, Tunnel)
- **Email Routing** — Redirection email + Email Workers

## Free Tier (Workers Free)

| Produit | Limite |
|---|---|
| Workers requests | 100 000/jour |
| Workers CPU | 10ms/invocation |
| Pages | Sites illimités, 500 builds/mois |
| R2 | 10 GB stockage, 1M Class A ops, 10M Class B ops |
| D1 | 5 GB, 5M rows lus/jour, 100K écritures/jour |
| KV | 100K lectures/jour, 1K écritures/jour, 1 GB |
| AI (Workers AI) | 10K neurons/jour |

## Pricing

### Workers Paid — $5/mois

| Produit | Inclus | Overage |
|---|---|---|
| Workers requests | 10M/mois | $0.30/M |
| Workers CPU | 30M ms/mois | $0.02/M ms |
| R2 stockage | 10 GB | $0.015/GB-mois |
| R2 Class A ops | 1M | $4.50/M |
| R2 Class B ops | 10M | $0.36/M |
| R2 egress | **$0** ✅ | — |
| D1 stockage | 5 GB | $0.75/GB-mois |
| D1 lectures | 25M rows/jour | $0.001/M rows |
| D1 écritures | 50M rows/mois | $1.00/M rows |
| KV lectures | 10M/mois | $0.50/M |
| KV écritures | 1M/mois | $5.00/M |
| Queues | 1M messages | $0.40/M |

### Workers Enterprise — sur devis (SLA, support, limites custom)

### 💡 Exemples de calcul

- **App Workers 1M req/mois + 5GB R2** → $5/mo (tout dans l'inclus)
- **App Workers 50M req/mois + 50GB R2** → $5 + 40M × $0.30/M + 40GB × $0.015 = $5 + $12 + $0.60 = ~$18/mo
- **API + storage S3** → R2 remplace S3 sans egress fees : économies massives si fort egress

## Performances

| Métrique | Valeur |
|---|---|
| Latence Workers | 0–5ms (edge, pas de cold start) |
| Cold start | ❌ (V8 isolates, pas de containers) |
| Régions | 300+ PoPs mondiaux |
| CPU max/requête | 50ms (free) / 5 min (Cron, Queues) |
| Mémoire Workers | 128 MB |

## 📊 Coût estimé par palier d'utilisateurs

> **Hypothèses** : Workers + D1 + KV + R2 · app SaaS standard · ~10 req Workers/user actif/jour

| Palier | Users | Req Workers/mois | Plan | Coût estimé | Notes |
|--------|-------|-----------------|------|-------------|-------|
| **Perso / interne** | — | < 100k | Free | **$0** | Tout gratuit sous les limites |
| **Early stage** | ~1k | ~300k | Free | **$0** | Largement dans le free tier |
| **Growth** | ~10k | ~3M | Workers Paid | **$5–15/mo** | $5/mo plan + surconso D1/KV minime |
| **Scale** | ~100k | ~30M | Workers Paid | **$20–60/mo** | Req : $0.15/million après 10M inclus |
| **Hyper-scale** | ~1M+ | ~300M+ | Workers Paid | **$150–500/mo** | Très compétitif vs AWS/Vercel à ce niveau |

> 💡 **Avantage structurel CF** : pas de coût à l'idle, pas de cold start, egress R2 gratuit, D1 reads quasi-gratuits. Le stack CF est le moins cher à grande échelle pour les apps edge-native.
>
> ⚠️ **D1 limites** : 10 GB storage max sur Paid, 50k writes/jour sur Free. Au-delà de 10 GB, envisager Turso ou Neon.

## ✅ Quand utiliser

- API edge avec latence ultra-faible mondiale
- Stack entièrement Cloudflare (Workers + R2 + D1 + KV)
- Object storage sans frais d'egress (R2 = remplacement S3 moins cher)
- Auth/tunnel Zero Trust pour exposer des services privés
- CDN + sécurité pour app existante
- Cron jobs légers dans un environnement Workers

## ❌ Quand ne PAS utiliser

- Besoin de Node.js APIs non disponibles (Workers ≠ Node.js)
- Workloads CPU > 50ms par requête (limites Workers)
- Base de données PostgreSQL native (D1 est SQLite seulement)
- Équipe pas familière avec le modèle edge/isolates
- Long-running processes (Workers max 30s sur les requêtes HTTP)

## Stack Cloudflare complète recommandée

```
Frontend  : Cloudflare Pages (Next.js SSR ou SvelteKit)
API       : Cloudflare Workers (Hono framework)
DB        : D1 (SQL) + KV (config/cache) + Durable Objects (realtime)
Storage   : R2 (fichiers, assets, backups)
Auth      : Cloudflare Access (Zero Trust)
Email     : Cloudflare Email Routing
Cache     : Upstash Redis (si TTL avancé nécessaire)
```

## Comparaison R2 vs S3

| | R2 | AWS S3 |
|---|---|---|
| Stockage | $0.015/GB | $0.023/GB |
| Egress | **$0** ✅ | $0.09/GB 🚨 |
| API compatible | S3 ✅ | S3 ✅ |
| Multi-région | ✅ (auto) | Manual |
| Versioning | ✅ | ✅ |

> 💰 Pour les apps avec beaucoup d'egress (vidéos, gros fichiers), R2 est souvent 10× moins cher que S3.

## Ressources

- [Documentation Workers](https://developers.cloudflare.com/workers/)
- [Documentation R2](https://developers.cloudflare.com/r2/)
- [Pricing Workers](https://workers.cloudflare.com/#plans)
- [Hono framework (Workers-first)](https://hono.dev/)
