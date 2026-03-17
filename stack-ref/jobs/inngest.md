---
last_updated: 2026-03-17
confidence: high
category: jobs
type: managed
pricing_model: [free, per-run]
free_tier: true
---

# Inngest

> _Background jobs et workflows TypeScript — serverless-native, retry automatique, observabilité._

## Ce que c'est

Plateforme de background jobs et workflows pour TypeScript. Tu écris des fonctions TypeScript décorées, Inngest les orchestre (scheduling, retry, fan-out, step functions). Fonctionne avec Next.js, Cloudflare Workers, Express, Bun.

## Free tier

- **50 000 runs/mois** gratuits
- Logs et traces inclus

## Pricing

| Runs/mois | Prix |
|-----------|------|
| 0–50k | Gratuit |
| 50k–5M | $20/mois (+ $1/10k runs) |
| 5M+ | Sur devis |

## Features clés

- `inngest.createFunction()` — définit une fonction avec retry natif
- **Step functions** — découpe un job en étapes avec état persistant
- **Fan-out** — déclenche N jobs en parallèle depuis un event
- Scheduling (cron)
- Replay de jobs en erreur depuis le dashboard
- SDK TypeScript typé
- Local dev server (pas de cloud nécessaire pour dev)

## ✅ Quand utiliser

- App Next.js/serverless avec besoin de jobs async
- Workflows multi-étapes avec état (onboarding, pipeline d'emails)
- Fan-out (traiter N items en parallèle)
- Pas envie de gérer une infrastructure de queue

## ❌ Quand ne PAS utiliser

- App avec worker Node.js persistant déjà en place → BullMQ
- Cloudflare-only → CF Queues natif
- Volume massif à faible coût → BullMQ self-hosted

## Combinaisons stack
- `Inngest + Next.js + Resend` → pipeline d'emails triggered
- `Inngest + Supabase` → webhooks DB → jobs async

## Ressources
- [inngest.com](https://inngest.com)
