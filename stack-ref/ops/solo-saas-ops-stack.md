---
last_updated: 2026-03-24
confidence: high
category: ops
type: playbook
pricing_model: [free, usage-based, flat]
free_tier: true
open_source: false
---

# Solo SaaS Ops Stack

> _Playbook opérationnel pour développeur solo SaaS — les 5 piliers ops essentiels, du MVP au premier scaling._

## Vue d'ensemble
| # | Pilier | Choix par défaut | Coût au démarrage |
|---|--------|-----------------|-------------------|
| 1 | Error Tracking / Observabilité | Sentry | Gratuit (5K errors/mois) |
| 2 | Analytics Produit | Plausible | 9 €/mois |
| 3 | Uptime / Status Page | BetterStack | Gratuit (10 monitors) |
| 4 | Support / Helpdesk | Crisp | Gratuit (2 agents) |
| 5 | Feature Flags / Rollout | Variables d'environnement | Gratuit |

## 1. Error Tracking / Observabilité
**Choix par défaut : Sentry** — standard de facto, intégration Next.js native (wizard CLI, source maps, performance monitoring).

**Pourquoi** : free tier généreux (5K errors + 10K transactions/mois), meilleur DX (stack traces enrichies, breadcrumbs, session replay), alertes Slack/email, SDK ~15KB gzipped.

| Plan | Prix | Inclus |
|------|------|--------|
| Developer | Gratuit | 5K errors/mois, 10K transactions, 1 user |
| Team | $26/mois | 50K errors, 100K transactions, alertes avancées |
| Business | $80/mois | 100K errors, custom retention, SSO |

> Dépassement free tier : erreurs ignorées (pas de facturation surprise).

**Alternatives**

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **BetterStack** | Logs + uptime + error tracking combo | 1 source, 1 Go logs/mois |
| **Axiom** | Ingestion illimitée, logs structurés — error tracking moins bon | 500 Go ingest/mois, 30j rétention |
| **Highlight.io** | Open source, session replay + error tracking unifié | 500 sessions/mois, 1 000 errors/mois |

> Bonnes pratiques : structured logging cohérent. Voir **Read** [`../../code-conventions/logging.md`](../../code-conventions/logging.md).

**Quand passer** : > 5K errors/mois → Team ($26/mo) ou corriger le bruit. Besoin logs centralisés → Axiom ou BetterStack. Full-stack observability → Datadog/Grafana Cloud (coût significant).

## 2. Analytics Produit
**Choix par défaut : Plausible** — analytics minimaliste, RGPD sans cookie banner, script < 1KB, hébergé EU.

| Plan | Prix | Inclus |
|------|------|--------|
| Growth | 9 €/mois | 10K pageviews/mois, sites illimités |
| Growth | 19 €/mois | 100K pageviews/mois |
| Growth | 29 €/mois | 200K pageviews/mois |

> Pas de free tier hébergé. Version self-hosted gratuite (Community Edition, open source).

**Alternatives**

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **PostHog** | Funnels, rétention, session replay, feature flags — tout-en-un | 1M events/mois, 5K sessions replay/mois |
| **Umami** | Open source, self-hosted, clone Plausible | Illimité (self-hosted) |
| **Mixpanel** | Analytics événementiel avancé : funnels, cohortes | 20M events/mois |

**Quand passer** : besoin funnels/rétention → PostHog. > 100K pageviews/mois → Umami self-hosted ou PostHog. Feature flags + analytics → PostHog combine les deux.

## 3. Uptime / Status Page
**Choix par défaut : BetterStack** — monitoring uptime + status page publique + incidents dans un outil, free tier couvre largement les besoins solo.

| Plan | Prix | Inclus |
|------|------|--------|
| Free | Gratuit | 10 monitors, 3 min interval, status page, alertes email |
| Starter | $24/mois | 20 monitors, 30 sec interval, SMS, on-call |
| Business | $84/mois | 80 monitors, API monitoring, maintenance windows |

**Alternatives**

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **UptimeRobot** | Le plus ancien, simple, 50 monitors gratuits — status page basique | 50 monitors, 5 min interval |
| **OpenStatus** | Open source, edge-based (CF Workers), self-hostable | 5 monitors (cloud), illimité (self-hosted) |
| **Instatus** | Status pages très esthétiques, focus communication d'incidents | 1 status page, illimité composants |

> Intégrations : **Read** [`../../architecture/webhook-patterns.md`](../../architecture/webhook-patterns.md) · **Read** [`../../architecture/background-jobs.md`](../../architecture/background-jobs.md)

**Quand passer** : monitoring < 30 sec → BetterStack payant. Synthetic monitoring → Checkly. Multi-région latence → BetterStack payant ou Grafana Cloud.

## 4. Support / Helpdesk
**Choix par défaut : Crisp** — chat live + helpdesk + base de connaissance, free tier 2 agents.

| Plan | Prix | Inclus |
|------|------|--------|
| Basic | Gratuit | 2 agents, chat live, inbox |
| Pro | $25/mois/workspace | 4 agents, knowledge base, chatbot, analytics |
| Unlimited | $95/mois/workspace | Agents illimités, automations avancées |

**Alternatives**

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **Intercom** | Automations, bots IA, product tours — cher | Aucun (à partir de $74/mois) |
| **Plain** | Developer-first, API-first, intégration Linear/GitHub | Gratuit jusqu'à 500 conversations/mois |
| **Email simple** | `support@` + boîte partagée — zéro outil à apprendre | Coût de la boîte mail |

> Stratégie : MVP → simple `support@monapp.com`. Ajouter chat live (Crisp) avec les premiers payants.

**Quand passer** : > 50 tickets/semaine → chatbot Crisp Pro ou Intercom. Intégration profonde Linear/GitHub → Plain. Équipe > 4 → Intercom ou Zendesk.

## 5. Feature Flags / Rollout
**Choix par défaut : Variables d'environnement** — zéro dépendance, zéro coût, changement = redéploiement (acceptable solo).

```typescript
const isNewDashboard = process.env.FEATURE_NEW_DASHBOARD === 'true'
```

| Solution | Prix | Inclus |
|----------|------|--------|
| Env vars | Gratuit | Illimité, aucun service tiers |
| PostHog Feature Flags | Gratuit | 1M API requests/mois |
| Vercel Edge Config | Inclus (Pro) | Near-zero latency, 256 KB storage |
| LaunchDarkly | $10/mois/seat | 1K flags, targeting avancé |
| Unleash | Gratuit (self-hosted) | Illimité |

**Alternatives pour gradual rollout / A/B testing**

| Alternative | Cas d'usage | Free tier |
|-------------|-------------|-----------|
| **PostHog Feature Flags** | Gradual rollout + A/B testing intégré aux analytics | 1M API requests/mois |
| **Vercel Edge Config** | Changement sans redéploiement si déployé sur Vercel | Inclus dans Vercel Pro |
| **LaunchDarkly** | Enterprise : targeting par segment, audit trail | Aucun free tier significatif |
| **Unleash** | Open source, self-hosted, feature complet | Illimité (self-hosted) |

## Stack optimale solo SaaS
```
Sentry (errors) + Plausible (analytics) + BetterStack (uptime) + Crisp (support) + env vars (flags)
```

**Coût total** : ~9 €/mois (uniquement Plausible).

**Variante budget zéro** : Plausible → Umami self-hosted → 0 €/mois.

**Variante tout-en-un** : PostHog remplace Plausible + feature flags → analytics + session replay + flags (free tier 1M events/mois).

## Évolution naturelle
| Trigger | Action |
|---------|--------|
| > 5K erreurs/mois sur Sentry | Corriger le bruit ou Sentry Team ($26/mois) |
| Besoin de funnels / rétention | Migrer Plausible → PostHog |
| > 100K pageviews/mois | Umami self-hosted ou PostHog |
| Besoin de logs centralisés | Axiom ou BetterStack Logs |
| Monitoring < 30 sec nécessaire | BetterStack Starter ($24/mois) |
| > 50 tickets support/semaine | Chatbot Crisp Pro ou Intercom |
| Besoin de gradual rollout | Env vars → PostHog Feature Flags |
| Équipe > 1 dev | LaunchDarkly ou Unleash pour les flags |
| Premiers utilisateurs payants | Ajouter Crisp chat live si pas déjà fait |
| Besoin d'observabilité full-stack | Grafana Cloud ou Datadog |
## Voir aussi
- **Read** [`../../architecture/background-jobs.md`](../../architecture/background-jobs.md) — patterns jobs background avec monitoring
- **Read** [`../../architecture/webhook-patterns.md`](../../architecture/webhook-patterns.md) — résilience et health checks webhooks
- **Read** [`../../code-conventions/logging.md`](../../code-conventions/logging.md) — conventions de structured logging
- **Read** [`notion-crm.md`](notion-crm.md) — Notion comme mini-CRM ops early-stage

> **A mettre a jour si > 3 mois** — Verifier : prix, limites free tier, nouveaux plans, nouvelles alternatives.
