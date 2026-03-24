# CGV SaaS — Modèle type

Guide de rédaction des Conditions Générales de Vente pour un SaaS payant sous droit français. Orienté développeur indépendant (micro-entreprise ou SAS/SASU) avec abonnement en ligne.

## Différence CGV vs CGU

| Aspect | CGV | CGU |
|--------|-----|-----|
| Objet | Conditions commerciales (prix, paiement, livraison) | Règles d'utilisation du service |
| Obligatoire | Oui pour la vente aux consommateurs (art. L441-1 C. com.) | Non légalement, mais indispensable en pratique |
| Public | Clients payants | Tous les utilisateurs (y compris gratuits) |
| Contenu clé | Prix, facturation, rétractation, résiliation | Accès, comportement, propriété intellectuelle |
| Quand séparer | Recommandé si l'offre payante est distincte (plans, abonnement) | Toujours publier |

Pour un SaaS freemium : publier CGU (pour tous) + CGV séparées (pour les clients payants). Renvoi croisé entre les deux.

## Structure type des CGV SaaS

### 1. Objet et champ d'application

```markdown
## Objet

Les présentes Conditions Générales de Vente (ci-après "CGV") régissent les
conditions dans lesquelles [Dénomination / Prénom Nom] (ci-après "le Prestataire")
fournit le service [Nom du service] (ci-après "le Service") à tout client
souscrivant un abonnement payant (ci-après "le Client").

Les CGV s'appliquent à toute souscription d'abonnement passée via le site
[URL du service]. Elles prévalent sur tout autre document.

Toute souscription implique l'acceptation pleine et entière des présentes CGV.
```

### 2. Description du service

Décrire le service de manière suffisamment précise pour caractériser l'obligation du prestataire, mais suffisamment large pour couvrir les évolutions.

| Élément | Détail à inclure |
|---------|-----------------|
| Nature du service | SaaS accessible via navigateur web et/ou application |
| Fonctionnalités principales | Liste des fonctionnalités incluses dans l'offre payante |
| Différences entre plans | Tableau comparatif si plusieurs niveaux (Starter, Pro, Enterprise) |
| Prérequis techniques | Navigateur compatible, connexion internet |
| Disponibilité | 24h/24 sauf maintenance (renvoyer vers SLA si applicable) |

### 3. Conditions d'accès et d'inscription

- L'accès au Service payant nécessite la création préalable d'un compte utilisateur.
- Le Client déclare être majeur et capable juridiquement (ou représentant autorisé d'une personne morale).
- Les informations fournies doivent être exactes et tenues à jour.
- L'inscription vaut acceptation des CGV et des CGU.

### 4. Tarifs et modalités de paiement

#### Tarification

| Élément | Détail |
|---------|--------|
| Prix | Affichés en euros, TTC pour les consommateurs (B2C), HT pour les professionnels (B2B) |
| Plans | Détailler chaque plan avec ses limites et tarif |
| Révision des prix | Possible avec préavis de 30 jours avant la prochaine période de facturation |
| TVA | Applicable selon la localisation du client (autoliquidation UE, TVA française par défaut) |

#### Facturation

| Modalité | Détail |
|----------|--------|
| Fréquence | Mensuelle ou annuelle, selon le plan choisi |
| Date de facturation | À la date de souscription, puis à chaque échéance |
| Facturation annuelle | Paiement en une fois, remise de [X] % par rapport au mensuel |
| Factures | Émises automatiquement, accessibles dans l'espace client |

#### Moyens de paiement

| Moyen | Détail |
|-------|--------|
| Carte bancaire | Visa, Mastercard, American Express (via Stripe) |
| Prélèvement SEPA | Si proposé, via Stripe ou GoCardless |
| Autres | PayPal, virement bancaire (si applicable) |

Les données de paiement sont traitées directement par le prestataire de paiement (Stripe). Le Prestataire ne stocke aucune donnée bancaire complète.

#### Retard et défaut de paiement

- En cas d'échec du paiement : relance automatique à J+3, J+7, J+14.
- Après 3 tentatives infructueuses : suspension de l'accès au Service.
- Pénalités de retard (B2B) : taux BCE + 10 points, indemnité forfaitaire de 40 € (art. L441-10 C. com.).

### 5. Période d'essai

```markdown
## Période d'essai

Le Service peut proposer une période d'essai gratuite de [14] jours.

Pendant la période d'essai, le Client bénéficie de l'ensemble des
fonctionnalités du plan [Nom du plan].

À l'issue de la période d'essai :
- Si le Client souscrit un abonnement payant : la facturation démarre
  immédiatement.
- Si le Client ne souscrit pas : l'accès aux fonctionnalités payantes est
  désactivé. Le compte et les données sont conservés pendant [30] jours,
  puis supprimés.

Aucun moyen de paiement n'est requis pour démarrer l'essai [ou : un moyen
de paiement est requis mais aucun prélèvement n'est effectué pendant l'essai].
```

### 6. Droit de rétractation

#### Pour les consommateurs (B2C)

Le droit de rétractation de 14 jours (art. L221-18 C. conso.) s'applique à la vente en ligne, y compris pour les services numériques.

**Exception pour les services numériques** (art. L221-28, 13° C. conso.) : le consommateur peut renoncer à son droit de rétractation si :
1. Le consommateur a demandé expressément que l'exécution du service commence avant la fin du délai de rétractation.
2. Le consommateur a reconnu qu'il perdra son droit de rétractation une fois l'exécution commencée.

```markdown
## Droit de rétractation

Conformément à l'article L221-18 du Code de la consommation, vous disposez
d'un délai de 14 jours à compter de la souscription pour exercer votre droit
de rétractation, sans motif ni pénalité.

Toutefois, si vous avez demandé que l'exécution du Service commence
immédiatement et que vous avez expressément reconnu perdre votre droit de
rétractation, celui-ci ne pourra plus être exercé une fois le Service
pleinement exécuté.

Pour exercer votre droit de rétractation :
- Email : [contact@monservice.com]
- Formulaire de rétractation disponible en annexe

En cas de rétractation, le remboursement sera effectué dans un délai de
14 jours à compter de la réception de la demande, via le même moyen de
paiement que celui utilisé lors de la souscription.
```

| Situation | Rétractation possible ? |
|-----------|------------------------|
| Souscription sans exécution immédiate | Oui, 14 jours |
| Exécution immédiate demandée + renonciation expresse | Non, une fois le service pleinement exécuté |
| Essai gratuit (sans paiement) | Non applicable (pas de vente) |

#### Pour les professionnels (B2B)

Pas de droit de rétractation légal. Prévoir éventuellement une clause contractuelle de satisfaction ("satisfait ou remboursé 30 jours").

### 7. Durée et renouvellement de l'abonnement

| Modalité | Détail |
|----------|--------|
| Durée initiale | Mensuelle ou annuelle, selon le plan souscrit |
| Renouvellement | Tacite reconduction à chaque échéance |
| Notification de renouvellement | Email de rappel [15] jours avant l'échéance (obligation art. L215-1 C. conso. pour les consommateurs) |
| Changement de plan | Possible à tout moment — upgrade immédiat (prorata), downgrade en fin de période |

**Obligation légale (B2C)** : informer le consommateur par écrit, au plus tôt 3 mois et au plus tard 1 mois avant la date de renouvellement, de la possibilité de ne pas reconduire le contrat (art. L215-1 C. conso.). Sanction : le consommateur peut résilier à tout moment sans pénalité.

### 8. Résiliation

#### Résiliation par le Client

| Modalité | Détail |
|----------|--------|
| Comment | Depuis les paramètres du compte ou par email à [contact@monservice.com] |
| Effet | Fin de la période de facturation en cours |
| Remboursement | Pas de remboursement au prorata de la période restante (sauf période de rétractation) |
| Données | Accès maintenu jusqu'à la fin de la période payée, puis données conservées [30] jours avant suppression |
| Export | Possibilité d'exporter ses données avant la fin de l'accès |

#### Résiliation par le Prestataire

| Motif | Préavis | Effet |
|-------|---------|-------|
| Non-paiement (après relances) | 15 jours après mise en demeure | Suspension immédiate, puis résiliation |
| Violation des CGU/CGV | Immédiat si violation grave, sinon 15 jours | Suspension ou résiliation |
| Cessation du Service | 3 mois | Remboursement au prorata + export des données |
| Force majeure prolongée (> 3 mois) | Immédiat | Remboursement au prorata |

#### Sort des données après résiliation

1. **Période de grâce** : [30] jours après la fin de l'abonnement — accès en lecture seule pour export.
2. **Suppression** : après la période de grâce, suppression définitive des données, sauf obligations légales de conservation (facturation : 10 ans).
3. **Format d'export** : JSON et/ou CSV, via l'interface ou sur demande.

### 9. Responsabilité et garanties

#### Obligations du Prestataire

| Obligation | Type | Détail |
|------------|------|--------|
| Fournir le Service | Obligation de moyens | Accès au Service conforme à sa description |
| Disponibilité | Meilleur effort | Pas de SLA garanti sauf offre spécifique |
| Sécurité | Obligation de moyens renforcée | Mesures techniques et organisationnelles conformes à l'état de l'art |
| Support | Obligation de moyens | Réponse aux demandes dans un délai raisonnable |

#### Limitation de responsabilité

```markdown
## Limitation de responsabilité

La responsabilité du Prestataire est limitée aux dommages directs subis par
le Client et ne pourra excéder le montant total payé par le Client au cours
des 12 mois précédant l'événement à l'origine du dommage.

Le Prestataire ne saurait être tenu responsable :
- Des dommages indirects (perte de profit, perte de données, perte de chance,
  préjudice d'image).
- De l'interruption du Service due à un cas de force majeure.
- De l'utilisation du Service par le Client en violation des CGV ou CGU.
- Des contenus créés, stockés ou partagés par le Client via le Service.
```

**Attention** : les clauses de limitation de responsabilité sont strictement encadrées pour les consommateurs. Les clauses abusives (art. L212-1 C. conso.) et celles vidant l'obligation essentielle (art. 1170 C. civ.) sont réputées non écrites.

#### Garantie légale de conformité

Depuis le 1er janvier 2022, la garantie légale de conformité s'applique aux contenus et services numériques (art. L217-1 et suivants C. conso.) :
- **Durée** : le service doit être conforme pendant toute la durée du contrat.
- **Charge de la preuve** : le défaut de conformité apparu pendant le contrat est présumé exister au moment de la fourniture.
- **Remède** : mise en conformité dans un délai raisonnable, sinon réduction du prix ou résolution du contrat.

### 10. Propriété intellectuelle

```markdown
## Propriété intellectuelle

Le Service, incluant sa structure, son code source, ses algorithmes, son
design, ses marques et son contenu éditorial, est la propriété exclusive
du Prestataire ou de ses licenciés.

L'abonnement confère au Client un droit d'utilisation personnel, non exclusif,
non transférable et non cessible, limité à la durée de l'abonnement.

Le Client conserve l'intégralité de ses droits de propriété intellectuelle sur
les contenus qu'il crée, stocke ou transmet via le Service. Le Client accorde
au Prestataire une licence limitée, non exclusive, pour le traitement technique
nécessaire au fonctionnement du Service (stockage, affichage, sauvegarde).
```

### 11. Données personnelles

```markdown
## Données personnelles

Dans le cadre de la fourniture du Service, le Prestataire est amené à
collecter et traiter des données personnelles du Client.

Le détail des traitements, des données collectées, de leurs finalités, des
destinataires et des droits du Client est décrit dans la Politique de
confidentialité accessible à l'adresse : [URL]

Le Prestataire s'engage à traiter les données personnelles conformément
au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.
```

### 12. Force majeure

Événements exonératoires au sens de l'article 1218 du Code civil :

| Événement | Détail |
|-----------|--------|
| Catastrophes naturelles | Inondation, séisme, épidémie |
| Décisions gouvernementales | Interdiction, réquisition, confinement |
| Infrastructures | Coupure généralisée d'électricité, de télécommunications ou d'internet |
| Prestataires tiers | Défaillance de l'hébergeur, du prestataire de paiement |
| Cyberattaques | Attaque DDoS massive, compromission généralisée |

Effets :
- Suspension des obligations pendant la durée de l'événement.
- Notification dans les meilleurs délais.
- Si durée > 3 mois : chaque partie peut résilier sans indemnité.

### 13. Droit applicable et juridiction compétente

```markdown
## Droit applicable

Les présentes CGV sont régies par le droit français.

## Juridiction compétente

En cas de litige, les parties rechercheront une solution amiable avant toute
action judiciaire.

Pour les consommateurs : les tribunaux compétents sont ceux du lieu de
domicile du consommateur (art. R631-3 C. conso.) ou du siège du Prestataire,
au choix du consommateur.

Pour les professionnels : les tribunaux de [Ville du siège du Prestataire]
sont seuls compétents.
```

### 14. Modification des CGV

| Élément | Détail |
|---------|--------|
| Droit de modification | Le Prestataire se réserve le droit de modifier les CGV |
| Préavis | 30 jours minimum avant la prochaine échéance |
| Notification | Email + notification in-app |
| Acceptation | Poursuite de l'utilisation après la date d'effet vaut acceptation |
| Refus | Droit de résiliation sans frais ni pénalité avant la date d'effet |
| Archivage | Chaque version des CGV est datée et archivée |

### 15. Médiation de la consommation

Obligation légale pour tout professionnel s'adressant à des consommateurs (art. L612-1 C. conso.).

```markdown
## Médiation de la consommation

Conformément aux articles L611-1 et suivants du Code de la consommation, en
cas de litige non résolu, le Client consommateur peut recourir gratuitement
au service de médiation suivant :

- Médiateur : [Nom du médiateur agréé]
- Site web : [URL du médiateur]
- Adresse : [Adresse du médiateur]

Le Client peut également utiliser la plateforme européenne de règlement en
ligne des litiges : https://ec.europa.eu/consumers/odr
```

**Sanction** : l'absence de mention d'un médiateur agréé est passible d'une amende de 15 000 € pour les personnes morales (art. L641-1 C. conso.).

## Pièges courants à éviter

| Piège | Conséquence | Solution |
|-------|-------------|----------|
| Prix affichés HT sans mention claire en B2C | Pratique commerciale trompeuse | Afficher TTC pour les consommateurs |
| Renouvellement tacite sans notification préalable | Droit de résiliation à tout moment sans frais | Notifier 1 à 3 mois avant l'échéance |
| Pas de formulaire de rétractation | Non-conformité art. L221-5 C. conso. | Annexer le formulaire type |
| Clause "aucun remboursement" absolue | Clause abusive pour un consommateur | Prévoir le remboursement dans le cadre du droit de rétractation |
| Pas de mention de médiation | Amende jusqu'à 15 000 € | Désigner un médiateur agréé |
| Clause attributive de compétence vs consommateur | Clause abusive — réputée non écrite | Le consommateur choisit le tribunal |
| Pas de garantie de conformité numérique | Non-conformité depuis 2022 | Intégrer la garantie légale |
| Modification des prix sans préavis | Résiliation possible sans pénalité | Préavis de 30 jours |

## Articles de loi pertinents

| Texte | Référence | Objet |
|-------|-----------|-------|
| Code de la consommation | Art. L111-1 et suivants | Information précontractuelle |
| Code de la consommation | Art. L215-1 et suivants | Reconduction tacite |
| Code de la consommation | Art. L221-1 et suivants | Contrats à distance, droit de rétractation |
| Code de la consommation | Art. L221-28, 13° | Exception rétractation pour services numériques |
| Code de la consommation | Art. L217-1 et suivants | Garantie légale de conformité (contenus numériques) |
| Code de la consommation | Art. L212-1 | Clauses abusives |
| Code de la consommation | Art. L611-1 et suivants | Médiation de la consommation |
| Code civil | Art. 1170 | Obligation essentielle du contrat |
| Code civil | Art. 1218 | Force majeure |
| Code de commerce | Art. L441-1 et suivants | Communication des CGV (B2B) |
| Code de commerce | Art. L441-10 | Pénalités de retard |
| RGPD | Règlement (UE) 2016/679 | Protection des données personnelles |
| LCEN | Loi n°2004-575 du 21 juin 2004 | Commerce électronique |

## Checklist de validation avant publication

- [ ] Les CGV sont rédigées en français.
- [ ] L'identité complète du prestataire est mentionnée.
- [ ] La description du service est suffisamment précise.
- [ ] Les prix sont affichés TTC (B2C) ou HT avec mention claire (B2B).
- [ ] Les modalités de paiement sont détaillées.
- [ ] Le droit de rétractation est mentionné avec les exceptions applicables.
- [ ] Le formulaire type de rétractation est annexé (ou lien fourni).
- [ ] Les conditions de renouvellement et de résiliation sont claires.
- [ ] La notification préalable au renouvellement est prévue (B2C).
- [ ] La limitation de responsabilité est raisonnable (pas d'exonération totale).
- [ ] La garantie légale de conformité numérique est mentionnée.
- [ ] Un médiateur de la consommation est désigné (si B2C).
- [ ] Les CGV sont accessibles avant la souscription (lien + case d'acceptation).
- [ ] La date de dernière mise à jour est visible.
- [ ] Un versionnage des CGV est en place.
- [ ] Le renvoi vers la politique de confidentialité est présent.

## Voir aussi

- **Read** [`cgu-saas-type.md`](cgu-saas-type.md) — Conditions Générales d'Utilisation pour un SaaS
- **Read** [`mentions-legales.md`](mentions-legales.md) — Mentions légales obligatoires
- **Read** [`merchant-of-record.md`](merchant-of-record.md) — Modèle Merchant of Record (délégation de TVA)
- **Read** [`../pricing-models/`](../pricing-models/) — Modèles de pricing SaaS
