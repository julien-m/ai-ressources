---
last_updated: 2026-03-16
confidence: high
category: platform
type: managed
pricing_model: [flat, per-usage]
free_tier: true
---

# Supabase (Platform)

> _L'alternative open-source à Firebase — PostgreSQL + Auth + Storage + Realtime en un._

## Ce que c'est
Supabase est un BaaS open-source construit sur PostgreSQL. Voir aussi [`databases/supabase-db.md`](../databases/supabase-db.md) pour les détails DB. La plateforme inclut en plus : Auth (basé GoTrue), Realtime (basé Phoenix Channels), Storage (S3-compatible), Edge Functions (Deno), et une interface d'admin complète.

## Produits / Features clés
- **Database** — PostgreSQL + pgvector + extensions
- **Auth** — Email, OAuth, Magic Link, SAML
- **Realtime** — WebSockets (Broadcast, Presence, Postgres Changes)
- **Storage** — S3-compatible, transformations d'images
- **Edge Functions** — Deno runtime (< 50ms cold start)
- **AI & Vectors** — pgvector intégré
- **Self-hosting** — Docker compose disponible

## Free Tier
| Métrique | Limite |
|---|---|
| Projets | 2 actifs |
| DB stockage | 500 MB |
| Auth | Illimité (rate limited) |
| Storage | 1 GB |
| Bandwidth | 5 GB/mois |
| Edge Functions | 500K invocations/mois |
| Realtime | 200 connexions simultanées |
| Pause auto | Après 7 jours d'inactivité ⚠️ |

## Pricing
### Pro — $25/mois (par organisation)
| Métrique | Inclus | Overage |
|---|---|---|
| DB | 8 GB | $0.125/GB |
| Storage | 100 GB | $0.021/GB |
| Bandwidth | 250 GB | $0.09/GB |
| Edge Functions | 2M | $2/M |
| Auth MAU | 100K | $0.00325/MAU |
| No pause auto | ✅ | — |

### Team — $599/mois
Inclut PITR, SOC2, 99.9% SLA, priority support, plus d'équipe.

### Enterprise — sur devis
HIPAA, SLA custom, dedicated infra.

### 💡 Exemples de calcul
- **Startup early-stage** → Free : $0/mo (attention pause auto)
- **SaaS en production** → Pro : $25/mo de base, ~$30-50/mo typique
- **SaaS avec 50K users** → Pro : $25 + 50K × $0.00325 = ~$187/mo (si tous actifs)
- **App avec 20GB DB, 500GB Storage** → Pro : $25 + 12 × $0.125 + 400 × $0.021 = ~$35.9/mo

## 📊 Coût estimé par palier d'utilisateurs
> **Hypothèses** : app SaaS · Auth + DB + Storage · 20% MAU actifs · ~5 MB DB/user · ~50 MB storage/user

| Palier | Users | MAU actifs | Plan | Coût estimé | Notes |
|--------|-------|-----------|------|-------------|-------|
| **Perso / interne** | — | — | Free | **$0** | ⚠️ Pause auto après 7j d'inactivité |
| **Early stage** | ~1k | ~200 | Free → Pro | **$0–25/mo** | Free suffit, passer Pro pour éviter la pause |
| **Growth** | ~10k | ~2k | Pro | **$25–60/mo** | $25 base + MAU + storage |
| **Scale** | ~100k | ~20k | Pro | **$90–180/mo** | MAU : 20k × $0.00325 = $65 + base |
| **Hyper-scale** | ~1M+ | ~200k | Team/Enterprise | **$600–2000+/mo** | Dédié ou Team ($599/mo fixe) |

> ⚠️ **Free tier critique** : le projet est mis en pause après 7 jours d'inactivité. En production, passer directement en Pro ($25/mo) pour éviter tout incident.
>
> 💡 **Team plan** ($599/mo) = coût fixe prévisible pour ~500k users actifs. Plus avantageux que le Pro usage-based au-delà de ~180k MAU.
## ✅ Quand utiliser
- Besoin d'un BaaS **complet** (DB + Auth + Storage + Realtime) dans un seul service
- Remplacement Firebase avec SQL + open-source + RGPD
- Équipe fullstack solo ou petite
- Besoin de pgvector pour RAG / AI
## ❌ Quand ne PAS utiliser
- Scale-to-zero requis (Supabase ne scale pas à zéro)
- Multi-région native sans config manuelle
- Très gros compute (préférer Neon qui scale mieux sur compute)
## Ressources
- [Documentation](https://supabase.com/docs)
- [Pricing officiel](https://supabase.com/pricing)
- [Self-hosting guide](https://supabase.com/docs/guides/self-hosting)
