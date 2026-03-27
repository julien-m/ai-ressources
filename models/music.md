# Modeles musique — Guide de selection

> Tous les modeles musique sont alimentes par la technologie **Suno** et partagent un flux async commun.

## Tableau decisionnel

| Cas d'usage | Modele recommande | Prix | Quand l'utiliser | Quand NE PAS l'utiliser |
|---|---|---|---|---|
| Creer une musique originale from scratch | AI Music (generate-music) | 20 cr | Morceau original depuis texte, modes simple/custom, V3.5-V5, vocal ou instrumental | Prolonger un existant, transformer un audio existant |
| Allonger un morceau Suno existant | Extend Music | 20 cr | Continuation coherente depuis un point precis, chainage, boucles, jusqu'a 8 min (V4.5+) | Audio externe (necessite un audio_id Suno), creation from scratch |
| Allonger un fichier audio uploade | Upload and Extend Audio | 20 cr | Extension d'un fichier MP3/WAV uploade (max 2 min), preservation de style, timestamp precis | Audio Suno existant (preferer Extend Music), creation from scratch |
| Remix de style, cover IA, changement de genre | Upload and Cover Audio | 20 cr | Transformer pop en jazz, adapter a un nouveau contexte, preservation de melodie, controle audio_weight | Audio > 2 min, audio de mauvaise qualite, creation from scratch |
| Ajouter un accompagnement instrumental a des voix | Add Instrumental | 20 cr | A cappella vers chanson complete, backing tracks, vocal production, style tags personnalisables | Besoin d'ajouter des voix (preferer Add Vocals), creation from scratch |
| Ajouter des voix IA a un instrumental | Add Vocals | 20 cr | Instrumental vers chanson complete, lyrics custom, selection voix M/F, style configurable | Besoin d'instrumental (preferer Add Instrumental), creation from scratch |
| Editer chirurgicalement une section d'un morceau | Replace Section | 10 cr | Remplacement de segment precis (timestamp), inpainting musical, modification lyrics, transitions seamless | Refonte complete (preferer AI Music), extension (preferer Extend) |
| Generer des variations/covers d'un morceau | Generate Music Cover | 1 cr | Variations stylistiques d'un track existant (par task_id), A/B testing, diversite de playlist | Creation from scratch, transformation d'audio externe |
| Extraire les paroles avec timestamps | Get Timestamped Lyrics | 1 cr | Karaoke, lyrics synchronises, waveform data, apps musique, language learning | Creation ou edition de musique |
| Optimiser un prompt de style musical | Boost Music Style | 1 cr | Transformer "Pop, Mysterious" en description riche et detaillee pour meilleure generation | Generation directe, pas de generation de musique prevue |
| Creer un profil vocal reutilisable | Generate Persona | 1 cr | Extraire voix/style d'un audio existant, persona reutilisable sur generations futures, coherence artiste | Pas de besoin de coherence entre morceaux |
| Generer des paroles originales | Generate Lyrics | 1 cr | Lyrics depuis theme/description texte (max 200 chars), songwriting assiste, inspiration creative | Paroles deja ecrites, pas de besoin de paroles |
| Convertir en WAV lossless | Convert to WAV | 1 cr | Export studio-grade, mastering, archivage, broadcast, distribution | Usage web standard (MP3 suffit) |
| Separer voix et instruments (stems) | Vocal Remover | 15-70 cr | Karaoke, remixing, separation simple (15 cr) ou multi-stem drums/bass/vocals/etc (70 cr) | Pas de besoin de separation, budget serre |
| Generer un clip video musical | AI Music Video | 4 cr | Visualisation audio-video synchronisee, promotion musicale, social media, watermarks custom | Video narrative (preferer modeles video), montage precis |

## Raccourcis decisionnels

- **Creer** → AI Music (`generate-music`, 20 cr)
- **Prolonger (Suno)** → Extend Music (`extend-music`, 20 cr)
- **Prolonger (upload)** → Upload and Extend Audio (`upload-and-extend-audio`, 20 cr)
- **Transformer** → Upload and Cover Audio (`upload-and-cover-audio`, 20 cr)
- **Ajouter instrumental** → Add Instrumental (`add-instrumental`, 20 cr)
- **Ajouter voix** → Add Vocals (`add-vocals`, 20 cr)
- **Editer section** → Replace Section (`replace-section`, 10 cr)
- **Variations** → Generate Music Cover (`generate-music-cover`, 1 cr)
- **Karaoke/lyrics** → Get Timestamped Lyrics (`get-timestamped-lyrics`, 1 cr)
- **Ameliorer prompt** → Boost Music Style (`boost-music-style`, 1 cr)
- **Profil artiste** → Generate Persona (`generate-persona`, 1 cr)
- **Ecrire paroles** → Generate Lyrics (`generate-lyrics`, 1 cr)
- **Export WAV** → Convert to WAV (`convert-to-wav`, 1 cr)
- **Separer stems** → Vocal Remover (`vocal-remover`, 15-70 cr)
- **Clip video** → AI Music Video (`create-music-video`, 4 cr)

## Par besoin produit

**Musique de fond pour video / film / podcast**
→ AI Music (20 cr) — creation from scratch depuis description texte, mode custom pour controle fin
→ Extend Music (20 cr) — adapter la duree a la video en prolongeant un morceau existant
→ Upload and Cover Audio (20 cr) — transformer le style d'un morceau existant pour coller au ton

**Jingle publicitaire / musique de marque**
→ AI Music (20 cr) — creation originale avec style_weight et persona_id pour coherence de marque
→ Upload and Extend Audio (20 cr) — decliner un jingle en versions 15s, 30s, 60s
→ Replace Section (10 cr) — modifier chirurgicalement une section pour adapter le message

**Karaoke / app musicale**
→ Get Timestamped Lyrics (1 cr) — timestamps mot par mot, waveform, score de precision
→ Vocal Remover (15 cr) — extraction instrumentale simple pour backing tracks karaoke
→ AI Music Video (4 cr) — visualisation synchronisee pour l'experience karaoke

**Contenu social media musical**
→ AI Music (20 cr) — morceau original court et accrocheur
→ AI Music Video (4 cr) — clip video auto-synchronise pour promotion
→ Generate Music Cover (1 cr) — variations pour A/B testing sur differentes audiences

**Production musicale / studio**
→ Add Instrumental (20 cr) — backing tracks pro pour voix enregistrees
→ Add Vocals (20 cr) — voix IA sur instrumentaux existants
→ Vocal Remover (70 cr) — separation multi-stem (drums, bass, voix, autres) pour remixing
→ Convert to WAV (1 cr) — export lossless pour mastering et distribution
→ Replace Section (10 cr) — inpainting musical pour corrections chirurgicales

**Game audio / soundtrack de jeu**
→ AI Music (20 cr) — themes originaux par personnage/niveau/situation
→ Extend Music (20 cr) — boucles seamless pour gameplay continu
→ Upload and Cover Audio (20 cr) — variations de theme pour differents contextes (combat, exploration, menu)
→ Generate Music Cover (1 cr) — decliner un theme en multiples variations a moindre cout

**Coherence artiste / serie de contenus**
→ Generate Persona (1 cr) — profil vocal reutilisable extrait d'un morceau existant
→ AI Music (20 cr) — generation avec persona_id pour coherence de style entre morceaux
→ Boost Music Style (1 cr) — enrichir les prompts de style pour des resultats plus precis

**Localisation / adaptation de contenu audio**
→ Upload and Cover Audio (20 cr) — adapter le genre pour differentes cultures/marches
→ Add Vocals (20 cr) — ajouter des voix dans un style vocal adapte au marche cible
→ Upload and Extend Audio (20 cr) — adapter la duree aux formats locaux

---

## AI Music (Generation)

**ID API :** `generate-music` | **Prix :** 20 cr/generation ($0.10)

**Description :** Genere de la musique originale depuis un texte. Modes simple (prompt seul) ou custom (controle total). Versions V3.5 a V5, vocal ou instrumental.

**Points forts :**
- Toutes les versions V3.5-V5 (V5 = meilleure expressivite)
- Jusqu'a 8 min (V4.5+)
- Controle fin (style_weight, weirdness, persona_id, vocal gender, negative tags)
- Webhook callbacks

**Points faibles :**
- Qualite variable selon version
- V5 meilleure mais pas de difference de prix specifiee

**Use cases :**
- Video & film production — soundtracks custom, musique de fond, scores pour projets multimedia
- Game development — soundtracks dynamiques, musique de niveau, audio ambiant, themes de personnages
- Podcast & content creation — intros, outros, transitions, musique de fond
- Advertising & marketing — jingles, musique publicitaire, audio promotionnel royalty-free
- App & product sound design — sons de notification, musique in-app, experiences audio
- Education & e-learning — musique de fond pour contenus educatifs et cours video

---

## Extend Music

**ID API :** `extend-music` | **Prix :** 20 cr/extension

**Description :** Prolonge une musique Suno existante depuis n'importe quel timestamp. Mode heritage (continue le style) ou custom (nouveaux parametres).

**Points forts :**
- Continuation coherente depuis un point precis (`continue_at` en secondes)
- Jusqu'a 8 min (V4.5+)
- Chainable
- Mode custom ou inherit

**Points faibles :**
- Necessite un `audio_id` Suno existant
- Pas pour audio externe (preferer Upload and Extend Audio)

**Use cases :**
- Video & film scoring — adapter la duree de cues musicaux aux besoins video
- Game music loops — boucles seamless pour gameplay continu
- Podcast & audio production — adapter intros/outros a la duree du contenu
- Music production workflows — developper des idees musicales avec variations
- Duration-specific content — adapter la musique aux durees exactes (pubs, presentations, social)
- Broadcast & streaming — versions allongees de jingles et elements audio de marque

---

## Upload and Cover Audio

**ID API :** `upload-and-cover-audio` | **Prix :** 20 cr/transformation

**Description :** Transforme un fichier audio uploade dans un style different tout en preservant la melodie. Cover IA, remix de style, changement de genre.

**Points forts :**
- Preservation de la melodie
- Controle `audio_weight` (0-1)
- Format MP3/WAV jusqu'a 2 min
- Vocal ou instrumental
- Modes custom et simple

**Points faibles :**
- Duree max 2 min en entree
- Resultat depend de la qualite de l'audio source

**Use cases :**
- AI music covers — covers IA dans differents genres (pop vers jazz, rock vers classique)
- Music remixing — remixes avec nouveaux styles, instrumentations et arrangements
- Content adaptation — adapter la musique a differents contextes (upbeat vers ambient, electronic vers orchestral)
- Genre experimentation — explorer comment les melodies sonnent dans differents contextes musicaux
- Game music variations — variations d'un theme pour differents niveaux/situations/humeurs
- Commercial music production — versions genre-appropriate pour pub, retail, promo a grande echelle

---

## Upload and Extend Audio

**ID API :** `upload-and-extend-audio` | **Prix :** 20 cr/extension

**Description :** Prolonge un fichier audio uploade (MP3/WAV, max 2 min) tout en preservant le style et la qualite. Extension depuis n'importe quel timestamp.

**Points forts :**
- Upload direct de fichiers audio (MP3/WAV)
- Extension depuis n'importe quel point (timestamp precis)
- Preservation de style automatique
- Toutes versions V3.5-V5
- Style weight configurable (0-1)

**Points faibles :**
- Duree max 2 min en entree
- Pas de chainbage comme Extend Music (necessite un audio_id)

**Use cases :**
- Music production — etendre tracks, boucles et compositions vers des versions plus longues
- Video & content creation — adapter la musique de fond a la duree video sans coupures
- Podcast production — adapter intros/outros/transitions a la structure de l'episode
- Game development — allonger audio ambiant et soundscapes sans repetition audible
- Broadcasting — versions custom-duration pour grilles de programmation
- Advertising & marketing — decliner jingles en versions 15s, 30s, 60s avec coherence de marque

---

## Add Instrumental

**ID API :** `add-instrumental` | **Prix :** 20 cr/generation

**Description :** Transforme des voix et melodies en compositions completes. Genere un accompagnement instrumental professionnel avec style tags personnalisables.

**Points forts :**
- Accompagnement intelligent qui complement l'audio en entree
- Style tags (genres, humeurs, instruments)
- Style weight ajustable (0-1)
- Negative tags pour exclure des elements
- V4.5PLUS et V5

**Points faibles :**
- Versions limitees (V4.5PLUS et V5 uniquement)
- Depend de la qualite de l'audio vocal source

**Use cases :**
- Vocal production — a cappella vers chanson complete avec backing tracks pro
- Music production — backing tracks pour demos, sketches, works-in-progress
- Podcast & content creation — habillage musical pour narrations et voix-off
- Video & film production — soundtracks completes depuis themes vocaux
- Education & learning — pistes d'accompagnement pour etudiants et exercices vocaux
- Creative experimentation — explorer differents styles musicaux sur des voix existantes

---

## Add Vocals

**ID API :** `add-vocals` | **Prix :** 20 cr/generation

**Description :** Ajoute des voix IA chantees a des instrumentaux. Lyrics custom, selection genre vocal (M/F), controle de style.

**Points forts :**
- Voix IA naturelles qui matchent melodie, rythme et humeur
- Lyrics custom ou prompt descriptif
- Selection genre vocal (M/F)
- Style weight configurable
- Multiples versions de modeles

**Points faibles :**
- Qualite vocale variable selon version
- Depend de la qualite de l'instrumental source

**Use cases :**
- Music production — ajouter des voix a des instrumentaux pour demos et backing tracks
- Video & film soundtracks — chansons completes depuis scores instrumentaux
- Game audio — pistes vocales pour soundtracks et themes de personnages
- Content creation — contenu vocal pour podcasts, YouTube, social media
- Advertising & marketing — jingles et pubs vocales depuis bases instrumentales
- Creative experimentation — explorer differents styles vocaux sur des instrumentaux existants

---

## Replace Section

**ID API :** `replace-section` | **Prix :** 10 cr/remplacement ($0.05)

**Description :** Remplace et edite des segments temporels specifiques dans des morceaux existants. Inpainting musical precis avec transitions seamless et remplacement coherent en style.

**Points forts :**
- Edition par timestamp avec precision au centieme de seconde (infill_start_s, infill_end_s)
- Inpainting IA qui analyse le contexte environnant
- Modification de lyrics via full_lyrics
- Style tags pour le segment remplace
- Transitions audio seamless (pas de clicks ni artefacts)

**Points faibles :**
- Necessite un audio_id Suno existant
- Le segment remplace depend du contexte environnant

**Use cases :**
- Correction chirurgicale — remplacer un couplet, corriger une section, ajuster des paroles
- Adaptation de contenu — modifier un segment pour adapter le message (pub, marque)
- Style blending — inserer un segment d'un style different dans un morceau
- Production iterative — affiner des sections specifiques sans regenerer l'ensemble

---

## Generate Music Cover

**ID API :** `generate-music-cover` | **Prix :** 1 cr/generation ($0.005)

**Description :** Genere des versions alternatives et covers de morceaux existants par task_id. Variations stylistiques automatiques preservant l'identite du morceau source.

**Points forts :**
- Tres economique (1 cr)
- Variations illimitees depuis un meme source
- Preserve l'identite fondamentale du morceau
- Webhook integration

**Points faibles :**
- Necessite un task_id existant (pas d'audio externe)
- Pas de controle fin sur le style des variations

**Use cases :**
- Content variation — multiples versions de musique de fond pour differents montages
- A/B testing music — tester differentes interpretations pour campagnes marketing
- Playlist diversity — variations d'un theme pour series de podcasts ou contenus
- Music libraries — librairies musicales diversifiees depuis des morceaux core
- Game audio variations — versions differentes pour niveaux, personnages, situations

---

## Get Timestamped Lyrics

**ID API :** `get-timestamped-lyrics` | **Prix :** 1 cr/requete ($0.005)

**Description :** Extrait les paroles avec timestamps de precision au mot, donnees de waveform et scores de precision d'alignement. Pour karaoke, visualisations musicales et affichage synchronise.

**Points forts :**
- Timestamps mot par mot (precision milliseconde)
- Waveform data pour visualisations audio-reactives
- Score de precision d'alignement (hoot_cer)
- Timing ligne par ligne structure
- Format JSON structure

**Points faibles :**
- Lecture seule (pas de modification)
- Precision depend de la clarte audio

**Use cases :**
- Karaoke applications — lyrics synchronises, scoring, highlighting temps reel
- Music streaming platforms — affichage lyrics mot par mot synchronise avec l'audio
- Audio visualizations — visualisations combinant waveform et lyrics
- Language learning apps — apprentissage linguistique via musique avec timing mot par mot
- Social music apps — partage de lyrics, challenges sing-along, karaoke collaboratif

---

## Boost Music Style

**ID API :** `boost-music-style` | **Prix :** 1 cr/enhancement ($0.005)

**Description :** Transforme des descriptions de style simples en prompts detailles et optimises pour une meilleure generation IA. "Pop, Mysterious" → description riche avec instrumentation, humeur, production.

**Points forts :**
- Tres economique (1 cr)
- Ameliore significativement les resultats de generation
- Multi-genre (classique, electronique, pop, jazz, etc.)
- Rapide

**Points faibles :**
- Utilitaire (pas de generation de musique)
- Resultat dependant de l'input

**Use cases :**
- Music generation optimization — ameliorer les resultats des outils IA avec descriptions enrichies
- Creative style exploration — decouvrir des caracteristiques musicales et nouvelles directions
- Content production workflows — streamliner la creation pour video, film, multimedia
- AI music tool integration — ameliorer les inputs pour Suno, Udio et autres plateformes

---

## Generate Persona

**ID API :** `generate-persona` | **Prix :** 1 cr/creation ($0.005)

**Description :** Cree des profils musicaux reutilisables depuis des morceaux existants. Extrait timbre, ton, pitch, texture vocale et style pour garantir la coherence entre generations futures.

**Points forts :**
- Extraction de profil vocal complet
- Reutilisable sur generations illimitees
- Nom et description custom
- Stockage permanent

**Points faibles :**
- Necessite un audio source de qualite
- Utilitaire (pas de generation directe)

**Use cases :**
- Coherence artiste — maintenir un style vocal identique sur une serie de morceaux
- Brand audio identity — profil sonore de marque reutilisable sur toutes les campagnes
- Multi-project consistency — meme identite vocale sur differents projets

---

## Generate Lyrics

**ID API :** `generate-lyrics` | **Prix :** 1 cr/generation ($0.005)

**Description :** Genere des paroles originales depuis un theme ou une description texte (max 200 chars). Verses, refrains, structure coherente.

**Points forts :**
- Tres economique (1 cr)
- Multiples styles et emotions
- Structure professionnelle (verses, chorus, formatting)
- Async avec webhook

**Points faibles :**
- Prompt max 200 caracteres
- Qualite variable selon la precision du prompt

**Use cases :**
- Songwriting assiste — inspiration creative, generation de bases pour lyrics
- Content creation — paroles pour jingles, pubs, contenus promotionnels
- Music production — lyrics rapides pour demos et maquettes

---

## Convert to WAV

**ID API :** `convert-to-wav` | **Prix :** 1 cr/conversion ($0.005)

**Description :** Export lossless en WAV depuis des morceaux generes sur PoYo. Qualite studio pour mastering, archivage et distribution.

**Points forts :**
- WAV lossless sans artefacts de compression
- Compatible tout logiciel audio pro (DAW, mastering suites)
- Archive-grade
- Async avec webhook

**Points faibles :**
- Uniquement pour morceaux generes sur PoYo (necessite task_id + audio_id)
- Fichiers plus volumineux que MP3

**Use cases :**
- Audio mastering & production — export pour mastering, mixing, post-production
- Film & video production — audio broadcast-quality pour soundtracks
- Music distribution — masters lossless pour services de distribution et stores
- Digital archiving — preservation qualite indefinie

---

## Vocal Remover

**ID API :** `vocal-remover` | **Prix :** 15 cr (simple) · 70 cr (multi-stem)

**Description :** Separe voix, instrumentaux et stems individuels depuis n'importe quel audio. Deux modes : separation basique voix/instrumental ou decomposition multi-stem avancee.

**Points forts :**
- Separation voix/instrumental (mode simple, 15 cr)
- Multi-stem : drums, bass, voix, autres (mode avance, 70 cr)
- Formats multiples (MP3, WAV, FLAC)
- Qualite pro avec artefacts minimaux

**Points faibles :**
- Mode multi-stem couteux (70 cr)
- Qualite depend de la source audio

**Use cases :**
- Music production & remixing — extraction de stems pour compositions creatives
- Karaoke creation — backing tracks instrumentaux depuis des chansons
- Podcast & content editing — isolation de la voix depuis musique de fond
- Music education & training — materiels pedagogiques avec instruments isoles
- Video & film post-production — sound design et mixing flexible
- Audio analysis & research — isolation de sources pour etudes detaillees

---

## AI Music Video

**ID API :** `create-music-video` | **Prix :** 4 cr/generation ($0.02)

**Description :** Transforme des fichiers audio en clips video musicaux avec synchronisation audio-visuelle automatique. Watermarks custom (auteur, domaine) pour attribution et branding.

**Points forts :**
- Synchronisation audio-visuelle automatique (rythme, tempo, dynamique)
- Watermarks custom (auteur + domaine)
- Integration Suno (task_id + audio_id)
- Tres economique (4 cr)

**Points faibles :**
- Pas de controle creatif fin sur les visuels
- Pas de narrative complexe (preferer modeles video)

**Use cases :**
- Promotion musicale — clips video pour promotion de morceaux sur plateformes
- Social media content — contenu video musical pour feeds et stories
- Visual storytelling — pieces audio-visuelles completes depuis un seul input audio
