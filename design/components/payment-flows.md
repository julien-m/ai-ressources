# Payment Flows

Patterns de paiement par type de flow : tip, subscription, one-time purchase, express checkout.
Complète forms.md avec les conventions spécifiques au paiement.

---

## Anatomie d'un formulaire de paiement

```
┌──────────────────────────────────────────────┐
│                                              │
│ EXPRESS CHECKOUT                             │
│ ┌────────────────┐ ┌────────────────┐       │
│ │   Apple Pay    │ │  Google Pay    │       │
│ └────────────────┘ └────────────────┘       │
│                                              │
│ ─────────── or pay with card ───────────    │
│                                              │
│ Card number                                  │
│ ┌──────────────────────────────────────┐    │
│ │ 4242 4242 4242 4242          [Visa]  │    │
│ └──────────────────────────────────────┘    │
│                                              │
│ Expiry              CVC                      │
│ ┌────────────┐     ┌─────────────┐          │
│ │ MM / YY    │     │ 123      🔒 │          │
│ └────────────┘     └─────────────┘          │
│                                              │
│ Name on card                                 │
│ ┌──────────────────────────────────────┐    │
│ │ Jane Doe                             │    │
│ └──────────────────────────────────────┘    │
│                                              │
│ 🔒 Secured by Stripe                        │
│                                              │
└──────────────────────────────────────────────┘
```

**Éléments obligatoires :**
- Express pay en premier (Apple Pay / Google Pay / Shop Pay) — avant le formulaire carte
- Séparateur "or pay with card" entre express et formulaire
- Card number avec détection automatique du réseau (logo Visa/MC/Amex affiché dynamiquement)
- Expiry + CVC sur la même ligne (gain d'espace vertical)
- Icône cadenas sur le CVC + mention "Secured by [provider]" en bas
- Autofill hints : `cc-number`, `cc-exp`, `cc-csc`, `cc-name`

**Conventions :**
- Utiliser les composants du provider (Stripe Elements, PayPal buttons) — ne jamais gérer des numéros de carte directement
- Formatage automatique : `4242 4242 4242 4242` (espaces tous les 4 chiffres)
- Validation on blur par champ, erreur inline spécifique ("Your card was declined" plutôt que "Payment error")
- Le bouton submit est désactivé pendant le traitement (spinner + "Processing...")
- Keyboard type : `numeric` pour card number, expiry, CVC

---

## Flow 1 : Tip / Donation

Pattern Ko-fi, Buy Me a Coffee — friction minimale, émotion maximale.

### Étapes

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Montant │ →  │ Message │ →  │ Paiement│ →  │ Merci   │
│ (requis)│    │(optionl)│    │ (requis)│    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### Étape 1 : Sélection du montant

```
┌──────────────────────────────────────────────┐
│                                              │
│ Support [Creator Name]                       │
│                                              │
│ ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌───────┐ │
│ │ $3 │  │ $5 │  │$10 │  │$25 │  │Custom │ │
│ └────┘  └────┘  └────┘  └────┘  └───────┘ │
│                                              │
│ ┌──────────────────────────────────────┐    │
│ │ $ [       ]                          │    │
│ └──────────────────────────────────────┘    │
│ ← Apparaît si "Custom" sélectionné         │
│                                              │
│ Quantity                                     │
│ [- ]  1 coffee  [+ ]     = $5.00            │
│                                              │
└──────────────────────────────────────────────┘
```

**Conventions montant :**
- 4 presets + 1 custom — les presets sont les montants les plus choisis par les supporters du créateur
- Le preset médian est pré-sélectionné (pas le plus bas — ancrage psychologique)
- Custom : champ numérique, montant minimum affiché ("min. $1")
- Quantity multiplier optionnel (BMC pattern : "Buy X coffees")
- Le total est recalculé en temps réel et toujours visible

### Étape 2 : Message (optionnel)

```
┌──────────────────────────────────────────────┐
│                                              │
│ Leave a message (optional)                   │
│ ┌──────────────────────────────────────┐    │
│ │ Great work on the latest video!      │    │
│ │                                      │    │
│ │                                      │    │
│ └──────────────────────────────────────┘    │
│ 280 characters remaining                     │
│                                              │
│ ☐ Make this a private message                │
│                                              │
│ Your name (shown to creator)                 │
│ ┌──────────────────────────────────────┐    │
│ │ Jane Doe                             │    │
│ └──────────────────────────────────────┘    │
│                                              │
│ Email (for receipt)                           │
│ ┌──────────────────────────────────────┐    │
│ │ jane@example.com                     │    │
│ └──────────────────────────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘
```

**Conventions :**
- Toggle public/privé pour le message
- Nom affiché au créateur (pas forcément un compte — tip sans inscription)
- Email pour le reçu uniquement — pas de création de compte forcée
- Compteur de caractères restants (pas de compteur progressif)

### Étape 3 : Paiement

Utilise le formulaire de paiement standard (voir anatomie ci-dessus).

**Spécificités tip :**
- Montant affiché en grand au-dessus du formulaire ("You're sending $5")
- Pas de page intermédiaire de "review" — le montant est visible, c'est suffisant
- Express pay en priorité absolue (one-tap = conversion maximale)

### Étape 4 : Confirmation / Merci

```
┌──────────────────────────────────────────────┐
│                                              │
│              ✓                               │
│                                              │
│     Thank you for your support!              │
│                                              │
│     $5 sent to [Creator Name]               │
│                                              │
│     A receipt has been sent to               │
│     jane@example.com                         │
│                                              │
│     ┌──────────────────────────────────┐    │
│     │        Share your support         │    │
│     └──────────────────────────────────┘    │
│                                              │
│     [Twitter]  [Copy link]  [Close]          │
│                                              │
└──────────────────────────────────────────────┘
```

**Conventions confirmation :**
- Animation de succès (check animé, confetti léger — le tip est un moment émotionnel)
- Récapitulatif : montant + destinataire + email du reçu
- Share buttons : amplification organique, le supporter partage qu'il a soutenu
- Pas de upsell immédiat — le moment de gratitude est sacré

---

## Flow 2 : Subscription / Membership

Pattern Patreon, Stripe Billing — engagement récurrent.

### Étapes

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Plan    │ →  │ Paiement│ →  │ Review  │ →  │ Welcome │
│ (choix) │    │ (requis)│    │(confirm)│    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### Sélection du plan

```
┌──────────────────────────────────────────────────────────────┐
│ Choose your plan                  [Monthly ◉] [Yearly ○]    │
│                                                              │
│ ┌────────────┐  ┌────────────────┐  ┌────────────┐         │
│ │ Free       │  │ ★ Pro          │  │ Business   │         │
│ │            │  │   POPULAR      │  │            │         │
│ │ $0/mo      │  │ $29/mo         │  │ $99/mo     │         │
│ │            │  │ $290/yr (save  │  │ $990/yr    │         │
│ │ ✓ Feature  │  │  17%)          │  │            │         │
│ │ ✓ Feature  │  │                │  │ Everything │         │
│ │ ✗ Feature  │  │ ✓ Everything   │  │ in Pro +   │         │
│ │ ✗ Feature  │  │   in Free +   │  │            │         │
│ │            │  │ ✓ Feature      │  │ ✓ Feature  │         │
│ │            │  │ ✓ Feature      │  │ ✓ Feature  │         │
│ │            │  │ ✓ Feature      │  │ ✓ Priority │         │
│ │            │  │                │  │   support  │         │
│ │ [Current]  │  │ [Upgrade]      │  │ [Upgrade]  │         │
│ └────────────┘  └────────────────┘  └────────────┘         │
└──────────────────────────────────────────────────────────────┘
```

**Conventions pricing :**
- 3 colonnes max (Free / Pro / Business ou Scale / Enterprise)
- Toggle mensuel/annuel — annuel pré-sélectionné avec économie affichée ("save 17%")
- Plan recommandé : badge "POPULAR" + bordure accentuée ou légèrement surélevé
- CTAs différenciés : "Current plan" (disabled) / "Upgrade" (accent) / "Contact sales" (outline)
- Features listées avec ✓ (inclus) et ✗ (non inclus, grisé)
- Le prix annuel est affiché en mensuel ("$29/mo billed annually" ou "$290/yr")

### Review avant confirmation

```
┌───────────────────────────────────────────┐
│ Review your subscription                  │
│                                           │
│ Plan          Pro (Monthly)               │
│ Price         $29.00/mo                   │
│ Starts        Today                       │
│ Renewal       Apr 21, 2026               │
│                                           │
│ Payment       Visa ****4242               │
│                                    [Edit] │
│                                           │
│ By confirming, you agree to the           │
│ Terms of Service. You can cancel          │
│ anytime from Settings.                    │
│                                           │
│ ┌───────────────────────────────────┐    │
│ │     Confirm subscription          │    │
│ └───────────────────────────────────┘    │
│                                           │
│ [← Back to plans]                         │
└───────────────────────────────────────────┘
```

**Conventions :**
- Récapitulatif complet avant charge : plan, prix, date de début, date de renouvellement
- Payment method affichée avec option de modifier
- Mention légale courte (Terms + possibilité d'annuler)
- Pas de checkbox supplémentaire — le clic "Confirm" vaut acceptation

### Gestion post-subscription

**Upgrade** : changement immédiat, prorata calculé automatiquement, affiché avant confirmation
**Downgrade** : effectif à la fin du cycle en cours, accès maintenu jusque-là
**Cancel** : flow multi-étapes :
1. "Why are you cancelling?" (optionnel, pour le feedback produit)
2. Récapitulatif de ce qui sera perdu ("You'll lose access to X, Y, Z on [date]")
3. Offre de rétention optionnelle ("Stay on Pro with 20% off for 3 months?")
4. Confirmation finale

---

## Flow 3 : One-Time Purchase

Pattern Gumroad, Shopify checkout — achat unique, digital ou physique.

### Checkout one-page

```
┌──────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────┐  ┌────────────────────────┐    │
│ │                          │  │ ORDER SUMMARY          │    │
│ │ EXPRESS CHECKOUT         │  │                        │    │
│ │ [Apple Pay] [Google Pay] │  │ Product Name     $49   │    │
│ │                          │  │ ┌──────┐              │    │
│ │ ─── or pay with card ─── │  │ │ img  │  Description │    │
│ │                          │  │ └──────┘              │    │
│ │ Email                    │  │                        │    │
│ │ ┌──────────────────────┐│  │ Subtotal       $49.00 │    │
│ │ │                      ││  │ Tax             $4.90 │    │
│ │ └──────────────────────┘│  │ ──────────────────── │    │
│ │                          │  │ Total          $53.90 │    │
│ │ Card number              │  │                        │    │
│ │ ┌──────────────────────┐│  │                        │    │
│ │ │                      ││  │                        │    │
│ │ └──────────────────────┘│  │                        │    │
│ │                          │  │                        │    │
│ │ Expiry       CVC        │  │                        │    │
│ │ ┌──────┐   ┌──────┐    │  │                        │    │
│ │ │      │   │      │    │  │                        │    │
│ │ └──────┘   └──────┘    │  │                        │    │
│ │                          │  │                        │    │
│ │ ┌──────────────────────┐│  │                        │    │
│ │ │    Pay $53.90        ││  │                        │    │
│ │ └──────────────────────┘│  │                        │    │
│ │                          │  │                        │    │
│ │ 🔒 Secured by Stripe    │  │                        │    │
│ └──────────────────────────┘  └────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

**Conventions :**
- Layout 2 colonnes : formulaire gauche + récapitulatif droite (sticky)
- Le récapitulatif reste visible pendant tout le scroll du formulaire
- Le montant total est dans le bouton de paiement ("Pay $53.90")
- Tax calculée automatiquement (si MoR) ou affichée séparément
- Produit digital : pas de champs adresse de livraison
- Produit physique : ajouter adresse de livraison entre email et carte
- Mobile : le récapitulatif passe au-dessus du formulaire (1 colonne)

---

## Flow 4 : Express Checkout

Paiement en un tap — Apple Pay, Google Pay, Shop Pay.

### Flow

```
┌─────────┐    ┌─────────────────┐    ┌─────────┐
│ Bouton  │ →  │ Sheet native    │ →  │ Confirm │
│ Express │    │ (OS gère le     │    │         │
│         │    │  paiement)      │    │         │
└─────────┘    └─────────────────┘    └─────────┘
```

**Conventions :**
- Le bouton express utilise les guidelines du provider (couleur, forme, logo imposés par Apple/Google)
- Le sheet est natif (OS) — pas de customisation possible
- L'adresse et le moyen de paiement sont pré-remplis depuis le wallet
- Le biométrique (Face ID / Touch ID / fingerprint) remplace la saisie du CVC
- Après validation biométrique → confirmation instantanée

**Hiérarchie de placement :**
1. **Meilleur** : Express en premier, au-dessus du formulaire carte
2. **Acceptable** : Express au même niveau que le formulaire, séparé par "or"
3. **À éviter** : Express en bas, après le formulaire carte (découvrabilité réduite)

---

## États transactionnels

### Processing

```
┌───────────────────────────────────────────┐
│                                           │
│              ◌ Processing...              │
│                                           │
│       Please don't close this page.       │
│                                           │
└───────────────────────────────────────────┘
```

- Spinner + message "Processing..." — jamais un écran vide
- Bouton de paiement désactivé et transformé en spinner
- Message "Don't close this page" — critique pour les 3D Secure

### Success

```
┌───────────────────────────────────────────┐
│                                           │
│              ✓ Payment complete            │
│                                           │
│     $53.90 charged to Visa ****4242      │
│     Receipt sent to jane@example.com      │
│                                           │
│     ┌───────────────────────────────┐    │
│     │        Continue               │    │
│     └───────────────────────────────┘    │
│                                           │
└───────────────────────────────────────────┘
```

- Check animé (scale-in + fade)
- Récapitulatif : montant + moyen de paiement + email reçu
- CTA contextuel : "Continue" (vers le produit), "Download" (digital), "Track order" (physique)

### Failure

```
┌───────────────────────────────────────────┐
│                                           │
│              ✗ Payment failed              │
│                                           │
│     Your card was declined.               │
│     Please try a different card            │
│     or contact your bank.                  │
│                                           │
│     ┌───────────────────────────────┐    │
│     │        Try again               │    │
│     └───────────────────────────────┘    │
│                                           │
└───────────────────────────────────────────┘
```

**Messages d'erreur spécifiques :**

| Code provider | Message utilisateur |
|---|---|
| card_declined | "Your card was declined. Please try a different card or contact your bank." |
| insufficient_funds | "Your card has insufficient funds. Please try a different card." |
| expired_card | "Your card has expired. Please update your card details." |
| incorrect_cvc | "The CVC code is incorrect. Please check and try again." |
| processing_error | "A processing error occurred. Please try again." |
| 3ds_failed | "Authentication failed. Please try again or use a different card." |
| rate_limit | "Too many attempts. Please wait a moment and try again." |

**Conventions erreur :**
- Ne jamais afficher les codes techniques du provider (pas de "err_charge_declined")
- Le bouton "Try again" ramène au formulaire pré-rempli (sauf carte — le CVC est vidé)
- Après 3 échecs consécutifs, suggérer un autre moyen de paiement ou le support
- Network error → "Connection lost. Your card was not charged. Please check your connection and try again."

---

## 3D Secure

```
┌───────────────────────────────────────────┐
│                                           │
│   ┌───────────────────────────────────┐  │
│   │                                   │  │
│   │  [Iframe / Redirect banque]       │  │
│   │                                   │  │
│   │  Authentification en cours...     │  │
│   │                                   │  │
│   └───────────────────────────────────┘  │
│                                           │
│   ⚠ Don't close this window.             │
│                                           │
└───────────────────────────────────────────┘
```

**Conventions :**
- Modale ou redirect selon le provider — le développeur ne contrôle pas le contenu
- Message clair : "Your bank requires additional verification"
- Avertissement de ne pas fermer la fenêtre/tab
- Timeout : si la vérification prend plus de 5 minutes, afficher un message "Taking too long? [Cancel and try again]"
- Après succès 3DS → retour automatique au flow de confirmation

---

## Checklist payment flows

Avant de livrer un flow de paiement :

**Formulaire**
- [ ] Express pay (Apple Pay / Google Pay) placé AVANT le formulaire carte
- [ ] Card number avec détection réseau automatique (logo dynamique)
- [ ] Expiry + CVC sur la même ligne
- [ ] Autofill hints configurés (`cc-number`, `cc-exp`, `cc-csc`)
- [ ] Validation on blur par champ avec messages spécifiques
- [ ] Keyboard numeric pour tous les champs numériques

**Flow**
- [ ] Montant total visible à chaque étape
- [ ] Bouton de paiement affiche le montant ("Pay $53.90")
- [ ] Bouton désactivé pendant le processing (spinner)
- [ ] 3D Secure supporté avec message "don't close"
- [ ] Pas de double charge possible (idempotency)

**États**
- [ ] Processing : spinner + message
- [ ] Success : check animé + récapitulatif + CTA contextuel
- [ ] Failure : message humain spécifique au type d'erreur + "Try again"
- [ ] Timeout 3DS géré avec option de retry

**Sécurité**
- [ ] Aucun numéro de carte stocké côté client
- [ ] Composants du provider utilisés (Stripe Elements ou équivalent)
- [ ] Badge "Secured by [provider]" visible
- [ ] PCI DSS : le formulaire est servi dans une iframe sécurisée

**Mobile**
- [ ] Layout 1 colonne (récapitulatif au-dessus du formulaire)
- [ ] Express pay en pleine largeur
- [ ] Keyboard type adapté par champ
- [ ] CTA sticky en bas de l'écran si le formulaire est long
