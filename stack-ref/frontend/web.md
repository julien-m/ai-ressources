---
last_updated: 2026-03-17
confidence: high
category: frontend
type: framework
---

# Web Frontend

## Next.js + shadcn/ui
Le choix par défaut pour tout projet SaaS, dashboard, ou app web.

**Pourquoi Next.js**
- SSR / SSG / ISR natif — un seul framework pour tout
- API routes intégrées (plus besoin d'un serveur séparé pour du BFF léger)
- App Router (depuis v13) — layouts imbriqués, Server Components, streaming
- Déployable sur Vercel (zero config) ou Cloudflare Pages (adapter)
- Écosystème massif, le standard de fait en 2025

**Pourquoi shadcn/ui**
- Pas une lib installée — les composants sont copiés dans ton projet, tu les possèdes
- Basé sur Radix UI (accessibilité) + Tailwind CSS (styling)
- Personnalisable à 100%, pas de conflit de styles
- Standard de fait pour les UI React propres en 2025

**Pourquoi DaisyUI**
- Alternative à shadcn pour les **artifacts, prototypes, outils internes rapides**
- Surcouche Tailwind — classes sémantiques (`btn`, `card`, `modal`)
- Zéro JavaScript, pure CSS
- Idéal quand on veut un résultat propre sans coder les composants
- Moins adapté pour un vrai produit (moins de contrôle sur le design)

### Quand utiliser quoi
| Contexte | Choix |
|----------|-------|
| SaaS, app produit, dashboard | Next.js + shadcn/ui |
| Artifact, prototype, outil interne | Next.js + DaisyUI |
| Site marketing / blog / docs | Astro (voir ci-dessous) |

---

## Astro
Pour les projets **principalement statiques** : blog, docs, site marketing, landing page.

- Envoie zéro JS par défaut (HTML pur)
- "Islands architecture" — monte des composants React/Svelte/Vue si besoin
- Meilleur score Lighthouse que Next.js pour du contenu statique
- Content Collections : gestion de Markdown/MDX avec typage
- Déployable partout (CF Pages, Vercel, Netlify)

**Ne pas utiliser** pour une app avec beaucoup d'interactivité ou d'état client.

---
## ✅ Quand utiliser Next.js
- App avec auth, dashboard, routes protégées
- SaaS avec abonnements et interface utilisateur
- Projet qui mélange pages marketing + app (même repo)
- Besoin de SSR pour SEO sur contenu dynamique
## ✅ Quand utiliser Astro
- Blog, changelog, docs, site vitrine
- SEO critique et contenu quasi-statique
- Pas de logique d'app côté client
## ❌ Quand ne pas utiliser
- Next.js pour du contenu 100% statique → surcharge inutile
- Astro pour une app avec état global, auth complexe, temps réel
## Combinaisons stack
- `Next.js + shadcn + Tailwind + Supabase` → SaaS standard
- `Next.js + shadcn + Clerk + Stripe` → SaaS avec auth et paiement
- `Astro + Notion as CMS` → blog/changelog sans CMS custom
- `Next.js + DaisyUI` → prototype / artifact rapide
