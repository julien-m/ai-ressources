# Modeles musique — Guide de selection

> Tous les modeles musique sont alimentes par la technologie **Suno** et partagent un flux async commun. Prix uniforme : **20 cr/operation**.

## Tableau decisionnel

| Cas d'usage | Modele recommande | Prix | Quand l'utiliser | Quand NE PAS l'utiliser |
|---|---|---|---|---|
| Creer une musique originale from scratch | AI Music (generate-music) | 20 cr | Besoin d'un morceau original depuis une description texte, modes simple ou custom | Besoin de prolonger un morceau existant, besoin de transformer un audio existant |
| Allonger un morceau, adapter une duree a une video | Extend Music | 20 cr | Continuation coherente depuis un point precis, chainage de morceaux, boucles | Audio externe (necessite un audio_id Suno), creation from scratch |
| Remix de style, cover IA, changement de genre | Upload and Cover Audio | 20 cr | Transformer un morceau pop en jazz, adapter une musique a un nouveau contexte | Audio > 2 min, audio de mauvaise qualite, creation from scratch |

## Raccourcis decisionnels

- **Creer** → AI Music (`generate-music`)
- **Prolonger** → Extend Music (`extend-music`)
- **Transformer** → Upload and Cover Audio (`upload-and-cover-audio`)
- **Prix unique** → 20 cr pour toutes les operations

---

## AI Music (Generation)

**ID API :** `generate-music` | **Prix :** 20 cr/generation ($0.10)

**Description :** Genere de la musique originale depuis un texte. Modes simple (prompt seul) ou custom (controle total). Versions V3.5 a V5, vocal ou instrumental.

**Points forts :**
- Toutes les versions V3.5-V5
- Jusqu'a 8 min (V4.5+)
- Controle fin (style_weight, weirdness, persona_id, vocal gender)

**Points faibles :**
- Qualite variable selon version
- V5 meilleure mais pas de difference de prix specifiee

---

## Extend Music

**ID API :** `extend-music` | **Prix :** 20 cr/extension

**Description :** Prolonge une musique existante depuis n'importe quel timestamp. Mode heritage (continue le style) ou custom (nouveaux parametres).

**Points forts :**
- Continuation coherente depuis un point precis (`continue_at` en secondes)
- Jusqu'a 8 min (V4.5+)
- Chainable

**Points faibles :**
- Necessite un `audio_id` Suno existant
- Pas pour audio externe

---

## Upload and Cover Audio

**ID API :** `upload-and-cover-audio` | **Prix :** 20 cr/transformation

**Description :** Transforme un fichier audio uploade dans un style different tout en preservant la melodie. Cover IA, remix de style, changement de genre.

**Points forts :**
- Preservation de la melodie
- Controle `audio_weight` (0-1)
- Format MP3/WAV jusqu'a 2 min
- Vocal ou instrumental

**Points faibles :**
- Duree max 2 min en entree
- Resultat depend de la qualite de l'audio source

---

> **Note :** Les donnees source incluent 15 modeles musique au total. Les 12 modeles restants n'etaient pas inclus dans les donnees transmises. Ce fichier sera complete lorsque les donnees seront disponibles.
