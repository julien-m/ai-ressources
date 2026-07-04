# Landing Page SaaS

Guide de copywriting pour pages d'atterrissage SaaS. Structures, formules, patterns et anti-patterns pour maximiser la conversion.

## 1. Structure type d'une landing SaaS

| Section | Objectif | Position |
|---------|----------|----------|
| Hero | Capter l'attention, communiquer la promesse en < 5 sec | Above the fold |
| Social proof bar | Crédibiliser immédiatement (logos, chiffres) | Juste sous le hero |
| Problème | Montrer qu'on comprend la douleur du visiteur | Section 2 |
| Solution / Features | Présenter le produit comme réponse au problème | Section 3 |
| How it works | Réduire la friction cognitive (3 étapes max) | Section 4 |
| Témoignages | Preuve sociale détaillée (citations, cas d'usage) | Section 5 |
| Pricing | Transparence, ancrage de valeur | Section 6 |
| FAQ | Traiter les objections restantes | Section 7 |
| CTA final | Dernier appel à l'action, rappel de la promesse | Footer |

Chaque section doit pouvoir se lire indépendamment. Un visiteur qui scroll vite doit saisir la proposition de valeur en lisant uniquement les titres H2.

## 2. Formules Hero

### 2.1 PAS (Problem-Agitate-Solve)

| Étape | Rôle | Exemple |
|-------|------|---------|
| Problem | Nommer le problème | "Vos deploys prennent des heures" |
| Agitate | Amplifier la douleur | "Pendant ce temps, vos concurrents shippent 10x plus vite" |
| Solve | Introduire la solution | "Déployez en 30 secondes avec [Produit]" |

### 2.2 AIDA (Attention-Interest-Desire-Action)

| Étape | Rôle | Exemple |
|-------|------|---------|
| Attention | Hook visuel ou textuel | "Zero downtime. Every deploy." |
| Interest | Détailler le bénéfice | "Atomic deploys avec rollback instantané" |
| Desire | Créer l'envie | "Rejoint par 5 000+ équipes engineering" |
| Action | CTA clair | "Start deploying free" |

### 2.3 BAB (Before-After-Bridge)

| Étape | Rôle | Exemple |
|-------|------|---------|
| Before | Situation actuelle (douleur) | "Des heures perdues en config YAML" |
| After | Situation idéale | "Un push git, c'est en prod" |
| Bridge | Le produit est le pont | "[Produit] automatise tout le pipeline" |

## 3. Above the fold -- les 5 éléments obligatoires

Tout doit être visible **sans scroller** sur desktop (viewport ~900px) :

1. **Headline** -- proposition de valeur en 1 phrase (< 12 mots)
2. **Subheadline** -- bénéfice concret ou clarification (1-2 lignes)
3. **CTA principal** -- bouton unique, contrasté, action claire
4. **Visual** -- screenshot produit, vidéo, ou illustration
5. **Social proof minimal** -- logos ou métrique sourcée, placée sous le hero si elle encombre le premier écran

Interdit above the fold : menu déroulant complexe, slider, vidéo autoplay avec son, formulaire > 2 champs, feature bullets, pricing teaser, trust strip dans le hero.

## 4. CTA -- Patterns de boutons

### Formule : [Verbe d'action] + [Bénéfice/Objet] + [Réducteur de friction]

| Pattern | Exemple | Pourquoi ça marche |
|---------|---------|-------------------|
| Verbe + objet | "Start building" | Action claire |
| Verbe + bénéfice | "Ship faster today" | Résultat immédiat |
| Verbe + gratuit | "Try free for 14 days" | Réduit le risque |
| Impératif + spécifique | "Deploy your first app" | Concret et personnel |
| Négatif inversé | "Stop wasting time on deploys" | Douleur comme levier |

### CTA primaire vs secondaire

| CTA | Style | Exemple |
|-----|-------|---------|
| Primaire | Bouton plein, couleur forte | "Get started free" |
| Secondaire | Bouton ghost ou lien | "See how it works" / "Book a demo" |

### Mots à éviter dans les CTA

| Mot faible | Alternative forte |
|------------|-------------------|
| Submit | Get my report |
| Click here | Start building |
| Learn more | See pricing / Watch demo |
| Sign up | Create your workspace |
| Buy now | Start free trial |

## 5. Social proof -- Patterns

| Type | Quand l'utiliser | Format |
|------|------------------|--------|
| Logo bar | > 3 clients reconnaissables | 4-6 logos, niveaux de gris, alignés |
| Metric | Chiffres impressionnants disponibles | "50K+ deployments/month" |
| Testimonial court | Besoin de crédibilité humaine | Citation + photo + nom + titre + entreprise |
| Case study CTA | Audience enterprise | "See how [Client] reduced deploy time by 80%" |
| Badge/certification | Secteur réglementé | SOC2, GDPR, ISO |
| Star rating | Présence sur marketplace/review site | "4.8/5 on G2 (500+ reviews)" |

Règle : la preuve sociale la plus forte possible le plus tôt possible. Logos en premier, témoignages détaillés plus bas.

## 6. Features -- Benefit-first vs Feature-first

### Benefit-first (recommandé pour la majorité)

```
H3: Ship 10x faster          <- bénéfice
Body: Automatic CI/CD...     <- feature en support
```

### Feature-first (acceptable pour audience technique)

```
H3: Edge Functions            <- feature
Body: Run code at the edge... <- bénéfice en support
```

### Structure d'un bloc feature

| Élément | Rôle |
|---------|------|
| Icône ou illustration | Ancrage visuel |
| Titre (benefit-first) | Résumer en 3-5 mots |
| Description | 1-2 phrases maximum |
| Proof point (optionnel) | Metric ou mini-témoignage |

Limiter à 3-6 features sur la landing. Trop de features = aucune ne ressort.

## 7. Pricing section -- Règles de copy

| Règle | Détail |
|-------|--------|
| Ancrage | Mettre le plan recommandé au centre ou le mettre en évidence |
| Nommage | Noms orientés persona ("Starter", "Team", "Enterprise"), pas technique |
| Comparaison | Lister les features par plan, check/cross visible |
| CTA par plan | Chaque plan a son bouton avec un verbe adapté |
| Réducteur de friction | "No credit card required", "Cancel anytime" sous le CTA |
| Fréquence | Afficher mois/an avec toggle, mettre en avant l'annuel (économie visible) |

## 8. Exemples de référence

| SaaS | Hero headline | Technique |
|------|---------------|-----------|
| Stripe | "Financial infrastructure for the internet" | Positionnement catégorie, ambition |
| Linear | "Linear is a better way to build software" | Comparaison implicite, clarté |
| Vercel | "Develop. Preview. Ship." | Triptyque verbal, process simplifié |
| Notion | "Your wiki, docs, & projects. Together." | Agrégation de valeur |
| Raycast | "Your shortcut to everything" | Métaphore + universalité |
| Resend | "Email for developers" | Persona + catégorie en 3 mots |

## 9. Anti-patterns

| Erreur | Pourquoi c'est un problème | Correction |
|--------|---------------------------|------------|
| Hero sans CTA | Le visiteur ne sait pas quoi faire | Toujours un bouton above the fold |
| Headline vague ("Innovate faster") | Ne dit rien sur le produit | Nommer le bénéfice concret |
| Trop de CTA concurrents | Paradoxe du choix, conversion en baisse | 1 CTA primaire + 1 secondaire max |
| Features sans bénéfice | Le visiteur ne comprend pas pourquoi s'en soucier | Toujours lier feature -> impact |
| Mur de texte | Personne ne lit un paragraphe de 10 lignes | Phrases courtes, bullets, espacement |
| Pas de social proof | Aucune raison de faire confiance | Minimum un signal de crédibilité |
| Stock photos génériques | Détruit la crédibilité | Screenshots produit ou illustrations custom |
| Slider/carousel en hero | Personne ne voit les slides 2+ | Un message fort, pas cinq faibles |
| Jargon interne | Le visiteur n'a pas le contexte | Tester le headline sur quelqu'un hors équipe |
| Plusieurs CTA pour la même intention | Donne l'impression d'un template et dilue l'action | Choisir un seul libellé par intention |
| Preuve sociale fake-perfect | Semble générée ou invérifiable | Utiliser chiffres sourcés, organiques, ou supprimer |
| Placeholder générique | Casse la crédibilité | Employer noms, métiers, entreprises et données du domaine |

## 10. Checklist pré-publication

- [ ] Le headline est compréhensible en < 5 secondes par quelqu'un qui ne connaît pas le produit
- [ ] Un CTA est visible above the fold
- [ ] Au moins un élément de social proof est présent dans les 2 premières sections
- [ ] Chaque feature est liée à un bénéfice utilisateur
- [ ] Le pricing est transparent (pas de "Contact us" sauf Enterprise)
- [ ] La page se lit correctement en ne lisant que les titres H2/H3
- [ ] Mobile : le hero est lisible et le CTA est tapable au pouce
- [ ] Temps de chargement < 3 secondes (LCP)
- [ ] Aucun lien externe dans le corps (garder le visiteur sur la page)
- [ ] Le CTA final reprend la promesse hero avec une formulation différente
- [ ] Aucun CTA ne wrap sur desktop
- [ ] Aucune donnée parfaite ou placeholder générique n'est visible

## Voir aussi
- [Landing pages design](../design/references/landing-pages.md) — conventions visuelles par type de produit
- [SEO technique Next.js](../seo/technical-nextjs.md) — optimisation technique de la landing
- [Pricing models](../pricing-models/) — choix du modèle de tarification à présenter
- [Core Web Vitals](../seo/core-web-vitals.md) — performance de la page
