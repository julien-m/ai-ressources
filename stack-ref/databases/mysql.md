---
last_updated: 2026-03-16
confidence: high
category: database
type: self-hosted
pricing_model: [free]
free_tier: true
---

# MySQL (self-hosted)

> _Le SGBD open-source le plus déployé au monde — MySQL / MariaDB._

## Ce que c'est
MySQL est un SGBD relationnel open-source (GPL), propriété d'Oracle depuis 2010. **MariaDB** est le fork communautaire (100% compatible MySQL, plus actif). Très populaire dans l'écosystème PHP (WordPress, Laravel, Symfony), et historiquement chez Facebook, Twitter, YouTube (avant Vitess). Syntaxe SQL standard avec quelques particularités (pas de WITH RECURSIVE sur vieilles versions, etc.).

## Free Tier
**Gratuit** à héberger soi-même (GPL). MariaDB est également gratuit.

## Pricing (self-hosted estimé)
Identique à PostgreSQL, voir ci-dessus. Coût = hébergement.

## Performances
| Métrique | Valeur |
|---|---|
| Throughput | Comparable à Postgres pour workloads OLTP standard |
| Latence | < 1ms local |
| Réplication | Master-replica natif |
## ✅ Quand utiliser
- Stack PHP / Laravel / WordPress existante
- Migration d'un projet MySQL legacy vers le cloud
- PlanetScale (si besoin de scale MySQL managé)
## ❌ Quand ne PAS utiliser
- Nouveaux projets : **préférer PostgreSQL** (plus de features, extensions, JSON natif)
- Besoin de pgvector / PostGIS / etc.
## Ressources
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MariaDB Documentation](https://mariadb.com/kb/en/)
