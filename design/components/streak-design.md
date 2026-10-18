# Séries, objectifs et reprise

À charger pour une habitude, une progression quotidienne, un rappel ou une série. Recommandations locales : la série reste un indicateur secondaire au bénéfice réel du produit.

Lire la [revue Mobbin sur les séries](../references/mobbin-blog-review.md#03--séries-et-habitudes) pour les limites de la source, [feedback.md](feedback.md) pour les confirmations et [accessibility.md](../quality/accessibility.md) pour les annonces et animations. Ne pas transformer une interprétation psychologique d'article en promesse de santé ou de motivation.

## Choisir ce qui compte

| Besoin produit | Mesure principale | Série éventuellement utile |
|---|---|---|
| Apprendre | Compétence ou exercices validés | Jours avec une activité qualifiante |
| Réaliser un projet | Livrables réellement terminés | Semaines avec un objectif atteint |
| S'entraîner | Séances pertinentes et récupération | Respect d'un planning incluant le repos |
| Consulter des données | Compréhension ou action utile | Souvent aucune série nécessaire |

Éviter de récompenser une simple ouverture d'application si elle ne correspond pas à la valeur attendue. Permettre un objectif hebdomadaire lorsque le besoin n'est pas quotidien. Nommer précisément la mesure affichée : « 3 séances sur 4 prévues » et « 8 jours consécutifs » sont deux informations différentes.

## Contrat de calcul

Définir avant toute animation :

- **Événement qualifiant** : action validée, source autorisée et identifiant unique ; aucune récompense sur un clic non confirmé.
- **Période** : jour civil ou fenêtre glissante ; ne pas mélanger les deux sous le même libellé.
- **Fuseau** : zone IANA de référence et politique de changement ; stocker l'instant d'origine.
- **Heure limite** : règle lisible ; ne pas créer une fenêtre de 24 h qui dérive chaque jour si l'interface promet des jours civils.
- **Retard** : délai admissible de synchronisation hors ligne, traitement d'un import ancien et date de finalisation du statut.
- **Repos et pause** : participation à l'objectif ou neutralisation de la période ; afficher la différence entre fait et protégé.
- **Correction** : annulation d'une activité, doublon ou erreur d'import ; recalcul reproductible.
- **Indicateurs** : série actuelle, meilleur historique, cumul utile et rythme récent ; leurs définitions doivent rester distinctes.

Exemple fictif : objectif de trois exercices par semaine en Europe/Paris. Une séance validée vaut une participation, même synchronisée deux fois. Le dimanche n'est pas un échec quotidien. Le changement d'heure ne modifie pas le nombre de jours civils.

## États et microcopy

| État | Affichage | Action |
|---|---|---|
| Pas encore commencé | Objectif et première activité | Commencer ou configurer |
| En cours | Progrès réel, prochaine occasion | Continuer sans urgence artificielle |
| Réalisé | Confirmation discrète et cumul | Consulter le détail |
| Repos planifié | Repos identifié | Reprendre à la date prévue |
| Pause volontaire | Dates et effet sur le calcul | Modifier ou reprendre |
| Synchronisation en attente | Statut provisoire | Synchroniser ; ne pas annoncer une perte |
| Période manquée | Historique conservé | Reprendre ou ajuster l'objectif |
| Correction effectuée | Résultat recalculé et raison accessible | Examiner l'activité source |

Microcopy fictive après une interruption : « Votre historique est conservé. Choisissez votre prochaine séance. » Éviter « Vous avez tout perdu » ou une mascotte en détresse utilisée pour forcer le retour.

## Rappels et contrôle

- Demander le consentement au moment où l'utilisateur configure un rappel ; donner heure, fuseau et fréquence modifiables.
- Respecter heures calmes, pause et désactivation. Vérifier que le rappel reste pertinent avant envoi.
- Dédupliquer les rappels multi-appareils et annuler ceux d'une période déjà complétée.
- Éviter les comptes à rebours tardifs culpabilisants et les sollicitations répétées après refus.
- Pour les objectifs sociaux, demander le partage explicitement ; prévoir retrait et confidentialité des détails personnels.
- Une pause doit fonctionner sans achat de « réparation ». Si le produit commercialise une autre option, ne pas la présenter comme nécessaire pour préserver la valeur du travail passé.

## Présentation et accessibilité

Afficher faits, pauses et périodes manquées avec des libellés ou symboles distincts, jamais seulement par couleur. Donner un nom accessible à chaque jour (« 18 octobre, exercice validé »). Pour un long calendrier, prévoir une synthèse et un accès au détail sans des centaines d'arrêts clavier inutiles.

Une célébration ne doit ni bloquer la tâche suivante ni dépendre d'une animation pour transmettre le résultat. Respecter la préférence de mouvement réduit. Le chiffre principal doit rester lisible avec texte agrandi.

## Vérification et mesure

```gherkin
Scenario: Une activité arrive après la coupure réseau
  Given une activité qualifiante datée dans la période et reçue dans le délai autorisé
  When elle est synchronisée deux fois avec le même identifiant
  Then la progression est mise à jour une seule fois
  And le statut provisoire est remplacé par le résultat calculé
```

Vérifier changement d'heure, voyage, minuit, refus de notifications, pause, repos, reprise et correction. Tester l'objectif hebdomadaire sans supposer une présence quotidienne.

Mesurer réalisation utile, retour après interruption et désactivation des rappels, en plus de la série moyenne. Un grand nombre d'ouvertures ne prouve ni apprentissage ni bien-être. Présenter les effets observés d'une expérimentation séparément des hypothèses de motivation.
