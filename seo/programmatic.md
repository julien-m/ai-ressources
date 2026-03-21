# SEO Programmatique — Guide pour SaaS

Reference pratique pour concevoir, lancer et maintenir une strategie de SEO programmatique appliquee aux produits SaaS. Approche templates + donnees a grande echelle.

## Definition

Le SEO programmatique consiste a generer des **centaines ou milliers de pages** a partir de templates et de sources de donnees structurees, ciblant des requetes de recherche qui suivent un schema repetitif.

Contrairement au contenu editorial (redige a la main), chaque page est assemblee automatiquement mais doit apporter une **valeur unique** a l'utilisateur.

## Use cases SaaS typiques

| Type de page | Pattern de requete | Exemple |
|-------------|-------------------|---------|
| **Integrations** | "[produit] + [integration]" | "Zapier Slack integration" |
| **Comparaisons** | "[produit] vs [concurrent]" | "Notion vs Coda" |
| **Use cases** | "[produit] for [metier/secteur]" | "Asana for marketing teams" |
| **Glossaire / Hub** | "What is [terme]" | "What is a CRM" |
| **Par ville / region** | "[service] in [ville]" | "Coworking spaces in Lyon" |
| **Convertisseurs / Outils** | "[unite] to [unite]" | "EUR to USD converter" |
| **Templates / Exemples** | "[type] template" | "Invoice template for freelancers" |

## Architecture

### Structure URL

```
# Integrations
/integrations/                      → hub (index)
/integrations/slack/                → page integration
/integrations/slack/google-sheets/  → sous-page combinaison

# Comparaisons
/compare/                           → hub
/compare/notion-vs-coda/            → page comparaison

# Use cases
/solutions/                         → hub
/solutions/marketing-teams/         → page use case
```

**Regles URL** :
- Slugs courts, lisibles, en minuscules avec tirets
- Hierarchie logique refletee dans le chemin
- Pas de parametres de requete pour les pages indexables
- URL canonique unique par page

### Sources de donnees

| Source | Usage |
|--------|-------|
| Base de donnees interne | Integrations, features, pricing |
| API tierces | Donnees marche, stats, avis |
| CMS / Headless CMS | Contenus enrichis editoriaux |
| User-Generated Content | Avis, temoignages, use cases |
| Donnees publiques | Stats sectorielles, benchmarks |

### Template de page

Chaque template doit contenir :

1. **Bloc statique** : structure commune (navigation, CTA, footer)
2. **Bloc dynamique unique** : donnees specifiques a l'entite (stats, features, description)
3. **Bloc enrichi** : contenu additionnel qui differencie chaque page (FAQ, temoignages, cas d'usage)
4. **Maillage contextuel** : liens vers pages liees (voir section maillage)

## Eviter le "thin content"

Google penalise les pages a faible valeur ajoutee. Seuils minimaux :

| Critere | Minimum recommande |
|---------|-------------------|
| Mots uniques par page | **500+** |
| Differenciation entre pages | **30-40%** du contenu |
| Donnees uniques | Au moins **1 bloc** de donnees specifique |
| Contenu utile sans le mot-cle variable | La page doit rester utile |

### Techniques d'enrichissement

- **Donnees factuelles** : statistiques, metriques, comparatifs chiffres
- **FAQ dynamiques** : questions specifiques a l'entite, generees ou curees
- **Temoignages / avis** : UGC filtre et pertinent
- **Contenu editorial** : paragraphes rediges (ou assistes par IA) avec relecture
- **Visualisations** : graphiques, tableaux comparatifs, screenshots
- **Related content** : articles de blog, guides lies

> **Test d'unicite** : si on retire le mot-cle variable (nom de ville, integration, etc.), le reste du contenu est-il encore utile et informatif ? Si non, la page est du thin content.

## Maillage interne

### Modele Hub & Spoke

```
Hub (index)
  ├── Spoke A (page entite)
  │     ├── lien vers Hub
  │     ├── liens vers Spokes liees (2-5)
  │     └── lien vers contenu editorial lie
  ├── Spoke B
  └── Spoke C
```

### Elements de maillage

- **Breadcrumbs** : navigation hierarchique (Home > Integrations > Slack)
- **Related pages** : 3-5 liens vers pages similaires dans le footer ou sidebar
- **Cross-linking** : liens entre categories (integration → use case associe)
- **Lien depuis le blog** : articles editoriaux qui pointent vers les pages programmatiques
- **Sitemap HTML** : page de navigation listant toutes les categories

## Indexation

### Sitemap dynamique

```typescript
// app/sitemap.ts (Next.js)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const integrations = await getIntegrations();
  return integrations.map((item) => ({
    url: `https://example.com/integrations/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
```

- Generer le sitemap dynamiquement a partir de la meme source de donnees
- Limiter a **50 000 URLs** par fichier sitemap (spec Google)
- Utiliser un **sitemap index** si > 50 000 pages
- Mettre a jour `lastModified` a chaque modification reelle du contenu

### Pagination et canonical

- Pagination : utiliser `rel="next"` / `rel="prev"` (encore utile pour Bing)
- **Canonical unique** par page — jamais de doublon
- Pages filtrees / triees : `noindex` ou canonical vers la version par defaut
- Parametres de requete : `robots.txt` ou `noindex` pour les variantes non essentielles

### Controle de l'indexation

- **robots.txt** : bloquer les pages d'admin, preview, brouillons
- **Meta robots** : `noindex` sur les pages de faible qualite ou en cours de remplissage
- **Canonical** : pointer les variantes vers la page principale
- Ne pas indexer les pages avec < 300 mots de contenu unique

## Velocite de publication

- **Ne pas publier** 10 000 pages d'un coup — risque de review manuelle Google
- Viser **50-500 pages/jour** selon la taille et l'autorite du site
- Monitorer le **crawl budget** dans Search Console (Statistiques d'exploration)
- Augmenter progressivement le rythme si l'indexation suit

## Risques et pieges

| Risque | Prevention |
|--------|-----------|
| **Thin content** | Minimum 500 mots uniques, test d'unicite, enrichissement |
| **Duplicate content** | Canonicals, differenciation 30-40%, donnees uniques |
| **Index bloat** | `noindex` sur les pages sans valeur, monitoring des pages indexees |
| **Penalite Google** | Pas de contenu genere sans valeur ajoutee, pas de keyword stuffing |
| **Crawl budget gaspille** | Sitemap propre, pas de pages orphelines, robots.txt correct |
| **Cannibalisation** | 1 page = 1 intention de recherche, mapping mots-cles explicite |

## Exemples de reference

| Entreprise | Strategie | Volume |
|-----------|-----------|--------|
| **Zapier** | Pages par integration + combinaisons (Slack + Google Sheets) | 100 000+ pages |
| **Wise** | Convertisseur de devises (EUR to USD, etc.) | 10 000+ pages |
| **NomadList** | Fiches ville avec scores (cout, internet, securite) | 1 000+ pages |
| **G2** | Comparaisons logicielles (X vs Y) | 50 000+ pages |
| **Canva** | Templates par type et occasion | 100 000+ pages |

## Metriques de suivi

| Metrique | Outil | Objectif |
|----------|-------|----------|
| Pages indexees vs publiees | Search Console | > 90% d'indexation |
| Impressions par template | Search Console > Performance | Croissance mensuelle |
| CTR moyen par template | Search Console | > 3% (varie par type) |
| Trafic organique par page | Analytics | Identifier les templates performants |
| Pages sans clic (30j) | Search Console | < 20% des pages publiees |
| Position moyenne | Search Console | Suivi par cluster de mots-cles |
| Crawl stats | Search Console > Parametres | Pas de crawl budget gaspille |

## Checklist de lancement

- [ ] Keyword research : identifier les patterns repetitifs a fort volume
- [ ] Template design : blocs statiques + dynamiques + enrichissement
- [ ] Source de donnees : fiable, complete, mise a jour reguliere
- [ ] Contenu unique : minimum 500 mots, test d'unicite passe
- [ ] Maillage : hub & spoke, breadcrumbs, related pages
- [ ] URL structure : propre, hierarchique, slugs lisibles
- [ ] Sitemap dynamique : genere automatiquement, < 50 000 URLs/fichier
- [ ] Canonical : une URL canonique unique par page
- [ ] Robots.txt : pages inutiles bloquees
- [ ] Velocite : publication progressive (50-500 pages/jour)
- [ ] Monitoring : Search Console, pages indexees, impressions, CTR
- [ ] Review qualite : audit manuel d'un echantillon avant publication de masse
