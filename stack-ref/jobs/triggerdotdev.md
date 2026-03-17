---
last_updated: 2026-03-17
confidence: high
category: jobs
type: managed
pricing_model: [free, per-run]
free_tier: true
---

# Trigger.dev

> _Jobs long-running TypeScript — la solution pour dépasser les timeouts serverless._

## Ce que c'est

Plateforme de background jobs orientée **tâches longues**. Contrairement à Inngest, Trigger.dev permet des jobs qui durent minutes voire heures, avec un SDK pour attendre des événements, faire des waits, ou orchestrer des séquences longues.

## Free tier

- **5 000 runs/mois** gratuits (moins généreux qu'Inngest)

## Pricing

| Plan | Prix/mois | Runs inclus |
|------|-----------|-------------|
| Free | $0 | 5k |
| Hobby | $5 | 50k |
| Pro | $20 | 300k |

## Features clés

- Jobs TypeScript qui peuvent durer **heures** (pas limités aux timeouts Lambda/CF)
- `wait.for()` — attend un événement externe (webhook, délai)
- Concurrency control
- Retry configurable
- Dashboard avec logs temps réel
- Open-source (self-hostable)

## ✅ Quand utiliser

- Jobs qui dépassent les timeouts serverless (>30s)
- Pipelines AI / LLM (traitement long, chunking)
- Scraping, génération de rapports, export de données
- Orchestration qui attend des webhooks externes

## ❌ Quand ne PAS utiliser

- Jobs courts (<10s), volume élevé → Inngest ou BullMQ
- Cloudflare Workers only → CF Queues

## Alternatives directes
- Inngest (meilleur free tier, jobs courts/moyens)
- BullMQ (self-hosted, Redis)

## Ressources
- [trigger.dev](https://trigger.dev)
