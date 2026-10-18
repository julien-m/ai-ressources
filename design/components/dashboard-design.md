# Dashboards orientés décision

À charger pour un cockpit, une vue d'ensemble, des KPI ou des résumés automatiques. Ces recommandations locales complètent les composants existants ; une collection de graphiques ne définit pas le besoin métier.

## Point de départ et sources

Lire la [revue Mobbin](../references/mobbin-blog-review.md#01--dashboards) pour distinguer les observations de l'étude des décisions locales ci-dessous. Ne pas utiliser le nombre d'écrans étudiés comme validation d'une solution.

Lire [data-visualization.md](data-visualization.md) pour l'anatomie des graphiques, [app-views.md](../references/app-views.md) pour le shell et [accessibility.md](../quality/accessibility.md) pour les interactions. Ici, le nombre de cartes dépend des décisions à prendre : la rangée de quatre cartes du catalogue est un exemple, pas un quota.

## Contrat avant la maquette

Renseigner ces champs pour chaque rôle utilisateur :

| Champ | Question à résoudre | Exemple fictif : responsable support |
|---|---|---|
| Décision | Que doit décider cette personne maintenant ? | Réaffecter un agent vers une file saturée |
| Horizon | Sur quelle fenêtre ? | Aujourd'hui, fuseau Europe/Paris |
| Signal prioritaire | Quelle donnée change cette décision ? | Tickets urgents sans réponse depuis 30 minutes |
| Seuil | Quelle règle déclenche l'attention ? | Règle configurée par l'équipe, visible dans l'aide |
| Action | Où intervient-elle ? | Ouvrir la file filtrée puis réaffecter |
| Explication | Que faut-il savoir pour interpréter ? | Couverture de collecte et dernière mise à jour |
| Droits | Quelles données et actions sont permises ? | Périmètre équipe ; pas les dossiers d'une autre équipe |

Supprimer ou déplacer une métrique qui ne répond à aucune décision ou question de contrôle. Garder le détail accessible dans une vue adaptée.

## Choisir le contenu et sa forme

| Besoin | Présentation recommandée | Condition |
|---|---|---|
| Priorité immédiate | Résumé court + action explicite | Action réalisable avec le rôle courant |
| Évolution dans le temps | Courbe + fenêtre + référence | Échantillonnage cohérent et périodes comparables |
| Comparer des catégories | Barres triées | Même unité et même base de calcul |
| Identifier des heures chargées | Heatmap + table alternative | Échelle et fuseau visibles |
| Traiter des cas individuels | Liste ou table filtrable | Liens conservant le contexte |
| Comprendre un score | Valeur + facteurs + limites | Calcul documenté ; pas de verdict opaque |

Placer l'information urgente avant la synthèse générale si le rôle doit intervenir. Dans un usage exploratoire, privilégier filtres et comparaison plutôt qu'une conclusion imposée.

## Contrat de données

Pour chaque métrique, définir identifiant, libellé, unité, population, agrégation, fenêtre, fuseau, source, fraîcheur, couverture et droits. Pour un delta, définir aussi la période de référence et le traitement d'une référence nulle.

- Afficher `0` uniquement pour une mesure complète égale à zéro ; utiliser « Indisponible » pour un échec et « Pas encore de données » pour une collecte non commencée.
- Ne pas calculer un pourcentage de croissance depuis zéro ; afficher les valeurs absolues ou « nouvelle activité » selon le domaine.
- Signaler les fenêtres partielles. Comparer mardi à 10 h avec un mardi complet exige une explication ou une référence équivalente.
- Afficher la date réelle d'observation, distincte de l'heure de rafraîchissement de l'interface.
- Faire porter le filtre de période sur toutes les vues concernées, ou indiquer explicitement les exceptions.
- Conserver une ancienne réponse pendant le rafraîchissement si elle reste utile ; marquer son ancienneté. Une réponse réseau ancienne ne doit pas écraser la requête la plus récente.
- Filtrer et autoriser côté serveur ; masquer une carte côté client ne protège pas les données.

## États à concevoir

| État | Comportement attendu |
|---|---|
| Premier accès | Expliquer la source manquante et proposer sa connexion |
| Chargement initial | Réserver la structure utile ; ne pas simuler de vraies valeurs |
| Données partielles | Identifier les sources absentes et les totaux incomplets |
| Erreur d'une source | Garder les autres blocs utilisables ; retry local |
| Données anciennes | Montrer l'heure et une action de reprise ; suspendre les conclusions sensibles |
| Aucun résultat filtré | Conserver les filtres et proposer de les ajuster |
| Accès refusé | Expliquer le périmètre autorisé, sans exposer les données interdites |
| Mise à jour en direct | Mettre à jour sans déplacer le focus ni réordonner une ligne en cours d'action |

## Résumés et IA

- Lier chaque constat à une métrique et une fenêtre vérifiables. Exemple fictif : « 12 tickets urgents attendent une première réponse » avec lien vers ces 12 tickets.
- Distinguer observation et hypothèse : « Hausse depuis lundi » peut être calculé ; « causée par la campagne » nécessite une preuve supplémentaire.
- Produire les totaux par calcul déterministe ; l'IA peut formuler une synthèse à partir de ces résultats, sans inventer de données manquantes.
- Montrer les limites du score et son niveau de couverture. Pour la santé ou la finance, faire valider le sens et les limites par le domaine compétent.
- Prévoir l'état « Synthèse indisponible » sans supprimer les graphiques ni bloquer la tâche.

## Exemple de composition

Données fictives : fenêtre « Aujourd'hui », 12 tickets urgents, 4 agents disponibles, une source synchronisée à 09:42 et une seconde déconnectée.

| Zone | Contenu | Interaction |
|---|---|---|
| En-tête | Équipe, fenêtre, fuseau, fraîcheur | Changer le périmètre autorisé |
| Priorité | « 12 tickets urgents à examiner » | Ouvrir la file avec les mêmes filtres |
| Capacité | 4 agents disponibles ; couverture partielle | Examiner la répartition, sans réaffectation automatique |
| Historique | Charge horaire ; intervalle manquant visible | Accéder aux valeurs en table |
| Collecte | Source déconnectée | Reconnecter si les droits le permettent |

Sur mobile, garder priorité et action en tête, empiler les visualisations et rendre les tables consultables sans perdre l'identité des lignes. Au clavier, toute information de survol reste accessible par focus ou dans une alternative textuelle.

## Vérification

```gherkin
Scenario: Une source ne répond plus
  Given deux sources dont une indisponible
  When le dashboard se charge
  Then les données disponibles restent lisibles et la couverture partielle est annoncée
  And aucun total incomplet n'est présenté comme complet
```

Vérifier aussi : zéro réel, référence nulle, période partielle, filtres propagés, retour du détail avec contexte, accès serveur, lecture au clavier, zoom, petit écran et absence de résumé IA. Valider avec une tâche métier : la personne doit identifier le problème et accéder à son action, pas seulement reconnaître les graphiques.
