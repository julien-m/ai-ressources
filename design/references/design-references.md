# Design References — Système de design par société

> Référence rapide pour orienter les choix visuels d'un projet.
> Pour chaque société : système de design complet (landing + app).
> Mis à jour : mars 2026

---

## Vercel

**Positionnement :** Plateforme cloud developer-first, edge computing, AI Cloud.
**Mode par défaut :** Dark (noir absolu `#000000`)
**Audience :** Développeurs, équipes produit, enterprise tech.

### Système de design

| Élément | Valeur |
|---|---|
| Background | `#000000` (noir absolu) |
| Surface | `#111111` (sidebar, cards) |
| Border | `rgba(255,255,255,0.1)` |
| Accent | Blanc pur `#ffffff` (CTA), bleu `#0070F3` (liens actifs) |
| Texte primaire | `#ffffff` |
| Texte secondaire | `rgba(255,255,255,0.5)` |
| Status success | Vert `#00C853` |
| Status error | Rouge `#EB5757` |
| Police UI | **Geist Sans** (propriétaire open-source) |
| Police technique | **Geist Mono** (URLs, IDs, logs, commits) |
| Taille body | 13–14px |
| Taille H1 landing | 56–64px extra-bold |

### Signatures visuelles

- **Grille en pointillés** avec crosses aux angles — élément signature sur toutes les pages
- **Noir absolu** comme fond — pas de gris, pas de nuances sombres
- **Monochrome total** — la couleur n'existe que pour véhiculer des états (vert = ok, rouge = erreur)
- **Geist Mono** omniprésente pour tout ce qui est technique
- **Globe 3D animé** et données live (classement modèles IA) dans les sections marketing
- **Mega-menu** 3 colonnes avec icônes monochrome + titre + sous-titre
- Page 404 : logo déconstruit en pointillés — géométrique, sobre

### Landing page

- Fond noir, typographie blanche, aucune couleur décorative
- Hero : triangle 3D animé sur grille de couleurs spectrales (seul élément coloré)
- Sections avec scroll-triggered animations (fade + translateY)
- Démos produit avec données en temps réel (ex: classement live des modèles IA)
- CTA : "Deploy" (filled noir) + "Get a Demo" (outline)
- Footer : 12 colonnes, status bar "ALL SYSTEMS NORMAL" en vert

### App (dashboard)

- Structure : sidebar gauche `#111` + contenu sur `#000`
- Sidebar contient : workspace switcher, search "Find... F", nav principale
- Vue Deployments : table avec status dots (●), URLs en mono, dates relatives
- Deployment detail : onglets (Overview / Functions / Analytics / Logs…)
- Onboarding signature : "Import Git Repository" — 2 clics → premier déploiement
- Build logs en style terminal
- Environment variables avec masquage

### Cohérence landing ↔ app

**Excellente.** Landing et app partagent exactement la même palette, la même police (Geist), la même esthétique noir absolu. Aucune surprise visuelle à la connexion.

---

## Resend

**Positionnement :** Email infrastructure pour développeurs (transactionnel + marketing).
**Mode par défaut :** Dark (noir absolu `#000000`)
**Audience :** Développeurs, startups, équipes produit.

### Système de design

| Élément | Valeur |
|---|---|
| Background | `#000000` |
| Accent principal | Violet/Purple `#7C3AED` |
| Accent secondaire | Vert pour status |
| Texte primaire | `#ffffff` |
| Police H1 (landing) | **Serif élégant** (style Garamond condensed, ~80–100px) |
| Police body | Sans-serif moderne |
| Taille H1 | 80–100px |

### Signatures visuelles

- **Mélange typographique audacieux** : serif premium pour les headlines, sans-serif pour le corps — positionnement sophistiqué dans un univers technique froid
- **Mega-wordmark** dans le footer : nom "Resend" en typo géante semi-transparente — repris sur toutes les pages
- **Objets 3D photoréalistes** : cube Rubik's en métal noir, icône app iOS enveloppe violette
- **Changelog en magazine éditorial** : photos studio cinématographiques pleine largeur, dates en marge gauche
- **Slider de pricing** interactif avec calcul dynamique (3K → 3M+ emails) — l'un des plus transparents du secteur

### Landing page

- Fond noir absolu, serif pour les headlines = identité premium immédiate
- Hero : texte gauche (serif 80–100px) + cube 3D photorealistique droite
- Social proof : grille de logos (Warner Bros, Supabase, Mistral, Decathlon…)
- Sections features : alternance gauche/droite avec démos de l'éditeur email
- CTA final : "Email reimagined. Available today." — serif très grand, centré
- Footer avec mega-wordmark signature

### App / Docs

- Docs (`/docs`) : sidebar sombre + contenu, header par onglets (Documentation / API Reference / AI / Webhooks…)
- Toggle dark/light disponible
- Cards quickstart avec icônes frameworks
- Commande ⌘K + assistant IA intégré

### Cohérence landing ↔ app

**Très cohérente.** Noir absolu + violet accent + dualité serif/sans maintenus partout.

---

## Linear

**Positionnement :** Outil de gestion de projets produit/engineering, opinionated.
**Mode par défaut :** Dark (noir profond `#0d0d0f`, légèrement bleuté)
**Audience :** Équipes produit, ingénieurs, startups tech.

### Système de design

| Élément | Valeur |
|---|---|
| Background | `#0d0d0d` (quasi-noir, légèrement bleuté) |
| Surface sidebar | `#111113` (volontairement plus sombre que le contenu) |
| Surface contenu | `#141416` |
| Border | `rgba(255,255,255,0.07)` |
| Accent | Indigo `#5E6AD2` |
| Texte primaire | `#f0f0f0` |
| Texte secondaire | `rgba(255,255,255,0.4)` |
| Police UI | **Inter** (body) + **Inter Display** (headings, depuis redesign 2024) |
| Police technique | **Monospace** pour les IDs d'issues (ENG-2703) |
| Taille body liste | 13px |
| Taille H1 landing | 72–88px condensed ultra-bold |

### Signatures visuelles

- **IDs d'issues en monospace** : `ENG-2703` — signal de précision technique
- **Status indicators** : cercle (Todo), demi-cercle (In Progress), check (Done), croix (Cancelled) — couleurs fonctionnelles uniquement
- **Sidebar plus sombre** que le contenu — hiérarchie visuelle par contraste, pas par bordure
- **Démo produit inline interactive** en hero : réplique HTML fidèle de l'app, données réalistes incluant l'IA
- **Page Method** : rupture éditoriale intentionnelle — serif massif, philosophie produit comme contenu premium
- **Cmd+K omnibox** : navigation clavier comme fonctionnalité de première classe

### Landing page

- Fond noir profond, typographie condensed ultra-bold pour le hero
- Hero : pas de CTA immédiat — la démo produit parle d'abord
- Démo interactive = réplique fidèle de l'app (pas une maquette) avec données IA réalistes
- Sections scroll-jacking dosé : les panels UI apparaissent/disparaissent au scroll
- Changelog cards sur la homepage (grille 4 colonnes, points colorés)
- Page `/method` : rupture serif/philosophique — seule page du genre dans le secteur

### App (app.linear.app)

- Structure : L inversé — sidebar gauche étroite (~220px) + liste centrale + détail droit (split)
- Pas de topbar globale horizontale — chaque vue a son propre header contextuel
- Vue liste : rows 32px, identifiant mono gris, titre, labels (pills), avatar 20px, priorité (bar chart icon), date
- Vue Kanban : colonnes Todo/In Progress/In Review/Done, cards compactes sans image preview
- Vue détail : éditeur markdown + Activity timeline (avatars + timestamps relatifs) + Properties
- Propriétés : liste de paires icône+valeur cohérentes (statut, priorité, assignee, labels, cycles)
- Input "Message Codex..." en bas du détail — commande IA contextuelle
- Densité : **balanced-to-dense** (~20 issues visibles sans scroll)
- Système de thème : LCH à 3 variables (base, accent, contrast) — génère des centaines de tokens

### Cohérence landing ↔ app

**La meilleure du panel.** La landing est dark, same typo, same palette. Les screenshots dans la landing sont de vraies captures de l'app, pas des maquettes.

---

## Stripe

**Positionnement :** Infrastructure de paiement et services financiers pour internet.
**Mode par défaut :** Light (fond blanc `#ffffff`) — seul parmi les devtools
**Audience :** Développeurs, CFOs, équipes finance & growth.

### Système de design

| Élément | Valeur |
|---|---|
| Background | `#ffffff` |
| Sidebar background | `#F6F9FC` (gris froid très clair) |
| Border | `#E3E8EF` |
| Accent principal | Indigo-violet `#635BFF` |
| Texte principal | `#1A1F36` (quasi-noir avec teinte bleue) |
| Status success | Vert `#30C078` |
| Status error | Rouge `#EB5757` |
| Status pending | Orange `#F7A139` |
| Status inactive | Gris `#8898AA` |
| Police UI | **Sohne** (Klim Type Foundry) |
| Police technique | **Roboto Mono** (IDs : pi_xxx, cus_xxx, ch_xxx) |
| Taille body | 14px |
| Taille table labels | 13px |

### Signatures visuelles

- **Light mode assumé** — prise de position forte dans un écosystème ultra-dark
- **IDs d'objets** (pi_xxx, cus_xxx, ch_xxx) avec bouton copy — devenus une convention de l'industrie fintech
- **Illustrations isométriques 3D** (cartes, terminaux, graphiques) — iconiques, largement copiées
- **Gradient animé** du hero (bleu/violet/cyan en mouvement lent)
- **Sparklines** dans les metric cards — information maximum, espace minimum
- **Event timeline** vertical avec dots — standard de tous les dashboards financiers

### Landing page

- Fond blanc ou très légèrement gris — unique dans le panel
- Hero centré, gradient animé bleu/violet en arrière-plan
- Grille de logos clients enterprise (Amazon, Google, Zoom, Salesforce…)
- Sections alternées gauche/droite avec illustrations isométriques 3D
- Chaque produit a sa propre landing (/payments, /billing, /connect…)
- Documentation = référence absolue du secteur (simulateur de paiement intégré, multi-langages)

### App (dashboard)

- Structure : sidebar gauche dense (30+ items en groupes collapsibles) + topbar (breadcrumb, account switcher, notifications) + contenu
- Vue Overview : metric cards en rangée (Gross/Net volume, Customers, Subscriptions) avec sparklines + % variations
- Vue Payments : table dense — Date, Amount, Status badge pill, Customer, Payment method (avec logos Visa/MC)
- Vue Customer detail : header (nom, email, ID cus_xxx en mono) + sections (Payment methods, Invoices, Events)
- Event timeline : vertical, timestamps précis, type d'action + lien vers objet
- Settings : fond blanc, cards blanches, titres en gras, toggles et inputs du Stripe UI system
- App mobile : bottom tabs, metric cards en stack vertical, même palette light

### Cohérence landing ↔ app

**Bonne mais avec une tension.** La landing est très marketing (gradients, illustrations 3D colorées) vs app sobre et quasi-austère. Changement de registre perceptible mais assumé.

---

## Clerk

**Positionnement :** Authentication et user management pour développeurs.
**Mode par défaut :** Hybride — homepage light/dark, pricing dark, changelog light
**Audience :** Développeurs, startups, équipes produit.

### Système de design

| Élément | Valeur |
|---|---|
| Background light | `#fafafa` |
| Background dark | `#0a0a0a` |
| Accent principal | Violet `#6C47FF` |
| Texte | `#000000` (light) / `#ffffff` (dark) |
| Police | Sans-serif bold (Inter Black ou custom) |
| Taille H1 | 56px |

### Signatures visuelles

- **Transition ondulée light→dark** mid-homepage (clip-path ondulé) — moment UX mémorable et rare
- **Topbar fundraise** : bandeau noir "Clerk raises $50m Series C" — bien géré (discret mais visible)
- **Circuit imprimé en filigrane** dans le hero (pointillés bleus très légers formant des connexions)
- **Cards de composants UI** en dark (fond `#1a1a1a`) avec démos animées — montre le produit concret avant l'essai

### Landing page

- Homepage bimodale : light (hero, social proof) → transition ondulée → dark (features, security) → light (B2B)
- Hero : illustration circuit imprimé en filigrane + H1 ultra-bold
- Section composants : 3 cards dark avec démos interactives animées (Sign-up, User Profile…)
- CTA final : card arrondie fond blanc, dégradé bleu/violet en fond avec logo C

### App / Docs

- Docs (`/docs`) : fond sombre, sidebar hiérarchique, organisation par framework

### Cohérence landing ↔ app

**Bonne mais dualité assumée.** La transition light/dark mid-page est un choix délibéré mémorable, mais crée une légère incohérence entre pages (Pricing dark, Changelog light).

---

## Raycast

**Positionnement :** Launcher & productivité pour macOS/Windows, orienté power users.
**Mode par défaut :** Dark (noir absolu `#000`)
**Audience :** Développeurs, designers, power users.

### Système de design

| Élément | Valeur |
|---|---|
| Background | `#000000` |
| Accent principal | Rouge/Orange (gradient) |
| Police H1 | Sans-serif bold |
| Police contenu developer | **Monospace** (sections dev) |
| Taille H1 | ~80px |

### Signatures visuelles

- **Navbar pill flottante arrondie** — comme macOS, communique immédiatement "app native" — unique dans le panel
- **Gradient rouge/orange dramatique** dans le hero (diagonales de lumière, le plus spectaculaire du panel)
- **Illustrations FIG isométriques** fil-de-fer : keyboard, composants UI, toggle — style manuel technique "engineering magazine"
- **Monospace dans les sections developer** : "Build with React, TypeScript and Node" en mono — parfaitement cohérent avec l'audience
- **Cards d'extensions aux couleurs des apps tiers** : vert Linear, vert Spotify, rouge Google Translate

### Landing page

- Hero plein écran : gradient rouge/orange spectaculaire + H1 "Your shortcut to everything." + CTA Download
- Version CLI/homebrew affichée sous les CTA — signal très developer
- Extensions par catégories (Productivity/Engineering/Design/Writing) avec cards animées
- Illustrations FIG isométriques pour la section developers
- Newsletter dans le footer avec "no spam" — micro-copy exemplaire

### App (non accessible publiquement)

- Interface launcher : popup flottant avec search omnibox centrale
- Dark mode total, même esthétique que le site

### Cohérence landing ↔ app

**Très cohérente.** Navbar pill, noir + rouge, monospace pour le contenu dev — système homogène.

---

## Supabase

**Positionnement :** Backend-as-a-service open source (Postgres, Auth, Functions, Storage).
**Mode par défaut :** Dark (`#0f1117` — gris-bleu sombre, pas noir pur)
**Audience :** Développeurs, open source community, startups.

### Système de design

| Élément | Valeur |
|---|---|
| Background | `#0f1117` (gris-bleu sombre) |
| Surface cards | Légèrement plus clair que bg |
| Border | `1px gris` ≈ `rgba(255,255,255,0.1)` |
| Border-radius cards | ~8px |
| Accent principal | Vert **Supabase** `#3ECF8E` |
| Accent secondaire | Orange pour certains highlights |
| Texte | Blanc/gris sur dark |
| Police | Custom ou Inter, weight normal/medium (pas ultra-bold) |
| Taille H1 | 56–64px |

### Signatures visuelles

- **Vert Supabase** `#3ECF8E` — la couleur la plus distinctive et cohérente du panel. CTAs, titres highlight, icônes features, badges : discipline stricte
- **Compteur GitHub en live** dans la navbar (98K+ stars) — preuve sociale permanente, unique dans le panel
- **H1 bicolore** : "Build in a weekend" (blanc) / "Scale to millions" (vert) — formula copy mémorable
- **Launch Week** comme tradition de release — sorties produit transformées en événements communautaires
- **Page Company** centrée sur les chiffres communautaires (7M+ developers) — plus convaincant pour un dev que n'importe quel storytelling

### Landing page

- Fond `#0f1117`, accent vert très discipliné
- Hero centré, H1 bicolore, 2 CTAs verts
- Grille features produits : cards larges (Database, Auth, Functions, Realtime, Storage, Vector, Cron, Queues)
- Chaque card : icône verte + titre + sous-titre + visuel technique (schéma BDD, code snippet)
- Stats communautaires : 7M+ developers, 98K GitHub stars, HIPAA/SOC2
- Footer : 5 colonnes, toggle dark/light

### App (dashboard)

- Structure : sidebar gauche + topbar + contenu
- Sidebar : accès aux produits (Database, Auth, Storage, Functions, Realtime, API, Logs, Settings)
- Dashboard Postgres : vue tables, éditeur SQL, visualisation schéma
- Auth dashboard : liste users avec statuts (Active, Banned), search, création manuelle
- Storage : interface type Finder (dossiers + fichiers avec preview)
- API : référence auto-générée depuis le schéma Postgres

### Cohérence landing ↔ app

**Excellent niveau.** Vert Supabase appliqué avec discipline stricte partout. Grille `#0f1117` constante. Format de cards identique sur toutes les pages.

---

## Tableau de référence rapide

| Société | Mode | Accent | Typo H1 | Densité app | Audience |
|---|---|---|---|---|---|
| **Vercel** | Dark `#000` | Monochrome | Sans bold 56–64px | Dense | Devs |
| **Resend** | Dark `#000` | Violet | **Serif** 80–100px | — | Devs |
| **Linear** | Dark `#0d0d0f` | Indigo `#5E6AD2` | Condensed bold 72–88px | Dense | PM + Devs |
| **Stripe** | **Light** `#fff` | Indigo `#635BFF` | Sans bold 56px | Dense | Devs + Finance |
| **Clerk** | Hybride | Violet `#6C47FF` | Sans black 56px | — | Devs |
| **Raycast** | Dark `#000` | Rouge/Orange | Sans bold 80px | — | Power users |
| **Supabase** | Dark `#0f1117` | Vert `#3ECF8E` | Sans medium 56–64px | Medium | Devs + Open source |

---

# Créateurs / Support — Références

## Ko-fi

**Positionnement :** Plateforme de micro-support, anti-algorithme, 0% sur les tips.
**Mode :** Light (fond beige crème `#f0ece4`)
**Audience :** Artistes, streamers, hobbyistes, créateurs indépendants.

| Élément | Valeur |
|---|---|
| Background | Beige crème `#f0ece4` |
| Accent CTA | Bleu pastel `#6DB0EF` |
| CTA secondaire | Noir `#1a1a1a` |
| Couleur de marque | Orange/roux (illustrations) |
| Police | Sans-serif arrondie (proche Nunito/Outfit Bold) |
| Taille H1 | 72–80px Black/800 |
| Densité | Airy |
| Motion | Lottie organique, fade-in scroll |

**Signatures :** Illustrations chaleureuses, palette crème "café du dimanche", 0% de frais sur les tips, paiement direct Stripe/PayPal (Ko-fi ne touche jamais les fonds). Anti-algorithme comme valeur de marque explicite. Page créateur : widget de support intégré directement sans clic supplémentaire.

---

## Buy Me a Coffee

**Positionnement :** Tips + shop + memberships, one-tap checkout, friendly.
**Mode :** Light (blanc pur `#ffffff`)
**Audience :** Créateurs de contenu, grand public.

| Élément | Valeur |
|---|---|
| Background | Blanc pur `#ffffff` |
| Accent | Jaune soleil `#FFDD00` |
| Texte | Quasi-noir `#1A1A1A` |
| Police | Sans-serif (proche Manrope/DM Sans) |
| Taille H1 | 56–64px semi-bold |
| Densité | Airy |
| Motion | Minimal, démo widget en loop |

**Signatures :** One-tap checkout sans création de compte (le plus frictionless du marché). Ownership totale des données fans (BMC n'envoie jamais d'emails aux supporters). App mobile avec notifications push par support — sentiment de connexion humaine. Ton le plus "friendly" du panel.

---

## Patreon

**Positionnement :** Memberships récurrents, plateforme de référence créateurs pro.
**Mode :** Light + dark partiel sur sections hero
**Audience :** Créateurs professionnels à fort volume de membres.

| Élément | Valeur |
|---|---|
| Accent | Violet/corail `#FF424D` |
| Police | Sans-serif propre (proche Circular/Proxima Nova) |
| Taille H1 | 48–56px bold |
| Densité | Balanced |
| Frais | 5–12% selon plan |

**Signatures :** Dashboard analytics le plus riche (courbes, churn, tier performance, revenus réels). Système de tiers avec bénéfices explicites — meilleur pour la conversion. L'OG du membership récurrent pour créateurs. Contenu "locked" visuellement distinct sur la page créateur — teasing psychologiquement efficace.

---

## Gumroad

**Positionnement :** Vente de produits digitaux, open source, Merchant of Record.
**Mode :** Light (crème/ivoire `#F4F2ED`)
**Audience :** Vendeurs de PDFs, brushes, cours, outils — profil EdTech/ProductHunt.

| Élément | Valeur |
|---|---|
| Background | Crème/ivoire `#F4F2ED` |
| Accent | Rose vif `#FF90E8` |
| Police H1 | **Serif élégant** (proche Playfair/Canela) |
| Taille H1 | 80–96px regular/light |
| Densité | Airy |
| Motion | Quasi aucun — délibérément humble |

**Signatures :** Open source (GitHub 8.7K stars) — unique dans la catégorie. Copywriting philosophique et humble ("Start Small", "Place Small Bets"). Merchant of Record depuis 2025 (gestion fiscale mondiale automatique — différenciateur massif pour les créateurs internationaux). Compteur live "$2M earned last week".

---

## beehiiv

**Positionnement :** Newsletter + paid subscriptions + Ad Network natif.
**Mode :** Dark (fond quasi-noir `#0A0A0A`)
**Audience :** Journalistes, newsletter operators, media builders.

| Élément | Valeur |
|---|---|
| Background | `#0A0A0A` |
| Accent | Rose/magenta `#FF3D8F` |
| Police H1 | Uppercase ultra-bold condensed (80–100px) |
| Densité | Balanced-dense |
| Motion | Spring animations (Framer) |
| Frais | 0% sur abonnements payants (Scale+) |

**Signatures :** Seul acteur avec Ad Network natif intégré. "3D Analytics" (visualisation cubique des stats — unique industrie). Réseau de "Boosts" (payer pour être recommandé dans d'autres newsletters). 0% de commission sur les revenus d'abonnements payants. Dark mode hero assumé — seul du panel en dark.

---

## Contra

**Positionnement :** Marketplace freelance B2B + réseau social créatif, 0% commission.
**Mode :** Light (blanc pur)
**Audience :** Freelancers créatifs, entreprises tech.

| Élément | Valeur |
|---|---|
| Background | Blanc pur |
| Accent | Vert émeraude `#00FF88` (badges PRO) |
| Police | Sans-serif géométrique neutre (Inter/Söhne) |
| Taille H1 | 42–48px medium |
| Densité | Airy |
| Motion | Spring (Framer), identique beehiiv |

**Signatures :** 0% de commission (financé par Contra Pro + frais entreprise). Challenges brandés (Bubble, Notion, Framer) — centaines de participants génèrent du marketing organique. Badge "Top Independent" — hiérarchie de prestige. Checkout B2B sérieux (contrat + facture), pas un tip jar.

---

# Fintech grand public — Références

## Revolut

**Positionnement :** Super-app financière, 50M+ clients, dark et ambitieux.
**Mode :** Dark (`#0D0D0D`) — identité centrale
**Audience :** Power users, voyageurs, crypto/bourse, utilisateurs premium.

| Élément | Valeur |
|---|---|
| Background app | `#0D0D0D` |
| Surface | `#1A1A1A` |
| Accent | Or/gradient (tiers premium), violet (crypto), vert (positif), rouge (dépense) |
| Police | Revolut Font (custom, proche GT Walsheim) + Inter |
| Montant balance | 40–48px bold, blanc |
| Navigation | Bottom tabs × 5 (Home, Carte, Hub, Analytics, Profil) |
| Densité | Dense (30+ services, 5 onglets) |

**Signatures :** Densité fonctionnelle maximale sans chaos visuel. Onboarding KYC automatisé < 5 minutes (référence industrie). Disposable Virtual Cards (cartes jetables CVV dynamique). Notifications push instantanées. "Hub" central = marketplace de services (crypto, bourse, assurance…). Métaphore : cockpit de pilotage.

---

## Wise

**Positionnement :** Transfert international transparent, mid-market rate affiché.
**Mode :** Light (blanc pur + vert `#9FE870`)
**Audience :** Nomades numériques, expatriés, freelances internationaux.

| Élément | Valeur |
|---|---|
| Background | Blanc pur |
| Accent | Vert citron `#9FE870` |
| Hero fond | Vert foncé `#1E3932` |
| Police | Wise Sans (custom humaniste) + Wise Serif (headlines éditoraux) |
| Navigation | Bottom tabs × 4–5 (Home, Envoyer, Carte, Compte) |
| Densité | Functional — utilitaire assumé |

**Signatures :** Simulateur de taux en temps réel directement sur la landing (valeur prouvée avant inscription). Transparence absolue des frais à chaque étape du tunnel. A imposé l'affichage du "mid-market rate" comme standard industrie. Métaphore : calculatrice précise et honnête.

---

## Monzo

**Positionnement :** Banque émotionnellement intelligente, Hot Coral, communauté UK.
**Mode :** Light natif (dark disponible depuis 2024)
**Audience :** Grand public UK, personnes voulant "comprendre" leurs finances.

| Élément | Valeur |
|---|---|
| Background | Blanc pur |
| Accent | Hot Coral `#FF6B6B` |
| Police | Monzo Maison Neue Bold (arrondie, chaude) + Inter/système |
| Montant balance | 44–52px |
| Navigation | Bottom tabs × 5 |
| Densité | Narrative — la plus riche en contexte émotionnel |

**Signatures :** Hot Coral Card — l'objet de branding le plus mémorable de la fintech (visible à 2m, génère des conversations). Catégorisation des transactions la meilleure du secteur (50K+ logos marchands, auto-categorization). "Pots" (sous-comptes nommés colorés pour objectifs) — copié par presque toutes les néo-banques depuis 2019. Notifications post-transaction avec budget restant + antifraud in-tap. Métaphore : coach financier bienveillant.

---

# Santé — Références

## Doctolib

**Positionnement :** Prise de RDV médicale, leader français, 26M users/mois.
**Mode :** Light (fond bleu très pâle `rgb(228, 237, 246)`)
**Audience :** Grand public, toutes générations incluant seniors.

| Élément | Valeur |
|---|---|
| Background | Bleu très pâle `rgb(228,237,246)` |
| Accent | Bleu institutionnel `#0596DE` |
| Texte | Bleu marine `#00264C` |
| Police | Roboto (corps) + Montserrat (titres) |
| Taille H1 | 32px mobile, progressif |
| Densité | Airy — pensé pour seniors |

**Signatures :** Barre de recherche omniprésente en hero (action immédiate sans compte). Preuve sociale volumétrique sourcée (90M personnes, 500K soignants). Section "Vos données" traitée comme argument de vente éditorial, pas disclaimer légal. Aucune couleur d'urgence (pas de rouge/orange). WCAG AA strict.

---

## Alan

**Positionnement :** Assurance santé digitale, prévention active, ton disrupteur.
**Mode :** Light bimodal — beige/pêche hero, blanc corps
**Audience :** Startups, PME, indépendants — 1M membres, 33K entreprises.

| Élément | Valeur |
|---|---|
| Background hero | Beige/pêche `#F5E6D4` — zéro bleu médical |
| Accent | Violet/indigo `#5B50F0` |
| Police | AlanSans (custom humaniste arrondie, très distinctive) |
| Taille H1 | 40px, blanc sur beige/pêche |
| Densité | Airy avec sections colorées alternées |

**Signatures :** Rupture chromatique totale avec le bleu médical conventionnel. Pédagogie par la preuve (stats systèmes santé sourcées — DRESS 2023, UFC Que Choisir 2024). "Clinique Alan" (médecins 7j/7 par tchat) intégrée dans l'app. Prévention comme rituel quotidien (Alan Play, défis). Séparation architecturale données médicales / données employeur.

---

## Withings

**Positionnement :** Objets de santé connectés, positionnement premium lifestyle.
**Mode :** Bimodal — noir profond hero produit, beige crème sections catalogue
**Audience :** Utilisateurs aspirant au wellness/longévité, profil Apple/premium.

| Élément | Valeur |
|---|---|
| Background hero | Noir `rgb(31,31,31)` |
| Background catalogue | Beige crème `#F5F0E8` |
| Accent | Violet/indigo (Withings+) |
| Police | Aeonik (géométrique, H1 à 73.97px — très grand) |
| Densité | E-commerce premium |

**Signatures :** Esthétique Apple/Braun (beige crème + noir + typo géométrique large). Objet physique comme déclencheur d'onboarding (la carte légitime la collecte de données). "Vos données de santé sont toujours gratuites" — réponse frontale à la monétisation data. Vocabulaire lifestyle ("Cultivez votre longévité") plutôt que médical.

---

# Bold branding — Références

## Duolingo

**Positionnement :** Apprentissage des langues, gamification, mascotte virale.
**Mode :** Light dominant
**Audience :** Grand public mondial, toutes générations.

| Élément | Valeur |
|---|---|
| Accent | Feather Green `#58CC02` (chartreuse électrique) |
| Police | DIN Round (arrondie, lowercase intentionnel) |
| Mascotte | Duo le hibou (personnalité réelle : menaçant, qui pleure, qui célèbre) |
| Densité | Low — une question par écran |
| Palette secondaire | 6 couleurs nommées d'après animaux (Macaw, Cardinal, Bee…) |

**Signatures :** Système entier construit sur le monde naturel. Lowercase systématique ("gratuit. fun. efficace.") — énergie message texte. Mascotte avec vraie personnalité émotionnelle — cohérence entre notifications marketing et app. Gamification (streak, XP, coeurs) avec forme visuelle identifiable. Illustrations 3D isométriques light.

---

## Arc Browser

**Positionnement :** Browser macOS/Windows, violet radical, personnalisation.
**Mode :** Dark + fonds crème pour contenu
**Audience :** Power users, designers, créatifs.

| Élément | Valeur |
|---|---|
| Accent | Bleu électrique `rgb(49,57,251)` — outremers revendicatif |
| Fond contenu | Crème `rgb(255,252,236)` |
| Police | Marlin + Marlin Soft SQ (custom, organique) |
| Séparateurs | Wave border ondulée (sérigraphie) |
| Gradients | Arc-en-ciel dans les tabs utilisateur |

**Signatures :** "The Browser Company of New York" — nom qui sonne maison de mode. Personnalisation du gradient par Space (utilisateur co-crée son identité visuelle). Wave border signature entre sections. Italique sur *your* dans les headlines. Logo poulpe/fleur instable et ludique.

---

## Craft

**Positionnement :** Document editor premium, esthétique papier japonais.
**Mode :** Light (off-white chaud `rgb(252,249,247)`)
**Audience :** Créateurs, writers, profil Apple-premium.

| Élément | Valeur |
|---|---|
| Background | Off-white chaud `rgb(252,249,247)` — lin, papier premium |
| Accent | Minimal — noir sobre |
| Police titres | UntitledSerifFont, letter-spacing `-2.32px`, weight 400 |
| Police corps | UntitledSansFont |
| Taille H1 | Large, dense, comme un titre de livre |
| Densité | Airy — espaces généreux |

**Signatures :** Fond off-white chaud comme identité (vs blanc froid de l'industrie). Serif avec letter-spacing négatif = "le contenu créé ici mérite une belle forme". Polices nommées "UntitledSans/Serif" — acte de positioning discret. Apple Design Award 2021. Paysages naturels dans les illustrations hero.

---

## Superhuman

**Positionnement :** Email ultra-premium, élitiste assumé, "Becoming Superhuman".
**Mode :** Dark navy-violet + crème pour le corps
**Audience :** Power users, executives, early adopters premium.

| Élément | Valeur |
|---|---|
| Accent | Dark navy-violet `rgb(27,25,56)` |
| Fond corps | Crème `rgb(252,250,247)` |
| Hero | Gradient lavande → bleu ciel → rose poudré (bokeh photo) |
| Police | Super Sans (propriétaire) weight 500, 48px |
| Densité | Dense — email optimisé keyboard-first |

**Signatures :** Police qui porte le nom de la marque ("Super Sans"). Gradient héro bokeh = esthétique mode/luxe. Gamification audio (sons de confirmation). "Trusted by the most innovative companies" sans discount ever. Élitisme assumé qui filtre naturellement vers les power users.

---

## Framer

**Positionnement :** Website builder pour designers, "la landing EST le produit".
**Mode :** Dark (noir absolu `#000`)
**Audience :** Designers, agences, équipes product.

| Élément | Valeur |
|---|---|
| Background | Noir absolu `#000` |
| Accent | Blanc pur (logo, CTAs) |
| Police | GT Walsheim Framer Medium, 84px, condensed |
| Galerie | Sites clients comme identité visuelle (pas de mascotte) |
| Densité | Dense editor, airy landing |

**Signatures :** La landing elle-même est construite avec Framer — le médium est le message. Galerie de sites clients (Perplexity, ElevenLabs, Dribbble) comme fond de page. Noir absolu laisse la couleur aux créations des utilisateurs. Logo F = outil de sélection/flèche (référence design tool).

---

## Pitch

**Positionnement :** Présentations visuellement audacieuses, "Don't just present. Pitch."
**Mode :** Dark violet dominant
**Audience :** Sales, founders, équipes qui veulent gagner (deals, fundings).

| Élément | Valeur |
|---|---|
| Accent | Violet `#6B53FF` (gradient `rgb(141,73,247)` → `rgb(107,83,255)`) |
| Police | Mark Pro (weight 800, 60px) + Eina01 corps |
| Fond hero | Gradient violet plein écran |
| Densité | Medium |

**Signatures :** "Don't just present. Pitch." — impératif + point final, ton déclaratoire. Templates visuellement agressifs (éduquent les utilisateurs vers des décks premium). Violet non-occupé dans la catégorie présentation. Chaque deck partagé = publicité produit organique.

---

# AI / Interfaces conversationnelles — Références

## Anthropic / Claude

**Positionnement :** AI safety-first, slow design, éditorial institutionnel.
**Mode :** Institutionnel crème / App dark
**Audience :** Chercheurs, développeurs, power users, professionnels.

| Élément | Valeur |
|---|---|
| Background institutional | Crème/ivoire `#F2EFE8` |
| Background app | Noir-brun `#1A1A18` |
| Accent | Terracotta/orange (étoile Claude) |
| Police institutional | Serif display (éditorial) + sans corps |
| Taille H1 institutional | 60–80px |
| Navigation app | Sidebar gauche + chat central + input bas |
| Densité | Airy institutionnel, Balanced app |

**Signatures :** Seul acteur où sécurité est dans le hero (pas une rubrique secondaire). "Public benefit corporation" affiché dès le sous-titre. Projets dans la sidebar (organisation bibliothèque vs flux linéaire). Empty state : étoile + prénom en serif élégant. 404 génère un haïku de Claude. Cohérence institutionnel ↔ app via la même étoile terracotta et typographie.

---

## OpenAI / ChatGPT

**Positionnement :** Référence dominante, corporate-tech, la plus riche en features.
**Mode :** Dark (`#212121`)
**Audience :** Grand public à expert, B2C et B2B.

| Élément | Valeur |
|---|---|
| Background app | `#212121` (noir-anthracite) |
| Accent | Blanc pur |
| Police | Sans-serif neutre |
| Input | Pill-shaped centré, ~580px |
| Sidebar | La plus dense — Custom GPTs + Projets + Historique |
| Densité | Dense (sidebar très riche) |

**Signatures :** Homepage = interface produit directe (input ChatGPT sur fond noir). Markdown rendering le plus riche (tables, code syntax, emojis dans headers, footnotes sources). Sidebar avec Custom GPTs = plateforme en soi. A défini le pattern "sidebar + chat" qui est maintenant la norme industrie.

---

## Perplexity

**Positionnement :** Moteur de recherche AI, vérifiabilité, hybridation Search + LLM.
**Mode :** Dark (bleu-nuit `#0d0d1a`)
**Audience :** Chercheurs, professionnels, utilisateurs qui veulent des sources.

| Élément | Valeur |
|---|---|
| Background | Bleu-nuit profond `#0d0d1a` |
| Accent | Teal/cyan `#00C2B2` |
| Police | Sans-serif neutre compact |
| Input | Barre centrale style Google |
| Sidebar | Iconographique étroite (~60px) + secondaire (~200px) |
| Densité | Épuré |

**Signatures :** Paradigme hybride Search+LLM (pas un chat). Sources citées numérotées avec favicon dans chaque réponse. "Related" questions générées automatiquement. Focus selector (Web/Academic/YouTube). Accent teal froid = vérifiabilité techno, pas chaleur conversationnelle.

---

## Conventions émergentes AI 2026

| Convention | Statut |
|---|---|
| Triptyque sidebar-chat-input | Standard absolu |
| Dark mode fond presque-noir (pas noir pur) | Norme (`#212121`, `#1a1a18`, `#0d0d1a`) |
| Empty state = surface de brand personnalisée | Universal |
| Input multimodal (fichiers + audio + modèle) | Universal |
| Markdown riche (tables, code, headers) | Norme de qualité perçue |
| Nom du modèle affiché en permanence | Norme |
| Conversation → bibliothèque de travail (Projets) | Tendance forte |
| Disclaimer "peut faire des erreurs" discret | Convention légale universelle |

---

# Design systems industriels — Références rapides

## Apple Human Interface Guidelines (HIG)

- **Philosophie :** Hiérarchie + Harmonie + Cohérence. Plateforme-first.
- **Nouveauté 2025 :** Liquid Glass — matériau translucide qui absorbe les couleurs environnantes
- **Couleurs :** Système sémantique dynamique (label, systemBackground…) + 12 couleurs standard en 4 variantes (light/dark × normal/increased contrast)
- **Typo :** SF Pro (variable) + New York (serif). Scale iOS : Large Title 34pt → Caption 2 11pt. Dynamic Type : 12 paliers.
- **Tailles minimales touch :** 44×44pt (iOS), 28×28pt (macOS), 60×60pt (visionOS)
- **Motion :** Springs (SwiftUI), Reduce Motion obligatoire
- **Influence :** Paradigme flat design (iOS 7), gesture-driven, points vs pixels, SF Symbols (6000+ icônes), Dynamic Island

## Google Material Design 3 (M3)

- **Philosophie :** Adaptatif + Personnel + Expressif. Cross-platform open-source.
- **Nouveauté 2025 :** M3 Expressive — springs avec bounce, typographies dramatiques, moments émotionnels
- **Couleurs :** 26 rôles en 6 groupes (Primary/Secondary/Tertiary/Error/Surface/Outline). Dynamic Color : génère tout le schéma depuis une couleur source via algorithme HCT.
- **Typo :** Google Sans (Roboto fallback). 30 styles (Display Large 57sp → Label Small 11sp) + 15 emphasized.
- **Espacement :** Base 4dp. Window size classes : Compact/Medium/Expanded/Large/XL.
- **Motion :** Springs physics (M3 Expressive) — stiffness + damping + initial velocity. Container Transform signature.
- **Influence :** FAB, Chips, design tokens (concept inventé), Dynamic Color theming algorithmique, NavigationRail

## Microsoft Fluent Design 2

- **Philosophie :** Natural + Focus + Inclusive + Unmistakably Microsoft. Cross-platform natif.
- **Couleurs :** Neutral + Shared + Semantic + Brand colors (Teams violet, Word bleu, Excel vert…). Tokens : global → alias.
- **Typo :** Segoe UI / Segoe UI Variable (Windows). Display 68px → Caption 2 10px. Semibold dominant pour les titres.
- **Espacement :** Base 4px. Tokens nommés (size20=2px, size160=16px…). Grid 12 colonnes.
- **Motion :** Easing classique (Ease-in/out) + 4 transitions (Enter/Exit, Elevation, Top Level, Container Transform).
- **Influence :** Acrylic material (précurseur Liquid Glass), icônes outline/filled duaux, Persona component, Inclusive Design triangle (permanent/temporary/situational)

---

# E-commerce — Références

## Shopify

**Positionnement :** Infrastructure e-commerce B2B, plateforme pour marchands.
**Mode :** Dark marketing (`#020A0A`) / Light admin (`#F6F6F7`)
**Audience :** Marchands de toute taille (artisans → enterprise).

| Élément | Valeur |
|---|---|
| Background marketing | Noir profond `#020A0A` |
| Background admin | Blanc cassé `#F6F6F7` |
| Sidebar admin | `#1A1A1A` |
| Accent admin | Vert Shopify `#008060` |
| Police | NeueHaasGrotesk (custom, proche Helvetica Neue) |
| H1 hero | 96px weight 400 (léger — contraste par la taille) |
| Body | 16px |
| Densité admin | Medium-high |

**Signatures :**
- Homepage = narration SaaS parfaite : aspiration émotionnelle → proof sociale (vraies marques) → features progressives → scaling story → stats chiffrées → démo interactive
- **Shopify Checkout** = référence industrie 2026 : one-page, paiement express en tête (Shop Pay), +15% conversion vs concurrents, 150M acheteurs actifs
- Admin sidebar linéaire sans profondeur excessive : Commandes / Produits / Clients / Analytics / Marketing / Finances
- Dashboard : 4 métriques clés + graphique + live view visiteurs temps réel
- Shop Pay : 1 tap pour 150M+ utilisateurs (Face ID/Touch ID)

---

## Etsy

**Positionnement :** Marketplace C2C artisanal, découverte éditoriale, confiance multi-couches.
**Mode :** Light (fond blanc `#FFFFFF`)
**Audience :** Acheteurs de produits uniques, artisans vendeurs.

| Élément | Valeur |
|---|---|
| Background | Blanc `#FFFFFF` |
| Texte | Near-black `#222222` |
| Accent principal | Orange `#E03000` (logo, search focus, promos) |
| Accent secondaire | Vert `#0F743B` (livraison gratuite) |
| Urgence | Rouge `#9A0027` |
| Police | Graphik Webfont (Commercial Type) |
| H1 | ~19px weight 500 |
| Body | 14px |
| Densité listing | Balanced (4 colonnes, grille ~330px) |

**Signatures :**
- Homepage éditoriale saisonnière — change selon fêtes/saisons, pas de feed produit brut
- Écosystème de confiance le plus sophistiqué : urgence sociale ("Dans +20 paniers") + scarcity + countdown promo + date livraison précise + badge "Top vendeur" + 4 sous-scores de notation + profil vendeur humanisé (prénom, ville, ancienneté) + Buyer Protection + engagement éco
- Profil vendeur intégré dans la page produit (transfert de confiance plateforme → personne)
- Filtres en drawer caché (pas de sidebar permanente) — préserve la largeur de grille
- Dashboard vendeur simplifié pour artisans non-techniques (pas d'analytics avancés)

---

## Vinted

**Positionnement :** Marketplace C2C seconde main, mobile-first, modèle sans commission vendeur.
**Mode :** Light (fond gris-bleu clair `#EDF2F2`)
**Audience :** Particuliers vendeurs + acheteurs, 18–35 ans, mobile-first.

| Élément | Valeur |
|---|---|
| Background | Gris-bleu clair `#EDF2F2` |
| Texte | Gris moyen `#5A6566` |
| Accent principal | Teal `#007782` (tous les CTA, liens actifs) |
| Police | V-Inter (custom basée sur Inter) |
| H1 | 24px weight 500 |
| Body | 13px |
| Densité listing | Élevée (4px inter-card, 3 col mobile / 4 col desktop) |

**Signatures :**
- **0% commission vendeur** — les frais (Protection acheteurs ~5% + 0,70€) sont à la charge de l'acheteur. Le vendeur reçoit exactement son prix affiché. Décision design la plus impactante : supprime la principale friction à la mise en ligne
- **"Faire une offre"** natif — la négociation de prix digitalisée proprement (accepte / refuse / contre-propose → lien de paiement)
- **Recherche visuelle par photo** — icône caméra dans la search bar
- **Alertes de recherche** — notification push dès qu'un article correspondant est mis en ligne
- Mise en ligne en < 2 minutes (catégorie suggérée par IA visuelle)
- Homepage orientée **vendre** en premier (pas acheter) — hero = "Prêt à faire du tri ?"
- Page produit : hiérarchie marque → taille/état → prix (pas de titre descriptif long)
- Dashboard vendeur intentionnellement simple — pas d'analytics, juste historique + solde

---

## Tableau comparatif e-commerce

| Dimension | Shopify | Etsy | Vinted |
|---|---|---|---|
| **Type** | Infrastructure SaaS | Marketplace C2C artisanal | Marketplace C2C seconde main |
| **Mode** | Dark marketing / Light admin | Light | Light gris-bleu |
| **Accent** | Vert `#008060` | Orange `#E03000` | Teal `#007782` |
| **Police** | NeueHaasGrotesk | Graphik | V-Inter |
| **Densité listing** | Variable (thème marchand) | Balanced (4 col) | Haute (4 col, 4px gap) |
| **Checkout** | Shop Pay 1-tap (référence) | Multi-étapes, compte requis | Compte requis, négociation native |
| **Commission vendeur** | Variable selon plan | ~6.5% + frais listing | **0%** |
| **Dashboard vendeur** | Complet (analytics, marketing) | Medium (artisans) | Minimal (particuliers) |
| **Mobile** | Responsive + app marchands | Responsive + app acheteurs | **App-first** (bottom tabs, caméra) |
| **Différenciateur** | Checkout conversion +15% | Confiance multi-couches | 0% commission + offres C2C |
