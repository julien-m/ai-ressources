---
last_updated: 2026-03-17
confidence: high
category: jobs
type: self-hosted
pricing_model: [open-source]
free_tier: true
---

# BullMQ

> _Queue Redis self-hosted — performant, mature, zéro coût à l'échelle._

## Ce que c'est

Lib Node.js/TypeScript de queue basée sur Redis. Tu gères l'infrastructure (Redis + workers), mais contrôle total et coût minimal à grande échelle.

## Pricing

Open-source MIT. Tu payes uniquement le Redis (Upstash, Redis self-hosted).

## Features clés

- Queue FIFO, priorités, délai, repeat (cron)
- Workers concurrents (scaling horizontal)
- Retry avec backoff exponentiel
- Rate limiting par queue
- Bull Board — dashboard UI optionnel
- TypeScript natif

## ✅ Quand utiliser

- App avec serveur Node persistant (Fly.io, VPS)
- Volume élevé de jobs (> 1M/mois) → coût self-hosted << managed
- Redis déjà dans le stack
- Besoin de contrôle total sur le scheduling

## ❌ Quand ne PAS utiliser

- App serverless/edge uniquement → Inngest
- Pas envie de gérer Redis → Inngest ou Trigger.dev

## Combinaisons stack
- `BullMQ + Upstash Redis` → queue serverless sans infra Redis
- `BullMQ + Redis self-hosted + Fly.io` → workers persistants

## Ressources
- [bullmq.io](https://bullmq.io)
