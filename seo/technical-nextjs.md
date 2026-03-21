# SEO Technique pour Next.js — App Router

Reference pratique pour implementer le SEO technique dans une application Next.js (15+) avec l'App Router. Metadata API, sitemap, donnees structurees, strategies de rendu et performance.

## Metadata API

### Metadata statique

```typescript
// app/about/page.tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "A propos | MonApp",
  description: "Decouvrez notre mission et notre equipe.",
  openGraph: { title: "A propos | MonApp", url: "https://monapp.com/about", type: "website" },
};
```

### Metadata dynamique

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: `${post.title} | Blog MonApp`,
    description: post.excerpt,
    openGraph: {
      title: post.title, type: "article", publishedTime: post.publishedAt,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
    alternates: { canonical: `https://monapp.com/blog/${slug}` },
  };
}
```

**Regles** :
- Titres < 60 caracteres, descriptions < 155 caracteres
- `generateMetadata` reserve aux **Server Components** — utiliser `metadata` statique quand possible
- Toujours definir un `canonical` explicite
- Le `metadata` du layout fusionne avec celui de la page (la page a priorite)

## Sitemap dynamique

```typescript
// app/sitemap.ts — servi automatiquement sur /sitemap.xml
import type { MetadataRoute } from "next";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return [
    { url: "https://monapp.com", lastModified: new Date(), priority: 1.0 },
    { url: "https://monapp.com/pricing", lastModified: new Date(), priority: 0.8 },
    ...posts.map((p) => ({
      url: `https://monapp.com/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
```

- Pour > 50 000 URLs : utiliser `generateSitemaps()` pour un sitemap index
- `lastModified` doit refleter la date reelle de modification du contenu

## Robots

```typescript
// app/robots.ts — servi sur /robots.txt
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === "production";
  return {
    rules: isProd
      ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/preview/"] }]
      : [{ userAgent: "*", disallow: "/" }], // bloquer hors prod
    sitemap: "https://monapp.com/sitemap.xml",
  };
}
```

- **Staging / Dev** : `Disallow: /` pour bloquer completement l'indexation
- Toujours pointer vers le sitemap

## Donnees structurees (JSON-LD)

```typescript
// components/structured-data.tsx
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
```

### Schemas courants

| Schema | Usage | Pages |
|--------|-------|-------|
| `Organization` | Identite de l'entreprise | Layout racine |
| `WebSite` + `SearchAction` | Barre de recherche dans les SERP | Page d'accueil |
| `Product` / `SoftwareApplication` | Fiche produit SaaS | Pages produit |
| `Article` | Articles de blog | Pages blog |
| `FAQPage` | Section FAQ | Pages avec FAQ |
| `BreadcrumbList` | Fil d'Ariane | Toutes les pages |

- Valider avec le Rich Results Test de Google
- Placer le `<script>` dans le composant page (donnees specifiques), pas dans le layout

## Strategies de rendu et SEO

| Strategie | Quand l'utiliser | Config |
|-----------|-----------------|--------|
| **SSG** (Static) | Contenu stable (about, docs, landing) | `export const dynamic = "force-static"` |
| **ISR** | Contenu mis a jour periodiquement (blog, produits) | `export const revalidate = 3600` |
| **SSR** (Dynamic) | Contenu temps reel (dashboard, recherche) | `export const dynamic = "force-dynamic"` |

### ISR : bonnes pratiques

```typescript
export const revalidate = 3600; // revalider toutes les heures

// Revalidation on-demand (app/api/revalidate/route.ts)
import { revalidatePath, revalidateTag } from "next/cache";
export async function POST(request: Request) {
  const { path, tag, secret } = await request.json();
  if (secret !== process.env.REVALIDATION_SECRET) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (tag) revalidateTag(tag); else if (path) revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

- ISR est **SEO-safe** : le crawler recoit toujours du HTML pre-rendu
- Preferer `revalidateTag` pour invalider des groupes de pages liees
- Connecter la revalidation on-demand au webhook du CMS

## OG Images dynamiques

```typescript
// app/blog/[slug]/opengraph-image.tsx — auto-detecte par Next.js
import { ImageResponse } from "next/og";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center",
      width: "100%", height: "100%", padding: "60px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white", fontSize: 48, fontWeight: "bold" }}>
      {post.title}
    </div>,
    { ...size },
  );
}
```

- Dimensions recommandees : **1200x630** (OG), **1200x675** (Twitter)
- Next.js genere automatiquement les meta tags `og:image`

## Performance

### next/image et next/font

```tsx
// Image LCP — priority desactive le lazy loading
<Image src="/hero.webp" alt="Description SEO" width={1200} height={600}
  priority sizes="(max-width: 768px) 100vw, 50vw" />
```

```typescript
// app/layout.tsx — fonts auto-hebergees, zero CLS
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap", preload: true });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr" className={inter.className}><body>{children}</body></html>;
}
```

- `priority` sur l'image LCP uniquement — `sizes` pour les variantes responsives
- `next/font` elimine les requetes vers Google Fonts et le CLS lie aux fonts
- Toujours specifier `lang` sur `<html>` pour le SEO multilingue

### Bundle et imports dynamiques

- `next/dynamic` pour les composants lourds (editeur, carte, graphiques)
- Deplacer la logique vers des Server Components quand possible
- Analyser avec `ANALYZE=true next build` + `@next/bundle-analyzer`

## Redirects et rewrites

```typescript
// next.config.ts
const nextConfig = {
  async redirects() {
    return [
      { source: "/old-blog/:slug", destination: "/blog/:slug", permanent: true },  // 301
      { source: "/temp-promo", destination: "/pricing", permanent: false },         // 302
    ];
  },
};
```

- **301** : transfere le "link juice" SEO — pour les migrations
- **302** : pas de transfert SEO — pour les redirections temporaires
- Redirections conditionnelles : utiliser le **middleware** (`middleware.ts`)
- Eviter les chaines (A -> B -> C) : pointer directement vers la destination finale

## Erreurs courantes

| Erreur | Impact | Solution |
|--------|--------|----------|
| Pas de `generateMetadata` sur pages dynamiques | Titre generique | `generateMetadata` sur chaque route dynamique |
| Canonical manquant | Contenu duplique | `alternates.canonical` dans metadata |
| Contenu JS-only (client components) | Page vide pour crawlers | Server Components pour le contenu indexable |
| `lang` manquant sur `<html>` | Mauvaise detection de langue | `lang="fr"` dans le layout racine |
| Sitemap statique | Nouvelles pages non decouvertes | `app/sitemap.ts` dynamique |
| Images sans `alt` | Accessibilite + image SEO | `alt` descriptif sur chaque `<Image>` |
| `noindex` staging qui fuite en prod | Pages non indexees | Conditionner sur `NODE_ENV` dans `robots.ts` |
| Fonts externes (Google Fonts CDN) | LCP degrade, CLS | `next/font` (auto-heberge) |

## Checklist SEO Next.js

- [ ] `generateMetadata` ou `metadata` sur chaque page (titre unique + description)
- [ ] Canonical explicite sur toutes les pages
- [ ] `app/sitemap.ts` dynamique avec `lastModified`
- [ ] `app/robots.ts` avec regles differenciees staging/prod
- [ ] JSON-LD : Organization, BreadcrumbList, schemas specifiques
- [ ] `<html lang="fr">` dans le layout racine
- [ ] Image LCP avec `priority` et format WebP/AVIF
- [ ] `next/font` pour les polices (pas de CDN externe)
- [ ] Server Components pour tout le contenu indexable
- [ ] OG images dynamiques sur les pages cles
- [ ] Redirections 301 pour les anciennes URLs
- [ ] Bundle analysis : pas de dependances lourdes cote client
- [ ] Tester avec Rich Results Test et PageSpeed Insights
- [ ] Verifier l'indexation dans Search Console apres deploiement
