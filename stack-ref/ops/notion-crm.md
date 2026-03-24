---
last_updated: 2026-03-17
confidence: high
category: ops
type: managed
pricing_model: [free, per-workspace]
free_tier: true
---

# Notion as Mini-CRM / Ops

> _Notion comme backoffice opérationnel early-stage — liste d'attente, leads, questionnaires._

## Ce que c'est

Utiliser Notion comme base de données opérationnelle pour gérer les premiers utilisateurs, les demandes entrantes, les listes d'attente, et les réponses à des formulaires. Pas un CMS de contenu — un outil de pilotage humain pour les 0 → 500 premiers users.

**Cas d'usage** :
- Liste d'attente automatiquement alimentée depuis un formulaire ou email
- Leads entrants → row Notion avec statut (À contacter, En cours, Converti)
- Réponses à un questionnaire d'onboarding
- Demandes support ou feedback early adopters

## Architecture type

```
Formulaire (Tally / typeform) ──→ Webhook ──→ n8n ──→ Notion API
Email entrant                  ──→ n8n parsing ──→ Notion API
Landing page form              ──→ API route Next.js ──→ Notion API
```

Tu ouvres Notion → tu vois tous tes contacts, tu peux filtrer par statut, tagger, commenter, envoyer un email direct.

## Intégrations recommandées

| Source | Outil intermédiaire | Résultat |
|--------|--------------------|---------||
| Formulaire web | n8n / Zapier | Nouvelle row dans une table Notion |
| Email entrant | n8n (IMAP/Gmail) | Parsing + row Notion |
| Webhook externe | n8n | Row Notion avec données extraites |
| API route Next.js | Notion SDK direct | Row Notion à la soumission |

## Notion SDK TypeScript

```typescript
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

await notion.pages.create({
  parent: { database_id: process.env.NOTION_DB_ID },
  properties: {
    Name: { title: [{ text: { content: email } }] },
    Email: { email },
    Source: { select: { name: 'waitlist' } },
    Status: { select: { name: 'À contacter' } },
    CreatedAt: { date: { start: new Date().toISOString() } },
  },
})
```

## Free tier / Pricing

- Plan gratuit Notion suffit largement pour un usage solo early-stage
- API incluse sur tous les plans
- Limite pratique : ~1000 rows par DB sur le plan gratuit (suffisant pour les premiers 1000 contacts)

## ✅ Quand utiliser

- 0 → 500 premiers utilisateurs/leads à gérer manuellement
- Pas envie de builder un backoffice admin custom
- Tu veux une vue humaine sur tes contacts (pas juste une DB)
- Déjà utilisateur Notion
- Questionnaires / formulaires d'onboarding dont tu veux traiter les réponses manuellement

## ❌ Quand ne PAS utiliser

- > 1000 contacts actifs → migrer vers un vrai CRM (Airtable, HubSpot free, ou DB custom)
- Besoin d'automatisations complexes CRM (scoring, séquences emails) → HubSpot ou CRM dédié
- Équipe commerciale → outil CRM dédié

## Migration quand Notion devient trop petit

```
Notion (0–500 users) 
  → Airtable (500–5k, plus puissant, même concept)
  → HubSpot Free (si ventes B2B)
  → Backoffice custom Next.js + Postgres (si volume ou logique complexe)
```

## Combinaisons stack
- `Notion + n8n + Tally` → formulaire → automatisation → CRM
- `Notion + n8n + Gmail` → email entrant → parsing → Notion
- `Notion API + Next.js API route` → formulaire landing page → Notion direct

## Ressources
- [developers.notion.com](https://developers.notion.com)
- [notionhq/client npm](https://www.npmjs.com/package/@notionhq/client)
