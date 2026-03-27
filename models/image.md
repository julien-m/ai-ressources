# Modeles image — Guide de selection

## Tableau decisionnel

| Cas d'usage | Modele recommande | Prix min | Quand l'utiliser | Quand NE PAS l'utiliser |
|---|---|---|---|---|
| Prototypage ultra-rapide, maquettes UI, banners | Z-Image | 2 cr | Generation < 1 seconde, texte bilingue EN/ZH, budget minimal | Besoin d'edition, multi-reference, resolution 4K, langues hors EN/ZH |
| Prototypage rapide, assets marketing simples | GPT Image 1.5 | 2 cr | Rendu texte dense, edition chirurgicale, coherence de marque, 4x plus rapide que v1 | Besoin de multi-reference (1 seule image max), resolution 4K non specifiee |
| Generation en masse, e-commerce, affiches multilingues | Nano Banana 2 | 5 cr | 2K par defaut, 4K dispo, jusqu'a 14 images de reference, ratios extremes, recherche Google | Besoin de raisonnement avance (preferer Pro), generation 4K urgente (plus lent) |
| Contenu tendance temps reel, infographies, assets de marque | Seedream 5.0 Lite | 5 cr | Recherche web integree, resolution 3K, 14 images de reference, instructions complexes | Photo commerciale pure (preferer Seedream 4.5), besoin de 4K |
| Photo commerciale, fashion, pub print, grand format | Seedream 4.5 | 5 cr | Resolution native 4K, eclairage cinematique, rendu texte pro, qualite photo commerciale | Contenu temps reel (pas de recherche web), budget tres serre |
| Assets commerciaux premium, identite visuelle, storyboard coherent | Nano Banana Pro | 8 cr | Raisonnement Gemini 3 Pro, coherence jusqu'a 5 personnes/14 refs, 4K | Generation 4K urgente (~10 min), budget serre, besoin de recherche web |
| Production marketing, visualisation produit, design UI/UX | FLUX.2 Pro | 6 cr | Multi-reference jusqu'a 10 images, correspondance couleurs hex, typographie complexe, < 10s | Budget serre pour precision max (Flex = 3x Pro) |
| Coherence visuelle maximale, controle couleur exact | FLUX.2 Flex | 18 cr | 10 images de reference, correspondance hex exacte, precision maximale | Budget serre, pas besoin de coherence extreme (preferer Pro) |
| Edition precise, retouche ciblee | GPT Image 1.5 Edit | 2 cr | Ajout/suppression d'objets, changement de style, retouche chirurgicale | Multi-reference, besoin de 4K |
| Generation contextuelle via LLM multimodal | GPT-4o Image | 4 cr | Haute comprehension contextuelle, integration dans un workflow GPT-4o | Besoin de controle precis de resolution ou de multi-reference |
| Contenu creatif, modes fun/spicy | Grok Imagine (image) | 6 cr | 3 modes creatifs via moteur Aurora d'xAI | Production commerciale serieuse, besoin de haute resolution |

## Raccourcis decisionnels

- **Le moins cher** → Z-Image ou GPT Image 1.5 (2 cr)
- **Le plus rapide** → Z-Image (< 1 seconde)
- **Le plus polyvalent** → Nano Banana 2 (2K-4K, 14 refs, recherche web, ratios extremes)
- **La meilleure qualite** → Seedream 4.5 en 4K ou Nano Banana Pro (raisonnement avance)
- **La meilleure edition** → GPT Image 1.5 Edit (chirurgicale) ou FLUX.2 Flex Edit (haute precision)
- **La meilleure coherence multi-images** → FLUX.2 Flex (10 refs + hex) ou Nano Banana Pro (14 refs + 5 personnes)
- **Contenu avec tendances actuelles** → Seedream 5.0 Lite (recherche web integree)

## Par besoin produit

**Logo brainstorm / MVP**
→ GPT Image 1.5 (2 cr) — rendu texte precis, coherence de marque, rapide pour iterer plusieurs pistes
→ Z-Image (2 cr) — si besoin d'un logo en < 1s pour un draft jetable, texte bilingue EN/ZH

**Logo identite visuelle finale**
→ Seedream 4.5 en 4K (6 cr) — eclairage cinematique, qualite print, resolution native 4096x4096
→ Nano Banana Pro (8 cr) — raisonnement avance pour des variations coherentes, 14 refs pour decliner sur plusieurs supports

**Maquettes UI / wireframes d'app (style shadcn, couleur specifique)**
→ FLUX.2 Flex (18 cr) — correspondance couleur hex exacte, multi-reference pour garder la coherence entre ecrans
→ GPT Image 1.5 (2 cr) — edition chirurgicale pour ajuster un ecran existant (changer une couleur, ajouter un composant)
→ Nano Banana 2 (5 cr) — ratios extremes (1:8, 8:1) utiles pour les vues mobiles ou les sidebars

**Visuel hero de landing page**
→ Seedream 4.5 (5 cr) — photo commerciale, eclairage pro, qualite affichage grand format
→ Seedream 5.0 Lite (5 cr) — si le visuel doit refleter une tendance actuelle (recherche web integree)
→ Runway-quality via Nano Banana Pro (8 cr) — coherence multi-images pour une landing avec plusieurs sections

**Icones professionnelles / set d'icones coherent**
→ FLUX.2 Flex (18 cr) — coherence couleur hex exacte entre icones, multi-ref pour garder le style uniforme
→ FLUX.2 Pro (6 cr) — meme moteur en moins precis, suffisant si le set est simple
→ GPT Image 1.5 (2 cr) — bon rendu typographique si les icones contiennent du texte

**Screenshots marketing / assets stores**
→ Nano Banana 2 (5 cr) — generation en masse, 14 refs pour coherence de style entre screenshots
→ GPT Image 1.5 Edit (2 cr) — retouche ciblee sur des screenshots existants (ajouter un badge, changer un texte)

**Illustrations blog / article**
→ Seedream 5.0 Lite (5 cr) — recherche web pour coller aux tendances visuelles, instructions complexes
→ GPT-4o Image (4 cr) — comprehension contextuelle forte, bon pour illustrer un concept abstrait

**Banniere social media (OG, Twitter, LinkedIn)**
→ Z-Image (2 cr) — ultra-rapide, 5 ratios d'aspect, ideal pour du batch
→ Nano Banana 2 (5 cr) — ratios extremes disponibles, meilleure qualite si necessaire

**Avatar / photo de profil**
→ GPT Image 1.5 (2 cr) — edition precise pour customiser un avatar existant
→ Grok Imagine (6 cr) — modes creatifs Fun/Spicy pour des avatars stylises

**Infographie / schema explicatif**
→ Seedream 5.0 Lite (5 cr) — suivi d'instructions complexes, recherche web pour donnees actuelles
→ Nano Banana 2 (5 cr) — rendu texte multilingue precis, utile pour les labels et annotations

**Mockup produit (app dans un device frame)**
→ Nano Banana 2 (5 cr) — 14 refs pour injecter le screenshot reel dans un device frame coherent
→ Seedream 4.5 (5 cr) — eclairage realiste pour un rendu photo-produit

**Background / pattern / texture pour UI**
→ Z-Image (2 cr) — ultra-rapide et economique pour generer des variations
→ FLUX.2 Pro (6 cr) — correspondance hex si la texture doit matcher la palette exacte

**Edition / retouche d'image existante**
→ GPT Image 1.5 Edit (2 cr) — chirurgicale, modifie uniquement ce qu'on demande
→ FLUX.2 Flex Edit (27 cr) — haute precision avec multi-reference pour editer en gardant la coherence d'un set
→ Seedream 4.5 Edit (5 cr) — guidance naturelle + visuelle, jusqu'a 10 refs en edition

**Storyboard / planche de reference (coherence multi-images)**
→ Nano Banana Pro (8 cr) — coherence jusqu'a 5 personnes sur 14 images de reference
→ FLUX.2 Flex (18 cr) — 10 refs + hex pour un controle maximal du style entre planches

---

## Nano Banana 2

**Fournisseur :** Google (Gemini 3.1 Flash) | **ID API :** `nano-banana-2-new` ou `nano-banana-2-new-edit`

**Description :** Modele Google Gemini 3.1 Flash pour la generation d'images. Resolution native 2K (defaut) ou 4K. Raisonnement en chaine de pensee, rendu texte multilingue precis, jusqu'a 14 images de reference.

**Points forts :**
- 2K par defaut (vs 1K pour Nano Banana Pro)
- 4K au meme prix
- Ratios extremes (1:8, 8:1)
- Jusqu'a 14 images de reference
- -69% vs fal.ai
- Recherche Google integree

**Points faibles :**
- Moins de raisonnement que Pro (Flash vs Pro)
- Generation 4K plus lente

**Tarifs :** 5 cr (1K) · 8 cr (2K) · 12 cr (4K)

**Variantes :**
- `nano-banana-2-new` — texte vers image, jusqu'a 14 images de reference, resolutions 1K/2K/4K
- `nano-banana-2-new-edit` — edition d'image : modification localisee, transfert de style, remplacement d'arriere-plan

---

## Nano Banana Pro

**Fournisseur :** Google (Gemini 3 Pro) | **ID API :** `nano-banana-2` ou `nano-banana-2-edit`

**Description :** Gemini 3 Pro Preview pour la generation d'images. Raisonnement avance, 4K, workflow 5 etapes (Plan → Generate → Review → Refine → Iterate), coherence multi-images.

**Points forts :**
- Raisonnement Gemini 3 Pro
- 4K
- Coherence jusqu'a 5 personnes sur 14 images de reference
- Rendu texte fort
- -73% vs fal.ai

**Points faibles :**
- Generation 4K ~10 minutes
- Plus cher que Nano Banana 2
- Pas de recherche web temps reel

**Tarifs :** 8 cr (toutes resolutions 1K/2K/4K)

**Variantes :**
- `nano-banana-2` — texte vers image (attention : meme ID que Nano Banana 2 de generation precedente)
- `nano-banana-2-edit` — edition : angles de camera, focus, color grading, variations

---

## Seedream 5.0 Lite

**Fournisseur :** Seedream (ByteDance) | **ID API :** `seedream-5.0-lite` ou `seedream-5.0-lite-edit`

**Description :** Premier modele ByteDance avec recherche web integree. Connaissance du monde elargie, suivi d'instructions complexes, coherence forte. Resolution native 2K/3K.

**Points forts :**
- Recherche web integree (genere avec les dernieres tendances)
- Resolution 3K
- Jusqu'a 14 images de reference
- -29% vs fal.ai

**Points faibles :**
- Resolution max 3K (vs 4K pour Seedream 4.5)
- Legerement moins precis pour la photo commerciale pure

**Tarifs :** 5 cr (2K ou 3K, meme prix)

**Variantes :**
- `seedream-5.0-lite` — texte vers image, recherche web optionnelle, 2K ou 3K
- `seedream-5.0-lite-edit` — edition localisee, transfert de style, modifications multi-rounds

---

## Seedream 4.5

**Fournisseur :** Seedream (ByteDance) | **ID API :** `seedream-4.5` ou `seedream-4.5-edit`

**Description :** Generation 4K ultra avec qualite photo commerciale, logique d'eclairage avancee, rendu texte precis. Standard de photographie professionnelle.

**Points forts :**
- Resolution native 4K (4096x4096)
- Eclairage cinematique
- Rendu texte professionnel
- Coherence matiere/sujet
- -38% vs fal.ai

**Points faibles :**
- Pas de recherche web (donnees statiques)
- Legerement plus cher que Seedream 5.0 Lite
- Moins adapte aux contenus temps reel

**Tarifs :** 5 cr (2K) · 6 cr (4K)

**Variantes :**
- `seedream-4.5` — texte vers image, 2K ou 4K
- `seedream-4.5-edit` — edition avec guidance naturelle + visuelle, jusqu'a 14 images de reference (T2I) ou 10 (edition)

---

## GPT Image 1.5

**Fournisseur :** OpenAI | **ID API :** `gpt-image-1.5` ou `gpt-image-1.5-edit`

**Description :** Modele OpenAI 4x plus rapide que GPT Image 1. Edition de precision, rendu texte superieur, coherence de marque.

**Points forts :**
- 4x plus rapide que v1
- Edition chirurgicale (modifie seulement ce qu'on demande)
- Excellent rendu texte dense
- Coherence de marque
- -23% vs officiel

**Points faibles :**
- 1 seule image de reference (vs 14 pour Gemini)
- Pas de resolution 4K native specifiee

**Tarifs :** 2 cr/generation ($0.01)

**Variantes :**
- `gpt-image-1.5` — texte vers image
- `gpt-image-1.5-edit` — edition precise : ajout/suppression d'objets, changement de style, retouche ciblee

---

## FLUX.2

**Fournisseur :** Black Forest Labs | **ID API :** `flux-2-pro` / `flux-2-pro-edit` / `flux-2-flex` / `flux-2-flex-edit`

**Description :** IA de production de Black Forest Labs : resolution 4MP, controle multi-reference jusqu'a 10 images, correspondance exacte des couleurs par code hex, typographie complexe, < 10s de generation.

**Points forts :**
- Jusqu'a 10 images de reference (coherence maximale)
- Correspondance couleurs par hex
- Typographie complexe
- 4MP
- < 10s

**Points faibles :**
- Pas encore de reduction officielle vs fal.ai publiee
- Flex (precision max) coute 3x plus que Pro

**Tarifs :** Pro : 6 cr (1K) · 9 cr (2K) | Flex : 18 cr (1K) · 27 cr (2K)

**Variantes :**
- `flux-2-pro` — texte vers image, rapide, production courante
- `flux-2-pro-edit` — edition d'image avec le modele Pro
- `flux-2-flex` — precision maximale, multi-reference 10 images, controle hex couleur
- `flux-2-flex-edit` — edition haute precision avec le modele Flex

---

## Z-Image

**Fournisseur :** Wan (Alibaba) | **ID API :** `z-image`

**Description :** Modele ultra-rapide 6B parametres (S3-DiT), generation < 1 seconde. Rendu texte bilingue EN/ZH. Open-source Apache 2.0. Classe #1 open-source sur benchmarks.

**Points forts :**
- < 1 seconde de generation
- Excellent texte bilingue EN/ZH
- 5 ratios d'aspect
- Tres economique
- Licence commerciale Apache 2.0

**Points faibles :**
- Pas d'edition d'image
- Pas de reference multi-image
- Resolution standard (pas de 4K)
- Uniquement texte vers image

**Tarifs :** 2 cr/generation ($0.01)

**Variantes :**
- `z-image` — texte vers image uniquement (pas de variante edition)

---

## GPT-4o Image

**Fournisseur :** OpenAI | **ID API :** `gpt-4o-image`

**Description :** Generation d'images via le modele GPT-4o multimodal. Haute comprehension contextuelle.

**Tarifs :** 4 cr/generation ($0.02, -80% vs officiel)

> Donnees partielles — page complete non chargee.

---

## Grok Imagine (image)

**Fournisseur :** xAI | **ID API :** `grok-imagine-image`

**Description :** Generation d'images et edition/variations via le moteur Aurora d'xAI. 3 modes creatifs.

**Tarifs :** 6 cr/image
