---
last_updated: 2026-03-16
confidence: high
category: database
type: self-hosted
pricing_model: [free]
free_tier: true
---

# Redis (self-hosted)

> _Store clé-valeur in-memory ultra-rapide — cache, sessions, pub/sub, queues, TTL automatique._

## Ce que c'est
Redis est un store clé-valeur open-source in-memory (BSD-licensed jusqu'à v7, puis RSALv2 en v7.4). Supporte strings, lists, sets, sorted sets, hashes, streams, et HyperLogLog. Utilisé massivement pour le caching, les sessions, les rate limits, les queues (Bull/BullMQ), les pub/sub en temps réel.

> ⚠️ Redis a changé de licence en v7.4 (2024) → RSALv2 (pas open-source au sens strict). **Valkey** est le fork open-source BSD maintenu par Linux Foundation (drop-in replacement).

**Valkey** : fork communautaire Redis par Linux Foundation, compatible API, activement maintenu. À préférer pour le self-hosting.

## Free Tier
**Gratuit** à héberger soi-même. Coût = RAM + hébergement.

## Pricing (self-hosted estimé)
| Config | Prix estimé |
|---|---|
| Docker local | $0 |
| Fly.io 256MB RAM | ~$2/mo |
| Instance Infomaniak | ~€5/mo |
| AWS ElastiCache t3.micro | ~$12/mo |

## Performances
| Métrique | Valeur |
|---|---|
| Latence | < 1ms (local), 1–3ms (même datacenter) |
| Throughput | 100K–1M ops/sec (selon RAM et réseau) |
| Persistance | RDB snapshots + AOF journaling |
| TTL natif | ✅ (EXPIRE sur n'importe quelle clé) |
## ✅ Quand utiliser
- **Cache** applicatif (résultats DB, API, computed data)
- **Sessions utilisateurs** (TTL = expiration automatique)
- **Rate limiting** (INCR + EXPIRE = atomic)
- **Queues de jobs** (BullMQ, Bee-Queue)
- **Pub/sub temps réel** (notifications, websockets)
- **Leaderboards** (sorted sets)
- **TTL automatique** → clés qui expirent d'elles-mêmes sans cron ✅
## ❌ Quand ne PAS utiliser
- Données persistantes critiques (Redis est avant tout in-memory)
- Gros volumes de données (coût RAM élevé)
- Requêtes SQL complexes (pas de joins, pas de SQL)
- Environnement Cloudflare Workers (→ Upstash Redis)
## Combinaisons stack optimales
- **App Node.js + cache** → `Redis (Valkey) + ioredis`
- **BullMQ / jobs** → `Redis + BullMQ + Bun`
- **Rate limiting** → `Redis + @upstash/ratelimit (local) ou Upstash`

## TTL automatique — cas d'usage concret
```typescript
// Clé qui s'auto-supprime après 15 minutes — pas besoin de cron
await redis.set("session:user123", JSON.stringify(data), "EX", 900);

// Rate limiting atomique
const count = await redis.incr("ratelimit:ip:1.2.3.4");
if (count === 1) await redis.expire("ratelimit:ip:1.2.3.4", 60);
```
## Alternatives directes
| Alternative | Différence clé |
|---|---|
| Upstash Redis | Redis managé HTTP, edge-compatible, serverless |
| Valkey | Fork open-source de Redis (à préférer) |
| Cloudflare KV | KV edge simple, pas de TTL per-key aussi flexible |
| Memcached | Simplifié, pas de TTL par clé, pas de pub/sub |
## Ressources
- [Redis Documentation](https://redis.io/docs/)
- [Valkey (fork open-source)](https://valkey.io/)
- [ioredis (Node.js)](https://github.com/redis/ioredis)
- [BullMQ (queues)](https://bullmq.io/)
