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

Cinq piliers couvrent 95 % des besoins ops d'un SaaS solo :

| # | Pilier | Choix par défaut | Coût au démarrage |
|---|--------|-----------------|-------------------|
| 1 | Error Tracking / Observabilité | Sentry | Gratuit (5K errors/mois) |
| 2 | Analytics Produit | Plausible | 9 €/mois |
| 3 | Uptime / Status Page | BetterStack | Gratuit (10 monitors) |
| 4 | Support / Helpdesk | Crisp | Gratuit (2 agents) |
| 5 | Feature Flags / Rollout | Variables d'environnement | Gratuit |

---

## 1. Error Tracking / Observabilité

### Choix par défaut : Sentry

Sentry est le standard de facto pour le error tracking côté frontend et backend. Son free tier est suffisant pour un solo SaaS en phase de lancement, et l'intégration Next.js est native (wizard CLI, source maps automatiques, performance monitoring).

**Pourquoi Sentry** :
- Free tier généreux : 5 000 erreurs/mois + 10K transactions performance
- Meilleur DX du marché : stack traces enrichies, breadcrumbs, session replay
- Intégration Next.js officielle (source maps, API routes, server components)
- Alertes Slack/email configurables par projet
- SDK léger (~15 KB gzipped côté client)

### Pricing résumé

| Plan | Prix | Inclus |
|------|------|--------|
| Developer | Gratuit | 5K errors/mois, 10K transactions, 1 user |
| Team | $26/mois | 50K errors, 100K transactions, alertes avancées |
| Business | $80/mois | 100K errors, custom retention, SSO |

> Dépassement free tier : les erreurs au-delà du quota sont ignorées (pas de facturation surprise).

### Alternatives

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **BetterStack** | Logs + uptime + error tracking combo — un seul outil pour monitoring et logs | 1 source, 1 Go logs/mois |
| **Axiom** | Ingestion illimitée sur le free tier, excellent pour les logs structurés — moins bon sur le error tracking pur | 500 Go ingest/mois, 30 jours rétention |
| **Highlight.io** | Open source, session replay + error tracking unifié — bon si tu veux voir exactement ce que l'utilisateur faisait avant le crash | 500 sessions/mois, 1 000 errors/mois |

### Bonnes pratiques

Pour maximiser la valeur du error tracking, utiliser du structured logging cohérent dans toute la codebase. Voir **Read** [`../../code-conventions/logging.md`](../../code-conventions/logging.md) pour les conventions de logging et la gestion des données sensibles.

### Quand passer à autre chose

- **> 5K erreurs/mois régulièrement** → passer au plan Team ($26/mois) ou corriger les erreurs bruyantes
- **Besoin de logs centralisés en plus** → ajouter Axiom ou BetterStack pour les logs, garder Sentry pour les erreurs
- **Besoin d'observabilité full-stack (traces, métriques, logs)** → évaluer Datadog ou Grafana Cloud (mais coût significatif)

---

## 2. Analytics Produit

### Choix par défaut : Plausible

Plausible est un outil d'analytics web minimaliste, conforme RGPD sans cookie banner, hébergé en UE. Pour un solo SaaS, les métriques de base (visiteurs, pages vues, sources de trafic, pays) suffisent pour les premières décisions produit.

**Pourquoi Plausible** :
- Pas de cookie banner nécessaire (pas de cookies, pas de tracking cross-site)
- Conformité RGPD native — données hébergées en UE
- Script < 1 KB — aucun impact sur les Core Web Vitals
- Dashboard simple et lisible, pas de configuration complexe
- API pour extraire les données programmatiquement

### Pricing résumé

| Plan | Prix | Inclus |
|------|------|--------|
| Growth | 9 €/mois | 10K pageviews/mois, sites illimités |
| Growth | 19 €/mois | 100K pageviews/mois |
| Growth | 29 €/mois | 200K pageviews/mois |

> Pas de free tier hébergé. Version self-hosted gratuite (Community Edition, open source).

### Alternatives

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **PostHog** | Analytics produit complet : funnels, rétention, session replay, feature flags — tout-en-un | 1M events/mois, session replay 5K/mois |
| **Umami** | Open source, self-hosted, gratuit — clone de Plausible à héberger soi-même | Illimité (self-hosted) |
| **Mixpanel** | Analytics événementiel avancé : funnels, cohortes, flows — puissant mais courbe d'apprentissage | 20M events/mois |

### Stratégie progressive

Pour un solo SaaS, commencer avec des analytics de type pageview (Plausible) est suffisant. Passer à des analytics produit (PostHog, Mixpanel) uniquement quand tu as besoin de :
- Funnels de conversion (inscription → activation → paiement)
- Analyse de rétention par cohorte
- Session replay pour comprendre les points de friction

### Quand passer à autre chose

- **Besoin de funnels / rétention** → PostHog (free tier très généreux, migration facile)
- **> 100K pageviews/mois** → le coût Plausible monte, évaluer Umami self-hosted ou PostHog
- **Besoin de product analytics + feature flags** → PostHog combine les deux

---

## 3. Uptime / Status Page

### Choix par défaut : BetterStack (ex BetterUptime)

BetterStack combine monitoring uptime, status page publique, et gestion d'incidents dans un seul outil. Le free tier couvre largement les besoins d'un solo SaaS.

**Pourquoi BetterStack** :
- Free tier : 10 monitors, vérification toutes les 3 minutes, status page incluse
- Status page publique personnalisable (sous-domaine ou domaine custom)
- Alertes multi-canal : email, SMS, Slack, webhook
- Intégration logs (même plateforme, upgrade possible)
- Incident management intégré

### Pricing résumé

| Plan | Prix | Inclus |
|------|------|--------|
| Free | Gratuit | 10 monitors, 3 min interval, status page, alertes email |
| Starter | $24/mois | 20 monitors, 30 sec interval, SMS, on-call |
| Business | $84/mois | 80 monitors, API monitoring, maintenance windows |

> Dépassement free tier : impossible, les monitors au-delà du quota ne peuvent pas être créés.

### Alternatives

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **UptimeRobot** | Le plus ancien et simple, 50 monitors gratuits — mais status page basique | 50 monitors, 5 min interval |
| **OpenStatus** | Open source, edge-based (Cloudflare Workers), moderne — self-hostable | 5 monitors (cloud), illimité (self-hosted) |
| **Instatus** | Status pages très esthétiques, focus sur la communication d'incidents | 1 status page, illimité composants |

### Intégrations architecture

Le monitoring uptime s'intègre avec les patterns d'architecture qui exposent des endpoints de santé. Voir :
- **Read** [`../../architecture/webhook-patterns.md`](../../architecture/webhook-patterns.md) — health checks sur les endpoints webhook
- **Read** [`../../architecture/background-jobs.md`](../../architecture/background-jobs.md) — monitoring des queues et jobs

### Quand passer à autre chose

- **Besoin de monitoring < 30 sec** → plan payant BetterStack ou monitoring custom
- **Besoin de synthetic monitoring (parcours utilisateur)** → Checkly ou Datadog Synthetics
- **Multi-région avec latence tracking** → BetterStack payant ou Grafana Cloud

---

## 4. Support / Helpdesk

### Choix par défaut : Crisp

Crisp offre un chat live + helpdesk + base de connaissance dans un seul outil, avec un free tier qui couvre 2 agents. Parfait pour un solo dev qui veut un canal de support professionnel sans complexité.

**Pourquoi Crisp** :
- Free tier : 2 agents, chat live, boîte de réception partagée
- Widget chat personnalisable et léger
- Base de connaissance intégrée (réduit le volume de tickets)
- Chatbot basique inclus (réponses automatiques, redirection)
- Application mobile pour répondre en déplacement

### Pricing résumé

| Plan | Prix | Inclus |
|------|------|--------|
| Basic | Gratuit | 2 agents, chat live, inbox |
| Pro | $25/mois/workspace | 4 agents, knowledge base, chatbot, analytics |
| Unlimited | $95/mois/workspace | Agents illimités, automations avancées |

> Free tier limité en features mais suffisant pour du support de base.

### Alternatives

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **Intercom** | Le plus puissant : automations, bots IA, product tours — mais cher | Aucun (à partir de $74/mois) |
| **Plain** | Developer-first, API-first, intégration native avec les outils dev (Linear, GitHub) | Gratuit jusqu'à 500 conversations/mois |
| **Email simple** | Un `support@` avec boîte partagée (Google Workspace, Fastmail) — zéro outil à apprendre | Coût de la boîte mail |

### Stratégie progressive

Pour un MVP ou early-stage, un simple `support@monapp.com` suffit. Ajouter un chat live (Crisp) quand tu as des utilisateurs payants — le support temps réel augmente la confiance et réduit le churn.

### Quand passer à autre chose

- **> 50 tickets/semaine régulièrement** → automatiser avec chatbot Crisp Pro ou évaluer Intercom
- **Besoin d'intégration profonde avec l'outil de gestion (Linear, GitHub)** → Plain
- **Équipe support > 4 personnes** → Intercom ou Zendesk
- **Support B2B enterprise (SLA, tickets prioritaires)** → Intercom ou solution dédiée

---

## 5. Feature Flags / Rollout

### Choix par défaut : Variables d'environnement

Pour un développeur solo, des variables d'environnement simples (`FEATURE_NEW_DASHBOARD=true`) sont la solution la plus pragmatique. Aucune dépendance externe, aucun coût, aucune latence ajoutée.

**Pourquoi les env vars** :
- Zéro dépendance, zéro coût
- Fonctionne partout (Vercel, Cloudflare, Node.js, n'importe quel runtime)
- Changement = redéploiement (acceptable pour un solo dev)
- Pas de SDK à intégrer, pas de risque de vendor lock-in

```typescript
// Simple et efficace
const isNewDashboard = process.env.FEATURE_NEW_DASHBOARD === 'true'
```

### Pricing résumé

| Solution | Prix | Inclus |
|----------|------|--------|
| Env vars | Gratuit | Illimité, aucun service tiers |
| PostHog Feature Flags | Gratuit | 1M API requests/mois |
| Vercel Edge Config | Inclus (Pro) | Near-zero latency, 256 KB storage |
| LaunchDarkly | $10/mois/seat | 1K flags, targeting avancé |
| Unleash | Gratuit (self-hosted) | Illimité |

### Alternatives

| Alternative | Différence clé | Free tier |
|-------------|---------------|-----------|
| **PostHog Feature Flags** | Intégré avec les analytics PostHog, gradual rollout, A/B testing — naturel si tu utilises déjà PostHog pour les analytics | 1M API requests/mois |
| **Vercel Edge Config** | Near-zero latency (lu depuis l'edge), parfait si déployé sur Vercel — pas de redéploiement nécessaire | Inclus dans Vercel Pro ($20/mois) |
| **LaunchDarkly** | Enterprise-grade : targeting par segment, scheduling, audit log — overkill pour solo | Aucun free tier significatif |
| **Unleash** | Open source, self-hosted, feature complet — bon si tu veux du contrôle total | Illimité (self-hosted) |

### Quand passer à autre chose

- **Besoin de gradual rollout (1% → 10% → 100%)** → PostHog Feature Flags
- **Besoin d'A/B testing intégré aux flags** → PostHog (analytics + flags)
- **Déployé sur Vercel et besoin de changement sans redéploiement** → Vercel Edge Config
- **Équipe > 1 dev, besoin d'audit trail sur les flags** → LaunchDarkly ou Unleash

---

## Stack optimale solo SaaS

La combinaison recommandée au démarrage :

```
Sentry (errors)
  + Plausible (analytics)
  + BetterStack (uptime + status page)
  + Crisp (support)
  + env vars (feature flags)
```

**Coût total** : ~9 €/mois (uniquement Plausible — le reste est gratuit).

**Variante budget zéro** : remplacer Plausible par Umami self-hosted → 0 €/mois.

**Variante tout-en-un** : PostHog remplace Plausible + feature flags → analytics produit + session replay + feature flags en un seul outil (free tier 1M events/mois).

---

## Évolution naturelle

| Trigger | Action |
|---------|--------|
| > 5K erreurs/mois sur Sentry | Corriger le bruit ou passer à Sentry Team ($26/mois) |
| Besoin de funnels / rétention | Migrer de Plausible vers PostHog |
| > 100K pageviews/mois | Évaluer Umami self-hosted ou PostHog |
| Besoin de logs centralisés | Ajouter Axiom ou BetterStack Logs |
| Monitoring < 30 sec nécessaire | Upgrade BetterStack Starter ($24/mois) |
| > 50 tickets support/semaine | Activer chatbot Crisp Pro ou migrer vers Intercom |
| Besoin de gradual rollout | Passer des env vars à PostHog Feature Flags |
| Équipe > 1 dev | Évaluer LaunchDarkly ou Unleash pour les feature flags |
| Premiers utilisateurs payants | Ajouter Crisp chat live si pas déjà fait |
| Besoin d'observabilité full-stack | Évaluer Grafana Cloud ou Datadog |

---

## Voir aussi

- **Read** [`../../architecture/background-jobs.md`](../../architecture/background-jobs.md) — patterns de jobs background avec monitoring
- **Read** [`../../architecture/webhook-patterns.md`](../../architecture/webhook-patterns.md) — résilience et health checks des webhooks
- **Read** [`../../code-conventions/logging.md`](../../code-conventions/logging.md) — conventions de structured logging
- **Read** [`notion-crm.md`](notion-crm.md) — Notion comme mini-CRM ops early-stage

---

> **A mettre a jour si > 3 mois** — Verifier : prix, limites free tier, nouveaux plans, nouvelles alternatives.
