# App UI — Conventions et patterns de référence

> Guide pour construire des interfaces applicatives (post-auth).
> Basé sur l'analyse de : Linear, Notion, Vercel, Stripe, Loom (mars 2026).

---

## Patterns universels (les 10 lois)

Ces patterns sont communs aux 5 apps analysées. Ils constituent les conventions absolues du SaaS en 2026.

### 1. La sidebar gauche comme épine dorsale

Toutes les apps utilisent une **sidebar gauche** comme navigation primaire. Ce n'est plus un choix — c'est la convention absolue du SaaS desktop.

| App | Largeur sidebar | Particularité |
|---|---|---|
| Linear | ~220px | Volontairement plus sombre que le contenu |
| Notion | ~240px | Arbre de pages hiérarchique |
| Vercel | ~220px | Search "Find... F" intégré |
| Stripe | ~240px | 30+ items en groupes collapsibles |
| Loom | ~200px | My Library / Team Library / Shared |

**Règle** : La sidebar est le seul composant qui ne doit jamais surprendre. Les utilisateurs SaaS savent où elle est. Ne pas innover ici — innover dans le contenu.

### 2. Cmd+K comme navigation universelle

La navigation clavier est une fonctionnalité de **première classe**, pas un bonus :
- Linear : Cmd+K omnibox (central au produit)
- Notion : `/` command + Cmd+K
- Vercel : searchbar "Find... F" dans la sidebar
- Stripe : Global search
- Loom : Search library

**Règle** : Toute app avec plus de 5 sections doit avoir un raccourci clavier de navigation globale.

### 3. Monospace pour les données techniques

Sans exception, toutes les apps utilisent une police **monospace** pour :
- IDs systèmes (ENG-2703, pi_xxx, cus_xxx, cus_xxx)
- Logs et outputs
- Timestamps précis
- URLs et hashes de commits
- Variables d'environnement

Polices utilisées : Inter Mono, Geist Mono, Roboto Mono, JetBrains Mono.

**Règle** : Toute donnée "copiable" ou "technique" = monospace. Cela signifie au lecteur : "cette donnée est précise et importante".

### 4. Status indicators : dots colorés + badges pill

Cinq couleurs universelles — cohérentes à travers tout le panel :

| Couleur | Signification |
|---|---|
| Vert `#00C853` / `#30C078` | Succès, actif, done, ready |
| Rouge `#EB5757` | Erreur, fail, bloqué |
| Orange/Jaune `#F7A139` | Warning, pending, in review |
| Gris `#8898AA` | Inactif, annulé, incomplete |
| Bleu `#0070F3` | En cours, in progress, neutre |

**Règle** : Ne jamais utiliser un badge de statut sans sa couleur associée. La couleur précède la lecture du texte.

### 5. Inter comme fondation typographique

Inter domine l'écosystème SaaS (Linear, Loom, Notion, et indirectement via design systems). Vercel est l'exception avec Geist (très proche d'Inter). Stripe utilise Sohne (proche d'Inter).

**Pourquoi Inter** : dessinée spécifiquement pour les petites tailles d'écran et la lisibilité en dark mode. Gratuite, complète, multi-poids.

**Règle** : Si aucun système de design ne s'impose, utiliser Inter.

### 6. Un seul accent chromatique sur fond neutre

Fond neutre (noir ou blanc) + **un seul accent** dominant :

| App | Fond | Accent |
|---|---|---|
| Linear | `#0d0d0d` | Indigo `#5E6AD2` |
| Notion | `#f7f6f3` | Bleu `#2383E2` |
| Vercel | `#000000` | Blanc `#ffffff` / Bleu `#0070F3` |
| Stripe | `#ffffff` | Violet `#635BFF` |
| Loom | `#ffffff` | Violet `#6D28D9` |

**Règle** : La couleur accent = les actions primaires et les états actifs. Pas d'utilisation décorative.

### 7. Timestamps relatifs + avatars dans les flux d'activité

"2min ago", "just now", "3 days ago" — les 5 apps privilégient les timestamps relatifs pour l'activité récente. Les avatars (20–32px) attachent chaque action à une personne.

**Règle** : Dans un feed d'activité ou une timeline, toujours combiner avatar + nom + timestamp relatif.

### 8. Empty states comme opportunités de brand voice

| App | Style empty state |
|---|---|
| Vercel | Géométrique, noir, logo décomposé — sobre et technique |
| Loom | Humour en phase avec le produit ("Would be a great place for a video, though") |
| Stripe | Illustrations mono sobres, CTAs directs — professionnel |
| Notion | Minimaliste, texte-first, CTA "+ New page" |
| Linear | Texte direct + CTA — pas d'illustrations |

**Règle** : L'empty state est le moment où l'application parle directement à l'utilisateur. Ce n'est pas un état null — c'est un espace de marque.

### 9. Dark mode : default pour devtools, option pour collaboration

| Catégorie | Mode default |
|---|---|
| Outils pour développeurs (Linear, Vercel) | **Dark** |
| Outils de collaboration et documents (Notion, Stripe, Loom) | **Light** |

**Règle** : Choisir son mode en fonction de l'audience principale, pas des tendances.

### 10. La vraie interface comme meilleur argument marketing

Toutes les 5 apps utilisent leur propre interface sur leur homepage marketing. Ce n'est pas une maquette idéalisée — c'est une capture fidèle de l'app réelle, avec des données réalistes.

**Règle** : Si l'app est assez belle pour être montrée directement sur la landing, c'est un signal que le design est réussi.

---

## Structure et layout

### Le layout en L inversé (standard)

```
┌──────────┬─────────────────────────────────┐
│          │ Header de vue contextuel        │
│ Sidebar  ├─────────────────────────────────┤
│ gauche   │                                 │
│          │ Zone de contenu principale      │
│          │                                 │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

Variante avec panneau de détail (Linear, style) :

```
┌────────┬────────────────┬─────────────────┐
│        │ Header         │ Header détail   │
│Sidebar ├────────────────┼─────────────────┤
│        │ Liste items    │ Éditeur +       │
│        │ Item 1         │ Properties      │
│        │ Item 2 ←sélect.│ Activity        │
│        │ Item 3         │ Comments        │
└────────┴────────────────┴─────────────────┘
```

### Topbar vs header contextuel

Deux approches :

1. **Topbar globale** (Stripe, Loom, Notion) : breadcrumb, account switcher, notifications, avatar. Constante sur toutes les vues.
2. **Header contextuel par vue** (Linear, Vercel) : chaque vue a son propre header avec ses filtres et actions. Pas de topbar globale — plus d'espace vertical pour le contenu.

**Recommandation** : Header contextuel pour les apps denses (PM tools, devtools). Topbar globale pour les apps avec navigation account/org complexe (fintech, collaboration).

> **Pour les valeurs de maquettage** (hauteurs en px, tailles d'icônes, largeurs de modals, opacités, translations mobile) : voir [mockup-specs.md](mockup-specs.md). Ce fichier est dédié à la génération de maquettes dans des outils sans composants design system intégrés.

---

## Composants clés

### Navigation sidebar

```
┌──────────────────────┐
│ [Logo] Workspace ▾   │  ← Workspace/org switcher (toujours en haut)
├──────────────────────┤
│ 🔍 Find...    ⌘K    │  ← Search (optionnel mais recommandé)
├──────────────────────┤
│ ● Overview           │  ← Items avec icône 16px + label
│ ● Deployments        │
│ ● Analytics          │
│   ↳ Speed Insights   │  ← Sous-items avec indentation
├──────────────────────┤
│ SECTION LABEL        │  ← Labels de groupe en uppercase 11px
│ ● Settings           │
│ ● Team               │
└──────────────────────┘
```

**Règle** : Workspace switcher toujours en haut. Items actifs : fond légèrement surélevé ou accent coloré sur le texte. Hover : fond très subtil.

### Table / liste d'items

Anatomy d'une row exemplaire (Linear/Stripe pattern) :

```
● [Status] [ID mono] [Titre]                    [Labels] [Avatar] [Date]
```

- Hauteur row : **32–36px** (dense) ou **44–48px** (comfortable)
- Status dot : 8–10px, aligné à gauche
- ID : monospace, gris secondaire (`rgba(255,255,255,0.4)` en dark)
- Titre : sans-serif, texte primaire, tronqué si nécessaire
- Labels : pills colorées 12px, max 2–3 visibles
- Avatar : 20–24px, cercle avec initiale fallback
- Date : 12px, gris secondaire, timestamps relatifs
- Hover : fond légèrement surélevé + révèle actions inline (⋯ ou icônes)

### Cards métriques (dashboard)

Pattern Stripe/Vercel :

```
┌─────────────────────┐
│ Gross volume        │  ← Label 13px gris
│ $1,234,567          │  ← Valeur 24px bold
│ ↑ +12.3% ══════    │  ← Variation + sparkline
└─────────────────────┘
```

- Background : surface légèrement surélevée (`--color-background-secondary`)
- Pas de border (ou border très subtile), 4 max par rangée horizontale
- Toujours inclure la variation % avec couleur (vert/rouge)

### Panel de détail

```
┌────────────────────────────────────────┐
│ ← Back    [Titre]              Actions │
├────────────────────────────────────────┤
│ [Éditeur de contenu]                   │
│                                        │
│                                        │
├────────────────────────────────────────┤
│ Properties                             │
│ Status    ○ In Progress                │
│ Assignee  [Avatar] @username           │
│ Labels    [Bug] [High Priority]        │
├────────────────────────────────────────┤
│ Activity                               │
│ [Avatar] @user did X    2min ago       │
│ [Avatar] @user added Y  1hr ago        │
└────────────────────────────────────────┘
```

### Event timeline (Stripe pattern)

```
│ • charge.succeeded          12:34:56 UTC
│   pi_3xxxx...      [copy]   $29.00
│
│ • payment_intent.created    12:34:50 UTC
│   pi_3xxxx...      [copy]
│
│ • customer.created          12:34:45 UTC
│   cus_xxxx...      [copy]
```

- Points colorés (vert/gris/rouge selon type), IDs en monospace avec bouton copy
- Timestamps précis (pas relatifs pour les événements financiers)
- Actions par événement en hover

---

## Vues types par catégorie de produit

### PM / Issue tracker (Linear pattern)

**Vues obligatoires** : Liste d'issues (groupement par statut), Vue Board Kanban (Todo/In Progress/Done), Détail issue (éditeur + propriétés + activité), Settings workspace.

**Conventions** : Identifiants en monospace (ENG-xxx, PRJ-xxx). Priority indicators (bar chart icons 3 niveaux). Groupement de rows par statut sans règle de séparation lourde — juste un header de groupe. Cycles/sprints visibles dans les propriétés.

### Dashboard analytics (Stripe/Vercel pattern)

**Vues obligatoires** : Overview (metric cards + graphiques), Liste transactions/événements, Détail d'un item, Settings.

**Conventions** : Metric cards avec sparklines et variations %. Sélecteur de période (7d / 30d / 3m / custom). Status badges pill pour chaque état. Graphiques : ligne ou barre, pas de pie charts. Export CSV visible mais discret.

### Document editor (Notion pattern)

**Vues obligatoires** : Arbre de pages sidebar (hiérarchique, collapsible), Éditeur de blocs pleine largeur (~700px centré), Vue Database (Board/List/Gallery/Timeline), Settings workspace + members.

**Conventions** : Icône de page (emoji) au-dessus du titre H1. Slash command `/` pour insérer des blocs. Properties au-dessus du contenu dans le détail. Width centré avec marges généreuses.

### Library / Media (Loom pattern)

**Vues obligatoires** : Grille de cards avec thumbnails (4–6 colonnes), Breadcrumb dossier, Player/viewer de l'item, Partage et permissions.

**Conventions** : Cards = thumbnail + duration badge + title + author avatar + date. Hover sur card : play button + sélection checkbox. Player : contrôles standard + feature signature (Loom : face-cam bubble). Sections My / Team / Shared.

---

## Onboarding

| App | Philosophie | Temps to value |
|---|---|---|
| Linear | Opinionated — force à créer une première issue | < 2min |
| Vercel | Functional-immédiat — Import Git Repo en 2 clics | < 3min |
| Notion | Template-first — galerie de templates suggérés | < 5min |
| Loom | Record-first — enregistrer immédiatement | < 1min |
| Stripe | Code-first — la doc est l'onboarding | Variable |

**Principes** : (1) Minimiser les étapes — chaque étape hors valeur = friction inutile. (2) "Skip possible" — toujours laisser passer l'onboarding. (3) Montrer, pas expliquer — démo interactive > slide de features. (4) Célébrer le premier succès — confettis, animation, message remarquable. (5) Empty state = invitation — quand c'est vide, expliquer ce qui sera là + CTA direct.

---

## Settings — Structure universelle

```
┌──────────────────┬──────────────────────────────┐
│ General          │ Section title                │
│ Profile          │                              │
│ Members          │ [Contenu des settings]        │
│ Billing          │                              │
│ Integrations     │                              │
│ Security         │                              │
│ Advanced         │                              │
└──────────────────┴──────────────────────────────┘
```

Sidebar interne reproduisant la sidebar principale. Sections en groupes logiques (Account / Workspace / Billing / Security). Inputs et toggles consistent avec le design system global. Bouton "Save" : sticky en bas ou inline par section. Danger zone : toujours en bas, séparée, rouge discret.

---

## Responsive et mobile

| App | Mobile behavior |
|---|---|
| Linear | Sidebar en hamburger, vues simplifiées, desktop-first |
| Vercel | Sidebar en drawer, dashboard simplifié |
| Stripe | App mobile dédiée (bottom tabs, même palette) |
| Loom | App mobile dédiée (Record button central) |
| Notion | App mobile (édition limitée, databases en liste) |

**Règle** : Les outils B2B pour power users (Linear, Vercel) sont **desktop-first** — le mobile est un fallback pour consulter, pas pour travailler. Les outils de création de contenu ou consumer (Loom, Notion) ont des apps mobile dédiées et optimisées. Si l'audience principale travaille sur desktop, ne pas sacrifier la densité desktop pour le mobile.

---

## Checklist interface app

**Structure**
- [ ] Sidebar gauche avec workspace switcher en haut
- [ ] Search global ou Cmd+K accessible
- [ ] Header contextuel par vue (filtres, actions, modes d'affichage)

**Données**
- [ ] IDs et données techniques en monospace
- [ ] Status indicators avec couleurs standardisées (vert/rouge/orange/gris/bleu)
- [ ] Timestamps relatifs dans les feeds d'activité
- [ ] Avatars associés aux actions humaines

**Composants**
- [ ] Tables avec row height consistent (32–36px dense ou 44–48px comfortable)
- [ ] Hover rows avec actions inline révélées
- [ ] Empty states avec copy intentionnel + CTA

**Typographie**
- [ ] Inter (ou équivalent) pour le body
- [ ] 2 tailles max par contexte (label + valeur, ou titre + sous-titre)
- [ ] Monospace pour les données techniques

**Couleur**
- [ ] Un seul accent chromatique dominant
- [ ] Couleur = signal fonctionnel (action primaire, état actif), pas décoration
- [ ] Dark mode ou light mode cohérent sur toutes les vues

**UX**
- [ ] Onboarding avec chemin de résistance minimal (< 3min to value)
- [ ] Settings accessible depuis l'avatar ou la sidebar
- [ ] Cohérence visuelle avec la landing page du produit

---

## Patterns par domaine métier

### Plateformes créateurs — patterns UI

**Page créateur publique :** Layout 2 colonnes desktop : identité créateur (gauche) + widget de support sticky (droite). Widget de paiement intégré directement (pas de clic supplémentaire). Avatar circulaire débordant de la bannière — pattern très répandu. Tabs horizontaux : About / Gallery / Posts / Services.

**Checkout / paiement :** Friction maximale acceptable : formulaire overlay modal (pas de redirection). One-tap checkout sans inscription = référence BMC. Form intégré directement sur la page = référence Ko-fi. Workflow contrat = acceptable seulement pour le B2B (Contra).

**Dashboard créateur :** Revenus en priorité absolue (graphe mensuel, total). Liste des supporters/clients exportable. Analytics de croissance (churn, nouveaux, actifs). Gestion des tiers/produits. Éditeur de posts/contenus.

---

### Fintech mobile — patterns UI

**Dashboard home :** Solde total en très grand format centré (40–52px bold) — information n°1. Actions rapides sous forme de boutons circulaires iconifiés (Envoyer, Recevoir, Échanger). Transactions récentes (5 items max dans le viewport initial). Cards multi-devises scrollables horizontalement (si multi-wallet).

**Historique transactions :** Découpage chronologique (Aujourd'hui / Hier / Cette semaine). Merchant logo haute résolution + nom + montant + devise + catégorie. Catégories avec couleur + icône (double encodage). Montants alignés à droite, vert (entrant) / rouge (sortant) — universel.

**Card management :** Carte rendue en 3D ou flat avec le vrai design personnalisé. Freeze/unfreeze animé instantané — feature de confiance signature. Toggle par type de paiement (en ligne, étranger, contactless, DAB). Numéro de carte masqué → biométrie pour révéler.

**Onboarding KYC :** Une action par écran (principe absolu). Message rassurant sur chaque étape KYC ("Ça prend 2 minutes"). Scan document + selfie liveness = séquence universelle. Dark mode pour Revolut, light mode pour Wise/Monzo.

**Navigation :** Bottom tabs × 4–5 — standard absolu du fintech mobile. Pas de sidebar (contrairement aux apps desktop). Hub central pour les super-apps (Revolut : "Hub").

---

### Santé — patterns UI

**Onboarding santé :** Ne jamais demander les données médicales en premier — commencer par email/téléphone. Collecter les données médicales de façon progressive et contextuelle. Expliquer pourquoi chaque donnée est demandée (réglementation, personnalisation). Illustrations légères à chaque étape pour réduire l'anxiété cognitive (Alan : pingouin).

**Vue principale :** Accès à la fonctionnalité principale en 1 tap (Doctolib : recherche, Alan : Clinique, Withings : mesures). Prochain rendez-vous visible immédiatement. Section prévention/coaching (nouvelle norme 2025). Bottom tabs clairs avec labels texte (pas icônes seules — accessibilité seniors).

**Accessibilité santé (standards stricts) :** WCAG AA minimum — 4.5:1 pour texte, 3:1 pour composants. Corps ≥16px minimum. Zones tactiles ≥44px. Triple encodage pour les états critiques : couleur + icône + texte. Pas de micro-texte, pas d'interfaces surchargées.

**Confidentialité des données :** Page "Mes données" accessible depuis le profil (pas seulement dans les CGU). Explication claire de qui voit quoi (soignants désignés, employeur = jamais individuel). Suppression du compte en self-service visible. Consentement opt-in explicite pour le partage avec tiers.

---

### AI conversationnel — patterns UI

**Layout universel 2026 :**
```
┌──────────┬────────────────────────────────┐
│          │ [Modèle actif] ↓   Partager   │
│ Sidebar  ├────────────────────────────────┤
│ Nouveau  │ Zone de chat                   │
│ Projets  │ [Message utilisateur]          │
│ Histoire │ [Réponse AI — markdown riche]  │
│ Profil   ├────────────────────────────────┤
│ Plan     │ [Input multimodal] [Modèle] [▶]│
└──────────┴────────────────────────────────┘
```

**Empty state AI :** Salutation personnalisée avec le prénom (universel). Élément de brand signature (étoile Claude, logo OpenAI). Pills de catégories de démarrage (Code, Créer, Écrire…). Centré dans la page, très aéré.

**Input multimodal standard :** Attachement de fichiers (icône +). Audio/dictée. Sélecteur de modèle visible et accessible. Taille dynamique (grandit avec le texte). Envoi par Enter, nouvelle ligne par Shift+Enter.

**Rendu markdown — critères de qualité :** Headers (`#`, `##`) rendus avec hiérarchie visuelle. Bold et italic. Blocs de code avec label de langage + bouton copier. Listes à puces et numérotées. Tableaux comparatifs. Séparateurs horizontaux.

**Différenciation émotionnelle par interface :** Claude : chaleur (serif, terracotta, crème institutionnel). ChatGPT : puissance (noir, sans-serif, densité sidebar). Perplexity : vérifiabilité (teal, citations numérotées, icônes focus).

---

### E-commerce — patterns UI

**Page listing produits :**

| Pattern | Shopify (Dawn) | Etsy | Vinted |
|---|---|---|---|
| Colonnes desktop | 3–4 (configurable) | 4 | 4 |
| Colonnes mobile | 1–2 | 2 | 3 |
| Ratio image | Carré ou 4:5 | 4:3 à 1:1 | 1:1 |
| Filtres | Sidebar gauche | Drawer caché | Pills sticky |
| Densité | Variable | Balanced | Haute (4px gap) |
| Scroll | Pagination | Infini | Infini |

**Carte produit — anatomie standard :**
```
[Image produit]                    [♥ Favori overlay]
[Marque / Titre]
[Variantes si applicable]
[Étoiles] [Nombre d'avis]
[Prix] [Prix barré] [% réduction]
[Badge livraison gratuite]
[Badge urgence / Top vendeur]
```

**Page produit — anatomie standard :** Galerie gauche (image principale + miniatures cliquables, zoom hover desktop, swipe mobile). Sidebar droite sticky : titre H1, prix, variantes, quantité, CTA principal. CTA principal : pleine largeur, ~52px hauteur, couleur accent. Signaux de confiance : date livraison précise, politique retour, programme protection. Section avis : note globale + sous-scores + filtres + liste. Produits similaires / même boutique en bas.

**Checkout — hiérarchie de friction :**
1. **Meilleur** : Shop Pay / Apple Pay / Google Pay en tête (avant le formulaire) → 1 tap
2. **Standard** : Formulaire one-page en 2 colonnes (formulaire + récap permanent)
3. **Acceptable** : Multi-étapes avec progress indicator
4. **À éviter** : Compte obligatoire avant de voir le prix total

**Dashboard vendeur — niveaux de complexité :**
- **Particulier (Vinted)** : historique ventes + solde. Mise en ligne < 2 min. 0 analytics.
- **Artisan (Etsy)** : métriques de base + gestion fiches. Navigation horizontale simple.
- **Marchand (Shopify)** : sidebar complète, analytics avancés, live view, marketing, multi-canal.

**Mobile e-commerce — conventions absolues :** CTA "Ajouter au panier" ou "Acheter" sticky en bas de la page produit. Galerie produit fullscreen swipeable avec dots de position. Bottom navigation × 5 onglets pour les apps natives (Accueil / Recherche / Vendre / Messages / Profil). Recherche visuelle par photo (standard émergent 2024–2026). Paiement biométrique (Face ID / Touch ID) via Shop Pay ou équivalent.
