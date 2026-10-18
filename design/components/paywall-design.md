# Paywalls, offres et essais transparents

À charger pour une offre Pro, un accès limité, un essai ou un upgrade. Un paywall explique un droit d'accès ; le checkout exécute le paiement. Cette fiche est une conception locale, pas une étude de conversion Mobbin.

Lire la [revue onboarding](../references/mobbin-blog-review.md#02--onboarding) pour la source du sujet, [payment-flows.md](payment-flows.md) pour le paiement, [forms.md](forms.md) pour les interactions et les [CGV SaaS](../../legal/cgv-saas.md) pour les points à faire valider. Les obligations varient selon pays, plateforme et contrat ; les références visuelles ne les établissent pas.

## Choisir le déclencheur

| Situation | Présentation | Contexte à conserver |
|---|---|---|
| Fonction réservée | Offre contextualisée au clic | Objet et action à reprendre après upgrade |
| Limite gratuite atteinte | Usage actuel, limite et effet de l'offre | Travail déjà créé et solutions permises |
| Produit uniquement payant | Conditions annoncées avant la configuration | Réponses et aperçu, selon politique de conservation |
| Essai arrivant à terme | Date et état effectifs | Accès encore disponible et action de gestion |
| Promotion expirée | Offre courante ou indisponibilité explicite | Ne pas recréer un compteur promotionnel |

Ne pas utiliser le temps déjà investi par la personne pour dissimuler une condition essentielle. Si la suite demande un paiement, le dire avant une collecte longue. Adapter la proposition aux réponses uniquement si le produit est réellement adapté.

## Anatomie de l'offre

Présenter dans cet ordre de lecture : résultat utile, fonctions concernées, choix d'offre, coût et engagement, action de souscription, issue alternative et gestion de l'abonnement.

| Élément | Contenu exigé dans le contrat produit |
|---|---|
| Bénéfice | Résultat concret et limites ; éviter « illimité » si un plafond existe |
| Prix | Devise, montant facturé et périodicité ; taxes selon contexte validé |
| Équivalent mensuel | Secondaire si la facture est annuelle ; facture annuelle explicite |
| Essai | Durée, carte nécessaire ou non, date de débit et prix après essai |
| Renouvellement | Automatique ou non, cadence et accès aux conditions |
| Annulation | Point d'entrée identifiable et effet sur l'accès |
| Choix sélectionné | État contrôlable au clavier ; engagement toujours visible |
| Comparaison | Différences utiles, unités et exclusions compréhensibles |
| CTA | Libellé correspondant à l'action réelle : démarrer un essai ou payer |
| Alternative | Fermer, revenir, continuer gratuitement ou quitter selon le modèle |
| Abonné existant | Connexion, gestion ou restauration selon le canal utilisé |

Ne pas recommander un abonnement par un badge « adapté à vous » sans règle réelle. Un badge de popularité nécessite des données à jour ; un compteur exige une échéance réelle. Distinguer une réduction calculée sur des périodes comparables d'une simple différence de cadence.

## Exemple de microcopy

Exemple fictif, prix TTC choisi uniquement pour illustrer une facturation annuelle :

> Pro — exports avancés et historique sur 12 mois. 120 € TTC facturés par an, soit 10 €/mois. Renouvellement automatique annuel. Gérer le renouvellement dans les paramètres de facturation.

CTA fictif : **S'abonner pour 120 €/an**. Alternative si le modèle le permet : **Continuer avec l'offre gratuite**. Pour un essai, remplacer le contenu par les dates calculées et le prix réel après essai ; ne pas recycler le CTA d'achat.

## Du paiement aux droits d'accès

Définir une source serveur des droits. La fermeture du checkout, une redirection ou une animation de succès ne prouvent pas un paiement confirmé.

| État | Ce que l'interface annonce | Action permise |
|---|---|---|
| Offre chargée | Conditions actuelles | Choisir une offre |
| Création de session | Traitement en cours | Empêcher la soumission multiple |
| Authentification de paiement | Vérification requise | Terminer ou annuler chez le fournisseur |
| Paiement refusé | Échec explicite sans perte de travail | Corriger le moyen de paiement |
| Confirmation en attente | « Vérification de votre abonnement » | Actualiser les droits, sans repayer automatiquement |
| Droits actifs | Offre et limite effectives | Reprendre l'action initiale |
| Paiement confirmé, activation retardée | Statut précis et aide identifiable | Réconciliation côté serveur |
| Offre modifiée | Nouvelles conditions avant engagement | Demander un nouveau choix explicite |

Utiliser les composants et mécanismes du fournisseur ; ne pas collecter les données de carte directement. Traiter les événements dupliqués de façon idempotente. Pour les achats natifs, implémenter la restauration et la vérification adaptées à la plateforme ; distinguer achat web, compte produit et compte de la boutique.

## Gestion après souscription

- Montrer plan, statut, période, prochaine échéance connue et point d'entrée de gestion.
- Décrire avant confirmation l'effet d'une annulation, d'un changement de cadence ou d'une réduction de sièges.
- Après changement, vérifier l'état fournisseur et les droits produit ; afficher « en attente » si la propagation n'est pas terminée.
- Conserver les données selon la politique annoncée ; indiquer le mode lecture seule ou les limites après expiration.
- Un paiement échoué n'autorise pas à présenter un solde indisponible comme un abonnement actif.

## Accessibilité et mesure

Utiliser une structure de formulaire pour sélectionner l'offre, un prix lisible sans hover et un focus visible. Sur petit écran et avec texte agrandi, ne pas laisser un CTA fixe masquer le montant ou les conditions. Pour une modale, permettre la sortie prévue et rétablir le focus au déclencheur.

Mesurer affichage, choix, ouverture checkout, confirmation serveur, activation, annulation et demandes de remboursement séparément. Exclure doubles clics et événements dupliqués. Une hausse d'achats accompagnée d'erreurs ou de réclamations nécessite une analyse ; elle ne valide pas seule le design.

```gherkin
Scenario: Le paiement est revenu mais les droits ne sont pas confirmés
  Given un retour du checkout sans confirmation serveur des droits
  When l'utilisateur revient sur la fonction réservée
  Then l'interface indique une vérification en attente
  And elle ne déclenche pas un second paiement automatiquement
```

Vérifier aussi : fermeture sans achat, abonnement déjà actif, restauration sans achat trouvé, essai expiré, changement de prix, erreur réseau, annulation et retour à la tâche avec son brouillon.
