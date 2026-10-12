# Frames Pencil

Avec les outils `mcp__pencil__*` :
- Respecte la hierarchie `Document → Screen Frame → Section Frame(s) → Composants` ; n'insere aucun composant directement sur le canvas.
- Regroupe dans une frame tout ensemble de 2 elements ou plus qui partagent un axe d'alignement. Chaque frame definit au minimum `layout` (vertical/horizontal), `gap` et `alignItems`.
- Aligne avec les proprietes de frame (`layout`, `gap`, `alignItems`, `justifyContent`) plutot qu'avec un positionnement absolu, sauf raison explicite.
- Un composant seul peut se passer de frame dediee, mais reste enfant d'une section frame.
- Prends `gap` et `padding` dans l'echelle de `~/projects/ai-ressources/design/tokens/spacing.md` : 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80 px. Sans valeur adaptee, prends le token immediatement superieur.
