---
last_updated: 2026-03-16
confidence: high
category: database
type: self-hosted
pricing_model: [free]
free_tier: true
---

# SQLite

> _La base de données la plus déployée au monde — embarquée, zero-config, fichier unique._

## Ce que c'est
SQLite est une bibliothèque C intégrée directement dans l'application. Pas de serveur, pas de daemon, pas de réseau : la base est un simple fichier `.db`. Domaine public, utilisé dans iOS, Android, Firefox, Chrome, et pratiquement tout device embarqué.

## Free Tier
Totalement gratuit, sans restriction. Licence domaine public.

## Pricing
**$0 pour toujours.** Pas de plans, pas de cloud, pas de compte.

## Performances
| Métrique | Valeur |
|---|---|
| Lecture | Extrêmement rapide (mémoire locale) |
| Écriture | Rapide mais sérialisée (WAL mode) |
| Concurrence écriture | 1 writer à la fois (verrou fichier) |
| Taille max DB | 281 TB théorique |
| Latence | < 1ms (local) |
## ✅ Quand utiliser
- App desktop, mobile, CLI, embarqué
- Prototype ou side-project single-server
- Cache local ou stockage de config
- Tests unitaires (DB en mémoire `:memory:`)
- Multi-tenant par fichier (1 fichier = 1 tenant) — pattern Turso
- Backend API simple avec trafic modéré (< 100 req/s writes)
## ❌ Quand ne PAS utiliser
- Multi-writers concurrents sur plusieurs processus/machines
- Besoin de réplication ou haute disponibilité
- Trafic writes très élevé (> 1K writes/s)
- Requêtes analytiques lourdes sur gros volumes
- Équipe distribuée / multi-datacenter
## Combinaisons stack optimales
- **App locale / CLI** → `SQLite + better-sqlite3 (Bun natif)`
- **Edge multi-tenant** → migrer vers `Turso (libSQL basé sur SQLite)`
- **Cloudflare Workers** → `Cloudflare D1 (SQLite dans Workers)`
- **Tests** → `SQLite :memory: + bun test`
## Alternatives directes
| Alternative | Différence clé |
|---|---|
| Turso | SQLite managé + edge + réplication multi-région |
| Cloudflare D1 | SQLite dans Workers, serverless natif |
| Neon | PostgreSQL serverless, plus de features SQL |
| PostgreSQL | Plus de features, multi-writer, production scale |
## Ressources
- [Documentation officielle](https://sqlite.org/docs.html)
- [WAL mode (performances writes)](https://sqlite.org/wal.html)
- [better-sqlite3 (Node.js sync)](https://github.com/WiseLibs/better-sqlite3)
