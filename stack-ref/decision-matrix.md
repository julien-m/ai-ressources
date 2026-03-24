# _index — Matrice de décision stack

> **Mode d'emploi** : Trouver ton use case → lire la recommandation → aller dans le fichier détaillé.  
> Toutes les recommandations supposent un contexte **indie / micro-SaaS / side project** sauf mention contraire.

---

```yaml
last_updated: 2026-03-16
confidence: high
```

---

## 🗃️ Databases — Quel choix selon le besoin ?

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| Outil local / CLI / script | SQLite + bun:sqlite | [sqlite.md](databases/sqlite.md) |
| App Bun/Node classique, trafic modéré | Turso (embedded replica) | [turso.md](databases/turso.md) |
| App SQL complexe, besoin Postgres | Neon (serverless) | [neon.md](databases/neon.md) |
| Platform complète avec auth, storage, realtime | Supabase | [supabase-db.md](databases/supabase-db.md) |
| Cache / sessions / rate-limiting | Upstash Redis | [upstash-redis.md](databases/upstash-redis.md) |
| Cache Redis self-hosted, latence ultra-faible | Redis self-hosted | [redis-self-hosted.md](databases/redis-self-hosted.md) |
| Cloudflare Workers avec SQL | Cloudflare D1 | [cloudflare-d1.md](databases/cloudflare-d1.md) |
| Config/feature flags/clés TTL en edge CF | Cloudflare KV | [cloudflare-kv.md](databases/cloudflare-kv.md) |
| App realtime TypeScript-first (subscriptions auto) | Convex | [convex.md](databases/convex.md) |
| App MySQL legacy / PlanetScale migration | MySQL | [mysql.md](databases/mysql.md) |
| Multi-région avec réplication forte, finance | CockroachDB | [cockroachdb.md](databases/cockroachdb.md) |
| Postgres self-hosted, contrôle total | Postgres | [postgres.md](databases/postgres.md) |
| MySQL ultra-haute charge, branching | PlanetScale | [planetscale.md](databases/planetscale.md) |

---

## 🗄️ Databases — Arbre de décision

```
Besoin de SQL ?
├── Oui
│   ├── Cloudflare Workers uniquement → D1
│   ├── Edge multi-région, multi-tenant → Turso
│   ├── Postgres complet + features avancées
│   │   ├── + auth/storage/realtime intégrés → Supabase
│   │   ├── + branching / serverless / scale-to-zero → Neon
│   │   └── + multi-région forte consistance → CockroachDB
│   └── Local / embedded → SQLite
└── Non (clés-valeurs)
    ├── Sessions / pub-sub / queues → Redis
    │   ├── Serverless / edge → Upstash
    │   └── Self-hosted → Redis
    ├── CF Workers, petits objets → KV
    └── Realtime TypeScript-first → Convex
```

---

## ☁️ Platforms — Quel hébergeur ?

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| Deploy web app rapide, Next.js/Astro | Vercel | [vercel.md](platforms/vercel.md) |
| **Stack 100% edge** (latence globale minimale) | **Cloudflare** (Workers + D1 + KV + R2 + Durable Objects) | [cloudflare.md](platforms/cloudflare.md) |
| Containers Docker / apps backend | Fly.io | [flyio.md](platforms/flyio.md) |
| Backend complet web : auth, DB, storage, realtime | Supabase | [supabase.md](platforms/supabase.md) |
| **App mobile** iOS/Android + push + offline sync | **Firebase** | [firebase.md](platforms/firebase.md) |
| App full AWS, grande équipe | AWS | [aws.md](platforms/aws.md) |
| Cloud EU souverain, hébergement FR/CH | Infomaniak | [infomaniak.md](platforms/infomaniak.md) |
| Containers managés EU, data residency | GCP Cloud Run | [gcp.md](platforms/gcp.md) |

> ⚠️ **Firebase vs Supabase** : Firebase est **mobile-first** (SDK iOS/Android natif, offline sync, FCM push, Auth mobile). Pour une app **web**, Supabase est quasi-systématiquement le meilleur choix. Firebase web SDK existe mais c'est pas son terrain — typiquement utilisé quand il y a une app mobile ET un dashboard web en parallèle.

> 🌐 **Cloudflare edge stack** : Si l'objectif est une latence globale minimale sans serveur centralisé, Cloudflare est l'écosystème natif. Workers (compute edge) + D1 (SQL edge) + KV (clés-valeurs edge, TTL natif) + R2 (blobs, pas d'egress fees) + Durable Objects (état persistant edge) forment un stack complet sans jamais quitter l'edge. Turso et Upstash sont les alternatives edge-compatibles quand on est hors CF ou qu'on veut un DB edge accessible depuis n'importe quel runtime.

---

## ☁️ Platforms — Arbre de décision

```
Type de projet ?
├── Frontend / JAMstack / Next.js
│   ├── + edge functions légères → Vercel
│   └── + tout Cloudflare ecosystem → CF Pages
├── Stack 100% edge (latence globale, pas de serveur centralisé)
│   └── Cloudflare Workers + D1 + KV + R2 + Durable Objects
│       (Turso / Upstash si besoin DB edge hors CF)
├── Backend / API / containers
│   ├── Docker-first, multi-régions → Fly.io
│   ├── Serverless functions → Cloudflare Workers
│   └── AWS-natif → Lambda / ECS
├── Full-stack platform (batteries included)
│   ├── Web app → Supabase (Postgres + auth + storage + realtime)
│   └── App MOBILE iOS/Android → Firebase (offline sync, FCM, auth mobile)
│       ⚠️ Firebase web SDK existe mais mobile-first — préférer Supabase pour web only
└── Data residency EU obligatoire
    ├── Hébergeur FR/CH → Infomaniak
    └── Cloud EU certified → GCP europe-west1
```

---

## 💳 Paiements — Quel provider ?

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| Contrôle total, API flexible, B2B | Stripe | [stripe.md](payments/stripe.md) |
| Solo / indie, ventes internationales, TVA déléguée | Lemon Squeezy | [lemon-squeezy.md](payments/lemon-squeezy.md) |
| Même chose mais plus enterprise / SaaS | Paddle | [paddle.md](payments/paddle.md) |
| EU-native, SEPA/iDEAL/Bancontact | Mollie | [mollie.md](payments/mollie.md) |

### Merchant of Record (MoR) vs Processor

```
Vends à des clients internationaux ?
├── Oui, et tu veux zéro gestion TVA → MoR
│   ├── Solo / micro-SaaS → Lemon Squeezy (5% + $0.50)
│   └── SaaS en croissance → Paddle (5% + $0.50)
└── Non, ou tu gères la TVA toi-même
    ├── Principalement EU → Mollie (1.8% + €0.25)
    └── Global, contrôle max → Stripe (1.5% EU / 2.9% + $0.30 US)
```

### Tableau comparatif frais

| Provider | Frais standard | Frais international | MoR | Andorre 🇦🇩 |
|----------|---------------|--------------------|----|------------|
| Stripe | ~1.5% EU / 2.9%+$0.30 US | +1.5% | ❌ | Marchand ❌ / Acheteur ✅ |
| Lemon Squeezy | 5% + $0.50 | Inclus | ✅ | Marchand ❌ / Acheteur ✅ |
| Paddle | 5% + $0.50 | Inclus | ✅ | Marchand ❌ / Acheteur ✅ |
| Mollie | ~1.8% + €0.25 (CB) | +frais | ❌ | Marchand ❌ / Acheteur ✅ (carte) |

> ⚠️ **Andorre** : Aucun provider ne supporte les comptes marchands andorrans. Un entrepreneur andorran doit avoir une entité légale dans un pays UE/EEE pour ouvrir un compte. Les clients andorrans peuvent payer par carte Visa/MC chez tous les providers.

---

## 📧 Email — Quel provider transactionnel ?

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| DX moderne, React Email, MVP rapide | Resend | [resend.md](email/resend.md) |
| Délivrabilité maximale pour transactionnel | Postmark | [postmark.md](email/postmark.md) |
| Email + marketing + CRM tout-en-un, EU | Brevo | [brevo.md](email/brevo.md) |
| Volume massif, routing complexe | Mailgun | [mailgun.md](email/mailgun.md) |
| Coût minimal, grande infrastructure AWS | Amazon SES | [amazon-ses.md](email/amazon-ses.md) |
| Alternative Resend moins connue, EU | Ahasend | [ahasend.md](email/ahasend.md) |
| Volume + marketing suite | SendGrid | [sendgrid.md](email/sendgrid.md) |

### Tableau comparatif email

| Provider | Free tier | Prix 10k emails | Prix 100k emails | Note |
|----------|-----------|-----------------|------------------|------|
| Resend | 3 000/mois | ~$20/mois | ~$90/mois | Meilleur DX 2025 |
| Postmark | 100/mois | $15/mois | ~$75/mois | Meilleure délivrabilité |
| Brevo | 300/jour | $9/mois | ~$25/mois | All-in-one EU |
| Mailgun | 0 (Flex PAYG) | ~$20/mois | ~$75/mois | Routing avancé |
| Amazon SES | 3k/mois (12 mois) | $1/mois | $10/mois | Le moins cher à grande échelle |
| SendGrid | 100/jour | $19.95/mois | ~$35/mois | Volume + marketing |
| Ahasend | Généreux | ~$10/mois | - | Alternative EU émergente |

---

## 🧩 Combinaisons stack recommandées par profil

### Micro-SaaS solo, budget minimal
```
Cloudflare Workers + D1 + KV + R2
+ Resend (email)
+ Lemon Squeezy (paiements MoR)
→ Coût fixe : ~$0–10/mois sur le free tier
```

### SaaS Next.js standard
```
Vercel (frontend) + Neon (Postgres) + Upstash Redis (cache/sessions)
+ Resend (email)
+ Stripe (paiements, si EU focus) ou Paddle (si international)
→ Coût : ~$20–50/mois
```

### App realtime TypeScript
```
Convex (DB + backend) + Cloudflare Workers (edge)
+ Resend
+ Stripe ou Lemon Squeezy
→ Coût : $0 free tier → $25+/mois
```

### App containerisée, full control
```
Fly.io (containers) + Supabase (Postgres + auth + storage)
+ Postmark (email)
+ Stripe
→ Coût : ~$30–80/mois selon taille
```

### Projet EU souverain, données sensibles
```
Infomaniak (hébergement) + Postgres self-hosted
+ Brevo (email EU)
+ Mollie (paiements EU-native)
→ Données 100% EU, RGPD simplifié
```

---

## 🖥️ Frontend — Quel choix selon la cible ?

| Cible | Recommandation | Fichier |
|-------|---------------|---------|
| SaaS / dashboard / app web | Next.js + shadcn/ui | [web.md](frontend/web.md) |
| Prototype / artifact / outil interne | HTML + DaisyUI (zéro framework) | [web.md](frontend/web.md) |
| Site marketing / blog / docs | Astro | [web.md](frontend/web.md) |
| Desktop multiplateforme (mac/win/linux) | Tauri (Rust + React) | [desktop.md](frontend/desktop.md) |
| Desktop macOS natif uniquement | SwiftUI | [desktop.md](frontend/desktop.md) |
| CLI requêtes HTTP / orchestration | Go (cobra + bubbletea) | [cli.md](frontend/cli.md) |
| CLI interne / script rapide | Bun + TypeScript | [cli.md](frontend/cli.md) |
| CLI système / parsing binaire | Rust | [cli.md](frontend/cli.md) |
| Mobile cross-platform (app simple) | React Native + Expo | [mobile.md](frontend/mobile.md) |
| Mobile iOS natif / hardware avancé | Swift / SwiftUI | [mobile.md](frontend/mobile.md) |
| Mobile Android natif / hardware avancé | Kotlin | [mobile.md](frontend/mobile.md) |

> 📝 **shadcn/ui vs DaisyUI** : shadcn pour un produit long terme (composants possédés, accessibilité Radix). DaisyUI pour les prototypes et artifacts — HTML + CSS pur, zéro framework, zéro JS obligatoire. Un fichier HTML suffit, résultat propre immédiat.

> 🖥️ **Desktop** : Tauri = backend Rust léger + frontend webview React. Binaire ~5 MB vs ~150 MB Electron. SwiftUI si macOS-only et intégration OS native critique.

> ⌨️ **CLI** : Go pour requêtes HTTP / orchestration (binaire statique cross-platform, cobra + bubbletea). Bun/TS si usage interne. Rust si parsing binaire bas niveau.

> 📱 **Mobile hardware avancé** : Bluetooth BLE profond, NFC, ARKit/ARCore → natif Swift/Kotlin. Bluetooth basique, push, formulaires → React Native suffit.

---

## 🔐 Auth — Quel provider ?

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| Auth open-source, self-hosted, TypeScript | Better Auth | [better-auth.md](auth/better-auth.md) |
| Auth Next.js, multi-providers OAuth | Auth.js (NextAuth v5) | [authjs.md](auth/authjs.md) |
| Auth managée clé en main, DX max | Clerk | [clerk.md](auth/clerk.md) |
| Auth intégrée à Supabase | Supabase Auth | [supabase-auth.md](auth/supabase-auth.md) |
| Auth enterprise (SSO SAML, SCIM) | WorkOS | [workos.md](auth/workos.md) |

```
Auth ?
├── Self-hosted / contrôle total → Better Auth
├── Next.js + OAuth simple → Auth.js
├── Clé en main, UI incluse → Clerk
├── Stack Supabase → Supabase Auth (inclus)
└── Enterprise SAML / annuaire → WorkOS
```

---

## ⚙️ Background Jobs / Queues

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| Jobs TypeScript, retry, planification | Inngest | [inngest.md](jobs/inngest.md) |
| Jobs longs / multi-étapes / complexes | Trigger.dev | [triggerdotdev.md](jobs/triggerdotdev.md) |
| Queue Redis self-hosted, Node.js | BullMQ | [bullmq.md](jobs/bullmq.md) |
| Queue dans l'écosystème Cloudflare | Cloudflare Queues | [cloudflare-queues.md](jobs/cloudflare-queues.md) |

```
Background jobs ?
├── Stack CF Workers → Cloudflare Queues
├── Redis self-hosted dispo → BullMQ
├── Serverless TypeScript, jobs simples → Inngest
└── Workflows longs / multi-étapes → Trigger.dev
```

---

## 🗂️ Storage / Blobs

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| Blobs dans l'écosystème Cloudflare | Cloudflare R2 | [cloudflare-r2.md](storage/cloudflare-r2.md) |
| Coût minimal, accès régulier, egress via CF | Backblaze B2 + CF | [backblaze-b2.md](storage/backblaze-b2.md) |
| **Archive longue durée / cold storage** | **GCS Archive / Coldline** | [google-cloud-storage.md](storage/google-cloud-storage.md) |

```
Storage ?
├── Assets servis publiquement (images, JS, CSS) → R2 (egress $0)
├── Fichiers clients actifs, uploads, backups chauds → B2 + CF (egress $0 via CF)
└── Archive longue durée (backups DB, documents >1 an)
    ├── Accès quasi-jamais (<1×/an) → GCS Archive ($1.23/TB/mois)
    └── Accès trimestriel (DR) → GCS Coldline ($4.10/TB/mois)
```

| Provider | Stockage/TB/mois | Egress/TB | Retrieval | Note |
|----------|-----------------|-----------|-----------|------|
| **GCS Archive** | **$1.23** | $80–120 | $0.05/GB | ⭐ Cold storage pur, quasi-gratuit |
| **GCS Coldline** | $4.10 | $80–120 | $0.02/GB | Disaster recovery trimestriel |
| **Backblaze B2 + CF** | $6 | $0 via CF | $0 via CF | Meilleur pour accès régulier |
| Cloudflare R2 | $15 | $0 | $0 | Natif CF, accès fréquent |
| AWS S3 | $23 | $90 | $0 (Standard) | Référence, mais cher |

> 💡 **Pattern backup multi-tier recommandé** :
> - Fichiers actifs → **B2 + CF** (egress gratuit, accès fréquent)
> - Backups DB quotidiens, archives > 1 an → **GCS Archive** (~$1.23/TB/mois)
>
> ⚠️ **GCS cold storage** : durée minimale 365 jours (Archive) ou 90 jours (Coldline). Supprimer avant = facturé quand même pour la durée entière. Et l'egress reste payant (~$0.08/GB) — pertinent uniquement si les données sont vraiment rarement lues.

---

## 🤖 AI / LLM

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| Routing multi-modèles, accès unifié | OpenRouter | [openrouter.md](ai/openrouter.md) |
| Génération images / vidéos | Pyo | [pyo.md](ai/pyo.md) |
| SDK TypeScript unifié pour Next.js | Vercel AI SDK | [vercel-ai-sdk.md](ai/vercel-ai-sdk.md) |

> 🔗 **Combo recommandé** : Vercel AI SDK + OpenRouter. Le SDK gère le DX et le streaming, OpenRouter gère le routing multi-modèles. Change de modèle sans refactoriser.

---

## 🔍 Search

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| CF Workers / edge / browser, zéro infra | Orama | [orama.md](search/orama.md) |
| Self-hosted, contrôle total, 🇫🇷 | Meilisearch | [meilisearch.md](search/meilisearch.md) |
| Cloud managé robuste, geo-search | Typesense | [typesense.md](search/typesense.md) |
| Référence managée, budget ok | Algolia | [algolia.md](search/algolia.md) |

```
Search ?
├── CF Workers / edge / browser → Orama (embarqué, zéro infra)
├── VPS disponible, données EU → Meilisearch self-hosted (gratuit)
├── Cloud managé + HA → Typesense Cloud ($6+/mois)
└── Enterprise, merchandising → Algolia
```

---

## 📝 CMS / Ops

| Besoin | Recommandation | Fichier |
|--------|---------------|---------|
| Blog, changelog, FAQ — contenu éditorial | Notion as CMS + ISR | [notion-cms.md](cms/notion-cms.md) |
| Liste d'attente, leads, mini-CRM early stage | Notion as CRM + n8n | [notion-crm.md](ops/notion-crm.md) |

> 💡 **Deux usages distincts** : Notion-CMS = contenu statique servi via cache Next.js ISR (visiteurs ne touchent jamais l'API). Notion-CRM = base opérationnelle pour gérer tes premiers users manuellement.

---

## 📊 Comparatif coût par palier

> Coûts infrastructure + DB + email. Auth et paiements non inclus.

### 🏠 Projet perso / usage interne

| Stack | Coût/mois |
|-------|-----------|
| CF Workers + D1 + KV | $0 |
| Vercel Hobby + Neon Free | $0 |
| Fly.io micro + SQLite | ~$3 |

### 🌱 Early stage — ~200 utilisateurs, ~5k req/jour

| Stack | Coût/mois |
|-------|-----------|
| CF Workers + D1 + Resend free | $0–5 |
| Vercel Hobby + Neon Free + Resend | $0 |
| Fly.io + Supabase Free + Resend | ~$5 |

### 📈 Growth — ~2k utilisateurs, ~50k req/jour

| Stack | Coût/mois |
|-------|-----------|
| CF Workers Paid + D1 + Resend | ~$10–20 |
| Vercel Pro + Neon Scale + Resend | ~$30–50 |
| Fly.io + Supabase Pro + Resend | ~$40–60 |

### 🚀 Scale — ~20k utilisateurs, ~500k req/jour

| Stack | Coût/mois |
|-------|-----------|
| CF Workers + D1 + Upstash + Postmark | ~$40–80 |
| Vercel Pro + Neon + Upstash + Postmark | ~$100–180 |
| Fly.io (2 machines) + Supabase Pro + Redis | ~$100–150 |
| AWS ECS + RDS + ElastiCache | ~$200–350 |

### 🏭 Hyper-scale — ~200k+ utilisateurs, ~5M+ req/jour

| Stack | Coût/mois |
|-------|-----------|
| CF Workers + D1 Pro + KV + R2 | ~$200–500 |
| AWS / GCP avec négociation | ~$500–2000+ |

> ⚠️ À ce stade les coûts variables (tokens AI, emails transactionnels, storage) dominent souvent l'infra fixe.

---

## 🧩 Combinaisons stack recommandées par coût

> Coûts infra uniquement (hors paiements, tokens AI, emails transactionnels au-delà du free tier).

---

### ⚡ Micro-SaaS solo / 100% edge
```
CF Workers + D1 + KV + R2
+ Better Auth
+ Resend
+ Lemon Squeezy (MoR, TVA déléguée)
```

| Palier | Users/mois | Coût infra/mois |
|--------|-----------|-----------------|
| Perso | — | **$0** |
| Early stage | ~1k MAU | **$0** |
| Growth | ~20k MAU | **$5–15** |
| Scale | ~200k MAU | **$20–60** |
| Hyper-scale | ~2M MAU | **$150–500** |

> 💡 Le stack le moins cher à toutes les échelles pour une app edge-native. Pas de coût idle.

---

### 🏗️ SaaS Next.js standard
```
Vercel + Neon + Upstash Redis
+ Better Auth (ou Clerk < 10k MAU)
+ Resend
+ Stripe (ou Paddle si international)
```

| Palier | Users/mois | Coût infra/mois |
|--------|-----------|-----------------|
| Perso | — | **$0** (Hobby + free tiers) |
| Early stage | ~1k MAU | **$0–20** |
| Growth | ~10k MAU | **$40–80** |
| Scale | ~100k MAU | **$150–300** |
| Hyper-scale | ~1M MAU | **$600–1500+** |

> ⚠️ Clerk devient cher au-delà de 10k MAU ($25+/mo). Migrer vers Better Auth à ce stade.

---

### 🤖 App AI-powered
```
Vercel + Neon + Upstash
+ Vercel AI SDK + OpenRouter
+ Pyo (images/vidéos)
+ Better Auth
+ Resend
```

| Palier | Users/mois | Coût infra/mois | Tokens AI (variable) |
|--------|-----------|-----------------|----------------------|
| Perso | — | **$0** | ~$5–20 |
| Early stage | ~500 MAU | **$20–30** | ~$20–100 |
| Growth | ~5k MAU | **$40–80** | ~$100–500 |
| Scale | ~50k MAU | **$150–300** | ~$500–2000+ |

> ⚠️ Les tokens AI dominent les coûts dès la croissance. Monitorer par utilisateur actif. Optimiser : cache des réponses fréquentes (Upstash), choix du modèle selon le besoin (Llama pour les tâches simples via OpenRouter).

---

### 📦 App containerisée, full control
```
Fly.io + Supabase (Postgres + auth + storage)
+ Inngest (background jobs)
+ Postmark
+ Stripe
```

| Palier | Users/mois | Coût infra/mois |
|--------|-----------|-----------------|
| Perso | — | **$0–5** |
| Early stage | ~1k MAU | **$20–35** |
| Growth | ~10k MAU | **$60–100** |
| Scale | ~100k MAU | **$200–400** |
| Hyper-scale | ~500k MAU | **$600–1200+** |

---

### 🇪🇺 Projet EU souverain
```
Infomaniak Public Cloud + Postgres self-hosted
+ Better Auth
+ Brevo (email EU)
+ Mollie (paiements EU-native)
```

| Palier | Users/mois | Coût infra/mois |
|--------|-----------|-----------------|
| Perso | — | **€0–5** |
| Early stage | ~500 MAU | **€25–40** |
| Growth | ~5k MAU | **€55–90** |
| Scale | ~50k MAU | **€120–200** |
| Hyper-scale | ~500k MAU | **€400–700+** |

> 💡 Données 100% en Suisse/France. Certifié ISO 27001. ~20–30% plus cher que CF ou Vercel, justifié pour secteur public, santé, finance.

---

## 🔑 Clés de décision rapide

| Question | Réponse oriente vers |
|----------|---------------------|
| Cloudflare ecosystem ? | D1, KV, Workers, R2, Queues |
| Scale-to-zero obligatoire ? | Neon, Turso, Upstash, CF Workers |
| Multi-tenant (DB par user) ? | Turso |
| Branching DB pour CI/CD ? | Neon |
| Realtime / subscriptions auto ? | Convex ou Supabase |
| Auth self-hosted TypeScript ? | Better Auth |
| Auth enterprise SAML/SSO ? | WorkOS |
| TVA EU déléguée ? | Lemon Squeezy ou Paddle |
| Meilleure délivrabilité email ? | Postmark |
| Meilleur DX email 2025 ? | Resend |
| Email à grande échelle, coût minimal ? | Amazon SES |
| Search dans CF Workers ? | Orama |
| Search self-hosted 🇫🇷 ? | Meilisearch |
| Blob storage le moins cher ? | Backblaze B2 + CF |
| Multi-modèles LLM ? | OpenRouter |
| SDK AI TypeScript / Next.js ? | Vercel AI SDK |
| UI prototype / artifact rapide ? | DaisyUI |
| Desktop multiplateforme ? | Tauri |
| CLI cross-platform ? | Go |
| Data residency EU strict ? | Infomaniak ou GCP EU |
| Budget zéro, prototype ? | CF free + Neon free + Resend free = $0 |

---

> 🕐 Mettre à jour trimestriellement. Points de vigilance : prix Neon (baisses fréquentes), Better Auth (projet jeune, évolution rapide), statut Lemon Squeezy (acquisition Stripe potentielle), nouveaux entrants paiement (Polar, DodoPayments).
