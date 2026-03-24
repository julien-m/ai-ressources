# Usage-Based

Modele de pricing ou le client est facture proportionnellement a sa consommation reelle. Le revenu est directement correle a la valeur delivree.

## Definition

Le pricing usage-based (ou pay-as-you-go) facture le client en fonction d'une metrique de consommation : appels API, tokens, stockage, bande passante, messages, compute, etc. Le client ne paie que ce qu'il utilise.

## Metriques de facturation courantes

| Type de SaaS | Metrique de facturation | Exemple |
|--------------|------------------------|---------|
| API / IA | Tokens, requetes, appels API | OpenAI, Anthropic, Stripe |
| Infrastructure | Compute (vCPU-h), stockage (Go), bandwidth (Go) | AWS, Vercel, Cloudflare |
| Communication | Messages, minutes, emails envoyes | Twilio, SendGrid, Postmark |
| Data / Analytics | Lignes scannees, events ingeres, Go stockes | Snowflake, Datadog, Mixpanel |
| Media | Transcodes, minutes de video, images generees | Mux, Cloudinary |
| Automation | Executions, taches, workflows | Zapier, n8n Cloud |

### Choisir la bonne metrique

La metrique de facturation doit etre :

1. **Alignee sur la valeur** : plus le client consomme, plus il recoit de valeur
2. **Mesurable et transparente** : le client peut suivre sa consommation en temps reel
3. **Previsible** : le client peut estimer son cout avant de consommer
4. **Simple a comprendre** : une seule phrase pour l'expliquer

## Billing cycles

### Prepaid credits

Le client achete un pack de credits a l'avance, consomme, puis re-achete.

| Avantage | Inconvenient |
|----------|--------------|
| Cash flow positif (paiement en avance) | Friction a l'achat initial |
| Pas de bill shock | Credits expires = frustration |
| Engagement implicite | Sous-consommation = revenu "mort" |

**Exemples** : OpenAI (credits prepaid), Vercel (inclus dans le plan + overage).

### Post-paid (pay-as-you-go)

Le client consomme librement, facture en fin de periode.

| Avantage | Inconvenient |
|----------|--------------|
| Zero friction au demarrage | Risque de bill shock |
| Adoption maximale | Cash flow decale |
| Alignement parfait cout/valeur | Necessite un systeme de billing robuste |

**Exemples** : AWS, Twilio, Stripe (% de transaction).

### Hybride : committed + overage

Le client s'engage sur un volume minimum (commit), avec facturation des depassements au tarif unitaire.

| Avantage | Inconvenient |
|----------|--------------|
| Previsibilite pour les deux parties | Complexite du contrat |
| Remise sur le commit | Sous-utilisation du commit = perte pour le client |
| Revenu garanti pour le builder | Negociation enterprise necessaire |

**Exemples** : Datadog (commit annuel + overage), Snowflake (credits commites).

## Previsibilite des couts

### Le probleme central

Le reproche numero un du usage-based est l'imprevisibilite. Le client ne sait pas combien il paiera en fin de mois. Cela freine l'adoption, surtout en enterprise ou les budgets sont fixes.

### Solutions a implementer

| Solution | Description | Priorite |
|----------|-------------|----------|
| Estimateur de cout | Calculatrice interactive sur la page pricing | Critique |
| Dashboard temps reel | Consommation actuelle + projection fin de mois | Critique |
| Alertes de seuil | Notification a 50%, 80%, 100% du budget | Critique |
| Budget cap | Limite dure : le service s'arrete ou se degrade au-dela | Recommande |
| Facture projetee | Email hebdomadaire avec estimation de la facture | Recommande |
| Historique de consommation | Graphe de tendance sur 3-6 mois | Bon a avoir |

## Modeles hybrides : base fixe + usage variable

Le modele le plus courant en 2025-2026. Un abonnement de base garantit un revenu minimum et inclut un quota, le depassement est facture a l'usage.

### Structure type

```
Plan Pro : 49 EUR/mois
  Inclus : 10 000 requetes API
  Au-dela : 0.003 EUR / requete
```

### Exemples de modeles hybrides

| Produit | Base fixe | Quota inclus | Overage |
|---------|-----------|-------------|---------|
| Vercel | 20 USD/mois (Pro) | 1 To bandwidth, 100 Go-h compute | Facturation au Go / Go-h |
| OpenAI API | 0 USD (pay-as-you-go) ou tiers avec credits | Selon le tier | Par token (input/output) |
| Twilio | 0 USD (pas de base) | Aucun | Par message / minute |
| Cloudflare Workers | 5 USD/mois (Paid) | 10M requetes | 0.30 USD / M requetes |
| Stripe | 0 USD (pas de base) | Aucun | 2.9% + 0.30 USD par transaction |
| Supabase | 25 USD/mois (Pro) | 8 Go DB, 250 Go bandwidth | Par Go supplementaire |

### Pourquoi l'hybride domine

- **Pour le builder** : revenu de base previsible + expansion revenue via usage
- **Pour le client** : cout de base clair + flexibilite de consommation
- **Meilleur des deux mondes** : previsibilite du flat + alignement valeur du usage

## Metering : comment instrumenter

### Architecture de metering

1. **Capture d'events** : chaque action facturable emet un event (API call, token consomme, Go stocke)
2. **Aggregation** : les events sont agreges par periode (horaire, journaliere, mensuelle)
3. **Rating** : application du tarif unitaire sur le volume agrege
4. **Billing** : generation de la facture en fin de periode

### Outils et approches

| Approche | Description | Adapte pour |
|----------|-------------|-------------|
| Compteurs applicatifs | Incrementer un compteur dans l'app a chaque event | MVP, faible volume |
| Event streaming | Kafka/SQS pour les events, aggregation asynchrone | Scale, fiabilite |
| Service de metering dedie | Amberflo, Metronome, Orb, Lago | Billing complexe, multi-metrique |
| Time-series DB | InfluxDB, TimescaleDB pour stocker les mesures | Usage infra (compute, storage) |

### Bonnes pratiques

- **Idempotence** : un event re-envoye ne doit pas etre compte deux fois
- **Near-real-time** : le dashboard client doit refleter l'usage avec < 5 min de delai
- **Audit trail** : chaque event facturable doit etre tracable et contestable
- **Graceful degradation** : si le metering est down, ne pas bloquer le service client

## Anti-patterns

| Anti-pattern | Consequence | Correction |
|--------------|-------------|------------|
| Usage imprevisible sans alertes | Bill shock, churn immediat | Alertes + budget cap + estimateur |
| Metrique non alignee sur la valeur | Le client paie plus sans recevoir plus de valeur | Revoir la metrique (ex: events vers users actifs) |
| Pas de quota inclus (pur pay-as-you-go) | Revenu a zero si le client n'utilise pas | Base fixe avec quota minimum |
| Tarif unitaire opaque | Le client ne peut pas estimer son cout | Calculatrice + exemples concrets |
| Pas de commit discount | Les gros clients paient le meme tarif unitaire | Paliers de remise volume |
| Metering imprecis ou decale | Contestations de factures, perte de confiance | Near-real-time + audit trail |
| Granularite trop fine | Micro-factures incomprehensibles | Agreger par jour ou par mois |

## Table comparative

| Dimension | Pure usage | Hybride (base + usage) | Tiered (plans fixes) |
|-----------|-----------|----------------------|---------------------|
| Alignement valeur | Parfait | Bon | Moyen (steps) |
| Previsibilite client | Faible | Bonne | Parfaite |
| Previsibilite revenu | Faible | Bonne | Forte |
| Friction d'adoption | Faible (pas d'engagement) | Moyenne (abonnement) | Moyenne a forte |
| Expansion revenue | Forte (organique) | Forte | Limitee (upsell par tier) |
| Bill shock risk | Eleve | Modere (quota inclus) | Nul |
| Complexite billing | Elevee | Moyenne | Faible |
| Adapte a l'enterprise | Moyen (budgets fixes) | Bon (commit possible) | Bon |

## Quand choisir usage-based

| Critere | Usage-based adapte | Usage-based non adapte |
|---------|-------------------|----------------------|
| Consommation variable entre clients | Oui (10x de difference courante) | Non (tous les clients consomment pareil) |
| Valeur proportionnelle a l'usage | Oui (plus d'API calls = plus de valeur) | Non (valeur fixe quel que soit l'usage) |
| Metrique de consommation claire | Oui (tokens, requetes, Go) | Non (pas de metrique evidente) |
| Audience technique | Oui (developpeurs, ops) | Moyen (audience non-tech, besoin de simplicite) |
| Produit infra / API | Oui (standard du marche) | Moins pertinent pour du SaaS end-user |
| Objectif PLG | Oui (pas de friction initiale) | Neutre |

### Decision rapide

- **Choisir pure usage** pour les API et l'infra a forte variance de consommation (Twilio, Stripe).
- **Choisir hybride** pour les SaaS B2B avec une base de fonctionnalites + une composante variable (modele dominant 2025-2026).
- **Eviter pure usage** si l'audience a besoin de previsibilite budgetaire ou si la metrique de consommation n'est pas intuitive.
- **Toujours implementer** : estimateur de cout, alertes de seuil, dashboard temps reel.

## Voir aussi
- [CGV SaaS](../legal/cgv-saas.md) — facturation à l'usage et conditions
- [Rate limiting](../architecture/rate-limiting.md) — contrôle de la consommation
- [Merchant of Record](../legal/merchant-of-record.md) — délégation de la facturation complexe
