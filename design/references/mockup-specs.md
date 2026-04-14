# Mockup Specs — Design Maquettage Reference

> Ce fichier contient les **valeurs explicites** (px, opacités, dimensions) nécessaires pour produire des maquettes fidèles dans des outils qui n'ont pas de composants design system intégrés (Pencil, Figma from scratch, génération HTML statique).
>
> **Ne pas utiliser en code** — en implémentation, utiliser les composants du design system (shadcn/ui, Radix, Material) qui encapsulent ces valeurs. Ce fichier sert uniquement à la génération visuelle et à la vérification.
>
> **Sources des valeurs :**
> - **shadcn/ui** (référence principale) — boutons, inputs, badges, radius, tokens couleur, états visuels. Valeurs extraites des composants shadcn réels.
> - **Conventions SaaS observées** (Linear, Vercel, Stripe, Notion, Loom) — headers, sidebars, layouts, densités. Documentées dans [app-ui.md](app-ui.md).
> - **Standards web** (WCAG, touch targets, breakpoints) — touch targets 44px mobile, opacités d'overlay, dimensions d'écran.
>
> Quand shadcn fournit un composant, ses valeurs font autorité. Pour les éléments que shadcn ne couvre pas (sidebar, header bar, modal width, layout patterns), les conventions SaaS observées s'appliquent.

---

## Hauteurs des composants

| Composant | Compact | Default | Comfortable | Notes |
|---|---|---|---|---|
| Header bar / topbar | 48px | 56px | 64px | Linear 48, Vercel 56, Stripe 64 |
| Sidebar logo area | 48px | 56px | 64px | Aligné sur le header adjacent |
| Navigation item | 28px | 32px | 40px | Linear 28, Notion 32, mobile 40 |
| Bouton | 28px | 32–36px | 44px | shadcn sm/default/lg |
| Input / select | 32px | 36px | 44px | shadcn sm/default/lg |
| Textarea | 72px | 80px | 96px | Hauteur min, grandit avec le contenu |
| Tab bar | 36px | 40px | 48px | Vercel 40, Stripe 48 |
| Breadcrumb bar | 32px | 36px | 40px | Vercel 36 |
| Bottom sheet handle | 24px | 24px | 24px | Fixe, contient la barre 40x4px |

**Règle** : Choisir une densité par projet (compact, default ou comfortable) et l'appliquer uniformément. Ne pas mélanger les densités au sein d'un même écran. Mobile = toujours comfortable (touch targets 44px min).

---

## Tailles d'icônes par contexte

| Contexte | Taille | Exemples |
|---|---|---|
| Inline (nav item, bouton, badge) | 14–16px | Icône à côté d'un label de navigation |
| Header / toolbar | 16–20px | Actions dans le header, hamburger menu |
| Card accessory | 20–24px | Icône dans une card de fichier, avatar fallback |
| Empty state (dans conteneur) | 28–40px | Icône dans un cercle/carré muted |
| Onboarding / hero | 40–64px | Illustration centrale d'un empty state |

**Règle** : L'icône ne doit jamais dominer le texte adjacent. Rapport recommandé : icône = taille du fontSize du label adjacent ou légèrement inférieure.

---

## Largeurs des modals / dialogs

| Taille | Largeur | Usage |
|---|---|---|
| Small | 360–400px | Confirmation, alerte, action simple |
| Default | 440–480px | Formulaire, import, création |
| Large | 560–640px | Settings, éditeur, contenu riche |
| Full | 90vw / max 960px | Éditeur plein écran, prévisualisation |

### Anatomy d'un modal
```
┌──────────────────────────────────────┐
│ Header: padding 20–24px             │
│  Titre (16px semibold) + Sous-titre │
│                            [X close]│
├──────────────────────────────────────┤
│ Body: padding 24px, gap vertical 16 │
│  [Contenu du formulaire / message]  │
├──────────────────────────────────────┤
│ Footer: padding 16–24px, border-top 1px │
│                [Cancel]  [Primary]  │
│                 justify end, gap 8  │
└──────────────────────────────────────┘
```
- **Scrim** : fond noir 50–60% opacité — **Corner radius** : radius-lg (8px) — **Bouton close** : 32x32px, icône 16px, coin top-right du header

---

## Mobile — Translations desktop → mobile

| Desktop | Mobile | Détail |
|---|---|---|
| Sidebar fixe 200–240px | Drawer overlay 280px + scrim 50% | Slide-in gauche, dismiss par backdrop/swipe/Escape |
| Modal dialog centré | Bottom sheet avec handle bar 40x4px | Corner radius top 16px, pas de radius bottom |
| Boutons 28–36px | Boutons 44px minimum | Touch target WCAG 2.5.8 |
| Header bar 48–56px | Header bar 56px (inchangé) | Hamburger à gauche, search à droite |
| Padding contenu 24–32px | Padding contenu 16px | Réduction pour gagner de l'espace |
| Horizontal card grid | Vertical card stack | Cards empilées, gap 12px |
| Actions inline (boutons texte) | Actions full-width | Boutons prennent toute la largeur |
| Tooltip on hover | Pas de tooltip | Le hover n'existe pas sur mobile |

### Bottom sheet anatomy (mobile)
```
┌──────────────────────────────────────┐
│       [━━━━━━━━━━] handle 40x4px    │ 24px height
├──────────────────────────────────────┤
│ Titre (17px semibold)               │
│ Sous-titre (14px muted)             │ padding 0 20px 16px
├──────────────────────────────────────┤
│ Body: padding 0 20px, gap 16px      │
│  [Contenu du formulaire]            │
├──────────────────────────────────────┤
│ Footer: padding 16px 20px 32px 20px │
│  [Cancel full-width] [Primary full] │ gap 12px
│       safe area bottom = 32px       │
└──────────────────────────────────────┘
```

---

## Opacités d'overlay par contexte

| Contexte | Opacité | Couleur | Notes |
|---|---|---|---|
| Modal scrim | 50–60% | noir | Contenu derrière visible mais pas lisible |
| Drawer backdrop | 50% | noir | Même principe que modal |
| Drag-and-drop overlay | 5–8% | accent (bleu) | Subtil, signale la zone de drop sans masquer |
| Image/card hover overlay | 5–10% | noir | Révèle des actions inline |
| Disabled overlay | 20% | noir | Grise le contenu inactif |
| Loading overlay | 40% | blanc ou noir | Semi-transparent avec spinner centré |

---

## Paddings internes des composants

| Composant | Horizontal | Vertical | Notes |
|---|---|---|---|
| Bouton sm | 12px | — (height 28px) | Label centré verticalement |
| Bouton default | 16px | — (height 32–36px) | Label centré verticalement |
| Bouton lg | 20–24px | — (height 44px) | Mobile, CTA |
| Input sm | 10–12px | — (height 32px) | Texte centré verticalement |
| Input default | 12–16px | — (height 36px) | |
| Input lg | 16px | — (height 44px) | Mobile |
| Textarea | 12–16px | 8–10px | Multiline, padding top pour aligner le texte |
| Card | 16–24px | 16–24px | Uniforme ou [vertical, horizontal] |
| Card header | 20–24px | 20–24px | Peut différer du body |
| Card body | 24px | 0 (top) 24px (sides/bottom) | Si header présent, pas de padding-top |
| Card footer | 16–24px | 16–24px | Avec border-top séparateur |
| Modal header | 24px | 20px | space-between : titre et close |
| Modal body | 24px | 0 (top) 24px (sides) | Gap vertical 16px entre champs |
| Modal footer | 24px | 16px | justify-end, gap 8–12px |
| Sidebar | 8–12px | 8px | Padding autour de la zone nav |
| Sidebar item | 12px (horizontal) | — (height fixe) | Left padding augmente avec l'indentation |
| Navigation indentation | +20–24px par niveau | — | Niveau 0: 12px, niveau 1: 32–36px |
| Tag / badge / pill | 8–12px | 4–6px | Compact |
| Tooltip | 8–12px | 6–8px | |
| Toast / notification | 16px | 12–16px | |
| Dropdown item | 12–16px | — (height 32–36px) | |
| Table cell | 12–16px | — (height row) | |

**Gaps internes** (espace entre éléments enfants) :

| Contexte | Gap | Notes |
|---|---|---|
| Icône + label (bouton, nav) | 6–8px | Tight coupling |
| Champs de formulaire | 16px | Vertical, entre label+input groups |
| Label → input | 6px | Vertical, dans un même field group |
| Cards dans une grid | 16px | Horizontal et/ou vertical |
| Sections majeures | 24–32px | Entre blocs de contenu |
| Éléments d'un empty state | 16–24px | Icône, titre, description, CTA |
| Boutons dans un footer | 8–12px | Horizontal |
| Items dans une sidebar | 2–4px | Vertical, très serré |
| Items dans un dropdown | 2–4px | Vertical |

---

## Boutons — Anatomy complète
### Variantes et dimensions

| Variante | Fill | Text | Border | Usage |
|---|---|---|---|---|
| Primary | `--primary` | `--primary-foreground` | aucune | Action principale (1 par section) |
| Secondary | `--secondary` | `--secondary-foreground` | aucune | Action alternative |
| Outline | transparent | `--foreground` | 1px `--border` | Cancel, back, tertiary |
| Ghost | transparent | `--foreground` | aucune | Navigation, inline |
| Destructive | `--destructive` | `--destructive-foreground` | aucune | Delete, remove |
| Icon-only | transparent | — | aucune ou 1px | Toolbar actions |

### Structure interne
```
┌─ Button ────────────────────────────────────────────┐
│ [padding-h] [icon 14px] [gap 6–8] [label] [pad-h]  │
│              ↑ optionnel                             │
└─────────────────────────────────────────────────────┘
```
- Icon-only : carré (32x32, 36x36, 44x44), icône centrée — Corner radius : radius-md (6px), radius-pill pour certains styles

### États visuels

| État | Changement visuel |
|---|---|
| Default | Fill et text normaux |
| Hover | Opacité 90% ou fill légèrement assombri/éclairci |
| Pressed / Active | Opacité 80% ou fill plus sombre |
| Focus | Ring 2px `--ring` avec offset 2px |
| Disabled | Opacité 50% sur l'ensemble, cursor not-allowed |
| Loading | Spinner 14–16px remplace l'icône, label intact, disabled |

---

## Inputs — Anatomy complète
### Structure
```
┌─ Field Group ────────────────────────┐
│ Label (13–14px medium)       [gap 6] │
│ ┌─ Input ──────────────────────────┐ │
│ │ [padding-h] [placeholder/value]  │ │
│ │             14–15px regular      │ │
│ └──────────────────────────────────┘ │
│ Helper text (12px muted)     [gap 4] │
│ Error text (12px destructive)        │
└──────────────────────────────────────┘
```

| Propriété | Valeur |
|---|---|
| Background | `--background` (champ vide) |
| Border | 1px `--input` |
| Border focus | 1px `--ring` + ring 2px |
| Corner radius | radius-md (6px) |
| Placeholder | `--muted-foreground` |
| Value text | `--foreground` |
| Label | `--foreground`, 13–14px, medium weight |
| Error border | 1px `--destructive` |

---

## Badges / Pills / Tags

| Variante | Background | Text | Corner radius | Padding | Height |
|---|---|---|---|---|---|
| Default | `--secondary` | `--secondary-foreground` | pill (9999px) | 8–12px h, 2–4px v | 22–24px |
| Success | success bg 10% | success text | pill | idem | idem |
| Warning | warning bg 10% | warning text | pill | idem | idem |
| Error | error bg 10% | error text | pill | idem | idem |
| Info | info bg 10% | info text | pill | idem | idem |
| Outline | transparent | `--foreground` | pill | idem, + border 1px | idem |

Font size : 11–12px, medium weight — Icône optionnelle : 12px, avant le label, gap 4px — Status dot optionnel : 6–8px cercle coloré, avant le label

---

## Tooltips

| Propriété | Valeur |
|---|---|
| Background | `--foreground` (inverse) |
| Text | `--background` (inverse) |
| Font size | 12–13px |
| Padding | 8–12px horizontal, 6–8px vertical |
| Corner radius | radius-md (6px) |
| Max width | 240px |
| Delay apparition | 500–700ms |
| Arrow | 6px, même couleur que le background |
| Position | Top préféré, fallback bottom/left/right |

---

## Toasts / Notifications
### Anatomy
```
┌─ Toast ────────────────────────────────────┐
│ [icon 16px] [gap 12] Title (14px medium)   │
│                       Description (13px)   │
│                                   [X close]│
└────────────────────────────────────────────┘
```

| Propriété | Valeur |
|---|---|
| Width | 360–400px (desktop), full-width - 32px (mobile) |
| Padding | 16px |
| Corner radius | radius-lg (8px) |
| Background | `--card` avec border 1px `--border` |
| Shadow | shadow-lg |
| Position | Bottom-right (desktop), bottom-center (mobile) |
| Duration | 5s par défaut, persistent si action requise |
| Empilage | Max 3 visibles, les plus anciens disparaissent |
| Animation | Slide-in depuis la droite/le bas, fade-out |

| Variante | Icône | Couleur icône |
|---|---|---|
| Default | info circle | `--foreground` |
| Success | check circle | success |
| Error | alert circle | destructive |
| Warning | alert triangle | warning |
| Loading | spinner | `--muted-foreground` |

---

## Dropdowns / Menus
### Anatomy
```
┌─ Dropdown ──────────────────────┐
│ [Search input]        optionnel │ padding 8px
├─────────────────────────────────┤
│ Section Title (11–12px upper)   │ padding 8px 12px
│ ┌─ Item ──────────────────────┐ │
│ │ [icon 14px] [label 13px]   │ │ height 32–36px
│ │                 [shortcut]  │ │ padding 8–12px h
│ └─────────────────────────────┘ │
│ ────── Divider ─────────────── │ 1px --border, margin 4px 0
│ ┌─ Item (destructive) ───────┐ │
│ │ [trash icon] [Delete]      │ │ text --destructive
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

| Propriété | Valeur |
|---|---|
| Background | `--popover` |
| Border | 1px `--border` |
| Corner radius | radius-md (6px) |
| Shadow | shadow-md |
| Min width | 160px |
| Max width | 280px |
| Item hover | `--accent` background |
| Item active | `--accent` background + check icon |
| Shortcut text | `--muted-foreground`, 11px, monospace |
| Gap entre items | 2px |
| Padding conteneur | 4–8px |

---

## Avatars

| Taille | Dimensions | Usage | Font size (initiale) |
|---|---|---|---|
| xs | 20–24px | Inline dans les listes, activité | 10–11px |
| sm | 28–32px | Nav items, commentaires | 12–13px |
| md | 36–40px | Profil dans sidebar, cards | 14–16px |
| lg | 48–56px | Page profil, settings | 18–20px |
| xl | 64–80px | Hero profil, onboarding | 24–28px |

Forme : cercle (`border-radius: 50%`) — Fallback : initiales sur fond `--muted`, texte `--muted-foreground` — Border : optionnelle, 2px `--background` (superposition sur fond coloré) — Groupe : overlap -8px, z-index croissant, max 4 visibles + "+3" badge

---

## Progress / Loading
### Linear progress bar

| Propriété | Valeur |
|---|---|
| Height | 4px (default), 2px (minimal), 8px (prominent) |
| Background (track) | `--muted` |
| Fill (progress) | `--primary` |
| Corner radius | pill (9999px) |
| Animation indéterminée | Barre translate left→right en boucle, 1.5s |

### Spinner

| Taille | Dimensions | Usage |
|---|---|---|
| sm | 14–16px | Dans un bouton |
| md | 20–24px | Inline dans le contenu |
| lg | 32–40px | Page loading, empty state |
| xl | 48–64px | Full page loader |

Couleur : `--primary` ou `--muted-foreground` selon le contexte — Stroke width : 2px (sm/md), 3px (lg/xl) — Animation : rotation 360° en 0.75s linear infinite

### Skeleton

| Propriété | Valeur |
|---|---|
| Background | `--muted` |
| Animation | Pulse (opacité 100% → 50% → 100%) en 2s |
| Corner radius | Même que le composant qu'il remplace |
| Dimensions | Même que le composant qu'il remplace |

---

## Séparateurs et bordures structurelles

| Pattern | Propriété | Usage |
|---|---|---|
| Séparateur horizontal | `border-bottom: 1px solid var(--border)` | Entre header et contenu, entre rows de table |
| Séparateur vertical | `border-right: 1px solid var(--border)` | Entre sidebar et contenu principal |
| Séparateur de section | `border-top: 1px solid var(--border)` | Footer de modal, footer de card |
| Bordure dashed | `border: 2px dashed var(--border)` | Drop zone, placeholder, zone d'upload |
| Bordure accent dashed | `border: 2px dashed var(--ring)` | Drop zone active (état drag hover) |

**Règle** : Toujours **1px** pour les séparateurs structurels, jamais plus épais. Toujours un **token couleur** (`--border`), jamais un hex en dur. Préférer l'espace (gap/padding) à la bordure quand la séparation est claire sans ligne. Les bordures sont **inside** (ne débordent pas). Les bordures dashed = **2px**, réservées aux zones interactives (drop, upload, placeholder).

---

## Patterns de composition layout

Patterns flexbox récurrents pour les layouts SaaS (~90% des cas).

| Pattern | Axe | Sizing | Notes |
|---|---|---|---|
| **Sidebar + Contenu** | horizontal | Sidebar: fixe 200–240px, fill height. Contenu: fill both | Layout principal |
| **Header bar** | horizontal, space-between, align center | Gauche: fit (titre, breadcrumb). Droite: fit (actions) | Titre + actions |
| **Empty state** | vertical, center both | Enfant: fit, vertical, align center, gap 16–24px | Centré dans la zone |
| **Card grid** | horizontal, gap 16px | Enfants: fill equal | Métriques, cards |
| **Form layout** | vertical, gap 16px | Enfants: fill. Ligne: horizontal gap 16px | Champs empilés |
| **Modal footer** | horizontal, justify end, gap 8–12px | Enfants: fit. Border: top 1px | Boutons d'action |
| **List + actions** | vertical, gap 0–2px | Item: horizontal, space-between, align center, h 32–48px. G: fit (icône, metadata, label). D: fit (chevron, actions) — hover ou permanent | |
| **Split panel** | horizontal | Liste: fixe 320–400px, fill h, border-right. Détail: fill both | Liste + détail |

**Règle** : Ces patterns couvrent ~90% des layouts SaaS. Si un layout ne rentre dans aucun de ces patterns, c'est un signe de complexité excessive.

---

## Corner radius reference

| Contexte | Radius | Token | Notes |
|---|---|---|---|
| Boutons, inputs, dropdowns | 6px | radius-md | Default pour la plupart des composants |
| Cards, modals, toasts | 8px | radius-lg | Conteneurs principaux |
| Badges, pills, tags | 9999px | radius-pill | Full arrondi |
| Petits éléments (checkbox, dot) | 2–4px | radius-sm | Subtil |
| Bottom sheet (mobile, top only) | 16px top, 0 bottom | — | iOS/Android convention |
| Sidebar, page, table | 0px | radius-none | Bords rectilignes |
| Avatars | 50% (cercle) | — | Toujours rond |

---

## Dimensions d'écran de référence

| Device | Width | Height | Ratio | Usage maquette |
|---|---|---|---|---|
| Desktop standard | 1440px | 900px | 16:10 | Maquette desktop par défaut |
| Desktop large | 1920px | 1080px | 16:9 | Full HD |
| Laptop | 1280px | 800px | 16:10 | MacBook 13" |
| Tablet portrait | 768px | 1024px | 3:4 | iPad |
| Tablet landscape | 1024px | 768px | 4:3 | iPad paysage |
| Mobile (iPhone 15) | 390px | 844px | ~9:19.5 | Maquette mobile par défaut |
| Mobile small | 375px | 667px | ~9:16 | iPhone SE |
| Mobile large | 430px | 932px | ~9:20 | iPhone 15 Pro Max |

---

## Cross-References

- Spacing tokens : [../tokens/spacing.md](../tokens/spacing.md)
- Typography tokens : [../tokens/typography.md](../tokens/typography.md)
- Color tokens (opacités) : [../tokens/colors.md](../tokens/colors.md)
- App UI patterns : [app-ui.md](app-ui.md)
- Navigation responsive : [../components/navigation.md](../components/navigation.md)
- Lists et empty states : [../components/lists.md](../components/lists.md)
