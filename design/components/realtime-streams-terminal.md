# Realtime Streams - Terminal

Patterns specifiques aux interfaces terminal pour flux temps reel (ANSI cursor control, buffering CLI). Extrait de `realtime-streams.md`.

Voir [`realtime-streams.md`](realtime-streams.md) pour les etats de connexion, la reconnexion, le heartbeat et le token streaming web.

## Terminal — Patterns specifiques

- ANSI cursor control : utiliser `CR`, clear-line et repositionnement de curseur uniquement pour les zones volatiles (progress, statut, footer), jamais pour reecrire un historique de logs append-only
- Comportement `tail -f` : append-only, pas de reecriture
- Ctrl+S / Ctrl+Q : pause/resume de l'output (flow control classique)
- Buffering CLI : batcher les rafraichissements haut volume (100-200ms) pour limiter le flicker et les redraws inutiles
- Fond de rangee alterne (subtil) pour la lisibilite
- Police monospace obligatoire - respecter le token typographique
- Limite de lignes visibles sans pagination : ~10000 (au-dela, ralentissement terminal)
- Couleurs ANSI : supporter les codes de couleur standard (16 couleurs minimum)
- Wrap long lines par defaut, option no-wrap pour les logs structures

---
