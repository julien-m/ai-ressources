---
last_updated: 2026-03-16
confidence: high
category: platform
type: managed
pricing_model: [per-usage]
free_tier: true
---

# Fly.io

> _Containers à l'edge — déploiement CLI-first, multiregion, proche du metal._

## Ce que c'est
Fly.io est une plateforme de déploiement de containers distribués. Basée sur des micro-VMs (firecracker), tourne du code Dockerisé partout dans le monde. CLI-first, très apprécié des développeurs. Bon marché pour des containers toujours actifs. Supporte Node.js, Python, Go, Rust, etc. Inclut Postgres managé et Redis (Upstash).

## Free Tier
| Métrique | Limite |
|---|---|
| VMs | 3 VMs shared CPU 256MB (toujours) |
| Volume storage | 3 GB |
| Bande passante | 160 GB/mois |

> ✅ Le free tier ne nécessite pas de carte bancaire initialement.

## Pricing
### Machines (VMs)
| Type | CPU | RAM | Prix/heure | Prix/mois (24/7) |
|---|---|---|---|---|
| shared-cpu-1x | shared | 256 MB | $0.0000008/ms (~$0.001/s) | ~$2.07 |
| shared-cpu-1x | shared | 512 MB | — | ~$3.19 |
| shared-cpu-2x | 2 shared | 1 GB | — | ~$6.21 |
| performance-1x | 1 vCPU dédié | 2 GB | — | ~$15.30 |
| performance-2x | 2 vCPU | 4 GB | — | ~$29.00 |
| performance-4x | 4 vCPU | 8 GB | — | ~$58.00 |

### Storage
| Métrique | Tarif |
|---|---|
| Volume persistant | $0.15/GB-mois |
| Bande passante (sortant) | $0.02/GB (au-delà du free) |

### Postgres managé (Fly Postgres)
Tourne sur des machines Fly standard. Environ $7-15/mo pour un cluster small.

### 💡 Exemples de calcul
- **Side-project always-on (Node.js 512MB)** → ~$3.19/mo + volume
- **App prod (1 vCPU 2GB)** → ~$15.30/mo
- **App prod + Postgres (1 vCPU 2GB chacun)** → ~$30/mo
- **Multi-région (Paris + Singapore)** → 2× le prix des machines

## Régions disponibles (sélection EU/proche)
| Code | Localisation |
|---|---|
| cdg | Paris, FR 🇫🇷 |
| ams | Amsterdam, NL 🇳🇱 |
| fra | Francfort, DE 🇩🇪 |
| lhr | Londres, UK 🇬🇧 |
| mad | Madrid, ES 🇪🇸 |

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : backend Node/Bun API · Paris (cdg) · Postgres Fly managé · sans CDN frontal

| Palier | Users | Config | Coût estimé | Notes |
|--------|-------|--------|-------------|-------|
| **Perso / interne** | — | Micro VM (free allowance) | **$0–3/mo** | Free tier : 3 VMs shared, 3 GB storage |
| **Early stage** | ~500 | 1× shared-cpu-1x 256MB | **$2–5/mo** | VM $1.94/mo + volume |
| **Growth** | ~5k | 1× shared-cpu-1x 512MB + Postgres | **$15–25/mo** | App + DB chacun ~$10/mo |
| **Scale** | ~50k | 2× performance-cpu-1x 2GB + Postgres | **$60–100/mo** | 2 machines HA + Postgres dédié |
| **Hyper-scale** | ~500k+ | 4×+ autoscale + Postgres HA | **$300–800/mo** | Machines autoscalées selon trafic |

> 💡 **Atout Fly** : facturation à la seconde, pas à l'heure. Une app qui reçoit peu de trafic la nuit coûte moins cher. Auto-stop/start des VMs possible pour réduire les coûts.
## ✅ Quand utiliser
- App Dockerisée à déployer rapidement en EU/global
- Backend Node.js/Python/Go toujours actif (pas serverless)
- Besoin de multi-région à coût modéré
- Postgres managé simple sans gestion infra
- CLI-first (intégration CI/CD facile)
## ❌ Quand ne PAS utiliser
- Scale-to-zero requis (containers toujours actifs)
- Frontend statique (Cloudflare Pages ou Vercel sont gratuits)
- Gros workloads compute (AWS/GCP EC2 souvent moins chers à grande échelle)
- Exigences RGPD strictes (données en Suisse → Infomaniak)
## Combinaisons stack optimales
- **API Node.js + Postgres** → `Fly.io + Fly Postgres + Drizzle`
- **App fullstack Docker** → `Fly.io multi-région + Upstash Redis`
## Ressources
- [Documentation](https://fly.io/docs/)
- [Pricing officiel](https://fly.io/docs/about/pricing/)
- [Régions](https://fly.io/docs/reference/regions/)
