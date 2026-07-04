# Landing Pages — Conventions et patterns de référence

> Guide pour construire des landing pages marketing par type de produit.
> Basé sur l'analyse de : Vercel, Resend, Linear, Stripe, Clerk, Raycast, Supabase (mars 2026).
>
> **See also:** [`component-blocks-catalog.md`](component-blocks-catalog.md) for block taxonomy and section sequencing by product type.

---

## Principes universels

Ces règles s'appliquent à toutes les landing pages de ce panel, quel que soit le type de produit.

### Mode dark vs light
- **Dark dominant** (5/7) : Vercel, Resend, Linear, Raycast, Supabase
- **Light** (1/7) : Stripe — prise de position forte, rassurante pour les finances
- **Hybride** (1/7) : Clerk — transition light→dark mid-page

**Règle** : Pour les devtools et infra → dark par défaut. Pour les produits financiers ou grand public → light ou hybride.

### Structure de navigation

Trois patterns de navbar observés :
1. **Mega-menu** (Vercel, Stripe) : 2–3 colonnes thématiques, icônes + titre + sous-titre. Pour les produits complexes avec de nombreuses catégories.
2. **Dropdowns simples** (Resend, Clerk, Supabase) : 1–2 colonnes, 5–8 items max. Pour les produits mid-complexity.
3. **Navbar plate** (Linear, Raycast) : liens directs sans dropdown. Pour les produits single-product avec message fort.

**Signature navbar** : Vercel → "Ask AI" + dashboard · Raycast → pill arrondie flottante (style macOS) · Supabase → compteur GitHub live · Clerk → topbar fundraise · Linear → séparateur `|` avant les CTAs.

### Structure type d'une homepage
1. **Bandeau topbar** (optionnel) : news, fundraise, event — pill colorée + texte court + lien
2. **Hero** : H1 (valeur en 1 phrase), sous-titre (2 lignes max), 2 CTAs (primary filled + secondary outline)
3. **Social proof logos** : "Trusted by..." + 8–15 logos clients/partenaires
4. **Démo produit** : screenshot, vidéo, ou interface interactive — le plus tôt possible
5. **Sections features** : 3–6 sections thématiques (alternance gauche/droite ou grille)
6. **Chiffres/stats** : users, stars GitHub, certifications
7. **CTA final** : répétition du message hero + 2 CTAs
8. **Footer** : 4–6 colonnes, status système, toggle dark/light

### Anti-slop hero rules

- The hero is a single focused moment: optional eyebrow, H1, subtext, CTA group. Move logo walls, pricing teasers, feature bullets, and trust micro-copy below.
- H1 max: 2 lines on desktop. Subtext max: 20 words and 3-4 lines.
- CTA group must be visible without scroll on a typical desktop viewport.
- Do not use a centered hero by default when the brief calls for high variance. Use split, asymmetric, pinned, or media-led structures.
- Do not repeat the same CTA intent under different labels.

### Typographie

| Élément | Taille | Poids |
|---|---|---|
| H1 hero | 56–100px | Bold à Ultra-bold |
| Titres section | 32–48px | Bold |
| Sous-titres hero | 18–20px | Regular |
| Body | 16–18px | Regular |
| Labels, meta | 12–14px | Regular |
| CTA | 14–16px | Medium |

**Police dominante** : Sans-serif (Inter, Geist, Sohne). Exception : Resend utilise un serif pour les H1 — choix distinctif qui crée une identité premium immédiate.

### Hiérarchie des CTAs

Pattern universel : **CTA primaire** (filled, couleur accent) + **CTA secondaire** (outline ou texte).
- Primaire : action immédiate ("Start building", "Deploy", "Download")
- Secondaire : engagement moins fort ("Get a Demo", "Contact sales", "Documentation")

La couleur du CTA primaire est la couleur accent de la marque — c'est souvent le seul élément très coloré sur fond sombre.

### Motion et animations

Trois niveaux observés :
1. **Rich** (Vercel, Clerk, Raycast) : scroll-triggered animations, éléments 3D, transitions entre sections
2. **Moderate** (Linear, Supabase) : fade-in au scroll, quelques éléments interactifs
3. **Subtle** (Resend, Stripe) : animations discrètes, priorité donnée au contenu

**Règle** : Le motion doit communiquer le produit, pas décorer. Exemples réussis : Linear (scroll-jacking qui guide dans l'app), Vercel (données live AI Gateway), Resend (cube qui tourne légèrement).

### Taste QA before publishing

- Count eyebrows: max 1 per 3 sections.
- Do not repeat a section layout family more than once.
- Bento grids must have exactly the number of cells the content requires and at least 2 visual treatments in a multi-cell grid.
- Avoid default AI-purple gradients and default warm-craft premium palettes unless the brand requires them.
- Use real product media or specific generated assets; avoid generic atmospheric stock.

---

## Convention Matrix par type de produit

### Hero template

Tous les heroes suivent ce squelette — seuls les placeholders changent :

```
[Signal confiance optionnel : rating, badge, chiffre social proof]
H1 : [Proposition de valeur adaptée au type]
Sous-titre : [Explication en 1–2 lignes]
CTA : [Action primaire] + [Action secondaire]
Visuel : [Format adapté au produit]
```

| Type | H1 pattern | CTAs | Visuel |
|---|---|---|---|
| Devtools/API/Infra | `[Ce que ça fait] for developers` | "Get Started" + "Documentation" | Code snippet / interface outil |
| B2B SaaS | `[Outcome pour l'équipe]` | "Start for free" + "Watch demo" / "Contact sales" | Screenshot fidèle avec données réalistes |
| Fintech B2B | `[Infrastructure] for [the internet]` / `for your business` | "Start now" + "Contact sales" | Gradient animé / illustration isométrique |
| Consumer app | `[Tagline courte et mémorable]` | "Download for Mac" + "Download for Windows" | Gradient spectaculaire / screenshot app |
| Plateformes créateurs | `[Valeur émotionnelle pour le créateur]` + sous-titre : 3 bénéfices concrets courts + micro-copy: "It's free · No credit card · Less than a minute" | "Start my page" / "Get started" | — |
| Fintech grand public | `[Promesse financière claire]` | "Ouvrir un compte" + badges App Store/Play | Mockup app / simulateur interactif |
| Santé | `[Bénéfice patient/utilisateur direct]` + signal confiance obligatoire : note App Store + nombre d'utilisateurs (convention verticale santé, pas optionnel) | Recherche directe / Devis / Découvrir | Interface en contexte d'usage réel |
| E-commerce SaaS | Aspiration émotionnelle (headline rotation) | "Start free trial" | Vidéo marchands réels |

### Conventions par type

**Devtools / API / Infrastructure** (Vercel, Resend, Supabase, Clerk) — Conventions :
- Dark mode obligatoire
- Code snippets interactifs dans la page (pas juste une image — du vrai code)
- Frameworks supportés (logos Next.js, React, Python…) listés visuellement
- Documentation accessible depuis la nav principale
- Pricing transparent (pas de "contactez-nous" pour le tier de base)
- Social proof : logos tech connus + chiffres (GitHub stars, nombre de développeurs)
- Signature : badge GitHub stars, "Available on npm/pip..." sous le CTA, syntax highlighting, multi-language selector

**B2B SaaS** (Linear, Notion, Loom) — Conventions :
- Dark préféré mais light acceptable
- Démo produit dans la page — le plus tôt possible, le plus fidèle possible
- Social proof : entreprises connues + témoignages de teams (pas de dirigeants corporate)
- Changelog sur la homepage — montre la vélocité produit
- Pricing sans surprise, toggle mensuel/annuel
- Signature : screenshots réels (pas de maquettes idéalisées), données réalistes, changelog cards, nombres d'équipes actives

**Fintech / Paiements** (Stripe)
- Sous-titre hero : liste des produits en 2 lignes
- **Light mode** — la confiance et la lisibilité financière passent par le blanc
- Accent violet/indigo — distance avec le vert (succès banal) et le rouge (erreur)
- Illustrations 3D isométriques des produits (cartes, terminaux)
- Chaque produit a sa propre landing page (pas de one-pager)
- Documentation mise en avant comme produit
- Certifications et compliance visible (PCI DSS, SOC2…)
- Tarification à l'usage transparente

**Consumer app / Productivité grand public** (Raycast, Loom) — Conventions :
- Téléchargement direct mis en avant (bouton Download avec icône OS)
- Version disponible clairement indiquée (Mac, Windows beta, iOS…)
- Communauté visible (Discord/Slack membres, followers X)
- Galerie d'extensions ou de templates
- Vidéos tutoriels sur la homepage
- Hero très dramatique visuellement (gradient fort, plein écran)

**Plateformes créateurs / Support** (Ko-fi, BMC, Patreon, Gumroad, beehiiv, Contra) — Conventions :
- 0% de commission ou plan freemium comme argument d'entrée — standard du marché
- Social proof chiffré en hero ("2M+ creators", "$2M earned last week") — systématique
- Ownership de l'audience toujours revendiqué (le créateur possède ses données/fans)
- CTA unique + micro-copy rassurant ("free", "no credit card", "less than a minute") — universel
- Ton friendly anti-corporate (jamais de "clients" — "supporters", "fans", "audience")
- **Différenciation par sous-type :**
  - Micro-support (Ko-fi, BMC) : form intégré directement sur page créateur, friction quasi-nulle, ton hyper-chaleureux
  - Memberships (Patreon) : tiers avec bénéfices explicites, contenu locked/unlocked visible, dashboard analytics riche
  - Produits digitaux (Gumroad) : store-first, checkout overlay, Merchant of Record (taxes automatiques)
  - Newsletters (beehiiv) : landing media brandée, formulaire subscribe minimaliste, Ad Network natif
  - Marketplace B2B (Contra) : workflow contrat + facture, 0% commission, challenges communauté
- **Palette par positionnement :**
  - Chaleureux/communauté → Crème + pastel (Ko-fi, Gumroad)
  - Frictionless/grand public → Blanc + jaune vif (BMC)
  - Professionnel/serious → Dark + fuchsia (beehiiv), Blanc + noir (Contra)

**Fintech grand public** (Revolut, Wise, Monzo) — Conventions :
- Hero avec démonstration du produit avant inscription (simulateur, mockup animé)
- Confiance par la réglementation (FCA, FinCEN, FSCS) visible mais pas envahissante
- Social proof par volume (50M clients, £10Mrd/mois) + presse tech (FT, Forbes)
- CTA : téléchargement direct (App Store + Google Play) + badges
- Aucune couleur d'urgence (rouge/orange agressif) — palettes apaisantes
- **Différenciation par philosophie :**
  - Super-app (Revolut) : densité fonctionnelle, dark mode, ambition mondiale, "cockpit"
  - Transparence (Wise) : simulateur de taux en temps réel sur la landing, anti-bullshit, "calculatrice"
  - Émotionnel (Monzo) : chaud, narratif, Hot Coral, "coach bienveillant"

**Santé** (Doctolib, Alan, Withings) — Conventions :
- La confiance est une **couche architecturale**, pas une feature (certifications, stats sourcées, section data dédiée)
- Aucune couleur d'urgence — palettes douces, désaturées, apaisantes
- Typographie accessible : sans-serif lisible, corps généreux, hiérarchie stricte
- Données comme "enjeu existentiel" communiqué explicitement (section entière, pas juste un disclaimer)
- Friction réduite au minimum vital — action immédiate sans compte
- **Ce qui différencie le design santé du design tech :**
  - Preuve sociale = chiffres massifs sourcés avec méthodologie visible
  - RGPD/confidentialité = argument de vente éditorial (pas legal boilerplate)
  - Accessibilité = valeur de marque (WCAG AA strict, textes larges, zone tactile ≥44px)
  - Prévention = nouveau territoire (rituels quotidiens, coaching, pas seulement gestion du sinistre)

**Bold branding / Identité visuelle forte** (Duolingo, Arc, Craft, Superhuman, Framer, Pitch)

Principes communs qui permettent un branding fort sans sacrifier l'usabilité :
1. **Posséder un territoire, pas juste une couleur.** La cohérence systémique (couleur + formes + typo + ton + noms UI) est incopiable.
2. **Le branding vit dans les détails imperceptibles.** Craft : off-white chaud + serif = identité aussi forte que le vert Duolingo. Superhuman : "Super Sans" (propriétaire) vaut plus qu'une charte de 50 pages.
3. **Cohérence landing ↔ app = le vrai test.** Arc livre ses gradients. Framer build avec Framer. Pitch propose des templates audacieux.

| Style | Exemple | Couleur | Typo | Ton |
|---|---|---|---|---|
| Gamification/mascotte | Duolingo | Vert chartreuse `#58CC02` | DIN Round, lowercase | Décalé, menaçant |
| Radical/revendicatif | Arc | Bleu électrique `rgb(49,57,251)` | Marlin Soft SQ | Artisanal-intellectuel |
| Premium/matière | Craft | Off-white chaud | Serif letter-spacing négatif | Éditorial, serein |
| Élitiste/aspirationnel | Superhuman | Gradient lavande-rose | Super Sans (propriétaire) | Confiant, adulte |
| Le produit est la pub | Framer | Noir absolu `#000` | GT Walsheim, 84px | Concis, technique |
| Provocateur | Pitch | Violet `#6B53FF` | Mark Pro 800 | Énergique, déclaratoire |

**AI / Interfaces conversationnelles** (Claude.ai, ChatGPT, Perplexity) — Conventions :
- L'institutionnel et le produit sont maintenant séparés (anthropic.com ≠ claude.ai, openai.com ≠ chatgpt.com)
- La sécurité/éthique IA comme positionnement marketing (Anthropic en premier, OpenAI en rubrique)
- Démonstration du produit directement en hero (ChatGPT : input sur la homepage)
- Screenshots de l'interface comme hero visuel principal
- **Guerre émotionnelle** : Chaleur humaine (Anthropic) → crème, terracotta, serif, "slow design" · Puissance froide (OpenAI) → noir/blanc pur, sans-serif, densité · Vérifiabilité techno (Perplexity) → teal froid, icônes, citations inline

**E-commerce** (Shopify, Etsy, Vinted)

**Distinction fondamentale :** Shopify.com vend la **plateforme** aux marchands (SaaS B2B). Etsy et Vinted sont des **marketplaces** qui vendent directement aux consommateurs.

- **Shopify** : hero aspiration (vidéo marchands, headline rotation) → proof sociale (Glossier, Mattel, Cabaïa) → scaling story par taille (artisan → PME → enterprise) → features progressives → stats (+15% conversion, 150M acheteurs) → démo interactive 3 étapes → CTA. Dark premium marketing, light fonctionnel admin.
- **Etsy** : homepage saisonnière/éditoriale, pas de hero fixe — curation thématique. Découverte par univers (pas par catégorie froide). Accent orange chaleureux, fond blanc, typo lisible.
- **Vinted** : hero orienté vendeur ("Prêt à faire du tri ?"), feed produits directement sous hero. Vendre = facile et gratuit (0% commission). Tutoiement systématique.
- **Conventions universelles** : barre de recherche centrale proéminente, social proof volume ("150M acheteurs actifs"), programme confiance acheteur (Buyer Protection, Shop Pay), navigation catégories en second tier

---

## Pages secondaires

### Pricing

**Pattern universel** :
- 3–4 colonnes : Free / Pro / Business ou Scale / Enterprise
- Plan "Most Popular" mis en avant : bordure accentuée, badge pill, légèrement surélevé
- Toggle mensuel/annuel (annuel présélectionné — économie implicite)
- CTAs différenciés par plan (Free → "Get started", Pro → "Start trial", Enterprise → "Contact sales")
- FAQ accordéon en bas
- Comparatif features étendu pour les plans supérieurs

**Erreurs à éviter** :
- Masquer les prix (force le "Contact sales" trop tôt)
- Plans aux noms génériques sans personnalité
- Sauts de prix brutaux sans justification de valeur

### Changelog

1. **Technique/simple** (Linear, Vercel) : feed chronologique, fond sombre, typo sobre, dates en évidence. Pour les audiences dev qui lisent les changelogs.
2. **Éditorial** (Resend) : photos cinématographiques pleine largeur, style magazine tech. Pour les marques qui veulent un contenu premium.

**Éléments communs** : bouton Subscribe/Follow, dates en marge gauche, catégories taggées.

### Documentation (landing)
- Barre de recherche centrale ou Cmd+K
- Quickstart en grille (cards par framework/langage)
- Sidebar hiérarchique gauche
- Exemples de code dans tous les langages supportés
- Dark mode disponible (parfois default)

---

## Cohérence inter-pages

**Règle fondamentale** : Le même système doit s'appliquer sur toutes les pages.
- Même navbar
- Même footer
- Même palette (sauf ruptures intentionnelles comme Clerk)
- Même typographie
- Même border-radius sur les cards
- Même spacing système (sections : 80–120px padding vertical)

**Éléments de cohérence signature** :
- Vercel : grille en pointillés avec crosses aux angles — sur chaque page
- Supabase : vert `#3ECF8E` appliqué avec discipline absolue
- Resend : mega-wordmark dans tous les footers
- Linear : fond noir légèrement bleuté constant + identifiants mono

---

## Checklist landing page

Avant de livrer :
- [ ] Le H1 communique la valeur en une phrase (pas le nom de la feature)
- [ ] La démo produit est visible au-dessus de la fold (ou très tôt au scroll)
- [ ] Les CTAs sont différenciés (primary filled + secondary outline)
- [ ] Il y a de la social proof (logos clients OU chiffres OU témoignages)
- [ ] Le pricing est accessible depuis la nav
- [ ] La palette est cohérente sur toutes les pages
- [ ] Les animations ont une intention fonctionnelle (pas décorative)
- [ ] Le footer contient : navigation, statut système, liens légaux
- [ ] La page est lisible en dark ET light selon le mode par défaut choisi
- [ ] Les screenshots de l'app sont des captures réelles, pas des maquettes idéalisées
- [ ] Aucun placeholder type `Jane Doe`, `Acme`, `Lorem ipsum` ou métrique parfaite n'est visible
- [ ] Les CTAs ne se dupliquent pas par intention et ne wrap pas sur desktop

**Ajouts par type :**
- Devtools : code snippets interactifs, frameworks listés, badge GitHub
- B2B SaaS : changelog cards, données réalistes dans les démos
- Fintech : certifications compliance visibles, aucune couleur d'urgence
- Consumer : téléchargement direct avec icône OS, communauté visible
- Créateurs : micro-copy rassurant sous CTA, ton anti-corporate
- Santé : section data/RGPD dédiée, accessibilité WCAG AA, friction minimale
- E-commerce : barre recherche proéminente, programme confiance acheteur
