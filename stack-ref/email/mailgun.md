---
last_updated: 2026-03-16
confidence: high
category: email
type: managed
pricing_model: [flat, per-usage]
free_tier: true
---

# Mailgun

> _Email API pour développeurs — puissant, mature, région EU disponible._

## Ce que c'est
Mailgun est une plateforme d'email API pour développeurs fondée en 2010, rachetée par Sinch en 2021. Très mature, avec des fonctionnalités avancées : email parsing, inbound routing, email validation, suppression lists. Disponible en région EU (Dublin, Ireland) pour la conformité RGPD.

## Free Tier (Trial)
| Métrique | Limite |
|---|---|
| Emails/mois | 5K (3 mois d'essai) |
| Logs | 3 jours |

> ⚠️ Après les 3 mois de trial, il faut passer à un plan payant.

## Pricing
### Foundation — $15/mois
| Métrique | Inclus | Overage |
|---|---|---|
| Emails/mois | 50K | $1/1K |
| Logs | 3 jours | — |
| Email validation | ❌ | — |

### Scale — $90/mois
| Métrique | Inclus | Overage |
|---|---|---|
| Emails/mois | 100K | $0.90/1K |
| Logs | 30 jours | — |
| IP dédiée | ✅ | — |
| Email validation | 500 validations | — |

### Custom — sur devis (> 500K emails)
### 💡 Exemples de calcul
- **30K emails/mois** → Foundation $15/mo (dans les limites)
- **80K emails/mois** → Foundation : $15 + 30 × $1 = $45/mo
- **80K emails/mois** → Scale : $90/mo (meilleur)
- **Comparaison Resend Pro** → Mailgun Foundation ($15) vs Resend Pro ($20) pour 50K : Mailgun moins cher
## ✅ Quand utiliser
- Besoin de **région EU** (Dublin) pour données conformes RGPD
- **Email parsing / inbound** avancé
- **Validation d'emails** (réduction de bounces)
- Stack non-JS (Python, Ruby, PHP — SDK Mailgun bien supporté)
## ❌ Quand ne PAS utiliser
- Stack React/Next.js (Resend est plus moderne)
- Pas de free tier permanent
- Support moins bon depuis le rachat par Sinch

## Disponibilité
| Région | Support |
|---|---|
| US | ✅ |
| EU (Dublin) | ✅ (données en EU) |
| Monde | ✅ envoi global |
| Andorre | ✅ destinataires acceptés |
## Ressources
- [Documentation](https://documentation.mailgun.com)
- [Pricing officiel](https://www.mailgun.com/pricing/)
