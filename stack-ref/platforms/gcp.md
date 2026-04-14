---
last_updated: 2026-03-16
confidence: high
category: platform
type: managed
pricing_model: [per-usage]
free_tier: true
---

# GCP (Google Cloud Platform)

> _Cloud Google — Cloud Run, GCS, Cloud SQL, BigQuery, Firebase, Vertex AI._

## Ce que c'est
Google Cloud Platform est la plateforme cloud de Google, 3e acteur mondial (~11% de marché). Forte en IA/ML (Vertex AI, TPUs), analytics (BigQuery), et containers (GKE, Cloud Run). Firebase est construit dessus. Free tier toujours disponible (pas limité à 12 mois comme AWS).

## Produits clés
| Service | Équivalent AWS | Usage |
|---|---|---|
| Cloud Run | Lambda + Fargate | Containers serverless |
| Cloud Functions | Lambda | Serverless functions |
| GCS | S3 | Object storage |
| Cloud SQL | RDS | Postgres/MySQL managé |
| Firestore | DynamoDB | NoSQL (Firebase) |
| BigQuery | Athena/Redshift | Analytique |
| Vertex AI | SageMaker | ML/LLM |
| Pub/Sub | SQS/SNS | Messages |
| Cloud Run Jobs | Batch | Jobs éphémères |

## Free Tier (Always Free)
| Service | Limite |
|---|---|
| Cloud Run | 2M req/mois + 360K vCPU-sec + 180K GB-sec |
| Cloud Functions | 2M invocations/mois |
| GCS | 5 GB (us-east1 uniquement) |
| Firestore | 1 GB + 50K lectures + 20K écritures/jour |
| BigQuery | 1 TB queries/mois + 10 GB storage |
| Cloud Build | 120 min/jour |

## Pricing (sélection)
### Cloud Run
| Métrique | Inclus | Tarif |
|---|---|---|
| CPU | 180K vCPU-sec/mois | $0.00002400/vCPU-sec |
| RAM | 360K GB-sec/mois | $0.00000250/GB-sec |
| Requêtes | 2M/mois | $0.40/M |

> **Exemple :** API 5M req, 256MB, 100ms → ~$3/mo

### GCS (Storage, multi-région EU)
| Classe | Prix/GB-mois | Egress |
|---|---|---|
| Standard | $0.026 | $0.12/GB |
| Nearline | $0.010 | $0.12/GB |
| Coldline | $0.004 | $0.12/GB |
| Archive | $0.0012 | $0.12/GB |

### Cloud SQL (PostgreSQL, eu-west1)
| Instance | vCPU | RAM | Prix/heure | Prix/mois |
|---|---|---|---|---|
| db-f1-micro | 0.2 | 0.6 GB | $0.019 | ~$13.87 |
| db-g1-small | 0.5 | 1.7 GB | $0.050 | ~$36.50 |
| db-n1-standard-1 | 1 | 3.75 GB | $0.106 | ~$77.38 |

Storage Cloud SQL : $0.170/GB-mois.

### 💡 Exemples de calcul GCP
- **API Cloud Run (free tier)** → $0/mo (2M req gratuites)
- **API Cloud Run 10M req, 512MB, 200ms** → ~$8/mo
- **App complète (Cloud Run + Cloud SQL small + GCS 20GB)** → ~$60-80/mo

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : Cloud Run + Cloud SQL + GCS · région europe-west1 (Belgique)

| Palier | Users | Config | Coût estimé | Notes |
|--------|-------|--------|-------------|-------|
| **Perso / interne** | — | Cloud Run free tier | **$0** | 2M req/mois + 360k vCPU-sec gratuits |
| **Early stage** | ~1k | Cloud Run + Cloud SQL f1-micro | **$5–20/mo** | SQL micro ~$14/mo, Cloud Run quasi-gratuit |
| **Growth** | ~10k | Cloud Run autoscale + Cloud SQL g1-small | **$40–80/mo** | SQL $37 + Cloud Run $10–30 |
| **Scale** | ~100k | Cloud Run + Cloud SQL standard-1 | **$120–250/mo** | SQL $77 + Cloud Run scale + GCS |
| **Hyper-scale** | ~1M+ | Cloud Run + Cloud SQL HA + Memorystore | **$500–1500+/mo** | Committed use discounts -20–57% |

> 💡 **Cloud Run avantage** : scale to zero natif, facturation à la requête. Idéal pour apps avec trafic variable.
>
> 💡 **Committed use discounts** : -20% (1 an) à -57% (3 ans) sur Cloud SQL. Pertinent dès production stable.
## ✅ Quand utiliser
- **Cloud Run** : déploiement container serverless facile (excellent DX)
- IA/ML avec Vertex AI ou accès aux modèles Gemini
- Analytics avec BigQuery (très puissant et cheap)
- Déjà dans l'écosystème Google (Firebase, Workspace)
## ❌ Quand ne PAS utiliser
- Simplicité absolue (Fly.io ou Cloudflare sont plus simples)
- Données EU strictes (GCP héberge bien en EU mais propriétaire US)
- Préférence AWS déjà en place

## Régions EU
| Code | Localisation |
|---|---|
| europe-west1 | Belgique 🇧🇪 |
| europe-west3 | Francfort 🇩🇪 |
| europe-west4 | Pays-Bas 🇳🇱 |
| europe-west9 | Paris 🇫🇷 |
| europe-north1 | Finlande 🇫🇮 |
## Ressources
- [Cloud Run pricing](https://cloud.google.com/run/pricing)
- [GCP Pricing Calculator](https://cloud.google.com/products/calculator)
- [Free tier details](https://cloud.google.com/free)
