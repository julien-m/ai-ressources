---
last_updated: 2026-03-16
confidence: high
category: platform
type: managed
pricing_model: [per-usage]
free_tier: true
---

# AWS (Amazon Web Services)

> _Le cloud leader mondial — Lambda, S3, RDS, EC2, DynamoDB, et 200+ services._

## Ce que c'est

AWS est la plateforme cloud d'Amazon, leader mondial (~33% de part de marché). 200+ services. Présent dans 30+ régions. Free tier généreux pendant 12 mois (certains services toujours gratuits). Très utilisé par les startups et enterprises. Complexe à maîtriser mais puissant.

## Produits clés pour indie devs / startups

| Service | Équivalent | Usage |
|---|---|---|
| Lambda | Serverless Functions | API, jobs, workers |
| S3 | Object Storage | Fichiers, assets, backups |
| CloudFront | CDN | Distribution globale |
| RDS | PostgreSQL/MySQL managé | DB relationnelle |
| DynamoDB | NoSQL | KV + documents haute perf |
| EC2 | VMs | Compute généraliste |
| ECR/ECS/Fargate | Containers | Docker managé |
| SES | Email sending | Transactionnel cheap |
| SQS | Queues | Message queues |
| Cognito | Auth | Users, OAuth |
| Amplify | BaaS frontend | Alt Vercel + Firebase |

## Free Tier

### Toujours gratuit (Always Free)

| Service | Limite |
|---|---|
| Lambda | 1M invocations/mois + 400K GB-sec |
| DynamoDB | 25 GB stockage + 25 RCU + 25 WCU |
| SES | 3 000 emails/mois (si envoyé depuis EC2) |
| CloudWatch | 10 métriques custom + logs basiques |
| S3 | — (non toujours gratuit) |

### 12 premiers mois

| Service | Limite |
|---|---|
| EC2 t2/t3.micro | 750 heures/mois |
| RDS t2/t3.micro | 750 heures/mois + 20 GB |
| S3 | 5 GB + 20K GET + 2K PUT |

## Pricing (sélection services courants)

### Lambda

| Métrique | Tarif |
|---|---|
| Requêtes | $0.20/M (premier 1M gratuit) |
| Durée | $0.0000166667/GB-sec |

> **Exemple :** API 1M req/mois, 128MB, 200ms → $0.42/mo

### S3

| Métrique | Tarif |
|---|---|
| Stockage Standard | $0.023/GB-mois |
| Requêtes GET | $0.0004/1K |
| Requêtes PUT/POST | $0.005/1K |
| Egress (sortant) | $0.09/GB 🚨 |

> ⚠️ L'egress S3 est cher — considérer Cloudflare R2 pour assets publics ($0 egress).

### EC2 (on-demand, eu-west-3 Paris)

| Instance | vCPU | RAM | Prix/heure | Prix/mois |
|---|---|---|---|---|
| t3.micro | 2 | 1 GB | $0.0116 | ~$8.47 |
| t3.small | 2 | 2 GB | $0.023 | ~$16.79 |
| t3.medium | 2 | 4 GB | $0.046 | ~$33.58 |
| t3.large | 2 | 8 GB | $0.092 | ~$67.16 |

### RDS PostgreSQL (eu-west-3 Paris, single-AZ)

| Instance | vCPU | RAM | Prix/heure | Prix/mois |
|---|---|---|---|---|
| db.t3.micro | 2 | 1 GB | $0.023 | ~$16.79 |
| db.t3.small | 2 | 2 GB | $0.046 | ~$33.58 |
| db.t3.medium | 2 | 4 GB | $0.092 | ~$67.16 |

Storage RDS : $0.115/GB-mois. Backup : $0.095/GB-mois au-delà de la taille DB.

### SES (email)

$0.10 pour 1 000 emails. Pas de free tier standalone (gratuit si envoyé depuis EC2).

### 💡 Exemples de calcul AWS

- **API serverless 5M req/mois (Lambda + S3 + RDS t3.micro)** → ~$50-80/mo
- **App production (EC2 t3.medium + RDS t3.medium + S3 + CloudFront)** → ~$130-200/mo
- **Comparaison Fly.io** → Fly.io souvent moins cher et plus simple pour < $200/mo

## 📊 Coût estimé par palier d'utilisateurs

> **Hypothèses** : stack standard · EC2/ECS + RDS Postgres + S3 + CloudFront · région eu-west-3 (Paris)

| Palier | Users | Config | Coût estimé | Notes |
|--------|-------|--------|-------------|-------|
| **Perso / interne** | — | Free tier 12 mois | **$0–5/mo** | t2.micro + RDS micro gratuits 12 mois |
| **Early stage** | ~1k | Lambda + RDS t3.micro | **$15–40/mo** | Serverless + DB minimale |
| **Growth** | ~10k | ECS t3.small + RDS t3.small | **$60–120/mo** | Container + DB + S3 + CF |
| **Scale** | ~100k | ECS t3.medium ×2 + RDS t3.medium | **$200–400/mo** | HA multi-AZ, CDN, load balancer |
| **Hyper-scale** | ~1M+ | ECS autoscale + RDS Multi-AZ + ElastiCache | **$800–3000+/mo** | Reserved instances pour réduire ~40% |

> 💡 **Reserved instances** : s'engager 1 an réduit les coûts EC2/RDS de 30–40%. Pertinent dès $100+/mo en EC2.
>
> ⚠️ **Comparaison** : AWS est souvent 2–3× plus cher que Fly.io ou Supabase pour les petites apps, mais offre SLA, compliance, et ecosystem incomparables à grande échelle. Le seuil où AWS devient rationnel est ~$300+/mo.

## ✅ Quand utiliser

- Écosystème AWS déjà en place
- Besoin de services très spécifiques (Rekognition, Transcribe, etc.)
- Compliance / contrats enterprise AWS
- Gros volume où les discounts réservés (1-3 ans) font sens
- SES pour email à très gros volume ($0.10/1K est imbattable)

## ❌ Quand ne PAS utiliser

- Side-project ou petite app (complexité + coûts > alternatives)
- Besoin de simplicité et rapidité (Fly.io, Vercel, Cloudflare sont bien plus simples)
- Données en Suisse obligatoires (→ Infomaniak)

## Régions EU

| Code | Localisation |
|---|---|
| eu-west-3 | Paris 🇫🇷 |
| eu-west-1 | Irlande 🇮🇪 |
| eu-central-1 | Francfort 🇩🇪 |
| eu-north-1 | Stockholm 🇸🇪 |

## Ressources

- [Pricing AWS](https://aws.amazon.com/pricing/)
- [AWS Calculator](https://calculator.aws/)
- [SES Pricing](https://aws.amazon.com/ses/pricing/)
