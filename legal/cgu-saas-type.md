# CGU SaaS — Modèle type

Guide de rédaction des Conditions Générales d'Utilisation pour un SaaS sous droit français. Orienté développeur indépendant (micro-entreprise ou SAS/SASU).

## Différence CGU vs CGV

| Aspect | CGU | CGV |
|--------|-----|-----|
| Objet | Règles d'utilisation du service | Conditions de vente (prix, paiement, livraison) |
| Obligatoire | Non légalement, mais indispensable en pratique | Oui pour la vente aux consommateurs (art. L441-1 C. com.) |
| Public | Tous les utilisateurs (gratuits inclus) | Clients payants uniquement |
| Contenu clé | Accès, comportement, propriété intellectuelle | Prix, facturation, remboursement, rétractation |
| Recommandation SaaS | Toujours publier | Intégrer dans les CGU ou publier séparément si offre payante |

Pour un SaaS freemium : CGU couvrant tout le monde + section dédiée aux conditions commerciales, ou CGU + CGV séparées.

## Structure type des CGU SaaS

### Sections obligatoires ou fortement recommandées

| # | Section | Contenu clé |
|---|---------|-------------|
| 1 | Objet | Description du service, périmètre des CGU |
| 2 | Définitions | Termes clés (Service, Utilisateur, Compte, Contenu, etc.) |
| 3 | Accès au service | Inscription, conditions d'éligibilité, création de compte |
| 4 | Description du service | Fonctionnalités, limites, niveaux (free/premium) |
| 5 | Obligations de l'utilisateur | Usage licite, interdictions, responsabilité du compte |
| 6 | Propriété intellectuelle | Droits sur le service, licence d'utilisation, contenu utilisateur |
| 7 | Données personnelles | Résumé + renvoi vers politique de confidentialité |
| 8 | Disponibilité et SLA | Engagement de disponibilité, maintenance, force majeure |
| 9 | Limitation de responsabilité | Plafonnement, exclusions, cas de force majeure |
| 10 | Suspension et résiliation | Motifs, procédure, effets (suppression données) |
| 11 | Modification des CGU | Procédure de notification, délai d'acceptation |
| 12 | Loi applicable et litiges | Droit français, juridiction, médiation consommateur |
| 13 | Contact | Coordonnées de l'éditeur |

## Clauses essentielles — détail

### Objet et accès

- Décrire le service de manière suffisamment large pour couvrir les évolutions.
- Préciser l'âge minimum (13 ou 16 ans selon la base légale RGPD choisie).
- Mentionner que l'inscription vaut acceptation des CGU.

### Obligations de l'utilisateur

- Fournir des informations exactes et à jour.
- Ne pas partager ses identifiants.
- Ne pas utiliser le service à des fins illicites.
- Ne pas tenter de contourner les mesures de sécurité.
- Respecter les droits de propriété intellectuelle.

### Propriété intellectuelle

- Le service (code, design, marques) reste la propriété de l'éditeur.
- L'utilisateur conserve la propriété de ses contenus.
- L'utilisateur accorde une licence limitée pour le fonctionnement du service.
- Prévoir une clause sur le contenu généré par IA si applicable.

### Limitation de responsabilité

- Plafonner les dommages au montant payé sur les 12 derniers mois.
- Exclure les dommages indirects (perte de profit, perte de données).
- Rappel : les clauses abusives sont réputées non écrites pour les consommateurs (art. L212-1 C. conso.).

### Résiliation

- Résiliation par l'utilisateur : à tout moment, depuis le compte.
- Résiliation par l'éditeur : en cas de manquement, avec préavis raisonnable.
- Sort des données après résiliation : délai de récupération (30 jours recommandé), puis suppression.

## Spécificités SaaS

### Niveaux de service (SLA)

| Niveau | Disponibilité | Indemnisation type |
|--------|---------------|--------------------|
| Standard | 99,5 % / mois | Avoir au prorata |
| Premium | 99,9 % / mois | Avoir + pénalités contractuelles |
| Pas de SLA | "Meilleur effort" | Aucune — adapté au gratuit/freemium |

Recommandation indie dev : ne pas s'engager sur un SLA sauf offre enterprise. Rester sur "meilleur effort" avec transparence sur la page de statut.

### Modification des conditions

- Notifier les utilisateurs au moins 30 jours avant l'entrée en vigueur.
- Notification par email + bandeau in-app.
- L'utilisation après la date d'effet vaut acceptation.
- Prévoir un droit de résiliation sans frais si modification substantielle.

### Suspension de compte

Motifs légitimes de suspension immédiate :
- Violation des CGU.
- Activité frauduleuse ou illicite.
- Non-paiement (après relance).
- Risque de sécurité pour le service ou les autres utilisateurs.

## Pièges courants à éviter

| Piège | Conséquence | Solution |
|-------|-------------|----------|
| Clause de modification unilatérale sans préavis | Clause abusive (art. R212-1 C. conso.) | Préavis 30 jours + droit de résiliation |
| Exonération totale de responsabilité | Réputée non écrite pour les consommateurs | Plafonner plutôt qu'exclure |
| Pas de mention de la médiation | Amende jusqu'à 15 000 € (art. L616-1 C. conso.) | Nommer un médiateur agréé |
| CGU uniquement en anglais pour des utilisateurs français | Non opposable | Proposer une version française |
| Pas de procédure de réclamation | Non-conformité LCEN | Prévoir un email/formulaire de contact |
| Clause attributive de compétence vs consommateur | Clause abusive | Le consommateur peut saisir son tribunal |

## Articles de loi pertinents

| Texte | Référence | Objet |
|-------|-----------|-------|
| LCEN | Loi n°2004-575 du 21 juin 2004 | Obligations de l'éditeur, mentions légales |
| Code de la consommation | Art. L111-1 et suivants | Information précontractuelle |
| Code de la consommation | Art. L221-1 et suivants | Droit de rétractation (14 jours) |
| Code de la consommation | Art. L212-1 | Clauses abusives |
| Code civil | Art. 1170 | Interdiction de vider l'obligation essentielle |
| RGPD | Règlement (UE) 2016/679 | Protection des données personnelles |

## Checklist de validation avant publication

- [ ] Les CGU sont rédigées en français (si public français).
- [ ] L'identité complète de l'éditeur est mentionnée.
- [ ] Le mécanisme d'acceptation est clair (case à cocher, pas pré-cochée).
- [ ] Les obligations de chaque partie sont équilibrées.
- [ ] La clause de limitation de responsabilité est raisonnable.
- [ ] La politique de données personnelles est référencée.
- [ ] La procédure de résiliation est décrite.
- [ ] La procédure de modification des CGU prévoit un préavis.
- [ ] Un médiateur de la consommation est désigné (si B2C).
- [ ] Le droit de rétractation est mentionné (si applicable, 14 jours).
- [ ] La loi applicable et la juridiction compétente sont précisées.
- [ ] Les CGU sont accessibles depuis toutes les pages (lien en footer).
- [ ] La date de dernière mise à jour est visible.
- [ ] Un versionnage des CGU est en place (archiver chaque version).
