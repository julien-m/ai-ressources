---
last_updated: 2026-03-17
confidence: high
category: search
type: self-hosted
pricing_model: [free-self-hosted, per-usage-cloud]
free_tier: true
---

# Meilisearch

> _Moteur de recherche open-source Rust, 🇫🇷 français, self-hostable. Le meilleur rapport DX/performance en self-hosted._

## Ce que c'est

Meilisearch est un moteur de recherche full-text open-source écrit en Rust. Conçu pour la recherche "as-you-type" avec tolérance aux fautes de frappe, facettes, et filtres. Très rapide, léger (~50 MB RAM pour un index moyen), facile à déployer.

**Entreprise fondée à Paris. MIT license (self-hosted). Cloud managé disponible.**

## Features clés

- Recherche instantanée (< 50ms)
- Tolérance aux fautes de frappe native
- Facettes et filtres
- Synonymes et stop words configurables
- Multi-tenant (clés API par index)
- API REST simple
- SDK TypeScript/JS officiel

## Pricing

### Self-hosted (gratuit)
```
Gratuit, illimité.
Nécessite un serveur pour héberger le processus.
Fly.io : ~$3-5/mois pour une instance légère
```

### Meilisearch Cloud
| Plan | Prix | Recherches/mois | Documents |
|------|------|-----------------|-----------|
| Build | Gratuit | 10 000 | 100 000 |
| Pro | $30/mois | 100 000 | 1 000 000 |
| Business | $300/mois | Illimité | 10 000 000 |

## Exemple d'utilisation

```typescript
import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'masterKey',
})

// Indexer
await client.index('products').addDocuments([
  { id: 1, name: 'iPhone', category: 'phone' },
])

// Rechercher
const results = await client.index('products').search('iph', {
  filter: 'category = phone',
  limit: 10,
})
```

## ✅ Quand utiliser

- App avec recherche produits, articles, utilisateurs
- Self-hosted sur un VPS ou Fly.io
- Tu veux le contrôle total des données
- Budget limité (gratuit en self-hosted)

## ❌ Quand ne pas utiliser

- Full Cloudflare Workers / edge sans serveur → Orama
- Recherche vecteurs / sémantique → Postgres pgvector ou Qdrant
- Très grand volume sans ops team → Algolia ou Typesense Cloud

## Alternatives directes

| Service | Note |
|---------|------|
| Typesense | Similaire, légèrement plus mature en cloud |
| Orama | Edge-native, pas de serveur |
| Algolia | Managed référence, cher |

## Ressources

- [Documentation](https://www.meilisearch.com/docs)
- [GitHub](https://github.com/meilisearch/meilisearch)
