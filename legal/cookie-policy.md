# Politique de cookies — Modèle SaaS

Guide de rédaction d'une politique de cookies conforme au RGPD et à la directive ePrivacy pour un SaaS sous droit français. Orienté développeur indépendant (micro-entreprise ou SAS/SASU).

## Définition d'un cookie

Un cookie est un petit fichier texte déposé sur le terminal de l'utilisateur (ordinateur, smartphone, tablette) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur la visite (préférences, session, statistiques).

Par extension, cette politique couvre également les technologies similaires : pixels, balises web (web beacons), stockage local (localStorage, sessionStorage), fingerprinting.

### Base légale

| Texte | Référence | Objet |
|-------|-----------|-------|
| RGPD | Règlement (UE) 2016/679 | Protection des données personnelles |
| Directive ePrivacy | Directive 2002/58/CE (art. 5.3) | Consentement pour le stockage d'informations sur le terminal |
| Loi Informatique et Libertés | Art. 82 | Transposition de la directive ePrivacy en droit français |
| Lignes directrices CNIL | Délibération n°2020-091 du 17 sept. 2020 | Modalités de recueil du consentement cookies |
| Recommandation CNIL | Délibération n°2020-092 du 17 sept. 2020 | Recommandation pratique sur les cookies |

### Principe : consentement préalable

- Les cookies **strictement nécessaires** au fonctionnement du service sont exemptés de consentement.
- Tous les autres cookies (analytics, marketing, fonctionnels non essentiels) nécessitent le **consentement préalable** de l'utilisateur.
- Aucun cookie non essentiel ne doit être déposé avant le recueil du consentement.

## Cookies utilisés par catégorie

### Cookies strictement nécessaires

Exemptés de consentement (art. 82 LIL). Indispensables au fonctionnement du service.

| Nom | Finalité | Durée | Émetteur |
|-----|----------|-------|----------|
| `session_id` | Maintien de la session utilisateur | Session (supprimé à la fermeture du navigateur) | Première partie |
| `csrf_token` | Protection contre les attaques CSRF | Session | Première partie |
| `cookie_consent` | Mémorisation du choix de l'utilisateur concernant les cookies | 6 mois | Première partie |
| `locale` | Langue et préférences régionales | 12 mois | Première partie |

### Cookies fonctionnels

Améliorent l'expérience mais ne sont pas strictement nécessaires. **Consentement requis**.

| Nom | Finalité | Durée | Émetteur |
|-----|----------|-------|----------|
| `theme` | Préférence de thème (clair/sombre) | 12 mois | Première partie |
| `sidebar_state` | État du menu latéral (ouvert/fermé) | 12 mois | Première partie |
| `onboarding_done` | Indique que l'onboarding a été complété | Permanent | Première partie |

### Cookies analytiques

Permettent de mesurer l'audience et d'améliorer le service. **Consentement requis** sauf exception CNIL.

| Nom | Finalité | Durée | Émetteur | Consentement |
|-----|----------|-------|----------|-------------|
| Plausible | Mesure d'audience sans cookies | — | Plausible Analytics | **Exempté** (pas de cookie, pas de données personnelles) |
| PostHog (self-hosted) | Analytics produit, funnels, sessions | 12 mois | Première partie (self-hosted) | Oui (sauf si anonymisation totale) |
| `_ga`, `_gid` | Mesure d'audience Google Analytics | 13 mois / 24h | Google LLC | **Oui** (cookie tiers, transfert US) |
| `_pk_id`, `_pk_ses` | Mesure d'audience Matomo (self-hosted) | 13 mois / 30 min | Première partie | Exempté sous conditions CNIL* |

*Matomo self-hosted avec anonymisation IP et sans croisement de données peut bénéficier de l'exemption CNIL (recommandation de sept. 2020).

### Cookies marketing / publicitaires

Utilisés pour le ciblage publicitaire et le suivi inter-sites. **Consentement requis**.

| Nom | Finalité | Durée | Émetteur |
|-----|----------|-------|----------|
| `_fbp` | Pixel Facebook, mesure de conversions | 3 mois | Meta Platforms |
| `_gcl_au` | Suivi de conversions Google Ads | 3 mois | Google LLC |
| Pixel LinkedIn | Attribution marketing B2B | Session | LinkedIn |

Recommandation indie dev : **éviter les cookies marketing** sauf besoin avéré de campagnes publicitaires. Privilégier les analytics respectueux de la vie privée (Plausible, Matomo self-hosted).

### Cookies tiers spécifiques

| Service | Cookies | Finalité | Consentement |
|---------|---------|----------|-------------|
| **Stripe** | `__stripe_mid`, `__stripe_sid` | Prévention de la fraude lors du paiement | Exemptés (strictement nécessaires au paiement) |
| **Crisp** (chat) | `crisp-client/*` | Widget de support en ligne | Oui |
| **YouTube** (embed) | `VISITOR_INFO1_LIVE`, `YSC` | Lecture de vidéos intégrées | Oui (utiliser `youtube-nocookie.com` pour limiter) |

## Gestion du consentement

### Bandeau cookies

Le bandeau de consentement doit :

| Exigence | Détail |
|----------|--------|
| Apparaître au premier accès | Avant tout dépôt de cookie non essentiel |
| Permettre d'accepter | Bouton "Accepter tout" |
| Permettre de refuser | Bouton "Refuser tout" — **aussi visible et accessible** que le bouton d'acceptation |
| Permettre de paramétrer | Lien "Personnaliser" ou "Gérer mes préférences" |
| Ne pas utiliser de dark patterns | Pas de case pré-cochée, pas de bouton "refuser" caché ou grisé |
| Informer clairement | Finalités résumées, lien vers la politique complète |
| Être réaffichable | Lien "Gérer les cookies" accessible depuis le footer |

### Paramétrage par catégorie

L'utilisateur doit pouvoir accepter ou refuser chaque catégorie indépendamment :

```
☑ Cookies strictement nécessaires (toujours actifs)
☐ Cookies fonctionnels
☐ Cookies analytiques
☐ Cookies marketing
```

### Retrait du consentement

- L'utilisateur peut retirer son consentement **à tout moment**.
- Le retrait doit être **aussi simple** que le consentement initial.
- Après retrait : suppression des cookies concernés et arrêt de la collecte.
- Le retrait ne remet pas en cause la licéité du traitement effectué avant celui-ci.

### Preuve du consentement

- Conserver une preuve du consentement (date, heure, choix effectué, version de la politique).
- Durée de conservation de la preuve : recommandation de 6 mois après le retrait du consentement.
- Outils recommandés : Tarteaucitron, Axeptio, CookieYes (gratuit), ou solution custom avec stockage côté serveur.

### Durée de validité du consentement

- La CNIL recommande de **redemander le consentement tous les 6 mois** (pas d'obligation légale stricte, mais bonne pratique).
- En cas de modification des finalités ou ajout de nouveaux cookies : re-consentement obligatoire.

## Solutions de gestion des cookies recommandées

| Solution | Type | Gratuit | Conformité CNIL | Hébergement |
|----------|------|---------|-----------------|-------------|
| **Tarteaucitron** | Open source | Oui | Oui | Self-hosted |
| **Axeptio** | SaaS | Freemium | Oui | France |
| **CookieYes** | SaaS | Freemium | Oui | Cloud |
| **Klaro** | Open source | Oui | Oui | Self-hosted |
| **Custom** | Maison | — | À valider | Self-hosted |

Recommandation indie dev : **Tarteaucitron** (open source, léger, conforme CNIL) ou **Plausible** (analytics sans cookies, élimine le besoin de bandeau pour l'analytics).

## Paramétrage navigateur

```markdown
## Gestion des cookies via votre navigateur

Vous pouvez également gérer les cookies directement depuis votre navigateur :

- **Chrome** : Paramètres > Confidentialité et sécurité > Cookies et autres données de site
- **Firefox** : Paramètres > Vie privée et sécurité > Cookies et données de site
- **Safari** : Préférences > Confidentialité > Cookies et données de site web
- **Edge** : Paramètres > Cookies et autorisations de site

Attention : la suppression ou le blocage de certains cookies peut affecter le
fonctionnement du service.
```

## Modification de la politique

```markdown
## Modification de la politique de cookies

Cette politique peut être mise à jour pour refléter les évolutions du service
ou de la réglementation. En cas de modification substantielle (ajout de
nouvelles catégories de cookies, changement de finalités), nous vous en
informerons via le bandeau de consentement.

Dernière mise à jour : [JJ/MM/AAAA]
```

## Contact

```markdown
## Contact

Pour toute question relative aux cookies :
- Email : [dpo@monservice.com]
- Adresse postale : [Adresse]

Pour exercer vos droits sur les données personnelles collectées via les cookies,
consultez notre Politique de confidentialité.
```

## Checklist de validation avant publication

- [ ] La politique est accessible via un lien dédié (footer ou page cookies).
- [ ] Toutes les catégories de cookies sont listées avec nom, finalité, durée et émetteur.
- [ ] La distinction cookies essentiels / non essentiels est claire.
- [ ] Le bandeau de consentement apparaît au premier accès.
- [ ] Le bouton "Refuser" est aussi visible que le bouton "Accepter".
- [ ] Aucun cookie non essentiel n'est déposé avant consentement.
- [ ] L'utilisateur peut modifier ses choix à tout moment.
- [ ] Les preuves de consentement sont conservées.
- [ ] Les cookies tiers sont identifiés avec leur émetteur.
- [ ] Le lien "Gérer les cookies" est accessible depuis le footer.
- [ ] La date de dernière mise à jour est visible.

## Voir aussi

- **Read** [`privacy-policy.md`](privacy-policy.md) — Politique de confidentialité
- **Read** [`rgpd-obligations.md`](rgpd-obligations.md) — Checklist des obligations RGPD pour un SaaS
- **Read** [`mentions-legales.md`](mentions-legales.md) — Mentions légales obligatoires
