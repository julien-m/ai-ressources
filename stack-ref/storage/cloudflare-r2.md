---
last_updated: 2026-03-17
confidence: high
category: storage
type: managed
pricing_model: [free, per-storage, per-operation]
free_tier: true
---

# Cloudflare R2

> _Object storage S3-compatible sans frais d'egress — le meilleur rapport qualité/prix pour les blobs._

## Ce que c'est

Object storage compatible API S3 de Cloudflare. Le différenciateur majeur : **zéro frais d'egress** (lire un fichier ne coûte rien, contrairement à AWS S3 ou GCS). Accessible depuis Workers directement ou via URL publique.

## Free tier

- **10 GB stockage/mois**
- **1 million opérations Class A** (écriture) / mois
- **10 millions opérations Class B** (lecture) / mois
- **Egress : toujours gratuit**

## Pricing

| Ressource | Prix |
|-----------|------|
| Stockage | $0.015/GB/mois |
| Opérations Class A (PUT, POST) | $4.50/million |
| Opérations Class B (GET) | $0.36/million |
| Egress | **$0 (toujours gratuit)** |

### Exemple calculé
- 100 GB stockés + 100k uploads + 1M downloads/mois
- = $1.50 + $0.45 + $0.036 = **~$2/mois**
- Équivalent AWS S3 : ~$15–20/mois (avec egress)

## Features clés

- API S3-compatible (libs AWS SDK fonctionnent)
- Accès direct depuis Workers (binding natif)
- URL publique optionnelle (custom domain)
- Multipart upload
- Lifecycle policies (expiration objets)
- Intégration avec CF Images et CF Stream

## ✅ Quand utiliser

- Tout projet qui stocke des fichiers : avatars, uploads users, assets, exports
- Stack Cloudflare Workers → binding natif, zéro latence
- Alternative S3 à moindre coût (pas d'egress)
- Assets servis publiquement (CDN CF automatique)

## ❌ Quand ne PAS utiliser

- Besoin de requêtes S3 Select (requêtes SQL sur données) → S3
- Compliance spécifique (HIPAA certifié, etc.) → vérifier CF compliance

## Combinaisons stack
- `R2 + CF Workers` → binding natif, accès direct sans HTTP
- `R2 + Uploadthing` → upload frontend vers R2
- `R2 + Backblaze B2` → R2 comme CDN devant B2 (egress gratuit)

## Ressources
- [developers.cloudflare.com/r2](https://developers.cloudflare.com/r2/)
