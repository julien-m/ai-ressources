---
last_updated: 2026-03-17
confidence: high
category: ai
type: managed
pricing_model: [per-token]
free_tier: false
---

# OpenRouter

> _Routeur multi-modèles LLM — une API, tous les providers._

> ⭐ **Choix actuel** pour tout ce qui est LLM text/chat.

## Ce que c'est
API unifiée qui route vers 200+ modèles LLM (Anthropic Claude, OpenAI GPT, Google Gemini, Meta Llama, Mistral, DeepSeek...). Une seule clé API, un seul format (OpenAI-compatible), tous les providers. Permet de switcher de modèle sans changer le code.

## Pricing
Pay-as-you-go, prix par token selon le modèle. OpenRouter prend une petite marge sur certains providers.

### Exemples de prix (input/output per 1M tokens)
| Modèle | Input | Output |
|--------|-------|--------|
| Claude Sonnet 4.5 | ~$3 | ~$15 |
| GPT-4o | ~$2.50 | ~$10 |
| Llama 3.3 70B | ~$0.40 | ~$0.40 |
| DeepSeek V3 | ~$0.14 | ~$0.28 |
| Gemini 2.0 Flash | ~$0.10 | ~$0.40 |

> Vérifier [openrouter.ai/models](https://openrouter.ai/models) pour les prix à jour.

## Features clés
- API OpenAI-compatible (`/chat/completions`)
- **Fallback automatique** entre modèles (si un provider est down)
- **Load balancing** entre providers
- Routing conditionnel (prix max, latence, contexte)
- Dashboard usage par modèle
- Clé API unique pour tous les providers
- Streaming SSE
## ✅ Quand utiliser
- Besoin d'accéder à plusieurs modèles sans gérer N clés API
- Flexibilité : tester différents modèles, switcher selon le coût
- Fallback résilience en production
- Accès aux modèles open-source (Llama, Mistral, DeepSeek)
## ❌ Quand ne PAS utiliser
- Besoin de features spécifiques providers (Anthropic computer use direct, OpenAI Realtime Audio) → API directe
- SLA enterprise garanti → API directe du provider
## Combinaisons stack
- `OpenRouter + Vercel AI SDK` → abstraction complète multi-modèle
- `OpenRouter + cc-hub` → routing LLM centralisé dans l'écosystème
## Ressources
- [openrouter.ai](https://openrouter.ai)
- [openrouter.ai/models](https://openrouter.ai/models)
