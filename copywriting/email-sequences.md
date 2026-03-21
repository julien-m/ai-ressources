# Séquences Email SaaS

Templates et patterns pour les séquences email d'un SaaS : onboarding, activation, rétention, win-back. Formules, structures et métriques.

## 1. Structure d'un email

Chaque email suit la même ossature, quel que soit le type :

| Élément | Rôle | Règle |
|---------|------|-------|
| Subject line | Obtenir l'ouverture | < 50 caractères, 1 idée, pas de clickbait |
| Preview text | Compléter le sujet | 40-90 caractères, ne pas répéter le sujet |
| Hook (1ère ligne) | Retenir l'attention | Question, stat, ou constat direct |
| Body | Développer la valeur | 3-5 lignes max pour les emails transactionnels, 8-12 pour nurturing |
| CTA | Convertir en action | 1 seul CTA par email, bouton ou lien proéminent |
| PS (optionnel) | Deuxième chance de convertir | Reformuler le CTA ou ajouter un élément de preuve |

Règle absolue : 1 email = 1 objectif = 1 CTA.

## 2. Formules de subject lines

| Formule | Template | Exemple | Contexte |
|---------|----------|---------|----------|
| Bénéfice direct | "[Résultat] en [temps]" | "Votre premier deploy en 2 min" | Onboarding |
| Question | "[Douleur] ?" | "Toujours en galère avec vos deploys ?" | Win-back |
| Curiosité | "Le [secret/truc] que [persona] utilisent" | "Ce que les top teams font après le signup" | Activation |
| Urgence douce | "[Action] avant [deadline]" | "Activez votre workspace avant vendredi" | Trial expiring |
| Social proof | "[Nombre] [persona] font déjà [action]" | "5 000 devs ont déjà migré" | Conversion |
| Personnel | "[Prénom], [observation]" | "Julien, vous n'avez pas encore invité votre team" | Re-engagement |
| How-to | "Comment [résultat] sans [friction]" | "Comment déployer sans YAML" | Nurturing |

### Règles subject lines

- Pas de ALL CAPS, pas de points d'exclamation multiples
- Pas d'emoji sauf si la marque l'a établi comme norme
- Tester les subjects sur mobile (40 caractères visibles max)
- Préférer le lowercase ou sentence case au Title Case

## 3. Séquence Onboarding (J0 -> J14)

| Jour | Email | Objectif | Subject line type | CTA |
|------|-------|----------|-------------------|-----|
| J0 | Welcome | Confirmer le signup, donner la 1ère étape | Bénéfice direct | "Créer votre premier [X]" |
| J1 | Quick win | Guider vers le aha moment | How-to | "Essayer [feature clé]" |
| J3 | Value discovery | Montrer un cas d'usage concret | Curiosité | "Voir l'exemple" |
| J5 | Social proof | Crédibiliser via un témoignage | Social proof | "Lire le case study" |
| J7 | Feature unlock | Présenter une feature avancée | Bénéfice direct | "Activer [feature]" |
| J10 | Progress check | Récapituler ce que l'utilisateur a accompli | Personnel | "Continuer" |
| J14 | Upgrade / next step | Transition vers le payant ou engagement plus profond | Urgence douce | "Choisir un plan" |

### Templates

**J0 -- Welcome**
```
Subject: Bienvenue -- votre [espace/projet] est prêt
Hook: Vous êtes à 1 étape de [bénéfice principal].
Body: Voici comment démarrer :
  1. [Première action concrète]
  2. [Deuxième action]
CTA: Créer votre premier [X] ->
PS: Besoin d'aide ? Répondez directement à cet email.
```

**J1 -- Quick win**
```
Subject: Votre premier [résultat] en 2 minutes
Hook: La plupart des utilisateurs atteignent [résultat] dès le premier jour.
Body: Voici le chemin le plus court :
  [Instruction en 3 étapes]
CTA: Essayer maintenant ->
```

**J7 -- Feature unlock**
```
Subject: Vous n'avez pas encore essayé [feature]
Hook: [Feature] est la raison n°1 pour laquelle nos power users restent.
Body: En 30 secondes, vous pouvez [bénéfice].
  [Screenshot ou GIF]
CTA: Activer [feature] ->
```

## 4. Emails d'activation (vers le aha moment)

L'activation = l'utilisateur expérimente la valeur promise. Chaque SaaS doit définir son activation event.

| Signal | Action email | Timing |
|--------|-------------|--------|
| Signup sans action | Rappel de la 1ère étape | J1 |
| 1ère action faite, 2ème non | Guider vers l'étape suivante | J2 |
| Feature clé non utilisée après J3 | Email dédié à cette feature | J4 |
| Invitation team non faite | Rappel + bénéfice de la collaboration | J5 |
| Aha moment atteint | Féliciter + montrer le next level | Immédiat |

### Formule : Trigger -> Bénéfice -> Friction killer -> CTA

```
Trigger: Vous avez créé votre premier projet.
Bénéfice: Invitez votre équipe pour [bénéfice collaboration].
Friction killer: Ça prend 30 secondes, pas besoin qu'ils aient un compte.
CTA: Inviter mon équipe ->
```

## 5. Séquence Rétention / Engagement

Envoyée aux utilisateurs actifs pour augmenter la profondeur d'usage.

| Type | Fréquence | Contenu | CTA |
|------|-----------|---------|-----|
| Weekly digest | Hebdo | Résumé d'activité + métriques | "Voir le dashboard" |
| Feature announcement | Au lancement | Nouvelle feature + bénéfice | "Essayer" |
| Tips & tricks | Bi-mensuel | Astuce power user | "Appliquer cette astuce" |
| Milestone | Au déclenchement | "Vous avez atteint [X] !" | "Partager" ou "Passer au niveau suivant" |
| Community | Mensuel | Contenu généré par les utilisateurs | "Rejoindre la discussion" |

Règle : ne pas envoyer si l'utilisateur est déjà très actif. Segmenter par niveau d'engagement.

## 6. Séquence Win-back (utilisateurs inactifs)

| Jour post-inactivité | Email | Ton | Subject line |
|----------------------|-------|-----|-------------|
| J7 | Check-in doux | Empathique | "[Prénom], tout va bien ?" |
| J14 | Rappel de valeur | Informatif | "Ce qui a changé depuis votre dernier passage" |
| J21 | Social proof | Persuasif | "[Nombre] équipes ont adopté [feature] ce mois" |
| J30 | Offre / incentive | Direct | "30 % sur votre premier mois Pro" |
| J45 | Dernier email | Honnête | "On supprime les comptes inactifs dans 30 jours" |

### Template win-back J7
```
Subject: [Prénom], on peut vous aider ?
Hook: Vous n'êtes pas revenu depuis [durée]. Aucun jugement.
Body: Si quelque chose n'a pas fonctionné, répondez à cet email
  -- on lit tout et on répond personnellement.
  Si vous voulez reprendre :
CTA: Revenir à mon workspace ->
PS: On a ajouté [feature récente] depuis votre dernier passage.
```

## 7. Emails transactionnels -- Bonnes pratiques

| Email | Must-have | Erreur courante |
|-------|-----------|-----------------|
| Confirmation signup | Lien de vérification + 1ère étape | Trop de texte, CTA noyé |
| Reset password | Lien unique + expiration | Pas de mention de la durée de validité |
| Invoice / receipt | Montant + date + lien facture | PDF non attaché ou lien cassé |
| Usage alert | Seuil atteint + action recommandée | Ton alarmiste sans solution |
| Trial expiring | Jours restants + CTA upgrade | Envoyé trop tard (J14 au lieu de J10) |
| Plan change confirm | Nouveau plan + date d'effet + montant | Pas de récapitulatif clair |

Règle : les emails transactionnels doivent arriver en < 30 secondes. Pas de batch, envoi temps réel.

## 8. Métriques par type d'email

| Type | Open rate cible | CTR cible | Métrique clé |
|------|----------------|-----------|--------------|
| Welcome | 60-80 % | 20-30 % | Taux d'activation J1 |
| Onboarding | 40-60 % | 10-20 % | Taux d'activation J7 |
| Activation nudge | 30-50 % | 8-15 % | Feature adoption rate |
| Weekly digest | 25-40 % | 5-10 % | Rétention semaine suivante |
| Win-back | 15-25 % | 3-8 % | Taux de réactivation |
| Feature announcement | 30-45 % | 8-15 % | Feature adoption rate |
| Transactional | 80-95 % | N/A | Delivery rate, bounce rate |

## 9. Segmentation minimale

| Segment | Critère | Séquences à envoyer |
|---------|---------|---------------------|
| New signup | J0, aucune action | Onboarding complète |
| Activated | Aha moment atteint | Rétention + feature discovery |
| Power user | Usage > P75 | Milestones + community |
| At-risk | Activité en baisse > 50 % sur 2 semaines | Win-back soft |
| Churned | Inactif > 30 jours ou abo annulé | Win-back complet |
| Trial expiring | < 3 jours restants sur trial | Urgence + upgrade |

## 10. Anti-patterns

| Erreur | Impact | Correction |
|--------|--------|------------|
| Envoyer la même séquence à tous | Désabonnements massifs | Segmenter par comportement |
| Plusieurs CTA par email | Aucun clic | 1 email = 1 objectif = 1 CTA |
| Subject lines clickbait | Ouverture sans clic, confiance perdue | Promettre ce que l'email délivre |
| Pas de unsubscribe visible | Signalements spam, réputation sender dégradée | Lien unsub en bas, toujours |
| Envoyer trop tôt le matin / tard le soir | Open rate en baisse | Tester les créneaux, respecter la timezone |
| Email trop long | Abandon avant le CTA | 150 mots max pour les emails d'action |
| Pas de plain text fallback | Rendu cassé sur certains clients | Toujours générer une version plain text |
| Reply-to en noreply@ | Tue l'opportunité de feedback | Utiliser une vraie adresse monitorée |
| Pas de tracking UTM sur les liens | Impossible de mesurer le ROI | Taguer chaque lien CTA |
