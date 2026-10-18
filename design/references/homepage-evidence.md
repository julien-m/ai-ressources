# Homepage : preuves, texte et composition

À charger pour concevoir une homepage, un hero, une grille de bénéfices, des témoignages ou des animations marketing. Ces recommandations locales complètent les [patterns de landing pages](landing-pages.md), les [règles de goût visuel](../quality/design-taste.md) et les [tokens de mouvement](../tokens/motion.md).

Lire la [revue Mobbin](mobbin-blog-review.md#05--construire-une-homepage-avec-lia) pour les récits qui motivent la traçabilité et la composition. Le résultat visuel d'un récit de conception ne prouve pas un gain de conversion.

## Brief avant variantes

Écrire public, problème, produit réellement disponible, bénéfice, preuve et action attendue. Désigner qui décide de l'exactitude, du design et de la publication. Une préférence esthétique ne remplace pas ces critères.

Exemple fictif : « Pour les petites équipes support, le produit regroupe les tickets et affecte les priorités. La démonstration doit montrer une file et une affectation réelles. L'action principale ouvre un environnement de démonstration ; aucune promesse d'automatisation complète. »

| Zone | Question de lecture | Contrôle |
|---|---|---|
| Hero | Qu'est-ce que c'est, pour qui, pour quoi faire ? | Compréhension par une personne extérieure |
| Démonstration | À quoi ressemble la tâche réelle ? | Capture ou démo liée au produit livré |
| Bénéfices | Quelle différence pour cette personne ? | Chaque affirmation a une preuve ou est reformulée |
| Offre | Qu'obtient-on et à quelles conditions ? | Limites et mode d'accès cohérents avec le produit |
| CTA | Que va-t-il se passer ? | Destination conforme au libellé |

Un test de lecture de quelques secondes sert à détecter une ambiguïté ; ce n'est pas une preuve de conversion ni une obligation de faire tenir toute la proposition dans un slogan.

## Registre des affirmations

Créer un registre de travail, conservé avec la production de la page :

| Champ | Utilité |
|---|---|
| ID stable | Suit l'affirmation entre texte, maquette et code |
| Texte exact | Évite les paraphrases attribuées comme citations |
| Nature | Fait produit, chiffre, témoignage, comparaison ou illustration |
| Source précise | Document, extrait autorisé ou calcul reproductible |
| Date et périmètre | Période mesurée, population, offre, pays et version |
| Attribution | Personne, rôle et entreprise vérifiés au moment pertinent |
| Autorisation | Droit de publier le témoignage, la photo ou le logo |
| État | À vérifier, validé pour publication ou expiré |
| Emplacements | Hero, carte, pricing, métadonnées et variantes traduites |

Un placeholder doit porter son statut au plus près du contenu dans chaque outil. Ne pas compter sur une note restée dans le document d'origine. Avant publication, retirer tout placeholder ou le remplacer par une preuve validée. Un exemple fictif ne doit jamais porter le nom ou la photo d'un vrai client.

## Règles par type de preuve

- **Témoignage** : garder les mots autorisés ; vérifier attribution et contexte. Une reformulation devient une paraphrase explicitement présentée, pas une citation entre guillemets.
- **Nombre** : garder dénominateur, fenêtre et méthode. « 90 % plus rapide » exige une comparaison définie ; sinon décrire la fonctionnalité sans ce chiffre.
- **Logo** : vérifier le droit d'usage et le sens du regroupement. Un logo de fournisseur ne doit pas devenir un client par proximité.
- **Sécurité** : donner uniquement les attestations détenues et leur périmètre vérifié. Une annonce historique n'établit pas une conformité actuelle ; faire relire la revendication par son responsable.
- **Capture** : refléter les capacités livrées ; anonymiser les données. Une maquette conceptuelle doit être identifiée.
- **Comparaison** : dater les capacités concurrentes et vérifier leurs sources ; ne pas transformer « non documenté » en « absent ».

## Texte et mise en page

Quand une coupe change le verbe, l'objet ou la promesse, refaire la validation du sens. Comparer la version affichée au brief, pas seulement au nombre de caractères.

- Garder nom du produit, bénéfice et CTA compréhensibles à chaque breakpoint.
- Tester titres avec texte long et traductions ; éviter les sauts de ligne manuels qui cassent la lecture mobile.
- Vérifier que l'image montre l'objet réellement décrit. Un visuel décoratif ne tient pas lieu de preuve produit.
- Utiliser des liens distincts pour des actions différentes ; éviter un bouton qui annonce une démo et ouvre un checkout.
- Conserver une version précédente identifiable ; expérimenter sur une hypothèse précise et un résultat mesurable.

## Grilles de contenu et bento

Choisir le nombre de cartes selon le contenu, pas selon une tendance. Si les catégories ont un statut équivalent, une grille régulière évite une hiérarchie accidentelle. Si une catégorie est prioritaire, justifier l'accent visuel par le brief.

| Décision | Recommandation locale | Exemple fictif |
|---|---|---|
| Information par carte | Un sujet et une preuve lisible | « Exports » avec aperçu d'un fichier réel |
| Titre | Nommer le contenu sans dépendre de l'animation | « Historique » reste visible |
| Visuels | Éviter miniatures illisibles et données trompeuses | Recadrage d'une zone utile, signalé si nécessaire |
| Cohérence | Tokens de spacing, rayon et typographie du projet | Padding 24 et gap 16 si adaptés au système |
| Ordre | Même ordre logique dans le DOM et la lecture | Priorités conservées quand la grille s'empile |
| Taille | Hauteur adaptée au contenu | Aucun texte coupé pour égaliser les cartes |
| Interaction | CTA réel identifiable | Carte statique si elle ne mène à rien |

Vérifier les inférences : une seule application représentée peut faire croire à un produit unique ; un chiffre proche d'un prix peut être pris pour une limite ; une carte surdimensionnée peut sembler plus importante. Faire décrire le contenu par une personne extérieure avant de conclure que la grille est claire.

## Animation et contrôle

L'animation reste une amélioration du contenu statique. Une carte doit être compréhensible avec sa première image et sans JavaScript. Ne pas imposer un scroll détourné pour accéder aux catégories.

- Ne pas coordonner plusieurs changements rapides sans vérifier l'attention et la lisibilité ; une animation indépendante n'est pas automatiquement meilleure.
- Limiter la concurrence de mouvement, éviter les décalages de layout et réserver les dimensions des médias.
- Respecter le mouvement réduit ; fournir le contrôle pause/arrêt pour les contenus automatiques selon les [règles d'accessibilité](../quality/accessibility.md).
- Ne pas déplacer le focus lors d'un changement de visuel ; ne pas annoncer chaque rotation décorative au lecteur d'écran.
- Si une information essentielle change, rendre son accès possible sans attendre le cycle.
- Vérifier chargement lent, échec du média et coût de plusieurs animations sur mobile.

## Vérification avant publication

```gherkin
Scenario: Une citation provisoire a traversé plusieurs outils
  Given une affirmation dont le registre indique encore à vérifier
  When la page est préparée pour publication
  Then cette affirmation ne figure pas comme témoignage client publié
  And son remplacement exige une source et une attribution validées
```

Contrôler séparément exactitude des affirmations, fonctionnement des CTA, lecture mobile, zoom, clavier, mouvement réduit, médias absents et stabilité de layout. Un build vert ne vérifie pas un témoignage. Un avis esthétique favorable ne vérifie pas une destination de bouton. Après publication autorisée, mesurer la réussite de la tâche attendue et les erreurs ; conserver hypothèses et limites dans le compte rendu de l'expérience.
