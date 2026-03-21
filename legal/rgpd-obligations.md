# RGPD — Obligations pour un SaaS

Guide pratique de conformité RGPD (Règlement (UE) 2016/679) pour un développeur SaaS indépendant sous droit français. Orienté implémentation technique et organisationnelle.

## Les 6 bases légales

| Base légale | Usage typique SaaS | Exemple |
|-------------|---------------------|---------|
| **Consentement** (art. 6.1.a) | Marketing, cookies non essentiels, newsletter | Bandeau cookies, case opt-in newsletter |
| **Exécution du contrat** (art. 6.1.b) | Fonctionnement du service souscrit | Traitement des données pour fournir le service |
| **Obligation légale** (art. 6.1.c) | Facturation, conservation fiscale | Conserver les factures 10 ans |
| **Intérêt légitime** (art. 6.1.f) | Analytics, sécurité, lutte anti-fraude | Logs de sécurité, détection d'anomalies |
| **Intérêt vital** (art. 6.1.d) | Rarement applicable en SaaS | Urgence médicale |
| **Mission d'intérêt public** (art. 6.1.e) | Non applicable pour un SaaS privé | — |

### Recommandation par traitement

| Traitement | Base légale recommandée |
|------------|------------------------|
| Création de compte | Exécution du contrat |
| Envoi d'emails transactionnels | Exécution du contrat |
| Newsletter / marketing | Consentement |
| Cookies analytics (Matomo, etc.) | Intérêt légitime (si anonymisation) ou consentement |
| Cookies tiers (GA, Facebook) | Consentement |
| Logs de sécurité | Intérêt légitime |
| Facturation | Obligation légale |
| Support client | Exécution du contrat |

## Registre des traitements (art. 30)

Obligatoire pour toute entreprise, même micro-entreprise (si traitement non occasionnel). Documenter pour chaque traitement :

| Champ | Exemple |
|-------|---------|
| Nom du traitement | Gestion des comptes utilisateurs |
| Finalité | Permettre l'accès et l'utilisation du service |
| Base légale | Exécution du contrat |
| Catégories de personnes | Utilisateurs inscrits |
| Catégories de données | Email, nom, prénom, mot de passe hashé |
| Destinataires | Hébergeur (OVH), service email (Resend) |
| Transferts hors UE | Oui/Non — si oui, mécanisme (CCT, adéquation) |
| Durée de conservation | 3 ans après dernière activité |
| Mesures de sécurité | Chiffrement, hashing bcrypt, HTTPS |

Format recommandé : tableur ou JSON versionné dans le repo.

## Droits des personnes — implémentation technique

### Table récapitulative

| Droit | Article | Délai de réponse | Implémentation |
|-------|---------|-------------------|----------------|
| Accès | Art. 15 | 1 mois | Export JSON/CSV depuis le dashboard |
| Rectification | Art. 16 | 1 mois | Formulaire de modification du profil |
| Effacement | Art. 17 | 1 mois | Bouton "supprimer mon compte" + purge DB |
| Portabilité | Art. 20 | 1 mois | Export dans un format structuré (JSON) |
| Opposition | Art. 21 | 1 mois | Désinscription newsletter + opt-out analytics |
| Limitation | Art. 18 | 1 mois | Gel du compte (données conservées mais non traitées) |

### Bonnes pratiques techniques

- Prévoir un endpoint API `/api/user/export` pour l'accès et la portabilité.
- Implémenter un soft-delete avec purge différée (30 jours) pour l'effacement.
- Logger chaque demande de droit dans un registre dédié (date, type, statut).
- Prévoir une adresse email dédiée : `dpo@monservice.com` ou `privacy@monservice.com`.
- Vérifier l'identité du demandeur avant de répondre (email de confirmation).

## Durées de conservation

| Type de donnée | Durée recommandée | Justification |
|----------------|-------------------|---------------|
| Compte utilisateur actif | Durée de la relation | Exécution du contrat |
| Compte inactif | 3 ans après dernière activité | CNIL — recommandation |
| Données après suppression de compte | 30 jours (soft delete) | Permettre la récupération |
| Factures et données comptables | 10 ans | Art. L123-22 C. com. |
| Logs de connexion (hébergeur) | 1 an | LCEN art. 6-II |
| Logs applicatifs | 6 mois | Intérêt légitime (sécurité) |
| Cookies consentement (preuve) | 6 mois à 1 an | Recommandation CNIL |
| Données de prospect (non-client) | 3 ans après dernier contact | CNIL — recommandation |
| Contenu utilisateur après résiliation | 30 jours puis suppression | Obligation contractuelle |

## Sous-traitants et DPA

### Obligations (art. 28)

Tout sous-traitant traitant des données personnelles pour le compte du SaaS doit signer un **Data Processing Agreement (DPA)**.

### Clauses obligatoires du DPA

- [ ] Objet et durée du traitement.
- [ ] Nature et finalité du traitement.
- [ ] Types de données personnelles et catégories de personnes concernées.
- [ ] Obligations et droits du responsable de traitement.
- [ ] Le sous-traitant ne traite les données que sur instruction documentée.
- [ ] Obligation de confidentialité du personnel.
- [ ] Mesures de sécurité techniques et organisationnelles (art. 32).
- [ ] Conditions de recours à un sous-traitant ultérieur.
- [ ] Assistance pour les droits des personnes concernées.
- [ ] Suppression ou restitution des données en fin de contrat.
- [ ] Mise à disposition des informations pour audits.
- [ ] Notification en cas de violation de données.

### Sous-traitants courants d'un SaaS indie

| Service | Rôle | DPA disponible |
|---------|------|----------------|
| Vercel / Netlify | Hébergement | Oui (en ligne) |
| OVH / Scaleway | Hébergement | Oui |
| AWS / GCP | Infrastructure | Oui (CCT incluses) |
| Resend / Postmark | Email transactionnel | Oui |
| Stripe | Paiement | Oui |
| Paddle / Lemon Squeezy | MoR + paiement | Oui |
| Sentry | Monitoring erreurs | Oui |

## Transferts hors UE (post-Schrems II)

| Mécanisme | Usage | Remarques |
|-----------|-------|-----------|
| Décision d'adéquation | Pays reconnus (UK, Suisse, Japon, Corée, USA via DPF) | Le plus simple |
| Data Privacy Framework (DPF) | Transferts vers les USA | Vérifier que le fournisseur est certifié DPF |
| Clauses contractuelles types (CCT) | Tout pays tiers | Version 2021 obligatoire |
| Règles d'entreprise contraignantes (BCR) | Grands groupes | Non applicable indie dev |

Recommandation : privilégier des hébergeurs UE (OVH, Scaleway, Hetzner) pour éviter la question.

## Consentement cookies — règles CNIL

### Catégories de cookies

| Catégorie | Consentement requis | Exemples |
|-----------|---------------------|----------|
| Strictement nécessaires | Non | Session, CSRF, préférences cookies |
| Analytics first-party anonymisés | Non (si exempté CNIL) | Matomo configuré sans cookies |
| Analytics avec cookies | Oui | Google Analytics, Plausible (avec cookies) |
| Marketing / publicitaire | Oui | Facebook Pixel, Google Ads |
| Réseaux sociaux | Oui | Boutons de partage, embeds |

### Règles d'implémentation

- Consentement libre, spécifique, éclairé et univoque.
- Refuser doit être aussi simple qu'accepter (pas de dark pattern).
- Pas de cookie wall bloquant l'accès au service.
- Durée de validité du consentement : 13 mois maximum.
- Durée de vie des cookies : 13 mois maximum.
- Conserver la preuve du consentement.

## Notification de violation (art. 33-34)

### Procédure

| Étape | Délai | Action |
|-------|-------|--------|
| Détection | T+0 | Identifier la nature et l'étendue de la violation |
| Notification CNIL | 72h max | Via notifications.cnil.fr |
| Notification personnes | Sans délai injustifié | Si risque élevé pour les droits et libertés |
| Documentation | Continue | Registre des violations (même sans notification) |

### Contenu de la notification CNIL

- Nature de la violation (confidentialité, intégrité, disponibilité).
- Catégories et nombre approximatif de personnes concernées.
- Coordonnées du DPO ou point de contact.
- Conséquences probables.
- Mesures prises ou envisagées.

## DPO — quand est-il obligatoire ?

Un DPO est **obligatoire** si :
- Organisme public.
- Activité de base impliquant un suivi régulier et systématique à grande échelle.
- Traitement à grande échelle de données sensibles.

Pour un SaaS indie : **généralement pas obligatoire**, mais recommandé de désigner un point de contact vie privée.

## Checklist RGPD complète pour un SaaS

- [ ] Identifier et documenter tous les traitements (registre art. 30).
- [ ] Définir une base légale pour chaque traitement.
- [ ] Rédiger et publier une politique de confidentialité.
- [ ] Désigner un point de contact vie privée.
- [ ] Implémenter l'export de données (accès + portabilité).
- [ ] Implémenter la suppression de compte (effacement).
- [ ] Prévoir une procédure de réponse aux demandes (1 mois max).
- [ ] Chiffrer les données en transit (HTTPS/TLS).
- [ ] Hasher les mots de passe (bcrypt/argon2, jamais MD5/SHA1).
- [ ] Documenter les mesures de sécurité (art. 32).
- [ ] Prévoir une procédure de notification de violation (72h).
- [ ] Vérifier que chaque sous-traitant a un DPA signé.
- [ ] Vérifier les mécanismes de transfert hors UE.
- [ ] Implémenter un bandeau cookies conforme CNIL.
- [ ] Conserver les preuves de consentement.
- [ ] Maintenir un registre des violations (même vide).
