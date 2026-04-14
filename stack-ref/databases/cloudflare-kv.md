---
last_updated: 2026-03-16
confidence: high
category: database
type: edge
pricing_model: [per-usage]
free_tier: true
---

# Cloudflare KV

> _Store clé-valeur distribué mondial — eventually consistent, lecture ultra-rapide à l'edge._

## Ce que c'est
Cloudflare KV est un store clé-valeur globally distributed, accessible depuis les Workers. Eventually consistent (propagation ~60 secondes entre régions). Optimisé pour les **lectures fréquentes** (cache edge de config, feature flags, contenu statique). Pas de TTL per-key aussi flexible que Redis mais TTL supporté à l'écriture.

## Free Tier
| Métrique | Limite |
|---|---|
| Lectures | 100K/jour |
| Écritures | 1K/jour |
| Suppressions | 1K/jour |
| Listes | 1K/jour |
| Stockage | 1 GB |

## Pricing (Workers Paid — $5/mois)
| Métrique | Inclus | Overage |
|---|---|---|
| Lectures | 10M/mois | $0.50/M |
| Écritures | 1M/mois | $5.00/M |
| Suppressions | 1M/mois | $5.00/M |
| Stockage | 1 GB | $0.50/GB-mois |

### 💡 Exemples de calcul
- **Config flags, 1M lectures/mois, 1K écritures** → Workers Paid $5/mo suffit

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : usage typique KV = sessions/cache/feature flags · ~10 lectures KV/utilisateur actif/jour · écritures rares (1/10ème des lectures)

| Palier | MAU | Lectures/mois | Écritures/mois | Coût estimé | Notes |
|--------|-----|--------------|---------------|-------------|-------|
| **5k users** | 1k | ~300K | ~30K | **$5/mo** | Largement dans les 10M inclus |
| **15k users** | 3k | ~900K | ~90K | **$5/mo** | Idem |
| **50k users** | 10k | ~3M | ~300K | **$5/mo** | Idem |
| **100k users** | 20k | ~6M | ~600K | **$5/mo** | Dans les 10M inclus |
| **300k users** | 60k | ~18M | ~1.8M | **$9/mo** | Lecture overage : 8M × $0.50 = $4 |
| **1M users** | 200k | ~60M | ~6M | **$30/mo** | Lecture overage : 50M × $0.50 = $25 · écriture overage : 5M × $5 = $25... |

> ⚠️ **Écritures KV coûteuses** : $5/M writes est très élevé. KV est conçu pour des données lues souvent, écrites rarement (config, feature flags, sessions courtes). Si tu as besoin d'écrire fréquemment par utilisateur, Upstash Redis est plus adapté. À 1M users avec sessions actives, revoir le pattern.
## ✅ Quand utiliser
- **Feature flags** lus à chaque requête (lecture ultra-rapide, écriture rare)
- Config globale de l'app (settings, redirects)
- Cache de contenu statique ou de réponses API
- Sessions légères sans TTL complexe
## ❌ Quand ne PAS utiliser
- Données nécessitant une **cohérence immédiate** (eventual consistency ~60s)
- Writes fréquents (5 fois plus cher que les lectures)
- Logique Redis avancée (pub/sub, sorted sets, TTL conditionnel)
## Combinaisons stack optimales
- **Config edge** → `KV pour config + D1 pour data`
- **A/B testing** → `KV pour feature flags lus dans chaque Worker`
## Ressources
- [Documentation KV](https://developers.cloudflare.com/kv/)
