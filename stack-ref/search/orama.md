---
last_updated: 2026-03-17
confidence: high
category: search
type: edge
pricing_model: [free-open-source, per-usage-cloud]
free_tier: true
---

# Orama

> _Moteur de recherche edge-native — tourne dans CF Workers, le browser, Deno, Bun. Zéro infrastructure._

## Ce que c'est
Orama (ex-Lyra) est un moteur de recherche full-stack TypeScript-first. Son point distinctif : il tourne **partout** — dans un Cloudflare Worker, dans le browser côté client, en Node/Bun. Pas de serveur dédié nécessaire. Open-source avec un cloud managé optionnel.

## Features clés
- **Edge-native** : fonctionne dans CF Workers, Bun, Deno, browser
- Recherche full-text + vectorielle (hybride)
- Facettes, filtres, tri
- Typage TypeScript natif (pas d'API REST — appel de fonctions directement)
- Plugin système (stemming, stop words, synonymes)
- Persist : sérialise l'index en JSON pour le stocker en KV ou R2

## Exemple CF Workers
```typescript
import { create, insert, search } from '@orama/orama'

// Créer et peupler l'index (au démarrage du Worker)
const db = await create({
  schema: {
    title: 'string',
    content: 'string',
    category: 'enum',
  },
})

await insert(db, { title: 'Mon article', content: '...', category: 'tech' })

// Rechercher
const results = await search(db, {
  term: 'article',
  properties: ['title', 'content'],
})
```

## Pattern avec CF KV (index persisté)
```typescript
// Sauvegarder l'index
import { save } from '@orama/orama'
const serialized = JSON.stringify(await save(db))
await env.KV.put('search-index', serialized)

// Restaurer au démarrage
import { load } from '@orama/orama'
const raw = await env.KV.get('search-index')
await load(db, JSON.parse(raw))
```

## Pricing
- **Open-source** : gratuit, illimité, self-managed
- **Orama Cloud** : index managé avec sync automatique depuis des sources (Docusaurus, Shopify, etc.)
  - Free : 1 index, 100k records
  - Pro : $49/mois
## ✅ Quand utiliser
- Stack Cloudflare Workers sans serveur dédié
- Recherche dans une app edge / serverless
- Index petit à moyen (tient en mémoire du Worker)
- Recherche client-side (browser) sans appel réseau
## ❌ Quand ne pas utiliser
- Index très volumineux (>1M documents) → Meilisearch ou Typesense
- Besoin de mise à jour temps réel fréquente (Workers ont cold start)
- Recherche vectorielle pure à grande échelle → Qdrant
## Alternatives directes
| Service | Note |
|---------|------|
| Meilisearch | Self-hosted, plus adapté aux gros volumes |
| Typesense | Cloud managé robuste |
| Algolia | Managé référence, coûteux |
## Ressources
- [Documentation](https://docs.orama.com)
- [GitHub](https://github.com/oramasearch/orama)
