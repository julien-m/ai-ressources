---
last_updated: 2026-03-16
confidence: high
category: email
type: managed
pricing_model: [per-usage]
free_tier: false
---

# Amazon SES (Simple Email Service)

> _Email ultra-cheap à gros volume — $0.10/1K emails, mais setup complexe._

## Ce que c'est

Amazon SES est le service d'envoi d'emails d'AWS. Extrêmement bon marché à gros volume. Utilisé par Netflix, Amazon lui-même, et beaucoup de grandes entreprises. Setup initial plus complexe (réputation IP à construire, configuration DKIM/SPF, sortie du sandbox nécessaire).

## Free Tier

| Condition | Limite |
|---|---|
| Si envoyé depuis une instance EC2 | 62 000 emails/mois gratuits |
| Sans EC2 | Pas de free tier |

> ✅ Si vous avez déjà une app sur EC2, les 62K premiers emails sont gratuits.

## Pricing

### Envoi d'emails

| Métrique | Tarif |
|---|---|
| Emails sortants | **$0.10 per 1 000 emails** |
| Pièces jointes | $0.12/GB |
| IP dédiée | $24.95/mois |

### 💡 Exemples de calcul

- **100K emails/mois** → $10/mo 🤯 (vs Resend Scale $90/mo)
- **1M emails/mois** → $100/mo (vs SendGrid ~$400+/mo)
- **10M emails/mois** → $1 000/mo

> 💡 À grande échelle, SES est **10-20× moins cher** que les concurrents. Économie significative dès 100K emails.

## Inconvénients / Complexité

- **Sandbox au démarrage** : limité à des adresses vérifiées, sortir du sandbox nécessite une demande AWS
- **Réputation à construire** : warming d'IP nécessaire pour éviter que les emails aillent en spam
- **Pas d'interface native de templates moderne**
- **Pas de support intégré** (contact AWS support = payant sur la plupart des plans)
- **Monitoring** : à intégrer soi-même (CloudWatch, SNS pour bounces/complaints)
- **Complexité opérationnelle** vs Resend/Brevo où tout est ready-to-use

## ✅ Quand utiliser

- Volume **> 100K emails/mois** où le coût est un critère clé
- Déjà dans l'**écosystème AWS** (EC2, Lambda)
- Équipe technique avec expertise AWS pour le setup et monitoring
- Notifications système haute fréquence (alertes, digests)

## ❌ Quand ne PAS utiliser

- Side-project ou petit volume (complexité non justifiée)
- Besoin de **délivrabilité out-of-the-box** sans warmup
- Pas d'expérience AWS (setup trop complexe)
- App non hébergée sur AWS (pas de free tier 62K)

## Disponibilité

| Région | Support |
|---|---|
| EU (Ireland, Frankfurt, Paris) | ✅ |
| US | ✅ |
| Monde | ✅ envoi global |

## Architecture recommandée avec SES

```
Lambda / EC2 → SES API → Email envoyé
SES → SNS Topic → Lambda → Traitement bounces/complaints
SES → CloudWatch → Alertes sur taux de bounce
```

## Ressources

- [Documentation SES](https://docs.aws.amazon.com/ses/)
- [Pricing SES](https://aws.amazon.com/ses/pricing/)
