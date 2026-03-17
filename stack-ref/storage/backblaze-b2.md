---
last_updated: 2026-03-17
confidence: high
category: storage
type: managed
pricing_model: [free, per-storage, per-download]
free_tier: true
---

# Backblaze B2

> _Le stockage le moins cher — idéal couplé à Cloudflare pour éliminer les frais d'egress._

## Ce que c'est

Object storage S3-compatible de Backblaze. Le prix de stockage est 3–4x moins cher qu'AWS S3 ou GCS. Backblaze est partenaire Bandwidth Alliance de Cloudflare : **le trafic B2 → Cloudflare est gratuit** (zéro frais d'egress dans ce path).

## Free tier

- **10 GB stockage** gratuit permanent
- **1 GB download/jour** gratuit

## Pricing

| Ressource | Prix |
|-----------|------|
| Stockage | **$0.006/GB/mois** (vs $0.023 AWS S3) |
| Download | $0.01/GB (via internet direct) |
| Download via Cloudflare | **$0** (Bandwidth Alliance) |
| Upload | Gratuit |
| API calls | $0.004/10k (Class C) |

### Comparatif stockage 100 GB/mois
| Provider | Stockage | Egress 1TB | Total |
|----------|----------|------------|-------|
| Backblaze B2 + CF | $0.60 | $0 | **$0.60** |
| Cloudflare R2 | $1.50 | $0 | $1.50 |
| AWS S3 | $2.30 | $92 | $94+ |

## Pattern B2 + Cloudflare

```
Upload → B2 directement (API)
Lecture → Cloudflare Workers/CDN → B2 (egress gratuit)
         ou R2 comme cache devant B2
```

Le client ne touche jamais B2 directement — il passe par CF. Egress B2→CF = $0.

## ✅ Quand utiliser

- Stockage de gros volumes (backups, archives, médias)
- Couplé à Cloudflare pour zéro egress
- Alternative R2 encore moins chère pour du stockage pur
- Backups de DB, exports, assets statiques

## ❌ Quand ne PAS utiliser

- Besoin d'accès depuis CF Workers en binding natif → R2
- Latence critique (R2 est plus proche des Workers CF)
- Moins de 50 GB → différence de prix négligeable, R2 plus simple

## Combinaisons stack
- `B2 + Cloudflare CDN` → assets publics ultra-cheap
- `B2 + R2 cache` → B2 stockage, R2 pour hot files Workers
- `B2` → backups DB quotidiens

## Ressources
- [backblaze.com/cloud-storage/pricing](https://www.backblaze.com/cloud-storage/pricing)
- [Bandwidth Alliance CF](https://www.cloudflare.com/bandwidth-alliance/)
