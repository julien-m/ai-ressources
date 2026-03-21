# Freemium

Modele de pricing ou un tier gratuit permanent sert de moteur d'acquisition, avec monetisation sur les tiers payants.

## Definition et variantes

| Variante | Principe | Exemple |
|----------|----------|---------|
| Feature-limited | Acces gratuit avec fonctionnalites restreintes | Notion (pas de permissions avancees en free) |
| Usage-limited | Acces complet mais plafond de volume | Slack (limite 90 jours d'historique) |
| Time-limited trial | Acces complet pendant X jours, puis downgrade | Superhuman (14 jours) |
| Reverse trial | Acces complet des le depart, puis downgrade au free apres X jours | Ahrefs, Loom |

### Reverse trial vs free trial classique

La reverse trial est la variante la plus efficace en 2025-2026. L'utilisateur decouvre la valeur complete avant de perdre l'acces. Le taux de conversion est 2 a 3x superieur au freemium classique car l'utilisateur ressent la perte (loss aversion).

## Design du tier gratuit

### Quoi offrir gratuitement

- Les fonctionnalites qui generent de l'habitude et de la dependance (core loop)
- Suffisamment de valeur pour que l'utilisateur integre le produit dans son workflow
- Les fonctionnalites virales (partage, collaboration limitee, embed)

### Quoi reserver au payant

- Les fonctionnalites d'equipe et de collaboration avancee
- Les integrations et automatisations
- L'analytics, le reporting, l'audit
- Le support prioritaire
- Les limites de volume elevees

### Table de repartition

| Categorie | Gratuit | Payant |
|-----------|---------|--------|
| Utilisateurs | 1 (ou usage personnel) | Multi-users, equipes |
| Stockage / volume | Limite basse (ex: 5 Go, 1000 lignes) | Limite haute ou illimite |
| Fonctionnalites core | Oui | Oui |
| Collaboration | Basique (vue seule, partage) | Permissions, commentaires, workflows |
| Integrations | 0-2 | Toutes |
| Support | Communaute / docs | Email, chat, SLA |
| Branding | Watermark / "Made with X" | Marque blanche |

## Feature gating strategies

| Strategie | Mecanique | Impact UX | Conversion |
|-----------|-----------|-----------|------------|
| Hard wall | Fonctionnalite invisible ou verrouillee | Frustration si mal calibre | Elevee si la feature est desiree |
| Soft wall | Fonctionnalite visible, teaser cliquable avec upgrade prompt | Decouverte de la valeur | Moderee, bon ratio decouverte/friction |
| Usage cap | Fonctionnalite disponible, compteur qui decroit | Naturel, pas de friction initiale | Progressive, monte avec l'usage |

**Recommandation** : combiner soft wall (pour les features premium) + usage cap (pour le volume). Le hard wall est reserve aux features enterprise (SSO, audit, SCIM).

## Triggers de conversion

### Moments cles pour pousser vers le payant

1. **Atteinte d'un plafond** : l'utilisateur atteint la limite du free (ex: 3 projets Figma)
2. **Besoin de collaboration** : invitation d'un collegue, besoin de partage avance
3. **Moment de succes** : l'utilisateur vient d'accomplir quelque chose (ex: premier deploy reussi)
4. **Decouverte contextuelle** : l'utilisateur tente une action premium dans son workflow naturel
5. **Reverse trial expiration** : notification de downgrade imminent avec rappel de ce qui sera perdu

### Mecaniques de nudge

- Banner contextuel (pas de popup intrusif)
- Email de recap d'usage avec projection ("vous avez utilise 80% de votre quota")
- Comparaison avant/apres dans l'UI ("votre equipe a cree 47 docs ce mois — passez a Team pour collaborer")
- Offre limitee dans le temps sur le premier mois (20-30% de reduction)

## Metriques cles

| Metrique | Benchmark | Objectif |
|----------|-----------|----------|
| Free-to-paid conversion rate | 2-5% (B2B SaaS) | > 4% |
| Activation rate (free users) | 20-40% | > 30% |
| Time-to-first-value | < 5 min ideal | Minimiser |
| Time-to-upgrade | 14-90 jours | Optimiser (pas forcer) |
| Viral coefficient (free) | > 0.5 | Maximiser |
| Cost-to-serve free users | < 5% du revenu total | Controler |

**Regle critique** : si le cout de service des free users depasse 10-15% du revenu, le tier gratuit est trop genereux ou le produit n'est pas adapte au freemium.

## Exemples concrets

| Produit | Modele free | Levier de conversion | Conversion estimee |
|---------|-------------|----------------------|--------------------|
| Notion | Genereux pour individuel, limite equipe | Collaboration + permissions | ~4% |
| Slack | Historique 90 jours, pas d'apps illimitees | Historique + integrations | ~3% |
| Figma | 3 projets, 3 pages par projet | Nombre de projets | ~4-5% |
| Vercel | Hobby tier, 1 membre | Equipe + usage | ~2-3% |
| Canva | Templates limites, pas de brand kit | Brand kit + resize magique | ~4% |
| Zoom | 40 min par meeting (free) | Duree illimitee | ~3-4% |

## Anti-patterns

| Anti-pattern | Symptome | Correction |
|--------------|----------|------------|
| Free tier trop genereux | Conversion < 1%, masse de free users couteux | Reduire le free, ajouter des limites d'usage |
| Free tier trop restrictif | Pas d'adoption, onboarding abandonne | Elargir le free pour atteindre la valeur core |
| Pas de friction naturelle | L'utilisateur n'atteint jamais les limites | Ajuster les plafonds a 80% de l'usage moyen |
| Upgrade wall au mauvais moment | Churn du free tier, frustration | Placer les walls apres un moment de succes |
| Pas de tracking du free tier | Impossible d'optimiser | Instrumenter activation, usage, feature discovery |

## Freemium vs free trial : table decisionnelle

| Critere | Freemium | Free trial |
|---------|----------|------------|
| Produit viral / reseau | Freemium | - |
| Cout marginal par user bas | Freemium | - |
| Valeur immediate evidente | - | Free trial |
| Audience technique (self-serve) | Freemium | - |
| Produit complexe / formation necessaire | - | Free trial + onboarding |
| Sales-led / enterprise | - | Free trial |
| PLG (product-led growth) | Freemium | - |

### Decision rapide

- **Choisir freemium** si le produit a un effet reseau, un cout marginal faible, et une valeur decouverte progressivement.
- **Choisir free trial** si la valeur est immediate mais complexe, ou si le cycle de vente est assiste.
- **Choisir reverse trial** si le produit est entre les deux : valeur forte mais decouverte necessaire.
