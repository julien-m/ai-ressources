---
last_updated: 2026-03-17
confidence: high
category: storage
type: managed
pricing_model: [per-storage, per-retrieval, per-egress]
free_tier: false
---

# Google Cloud Storage (GCS)

> _Le meilleur choix pour le cold storage et l'archivage long terme — Archive class imbattable en prix._

## Ce que c'est
Object storage managé de Google Cloud, API S3-compatible. La vraie force de GCS par rapport à R2 ou B2 : ses **4 classes de stockage** avec des prix décroissants selon la fréquence d'accès. Pour du cold storage ou backup longue durée, GCS Archive est le moins cher du marché parmi les grands providers.

## Les 4 classes de stockage
| Classe | Usage | Durée min | Prix/GB/mois | Retrieval/GB | Egress/GB |
|--------|-------|-----------|-------------|--------------|-----------|
| **Standard** | Données fréquentes | Aucune | ~$0.020 | $0 | ~$0.08–0.12 |
| **Nearline** | ~1 accès/mois | 30 jours | ~$0.010 | $0.01 | ~$0.08–0.12 |
| **Coldline** | ~1 accès/trimestre | 90 jours | ~$0.004 | $0.02 | ~$0.08–0.12 |
| **Archive** | ~1 accès/an ou moins | 365 jours | ~$0.0012 | $0.05 | ~$0.08–0.12 |

> Prix région US/EU (europe-west1). Vérifier [cloud.google.com/storage/pricing](https://cloud.google.com/storage/pricing) pour les prix à jour.

## Exemple calculé — Backup client 1 TB, Archive class
| Poste | Calcul | Coût/mois |
|-------|--------|-----------|
| Stockage 1 TB (Archive) | 1024 GB × $0.0012 | **~$1.23** |
| Upload (ingress) | Gratuit | $0 |
| Lecture mensuelle (rare, 1 GB) | 1 GB × $0.05 retrieval + $0.08 egress | **~$0.13** |
| **Total** | | **~$1.36/mois** |

> Comparaison pour 1 TB :
> - **GCS Archive** : ~$1.23/mois (retrieval payant)
> - **Backblaze B2** : ~$6/mois (retrieval via CF = $0)
> - **Cloudflare R2** : ~$15/mois (egress $0)
>
> → GCS Archive est 5× moins cher que B2 en stockage pur, mais les lectures coûtent cher ($0.05/GB). **Pertinent uniquement si les données sont vraiment rarement lues.**

## Lifecycle policies — automatiser les transitions
GCS permet de définir des règles automatiques pour descendre les données dans des classes moins chères :

```
Jour 0   → Upload en Standard (accès fréquent initial)
Jour 30  → Transition auto vers Nearline ($0.010/GB)
Jour 90  → Transition auto vers Coldline ($0.004/GB)
Jour 365 → Transition auto vers Archive ($0.0012/GB)
```

Configuration via JSON ou console GCP — aucun code à écrire. Très utile pour des logs, des exports DB, ou des fichiers clients qui deviennent "froids" avec le temps.

## ⚠️ Pièges à éviter
**Durée minimale de stockage** : si tu supprimes ou changes de classe un fichier avant la durée minimale, tu payes quand même pour la durée entière. Exemple : stocker 1 TB en Coldline et tout supprimer au bout de 30 jours → facturé comme si c'était 90 jours.

**Frais d'egress** : contrairement à R2 ou B2+CF, GCS facture l'egress (~$0.08–0.12/GB). Pour du cold storage consulté rarement, ce n'est pas un problème. Pour des assets servis fréquemment au public → R2 ou B2+CF sont bien meilleurs.

**Retrieval fee** : lire des données Coldline ou Archive coûte $0.02–0.05/GB en plus de l'egress. À anticiper avant une restauration de backup.

## Pattern recommandé — Backup multi-tier
```
Données actives (fichiers clients, uploads)
    → Cloudflare R2 ou Backblaze B2  ← accès fréquent, egress gratuit

Backup quotidien / export DB
    → GCS Nearline (30 jours)        ← $0.010/GB, restauration rapide si besoin

Archive longue durée (> 1 an)
    → GCS Archive                    ← $0.0012/GB, quasi-gratuit à stocker
```

## Comparatif cold storage
| Provider | Prix/TB/mois | Retrieval | Egress | Durée min | Note |
|----------|-------------|-----------|--------|-----------|------|
| **GCS Archive** | ~$1.23 | $0.05/GB | $0.08–0.12/GB | 365 jours | Le moins cher si jamais lu |
| **GCS Coldline** | ~$4.10 | $0.02/GB | $0.08–0.12/GB | 90 jours | Bon compromis DR |
| **Backblaze B2** | ~$6 | $0 via CF | $0 via CF | Aucune | Meilleur si accès régulier |
| **AWS S3 Glacier** | ~$4 | $0.01–0.03/GB | $0.09/GB | 90–180 jours | Équivalent Coldline/Archive |
| **Cloudflare R2** | ~$15 | $0 | $0 | Aucune | Meilleur pour accès fréquent |
## ✅ Quand utiliser GCS
- **Archive longue durée** de fichiers clients, documents, exports DB → Archive class
- **Disaster recovery** avec restauration trimestrielle → Coldline
- **Transition automatique** via Lifecycle (Standard → Nearline → Coldline → Archive)
- Déjà sur GCP → intégration native avec Cloud Run, Compute Engine
## ❌ Quand ne PAS utiliser GCS
- Assets servis publiquement (images, CSS, JS) → R2 (egress $0)
- Fichiers accédés régulièrement → B2 + CF (egress gratuit)
- Besoin de lecture fréquente → les retrieval fees s'accumulent vite
## Combinaisons stack
- `B2 (hot) + GCS Archive (cold)` → stockage actif B2, archive longue durée GCS
- `R2 (assets) + GCS Archive (backups DB)` → assets CF sans egress, backups quasi-gratuits
- `GCS Lifecycle Standard → Archive` → transition automatique, zéro gestion manuelle
## Ressources
- [cloud.google.com/storage](https://cloud.google.com/storage)
- [Pricing officiel](https://cloud.google.com/storage/pricing)
- [Lifecycle policies](https://cloud.google.com/storage/docs/lifecycle)
