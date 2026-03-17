# [Service Name]

> **Template de référence** — Copier ce fichier, remplir chaque section, supprimer les commentaires.

---

```yaml
last_updated: YYYY-MM-DD
confidence: high        # high | medium | low (baisser si > 3 mois sans vérif)
category:               # database | platform | payment | email
type:                   # managed | self-hosted | edge | saas
pricing_model:          # [per-request, per-storage, flat, per-seat, usage-based, free]
free_tier: true         # true | false
open_source: false      # true | false | partial
```

---

## Qu'est-ce que c'est ?

> Description en 2-3 phrases. Stack technique sous-jacente, qui le fait, depuis quand.

---

## Services / Fonctionnalités

- **Feature A** — description courte
- **Feature B** — description courte

---

## Pricing

### Free tier
| Métrique | Limite |
|----------|--------|
| Exemple  | 10 000 req/mois |

> ⚠️ Comportement au dépassement : [ rate-limit | erreur | upgrade automatique ]

### Plans payants
| Plan | Prix | Inclus |
|------|------|--------|
| Starter | $X/mois | ... |

### Modèle de facturation
> Ex : à l'usage, flat mensuel, par siège, par stockage...

### Exemples calculés
```
Scénario A — MVP solo, 10k req/jour :
→ $X/mois

Scénario B — app en croissance, 500k req/jour :
→ $X/mois
```

---

## Limites techniques

| Métrique | Valeur |
|----------|--------|
| Req/sec max | ? |
| Latence typique | ? |
| Régions disponibles | ? |
| SLA uptime | ? |

---

## ✅ Quand utiliser

- Use case A
- Use case B

---

## ❌ Quand NE PAS utiliser

- Anti-pattern A
- Anti-pattern B

---

## Stack optimale associée

```
[Service] + [Service] → cas d'usage idéal
```

---

## Alternatives directes

| Alternative | Différence clé |
|-------------|---------------|
| [Service X] | ... |

---

## Ressources

- [Documentation officielle](https://...)
- [Pricing page](https://...)

---

> 🕐 **À mettre à jour si > 3 mois** — Vérifier : prix, limites free tier, nouveaux plans.
