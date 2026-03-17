---
last_updated: 2026-03-17
confidence: high
category: search
type: self-hosted
pricing_model: [free-self-hosted, per-usage-cloud]
free_tier: true
---

# Typesense

> _Moteur de recherche open-source C++, alternative à Algolia. Plus mature en cloud managé que Meilisearch._

## Ce que c'est

Typesense est un moteur de recherche full-text open-source écrit en C++. Concurrent direct de Meilisearch, avec une emphase sur la recherche instantanée et la tolérance aux erreurs. Le cloud managé (Typesense Cloud) est légèrement plus mature que Meilisearch Cloud.

## Features clés

- Recherche typo-tolerante instantanée
- Filtres et facettes
- Multi-tenant avec clés scopées
- Geo-search
- Vector search (hybride)
- SDK TypeScript officiel (`typesense-js`)
- Compatible InstantSearch.js (Algolia UI components)

## Pricing

### Self-hosted (gratuit)

```
Gratuit, illimité.
Docker image disponible.
```

### Typesense Cloud

| Plan | Prix | Nœuds | RAM |
|------|------|-------|-----|
| Hobby | $0 | 1 | 0.5 GB |
| Starter | $6/mois | 1 | 1 GB |
| Production (HA) | $99/mois | 3 (HA) | 4 GB |

## Exemple

```typescript
import Typesense from 'typesense'

const client = new Typesense.Client({
  nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
  apiKey: 'xyz',
})

// Créer une collection
await client.collections().create({
  name: 'products',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'price', type: 'float' },
  ],
})

// Rechercher
const results = await client.collections('products').documents().search({
  q: 'iphone',
  query_by: 'name',
  filter_by: 'price:<1000',
})
```

## Typesense vs Meilisearch

| Critère | Typesense | Meilisearch |
|---------|-----------|-------------|
| Performance brute | Légèrement supérieure | Très bonne |
| Cloud managé | Plus mature | En développement |
| DX / setup | Bon | Excellent |
| Origine | US | 🇫🇷 France |
| License | GPL-3 (self-hosted) | MIT |
| Geo-search | ✅ natif | ✅ |
| Vector search | ✅ | ✅ |

## ✅ Quand utiliser

- Besoin d'un cloud managé robuste (HA dès $99/mois)
- Geo-search natif important
- Migration depuis Algolia (API similaire, compatible InstantSearch.js)

## ❌ Quand ne pas utiliser

- Stack CF Workers → Orama
- Budget zéro sans serveur → Orama embarqué

## Ressources

- [Documentation](https://typesense.org/docs)
- [GitHub](https://github.com/typesense/typesense)
