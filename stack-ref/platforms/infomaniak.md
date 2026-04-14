---
last_updated: 2026-03-16
confidence: medium
category: platform
type: managed
pricing_model: [flat, per-usage]
free_tier: false
---

# Infomaniak

> _Hébergeur suisse indépendant — cloud EU/CH, RGPD strict, prix transparents, éco-responsable._

## Ce que c'est
Infomaniak est un hébergeur suisse fondé en 1994, 100% indépendant (pas de capital venture). Héberge ses serveurs en Suisse (Genève). Fort engagement RGPD, écologique (énergie renouvelable), et souveraineté des données. Propose deux offres cloud principales : **Jelastic** (PaaS) et **Public Cloud** (IaaS).

## Produits / Features clés
- **Jelastic** — PaaS scalable (Java, PHP, Python, Node.js, Ruby, Go, Docker)
- **Public Cloud** — IaaS (VMs, Object Storage S3, Load Balancer, Kubernetes)
- **kDrive** — Storage cloud (alternatif Google Drive)
- **SwissTransfer** — Envoi fichiers
- **Hébergement web** — Plans mutualisés
- **Mail** — Emails hébergés
- **Streaming** — VOD / live streaming

## Free Tier
**❌ Pas de free tier** pour les produits cloud/infra.

> Jelastic propose un "trial" de quelques jours à la création de compte.

## Pricing — Jelastic (PaaS)
Jelastic facture à la **cloudlet** (unité de ressources).

| Cloudlet | CPU | RAM |
|---|---|---|
| 1 cloudlet | ~400 MHz | 128 MB |

### Facturation Jelastic
- **Reserved cloudlets** (réservés d'avance) : ~€0.012/cloudlet/heure
- **Dynamic cloudlets** (on-demand) : ~€0.016/cloudlet/heure
- Storage : ~€0.0001/GB/heure (~€0.07/GB/mois)
- Traffic : 1 GB/mois gratuit, puis ~€0.10/GB

### 💡 Exemples de calcul Jelastic
- **Node.js basique (2 cloudlets = 256MB, 800MHz)** → 2 × €0.012 × 720h = ~€17/mo
- **PostgreSQL small (4 cloudlets = 512MB)** → 4 × €0.012 × 720h = ~€35/mo
- **App complète : 4 cloudlets app + 4 cloudlets DB** → ~€70/mo

> 💡 Jelastic est adapté pour des apps nécessitant scaling vertical auto sans gérer de VMs.

## Pricing — Public Cloud (IaaS)
Facturation à l'usage horaire. Basé sur OpenStack.

### Instances VM (prix indicatifs 2026)
| Type | vCPU | RAM | Prix/heure | Prix/mois |
|---|---|---|---|---|
| a1-ram2 | 1 | 2 GB | ~€0.02 | ~€15 |
| a2-ram4 | 2 | 4 GB | ~€0.04 | ~€29 |
| a4-ram8 | 4 | 8 GB | ~€0.08 | ~€58 |
| a8-ram16 | 8 | 16 GB | ~€0.16 | ~€115 |

### Object Storage (S3-compatible)
| Métrique | Tarif |
|---|---|
| Stockage | ~€0.024/GB-mois |
| Egress | ~€0.017/GB |

### 💡 Exemples de calcul Public Cloud
- **VPS Node.js + Postgres (a2-ram4)** → ~€29/mo
- **Comparaison avec Fly.io** → Infomaniak Public Cloud légèrement plus cher mais souveraineté CH

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : VPS Public Cloud + Postgres self-hosted · datacenter CH (Genève) · prix en €

| Palier | Users | Config | Coût estimé | Notes |
|--------|-------|--------|-------------|-------|
| **Perso / interne** | — | Jelastic dev (petit) | **€0–5/mo** | Jelastic facturé au CloudLet, très flexible |
| **Early stage** | ~500 | a2-ram4 (2 vCPU, 4 GB) | **€25–35/mo** | VM ~€29 + storage |
| **Growth** | ~5k | a4-ram8 (4 vCPU, 8 GB) | **€55–80/mo** | VM ~€57 + Postgres + Object Storage |
| **Scale** | ~50k | a4-ram16 (4 vCPU, 16 GB) | **€100–160/mo** | VM + DB séparée + Object Storage |
| **Hyper-scale** | ~500k+ | a8-ram16 ×2 + LB | **€350–600+/mo** | Multi-VM + load balancer + stockage |

> 💡 **Souveraineté** : Infomaniak est une entreprise suisse indépendante (pas de CLOUD Act US). Données 100% en Suisse ou France. Certification ISO 27001, énergie 100% renouvelable.
>
> ⚠️ **Comparaison** : ~20–30% plus cher que Fly.io ou GCP pour les ressources brutes, mais justifié si la souveraineté des données est une exigence client (secteur public, santé, finance EU).
## ✅ Quand utiliser
- **Exigences RGPD strictes** / données en Suisse obligatoires
- Clients publics ou entreprises nécessitant hébergeur EU/CH
- Éco-responsabilité comme critère de choix
- Stack PHP/WordPress/Symfony legacy
- Besoin de support en français
## ❌ Quand ne PAS utiliser
- App nécessitant edge computing mondial (Infomaniak = Suisse uniquement)
- Prototypage rapide (pas de free tier, setup plus long)
- Stack serverless edge (Workers, Lambda@Edge)
- Budget très limité (Fly.io ou Hetzner moins chers)

## Comparaison avec alternatives
| | Infomaniak | Fly.io | Hetzner | AWS |
|---|---|---|---|---|
| Localisation | CH 🇨🇭 | Global | DE 🇩🇪 | Global |
| RGPD | ✅✅ strict | ✅ | ✅ | ✅ |
| Free tier | ❌ | ✅ limité | ❌ | ✅ 12 mois |
| Prix VM 2vCPU | ~€29/mo | ~$10/mo | ~€5/mo | variable |
| Support FR | ✅ | ❌ | ❌ | payant |
## Ressources
- [Jelastic pricing](https://www.infomaniak.com/fr/hebergement/jelastic-cloud)
- [Public Cloud pricing](https://www.infomaniak.com/fr/cloud/public-cloud)
- [Calculateur Jelastic](https://jelastic.infomaniak.com/)
