# Modeles image — Guide de selection

## Tableau decisionnel

| Cas d'usage | Modele recommande | Prix min | Quand l'utiliser | Quand NE PAS l'utiliser |
|---|---|---|---|---|
| Prototypage ultra-rapide, bannieres social media, backgrounds/textures | Z-Image | 2 cr | Generation < 1 seconde, texte bilingue EN/ZH, budget minimal, prompt enhancement integre, GPU leger (< 16GB VRAM) | Besoin d'edition, multi-reference, resolution 4K, langues hors EN/ZH |
| Edition chirurgicale, catalogues produit, logos, maquettes UI | GPT Image 1.5 | 2 cr | Rendu texte dense, edition chirurgicale, coherence de marque, 4x plus rapide que v1, instruction following precis | Besoin de multi-reference (1 seule image max), resolution 4K non specifiee |
| Generation en masse, e-commerce, affiches multilingues, immobilier/staging | Nano Banana 2 | 5 cr | 2K par defaut, 4K dispo, jusqu'a 14 images de reference, ratios extremes, recherche Google, raisonnement chaine de pensee, CJK support | Besoin de raisonnement avance (preferer Pro), generation 4K urgente (plus lent) |
| Contenu tendance temps reel, infographies, storytelling coherent | Seedream 5.0 Lite | 5 cr | Recherche web integree, resolution 3K, 14 images de reference, instructions complexes, edition localisee, preservation de coherence inter-images | Photo commerciale pure (preferer Seedream 4.5), besoin de 4K |
| Photo commerciale, fashion, pub print, grand format, production cinematique | Seedream 4.5 | 5 cr | Resolution native 4K, eclairage cinematique, rendu texte pro, qualite photo commerciale, raisonnement de composition avance, generation batch | Contenu temps reel (pas de recherche web), budget tres serre |
| Assets commerciaux premium, identite visuelle, storyboard coherent, fashion | Nano Banana Pro | 8 cr | Raisonnement Gemini 3 Pro, coherence jusqu'a 5 personnes/14 refs, 4K, workflow 5 etapes (Plan-Generate-Review-Refine-Iterate) | Generation 4K urgente (~10 min), budget serre, besoin de recherche web |
| Production marketing, visualisation produit, design UI/UX, coherence couleur | FLUX.2 Pro | 6 cr | Multi-reference jusqu'a 10 images, correspondance couleurs hex, typographie complexe, < 10s, tout ratio d'aspect | Budget serre pour precision max (Flex = 3x Pro) |
| Coherence visuelle maximale, controle couleur exact, sets d'icones | FLUX.2 Flex | 18 cr | 10 images de reference, correspondance hex exacte, precision maximale | Budget serre, pas besoin de coherence extreme (preferer Pro) |
| Edition precise, retouche ciblee | GPT Image 1.5 Edit | 2 cr | Ajout/suppression d'objets, changement de style, retouche chirurgicale, preservation d'identite | Multi-reference, besoin de 4K |
| Generation contextuelle via LLM multimodal, raffinement conversationnel | GPT-4o Image | 4 cr | Haute comprehension contextuelle, 4K (4096x4096), rendu texte pixel-perfect, edition via masque PNG, raffinement iteratif en dialogue | Besoin de controle precis multi-reference ou budget serre |
| Contenu creatif, modes fun/spicy, videos courtes depuis image | Grok Imagine | 6 cr | 3 modes creatifs via moteur Aurora d'xAI, transformation image-vers-video 6s avec audio synchronise | Production commerciale serieuse, besoin de haute resolution, besoin de controle fin |

## Raccourcis decisionnels

- **Le moins cher** → Z-Image ou GPT Image 1.5 (2 cr)
- **Le plus rapide** → Z-Image (< 1 seconde)
- **Le plus polyvalent** → Nano Banana 2 (2K-4K, 14 refs, recherche web, ratios extremes, CJK)
- **La meilleure qualite** → Seedream 4.5 en 4K ou Nano Banana Pro (raisonnement avance, workflow 5 etapes)
- **La meilleure edition** → GPT Image 1.5 Edit (chirurgicale) ou FLUX.2 Flex Edit (haute precision)
- **La meilleure coherence multi-images** → FLUX.2 Flex (10 refs + hex) ou Nano Banana Pro (14 refs + 5 personnes)
- **Contenu avec tendances actuelles** → Seedream 5.0 Lite (recherche web integree)
- **Le meilleur suivi d'instructions** → GPT Image 1.5 (instruction following precis) ou Seedream 5.0 Lite (comprehension semantique profonde)
- **Le meilleur pour le self-hosting** → Z-Image (6B params, < 16GB VRAM, Apache 2.0)
- **Le plus conversationnel** → GPT-4o Image (raffinement iteratif via dialogue, contexte 128K)

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
→ GPT-4o Image (4 cr) — raffinement conversationnel pour iterer sur un mockup via dialogue naturel

**Visuel hero de landing page**
→ Seedream 4.5 (5 cr) — photo commerciale, eclairage pro, qualite affichage grand format
→ Seedream 5.0 Lite (5 cr) — si le visuel doit refleter une tendance actuelle (recherche web integree)
→ Nano Banana Pro (8 cr) — coherence multi-images pour une landing avec plusieurs sections

**Icones professionnelles / set d'icones coherent**
→ FLUX.2 Flex (18 cr) — coherence couleur hex exacte entre icones, multi-ref pour garder le style uniforme
→ FLUX.2 Pro (6 cr) — meme moteur en moins precis, suffisant si le set est simple
→ GPT Image 1.5 (2 cr) — bon rendu typographique si les icones contiennent du texte

**Screenshots marketing / assets stores**
→ Nano Banana 2 (5 cr) — generation en masse, 14 refs pour coherence de style entre screenshots
→ GPT Image 1.5 Edit (2 cr) — retouche ciblee sur des screenshots existants (ajouter un badge, changer un texte)

**Illustrations blog / article**
→ Seedream 5.0 Lite (5 cr) — recherche web pour coller aux tendances visuelles, instructions complexes
→ GPT-4o Image (4 cr) — comprehension contextuelle forte, bon pour illustrer un concept abstrait, raffinement par dialogue

**Banniere social media (OG, Twitter, LinkedIn)**
→ Z-Image (2 cr) — ultra-rapide, 5 ratios (1:1, 4:3, 3:4, 16:9, 9:16), ideal pour du batch
→ Nano Banana 2 (5 cr) — ratios extremes disponibles, meilleure qualite si necessaire

**Avatar / photo de profil**
→ GPT Image 1.5 (2 cr) — edition precise pour customiser un avatar existant
→ Grok Imagine (6 cr) — modes creatifs Fun/Spicy pour des avatars stylises

**Infographie / schema explicatif**
→ Seedream 5.0 Lite (5 cr) — suivi d'instructions complexes, recherche web pour donnees actuelles
→ Nano Banana 2 (5 cr) — rendu texte multilingue precis (CJK inclus), utile pour les labels et annotations
→ GPT-4o Image (4 cr) — contexte 128K, placement precis de 10-20 objets dans une scene

**Mockup produit (app dans un device frame)**
→ Nano Banana 2 (5 cr) — 14 refs pour injecter le screenshot reel dans un device frame coherent
→ Seedream 4.5 (5 cr) — eclairage realiste pour un rendu photo-produit

**Background / pattern / texture pour UI**
→ Z-Image (2 cr) — ultra-rapide et economique pour generer des variations, prompt enhancement integre
→ FLUX.2 Pro (6 cr) — correspondance hex si la texture doit matcher la palette exacte

**Edition / retouche d'image existante**
→ GPT Image 1.5 Edit (2 cr) — chirurgicale, modifie uniquement ce qu'on demande, preserve identite
→ FLUX.2 Flex Edit (27 cr) — haute precision avec multi-reference pour editer en gardant la coherence d'un set
→ Seedream 4.5 Edit (5 cr) — guidance naturelle + visuelle, jusqu'a 10 refs en edition

**Storyboard / planche de reference (coherence multi-images)**
→ Nano Banana Pro (8 cr) — coherence jusqu'a 5 personnes sur 14 images de reference, workflow 5 etapes
→ FLUX.2 Flex (18 cr) — 10 refs + hex pour un controle maximal du style entre planches
→ Seedream 5.0 Lite (5 cr) — preservation de coherence inter-images, edition localisee par region

**E-commerce : photos produit, lifestyle, catalogue**
→ Nano Banana 2 (5 cr) — 4K, 14 refs, generation en masse, raisonnement spatial pour mise en scene
→ Seedream 4.5 (5 cr) — eclairage commercial, qualite print, composition avancee
→ GPT Image 1.5 (2 cr) — catalogues avec variantes depuis une image source, coherence de marque

**Immobilier : staging virtuel, amenagement interieur**
→ Nano Banana 2 (5 cr) — raisonnement spatial pour perspectives et eclairages realistes
→ Nano Banana Pro (8 cr) — raisonnement avance pour compositions complexes multi-meubles
→ Seedream 4.5 (5 cr) — eclairage cinematique pour des rendus photo-realistes

**Fashion : lookbooks, collections, essayage virtuel**
→ Nano Banana Pro (8 cr) — coherence personnage, textures tissu realistes, 4K
→ Nano Banana 2 (5 cr) — generation en masse de variations, lifestyle shots
→ Seedream 4.5 (5 cr) — eclairage mode, proportions naturelles, qualite editoriale

**Production cinematique / visuels haut de gamme**
→ Seedream 4.5 (5 cr) — color grading cinematique, eclairage avance, composition professionnelle
→ Nano Banana Pro (8 cr) — coherence multi-personnages sur storyboards longs
→ GPT-4o Image (4 cr) — generation photorealiste, textures naturelles, ombres realistes

**Contenu viral / memes / social fun**
→ Grok Imagine (6 cr) — mode Fun/Spicy pour contenu decale, transformation image-vers-video 6s avec audio
→ Z-Image (2 cr) — ultra-rapide pour iterer sur des visuels jetables

---

## Z-Image

**Fournisseur :** Wan (Alibaba Tongyi-MAI) | **ID API :** `z-image`

**Description :** Modele ultra-rapide 6B parametres (architecture S3-DiT), generation < 1 seconde. Rendu texte bilingue EN/ZH. Open-source Apache 2.0. #1 open-source sur benchmarks (CVTG-2K, GenEval, DPG-Bench). Tourne sur GPU consommateur < 16GB VRAM.

**Points forts :**
- < 1 seconde de generation
- Excellent texte bilingue EN/ZH
- 5 ratios d'aspect (1:1, 4:3, 3:4, 16:9, 9:16)
- Tres economique (2 cr)
- Licence commerciale Apache 2.0
- Prompt enhancement integre (interpretation intelligente d'instructions complexes)
- Architecture legere : tourne sur GPU < 16GB VRAM
- #1 open-source, 4e mondial (CVTG-2K, GenEval, DPG-Bench)

**Points faibles :**
- Pas d'edition d'image
- Pas de reference multi-image
- Resolution standard (pas de 4K)
- Uniquement texte vers image
- Langues limitees (EN/ZH uniquement)

**Use cases :**
- Social media content (Instagram, Twitter, TikTok) — visuels accrocheurs en secondes
- Marketing banners — bannieres publicitaires avec overlays texte et elements de marque
- Product mockups — prototypage rapide de visuels produit et packaging
- Typography & posters — posters et flyers avec rendu texte multilingue
- E-commerce visuals — photos produit et visuels catalogue a grande echelle
- Rapid prototyping — iterations rapides sur concepts visuels
- Backgrounds / textures — generation economique de variations

**Tarifs :** 2 cr/generation ($0.01)

**Variantes :**
- `z-image` — texte vers image uniquement (pas de variante edition)

---

## Nano Banana 2

**Fournisseur :** Google (Gemini 3.1 Flash) | **ID API :** `nano-banana-2-new` ou `nano-banana-2-new-edit`

**Description :** Modele Google Gemini 3.1 Flash pour la generation d'images. Resolution native 2K (defaut) ou 4K. Raisonnement en chaine de pensee pour compositions complexes, rendu texte multilingue precis (CJK inclus), jusqu'a 14 images de reference.

**Points forts :**
- 2K par defaut (vs 1K pour Nano Banana Pro)
- 4K au meme prix
- Ratios extremes (1:8, 8:1) + standards
- Jusqu'a 14 images de reference
- -69% vs fal.ai
- Recherche Google integree
- Raisonnement chaine de pensee (relations spatiales, perspective, eclairage)
- Rendu texte CJK (chinois, japonais, coreen) + latin

**Points faibles :**
- Moins de raisonnement que Pro (Flash vs Pro)
- Generation 4K plus lente

**Use cases :**
- E-commerce product photography — photos produit haute resolution, lifestyle shots, essayage virtuel
- Marketing & social media — contenu de marque, creatives publicitaires, materiels promotionnels a grande echelle
- Interior design & real estate — staging virtuel, placement de meubles, variations de decor
- Content creation & storyboarding — visualisation de scenes, personnages, coherence sur 14 refs
- Fashion & apparel design — tests de vetements, lookbooks, collections saisonnieres, textures tissu 4K
- Education & publishing — illustrations, diagrammes, visuels educatifs avec texte multilingue precis

**Tarifs :** 5 cr (1K) · 8 cr (2K) · 12 cr (4K)

**Variantes :**
- `nano-banana-2-new` — texte vers image, jusqu'a 14 images de reference, resolutions 1K/2K/4K
- `nano-banana-2-new-edit` — edition d'image : modification localisee, transfert de style, remplacement d'arriere-plan

---

## Nano Banana Pro

**Fournisseur :** Google (Gemini 3 Pro) | **ID API :** `nano-banana-2` ou `nano-banana-2-edit`

**Description :** Gemini 3 Pro Preview pour la generation d'images. Raisonnement avance, 4K, workflow 5 etapes (Plan → Generate → Review → Refine → Iterate), coherence multi-images, auto-correction de generation.

**Points forts :**
- Raisonnement Gemini 3 Pro
- 4K
- Coherence jusqu'a 5 personnes sur 14 images de reference
- Rendu texte fort (multilingue)
- -73% vs fal.ai
- Workflow 5 etapes auto-correctif
- Coherence personnage (AI influenceurs, mascottes)

**Points faibles :**
- Generation 4K ~10 minutes
- Plus cher que Nano Banana 2
- Pas de recherche web temps reel

**Use cases :**
- E-commerce product photography — lifestyle photos, vues 360°, essayage virtuel, coherence produit multi-angles
- Marketing & brand assets — contenu UGC AI, campagnes social media, visuels de marque a grande echelle, AI influenceurs
- Interior design & real estate — staging virtuel photoraliste, variations eclairage/decor
- Content creation & storyboarding — visualisation de scenes, coherence personnage sur storyboards longs
- Fashion & apparel design — tests sur modeles coherents, lookbooks, variations saisonnieres, proportions preservees
- Education & publishing — illustrations coherentes sur chapitres, materiels de cours

**Tarifs :** 8 cr (toutes resolutions 1K/2K/4K)

**Variantes :**
- `nano-banana-2` — texte vers image (attention : meme ID que Nano Banana 2 de generation precedente)
- `nano-banana-2-edit` — edition : angles de camera, focus, color grading, variations

---

## Seedream 5.0 Lite

**Fournisseur :** Seedream (ByteDance) | **ID API :** `seedream-5.0-lite` ou `seedream-5.0-lite-edit`

**Description :** Premier modele ByteDance avec recherche web integree. Connaissance du monde elargie, suivi d'instructions complexes avec comprehension semantique profonde, coherence forte inter-images, edition localisee par region. Resolution native 2K/3K.

**Points forts :**
- Recherche web integree (genere avec les dernieres tendances)
- Resolution 3K
- Jusqu'a 14 images de reference
- -29% vs fal.ai
- Comprehension semantique profonde des prompts complexes
- Preservation de coherence : personnage, style, details entre images
- Edition localisee : modifications ciblees par region sans regenerer l'ensemble
- Fusion multi-images en compositions coherentes

**Points faibles :**
- Resolution max 3K (vs 4K pour Seedream 4.5)
- Legerement moins precis pour la photo commerciale pure

**Use cases :**
- Trending content & real-time marketing — visuels avec tendances actuelles, breaking news, evenements, sans recherche manuelle
- E-commerce product photography — photos produit haute resolution avec texte precis (labels, logos, specs)
- Educational & knowledge content — illustrations scientifiques, diagrammes educatifs, vulgarisation visuelle
- Character-consistent visual storytelling — identite personnage preservee sur storyboards, comics, narratifs de marque
- Iterative design & localized editing — editions ciblees par region, workflow de revisions client
- Brand-focused creative workflows — assets de marque coherents, identite visuelle unifiee sur campagnes

**Tarifs :** 5 cr (2K ou 3K, meme prix)

**Variantes :**
- `seedream-5.0-lite` — texte vers image, recherche web optionnelle, 2K ou 3K
- `seedream-5.0-lite-edit` — edition localisee, transfert de style, modifications multi-rounds

---

## Seedream 4.5

**Fournisseur :** Seedream (ByteDance) | **ID API :** `seedream-4.5` ou `seedream-4.5-edit`

**Description :** Generation 4K ultra avec qualite photo commerciale, logique d'eclairage avancee, rendu texte precis, raisonnement de composition avance. Standard de photographie professionnelle et production cinematique.

**Points forts :**
- Resolution native 4K (4096x4096)
- Eclairage cinematique (color grading unifie, eclairage realiste, proportions naturelles)
- Rendu texte professionnel
- Coherence matiere/sujet
- -38% vs fal.ai
- Raisonnement de composition avance (diagonale, ratio d'or, flou d'arriere-plan)
- Generation batch optimisee avec qualite constante
- Charts, diagrammes, layouts structures

**Points faibles :**
- Pas de recherche web (donnees statiques)
- Legerement plus cher que Seedream 5.0 Lite
- Moins adapte aux contenus temps reel

**Use cases :**
- E-commerce product photography — photos produit qualite commerciale, coherence catalogue, visuels lifestyle 4K
- High-impact advertising — visuels poster-grade, color grading cinematique, composition pro pour billboards et campagnes digitales
- Fashion & style photography — edits fashion stylises, eclairage realiste, proportions naturelles, guides de style
- Brand-focused creative workflows — assets de marque coherents, integration logo, texte precis
- Professional design & charts — layouts structures, diagrammes, visualisations de donnees, presentations, infographies techniques
- Cinematic visual production — visuels qualite cinema, eclairage avance, color grading, materiels promotionnels haut de gamme

**Tarifs :** 5 cr (2K) · 6 cr (4K)

**Variantes :**
- `seedream-4.5` — texte vers image, 2K ou 4K
- `seedream-4.5-edit` — edition avec guidance naturelle + visuelle, jusqu'a 14 images de reference (T2I) ou 10 (edition)

---

## GPT Image 1.5

**Fournisseur :** OpenAI | **ID API :** `gpt-image-1.5` ou `gpt-image-1.5-edit`

**Description :** Modele OpenAI 4x plus rapide que GPT Image 1. Edition de precision, rendu texte superieur, coherence de marque, instruction following precis (modifie uniquement ce qu'on demande).

**Points forts :**
- 4x plus rapide que v1
- Edition chirurgicale (modifie seulement ce qu'on demande)
- Excellent rendu texte dense
- Coherence de marque (logos et visuels cles preserves entre editions)
- -23% vs officiel
- Instruction following precis : change ce qu'on demande, garde le reste intact
- 20% moins cher que GPT Image 1

**Points faibles :**
- 1 seule image de reference (vs 14 pour Gemini)
- Pas de resolution 4K native specifiee

**Use cases :**
- E-commerce product catalogs — catalogues complets avec variantes, scenes et angles depuis une image source
- Marketing & brand assets — visuels de campagne, social media, coherence logos et visuels cles entre editions
- Logo & graphic design — marques originales, formes nettes, espace negatif equilibre, identite de marque
- UI mockups & prototypes — maquettes d'interface realistes, layout, hierarchie, elements d'interface reels
- Photo editing & retouching — retouche ciblee : changement de fond, modification d'objets, filtres de style

**Tarifs :** 2 cr/generation ($0.01)

**Variantes :**
- `gpt-image-1.5` — texte vers image
- `gpt-image-1.5-edit` — edition precise : ajout/suppression d'objets, changement de style, retouche ciblee

---

## FLUX.2

**Fournisseur :** Black Forest Labs | **ID API :** `flux-2-pro` / `flux-2-pro-edit` / `flux-2-flex` / `flux-2-flex-edit`

**Description :** IA de production de Black Forest Labs : resolution 4MP, controle multi-reference jusqu'a 10 images, correspondance exacte des couleurs par code hex, typographie complexe, < 10s de generation, tout ratio d'aspect supporte.

**Points forts :**
- Jusqu'a 10 images de reference (coherence maximale)
- Correspondance couleurs par hex
- Typographie complexe
- 4MP
- < 10s
- Support de tout ratio d'aspect (du 400px carre au haute resolution)

**Points faibles :**
- Flex (precision max) coute 3x plus que Pro
- Prix eleve pour la precision maximale

**Use cases :**
- Marketing & advertising — visuels marketing, contenu social media, campagnes publicitaires avec couleurs de marque exactes
- Product visualization — mockups produit, packaging, lifestyle photography avec multi-reference et couleurs hex fideles
- Creative production — concept art, storyboarding, developpement visuel avec generation rapide
- Design & UI/UX — maquettes UI, interfaces d'app, prototypes design avec typographie precise et ratios flexibles
- Entertainment & media — visuels coherents pour storytelling, concept art, production media via multi-reference
- E-commerce — photos produit haute qualite, lifestyle shots, materiels promotionnels en 4MP

**Tarifs :** Pro : 6 cr (1K) · 9 cr (2K) | Flex : 18 cr (1K) · 27 cr (2K)

**Variantes :**
- `flux-2-pro` — texte vers image, rapide, production courante
- `flux-2-pro-edit` — edition d'image avec le modele Pro
- `flux-2-flex` — precision maximale, multi-reference 10 images, controle hex couleur
- `flux-2-flex-edit` — edition haute precision avec le modele Flex

---

## GPT-4o Image

**Fournisseur :** OpenAI | **ID API :** `gpt-4o-image`

**Description :** Generation d'images via le modele GPT-4o multimodal (gpt-image-1). Haute comprehension contextuelle avec fenetre de contexte 128K. Resolution 4K (4096x4096), rendu texte pixel-perfect, edition via masque PNG, raffinement conversationnel iteratif. Generation photorealiste avec eclairage naturel et textures realistes.

**Points forts :**
- Rendu texte pixel-perfect (infographies, diagrammes, posters avec labels)
- Comprehension de prompts complexes (10-20 objets places avec precision)
- Resolution 4K (4096x4096), multiples ratios d'aspect
- Edition avancee via masque PNG (modification spatiale ciblee)
- Raffinement conversationnel (iterations via dialogue naturel, contexte preserve)
- Generation photorealiste (eclairage naturel, ombres, textures realistes)
- Contexte 128K tokens

**Points faibles :**
- Pas de multi-reference d'images
- Plus cher que GPT Image 1.5
- Moins rapide que les modeles specialises

**Use cases :**
- Marketing & brand assets — visuels de campagne, social media, materiels de marque avec texte integre sans post-production
- Product demonstrations — lifestyle photos, mockups produit, demonstrations visuelles photorealistes pour e-commerce et presentations
- Content creation & publishing — images pour blogs, articles, presentations, infographies complexes, diagrammes educatifs
- Design & prototyping — visualisation de concepts, maquettes UI, iterations design, presentations client via dialogue
- Corporate & professional use — imagerie corporate, materiels de formation, presentations business, coherence de marque

**Tarifs :** 4 cr/generation ($0.02, -50% vs officiel)

**Variantes :**
- `gpt-4o-image` — texte vers image + edition via masque PNG

---

## Grok Imagine

**Fournisseur :** xAI | **ID API :** `grok-imagine-image` (image) / `grok-imagine` (video)

**Description :** Generation d'images et transformation image-vers-video via le moteur Aurora d'xAI (architecture autoregressive). 3 modes creatifs (Fun, Normal, Spicy). Videos de 6 secondes avec audio synchronise automatiquement.

**Points forts :**
- Moteur Aurora (architecture autoregressive, controle fin de generation)
- 3 modes creatifs : Fun (ludique), Normal (equilibre), Spicy (audacieux)
- Transformation image-vers-video (6s avec audio synchronise)
- Generation rapide (images en secondes, videos en < 1 min)
- Audio automatique synchronise avec le contenu visuel

**Points faibles :**
- Pas adapte a la production commerciale serieuse
- Resolution moins elevee que les modeles specialises
- Controle moins fin que Seedream ou FLUX.2

**Use cases :**
- Social media content — images et videos virales pour TikTok, Instagram, X (mode Fun pour memes, Normal pour qualite pro)
- Marketing & advertising — visuels et pubs animees rapides, test de directions creatives avec differents modes
- Creative exploration — exploration rapide de concepts visuels, mode Spicy pour expressions artistiques audacieuses
- Messaging & stickers — contenu anime custom pour apps de messagerie, clips animes depuis selfies
- Business presentations — imagerie professionnelle pour presentations et documents (mode Normal)
- Gaming & entertainment — concept art, character designs, videos promotionnelles, iteration rapide multi-modes

**Tarifs :** 6 cr/image (grok-imagine-image) · 30 cr/video 6s avec audio (grok-imagine)

**Variantes :**
- `grok-imagine-image` — texte vers image, 3 modes creatifs
- `grok-imagine` — image vers video 6s avec audio synchronise
