---
last_updated: 2026-03-16
confidence: high
category: email
type: managed
pricing_model: [flat, per-usage]
free_tier: true
---

# SendGrid (Twilio)

> _L'historique de l'email API — marketing + transactionnel, très répandu._

## Ce que c'est
SendGrid est l'une des premières plateformes d'email API (fondée 2009, rachetée par Twilio en 2019). Très utilisée en entreprise, supporte transactionnel et marketing. Free tier permanent mais limité. Parfois critiqué pour sa délivrabilité partagée sur les gros volumes et son interface vieillissante.

## Free Tier
| Métrique | Limite |
|---|---|
| Emails/jour | 100 (permanent) |
| Emails/mois | ~3 000 |

> ✅ Free tier permanent, pas d'expiration.

## Pricing
### Essentials (transactionnel)
| Plan | Emails/mois | Prix/mois |
|---|---|---|
| 50K | 50K | $19.95 |
| 100K | 100K | $34.95 |

### Pro (marketing + transactionnel)
| Plan | Emails/mois | Prix/mois |
|---|---|---|
| 100K | 100K | $89.95 |
| 300K | 300K | $249 |

### 💡 Exemples de calcul
- **Side-project, < 3K emails/mois** → Free : $0/mo
- **SaaS, 40K emails/mois** → Essentials 50K : $19.95/mo
- **Comparaison Resend Pro** → SendGrid Essential ($19.95) vs Resend Pro ($20) : quasi identique
## ✅ Quand utiliser
- Besoin d'une solution **éprouvée et très connue** (facilité de support/intégrations)
- Stack non-TypeScript (PHP/Python/Ruby — SDK bien maintenu)
- Besoin combiné transactionnel + marketing dans une seule plateforme
- Contraintes entreprise imposant un fournisseur spécifique
## ❌ Quand ne PAS utiliser
- Stack TypeScript moderne (Resend bien meilleur DX)
- Délivrabilité critique (Postmark supérieur)
- Très gros volume pas cher (Amazon SES)
## Ressources
- [Documentation](https://docs.sendgrid.com)
- [Pricing officiel](https://sendgrid.com/en-us/pricing)
