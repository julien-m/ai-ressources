---
last_updated: 2026-03-16
confidence: high
category: database
type: edge
pricing_model: [flat]
free_tier: true
---

# Cloudflare D1

> _SQLite à l'edge dans Cloudflare Workers — zéro latence pour vos Workers._

## Ce que c'est

Cloudflare D1 est un service de base de données SQLite distribué, accessible uniquement depuis les Cloudflare Workers. Basé sur SQLite, répliqué sur le réseau Cloudflare (200+ PoP). Pensé pour être l'état persistant natif des Workers. Pas de connexion TCP externe possible — bind uniquement via `env.DB`.

## Free Tier (inclus dans Workers Free)

| Métrique | Limite |
|---|---|
| Stockage | 5 GB |
| Lectures | 5M rows/jour |
| Écritures | 100K rows/jour |
| Bases | illimité |

## Pricing (Workers Paid — $5/mois)

| Métrique | Inclus | Overage |
|---|---|---|
| Stockage | 5 GB | $0.75/GB-mois |
| Lectures | 25M rows/jour | $0.001/M rows |
| Écritures | 50M rows/mois | $1.00/M rows |

### 💡 Exemples de calcul

- **App Workers small (100K req/jour, CRUD)** → Workers Paid $5/mo couvre tout
- **App Workers medium (1M req/jour)** → $5 + overage lecture ~$5-10/mo

## 📊 Coût estimé par palier d'utilisateurs

> **Hypothèses** : app SaaS sur Cloudflare Workers · 20% MAU · ~100 req DB/utilisateur actif/jour · 80% lectures / 20% écritures

| Palier | MAU | Lectures/mois | Écritures/mois | Coût estimé | Notes |
|--------|-----|--------------|---------------|-------------|-------|
| **5k users** | 1k | ~2.4M | ~0.6M | **$5/mo** | Très loin des limites (750M lus / 50M écrits) |
| **15k users** | 3k | ~7.2M | ~1.8M | **$5/mo** | Idem |
| **50k users** | 10k | ~24M | ~6M | **$5/mo** | Idem |
| **100k users** | 20k | ~48M | ~12M | **$5/mo** | Encore dans les limites |
| **300k users** | 60k | ~144M | ~36M | **$5/mo** | Lectures OK (750M inclus) · Écritures OK (36M < 50M) |
| **1M users** | 200k | ~480M | ~120M | **$75/mo** | Lectures OK · Écritures : 70M overage × $1/M = $70 |

> ⚠️ **Attention aux écritures à 1M users** : D1 est optimisé lecture. Le coût des écritures ($1/M rows) devient le facteur limitant à grande échelle. Si ton app est write-heavy (ex: logging, feed), anticiper ce coût ou envisager Turso en parallèle.

## Performances

| Métrique | Valeur |
|---|---|
| Latence (Worker local) | < 1ms (même PoP) |
| Réplication | Read replicas sur 200+ PoP |
| Écritures | Centralisées (une région primaire) |

> ⚠️ Les écritures sont routées vers une région primaire. Les lectures sont locales. Si votre app est write-heavy depuis plusieurs régions, la latence d'écriture peut être élevée.

## ✅ Quand utiliser

- State persistant pour un Cloudflare Worker
- API CRUD simple entièrement dans Workers
- Cache SQL structuré à l'edge
- App entièrement dans l'écosystème Cloudflare

## ❌ Quand ne PAS utiliser

- Accès depuis une autre plateforme que Workers (impossible en direct)
- Workloads SQL complexes (SQLite < Postgres features)
- Writes haute fréquence depuis plusieurs régions (latence primaire)
- Besoin de Postgres extensions

## Combinaisons stack optimales

- **Full Cloudflare** → `Workers + D1 + R2 + KV + Drizzle ORM`
- **API REST edge** → `Hono + D1 + Cloudflare Pages`

## Ressources

- [Documentation D1](https://developers.cloudflare.com/d1/)
- [Pricing Cloudflare](https://www.cloudflare.com/plans/)
