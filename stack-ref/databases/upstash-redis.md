---
last_updated: 2026-03-16
confidence: high
category: database
type: managed+edge
pricing_model: [per-request, flat]
free_tier: true
---

# Upstash Redis

> _Redis serverless HTTP-first — edge-compatible, réplication globale, TTL et pub/sub managés._

## Ce que c'est
Upstash est une plateforme de données serverless incluant Redis, QStash (messaging), et Vector Database. **Upstash Redis** est une implémentation Redis-compatible accessible via HTTP (et TCP pour compatibilité). Conçu pour les environnements serverless et edge (Cloudflare Workers, Vercel Edge, Deno Deploy). Réplication dans 8+ régions. Persistance toujours activée (contrairement à Redis standard).

## Free Tier
| Métrique | Limite |
|---|---|
| Commandes/mois | 500 000 |
| Taille données | 256 MB |
| Bandes passante | 50 GB |
| Bases de données | 1 |
| Régions | 1 |

## Pricing
### Pay-as-you-go — variable
| Métrique | Tarif |
|---|---|
| Commandes | $0.20 / 100K requêtes |
| Stockage | $0.25/GB |
| Bande passante | 200 GB gratuit, puis $0.03/GB |
| Max ops/sec | 10 000 |

### Fixed Plans (pour usage constant / queues agressives)
| Plan | Taille | Bande passante | Prix |
|---|---|---|---|
| Fixed-250MB | 250 MB | inclus | $10/mo |
| Fixed-1GB | 1 GB | inclus | $40/mo |
| Fixed-5GB | 5 GB | inclus | $120/mo |
| Fixed-10GB | 10 GB | inclus | $200/mo |
| Fixed-50GB | 50 GB | inclus | $400/mo |
| Fixed-100GB | 100 GB | inclus | $800/mo |

### Prod Pack — +$200/mois par DB
Add-on production : SLA 99.99%, SOC2, RBAC, encryption at rest, Prometheus/Datadog, HA pour régions de lecture.

### 💡 Exemples de calcul
- **Cache léger, 50K req/jour** → PAYG : 50K × 30 × ($0.20/100K) = ~$3/mo (free tier couvre)
- **App avec 1M req/jour (cache + sessions)** → PAYG : 30M/mois × $0.20/100K = $60/mo → Fixed-1GB $40 probable moins cher
- **Queue BullMQ aggressive (polling Redis)** → Fixed plan pour éviter comptage par commande vide

> 💡 **Conseil :** utiliser le plan Fixed si l'app fait du polling fréquent (BullMQ, Sidekiq). Le PAYG compte chaque polling comme une commande, même vide.

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : usage cache + sessions · ~5 commandes Redis/utilisateur actif/jour · 20% MAU

| Palier | MAU | Commandes/mois | Coût PAYG | Coût Fixed (mieux?) | Notes |
|--------|-----|---------------|-----------|---------------------|-------|
| **5k users** | 1k | ~1.5M | **$3/mo** | Fixed-250MB $10 (overkill) | PAYG optimal |
| **15k users** | 3k | ~4.5M | **$9/mo** | Fixed-250MB $10 ≈ égal | PAYG ou Fixed-250MB |
| **50k users** | 10k | ~15M | **$30/mo** | Fixed-250MB $10 ✅ | Passer Fixed |
| **100k users** | 20k | ~30M | **$60/mo** | Fixed-1GB $40 ✅ | Fixed nettement mieux |
| **300k users** | 60k | ~90M | **$180/mo** | Fixed-5GB $120 ✅ | Fixed obligatoire |
| **1M users** | 200k | ~300M | **$600/mo** | Fixed-50GB $400 ✅ | Envisager Redis self-hosted |

> ⚠️ **Seuil de rentabilité Fixed vs PAYG** : dès ~15M commandes/mois, les Fixed plans deviennent plus économiques. À 1M users, Upstash reste viable mais Redis self-hosted sur Fly.io (~$40/mo) est nettement moins cher si tu peux gérer la maintenance.

## Performances
| Métrique | Valeur |
|---|---|
| Latence (même région) | 1–3ms |
| Latence (edge multi-région) | 5–30ms (réplique locale) |
| Max ops/sec (PAYG) | 10 000 |
| Persistance | ✅ toujours (bloc storage) |
| TTL natif | ✅ |
## ✅ Quand utiliser
- **Cloudflare Workers / Vercel Edge** (Redis TCP impossible → HTTP natif Upstash)
- Cache serverless avec TTL automatique
- Rate limiting edge
- Sessions côté edge
- Pub/sub léger
- App Next.js Vercel avec cache Redis
## ❌ Quand ne PAS utiliser
- Très gros volumes (> 1M req/heure) → self-hosted Valkey/Redis moins cher
- Besoin de Redis Cluster ou Sentinel
- Workloads HPC (100K+ ops/sec) → Fixed plan peut devenir cher
## Combinaisons stack optimales
- **Cloudflare Workers + cache** → `Upstash Redis + @upstash/redis`
- **Next.js Vercel + rate limiting** → `Upstash Redis + @upstash/ratelimit`
- **Queues serverless** → `Upstash QStash (meilleur que Redis pour serverless)`
## Alternatives directes
| Alternative | Différence clé |
|---|---|
| Redis self-hosted | Gratuit mais pas edge-compatible, gestion manuelle |
| Cloudflare KV | Edge KV simple, pas de TTL aussi flexible, pas de pub/sub |
| Cloudflare Durable Objects | State persistant edge mais API différente |
## Ressources
- [Documentation](https://upstash.com/docs/redis)
- [Pricing officiel](https://upstash.com/pricing/redis)
- [@upstash/redis SDK](https://github.com/upstash/upstash-redis)
