---
last_updated: 2026-03-17
confidence: high
category: search
type: managed
pricing_model: [per-search, per-record]
free_tier: true
---

# Algolia

> _La référence managed des moteurs de recherche. Excellente pertinence, excellent DX, mais coûteux à l'échelle._

## Ce que c'est

Algolia est le leader des moteurs de recherche managés. Résultats ultra-pertinents, UI components React prêts à l'emploi (InstantSearch.js), analytics de recherche intégrés. Utilisé par des milliers de produits. Le standard de référence contre lequel tous les autres se comparent.

## Features clés

- Recherche instantanée < 10ms
- Ranking configurable (business rules)
- InstantSearch.js : composants React/Vue/Angular prêts
- A/B testing des résultats
- Merchandising (mettre des produits en avant)
- Analytics : requêtes sans résultats, taux de clic
- NeuralSearch : recherche vectorielle hybride
- Geo-search

## Pricing

| Plan | Prix | Recherches/mois | Records |
|------|------|-----------------|---------|
| Free (Build) | $0 | 10 000 | 10 000 |
| Grow | $0.50/1k req | Pay-as-you-go | $0.40/1k |
| Premium | Sur devis | — | — |

**Exemples calculés**
- 50k recherches/mois + 100k records → ~$25-40/mois
- 500k recherches/mois + 1M records → ~$250-400/mois
- Dépasse rapidement les budgets indie à grande échelle

## ✅ Quand utiliser

- E-commerce avec recherche produit critique (merchandising, A/B test)
- Besoin de composants UI React prêts en 30 min (InstantSearch)
- Grande équipe avec budget
- Migration rapide sans ops

## ❌ Quand ne pas utiliser

- Solo / micro-SaaS → Meilisearch ou Typesense (10-20x moins cher)
- Stack CF Workers → Orama
- Contrôle des données / RGPD strict → self-hosted

## Alternatives moins chères

| Alternative | Économie estimée |
|-------------|-----------------|
| Typesense Cloud | 5-10x moins cher |
| Meilisearch Cloud | 5-10x moins cher |
| Orama Cloud | 10x+ moins cher |

## Ressources

- [Documentation](https://www.algolia.com/doc/)
- [InstantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/)
