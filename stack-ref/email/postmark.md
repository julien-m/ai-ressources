---
last_updated: 2026-03-16
confidence: high
category: email
type: managed
pricing_model: [flat, per-usage]
free_tier: true
---

# Postmark

> _La référence absolue de la délivrabilité transactionnelle — ultra-fiable, mais pas le moins cher._

## Ce que c'est
Postmark (fondé 2009, racheté par ActiveCampaign) est la plateforme de choix pour les emails transactionnels critiques nécessitant une délivrabilité maximale. Connu pour ses IPs "clean" soigneusement maintenues, son engagement temps réel, et ses logs détaillés. Utilisation : emails de bienvenue, confirmations de commande, alertes système.

## Produits / Features clés
- **Transactionnel** — API et SMTP haute délivrabilité
- **Bulk (broadcast)** — Newsletters et campagnes (streams séparés)
- **Message Streams** — Isolation des IPs par type d'email (transac vs marketing)
- **DMARC Monitoring** — Surveillance de la réputation domaine
- **Logs 45 jours** — Historique d'envoi détaillé

## Free Tier
| Métrique | Limite |
|---|---|
| Emails d'essai | 100 emails (à vie, test seulement) |
| Trial accounts | 100 emails gratuits sans carte |

> ⚠️ Postmark n'a pas de vrai free tier continu — seulement 100 emails pour tester.

## Pricing
### Transactionnel (pay-as-you-go)
| Volume mensuel | Prix/1K emails |
|---|---|
| 0 – 1K | $1.50 |
| 1K – 5K | $1.35 |
| 5K – 10K | $1.20 |
| 10K – 25K | $1.10 |
| 25K – 100K | $0.95 |
| > 100K | $0.80 |

**Minimum $10/mois** (même si moins de 10K emails)

### Plans fixes (prepack)
| Emails/mois | Prix/mois |
|---|---|
| 10K | $10 |
| 25K | $25 |
| 50K | $50 |
| 100K | $95 |
| 250K | $199 |
| 500K | $349 |

### 💡 Exemples de calcul
- **1K emails/mois** → $10/mo (minimum)
- **10K emails/mois** → $10/mo (plan fixe 10K)
- **50K emails/mois** → $50/mo
- **Comparaison Resend** → Resend Scale ($90/mo) pour 100K vs Postmark ($95/mo) : comparable

## Performances
| Métrique | Valeur |
|---|---|
| Délivrabilité | ✅✅✅ meilleure du marché |
| Temps de livraison | < 5 secondes (99% des cas) |
| Uptime | 99.99% |
| Logs de livraison | 45 jours |
| Engagement tracking | Ouvertures + clics |
## ✅ Quand utiliser
- Emails **critiques pour le business** (confirmations, alertes, factures)
- Délivrabilité maximale requise (finance, légal, médical)
- Besoin de logs détaillés et de traçabilité longue durée
- Entreprise avec réputation domaine à protéger
- DMARC monitoring et gestion réputation
## ❌ Quand ne PAS utiliser
- Side-project ou petit volume (minimum $10/mo pour 100 emails coûte cher)
- Emails marketing à grosse liste (Postmark separe transac/bulk mais pas spécialisé marketing)
- Budget limité (Resend ou Brevo moins chers pour les petits volumes)
- Stack TypeScript-first où le DX Resend est supérieur

## Disponibilité
- API accessible partout dans le monde
- Serveurs US (avec régions EU disponibles pour données)
- Pas de restriction géographique
## Ressources
- [Documentation](https://postmarkapp.com/developer)
- [Pricing officiel](https://postmarkapp.com/pricing)
