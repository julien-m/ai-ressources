# Onboarding utile et reprenable

À charger pour un premier accès, une configuration de compte, un parcours de personnalisation ou l'activation d'une fonctionnalité. Les règles ci-dessous sont des recommandations locales ; aucun nombre d'écrans ne garantit une bonne activation.

Lire la [revue de l'étude onboarding](../references/mobbin-blog-review.md#02--onboarding) pour les limites des données, puis appliquer [forms.md](forms.md), [navigation.md](navigation.md) et [accessibility.md](../quality/accessibility.md). Pour une étape payante, lire [paywall-design.md](paywall-design.md).

## Définir la première valeur

Écrire une action dont le résultat est utile et observable, par exemple « créer un premier projet contenant une tâche assignée ». Éviter « terminer l'onboarding », qui mesure le parcours plutôt que son bénéfice.

Classer chaque étape avant de la concevoir :

| Type | Critère pour la garder | Exemple fictif |
|---|---|---|
| Nécessité technique | Le produit ne peut agir sans elle | Choisir le calendrier à connecter |
| Identité ou obligation | Exigence applicable validée | Vérification requise pour l'opération ciblée |
| Personnalisation | La réponse modifie un résultat défini | Disponibilités utilisées dans le planning |
| Apprentissage | L'utilisateur réalise une tâche représentative | Créer une tâche de démonstration |
| Préférence reportable | Le produit fonctionne avec un défaut explicite | Couleur du projet |
| Marketing | N'apporte pas de valeur fonctionnelle nécessaire | Newsletter facultative et distincte |

Reporter les préférences non nécessaires. Pour une question conservée, documenter son consommateur, son effet, son caractère obligatoire, sa sensibilité et son comportement sans réponse. Ne pas demander une information simplement pour rendre le parcours plus personnel.

## Choisir le parcours

| Situation | Recommandation | Limite |
|---|---|---|
| Outil immédiatement utilisable | Accès direct à une tâche réelle | Présenter l'aide au moment du besoin |
| Produit dépendant de quelques paramètres | Collecte minimale puis aperçu modifiable | Ne pas cacher le coût à la fin |
| Installation de matériel | Étapes nommées avec état de connexion | Distinguer connexion, appairage et autorisation |
| Parcours réglementé | Exigences explicites et reprise sécurisée | Pas de suppression d'une étape obligatoire par imitation UX |
| Équipe ou workspace | Séparer besoins du créateur et de l'invité | Ne pas obliger un invité à créer un autre espace |

## Progression et navigation

- Nommer les étapes : « Projet », « Disponibilités », « Aperçu ». Un nombre de champs remplis n'est pas toujours un bon indicateur.
- Calculer la progression sur le parcours réellement applicable ; si une branche ajoute du travail, expliquer le changement plutôt que maintenir une barre trompeuse.
- Autoriser le retour sans perte de réponse ; invalider seulement les résultats qui dépendent d'une réponse modifiée.
- Prévoir « Plus tard » pour les étapes facultatives, avec une conséquence claire. Pour une étape indispensable, expliquer la nécessité et permettre de quitter.
- Restaurer l'étape et les réponses appropriées après interruption ; définir durée de conservation et suppression des réponses sensibles.
- Conserver les paramètres d'invitation après connexion et gérer une invitation expirée sans perdre les autres données utiles.

## Montrer le résultat des réponses

Présenter une restitution factuelle et modifiable : « Planning proposé : mardi et jeudi, 30 minutes » avec accès aux choix sources. Ne pas attribuer une personnalité, un diagnostic ou une prédiction non démontrée.

- Donner un aperçu qui utilise réellement les réponses ; annoncer un aperçu illustratif comme tel.
- Montrer un chargement uniquement pendant un traitement réel. Pour un calcul instantané, afficher le résultat sans mise en scène d'analyse.
- Si la génération échoue, proposer de réessayer et conserver les paramètres ; ne pas générer un résultat générique en le faisant passer pour personnalisé.
- Quand une réponse ne modifie pas le résultat, supprimer la question ou la justifier par un autre usage déclaré.

## Permissions et authentification

Demander une permission quand l'utilisateur déclenche l'action qui en a besoin. Expliquer le service rendu avant la demande système, sans remplacer ni imiter ce dialogue.

| Permission | Moment utile | Refus |
|---|---|---|
| Notifications | L'utilisateur choisit un rappel | Garder les rappels dans l'app ; proposer les réglages sans insistance |
| Caméra | Il choisit de scanner | Proposer une saisie ou un import si possible |
| Localisation | Il demande un résultat local | Permettre une zone saisie si le service le permet |
| Contacts | Il choisit d'inviter | Permettre la saisie d'une adresse sans charger le carnet |

Reporter la création de compte uniquement si les données et actions le permettent. Si un compte est nécessaire, expliquer pourquoi ; prévoir fusion ou transfert du brouillon local après connexion, sans duplication.

## Exemple complet de contrat

Exemple fictif : outil de planning, avant tout calendrier externe connecté.

| Étape | Donnée demandée | Résultat | Option de sortie |
|---|---|---|---|
| Bienvenue | Aucune | But du produit et éventuelles limites gratuites | Explorer une démonstration identifiée |
| Disponibilités | Créneaux et fuseau | Créneaux utilisables | Revenir ; conserver un brouillon |
| Aperçu | Validation des créneaux | Planning modifiable | Modifier les réponses |
| Compte | Identifiant nécessaire à la sauvegarde | Planning associé au compte | Retour sans effacer le brouillon |
| Activation | Choix de connexion du calendrier | Synchronisation vérifiée | Continuer sans intégration si supporté |

## États et mesures

| Cas | Attendu |
|---|---|
| Réseau coupé après validation | Reprise à la dernière étape confirmée ; statut du brouillon clair |
| Double clic sur création | Une seule ressource créée ; état en cours visible |
| Réponse parent modifiée | Recalcul des propositions dépendantes, sans perte des réponses indépendantes |
| Session expirée | Reconnexion puis reprise au bon endroit |
| Refus de permission | Explication et solution alternative prévue |
| Déjà configuré | Accès au produit ou modification ciblée ; pas de tutoriel obligatoire répété |

Mesurer séparément entrée par étape, erreurs, abandon, reprise, temps jusqu'à première valeur et réussite de la tâche. Utiliser des identifiants d'étape dans les événements ; ne pas envoyer les réponses personnelles dans l'analytics. Comparer des cohortes pertinentes avant d'attribuer un gain à la longueur du parcours.

```gherkin
Scenario: Reprendre sans répondre à nouveau
  Given un brouillon valide enregistré avant une interruption
  When l'utilisateur revient dans sa session autorisée
  Then il retrouve ses réponses et la prochaine étape utile
  And il peut corriger les choix précédents avant activation
```

Vérifier clavier, labels, validation contextuelle, petit écran, texte agrandi, navigation retour et absence de données sensibles dans les logs. Une barre à 100 % ne suffit pas : vérifier le résultat utile réellement créé.
