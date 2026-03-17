---
last_updated: 2026-03-16
confidence: medium
category: database
type: managed
pricing_model: [flat, per-usage]
free_tier: false
---

# PlanetScale

> _MySQL serverless ultra-scalable basé sur Vitess — l'engine qui propulse YouTube et Slack._

## Ce que c'est

PlanetScale est une plateforme de base de données MySQL managée construite sur **Vitess**, le système de sharding horizontal créé par YouTube chez Google (open-source). Conçu pour le scale horizontal sans modification de l'application. Support du branching de schéma (comme git pour les migrations). Fondé en 2018.

⚠️ En 2024, PlanetScale a supprimé son free tier (Hobby plan). Plans payants uniquement désormais.

## Free Tier

**❌ Pas de free tier depuis mars 2024.** Plan Scaler démarre à $39/mois.

> Alternative gratuite pour MySQL managé : Planetscale propose PlanetScale for open source projects (à demander).

## Pricing

### Scaler — $39/mois

| Métrique | Inclus |
|---|---|
| Stockage | 10 GB |
| Lectures | 100M rows/mois |
| Écritures | 10M rows/mois |
| Branches | 2 |
| Régions | 1 |

> Overage : $1.50/GB stockage, $1.50/10M lectures, $1.50/M écritures

### Scaler Pro — $99/mois

| Métrique | Inclus |
|---|---|
| Stockage | 10 GB |
| Ressources compute | Plus performant |
| Branches | 10 |
| Multi-régions | En option (prix additionnel) |

### Enterprise — sur devis (plusieurs régions, SLA, compliance)

### 💡 Exemples de calcul

- **Petit SaaS, 5GB, usage modéré** → Scaler : $39/mo
- **SaaS moyen, 30GB, 500M lectures** → Scaler Pro + overage : ~$150+/mo

## 📊 Coût estimé par palier d'utilisateurs

> **Hypothèses** : app SaaS · 20% MAU · ~100 req DB/utilisateur actif/jour · 80% lectures / 20% écritures · Scaler $39/mo comme plan de base

| Palier | MAU | Lectures/mois | Écritures/mois | Coût estimé | Notes |
|--------|-----|--------------|---------------|-------------|-------|
| **5k users** | 1k | ~2.4M | ~0.6M | **$39/mo** | Scaler est le plan minimum |
| **15k users** | 3k | ~7.2M | ~1.8M | **$39/mo** | Inclus dans Scaler |
| **50k users** | 10k | ~24M | ~6M | **$39/mo** | Inclus (100M lus / 10M écrits) |
| **100k users** | 20k | ~48M | ~12M | **$41/mo** | Écrits overage : 2M × $1.50 = $3 |
| **300k users** | 60k | ~144M | ~36M | **$85/mo** | Lus overage : 44M × $0.15 + écrits 26M × $1.50 = $45 |
| **1M users** | 200k | ~480M | ~120M | **$260/mo** | Lus overage : 380M × $0.15 = $57 + écrits 110M × $1.50 = $165 |

> ⚠️ **Coût minimum élevé** : $39/mo dès le premier palier — PlanetScale n'est pas adapté aux projets bootstrapped à faible volume. Le vrai avantage arrive à **500k–1M users** où le branching, la scalabilité MySQL et l'absence de downtime justifient le coût. Pour un side-project, Turso ($5) ou Supabase ($25) sont meilleurs choix.

## Performances

| Métrique | Valeur |
|---|---|
| Vitess sharding | Horizontal scale transparent |
| Latence | 1–10ms (même région) |
| Connexions | Pool de connexions natif (Vitess) |
| Scale horizontal | Sans downtime ni resharding manuel |

## ✅ Quand utiliser

- App MySQL existante à scaler massivement sans re-architecture
- Besoin de Vitess sans gérer soi-même l'infra Vitess
- Branching de schéma pour migrations sécurisées
- Équipe habituée à MySQL en production

## ❌ Quand ne PAS utiliser

- Budget limité (pas de free tier, $39/mo minimum)
- Besoin de PostgreSQL et ses extensions
- Multi-région actif-actif natif sans coût supplémentaire
- Petit projet ou prototype

## Combinaisons stack optimales

- **SaaS existant MySQL → scale** → `PlanetScale + Prisma`
- **App Laravel / Rails MySQL** → `PlanetScale + framework ORM natif`

## Alternatives directes

| Alternative | Différence clé |
|---|---|
| Neon | PostgreSQL, free tier, scale-to-zero |
| Supabase | BaaS Postgres, free tier |
| CockroachDB | Multi-région natif, Postgres-compatible |
| MySQL self-hosted | Gratuit mais gestion manuelle |

## Ressources

- [Documentation](https://planetscale.com/docs)
- [Pricing officiel](https://planetscale.com/pricing)
