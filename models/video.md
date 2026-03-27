# Modeles video — Guide de selection

## Tableau decisionnel

| Cas d'usage | Modele recommande | Prix min | Quand l'utiliser | Quand NE PAS l'utiliser |
|---|---|---|---|---|
| Prototypage rapide, tests de concept, iterations batch | Wan 2.2 Fast | 6 cr | Budget serre, besoin de tester plusieurs directions vite, qualite secondaire | Livrable final, contenu client, besoin de 1080p ou audio |
| Animation simple d'un personnage depuis une image | Wan Animate | 7 cr | Avatar virtuel, presentateur AI, e-learning, marketing avec porte-parole anime | Mouvements complexes (danse, sport), besoin d'audio, resolution > 720p |
| Scenes d'action, sport, physique realiste | Hailuo 02 Standard | 3 cr/s | Gym, acrobaties, mouvements complexes, rendu physique ultra-precis | Budget fixe (tarif a la seconde), besoin d'audio, pas de contenu d'action |
| Scenes d'action, qualite maximale | Hailuo 02 Pro | 65 cr fixe | Budget previsible, meilleure qualite possible pour scenes d'action, duree <= 10s | Budget serre, contenu > 10s, pas besoin de qualite maximale |
| Production rapide haute qualite, multi-shots | Seedance 1.0 Pro | 21 cr | Marketing, social media, tutoriels, storyboarding multi-plans, meilleur rapport qualite/prix | Besoin d'audio natif, contenu avec dialogue |
| Clip social court, demo produit | Hailuo 2.3 | 35 cr | Mouvement humain expressif, personnages realistes, reseaux sociaux | Besoin de frame de fin, duree > 10s, 1080p sur clips > 6s |
| Clip social viral, sticker anime | Grok Imagine | 30 cr | Transformation rapide de photo en video courte, modes creatifs fun/spicy | Contenu pro, duree > 6s, besoin de controle precis |
| Dialogue, voix-off, lip-sync multilangue/dialectes | Seedance 1.5 Pro | 9 cr | Scenes de dialogue, drames courts, publicites avec voix-off, contenus localises, lip-sync multilangue | Besoin de 1080p, sequences sans dialogue, durees hors 4/8/12s |
| Animation image-vers-video avec composition verrouillee | Kling 2.1 Standard | 30 cr | Storyboard image-a-video, composition precise, iterations rapides a cout reduit | Besoin de texte seul (start frame obligatoire), besoin d'audio, controle de fin de plan |
| Animation image-vers-video avec controle start + end frame | Kling 2.1 Pro | 55 cr | Revelations produit, transitions planifiees, arrivee visuelle maitrisee | Budget serre (2x le standard), besoin de texte seul, besoin d'audio |
| Clip de lancement, iterations creatives multi-formats | Kling 2.5 Turbo Pro | 42 cr | Texte seul OU start/end frame dans le meme modele, ratio d'aspect configurable | Budget serre (plus cher que Kling 2.1 pour le meme resultat basique), besoin d'audio |
| Clip commercial court, video branded | Wan 2.5 | 30 cr | Audio optionnel integre, montee en resolution jusqu'a 1080p, production qualite | Multi-shots, controle audio avance, budget serre (preferer Wan 2.2 Fast) |
| Publicite avec dialogue, video narrative multi-plans | Kling 3.0 Standard | 27 cr/s | Multi-shots (6 plans/15s), audio multilingue (EN/ZH/JA/KO/ES), coherence 3 personnages | Budget serre (tarif/s eleve surtout avec audio), contenu sans dialogue |
| Publicite narrative, qualite cinema | Kling 3.0 Pro | 39 cr/s | Meme que Standard mais en 1080p avec meilleur photorealisme | Budget serre, pas besoin de 1080p (preferer Standard) |
| Publicite parlee, explainer video, 1080p + audio natif | Kling 2.6 | 65 cr | Audio natif en un seul pass, lip-sync precis, dialogue multi-personnages, 1080p | Budget serre (audio double le prix), durees hors 5/10s |
| Clip cinematique premium, lancement produit | Sora 2 Official | 48 cr | Audio synchronise natif, physique realiste, durees flexibles 4-20s, rendu premium | Budget serre, multi-shots, ratio hors 16:9/9:16, audio multilingue |
| Direction artistique exigeante, campagne premium | Runway Gen-4.5 | 75 cr | Haute fidelite visuelle, adherence aux prompts complexes, rendu cinematique | Budget serre, besoin d'audio, durees hors 5/10s |
| Film court multi-shots + audio + lip-sync | Wan 2.6 | 80 cr | Multi-shots + audio + lip-sync en un seul modele, jusqu'a 15s, 3 modes (T2V/I2V/R2V) | Budget serre, audio hors EN/ZH |
| Transfert de mouvement (motion capture legere) | Kling 3.0 Motion Control | 9 cr/s | Image + video de reference, preservation d'identite du personnage, 720p/1080p | Besoin de texte seul, generation libre, budget serre |
| Transfert de mouvement pro, VFX, micro-expressions | Kling 2.6 Motion Control | 8 cr/s | Tracking corps complet + expressions faciales, remplacement d'environnement, camera control | Generation libre, pas de video de reference disponible |
| Remplacement de personnage dans une video existante | Wan Animate (replace) | 7 cr | Remplacer le personnage d'une video par une image fournie, simple a integrer | Mouvements complexes, resolution > 720p, audio |

## Raccourcis decisionnels

- **Le moins cher** → Hailuo 02 Standard en 512p (3 cr/s) ou Wan 2.2 Fast en 480p (6 cr fixe)
- **Le plus rapide** → Seedance 1.0 Pro (architecture 10x plus rapide)
- **Le plus polyvalent** → Kling 3.0 (multi-shots + audio multilingue + coherence personnages)
- **La meilleure qualite** → Runway Gen-4.5 (fidelite visuelle) ou Hailuo 02 Pro (physique)
- **Le meilleur rapport qualite/prix** → Seedance 1.0 Pro (21 cr, #1 classement, multi-shots)
- **Audio natif inclus** → Sora 2 Official, Kling 2.6, Kling 3.0, Seedance 1.5 Pro, Wan 2.5, Wan 2.6, Grok Imagine
- **Multi-shots (storyboard IA)** → Kling 3.0, Seedance 1.0 Pro, Seedance 1.5 Pro, Wan 2.6
- **Motion control** → Kling 2.6 Motion Control (pro), Kling 3.0 Motion Control, Wan Animate (simple)

## Par besoin produit

**Demo produit / walkthrough d'app**
→ Seedance 1.0 Pro (21 cr) — rapide, multi-shots pour enchainer les ecrans, meilleur rapport qualite/prix
→ Hailuo 2.3 (35 cr) — si un personnage humain presente le produit (mouvement expressif)
→ Kling 2.1 Standard (30 cr) — composition verrouillee depuis un screenshot, ideal pour animer une UI

**Pub video pour landing page / social media**
→ Kling 3.0 Standard (27 cr/s) — multi-shots + voix-off multilingue pour une pub structuree
→ Seedance 1.5 Pro (9 cr) — alternative moins chere si dialogue avec lip-sync en 720p
→ Wan 2.5 (30 cr) — clip commercial court avec audio optionnel, bon equilibre qualite/prix

**Teaser de lancement produit**
→ Sora 2 Official (48 cr) — rendu cinematique premium + audio synchronise, physique realiste
→ Runway Gen-4.5 (75 cr) — direction artistique exigeante, fidelite visuelle maximale
→ Kling 2.5 Turbo Pro (42 cr) — flexible (texte seul ou start/end frame), bon pour iterer le concept

**Explainer video avec voix-off**
→ Kling 2.6 (65 cr) — audio natif 1080p, lip-sync precis, dialogue multi-personnages
→ Seedance 1.5 Pro (9 cr) — alternative economique en 720p, lip-sync multilingue/dialectes
→ Kling 3.0 Standard (27 cr/s) — si besoin de multi-shots pour structurer l'explication

**Temoignage client anime (avatar parlant depuis une photo)**
→ Wan Animate (7 cr) — transfert de mouvement simple, presentateur AI depuis une image
→ Seedance 1.5 Pro (9 cr) — lip-sync multilangue pour faire "parler" un avatar
→ Kling 2.6 Motion Control (8 cr/s) — tracking pro si besoin de micro-expressions faciales

**Video background ambient pour landing page (loop)**
→ Wan 2.2 Fast (6 cr) — economique, qualite suffisante pour un fond flou/ambient
→ Kling 2.5 Turbo Pro (42 cr) — meilleure qualite si le background est visible et net

**Transition / animation entre ecrans d'app**
→ Kling 2.1 Standard (30 cr) — start frame = screenshot A, composition verrouillee
→ Kling 2.1 Pro (55 cr) — start frame = ecran A, end frame = ecran B, transition maitrisee
→ Wan 2.2 Fast (6 cr) — draft rapide pour tester le concept avant de payer plus

**Short-form social (Reels / TikTok / Shorts)**
→ Grok Imagine (30 cr) — clip 6s rapide avec audio, modes creatifs fun/spicy pour le viral
→ Hailuo 2.3 (35 cr) — mouvement humain expressif, personnages realistes pour le social
→ Seedance 1.0 Pro (21 cr) — multi-shots pour un short structure en plusieurs plans

**Film court / storytelling de marque**
→ Kling 3.0 Pro (39 cr/s) — multi-shots (6 plans/15s), coherence 3 personnages, 1080p, audio multilingue
→ Wan 2.6 (80 cr) — multi-shots + audio + lip-sync en un seul modele, jusqu'a 15s
→ Sora 2 Official (48 cr) — rendu cinematique premium pour un plan unique marquant

**Motion branding / logo anime**
→ Kling 2.1 Standard (30 cr) — start frame = logo statique, animation fluide
→ Wan 2.2 Fast (6 cr) — draft economique pour tester le mouvement avant d'investir
→ Grok Imagine (30 cr) — animation rapide 6s avec audio pour une intro/outro

---

## Sora 2 Official

**Fournisseur :** OpenAI | **ID API :** `sora-2-official`

**Description :** Le modele video flagship d'OpenAI avec audio synchronise, simulation physique realiste et guidage optionnel par image.

**Points forts :**
- Audio synchronise natif
- Tres bonne physique/realisme
- Durees flexibles (4s a 20s)
- Image de reference optionnelle
- -40% vs fal.ai

**Points faibles :**
- Cout eleve ($0.06/s)
- Pas de controle multi-shots
- Un seul ratio (16:9 ou 9:16)
- Pas d'audio multilingue

**Tarifs :** 48 cr/4s · 96 cr/8s · 144 cr/12s · 192 cr/16s · 240 cr/20s

**Variantes :**
- `sora-2-official` — texte vers video, image de reference optionnelle (mode texte pur ou image-guide)

---

## Kling 3.0 Motion Control

**Fournisseur :** Kling | **ID API :** `kling-3.0-motion-control`

**Description :** Transfert de mouvement controle : une image de personnage + une video de reference = le personnage reproduit les mouvements.

**Points forts :**
- Controle precis du mouvement (image ou video pilote)
- Preservation de l'identite du personnage
- -64% vs fal.ai
- 720p et 1080p

**Points faibles :**
- Entrees strictement fixes (1 image + 1 video obligatoires)
- Pas de texte seul
- Pas de generation libre
- Duree depend de la video source

**Tarifs :** 9 cr/s (720p) · 15 cr/s (1080p)

**Variantes :**
- `kling-3.0-motion-control` — un seul modele, parametre `character_orientation` = `image` (suit l'image) ou `video` (suit la video de reference)

---

## Hailuo 2.3

**Fournisseur :** Hailuo | **ID API :** `hailuo-2.3`

**Description :** Generation video realiste axee sur le mouvement humain expressif et l'adherence stylistique. Supporte texte seul ou image de depart.

**Points forts :**
- Mouvement humain tres realiste
- Personnages expressifs
- `prompt_optimizer` integre pour affiner les prompts courts
- -38% vs fal.ai

**Points faibles :**
- Pas de frame de fin (seulement start frame)
- Duree limitee 6s/10s
- 1080p uniquement sur 6s

**Tarifs :** 35 cr (768p/6s) · 70 cr (768p/10s) · 60 cr (1080p/6s)

**Variantes :**
- `hailuo-2.3` — texte vers video ou image vers video (start frame optionnel via `start_image_url`)

---

## Kling 2.1

**Fournisseur :** Kling | **ID API :** `kling-2.1/standard` ou `kling-2.1/pro`

**Description :** Image vers video avec controle de la frame de depart obligatoire. Le mode Pro ajoute le controle de la frame de fin.

**Points forts :**
- Start frame requis = composition verrouillee
- Mode Pro avec end frame pour controle precis du plan
- -50% vs fal.ai

**Points faibles :**
- `start_image_url` obligatoire (pas de texte seul)
- End frame uniquement en Pro
- Pas d'audio
- Durees limitees 5s/10s

**Tarifs :** Standard : 30 cr/5s · 60 cr/10s | Pro : 55 cr/5s · 110 cr/10s

**Variantes :**
- `kling-2.1/standard` — start frame obligatoire, pas de end frame, cout reduit, ideal pour iterations
- `kling-2.1/pro` — start frame + end frame optionnel (`end_image_url`), pour plans avec arrivee visuelle planifiee (revelations produit, transitions)

---

## Kling 2.5 Turbo Pro

**Fournisseur :** Kling | **ID API :** `kling-2.5-turbo-pro`

**Description :** Modele flexible acceptant texte seul ou start/end frames. Motion fluide avec forte adherence aux prompts.

**Points forts :**
- Texte seul ou guidage start+end frame dans un meme modele
- Motion fluide
- Ratio d'aspect configurable
- -40% vs fal.ai

**Points faibles :**
- Durees 5s/10s uniquement
- Pas d'audio
- Plus cher que Kling 2.1 standard pour le meme resultat basique

**Tarifs :** 42 cr/5s · 84 cr/10s

**Variantes :**
- `kling-2.5-turbo-pro` — modele unique avec `start_image_url` et `end_image_url` tous deux optionnels

---

## Wan 2.2 Fast

**Fournisseur :** Wan | **ID API :** `wan2.2-text-to-video-fast` ou `wan2.2-image-to-video-fast`

**Description :** Modele rapide et economique, ideal pour les boucles de draft et les tests de direction creative.

**Points forts :**
- Tres faible cout (6 cr/generation en 480p)
- Rapide
- 1 ou 2 images de guidage en mode I2V
- Controle d'aspect ratio en T2V

**Points faibles :**
- Resolution limitee (480p/720p)
- Qualite inferieure aux modeles premium
- Pas d'audio

**Tarifs :** 6 cr (480p) · 12 cr (720p)

**Variantes :**
- `wan2.2-text-to-video-fast` — texte vers video, controle d'aspect ratio (paysage, portrait, carre, ultra-large)
- `wan2.2-image-to-video-fast` — 1 ou 2 images (la 2eme = frame de fin)

---

## Wan 2.5

**Fournisseur :** Wan | **ID API :** `wan2.5-text-to-video` ou `wan2.5-image-to-video`

**Description :** Palier superieur a Wan 2.2 Fast : meilleure fidelite visuelle, audio synchronise disponible, jusqu'a 1080p.

**Points forts :**
- Audio optionnel integre (A/V sync)
- 480p/720p/1080p
- 5s et 10s
- -40% vs fal.ai

**Points faibles :**
- Plus cher que Wan 2.2 Fast
- Pas de multi-shots
- Controle audio limite

**Tarifs :** 30-90 cr selon resolution et duree (double pour 10s)

**Variantes :**
- `wan2.5-text-to-video` — prompts texte + presets d'aspect ratio
- `wan2.5-image-to-video` — image de depart + resolution configurable + parametre audio

---

## Runway Gen-4.5

**Fournisseur :** Runway | **ID API :** `runway-gen-4.5`

**Description :** Modele premium oriente haute fidelite visuelle, precision physique et adherence aux prompts detailles.

**Points forts :**
- Haute fidelite visuelle et rendu cinematique
- Forte adherence aux prompts complexes
- 6 ratios d'aspect
- Seed optionnel
- Image de reference optionnelle

**Points faibles :**
- Prix eleve (75 cr/5s)
- Pas d'audio
- Durees 5s/10s uniquement
- -30% vs officiel seulement

**Tarifs :** 75 cr/5s · 150 cr/10s

**Variantes :**
- `runway-gen-4.5` — texte vers video avec image de reference optionnelle (un seul modele)

---

## Kling 3.0

**Fournisseur :** Kling | **ID API :** `kling-3.0/standard` ou `kling-3.0/pro`

**Description :** Le modele Kling le plus avance : multi-shots (storyboarding IA), audio multilingue natif, coherence de personnages, jusqu'a 15s.

**Points forts :**
- Multi-shots (jusqu'a 6 plans/15s avec l'IA Director)
- Audio synchronise multilingue (EN/ZH/JA/KO/ES)
- Coherence de 3 personnages simultanes
- 1080p en Pro
- -13% vs fal.ai

**Points faibles :**
- Prix par seconde eleve (surtout avec audio)
- Moins de reduction vs concurrents que d'autres modeles

**Tarifs :** Standard : 27 cr/s (sans audio) · 39 cr/s (avec audio) | Pro : 39 cr/s (sans audio) · 49 cr/s (avec audio)

**Variantes :**
- `kling-3.0/standard` — 720p, texte/image vers video, multi-shots, audio optionnel
- `kling-3.0/pro` — 1080p, memes fonctionnalites avec meilleur photorealisme

---

## Hailuo 02

**Fournisseur :** Hailuo (MiniMax) | **ID API :** `hailuo-02` ou `hailuo-02-pro`

**Description :** Classe #2 mondial sur Artificial Analysis, architecture NCR (3x plus de parametres), simulation physique ultra-realiste incluant mouvements complexes (gym, acrobaties).

**Points forts :**
- Seul modele capable de rendu de gymnaste precis
- Architecture NCR 2.5x plus efficace
- 1080p/24-30fps
- Start+end frames
- -32% vs fal.ai

**Points faibles :**
- Modele Pro a prix fixe (65 cr) peu flexible
- Standard par seconde peut vite couter cher

**Tarifs :** Standard : 7 cr/s (768p) · 3 cr/s (512p) | Pro : 65 cr fixe

**Variantes :**
- `hailuo-02` — par seconde, 768p ou 512p, texte ou image de depart
- `hailuo-02-pro` — prix fixe 65 cr, qualite maximale, duree jusqu'a 10s

---

## Seedance 1.0 Pro

**Fournisseur :** Seedance (ByteDance) | **ID API :** `seedance-1.0-pro`

**Description :** Classe #1 mondial selon les leaderboards, architecture Temporally-Causal VAE pour une generation 10x plus rapide.

**Points forts :**
- #1 classement global
- 10x plus rapide
- Multi-shots integre
- Support bilingue EN/ZH
- 720p et 1080p
- -83% vs concurrents

**Points faibles :**
- Pas d'audio natif
- Durees 5s/10s uniquement

**Tarifs :** 21 cr (720p/5s) · 42 cr (720p/10s) · 43 cr (1080p/5s) · 86 cr (1080p/10s)

**Variantes :**
- `seedance-1.0-pro` — texte ou image vers video (un seul ID de modele)

---

## Seedance 1.5 Pro

**Fournisseur :** Seedance (ByteDance) | **ID API :** `seedance-1.5-pro`

**Description :** Evolution de Seedance 1.0 Pro avec generation audio-video jointe native, lip-sync multilingue/dialectes, camera cinematique et coherence narrative.

**Points forts :**
- Audio+video generes ensemble en un seul pass (meilleure sync)
- Lip-sync multilingue et dialectes
- Plans longs (dolly zoom)
- 10x plus rapide
- -24-30% vs concurrents

**Points faibles :**
- Resolution max 720p (pas de 1080p)
- Durees 4s/8s/12s
- Moins adapte pour les sequences sans dialogue

**Tarifs :** Sans audio : 9 cr (480p/4s) a 42 cr (720p/12s) | Avec audio : double les credits

**Variantes :**
- `seedance-1.5-pro` — texte vers video et image vers video (meme modele, parametre `generate_audio` pour activer l'audio)

---

## Kling 2.6

**Fournisseur :** Kling | **ID API :** `kling-2.6`

**Description :** Premier modele Kling avec audio natif. Dialogue synchronise, SFX, audio ambiant en un seul pass. 1080p.

**Points forts :**
- Audio natif en un seul pass (pas de post-traitement)
- Lip-sync precis
- 1080p
- Dialogue multi-personnages
- -14% vs fal.ai

**Points faibles :**
- Durees 5s/10s uniquement
- Audio double le prix
- Moins de remise que d'autres modeles

**Tarifs :** 65 cr/5s · 130 cr/10s · 120 cr/5s+audio · 240 cr/10s+audio

**Variantes :**
- `kling-2.6` — modele unique, parametre `sound: true/false` pour activer/desactiver l'audio

---

## Kling 2.6 Motion Control

**Fournisseur :** Kling | **ID API :** `kling-2.6-motion-control`

**Description :** Transfert de mouvement professionnel depuis une video de reference vers un personnage image. Full-body tracking, expressions faciales, controle d'environnement.

**Points forts :**
- Tracking corps complet + micro-expressions
- Remplacement d'environnement via prompt
- Controle de camera
- 720p/1080p
- -43% vs fal.ai

**Points faibles :**
- Necessite image + video de reference
- Pas de generation libre
- Prix par seconde

**Tarifs :** 8 cr/s (720p) · 12 cr/s (1080p)

**Variantes :**
- `kling-2.6-motion-control` — un seul ID, parametre `character_orientation` : `image` (max 10s) ou `video` (max 30s)

---

## Wan 2.6

**Fournisseur :** Wan (Alibaba) | **ID API :** `wan2.6-text-to-video` / `wan2.6-image-to-video` / `wan2.6-video-to-video`

**Description :** Premier modele open-source avec multi-shots narratifs ET audio natif avec lip-sync. Jusqu'a 15s.

**Points forts :**
- Multi-shots + audio + lip-sync en un seul modele
- Jusqu'a 15s
- 3 modes (T2V/I2V/R2V)
- Coherence de personnage via reference
- -20% vs fal.ai

**Points faibles :**
- Moins de remise que d'autres modeles
- Qualite audio limitee a EN/ZH

**Tarifs :** 80 cr (720p/5s) · 160 cr (720p/10s) · 240 cr (720p/15s) · 120/240/360 cr (1080p)

**Variantes :**
- `wan2.6-text-to-video` — texte vers video, audio optionnel
- `wan2.6-image-to-video` — anime une image, audio optionnel
- `wan2.6-video-to-video` — R2V : maintient la coherence du personnage via images de reference avec voix/motion synchronises

---

## Wan Animate

**Fournisseur :** Wan (Alibaba 2.1) | **ID API :** `wan-animate-move` ou `wan-animate-replace`

**Description :** Animation de personnages : transfert de mouvement depuis une video OU remplacement d'un personnage dans une video existante.

**Points forts :**
- Deux workflows distincts (transfert ou remplacement)
- Coherence du personnage
- 480p/580p/720p
- Simple a integrer
- -12% vs fal.ai

**Points faibles :**
- Resolution max 720p
- Mouvements complexes limites (vs Kling Motion Control)
- Pas d'audio

**Tarifs :** 7 cr (480p) · 12 cr (580p) · 15 cr (720p)

**Variantes :**
- `wan-animate-move` — une image + une video de reference → transfert du mouvement sur l'image
- `wan-animate-replace` — remplace le personnage d'une video existante par l'image fournie

---

## Grok Imagine (video)

**Fournisseur :** xAI | **ID API :** `grok-imagine`

**Description :** Image vers video 6s avec audio synchronise. Moteur Aurora d'xAI. Modes creatifs Fun/Normal/Spicy.

**Points forts :**
- 3 modes creatifs (Fun/Spicy/Normal)
- Audio natif synchronise
- Tres rapide
- Prix accessible

**Points faibles :**
- 6s seulement
- Resolution non precisee
- Moins de controle que les modeles pro

**Tarifs :** 30 cr/video 6s

**Variantes :**
- `grok-imagine` — image vers video 6s avec audio
