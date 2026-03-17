---
last_updated: 2026-03-17
confidence: high
category: ai
type: sdk
pricing_model: [free, open-source]
free_tier: true
---

# Vercel AI SDK

> _Abstraction TypeScript unifiée pour intégrer des LLMs dans des apps Next.js / Node / edge._

## Ce que c'est

SDK open-source de Vercel pour consommer des LLMs (OpenAI, Anthropic, Google, Mistral, OpenRouter...) avec une API unifiée. Gère le streaming, les tool calls, les embeddings, et le rendu React (useChat, useCompletion). S'intègre nativement dans Next.js mais fonctionne aussi en Node.js pur et Cloudflare Workers.

**GitHub** : vercel/ai — MIT license

## Features clés

- **Provider unifié** : change de modèle/provider en changeant une ligne
- **Streaming natif** : `streamText`, `streamObject` — UX fluide sans code custom
- **Tool calls** : définition de tools typés TypeScript, exécution automatique
- **Structured output** : `generateObject` avec schema Zod → JSON typé garanti
- **React hooks** : `useChat`, `useCompletion`, `useObject` pour l'UI
- **Edge-compatible** : tourne dans CF Workers, Vercel Edge Functions

## Providers supportés

OpenAI, Anthropic, Google (Gemini), Mistral, Groq, Cohere, Amazon Bedrock, Azure, **OpenRouter** (via provider custom ou `@ai-sdk/openai` pointant sur OpenRouter)

## Exemples

```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Résume ce texte...',
})
```

```typescript
// Avec OpenRouter
import { createOpenAI } from '@ai-sdk/openai'

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

const { text } = await generateText({
  model: openrouter('anthropic/claude-sonnet-4-5'),
  prompt: '...',
})
```

```typescript
// Structured output
import { generateObject } from 'ai'
import { z } from 'zod'

const { object } = await generateObject({
  model: openai('gpt-4o'),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
  }),
  prompt: 'Analyse ce contenu...',
})
// object est typé automatiquement
```

## Pricing

Gratuit (open-source). Tu paies uniquement les tokens au provider (OpenAI, Anthropic, OpenRouter...).

## ✅ Quand utiliser

- App Next.js avec chat, completion, ou génération structurée
- Tu veux garder la flexibilité de changer de provider/modèle sans refactoriser
- Besoin de streaming côté client avec React
- Tool calling typé TypeScript

## ❌ Quand ne pas utiliser

- CLI ou script simple → appel HTTP direct à OpenRouter suffit
- Pas de Next.js et pas besoin des hooks React → overhead inutile, appel direct API

## Relation avec OpenRouter

Vercel AI SDK + OpenRouter = combinaison idéale. Le SDK gère l'abstraction et le streaming, OpenRouter gère le routing multi-modèles et les fallbacks. Tu gardes le contrôle du modèle via OpenRouter, et le DX via le SDK.

## Ressources

- [Documentation](https://sdk.vercel.ai)
- [GitHub](https://github.com/vercel/ai)
