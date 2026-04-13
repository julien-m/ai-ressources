# Motion Tokens

Durées, easing, et conventions d'animation cross-platform (iOS, Android, Web).

---

## Platform Defaults

| Platform | Système d'animation | Unité | Outil de référence |
|----------|---------------------|-------|-------------------|
| iOS | SwiftUI Animation / UIKit | seconds | `.animation(.easeInOut(duration:))` |
| Android | Jetpack Compose / Material Motion | ms | `tween(durationMillis)`, `spring()` |
| Web | CSS transitions / Framer Motion | ms | `transition: 200ms ease-out` |

---

## Duration Scale

Échelle sémantique de durées. Utiliser les noms de tokens, jamais des valeurs en dur.

| Token | Durée | iOS (s) | Android (ms) | Web (ms) | Cas d'usage |
|-------|-------|---------|--------------|----------|-------------|
| `instant` | 0 | 0 | 0 | 0 | Toggle, checkbox, radio — changement d'état sans transition |
| `micro` | 100ms | 0.1 | 100 | 100 | Ripple, button press feedback, opacity hover |
| `fast` | 150ms | 0.15 | 150 | 150 | Tooltip apparition, hover state, focus ring |
| `normal` | 250ms | 0.25 | 250 | 250 | Modal open/close, dropdown, panel slide, tab switch |
| `slow` | 400ms | 0.4 | 400 | 400 | Page transition, drawer open, accordion expand |
| `slower` | 600ms | 0.6 | 600 | 600 | Onboarding step, hero entrance, skeleton → content |
| `deliberate` | 1000ms | 1.0 | 1000 | 1000 | Celebration (confetti, success), attention-grabbing |

**Règle** : 90% des animations d'une app utilisent `fast` à `normal` (150–250ms). Au-delà de `slow`, l'animation doit avoir une justification forte (onboarding, feedback émotionnel).

---

## Easing Functions

### Entrée (élément qui apparaît)
| Token | CSS | iOS (SwiftUI) | Android (Compose) | Usage |
|-------|-----|---------------|-------------------|-------|
| `ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | `.easeOut` | `FastOutSlowInEasing` | **Default pour les entrées.** Départ rapide, arrivée douce |
| `decelerate` | `cubic-bezier(0.0, 0.0, 0.0, 1.0)` | `.easeOut(duration:)` | `LinearOutSlowInEasing` | Entrée depuis l'extérieur de l'écran (slide-in) |

### Sortie (élément qui disparaît)
| Token | CSS | iOS (SwiftUI) | Android (Compose) | Usage |
|-------|-----|---------------|-------------------|-------|
| `ease-in` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | `.easeIn` | `FastOutLinearInEasing` | **Default pour les sorties.** Départ progressif, accélération vers la fin |
| `accelerate` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | `.easeIn(duration:)` | `FastOutLinearInEasing` | Sortie vers l'extérieur de l'écran (slide-out) |

### Changement d'état (même élément qui change)
| Token | CSS | iOS (SwiftUI) | Android (Compose) | Usage |
|-------|-----|---------------|-------------------|-------|
| `ease-in-out` | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | `.easeInOut` | `FastOutSlowInEasing` | **Default pour les state changes.** Resize, move, color change |
| `linear` | `linear` | `.linear` | `LinearEasing` | Progress bar, loading indicator, timer — mouvement constant |

### Spring (rebond naturel)
| Token | CSS (Framer Motion) | iOS (SwiftUI) | Android (Compose) | Usage |
|-------|---------------------|---------------|-------------------|-------|
| `spring-gentle` | `{ type: "spring", stiffness: 120, damping: 14 }` | `.spring(response: 0.5, dampingFraction: 0.7)` | `spring(dampingRatio = 0.7, stiffness = 120f)` | Boutons, toggles, feedback doux |
| `spring-bouncy` | `{ type: "spring", stiffness: 200, damping: 10 }` | `.spring(response: 0.4, dampingFraction: 0.5)` | `spring(dampingRatio = 0.5, stiffness = 200f)` | Celebration, onboarding, gamification |
| `spring-snappy` | `{ type: "spring", stiffness: 300, damping: 20 }` | `.spring(response: 0.3, dampingFraction: 0.8)` | `spring(dampingRatio = 0.8, stiffness = 300f)` | Navigation, panel switch, tab change — précis et net |

**Règle** : Préférer les springs aux easing classiques pour les interactions tactiles — les springs sont physiquement naturels et interruptibles (l'utilisateur peut interagir pendant l'animation).

---

## Transitions par contexte

### Entrées / Sorties de composants
| Composant | Durée | Easing | Propriétés animées | Notes |
|-----------|-------|--------|-------------------|-------|
| Modal / Dialog | `normal` (250ms) | `ease-out` in / `ease-in` out | opacity + scale(0.95→1) | Scale from center |
| Dropdown / Menu | `fast` (150ms) | `ease-out` in / `ease-in` out | opacity + translateY(-8→0) | Depuis le trigger |
| Tooltip | `fast` (150ms) | `ease-out` | opacity | Fade only, pas de movement |
| Toast / Snackbar | `normal` (250ms) | `spring-snappy` | translateY | Slide from bottom ou top |
| Sheet / Drawer | `slow` (400ms) | `spring-snappy` | translateX ou translateY | Slide from edge |
| Sidebar | `normal` (250ms) | `ease-in-out` | width ou translateX | Collapse/expand |
| Accordion | `normal` (250ms) | `ease-in-out` | height + opacity | Content reveal |

### Feedback d'interaction
| Interaction | Durée | Easing | Propriétés animées | Notes |
|-------------|-------|--------|-------------------|-------|
| Button press | `micro` (100ms) | `spring-gentle` | scale(0.97) | Scale down subtil au press |
| Hover state | `fast` (150ms) | `ease-out` | background-color, opacity | Changement de fond |
| Focus ring | `fast` (150ms) | `ease-out` | box-shadow, outline | Apparition de l'outline |
| Toggle / Switch | `fast` (150ms) | `spring-snappy` | translateX + background | Thumb slide + bg color |
| Checkbox / Radio | `micro` (100ms) | `spring-gentle` | scale + opacity | Check mark scale-in |
| Ripple (Material) | `normal` (250ms) | `decelerate` | scale + opacity | Expand from touch point |

### Transitions de contenu
| Transition | Durée | Easing | Propriétés animées | Notes |
|------------|-------|--------|-------------------|-------|
| Page/route | `slow` (400ms) | `ease-in-out` | opacity + translateX | Slide horizontal entre pages |
| Tab content | `fast` (150ms) | `ease-in-out` | opacity | Crossfade, pas de slide |
| List reorder | `normal` (250ms) | `spring-snappy` | translateY | Items slide to new position |
| List add | `normal` (250ms) | `ease-out` | opacity + height | Expand into place |
| List remove | `fast` (150ms) | `ease-in` | opacity + height | Collapse and fade |
| Skeleton → Content | `slower` (600ms) | `ease-out` | opacity | Fade skeleton out, content in |
| Image load | `normal` (250ms) | `ease-out` | opacity | Fade in après chargement |
| Number counter | `slow` (400ms) | `ease-out` | valeur numérique | Counting up/down animation |

### Feedback émotionnel
| Feedback | Durée | Easing | Notes |
|----------|-------|--------|-------|
| Success check | `normal` (250ms) | `spring-bouncy` | Check mark draws then bounces |
| Confetti | `deliberate` (1000ms) | `ease-out` avec gravity | Particles fall with physics |
| Error shake | 3 × `micro` (100ms) | `ease-in-out` | translateX ±4px, 3 oscillations |
| Copy feedback | `fast` (150ms) in, 2s hold, `fast` out | `ease-out` | "Copied!" badge appears for 2s |
| Pull-to-refresh | — | `spring-gentle` | Suit le doigt, release = spring back |

---

## Reduced Motion

### `prefers-reduced-motion: reduce`

Obligation légale (WCAG 2.1 SC 2.3.3) et nécessité UX pour les utilisateurs sensibles au mouvement.

**Règle absolue** : toute animation doit avoir un fallback reduced-motion.

| Animation originale | Comportement reduced-motion |
|---|---|
| Slide + fade | Fade only (opacity) |
| Scale + fade | Fade only |
| Spring / bounce | Instant ou ease-in-out sans bounce |
| Confetti / particles | Omis entièrement |
| Scroll-triggered parallax | Position statique |
| Auto-playing animation (Lottie) | Image statique (premier frame) |
| Page transition slide | Crossfade simple ou instant |
| Skeleton shimmer | Skeleton statique (pas de shimmer) |

### Implémentation

```css
/* Web */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```swift
// iOS (SwiftUI)
@Environment(\.accessibilityReduceMotion) var reduceMotion
withAnimation(reduceMotion ? .none : .spring()) {
    // ...
}
```

```kotlin
// Android (Compose)
val reduceMotion = LocalReduceMotion.current
val animSpec = if (reduceMotion) snap() else spring()
```

**Exceptions** : les indicateurs fonctionnels (spinner de loading, progress bar) restent animés même en reduced-motion — ils communiquent un état, pas une décoration.

---

## Loading States

| État | Animation | Durée | Notes |
|------|-----------|-------|-------|
| Spinner | Rotation continue | `linear`, 1 tour / 800ms | Simple, universel |
| Skeleton | Shimmer gradient | `linear`, sweep / 1500ms | Préférer aux spinners pour les listes et cards |
| Progress bar (determinate) | Width grow | `ease-out`, proportionnel | Montrer la progression réelle |
| Progress bar (indeterminate) | Slide loop | `ease-in-out`, cycle / 1500ms | Quand la durée est inconnue |
| Pulse dot | Opacity pulse | `ease-in-out`, cycle / 1200ms | Indicateur de typing/processing |
| Optimistic update | Instant + rollback si erreur | `instant` | Appliquer immédiatement, annuler si échec |

**Règle** : si le chargement dure < 200ms, ne pas afficher de loading state (le spinner apparaît et disparaît trop vite — c'est pire que rien). Afficher le skeleton ou spinner seulement après un délai de 200ms.

---

## Scroll Animations

| Type | Durée | Trigger | Notes |
|------|-------|---------|-------|
| Fade-in on scroll | `normal` (250ms) | Élément entre dans le viewport (IntersectionObserver) | `ease-out`, opacity 0→1, translateY 16→0 |
| Sticky header shrink | `fast` (150ms) | Scroll > threshold | Height + padding réduites |
| Parallax | — | Scroll position | **Attention** : désactiver si reduced-motion. Ratio max : 0.3× (subtil) |
| Lazy image reveal | `normal` (250ms) | Image chargée + visible | Fade in simple |
| Scroll-to-top button | `fast` (150ms) | Scroll > 500px | Fade in, position fixed bottom-right |

**Conventions scroll :**
- Ne jamais hijacker le scroll natif (scroll-jacking) dans une app — toléré uniquement sur les landing pages marketing
- Fade-in au scroll : une seule fois par élément (pas de re-animation au scroll up)
- Threshold d'apparition : quand l'élément est visible à 20% dans le viewport

---

## Guidelines

- Utiliser les tokens de durée, jamais des valeurs arbitraires — les mêmes 7 durées couvrent tous les cas
- **Enter = ease-out, Exit = ease-in, State change = ease-in-out** — la règle couvre 80% des animations
- Préférer les springs pour les interactions directes (boutons, toggles, drags) — plus naturels et interruptibles
- Tester avec reduced-motion activé — si l'app est inutilisable sans animations, le design est cassé
- Ne pas animer les changements de layout qui causent du reflow — animer uniquement opacity, transform, et les propriétés composites
- **L'absence d'animation est un choix valide.** Si un élément n'a pas besoin de transition, `instant` est le bon token
- Performance : viser 60fps — si une animation cause du jank, la simplifier ou la supprimer
- Le délai de 200ms avant d'afficher un loading state est critique — l'appliquer systématiquement
