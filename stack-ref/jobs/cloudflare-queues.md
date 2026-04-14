---
last_updated: 2026-03-17
confidence: high
category: jobs
type: managed
pricing_model: [free, per-message]
free_tier: true
---

# Cloudflare Queues

> _Queue native Cloudflare Workers — pertinente uniquement dans l'écosystème CF._

## Ce que c'est
Service de queue intégré à Cloudflare Workers. Producer et consumer sont des Workers. FIFO, retry automatique, dead-letter queue. Pas de serveur à gérer.

## Free tier
- **5 millions de messages/mois** gratuits

## Pricing
| Messages/mois | Prix |
|---------------|------|
| 0–5M | Gratuit |
| 5M+ | $0.40/million |

## Features clés
- Push depuis n'importe quel Worker
- Consumer Worker déclenché automatiquement
- Batch processing (traiter N messages à la fois)
- Retry + dead-letter queue
- Délai de livraison configurable
## ✅ Quand utiliser
- Stack 100% Cloudflare Workers
- Jobs légers déclenchés par des events (webhook → queue → traitement)
- Volume important à faible coût
## ❌ Quand ne PAS utiliser
- Stack hors Cloudflare → Inngest ou BullMQ
- Jobs longs (CF Workers timeout 30s) → Trigger.dev
- Workflows complexes multi-étapes → Inngest
## Ressources
- [developers.cloudflare.com/queues](https://developers.cloudflare.com/queues/)
