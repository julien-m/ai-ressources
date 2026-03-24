# Politique de confidentialité — Modèle SaaS

Guide de rédaction d'une politique de confidentialité conforme au RGPD pour un SaaS sous droit français. Orienté développeur indépendant (micro-entreprise ou SAS/SASU).

## Responsable du traitement

Le responsable du traitement est l'entité qui détermine les finalités et les moyens du traitement des données personnelles.

| Information | Contenu |
|-------------|---------|
| Identité | [Prénom Nom] ou [Dénomination sociale] |
| Statut juridique | Micro-entrepreneur / SAS au capital de [X] € |
| SIRET | [XXX XXX XXX XXXXX] |
| Adresse | [Adresse du siège social] |
| Email | [dpo@monservice.com] ou [contact@monservice.com] |
| Téléphone | [+33 X XX XX XX XX] |

### DPO (Délégué à la Protection des Données)

La désignation d'un DPO est **obligatoire** si :
- Traitement à grande échelle de données sensibles.
- Suivi régulier et systématique des personnes à grande échelle.
- Organisme public.

Pour un SaaS indie : rarement obligatoire, mais recommandé de désigner un point de contact dédié (peut être le dirigeant lui-même).

```markdown
## Responsable du traitement

[Prénom Nom / Dénomination sociale]
[Adresse]
Email : [contact@monservice.com]

Délégué à la protection des données (ou contact dédié) : [dpo@monservice.com]
```

## Données collectées

### Par catégorie

| Catégorie | Données | Collecte |
|-----------|---------|----------|
| **Compte utilisateur** | Email, nom, prénom, mot de passe (hashé), avatar (optionnel) | Inscription |
| **Profil** | Préférences, langue, fuseau horaire, paramètres de notification | Utilisation du service |
| **Données d'usage** | Pages visitées, fonctionnalités utilisées, fréquence de connexion, actions effectuées | Automatique |
| **Données techniques** | Adresse IP, type de navigateur, OS, résolution d'écran, identifiant de session | Automatique |
| **Données de paiement** | Derniers chiffres de la carte, type de carte, pays de facturation | Via prestataire de paiement (Stripe) |
| **Communications** | Messages de support, contenu des demandes | Interaction avec le support |
| **Contenu utilisateur** | Données saisies dans le service (projets, fichiers, textes, etc.) | Utilisation du service |

### Données sensibles

En principe, un SaaS standard ne collecte **pas** de données sensibles (art. 9 RGPD) : origine raciale/ethnique, opinions politiques, convictions religieuses, données de santé, orientation sexuelle, données biométriques.

Si le service peut contenir des données sensibles saisies par l'utilisateur (ex : outil de notes, CRM santé), le mentionner explicitement et prévoir des mesures renforcées.

### Données des mineurs

- Préciser l'âge minimum d'inscription (16 ans en France pour le consentement RGPD, ou 13 ans avec consentement parental).
- Ne pas collecter sciemment de données de mineurs en dessous de cet âge.

## Bases légales du traitement

| Traitement | Base légale | Justification |
|------------|-------------|---------------|
| Création et gestion du compte | Exécution du contrat (art. 6.1.b) | Nécessaire pour fournir le service souscrit |
| Fourniture du service | Exécution du contrat (art. 6.1.b) | Traitement des données pour le fonctionnement du service |
| Emails transactionnels | Exécution du contrat (art. 6.1.b) | Confirmation d'inscription, réinitialisation de mot de passe, notifications liées au service |
| Newsletter / marketing | Consentement (art. 6.1.a) | Opt-in explicite requis, retrait possible à tout moment |
| Analytics et amélioration du service | Intérêt légitime (art. 6.1.f) | Comprendre l'usage pour améliorer le produit — si analytics respectueux de la vie privée (Plausible, PostHog) |
| Analytics tiers (Google Analytics) | Consentement (art. 6.1.a) | Dépôt de cookies tiers, consentement préalable obligatoire |
| Logs de sécurité | Intérêt légitime (art. 6.1.f) | Détection d'intrusions, protection du service et des utilisateurs |
| Facturation et comptabilité | Obligation légale (art. 6.1.c) | Conservation des factures pendant 10 ans (art. L123-22 C. com.) |
| Lutte contre la fraude | Intérêt légitime (art. 6.1.f) | Prévention des abus, protection des utilisateurs |
| Support client | Exécution du contrat (art. 6.1.b) | Traitement des demandes liées au service |

## Finalités du traitement

Lister chaque finalité de manière explicite et spécifique. Ne pas utiliser de formulations vagues ("améliorer l'expérience").

| Finalité | Description |
|----------|-------------|
| Fournir et maintenir le service | Gestion des comptes, accès aux fonctionnalités, stockage des données utilisateur |
| Gérer la relation client | Réponse aux demandes de support, communication transactionnelle |
| Traiter les paiements | Gestion des abonnements, facturation, remboursements |
| Améliorer le service | Analyse de l'usage pour développer de nouvelles fonctionnalités et corriger les bugs |
| Assurer la sécurité | Prévention des fraudes, détection d'anomalies, protection des données |
| Respecter les obligations légales | Conservation comptable, réponse aux réquisitions judiciaires |
| Communiquer sur le service | Newsletter et mises à jour produit (uniquement avec consentement) |

## Destinataires et sous-traitants

### Sous-traitants (art. 28 RGPD)

Un contrat de sous-traitance (DPA — Data Processing Agreement) doit être signé avec chaque sous-traitant.

| Sous-traitant | Finalité | Données concernées | Localisation | DPA |
|---------------|----------|--------------------|--------------|----|
| **Hébergeur** (ex : OVH, Scaleway, Vercel) | Hébergement de l'infrastructure | Toutes les données | France / UE | Oui |
| **Paiement** (ex : Stripe) | Traitement des paiements | Données de facturation, email | UE + US (CCT) | Oui |
| **Email transactionnel** (ex : Resend, Postmark) | Envoi d'emails | Email, nom | US (CCT) | Oui |
| **Analytics** (ex : Plausible, PostHog) | Mesure d'audience | Données d'usage anonymisées | UE | Oui |
| **Support** (ex : Crisp, Intercom) | Chat et tickets | Email, nom, contenu des échanges | UE / US (CCT) | Oui |
| **Monitoring** (ex : Sentry) | Détection d'erreurs | Données techniques, IP | US (CCT) | Oui |

### Autres destinataires

- **Autorités publiques** : sur réquisition judiciaire ou obligation légale.
- **Prestataire de médiation** : en cas de litige consommateur.

### Aucune vente de données

Les données personnelles ne sont **jamais** vendues, louées ou partagées à des tiers à des fins commerciales.

## Transferts hors UE

Lorsqu'un sous-traitant est situé hors de l'Espace Économique Européen (EEE), un mécanisme de protection est requis (art. 44-49 RGPD).

| Mécanisme | Condition | Exemples |
|-----------|-----------|----------|
| **Décision d'adéquation** (art. 45) | Le pays offre un niveau de protection équivalent | Suisse, Royaume-Uni, Japon, Corée du Sud |
| **Data Privacy Framework** (DPF) | Entreprise US certifiée DPF | Stripe, Vercel, Sentry (vérifier sur [dataprivacyframework.gov](https://www.dataprivacyframework.gov)) |
| **Clauses contractuelles types** (CCT, art. 46.2.c) | Clauses adoptées par la Commission européenne | Sous-traitants US non certifiés DPF |
| **Règles d'entreprise contraignantes** (BCR) | Groupes multinationaux | Rarement applicable pour un SaaS indie |

### Recommandation indie dev

- Privilégier des sous-traitants UE quand c'est possible.
- Pour les sous-traitants US : vérifier la certification DPF, sinon exiger les CCT.
- Documenter chaque transfert dans le registre des traitements.

## Durée de conservation

| Type de donnée | Durée de conservation | Justification |
|----------------|----------------------|---------------|
| Données du compte | Durée de l'abonnement + 3 ans après suppression | Prescription civile (art. 2224 C. civ.) |
| Données de facturation | 10 ans après la transaction | Obligation comptable (art. L123-22 C. com.) |
| Logs de sécurité | 12 mois | Recommandation CNIL + proportionnalité |
| Logs de connexion (adresse IP) | 12 mois | Obligation LCEN (décret n°2011-219) |
| Données d'usage / analytics | 25 mois maximum | Recommandation CNIL pour les cookies analytics |
| Contenu du support | Durée du compte + 1 an | Suivi qualité, résolution de litiges |
| Données de prospection | 3 ans après le dernier contact | Recommandation CNIL |
| Cookies de consentement (preuve) | 6 mois après le retrait | Preuve du consentement (charge de la preuve) |

### Suppression et anonymisation

- À l'expiration de la durée de conservation : suppression ou anonymisation irréversible.
- Suppression de compte par l'utilisateur : suppression des données dans un délai de 30 jours, sauf obligations légales de conservation (facturation).
- Les sauvegardes sont purgées selon un calendrier séparé (documenter le délai).

## Droits des personnes

### Table récapitulative

| Droit | Article RGPD | Contenu | Délai de réponse |
|-------|-------------|---------|------------------|
| **Accès** | Art. 15 | Obtenir une copie de ses données personnelles | 1 mois |
| **Rectification** | Art. 16 | Corriger des données inexactes ou incomplètes | 1 mois |
| **Suppression** (droit à l'oubli) | Art. 17 | Demander l'effacement de ses données | 1 mois |
| **Limitation** | Art. 18 | Geler le traitement de certaines données | 1 mois |
| **Portabilité** | Art. 20 | Recevoir ses données dans un format structuré (JSON, CSV) | 1 mois |
| **Opposition** | Art. 21 | S'opposer au traitement fondé sur l'intérêt légitime | 1 mois |
| **Retrait du consentement** | Art. 7.3 | Retirer son consentement à tout moment | Immédiat |
| **Directives post-mortem** | Loi Informatique et Libertés, art. 85 | Définir des directives sur le sort de ses données après son décès | — |

### Modalités d'exercice

```markdown
## Exercice de vos droits

Vous pouvez exercer vos droits par :
- Email : [dpo@monservice.com]
- Formulaire de contact : [URL]
- Courrier postal : [Adresse]

Nous vous répondrons dans un délai maximum d'un mois à compter de la réception
de votre demande. Ce délai peut être prolongé de deux mois en cas de complexité
ou de nombre élevé de demandes, sous réserve de vous en informer.

Une pièce d'identité pourra être demandée en cas de doute raisonnable sur
votre identité.
```

### Implémentation technique recommandée

| Droit | Implémentation |
|-------|----------------|
| Accès | Bouton "Exporter mes données" dans les paramètres du compte → export JSON/CSV |
| Rectification | Formulaire d'édition du profil |
| Suppression | Bouton "Supprimer mon compte" avec confirmation → suppression effective sous 30 jours |
| Portabilité | Export au format JSON ou CSV, incluant toutes les données fournies par l'utilisateur |
| Opposition marketing | Lien de désinscription dans chaque email |

## Cookies

Pour le détail des cookies utilisés, leur finalité et leur durée, consulter la **Politique de cookies**.

Mentionner dans la politique de confidentialité :
- Que le site utilise des cookies.
- Que certains cookies nécessitent le consentement préalable.
- Renvoyer vers la politique de cookies pour le détail.
- Indiquer comment modifier ses préférences.

## Sécurité des données

### Mesures techniques et organisationnelles (art. 32 RGPD)

| Catégorie | Mesure |
|-----------|--------|
| **Chiffrement** | HTTPS/TLS pour toutes les communications, chiffrement au repos des données sensibles |
| **Authentification** | Mots de passe hashés (bcrypt/argon2), 2FA disponible |
| **Contrôle d'accès** | Principe du moindre privilège, séparation des environnements (dev/staging/prod) |
| **Sauvegardes** | Sauvegardes chiffrées, régulières, testées, stockées dans un lieu distinct |
| **Monitoring** | Détection d'intrusion, alertes de sécurité, logs d'audit |
| **Mises à jour** | Dépendances et systèmes maintenus à jour, correctifs de sécurité appliqués |
| **Développement** | Revue de code, pas de secrets dans le code source, gestion sécurisée des credentials |
| **Organisationnel** | Sensibilisation, accès restreint aux données de production |

### En cas de violation de données (art. 33-34 RGPD)

- Notification à la CNIL dans les **72 heures** si risque pour les droits et libertés.
- Notification aux personnes concernées si risque élevé.
- Documentation de l'incident (nature, données concernées, mesures prises).

## Modification de la politique

```markdown
## Modification de la politique de confidentialité

Nous nous réservons le droit de modifier la présente politique à tout moment.
En cas de modification substantielle, nous vous en informerons par :
- Email à l'adresse associée à votre compte.
- Notification dans l'interface du service.

La date de dernière mise à jour est indiquée en haut de cette page.
L'utilisation du service après notification vaut acceptation de la politique
modifiée. En cas de désaccord, vous pouvez exercer votre droit de suppression
de compte.

Dernière mise à jour : [JJ/MM/AAAA]
```

## Contact et réclamation CNIL

```markdown
## Contact

Pour toute question relative à la protection de vos données personnelles :
- Email : [dpo@monservice.com]
- Adresse : [Adresse postale]

## Réclamation auprès de la CNIL

Si vous estimez que le traitement de vos données personnelles constitue une
violation du RGPD, vous avez le droit d'introduire une réclamation auprès
de la Commission Nationale de l'Informatique et des Libertés (CNIL) :

- En ligne : https://www.cnil.fr/fr/plaintes
- Par courrier : CNIL — 3 Place de Fontenoy — TSA 80715 — 75334 Paris Cedex 07
```

## Checklist de validation avant publication

- [ ] Le responsable du traitement est identifié avec ses coordonnées complètes.
- [ ] Toutes les catégories de données collectées sont listées.
- [ ] Chaque traitement a une base légale identifiée.
- [ ] Les finalités sont décrites de manière explicite et spécifique.
- [ ] Les sous-traitants sont listés avec leur localisation et le mécanisme de transfert.
- [ ] Les durées de conservation sont précisées par type de donnée.
- [ ] Les droits des personnes sont décrits avec les modalités d'exercice.
- [ ] Les mesures de sécurité sont mentionnées.
- [ ] La procédure de réclamation CNIL est présente.
- [ ] La politique est rédigée en langage clair et accessible.
- [ ] La politique est accessible depuis toutes les pages (lien en footer).
- [ ] La date de dernière mise à jour est visible.
- [ ] Un renvoi vers la politique de cookies est présent.

## Voir aussi

- **Read** [`rgpd-obligations.md`](rgpd-obligations.md) — Checklist des obligations RGPD pour un SaaS
- **Read** [`mentions-legales.md`](mentions-legales.md) — Mentions légales obligatoires
- **Read** [`cookie-policy.md`](cookie-policy.md) — Politique de cookies
