# Landing Pages — Conventions et patterns de référence

> Guide pour construire des landing pages marketing par type de produit.
> Basé sur l'analyse de : Vercel, Resend, Linear, Stripe, Clerk, Raycast, Supabase (mars 2026).

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

**Signature navbar** : chaque site a un élément unique dans la navbar :
- Vercel : "Ask AI" + dashboard
- Raycast : pill arrondie flottante (style macOS)
- Supabase : compteur GitHub live
- Clerk : topbar fundraise
- Linear : séparateur `|` avant les CTAs

### Structure type d'une homepage

1. **Bandeau topbar** (optionnel) : news, fundraise, event — pill colorée + texte court + lien
2. **Hero** : H1 (valeur en 1 phrase), sous-titre (2 lignes max), 2 CTAs (primary filled + secondary outline)
3. **Social proof logos** : "Trusted by..." + 8–15 logos clients/partenaires
4. **Démo produit** : screenshot, vidéo, ou interface interactive — le plus tôt possible
5. **Sections features** : 3–6 sections thématiques (alternance gauche/droite ou grille)
6. **Chiffres/stats** : users, stars GitHub, certifications
7. **CTA final** : répétition du message hero + 2 CTAs
8. **Footer** : 4–6 colonnes, status système, toggle dark/light

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

---

## Par type de produit

### Devtools / API / Infrastructure

**Références** : Vercel, Resend, Supabase, Clerk

**Conventions** :
- Dark mode obligatoire
- Code snippets dans la page (pas juste une image — du vrai code interactif)
- Frameworks supportés (logos Next.js, React, Python…) listés visuellement
- Documentation accessible depuis la nav principale
- Pricing transparent (pas de "contactez-nous" pour le tier de base)
- Social proof : logos tech connus + chiffres (GitHub stars, nombre de développeurs)

**Structure hero typique** :
```
H1 : [Ce que ça fait] for developers
Sous-titre : [Comment ça marche en 1 phrase]
CTA : "Get Started" + "Documentation"
Visuel : code snippet ou interface de l'outil
```

**Éléments signature à inclure** :
- Badge GitHub stars (si open source)
- "Available on npm/pip..." sous le CTA
- Extrait de code avec syntax highlighting
- Multi-language selector pour les exemples

---

### B2B SaaS (productivité, collaboration)

**Références** : Linear, Notion (landing), Loom

**Conventions** :
- Dark préféré mais light acceptable
- Démo produit dans la page — le plus tôt possible, le plus fidèle possible
- Social proof : entreprises connues + témoignages de teams (pas de dirigeants corporate)
- Changelog sur la homepage — montre la vélocité produit
- Pricing sans surprise, toggle mensuel/annuel

**Structure hero typique** :
```
H1 : [Outcome pour l'équipe]
Sous-titre : [Ce que c'est en 1 phrase]
CTA : "Start for free" + "Watch demo" ou "Contact sales"
Visuel : screenshot fidèle de l'app avec données réalistes
```

**Éléments signature à inclure** :
- Screenshots de l'app (pas des maquettes idéalisées)
- Données réalistes dans les démos (pas "John Doe", pas "Sample task")
- Changelog cards — grille de releases récentes avec dates
- Nombres d'équipes/utilisateurs actifs

---

### Fintech / Paiements

**Références** : Stripe

**Conventions** :
- **Light mode** — la confiance et la lisibilité financière passent par le blanc
- Accent violet/indigo — distance avec le vert (succès banal) et le rouge (erreur)
- Illustrations 3D isométriques des produits (cartes, terminaux)
- Chaque produit a sa propre landing page (pas de one-pager)
- Documentation mise en avant comme produit
- Certifications et compliance visible (PCI DSS, SOC2…)
- Tarification à l'usage transparente

**Structure hero typique** :
```
H1 : [Infrastructure] for [the internet / your business]
Sous-titre : [Liste des produits en 2 lignes]
CTA : "Start now" + "Contact sales"
Visuel : gradient animé ou illustration isométrique
```

---

### Consumer app / Productivité grand public

**Références** : Raycast, Loom

**Conventions** :
- Téléchargement direct mis en avant (bouton Download avec icône OS)
- Version disponible clairement indiquée (Mac, Windows beta, iOS…)
- Communauté visible (Discord/Slack membres, followers X)
- Galerie d'extensions ou de templates
- Vidéos tutoriels sur la homepage
- Hero très dramatique visuellement (gradient fort, plein écran)

**Structure hero typique** :
```
H1 : [Tagline courte et mémorable]
Sous-titre : [Ce que ça fait en 1 phrase]
CTA : "Download for Mac" + "Download for Windows"
Visuel : gradient spectaculaire OU screenshot app en usage
```

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

Deux approches observées :

1. **Technique/simple** (Linear, Vercel) : feed chronologique, fond sombre, typography sobre, dates en évidence. Pour les audiences dev qui lisent les changelogs.

2. **Éditorial** (Resend) : photos cinématographiques pleine largeur, style magazine tech. Pour les marques qui veulent positionner leur changelog comme un contenu de marque premium.

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

Avant de livrer une landing page :

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

---

## Par type de produit — suite

### Plateformes créateurs / Support

**Références :** Ko-fi, Buy Me a Coffee, Patreon, Gumroad, beehiiv, Contra

**Conventions universelles :**
- 0% de commission ou plan freemium comme argument d'entrée — standard du marché
- Social proof chiffré en hero ("2M+ creators", "$2M earned last week") — systématique
- Ownership de l'audience toujours revendiqué (le créateur possède ses données/fans)
- CTA unique + micro-copy rassurant ("free", "no credit card", "less than a minute") — universel
- Ton friendly anti-corporate (jamais de "clients" — "supporters", "fans", "audience")

**Structure hero typique créateurs :**
```
Rating ★★★★★ + chiffre social proof
H1 : [Valeur émotionnelle pour le créateur]
Sous-titre : [3 bénéfices concrets courts]
CTA : "Start my page" / "Get started"
Micro-copy : "It's free · No credit card · Less than a minute"
```

**Différenciation par sous-type :**
- **Micro-support (Ko-fi, BMC)** : form intégré directement sur page créateur, friction quasi-nulle, ton hyper-chaleureux
- **Memberships (Patreon)** : tiers avec bénéfices explicites, contenu locked/unlocked visible, dashboard analytics riche
- **Produits digitaux (Gumroad)** : store-first, checkout overlay, Merchant of Record (taxes automatiques)
- **Newsletters (beehiiv)** : landing media brandée, formulaire subscribe minimaliste, Ad Network natif
- **Marketplace B2B (Contra)** : workflow contrat + facture, 0% commission, challenges communauté

**Palette par positionnement :**
- Chaleureux/communauté → Crème + pastel (Ko-fi, Gumroad)
- Frictionless/grand public → Blanc + jaune vif (BMC)
- Professionnel/serious → Dark + fuchsia (beehiiv), Blanc + noir (Contra)

---

### Fintech grand public

**Références :** Revolut, Wise, Monzo

**Conventions universelles :**
- Hero avec démonstration du produit avant inscription (simulateur, mockup animé)
- Confiance par la réglementation (FCA, FinCEN, FSCS) visible mais pas envahissante
- Social proof par volume (50M clients, £10Mrd/mois) + presse tech (FT, Forbes)
- CTA : téléchargement direct (App Store + Google Play) + badges
- Aucune couleur d'urgence (rouge/orange agressif) — palettes apaisantes

**Structure hero typique fintech :**
```
H1 : [Promesse financière claire]
Sous-titre : [Transparence sur ce que ça fait]
CTA : "Ouvrir un compte" + badges App Store/Play Store
Visuel : mockup app ou simulateur interactif
```

**Différenciation par philosophie :**
- **Super-app (Revolut)** : densité fonctionnelle, dark mode, ambition mondiale, "cockpit"
- **Transparence (Wise)** : simulateur de taux en temps réel sur la landing, anti-bullshit, "calculatrice"
- **Émotionnel (Monzo)** : chaud, narratif, Hot Coral, "coach bienveillant"

---

### Santé

**Références :** Doctolib, Alan, Withings

**Conventions spécifiques au secteur santé :**
- La confiance est une **couche architecturale**, pas une feature (certifications, stats sourcées, section data dédiée)
- Aucune couleur d'urgence — palettes douces, désaturées, apaisantes
- Typographie accessible : sans-serif lisible, corps généreux, hiérarchie stricte
- Données comme "enjeu existentiel" communiqué explicitement (section entière, pas juste un disclaimer)
- Friction réduite au minimum vital — action immédiate sans compte

**Ce qui différencie le design santé du design tech :**
- Preuve sociale = chiffres massifs sourcés avec méthodologie visible
- RGPD/confidentialité = argument de vente éditorial (pas legal boilerplate)
- Accessibilité = valeur de marque (WCAG AA strict, textes larges, zone tactile ≥44px)
- Prévention = nouveau territoire (rituels quotidiens, coaching, pas seulement gestion du sinistre)

**Structure hero typique santé :**
```
H1 : [Bénéfice patient/utilisateur direct]
Sous-titre : [Explication simple du service]
CTA : Recherche directe / Devis rapide / Découvrir le produit
Visuel : Interface ou produit en contexte d'usage réel
Signal de confiance : Note App Store + nombre d'utilisateurs
```

---

### Bold branding / Identité visuelle forte

**Références :** Duolingo, Arc, Craft, Superhuman, Framer, Pitch

**Principes communs qui permettent un branding fort sans sacrifier l'usabilité :**

1. **Posséder un territoire, pas juste une couleur.** La cohérence systémique (couleur + formes + typo + ton + noms des éléments UI) est incopiable. Une couleur hex dans un brandbook peut être copiée en une nuit.

2. **Le branding vit dans les détails imperceptibles.** Craft prouve qu'un fond off-white chaud + serif à letter-spacing négatif crée une identité aussi forte que le vert de Duolingo. Superhuman prouve qu'une police qui porte le nom de la marque ("Super Sans") vaut plus qu'une charte de 50 pages.

3. **La cohérence landing ↔ app est le vrai test.** Arc ne promet pas des gradients pour livrer une interface grise. Framer construit sa landing avec Framer. Pitch propose des templates visuellement audacieux — pas du PowerPoint beige.

**Patterns par style :**

| Style | Exemple | Couleur | Typo | Ton |
|---|---|---|---|---|
| Gamification/mascotte | Duolingo | Vert chartreuse `#58CC02` | DIN Round, lowercase | Décalé, menaçant |
| Radical/revendicatif | Arc | Bleu électrique `rgb(49,57,251)` | Marlin Soft SQ | Artisanal-intellectuel |
| Premium/matière | Craft | Off-white chaud | Serif letter-spacing négatif | Éditorial, serein |
| Élitiste/aspirationnel | Superhuman | Gradient lavande-rose | Super Sans (propriétaire) | Confiant, adulte |
| Le produit est la pub | Framer | Noir absolu `#000` | GT Walsheim, 84px | Concis, technique |
| Provocateur | Pitch | Violet `#6B53FF` | Mark Pro 800 | Énergique, déclaratoire |

---

### AI / Interfaces conversationnelles

**Références :** Claude.ai, ChatGPT, Perplexity

**Conventions de landing page AI :**
- L'institutionnel et le produit sont maintenant séparés (anthropic.com ≠ claude.ai, openai.com ≠ chatgpt.com)
- La sécurité/éthique IA comme positionnement marketing (Anthropic en premier, OpenAI en rubrique)
- Démonstration du produit directement en hero (ChatGPT : input sur la homepage)
- Screenshots de l'interface comme hero visuel principal

**La guerre de positionnement émotionnel :**
- **Chaleur humaine** (Anthropic) : crème, terracotta, serif, "slow design"
- **Puissance froide** (OpenAI) : noir/blanc pur, sans-serif, densité
- **Vérifiabilité techno** (Perplexity) : teal froid, icônes, citations inline


---

### E-commerce

**Références :** Shopify (plateforme marchands), Etsy (marketplace artisanal), Vinted (C2C seconde main)

**Distinction fondamentale :** Shopify.com vend la **plateforme** aux marchands (SaaS B2B). Etsy et Vinted sont des **marketplaces** qui vendent directement aux consommateurs.

**Shopify — landing SaaS marchand :**
```
Hero : aspiration émotionnelle (vidéo de vrais marchands, headline rotation)
→ Proof sociale immédiate (logos Glossier, Mattel, Cabaïa)
→ Scaling story par taille (artisan → PME → enterprise)
→ Features thématiques progressives
→ Stats de performance chiffrées (+15% conversion, 150M acheteurs)
→ Démo interactive 3 étapes
→ CTA final
```
Dark premium sur le marketing site, light fonctionnel dans l'admin.

**Etsy — landing marketplace éditoriale :**
- Homepage saisonnière et éditoriale (change selon fêtes/saisons)
- Pas de hero produit fixe — curation thématique en permanence
- Découverte guidée par univers (pas par catégorie froide)
- Accent orange chaleureux, fond blanc, typographie lisible

**Vinted — landing C2C mobile-first :**
- Hero orienté **vendeur** d'abord ("Prêt à faire du tri ?")
- Feed de produits directement sous le hero — pas de curation
- Message principal : vendre est facile et gratuit (0% commission)
- Tutoiement systématique — proximité avec l'utilisateur

**Conventions e-commerce universelles :**
- Barre de recherche centrale proéminente (Etsy et Vinted)
- Social proof volume : "150M acheteurs actifs", "500K+ résultats"
- Programme de confiance acheteur visible (Buyer Protection, Shop Pay)
- Navigation par catégories en second tier sous le header

