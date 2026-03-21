# Core Web Vitals — Guide d'optimisation

Reference pratique pour diagnostiquer et optimiser les trois metriques Core Web Vitals (LCP, INP, CLS). Mis a jour pour les seuils et bonnes pratiques 2025-2026.

## Les 3 metriques

| Metrique | Mesure | Good | Needs Improvement | Poor |
|----------|--------|------|--------------------|------|
| **LCP** (Largest Contentful Paint) | Temps d'affichage du plus grand element visible | ≤ 2.5s | 2.5s – 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | Latence entre interaction utilisateur et mise a jour visuelle | ≤ 200ms | 200ms – 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Somme des decalages de mise en page inattendus | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |

**Critere de reussite** : au moins **75% des visites** (p75) doivent atteindre le seuil "Good" pour chaque metrique.

> INP remplace FID depuis mars 2024. C'est la metrique la plus echouee en 2025-2026 : 43% des sites ne passent pas le seuil de 200ms.

## Impact SEO

- Les CWV sont un **signal de ranking Google** depuis 2021 (Page Experience Update).
- A contenu egal, un site passant les 3 CWV sera favorise dans les resultats.
- Les sites conformes constatent en moyenne **24% de bounce rate en moins**.
- Google utilise les **donnees terrain (CrUX)**, pas les scores labo, pour le ranking.
- Un score Lighthouse parfait ne garantit pas de bonnes CWV terrain.

## Outils de diagnostic

| Outil | Type | Usage |
|-------|------|-------|
| **PageSpeed Insights** | Terrain + Labo | Score global + donnees CrUX reelles |
| **Chrome DevTools > Performance** | Labo | Profiling detaille des long tasks et layout shifts |
| **Lighthouse** (DevTools / CLI) | Labo | Audit complet avec recommandations |
| **CrUX Dashboard** (BigQuery) | Terrain | Tendances historiques sur 28 jours glissants |
| **Search Console > CWV** | Terrain | Vue par URL/groupe, alertes de regression |
| **Web Vitals Extension** | Terrain local | Mesure en temps reel pendant la navigation |
| **DebugBear / SpeedCurve** | Monitoring | Suivi continu, alertes, comparaison historique |

## Optimisations LCP

### Images (cause #1 de mauvais LCP)

- Utiliser des formats modernes : **WebP** ou **AVIF** (30-50% plus legers que JPEG)
- **Preload** l'image LCP : `<link rel="preload" as="image" href="hero.webp">`
- Ne **pas** lazy-loader l'image LCP — elle doit etre `loading="eager"` (defaut)
- Attributs `width` et `height` explicites pour reserver l'espace
- Utiliser `fetchpriority="high"` sur l'image hero
- CDN avec cache edge pour les assets statiques

### Fonts

- `font-display: swap` ou `optional` pour eviter le FOIT (Flash of Invisible Text)
- Preload les fonts critiques : `<link rel="preload" as="font" type="font/woff2" crossorigin>`
- Limiter le nombre de variantes chargees (poids, styles)

### Serveur et rendu

- Temps de reponse serveur (TTFB) < 800ms — idealement < 200ms
- Activer la **compression** (Brotli > Gzip)
- **Critical CSS** inline dans le `<head>` pour le contenu above-the-fold
- Utiliser SSG ou ISR pour les pages a contenu stable
- HTTP/2 ou HTTP/3 pour le multiplexage des requetes

## Optimisations INP

### Identifier les problemes

- Chrome DevTools > Performance > chercher les **Long Tasks** (> 50ms)
- L'INP mesure la pire interaction (p98 approximativement) — pas la moyenne

### Reduire les long tasks

- **Decouper** le JavaScript en chunks plus petits (code splitting)
- Ceder le thread principal via `setTimeout(fn, 0)` ou `scheduler.yield()`
- Deplacer les calculs lourds dans des **Web Workers**
- Defer les scripts tiers non critiques : `<script defer>` ou `<script async>`

### React : fonctionnalites concurrentes

```tsx
// Prioriser les interactions urgentes, differer les mises a jour couteuses
const [isPending, startTransition] = useTransition();

function handleSearch(query: string) {
  // Mise a jour urgente : afficher l'input immediatement
  setInputValue(query);
  // Mise a jour differee : filtrer la liste
  startTransition(() => {
    setFilteredResults(filterItems(query));
  });
}
```

- `useTransition` / `startTransition` : rendre non-bloquantes les mises a jour couteuses
- `useDeferredValue` : differer le re-rendu d'un composant enfant
- React Server Components : reduire le JS client (jusqu'a -30% de bundle)
- Eviter les re-rendus inutiles : `React.memo`, `useMemo`, `useCallback`

### Event handlers

- **Debounce** les evenements frequents (scroll, resize, input) : 100-150ms
- Utiliser `{ passive: true }` sur les listeners scroll/touch
- Eviter les lectures de layout forcees (forced reflow) dans les handlers

## Optimisations CLS

### Reserver l'espace

- **Toujours** specifier `width` et `height` sur les `<img>`, `<video>`, `<iframe>`
- Utiliser `aspect-ratio` CSS pour les conteneurs responsives
- Reserver un placeholder pour les pubs et contenus charges dynamiquement

### Fonts et texte

- `font-display: optional` elimine le CLS lie aux fonts (mais risque de FOIT)
- `font-display: swap` + `size-adjust` pour minimiser le decalage
- Preload les fonts pour reduire le temps de swap

### Pieges courants de CLS

| Piege | Solution |
|-------|----------|
| Banniere cookie/consentement qui pousse le contenu | Position `fixed` ou `sticky`, pas dans le flow |
| Images sans dimensions | Attributs `width`/`height` ou CSS `aspect-ratio` |
| Injection de contenu au-dessus du viewport | Inserer sous le fold ou utiliser des animations CSS |
| Fonts web qui changent la taille du texte | `font-display: optional` + `size-adjust` |
| Iframes/embeds sans taille reservee | Conteneur avec `aspect-ratio` fixe |
| Hydration mismatch (SSR/CSR) | S'assurer que le rendu serveur = rendu client initial |

## Pieges courants

- **Hydration mismatch** : le HTML serveur et le rendu client different, causant un re-rendu complet (mauvais pour LCP et CLS)
- **Scripts tiers** (analytics, chat, ads) : souvent la cause #1 de mauvais INP — les charger en `defer` ou apres interaction
- **CLS invisible** : les layout shifts peuvent se produire hors viewport ou trop vite pour etre vus — toujours verifier avec les outils
- **Mesurer en labo uniquement** : les scores Lighthouse ne refletent pas les conditions reelles (reseau, appareil, interactions)
- **Optimiser desktop seulement** : Google utilise le **mobile-first indexing** — les CWV mobiles sont celles qui comptent

## Checklist d'audit rapide

- [ ] LCP < 2.5s sur mobile (verifier PageSpeed Insights avec donnees terrain)
- [ ] INP < 200ms (tester les interactions reelles, pas seulement le chargement)
- [ ] CLS < 0.1 (verifier sur toute la duree de vie de la page, pas seulement au load)
- [ ] Image LCP en preload, format WebP/AVIF, `fetchpriority="high"`
- [ ] Fonts preloaded avec `font-display: swap` ou `optional`
- [ ] Pas de long tasks JS > 200ms sur le thread principal
- [ ] Scripts tiers en `defer` ou charges apres interaction
- [ ] Toutes les images/videos/iframes ont des dimensions explicites
- [ ] Pas de contenu injecte dynamiquement au-dessus du fold sans reservation d'espace
- [ ] TTFB < 800ms (idealement < 200ms)
- [ ] Compression Brotli activee
- [ ] Monitoring terrain configure (CrUX, Search Console, ou outil tiers)
