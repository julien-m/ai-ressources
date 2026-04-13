# App Views — Catalogue des vues standard SaaS

> Vues universelles présentes dans toute application SaaS, quel que soit le domaine métier.
> Complète app-ui.md (patterns universels + vues par catégorie) avec le détail de chaque vue standard.
> Basé sur l'analyse de : Stripe, Vercel, Linear, Clerk, Supabase, Notion, GitHub (mars 2026).

---
## Conventions transversales

Avant de livrer une application SaaS, vérifier chaque vue contre sa checklist intégrée.

### Éléments obligatoires (template)

Chaque vue documentée ci-dessous hérite de ces conventions sauf mention contraire :

- **Empty state** : message explicatif + CTA vers l'action principale
- **Loading** : skeleton screens (pas de spinner plein écran)
- **Error** : message inline contextuel, pas de page blanche
- **Danger zone** : toujours en bas, séparée visuellement (border-top ou fond teinté rouge), texte d'avertissement. Confirmation modale pour toute action irréversible
- **Save** : bouton Save inactif par défaut, actif (couleur accent) dès qu'un champ est modifié. Inline par section pour settings simples, sticky bottom pour formulaires longs

### Status badge colors (référence unique)

| Statut | Couleur | Signification |
|---|---|---|
| Active / Connected | Vert `success` | Actif, connecté |
| Invited / Pending | Gris `on-surface-variant` | En attente — invitation envoyée, pas encore acceptée |
| Suspended / Warning | Orange `warning` | Temporairement désactivé / attention |
| Deactivated / Failed / Error | Rouge `error` | Désactivé / échec — compte définitivement désactivé (Deactivated) ou erreur technique (Failed/Error) |
| Disabled | Gris clair | Inactif mais configuré |

Référencé par : User List, User Detail, Webhooks, Audit Log, Integrations.

---
## Dashboard / Overview

Vue d'accueil après connexion. Résume l'état du système en un coup d'œil.

```
┌──────────────────────────────────────────────────────────────┐
│ Overview                          [7 days ▾] [Export]        │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Métrique 1│ │ Métrique 2│ │ Métrique 3│ │ Métrique 4│       │
│ │ $12,345  │ │ 1,234    │ │ 89.2%    │ │ 42       │        │
│ │ ↑ +12.3% │ │ ↓ -3.1%  │ │ ↑ +0.5%  │ │ — 0%     │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│ ┌────────────────────────────────────────────────────┐      │
│ │ [Graphique ligne ou barre — pleine largeur]        │      │
│ └────────────────────────────────────────────────────┘      │
│ Recent activity                                    View all → │
│ [Avatar] @user did X on Y                         2min ago   │
│ [Avatar] @user did Z on W                         1hr ago    │
│ [Avatar] @user did A on B                         3hr ago    │
└──────────────────────────────────────────────────────────────┘
```

**Éléments spécifiques :**
- 3–4 metric cards en rangée (label 13px gris + valeur 24px bold + variation % colorée)
- Sélecteur de période : 7 days / 30 days / 3 months / 12 months / custom
- Graphique principal : ligne ou barre, pas de pie chart — jamais de pie chart
- Feed d'activité récente : avatar + nom + action + timestamp relatif
- Lien "View all" vers l'activity log complet
- **Actions header** : sélecteur de période (dropdown ou pills), Export CSV (discret, aligné à droite), Refresh (optionnel si données non temps réel)
- **Checklist** : ✓ metric cards + graphique + activité récente · ✓ Onboarding avec chemin de résistance minimal (< 3min to value)

---
## Settings — General

Paramètres globaux du workspace / organisation.

```
┌──────────────────┬──────────────────────────────────────────┐
│ ACCOUNT          │ General settings                         │
│ ● General        │                                          │
│   Profile        │ Workspace name                           │
│   Security       │ ┌──────────────────────────────────┐    │
│                  │ │ My Workspace                     │    │
│ WORKSPACE        │ └──────────────────────────────────┘    │
│   Members        │ Workspace URL                            │
│   Billing        │ app.example.com/ [my-workspace]          │
│   API tokens     │                                          │
│   Integrations   │ Logo                                     │
│   Notifications  │ ┌────────┐                               │
│                  │ │  Logo  │  Upload (max 2MB, PNG/SVG)   │
│ DANGER           │ └────────┘                               │
│   Advanced       │ Timezone                                  │
│                  │ [Europe/Paris                       ▾]   │
│                  │ Language                                  │
│                  │ [Français                           ▾]   │
│                  │                          [Save changes]  │
│                  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                  │ DANGER ZONE                              │
│                  │ Delete workspace         [Delete...]     │
│                  │ This action is irreversible               │
└──────────────────┴──────────────────────────────────────────┘
```

**Éléments spécifiques :**
- Sidebar interne de settings (reproduit la navigation principale)
- Groupes logiques : Account / Workspace / Danger
- Champs : workspace name, URL/slug, logo upload, timezone, language
- Confirmation modale pour toute action irréversible dans la danger zone
- Le slug/URL est validé en temps réel (disponibilité, caractères autorisés)
- **Checklist** : ✓ Settings structurés en sidebar interne (General / Profile / Security / Team / Billing / Notifications)

---
## Settings — Profile

Profil personnel de l'utilisateur connecté.

```
┌──────────────────────────────────────────────────────────────┐
│ Profile                                                      │
│ ┌────────┐                                                   │
│ │ Avatar │  Change photo / Remove                            │
│ └────────┘                                                   │
│ Display name                                                 │
│ ┌────────────────────────────────┐                          │
│ │ Jane Doe                       │                          │
│ └────────────────────────────────┘                          │
│ Email                                                        │
│ ┌────────────────────────────────┐                          │
│ │ jane@example.com               │  ✓ Verified              │
│ └────────────────────────────────┘                          │
│ Role (read-only)                                             │
│ [Admin]                                                      │
│ Theme                                                        │
│ ○ Light  ○ Dark  ● System                                   │
│                                    [Save changes]            │
└──────────────────────────────────────────────────────────────┘
```

**Éléments spécifiques :**
- Avatar : upload + crop + suppression. Fallback = initiale sur fond coloré (généré depuis le nom). Cercle, 64–80px en settings, 24–32px dans sidebar/header
- Display name
- Email avec badge de vérification. Changement d'email → email de confirmation (ancien + nouveau email notifiés)
- Rôle : affiché en read-only (badge pill), non modifiable par l'utilisateur — modifiable uniquement par un admin depuis la vue Team
- Préférence de thème : Light / Dark / System (3 options radio ou segmented control)

---
## Settings — Security

Mot de passe, 2FA, sessions.

```
┌──────────────────────────────────────────────────────────────┐
│ Security                                                     │
│ PASSWORD                                                     │
│ Current password                                             │
│ ┌────────────────────────────────┐                          │
│ │ ••••••••••                  👁 │                          │
│ └────────────────────────────────┘                          │
│ New password                                                 │
│ ┌────────────────────────────────┐                          │
│ │                              👁 │                          │
│ └────────────────────────────────┘                          │
│ ■■■■□□ Strength: Medium                                     │
│ Confirm new password                                         │
│ ┌────────────────────────────────┐                          │
│ │                              👁 │                          │
│ └────────────────────────────────┘                          │
│                                    [Update password]         │
│ ─────────────────────────────────────────────────────────── │
│ TWO-FACTOR AUTHENTICATION                                    │
│ Status: ● Enabled                              [Disable]    │
│ Recovery codes: 4 remaining                    [Regenerate] │
│ ─────────────────────────────────────────────────────────── │
│ ACTIVE SESSIONS                                              │
│ 💻 Chrome · macOS · Paris, FR         Current session        │
│    Last active: now                                          │
│ 📱 Safari · iOS · Lyon, FR           [Revoke]               │
│    Last active: 2hr ago                                      │
│ 💻 Firefox · Windows · Remote        [Revoke]               │
│    Last active: 3 days ago                                   │
│                                       [Revoke all others]   │
└──────────────────────────────────────────────────────────────┘
```

**Password :**
- 3 champs : current, new, confirm. Toggle visibilité (icône œil) par champ
- Indicateur de force : barre segmentée (Weak rouge / Medium orange / Strong vert) + label
- Exigences affichées au focus du champ new password (8+ chars, uppercase, number, symbol)
- Validation : on blur pour le match confirm, on submit pour le current

**2FA :**
- Statut actuel (enabled/disabled) avec badge coloré
- Setup flow : QR code TOTP → code de vérification → backup codes affichés UNE SEULE FOIS
- Backup/recovery codes : nombre restant visible, bouton régénérer (avec confirmation modale, les anciens sont invalidés)
- Disable : exige le mot de passe actuel + un code TOTP

**Sessions actives :**
- Liste : icône device + browser + OS + localisation approximative + "Current session" ou timestamp
- Action par session : "Revoke" (sauf session courante). Action globale : "Revoke all other sessions"
- Après révocation : la session distante est déconnectée immédiatement

**Checklist** : ✓ Changement MDP avec indicateur de force · ✓ 2FA avec backup codes (affichés une seule fois) · ✓ Sessions actives avec révocation

---
## Settings — API Tokens

Gestion des clés d'API / tokens d'accès.

```
┌──────────────────────────────────────────────────────────────┐
│ API tokens                                    [+ New token]  │
│ NAME           SCOPES        CREATED      LAST USED   ⋯     │
│ Production     read, write   Mar 1, 2026  2min ago    ⋯     │
│   sk-prod-••••••••4f2a                              [copy]  │
│ CI/CD          read          Feb 15, 2026 1 day ago   ⋯     │
│   sk-ci-••••••••8b1c                                [copy]  │
│ Test (unused)  read          Jan 2, 2026  Never       ⋯     │
│   sk-test-••••••••3e9d                              [copy]  │
└──────────────────────────────────────────────────────────────┘
```

**Création d'un token :**

```
┌───────────────────────────────────────────┐
│ Create new API token                      │
│ Name                                      │
│ ┌───────────────────────────────────┐    │
│ │ Production                        │    │
│ └───────────────────────────────────┘    │
│ Scopes                                    │
│ ☑ Read    ☑ Write    ☐ Admin             │
│ Expiration                                │
│ ○ Never  ○ 30 days  ○ 90 days  ● 1 year │
│              [Cancel]  [Create token]     │
└───────────────────────────────────────────┘
```

**Affichage du token après création (VISIBLE UNE SEULE FOIS) :**

```
┌───────────────────────────────────────────┐
│ ✓ Token created                           │
│ ⚠ Copy this token now. It won't be       │
│   shown again.                            │
│ ┌───────────────────────────────────┐    │
│ │ sk-prod-a1b2c3d4e5f6g7h8i9j0...  │ 📋 │
│ └───────────────────────────────────┘    │
│ After closing this dialog, only the       │
│ last 4 characters will be visible.        │
│                              [Done]       │
└───────────────────────────────────────────┘
```

**Conventions critiques :**
- **Visible une seule fois** : le token complet n'est affiché qu'au moment de la création. Après fermeture du dialog, seuls les 4 derniers caractères sont visibles (`sk-prod-••••••••4f2a`)
- **Copier** : bouton copy toujours accessible, feedback visuel "Copied!" pendant 2 secondes
- **Format monospace** : tous les tokens en police monospace, préfixe identifiant le type (`sk-`, `pk-`, `pat-`)
- **Révoquer** : confirmation modale avec le nom du token, action irréversible
- **Régénérer** : = révoquer l'ancien + créer un nouveau. Le nouveau est affiché une seule fois
- **Last used** : "Never" si jamais utilisé, timestamp relatif sinon — permet d'identifier les tokens morts
- **Expiration** : badge warning si expire dans < 30 jours, badge error si expiré
- **Scopes** : checkboxes claires avec descriptions, granularité minimale (read / write / admin)
- **Empty state** : "No API tokens yet" + explication de ce qu'un token permet (accès programmatique à l'API) + CTA "Create your first token"
- **Checklist** : ✓ API tokens visibles une seule fois à la création, masqués ensuite

---
## Settings — Billing

Plan, paiement, factures.

```
┌──────────────────────────────────────────────────────────────┐
│ Billing                                                      │
│ CURRENT PLAN                                                 │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Pro Plan · $29/month           Renews on Apr 15, 2026    ││
│ │ 5 seats used of 10                                       ││
│ │ ████████░░ 50%                                           ││
│ │ [Change plan]                          [Cancel plan]     ││
│ └──────────────────────────────────────────────────────────┘│
│ PAYMENT METHOD                                               │
│ 💳 Visa ending in 4242 · Expires 12/2027       [Update]     │
│ INVOICES                                                     │
│ DATE           AMOUNT    STATUS       ACTION                 │
│ Mar 1, 2026    $29.00    ● Paid       [Download PDF]        │
│ Feb 1, 2026    $29.00    ● Paid       [Download PDF]        │
│ Jan 1, 2026    $29.00    ● Paid       [Download PDF]        │
│ Dec 1, 2025    $29.00    ○ Refunded   [Download PDF]        │
│                                          [Load more]         │
└──────────────────────────────────────────────────────────────┘
```

**Éléments spécifiques :**
- Card plan actuel : nom du plan, prix, cycle, date de renouvellement, usage (si limites)
- Barre d'usage si plan avec limites (seats, API calls, storage)
- Payment method : logo réseau (Visa/MC/Amex) + 4 derniers chiffres + expiration + Update. Badge warning si expire dans < 60 jours
- Table d'invoices : date, montant, statut (Paid vert / Pending orange / Failed rouge / Refunded gris), download PDF. Paginées, pas de scroll infini pour un historique financier
- "Change plan" ouvre une modale ou page avec les plans en colonnes (pattern pricing page). Cancel plan dans danger zone ou discret
- "Cancel plan" : flow multi-étapes (raison → confirmation → offre de rétention optionnelle → confirmation finale) — pas un clic accidentel
- **Checklist** : ✓ Plan actuel + usage + date renouvellement · ✓ Historique factures avec download PDF · ✓ Cancel plan en multi-étapes

---
## Settings — Team / Members

Gestion des membres d'une organisation.

```
┌──────────────────────────────────────────────────────────────┐
│ Team                                          [Invite ✉]    │
│ 5 members · 3 pending invites                                │
│ MEMBERS                                                      │
│ [Avatar] Jane Doe          jane@ex.com    [Admin ▾]    ⋯    │
│          Joined Mar 2025                   (you)             │
│ [Avatar] John Smith        john@ex.com    [Member ▾]   ⋯    │
│          Joined Jun 2025                                     │
│ [Avatar] Alice Martin      alice@ex.com   [Viewer ▾]   ⋯    │
│          Joined Jan 2026                                     │
│ PENDING INVITES                                              │
│ ✉ bob@example.com         [Member]   Sent 2 days ago  ⋯    │
│ ✉ carol@example.com       [Admin]    Sent 5hr ago     ⋯    │
│ ✉ dave@example.com        [Viewer]   Sent just now    ⋯    │
└──────────────────────────────────────────────────────────────┘
```

**Éléments spécifiques :**
- Compteur total : "X members · Y pending invites"
- Table des membres : avatar, nom, email, rôle (dropdown modifiable par admin), menu actions (⋯)
- Section invitations en attente : email, rôle assigné, date d'envoi, actions (resend / revoke)
- Bouton "Invite" proéminent en haut à droite

**Invite flow :**

```
┌───────────────────────────────────────────┐
│ Invite team members                       │
│ Email addresses                           │
│ ┌───────────────────────────────────┐    │
│ │ email@example.com, another@...    │    │
│ └───────────────────────────────────┘    │
│ Separate multiple emails with commas      │
│ Role                                      │
│ [Member                              ▾]  │
│ Admin — Full access, can manage billing   │
│ Member — Can create and edit              │
│ Viewer — Read-only access                 │
│              [Cancel]  [Send invites]     │
└───────────────────────────────────────────┘
```

**Conventions :**
- Rôles standard : Admin / Member / Viewer (minimum viable). Descriptions courtes sous chaque rôle
- Le changement de rôle est immédiat (pas de save button — dropdown inline)
- Remove member : confirmation modale avec le nom, option de transférer la propriété des items
- L'utilisateur courant est marqué "(you)" et ne peut pas se supprimer ni se rétrograder
- Invitations multiples en une seule action (emails séparés par des virgules)
- Resend invite : rate limit visible ("Can resend in 2 min")
- **Checklist** : ✓ Invite multi-email avec sélection de rôle · ✓ 3 rôles minimum (Admin / Member / Viewer) · ✓ Impossible de se supprimer ou se rétrograder soi-même

---
## Settings — Notifications

Préférences de notification par canal et par type.

```
┌──────────────────────────────────────────────────────────────┐
│ Notifications                                                │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ ⚠ Pause all notifications           [Toggle OFF]      │  │
│ └────────────────────────────────────────────────────────┘  │
│                              Email    Push    In-app         │
│ ACTIVITY                                                     │
│ Someone mentions you          ☑        ☑       ☑            │
│ Assigned to you               ☑        ☑       ☑            │
│ Comment on your item          ☑        ☐       ☑            │
│ UPDATES                                                      │
│ Status changes                ☐        ☐       ☑            │
│ New team member               ☑        ☐       ☑            │
│ Weekly digest                 ☑        ☐       ☐            │
│ BILLING                                                      │
│ Payment received              ☑        ☑       ☑            │
│ Payment failed                ☑        ☑       ☑            │
│ Plan limit approaching        ☑        ☑       ☑            │
│                                          [Save preferences] │
└──────────────────────────────────────────────────────────────┘
```

**Éléments spécifiques :**
- Toggle global "Pause all" (mute temporaire)
- Matrice : types de notification (lignes) × canaux (colonnes : Email / Push / In-app)
- Groupement par catégorie (Activity / Updates / Billing / Security)
- Certaines notifications sont non-désactivables (billing failures, security alerts) — checkbox désactivée avec tooltip explicatif
- Billing et Security : toujours activés sur au moins un canal (non-désactivable pour l'email)
- Digest : fréquence configurable (daily / weekly / never)
- Le changement est sauvegardé en bulk ("Save preferences"), pas en temps réel par checkbox

---
## User List (Admin)

Vue d'administration des utilisateurs.

```
┌──────────────────────────────────────────────────────────────┐
│ Users                              🔍 Search    [+ Add user] │
│ [All ▾]  [Role ▾]  [Status ▾]  [Date range ▾]              │
│ □  USER              EMAIL              ROLE    STATUS  LAST │
│ □  [Av] Jane Doe     jane@ex.com        Admin   ● Act.  2m  │
│ □  [Av] John Smith   john@ex.com        Member  ● Act.  1d  │
│ □  [Av] Alice M.     alice@ex.com       Viewer  ○ Inv.  —   │
│ □  [Av] Bob Wilson   bob@ex.com         Member  ◌ Susp. 30d │
│ Showing 4 of 128 users                    [← 1 2 3 ... →]  │
│ With selected: [Change role ▾] [Suspend] [Export CSV]        │
└──────────────────────────────────────────────────────────────┘
```

**Éléments spécifiques :**
- Search : filtre en temps réel par nom ou email
- Filtres : rôle, statut (Active / Invited / Suspended / Deactivated), date range
- Table : checkbox (bulk), avatar, nom, email, rôle (badge pill), statut (dot coloré — voir Status badge colors), last active
- Bulk actions : change role, suspend, export CSV
- Pagination (pas de scroll infini pour les tables admin — besoin de navigation précise)
- **Checklist** : ✓ User list avec filtres, search, bulk actions, pagination

---
## User Detail (Admin)

Profil d'un utilisateur vu par un administrateur.

```
┌──────────────────────────────────────────────────────────────┐
│ ← Users    Jane Doe                         [Actions ▾]     │
│ ┌────────┐  Jane Doe                                        │
│ │ Avatar │  jane@example.com                                │
│ └────────┘  [Admin]  ● Active  Joined Mar 2025              │
│ ─────────────────────────────────────────────────────────── │
│ DETAILS                           ACTIVITY                   │
│ Email    jane@example.com         [Av] Updated profile  2m  │
│ Role     Admin                    [Av] Created item X   1h  │
│ 2FA      ● Enabled                [Av] Invited @john    1d  │
│ Sessions 2 active                 [Av] Logged in        2d  │
│ Created  Mar 15, 2025                                        │
│ Last     2min ago                                            │
│ ─────────────────────────────────────────────────────────── │
│ DANGER ZONE                                                  │
│ [Suspend user]  [Reset password]  [Delete user]             │
└──────────────────────────────────────────────────────────────┘
```

**Éléments spécifiques :**
- Header : avatar large (64px) + nom + email + badges (rôle, statut) + date joined
- Détails : email, rôle (modifiable par dropdown), 2FA statut, sessions actives, dates
- Activity timeline : dernières actions de l'utilisateur
- Menu actions : Suspend / Reset password / Delete / Impersonate (si applicable)
- Danger zone : suspend, reset password (force le changement au prochain login), delete
- "Back to Users" (← breadcrumb) toujours visible
- L'impersonate (se connecter en tant que l'utilisateur) n'est jamais dans l'UI standard — outil admin avancé, accessible uniquement via menu caché ou CLI
- Delete user : confirmation avec saisie du nom de l'utilisateur (pattern GitHub)
- Reset password : envoie un email à l'utilisateur, ne révèle pas de mot de passe
- **Checklist** : ✓ User detail avec activity + actions (suspend, reset, delete)

---
## Activity Log / Audit Trail

Journal d'activité chronologique pour la sécurité et le debugging.

```
┌──────────────────────────────────────────────────────────────┐
│ Activity log                    [Filter ▾]  [Date range ▾]  │
│ TODAY                                                        │
│ │ [Av] Jane Doe                              14:32:05 UTC   │
│ │ Updated billing · Payment method changed                   │
│ │ IP: 203.0.113.42                                          │
│ │                                                            │
│ │ [Av] System                                14:30:12 UTC   │
│ │ Webhook delivered · invoice.paid → https://...             │
│ │                                                            │
│ │ [Av] John Smith                            13:15:00 UTC   │
│ │ Invited user · bob@example.com as Member                   │
│ YESTERDAY                                                    │
│ │ [Av] Jane Doe                              18:42:33 UTC   │
│ │ Revoked API token · "CI/CD"                                │
│ │ IP: 203.0.113.42                                          │
│                                              [Load more]     │
└──────────────────────────────────────────────────────────────┘
```

**Éléments spécifiques :**
- Timeline verticale avec groupement par jour (TODAY / YESTERDAY / date)
- Par entrée : avatar + acteur (nom ou "System") + action + cible (avec lien si applicable) + timestamp UTC précis
- IP address pour les actions sensibles (login, billing, token, user management)
- Filtres : par acteur, par type d'action, par date range
- Pas de modification ni suppression — l'audit trail est immuable
- **Checklist** : ✓ Activity log immuable avec timestamps UTC + IP

**Types d'événements standard :**

| Catégorie | Événements |
|---|---|
| Auth | login, logout, password_changed, 2fa_enabled, 2fa_disabled |
| Team | user_invited, user_removed, role_changed |
| Billing | plan_changed, payment_method_updated, payment_succeeded, payment_failed |
| API | token_created, token_revoked |
| Settings | workspace_updated, integration_added, integration_removed |
| Data | item_created, item_updated, item_deleted, export_requested |

---
## Auth — Login

```
┌───────────────────────────────────────────┐
│              [Logo]                       │
│         Welcome back                      │
│ Email                                     │
│ ┌───────────────────────────────────┐    │
│ │ jane@example.com                   │    │
│ └───────────────────────────────────┘    │
│ Password                 Forgot password? │
│ ┌───────────────────────────────────┐    │
│ │ ••••••••••                     👁 │    │
│ └───────────────────────────────────┘    │
│ ☐ Remember me                             │
│ ┌───────────────────────────────────┐    │
│ │           Log in                   │    │
│ └───────────────────────────────────┘    │
│ ──────────── or ────────────             │
│ [G] Continue with Google                  │
│ [🐙] Continue with GitHub                 │
│ Don't have an account? Sign up            │
└───────────────────────────────────────────┘
```

**Conventions :**
- Centré verticalement et horizontalement, largeur max ~400px. Logo au-dessus du formulaire
- "Forgot password?" aligné à droite du label Password
- OAuth buttons **en dessous** du formulaire email/password (convention 2026 — l'email/password reste la méthode principale pour les SaaS B2B)
- Séparateur "or" entre les deux méthodes. Lien "Sign up" en bas
- Pas de CAPTCHA visible par défaut (reCAPTCHA v3 invisible si nécessaire)
- **Checklist** : ✓ Login avec layout cohérent (~400px centré) · ✓ OAuth buttons proposés si applicable · ✓ Rate limiting sur actions sensibles (login, reset, resend)

---
## Auth — Register

```
┌───────────────────────────────────────────┐
│              [Logo]                       │
│        Create your account                │
│ Name                                      │
│ ┌───────────────────────────────────┐    │
│ │                                    │    │
│ └───────────────────────────────────┘    │
│ Email                                     │
│ ┌───────────────────────────────────┐    │
│ │                                    │    │
│ └───────────────────────────────────┘    │
│ Password                                  │
│ ┌───────────────────────────────────┐    │
│ │                                 👁 │    │
│ └───────────────────────────────────┘    │
│ ■■□□□□ Must be 8+ characters             │
│ ☑ I agree to the Terms of Service         │
│   and Privacy Policy                      │
│ ┌───────────────────────────────────┐    │
│ │         Create account             │    │
│ └───────────────────────────────────┘    │
│ ──────────── or ────────────             │
│ [G] Continue with Google                  │
│ [🐙] Continue with GitHub                 │
│ Already have an account? Log in           │
└───────────────────────────────────────────┘
```

**Conventions :**
- Même layout que Login (cohérence visuelle)
- Indicateur de force de mot de passe sous le champ
- Checkbox Terms + Privacy avec liens cliquables
- Email de vérification envoyé automatiquement après soumission
- Pas de "Confirm password" — le toggle visibilité suffit
- **Checklist** : ✓ Email de vérification après inscription

---
## Auth — Forgot / Reset Password

**Forgot password :**

```
┌───────────────────────────────────────────┐
│              [Logo]                       │
│        Reset your password                │
│ Enter the email associated with your      │
│ account and we'll send a reset link.      │
│ Email                                     │
│ ┌───────────────────────────────────┐    │
│ │                                    │    │
│ └───────────────────────────────────┘    │
│ ┌───────────────────────────────────┐    │
│ │        Send reset link             │    │
│ └───────────────────────────────────┘    │
│ ← Back to login                           │
└───────────────────────────────────────────┘
```

**Après soumission :**

```
┌───────────────────────────────────────────┐
│              [Logo]                       │
│            ✓ Check your email             │
│ We've sent a password reset link to       │
│ j***@example.com                          │
│ Didn't receive it? [Resend]               │
│ ← Back to login                           │
└───────────────────────────────────────────┘
```

**Conventions sécurité :**
- Toujours afficher le message de succès même si l'email n'existe pas (prévention d'énumération)
- Email partiellement masqué dans la confirmation
- Lien de reset expire après 1h
- Resend : rate limited (une fois toutes les 60 secondes, countdown visible)

**Reset password (depuis le lien email) :**
- Même layout que Login. 2 champs : New password + Confirm. Indicateur de force
- Après succès → redirection automatique vers Login avec message "Password updated"

---
## Notifications Center

Panneau de notifications in-app.

```
┌──────────────────────────────────┐
│ Notifications        [Mark all read]│
│ NEW                              │
│ ● Jane mentioned you in "Q1..."  │
│   2min ago                       │
│ ● Payment of $29 received       │
│   1hr ago                        │
│ EARLIER                          │
│ ○ John joined your workspace     │
│   Yesterday                      │
│ ○ Your plan was renewed          │
│   3 days ago                     │
│              [View all →]        │
└──────────────────────────────────┘
```

**Éléments spécifiques :**
- Panneau dropdown ou slide-over depuis l'icône cloche dans le header
- Badge compteur sur l'icône (nombre de non-lues, max "9+")
- Séparation "New" / "Earlier" (ou "Today" / "This week")
- Dot plein (●) = non lue, dot vide (○) = lue
- Click sur une notification → navigation vers le contexte concerné
- "Mark all as read" en haut. "View all" pour la page complète des notifications
- Max 5–8 notifications visibles dans le dropdown — le reste via "View all"
- Le panneau se ferme au clic en dehors. Pas de son par défaut (opt-in)
- Les notifications critiques (payment failed, security alert) ont un badge couleur accent ou rouge
- **Checklist** : ✓ Notifications center avec badge compteur + read/unread

---
## Error Pages

### 404 — Page Not Found

```
┌──────────────────────────────────────────────────────────────┐
│                         404                                  │
│               Page not found                                 │
│    The page you're looking for doesn't exist                 │
│    or has been moved.                                        │
│              [Go to Dashboard]                               │
└──────────────────────────────────────────────────────────────┘
```

### 403 — Forbidden

```
┌──────────────────────────────────────────────────────────────┐
│                         403                                  │
│              Access denied                                   │
│    You don't have permission to view this page.              │
│    Contact your workspace admin for access.                  │
│    [Go to Dashboard]    [Request access]                     │
└──────────────────────────────────────────────────────────────┘
```

### 500 — Server Error

```
┌──────────────────────────────────────────────────────────────┐
│                         500                                  │
│            Something went wrong                              │
│    We're working on it. Please try again later.              │
│         [Try again]    [Go to Dashboard]                     │
│    If the problem persists, contact support.                 │
└──────────────────────────────────────────────────────────────┘
```

**Conventions error pages :**
- Code d'erreur en grand (48–64px, bold, gris secondaire)
- Titre humain (pas juste le code HTTP). Description courte (1–2 lignes)
- CTA principal vers le Dashboard. CTA secondaire contextuel (Request access pour 403, Try again pour 500)
- Optionnel : illustration sobre et cohérente avec la marque
- Pas de navbar complète — juste le logo cliquable vers la home
- **Checklist** : ✓ Error pages (404, 403, 500) avec CTA retour

---
## Search Results

### Cmd+K / Omnibox

```
┌──────────────────────────────────────────────────────────────┐
│ 🔍 Search...                                            ⌘K  │
├──────────────────────────────────────────────────────────────┤
│ RECENT                                                       │
│ ↻ Dashboard settings                                        │
│ ↻ jane@example.com                                          │
│ QUICK ACTIONS                                                │
│ + Create new item                                            │
│ ⚙ Go to Settings                                            │
│ 👥 Invite team member                                        │
│                              ↑↓ Navigate  ⏎ Open  ⎋ Close  │
└──────────────────────────────────────────────────────────────┘
```

### Avec résultats de recherche

```
┌──────────────────────────────────────────────────────────────┐
│ 🔍 billing                                              ⌘K  │
├──────────────────────────────────────────────────────────────┤
│ SETTINGS (2)                                                 │
│ ⚙ Billing & Plans                                           │
│ ⚙ Payment methods                                           │
│ ITEMS (3)                                                    │
│ 📄 Q1 Billing Report                           Mar 2026     │
│ 📄 Invoice #2026-003                           Mar 1, 2026  │
│ 📄 Billing update announcement                 Feb 2026     │
│ MEMBERS (1)                                                  │
│ [Av] Bill Thompson · bill@example.com                       │
│                              ↑↓ Navigate  ⏎ Open  ⎋ Close  │
└──────────────────────────────────────────────────────────────┘
```

**Conventions :**
- Ouverture par `Cmd+K` (Mac) / `Ctrl+K` (Windows) — ou click sur la searchbar
- État vide : recherches récentes + quick actions
- Résultats groupés par type (Settings / Items / Members / etc.)
- Navigation clavier : ↑↓ pour naviguer, Enter pour ouvrir, Escape pour fermer
- Recherche fuzzy (tolérance aux typos)
- Max 3–5 résultats par groupe, lien "See all X results" si plus
- Highlight du terme de recherche dans les résultats
- Pas de page de résultats séparée — tout dans l'omnibox (pour apps < 10K items)
- **Checklist** : ✓ Cmd+K omnibox avec recherches récentes + quick actions

---
## Settings — Integrations

Connected third-party apps and services.

```
┌──────────────────────────────────────────────────────────────┐
│ Integrations                                  [Browse all →] │
│ CONNECTED                                                    │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [Logo] Slack                        ● Connected  [⋯]  │  │
│ │        Post notifications to #product channel          │  │
│ │        Connected by @jane · Mar 1, 2026                │  │
│ └────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [Logo] GitHub                       ● Connected  [⋯]  │  │
│ │        Auto-link commits to issues                     │  │
│ │        Connected by @john · Feb 15, 2026               │  │
│ └────────────────────────────────────────────────────────┘  │
│ AVAILABLE                                                    │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ [Logo]   │ │ [Logo]   │ │ [Logo]   │ │ [Logo]   │       │
│ │ Figma    │ │ Jira     │ │ Sentry   │ │ Zapier   │       │
│ │ [Connect]│ │ [Connect]│ │ [Connect]│ │ [Connect]│       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└──────────────────────────────────────────────────────────────┘
```

**Elements:**
- Two sections: Connected (active integrations) and Available (installable)
- Connected cards: logo (32-40px) + name + status badge (● Connected — voir Status badge colors) + description + who connected + when + overflow menu (⋯ → Configure / Disconnect)
- Available cards: logo + name + "Connect" button
- Search/filter: optional for 10+ integrations
- "Browse all" link: opens a full catalog/marketplace if many integrations

**Empty state:** "No integrations connected yet" + brève value proposition (automatiser les workflows avec vos outils existants) + CTA "Browse integrations"

**Disconnect flow:**
- Confirmation modal: "Disconnect Slack? This will stop all notifications to #product."
- Clearly state what will stop working
- No type-to-confirm (reversible action — user can reconnect)

---
## Settings — Webhooks

Webhook endpoints for event delivery.

```
┌──────────────────────────────────────────────────────────────┐
│ Webhooks                                    [+ Add endpoint] │
│ ENDPOINT          EVENTS       STATUS    LAST DELIVERY       │
│ https://api.ex…   5 events     ● Active  ✓ 2min ago    [⋯] │
│   Created Mar 1, 2026                                        │
│ https://staging…  All events   ● Active  ✕ Failed 1h   [⋯] │
│   Created Feb 20, 2026                                       │
│ https://old.ex…   3 events     ○ Disabled  — Never     [⋯] │
│   Created Jan 5, 2026                                        │
└──────────────────────────────────────────────────────────────┘
```

**Create/Edit endpoint modal:**

```
┌───────────────────────────────────────────┐
│ Add webhook endpoint                      │
│ Endpoint URL                              │
│ ┌───────────────────────────────────┐    │
│ │ https://                          │    │
│ └───────────────────────────────────┘    │
│ Events                                    │
│ ○ All events                              │
│ ● Select events                           │
│   ☑ invoice.paid                          │
│   ☑ customer.created                      │
│   ☐ charge.failed                         │
│   ☐ subscription.updated                  │
│   [Show all events...]                    │
│ Signing secret                            │
│ ┌───────────────────────────────────┐ 📋 │
│ │ whsec_••••••••••••4f2a            │    │
│ └───────────────────────────────────┘    │
│ Reveal secret only once (Stripe pattern)  │
│              [Cancel]  [Create endpoint]  │
└───────────────────────────────────────────┘
```

**Delivery log (click on endpoint to expand):**

```
┌──────────────────────────────────────────────────────────────┐
│ ← Webhooks    https://api.example.com/webhooks               │
│ STATUS    EVENT              RESPONSE    TIMESTAMP            │
│ ✓ 200     invoice.paid       200 OK      Mar 20, 14:32:01   │
│ ✓ 200     customer.created   200 OK      Mar 20, 14:31:45   │
│ ✕ 500     charge.failed      500 Error   Mar 20, 14:30:12   │
│           ↳ Next retry: Mar 20, 14:35                        │
│ ✓ 200     invoice.paid       200 OK      Mar 19, 09:15:33   │
│                                          [Load more]         │
└──────────────────────────────────────────────────────────────┘
```

**Empty state:** "No webhook endpoints" + explication de ce que les webhooks permettent (recevoir des notifications en temps réel quand des événements se produisent) + CTA "Add your first endpoint"

**Conventions:**
- **URL**: monospace, truncated with tooltip for long URLs
- **Signing secret**: visible once on creation (like API tokens), masked afterward. Copy button.
- **Events**: checkbox list, grouped by resource type (customer.*, invoice.*, charge.*). "Select all" per group.
- **Delivery log**: status code (colored — voir Status badge colors: 2xx green, 4xx/5xx red), event name, response, timestamp (precise, not relative — financial/technical data)
- **Retry**: automatic on failure (exponential backoff), next retry time shown inline
- **Disable/Enable**: toggle without deleting — preserves configuration
- **Delete**: confirmation modal, warns about data loss (delivery history deleted)
- **Test**: "Send test event" button to verify endpoint is working

---
## Settings — Audit Log

Security and compliance event history.

```
┌──────────────────────────────────────────────────────────────┐
│ Audit log                                                    │
│ [Search events...]  [Actor ▾]  [Action ▾]  [Date range ▾]   │
│ TIMESTAMP           ACTOR          ACTION          TARGET    │
│ Mar 20, 14:32 UTC   [Av] Jane D.  Deleted token   "CI/CD"  │
│ Mar 20, 14:30 UTC   [Av] Jane D.  Updated role    @john →   │
│                                                    Member    │
│ Mar 20, 09:15 UTC   [Av] John S.  Logged in       —         │
│                                    from Paris, FR            │
│ Mar 19, 18:42 UTC   System        Renewed plan    Pro Plan  │
│ Mar 19, 16:00 UTC   [Av] Alice M. Invited user    bob@ex…   │
│ Mar 19, 10:23 UTC   [Av] Jane D.  Enabled 2FA     —         │
│ Showing 6 of 1,247 events              [← 1 2 3 ... 42 →]  │
└──────────────────────────────────────────────────────────────┘
```

**Event detail (click on row to expand):**

```
┌──────────────────────────────────────────────────────────────┐
│ Event detail                                                 │
│ Action       Deleted token                                   │
│ Actor        Jane Doe (jane@example.com)                     │
│ Timestamp    Mar 20, 2026 14:32:15 UTC                       │
│ IP address   203.0.113.42                                    │
│ User agent   Chrome 122 · macOS 15.3                         │
│ Target       API token "CI/CD" (sk-ci-••••8b1c)             │
│ Changes      status: active → deleted                        │
│                                              [Export JSON]   │
└──────────────────────────────────────────────────────────────┘
```

**Elements:**
- **Columns**: timestamp (precise UTC), actor (avatar + name), action (verb), target (resource affected)
- **Filters**: search (free text), actor (dropdown of team members + "System"), action type (dropdown), date range
- **Pagination**: numbered pages, not infinite scroll (audit = precision, need to jump to specific period)
- **Export**: CSV or JSON export of filtered results (for compliance reporting)
- **Retention**: display retention period ("Events retained for 90 days" or "1 year" depending on plan)

**Event types to log (standard):**
- Authentication: login, logout, failed login, 2FA enabled/disabled, password changed
- Team: member invited, member removed, role changed
- Security: API token created/deleted, webhook created/deleted, session revoked
- Billing: plan changed, payment method updated, invoice generated
- Data: workspace settings changed, resource deleted

**Conventions:**
- **Timestamps**: always UTC, precise to the second (not relative — audit needs precision)
- **Actor "System"**: for automated events (plan renewal, scheduled deletion, system alerts) — use a distinct system icon, not an avatar
- **IP address and user agent**: shown in detail view, not in list (privacy consideration)
- **Immutable**: audit log entries cannot be edited or deleted by any user (compliance requirement)
- **Read-only for non-admins**: only Admin role can view audit log (or a dedicated "Auditor" role)

**Empty state:**
- "No events recorded yet" + brief explanation of what the audit log tracks
