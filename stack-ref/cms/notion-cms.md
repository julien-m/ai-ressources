---
last_updated: 2026-03-17
confidence: high
category: cms
type: managed
pricing_model: [free, per-workspace]
free_tier: true
---

# Notion as CMS

> _Notion comme source de contenu statique/semi-statique — blog, changelog, FAQ, pricing._

## Ce que c'est

Utiliser l'API Notion pour alimenter du contenu dans ton app Next.js. Notion devient l'éditeur — tu écris dans une interface familière, et Next.js fetch le contenu au build ou via ISR pour le servir en cache. Les visiteurs ne touchent jamais l'API Notion.

**Cas d'usage** : blog, changelog, FAQ, page pricing avec features toggleables, témoignages, docs simples.

## Pattern d'architecture

```
Notion (éditeur de contenu)
    ↓ API Notion (fetch au build ou ISR)
Next.js getStaticProps / generateStaticParams
    ↓
HTML statique mis en cache CDN (Vercel / CF Pages)
    ↓
Utilisateur → reçoit le cache, API Notion jamais sollicitée
```

Le rate limit Notion (~3 req/s) est non-pertinent : l'API est appelée uniquement lors des revalidations, pas par les visiteurs.

## Stratégies de cache recommandées

| Type de contenu | Stratégie | Revalidation |
|----------------|-----------|-------------|
| Blog / articles | `getStaticProps` | Build on demand ou ISR 24h |
| Changelog | ISR | `revalidate: 3600` (1h) |
| FAQ | ISR | `revalidate: 86400` (24h) |
| Pricing / features | Build statique | Build manuel |
| Témoignages | Build statique | Build manuel |

## Rendu du contenu Notion

Notion utilise son propre format de blocs (pas du Markdown natif).

**Option A — `notion-to-md`** (recommandé)
- Convertit les blocs Notion → Markdown
- Markdown → HTML via `remark` / `rehype`
- Tu styles avec Tailwind — contrôle total sur le CSS

**Option B — `react-notion-x`**
- Rendu direct des blocs Notion en React
- Style Notion conservé (moins de contrôle design)
- Plus rapide à intégrer, moins flexible

## Free tier / Pricing

- Plan Notion gratuit suffit pour du CMS solo
- API disponible sur tous les plans (y compris Free)
- Limite : 1000 blocks par page en lecture API

## ✅ Quand utiliser

- Solo / micro-produit avec contenu qui change rarement
- Pas envie de coder un back-office pour éditer du contenu
- Blog ou changelog avec mise à jour hebdomadaire ou moins
- Équipe (ou toi seul) déjà dans Notion

## ❌ Quand ne PAS utiliser

- Contenu mis à jour plusieurs fois/jour → trop de rebuilds, latence ISR
- Volume > 1000 blocks par page
- SEO critique avec contenu dynamique fréquent → Sanity ou Directus
- Besoin de relations complexes entre contenus

## Combinaisons stack
- `Notion API + notion-to-md + rehype + Next.js ISR` → blog/changelog
- `Notion API + react-notion-x + Next.js` → docs internes rapides

## Ressources
- [developers.notion.com](https://developers.notion.com)
- [notion-to-md](https://github.com/souvikinator/notion-to-md)
- [react-notion-x](https://github.com/NotionX/react-notion-x)
