---
last_updated: 2026-03-16
confidence: high
category: platform
type: managed
pricing_model: [free, per-usage]
free_tier: true
---

# Firebase / Google Cloud

> _BaaS Google avec Firestore, Auth, Storage, Functions — et Google Cloud en dessous._

> ⚠️ **Mobile-first** : Firebase est conçu pour les apps iOS/Android. SDK mobile natif, offline sync, FCM push, Auth mobile sont ses points forts. Pour une **app web uniquement**, préférer **Supabase** (Postgres, meilleur DX, open-source). Firebase web SDK existe mais c'est pas son terrain de prédilection — l'utiliser quand il y a une app mobile ET un dashboard web, ou quand l'équipe est déjà Firebase.

## Ce que c'est

Firebase est le BaaS de Google, construit sur Google Cloud Platform (GCP). Inclut Firestore (NoSQL temps réel), Realtime Database (ancien), Authentication, Storage (GCS), Cloud Functions, Hosting, et Analytics. Très populaire pour les apps mobiles. Données hébergées chez Google (US par défaut, régions EU disponibles).

## Produits / Features clés

- **Firestore** — NoSQL documents temps réel, scalable
- **Realtime Database** — JSON tree temps réel (ancien, moins recommandé)
- **Authentication** — OAuth, email, phone, magic link
- **Storage** — Object storage (Google Cloud Storage)
- **Cloud Functions** — Serverless Node.js/Python/Go
- **Hosting** — CDN + déploiement
- **Analytics** — Google Analytics for Firebase
- **Remote Config** — Feature flags
- **FCM** — Push notifications

## Free Tier (Spark Plan)

| Métrique | Limite |
|---|---|
| Firestore lectures | 50K/jour |
| Firestore écritures | 20K/jour |
| Firestore suppression | 20K/jour |
| Firestore stockage | 1 GB |
| Storage | 5 GB |
| Auth | Illimité |
| Functions | 125K invocations/mois |
| Hosting bande passante | 10 GB/mois |

## Pricing (Blaze — pay-as-you-go)

### Firestore

| Métrique | Tarif | Notes |
|---|---|---|
| Lectures | $0.06/100K | — |
| Écritures | $0.18/100K | — |
| Suppressions | $0.02/100K | — |
| Stockage | $0.18/GB-mois | — |

### Cloud Functions

| Métrique | Inclus gratuit | Tarif |
|---|---|---|
| Invocations | 2M/mois | $0.40/M |
| CPU | 400K GHz-sec | $0.00001/GHz-sec |
| RAM | 200K GB-sec | $0.0000025/GB-sec |

### Storage (GCS)

$0.026/GB-mois (Standard). Egress : $0.12/GB.

### 💡 Exemples de calcul

- **App mobile 10K users, usage modéré** → Spark : $0/mo (ou Blaze $0 si dans limites)
- **App 100K users, 500K lectures/jour** → Blaze : 500K × $0.06/100K × 30 = ~$9/mo
- **Chat app avec beaucoup d'écritures** → Peut devenir cher rapidement (écritures coûtent 3× les lectures)

## 📊 Coût estimé par palier d'utilisateurs

> **Hypothèses** : app mobile · Firestore + Auth + Storage · usage mixte lecture/écriture modéré

| Palier | Users | Lectures Firestore/jour | Plan | Coût estimé | Notes |
|--------|-------|------------------------|------|-------------|-------|
| **Perso / interne** | — | < 50k | Spark (free) | **$0** | Limites Spark très généreux pour le dev |
| **Early stage** | ~1k | ~100k | Blaze | **$0–5/mo** | Dans les limites gratuites Blaze |
| **Growth** | ~10k | ~1M | Blaze | **$10–40/mo** | Lectures $0.06/100k, écritures $0.18/100k |
| **Scale** | ~100k | ~10M | Blaze | **$80–200/mo** | Écritures coûtent 3× les lectures — surveiller |
| **Hyper-scale** | ~1M+ | ~100M+ | Blaze | **$500–2000+/mo** | Coûts très variables selon le pattern d'accès |

> ⚠️ **Piège des écritures Firestore** : chaque écriture coûte 3× une lecture. Une app avec beaucoup de mises à jour temps réel peut devenir très chère. Modéliser les accès avant de se lancer.
>
> ⚠️ **Spark plan** : pas de carte bancaire, mais quotas stricts. Dès qu'on va en production, passer en Blaze (pay-as-you-go) — souvent gratuit au début mais nécessaire pour ne pas être bloqué.

## ✅ Quand utiliser

- App **mobile iOS/Android** (SDK Firebase natif excellent)
- Prototype rapide nécessitant auth + DB + realtime
- Offline-first mobile (Firestore cache local)
- Push notifications (FCM gratuit)
- Équipe habituée à l'écosystème Google

## ❌ Quand ne PAS utiliser

- Données souveraines en Europe (Firestore US par défaut)
- SQL requis (Firestore est NoSQL uniquement)
- Budget prévisible (coûts Firestore difficiles à prévoir)
- Préférence open-source (Firebase propriétaire Google)
- → **Alternative : Supabase** (open-source, Postgres, features similaires)

## Combinaisons stack optimales

- **App mobile Flutter** → `Firebase Auth + Firestore + FCM`
- **App web + mobile** → `Firebase Auth + Firestore + Storage`

## Alternatives directes

| Alternative | Différence clé |
|---|---|
| Supabase | Open-source, PostgreSQL, RGPD EU, très similaire |
| Convex | TypeScript-first, cohérence forte, temps réel |
| AppWrite | Self-hosted Firebase alternative |

## Ressources

- [Documentation Firebase](https://firebase.google.com/docs)
- [Pricing Firebase](https://firebase.google.com/pricing)
