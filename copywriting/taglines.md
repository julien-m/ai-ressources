# Taglines et Propositions de Valeur

Frameworks pour créer, tester et itérer sur les taglines, headlines et propositions de valeur d'un produit SaaS.

## 1. Frameworks de positionnement

### 1.1 Formule XYZ

```
Nous aidons [X] à [Y] sans [Z].
```

| Composant | Rôle | Exemple |
|-----------|------|---------|
| X | Persona cible | "les équipes engineering" |
| Y | Résultat désiré | "déployer en continu" |
| Z | Friction éliminée | "gérer de l'infra" |

Résultat : "Nous aidons les équipes engineering à déployer en continu sans gérer d'infra."

### 1.2 Before / After

| Avant (douleur) | Après (transformation) |
|-----------------|----------------------|
| "Des heures de config YAML" | "Un git push, c'est en prod" |
| "Des dashboards éparpillés" | "Toutes vos métriques en un écran" |
| "Des emails qui finissent en spam" | "98.7% de deliverability" |

Formule headline : **"De [avant] à [après]"** ou **"Fini [avant]. Place à [après]."**

### 1.3 Test "So What?"

Appliquer 3 fois le test "Et alors ?" pour descendre au bénéfice réel :

| Niveau | Affirmation | So what? |
|--------|-------------|----------|
| Feature | "On a un CDN edge" | Et alors ? |
| Avantage | "Vos pages chargent plus vite" | Et alors ? |
| Bénéfice | "Vous convertissez plus de visiteurs en clients" | Bénéfice réel |

Toujours écrire au niveau bénéfice dans le headline. La feature va dans le body.

### 1.4 Formule "Only We"

```
Seul [Produit] permet de [action] parce que [différenciateur unique].
```

Si la phrase fonctionne aussi avec le nom d'un concurrent, le différenciateur n'est pas réel. Recommencer.

## 2. Formules de taglines

### 2.1 Par type syntaxique

| Type | Formule | Exemple | SaaS |
|------|---------|---------|------|
| Impératif | "[Verbe] + [objet/bénéfice]" | "Build better products" | Amplitude |
| Question | "[Douleur] ?" | "Where does the time go?" | Toggl |
| Déclaration | "[Produit] is [catégorie redéfinie]" | "Linear is a better way to build software" | Linear |
| Contraste | "[Pas X]. [Y]." | "Not a CRM. A revenue platform." | -- |
| Triptyque | "[Verbe]. [Verbe]. [Verbe]." | "Develop. Preview. Ship." | Vercel |
| Métaphore | "[Concept familier] pour [domaine]" | "GitHub for design" | -- |
| Chiffre | "[Metric] + [contexte]" | "50ms global latency" | -- |
| Persona + catégorie | "[Catégorie] for [persona]" | "Email for developers" | Resend |

### 2.2 Formules headline éprouvées

| Formule | Template | Exemple |
|---------|----------|---------|
| Le [superlatif] [catégorie] pour [persona] | "The fastest database for serverless apps" | -- |
| [Verbe] [objet] [adverbe de facilité] | "Send emails effortlessly" | -- |
| [Résultat] sans [friction] | "Scale without complexity" | -- |
| Tout [catégorie] en un seul [endroit] | "All your tools in one workspace" | -- |
| [Action] en [temps impossible] | "Deploy in 30 seconds" | -- |
| Le [catégorie] qui [différenciateur] | "The CRM that sells for you" | -- |

## 3. Value Proposition Canvas

| Bloc | Question | Sortie attendue |
|------|----------|-----------------|
| Customer Jobs | Que fait le client au quotidien ? | Liste de 3-5 tâches clés |
| Pains | Qu'est-ce qui rend ces tâches pénibles ? | 3-5 frustrations concrètes |
| Gains | Quel serait l'état idéal ? | 3-5 résultats désirés |
| Products & Services | Qu'offre-t-on concrètement ? | Features principales |
| Pain Relievers | Comment on élimine chaque douleur ? | Mapping pain -> feature |
| Gain Creators | Comment on crée chaque gain ? | Mapping gain -> feature |

### Synthèse en 1 phrase

```
[Produit] aide [persona] à [gain principal] en [mécanisme] au lieu de [pain éliminé].
```

## 4. Hiérarchie de titres sur une landing

| Niveau | Rôle | Longueur | Exemple |
|--------|------|----------|---------|
| H1 (tagline) | Promesse principale, capte en < 5 sec | 3-10 mots | "Financial infrastructure for the internet" |
| H2 (subheadline) | Clarifier et qualifier | 10-25 mots | "Millions of companies use Stripe to accept payments, send payouts, and manage their businesses online" |
| Supporting copy | Détailler pour les sceptiques | 1-2 phrases | Preuve, mécanisme, ou différenciateur |

### Règles de hiérarchie

- Le H1 doit fonctionner **seul** (sans lire le H2)
- Le H2 ne doit pas répéter le H1 -- il ajoute une dimension (persona, mécanisme, chiffre)
- Le supporting copy est optionnel -- si le H1 + H2 suffisent, ne pas en ajouter
- Jamais de jargon dans le H1. Le H2 peut introduire un terme technique si la cible est tech

## 5. A/B testing de taglines

### Quoi tester

| Variable | Variantes types |
|----------|----------------|
| Angle | Bénéfice vs feature, douleur vs aspiration |
| Longueur | Court (3-5 mots) vs explicite (8-12 mots) |
| Ton | Formel vs conversationnel, audacieux vs rassurant |
| Persona | Générique vs niche ("pour les devs" vs "pour les équipes") |
| Chiffre | Avec vs sans metric ("10x faster" vs "Blazing fast") |
| CTA couplé | Le headline influence le taux de clic sur le CTA |

### Protocole minimal

| Étape | Action |
|-------|--------|
| 1 | Définir la métrique : CTR du CTA hero, ou taux de scroll > 50 % |
| 2 | Écrire 2-3 variantes max (pas 10) |
| 3 | Splitter 50/50 le trafic |
| 4 | Attendre la significativité statistique (min. 1 000 visiteurs par variante) |
| 5 | Analyser au-delà du CTR : le headline qui convertit le plus en signup gagne |

### Quick tests sans trafic

| Méthode | Comment |
|---------|---------|
| Test des 5 secondes | Montrer la page 5 sec, demander "c'est quoi ce produit ?" |
| Fake door test | Lander avec variante + CTA, mesurer les clics |
| Social media poll | Poster 2-3 variantes, mesurer engagement |
| Customer interviews | Lire le headline, demander de reformuler dans ses mots |

## 6. Exemples de référence

| SaaS | Tagline | Analyse |
|------|---------|---------|
| Stripe | "Financial infrastructure for the internet" | Positionnement catégorie, ambition maximale |
| Linear | "Linear is a better way to build software" | Comparaison implicite, clarté |
| Vercel | "Develop. Preview. Ship." | Triptyque d'action, process simplifié |
| Notion | "Your wiki, docs, & projects. Together." | Agrégation de valeur, simplicité |
| Figma | "Nothing great is made alone" | Émotion + collaboration comme valeur core |
| Superhuman | "The fastest email experience ever made" | Superlatif + catégorie + craft |
| Raycast | "Your shortcut to everything" | Métaphore + universalité |
| Resend | "Email for developers" | 3 mots, persona + catégorie |
| Cal.com | "Scheduling infrastructure for everyone" | Calque Stripe, open source + ambition |
| Supabase | "The open source Firebase alternative" | Positionnement par rapport au leader |

### Patterns récurrents des meilleures taglines

1. **Moins de 8 mots** -- la concision force la clarté
2. **Un seul concept** -- pas deux promesses
3. **Pas de jargon** -- compréhensible par un non-expert
4. **Orienté résultat ou identité** -- pas orienté feature
5. **Mémorisable à voix haute** -- test : peut-on la citer de mémoire ?

## 7. Anti-patterns

| Erreur | Exemple | Pourquoi c'est mauvais | Correction |
|--------|---------|----------------------|------------|
| Vague / creux | "Innovate faster" | Ne dit rien sur le produit | Nommer le bénéfice concret |
| Jargon interne | "AI-powered synergy platform" | Incompréhensible | Traduire en langage client |
| Feature en headline | "Real-time WebSocket sync" | Le client s'en fiche | "Changes appear instantly for everyone" |
| Trop long | "The all-in-one platform that helps teams collaborate better and ship faster with AI" | Impossible à retenir | Couper à 1 idée, 8 mots max |
| Copier un concurrent | "The Notion for X" | Crée de la dépendance, pas d'identité propre | Trouver son propre angle |
| Superlatif non prouvé | "The best project management tool" | Personne ne le croit | Remplacer par un chiffre ou une preuve |
| Axé entreprise | "We build cutting-edge solutions" | Le client veut savoir ce que ça lui apporte | Reformuler en "vous" |
| Multiples promesses | "Fast, secure, and scalable" | Aucune ne ressort | Choisir la promesse n1 |

## 8. Checklist tagline

- [ ] Compréhensible en < 3 secondes par quelqu'un hors de l'équipe
- [ ] Répond à "c'est quoi ce produit et pourquoi je m'en soucie ?"
- [ ] Fonctionne sans contexte visuel (lisible dans un tweet, un email, un pitch)
- [ ] Ne contient pas de jargon ni de buzzword
- [ ] Différente de ce qu'un concurrent pourrait écrire mot pour mot
- [ ] Passe le test "So What?" (niveau bénéfice, pas feature)
- [ ] Mémorisable après une seule lecture
- [ ] Le H2 ajoute une info, ne répète pas le H1
- [ ] Testée auprès de 3+ personnes de la cible

## Voir aussi
- [Landing page copywriting](landing-page.md) — intégration des taglines dans la page
- [SEO programmatique](../seo/programmatic.md) — taglines et title tags
