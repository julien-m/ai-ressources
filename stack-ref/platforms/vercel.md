---
last_updated: 2026-03-16
confidence: high
category: platform
type: managed
pricing_model: [flat, per-usage]
free_tier: true
---

# Vercel

> _La plateforme frontend-first pour Next.js, déploiement continu, edge serverless._

## Ce que c'est

Vercel est la plateforme créée par l'équipe de Next.js. Spécialisée dans le déploiement de frontends et de serverless functions, avec CDN edge mondial. Déploiement instantané depuis GitHub/GitLab. Supporte Next.js (nativement), SvelteKit, Nuxt, Remix, Astro, etc. Vercel est l'inventeur de l'Edge Runtime et des React Server Components.

## Produits / Features clés

- **Deployments** — Deploy automatique sur chaque push, previews par PR
- **Edge Functions** — JS/TS à l'edge (V8), < 1ms cold start
- **Serverless Functions** — Node.js/Python/Go standard, ~100ms cold start
- **Edge Config** — Store de config ultra-rapide (< 1ms lectures)
- **KV** — Store clé-valeur (basé Upstash)
- **Postgres** — Postgres serverless (basé Neon)
- **Blob** — Object storage (basé Cloudflare R2 / AWS S3)
- **AI SDK** — SDK IA avec streaming (Vercel AI SDK)
- **Analytics** — Web analytics + Core Web Vitals
- **Speed Insights** — Monitoring de performance

## Free Tier (Hobby)

| Métrique | Limite |
|---|---|
| Déploiements | illimité |
| Bande passante | 100 GB/mois |
| Serverless Functions | 100 GB-heures/mois |
| Edge Functions | 500K invocations/mois |
| Domaines custom | ✅ |
| Previews | ✅ illimitées |
| Projets | illimité |
| KV (Upstash) | 500K req/mois |
| Postgres (Neon) | 0.5 GB |
| Blob storage | 512 MB |

> ⚠️ Hobby plan = usage personnel uniquement. Pas pour projets commerciaux selon les CGU.

## Pricing

### Pro — $20/mois (par membre)

| Métrique | Inclus | Overage |
|---|---|---|
| Bande passante | 1 TB/mois | $0.40/GB |
| Serverless | 1000 GB-heures | $0.18/GB-h |
| Edge Functions | 1M invocations | $2/M |
| KV (Upstash) | 100K req/jour | variable |
| Postgres (Neon) | selon Neon Launch | variable |
| Blob storage | 5 GB | $0.023/GB-mois |
| Previews | illimitées | — |
| SLA | 99.99% | — |

### Enterprise — sur devis (SOC2, SLA, support dédié)

### 💡 Exemples de calcul

- **Side-project Next.js, trafic modéré** → Hobby $0/mo (si usage perso)
- **SaaS Next.js, 1 dev, 500K pages vues/mois** → Pro $20/mo
- **Startup 3 devs** → Pro 3 × $20 = $60/mo

## Performances

| Métrique | Valeur |
|---|---|
| Edge Functions cold start | < 1ms |
| Serverless cold start | 50–200ms |
| CDN (Vercel Edge Network) | 100+ PoPs |
| TTFB moyen | < 100ms |

## 📊 Coût estimé par palier d'utilisateurs

> **Hypothèses** : app Next.js SaaS · plan Pro ($20/mois/membre) · 1 dev seul · Edge Functions modérées

| Palier | Users | Trafic/mois | Plan | Coût estimé | Notes |
|--------|-------|-------------|------|-------------|-------|
| **Perso / interne** | — | faible | Hobby | **$0** | Non-commercial uniquement |
| **Early stage** | ~500 | ~50k pages vues | Pro | **$20/mo** | Bien en dessous des limites |
| **Growth** | ~5k | ~500k pages vues | Pro | **$20–40/mo** | Peut dépasser les 100k Edge req incluses |
| **Scale** | ~50k | ~5M pages vues | Pro | **$50–150/mo** | Bandwidth + Edge Functions en surconsommation |
| **Hyper-scale** | ~500k+ | ~50M+ pages vues | Enterprise | **$400+/mo** | Sur devis, SLA garanti |

> ⚠️ **Pricing Vercel non-linéaire** : le plan Pro inclut 1TB bandwidth et 500k Edge Function invocations. Au-delà : bandwidth $0.15/GB, Edge req $2/million. Surveiller les pics. À >$200/mo, comparer avec Cloudflare Pages (souvent moins cher à fort trafic).

## ✅ Quand utiliser

- App **Next.js** (Vercel = plateforme officielle)
- Équipe frontend voulant déploiement zero-config
- Previews de PR automatiques pour révision
- ISR (Incremental Static Regeneration) optimisé
- Stack JAMstack / SSG+SSR mixte

## ❌ Quand ne PAS utiliser

- App non-frontend (API pure, backend long-running)
- Budget limité avec équipe > 3 personnes ($20/membre)
- Besoin de contrôle infra / self-hosted
- Cloudflare Workers déjà utilisé (redondance)
- App EU avec exigences données strictes (Vercel = US-based)

## Combinaisons stack optimales

- **Next.js standard** → `Vercel + Neon (Postgres) + Clerk (auth) + Resend`
- **Next.js + edge DB** → `Vercel Edge + Vercel KV (Upstash) + Vercel Postgres (Neon)`
- **Comparaison Cloudflare** → Cloudflare est moins cher à l'usage, Vercel est meilleur DX Next.js

## Ressources

- [Documentation](https://vercel.com/docs)
- [Pricing officiel](https://vercel.com/pricing)
