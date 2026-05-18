# Pencil Frames Rule

S'applique a tout agent utilisant les outils `mcp__pencil__*` dans ce projet.

## Principe

**Tout groupe de 2+ elements qui partagent un axe d'alignement doit etre contenu dans une frame.**

Aucun composant ne doit etre insere directement sur le document/canvas. La hierarchie obligatoire est :

```
Document → Screen Frame → Section Frame(s) → Composants
```

## Regles

1. **Frame obligatoire** — des que 2+ elements doivent etre alignes entre eux (horizontalement ou verticalement), les grouper dans une frame
2. **Proprietes requises** — chaque frame doit definir au minimum : `layout` (vertical/horizontal), `gap`, `alignItems`
3. **Pas de positionnement absolu** — utiliser les proprietes de frame (`layout`, `gap`, `alignItems`, `justifyContent`) pour l'alignement, sauf exception justifiee
4. **Composant seul** — un composant unique sans besoin d'alignement relatif peut exister sans frame parent supplementaire, mais reste enfant d'une section frame

## Spacing

Les valeurs de `gap` et `padding` doivent correspondre a l'echelle de tokens de **Read** [`.conventions/index.md`](../../.conventions/index.md) → sub-domain `design-tokens` → `spacing.md` :

| Token | px |
|-------|-----|
| `2xs` | 2 |
| `xs` | 4 |
| `sm` | 8 |
| `md` | 12 |
| `base` | 16 |
| `lg` | 24 |
| `xl` | 32 |
| `2xl` | 40 |
| `3xl` | 48 |
| `4xl` | 64 |
| `5xl` | 80 |

**Jamais de valeurs arbitraires.** Si aucun token ne convient, utiliser le token immediatement superieur.

## Exemples

Correct :
```javascript
section=I(screen, {type: "frame", layout: "vertical", gap: 24, alignItems: "start", width: "fill_container"})
card1=I(section, {type: "ref", ref: "cardId", width: "fill_container"})
card2=I(section, {type: "ref", ref: "cardId", width: "fill_container"})
```

Incorrect :
```javascript
card1=I(screen, {type: "ref", ref: "cardId", x: 0, y: 0})
card2=I(screen, {type: "ref", ref: "cardId", x: 0, y: 300})
```
