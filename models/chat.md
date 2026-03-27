# Modeles chat/LLM — Guide de selection

## Tableau decisionnel

| Cas d'usage | Modele recommande | Prix min | Quand l'utiliser | Quand NE PAS l'utiliser |
|---|---|---|---|---|
| Coding agentique, prototypage rapide, agents AI | Gemini 3 Flash | $0.4/1M input | 3x plus rapide que 2.5 Pro, fenetre 1M tokens, SWE-bench 78%, outils integres | Raisonnement tres profond (preferer Pro), taches PhD-level |
| Analyse de gros fichiers, contexte massif | Gemini 3 Flash | $0.4/1M input | Fenetre 1M tokens (la plus grande), multimodal complet, economique | Besoin de raisonnement frontier, taches critiques necessitant la meilleure precision |
| Raisonnement complexe, recherche, PhD-level tasks | Gemini 3 Pro | $0.8/1M input | #1 LMArena (1501 Elo), GPQA Diamond 91.9%, MoE 1T+ parametres | Budget serre (5x plus cher que Flash), taches simples |
| Coding complexe, agents autonomes, computer use | Claude Opus 4.5 | $4/1M input | #1 SWE-bench (80.9%), Extended Thinking, Computer Use, meilleure vision | Budget serre, taches simples, besoin de fenetre > 200K tokens |
| Usage quotidien equilibre, coding general | Claude Sonnet 4.5 | $2.4/1M input | Equilibre vitesse/intelligence, Extended Thinking hybride | Besoin du meilleur coding (#1 = Opus), taches a haute frequence (preferer Haiku) |
| Taches rapides, haute frequence, cout minimal | Claude Haiku 4.5 | $0.8/1M input | Le plus rapide et economique de la serie Claude, taches simples a haute frequence | Raisonnement complexe, coding avance, computer use |

## Raccourcis decisionnels

- **Le moins cher** → Gemini 3 Flash ($0.4/1M input) ou Claude Haiku 4.5 ($0.8/1M input)
- **Le plus rapide** → Gemini 3 Flash (3x plus rapide que 2.5 Pro)
- **Le plus polyvalent** → Claude Sonnet 4.5 (equilibre cout/qualite/vitesse)
- **La meilleure qualite** → Gemini 3 Pro (#1 LMArena) ou Claude Opus 4.5 (#1 coding)
- **Le meilleur pour le coding** → Claude Opus 4.5 (SWE-bench 80.9%)
- **La plus grande fenetre contexte** → Gemini 3 Flash/Pro (1M tokens vs 200K pour Claude)
- **Computer Use (browser/desktop)** → Claude Opus 4.5 (seul a le proposer)

## Par besoin produit

**Generer du copy marketing (emails, landing, taglines)**
→ Gemini 3 Flash ($0.4/1M in) — rapide et economique pour du batch, outils integres (Google Search pour tendances)
→ Claude Sonnet 4.5 ($2.4/1M in) — meilleur suivi d'instructions nuancees pour du copy subtil

**Analyser des docs longues (specs, contrats, rapports)**
→ Gemini 3 Flash ($0.4/1M in) — fenetre 1M tokens, multimodal (PDF, images), le moins cher pour du contexte massif
→ Gemini 3 Pro ($0.8/1M in) — si l'analyse necessite un raisonnement profond (comparaison juridique, audit technique)

**Coding agent autonome / dev complexe**
→ Claude Opus 4.5 ($4/1M in) — #1 SWE-bench (80.9%), Extended Thinking, Computer Use
→ Gemini 3 Flash ($0.4/1M in) — SWE-bench 78%, 10x moins cher, suffisant pour du coding standard

**Support client / FAQ bot (haute frequence)**
→ Claude Haiku 4.5 ($0.8/1M in) — le plus rapide et economique de la serie Claude
→ Gemini 3 Flash ($0.4/1M in) — encore moins cher, outils integres pour chercher dans la doc

**Traduction / localisation de produit**
→ Gemini 3 Flash ($0.4/1M in) — multimodal (traduit aussi images/PDF), fenetre 1M pour des gros fichiers de traduction
→ Claude Sonnet 4.5 ($2.4/1M in) — meilleure nuance linguistique pour du contenu marketing

**Review de code / PR review**
→ Claude Opus 4.5 ($4/1M in) — meilleur coding, Extended Thinking pour analyser des diffs complexes
→ Claude Sonnet 4.5 ($2.4/1M in) — bon equilibre pour des reviews courantes, moins cher

**Brainstorm features / redaction de specs**
→ Gemini 3 Pro ($0.8/1M in) — #1 raisonnement (GPQA 91.9%), ideal pour structurer des idees complexes
→ Claude Sonnet 4.5 ($2.4/1M in) — Extended Thinking hybride, bon pour alterner reflexion et redaction

---

## Gemini 3 Series

**Fournisseur :** Google | **ID API :** `gemini-3-flash-preview` ou `gemini-3-pro-preview`

**Description :** La serie Gemini 3 de Google : Flash (rapidite + coding) et Pro (raisonnement frontier, #1 LMArena). Fenetre contextuelle 1M tokens, raisonnement dynamique configurable.

**Points forts :**
- Fenetre 1M tokens (la plus grande)
- Thinking levels configurables (minimal/low/medium/high)
- Outils integres (Google Search, Code Execution, File Search, URL Context)
- Multimodal complet (texte/image/audio/video/PDF)
- Pro #1 LMArena (1501 Elo)

**Points faibles :**
- Pro plus cher que Flash (5x)
- Output pricing eleve pour Pro
- Flash moins adapte aux taches de raisonnement tres profond

**Tarifs :** Flash : $0.4/1M input · $2.4/1M output | Pro : $0.8/1M input · $4.8/1M output

**Endpoints supportes :** `/v1/chat/completions` (compatible OpenAI SDK) et `/v1beta/models/{model}:generateContent` (Gemini natif)

**Variantes :**
- `gemini-3-flash-preview` — 3x plus rapide que 2.5 Pro, SWE-bench 78%, ideal coding/agents
- `gemini-3-pro-preview` — MoE 1T+ parametres, GPQA Diamond 91.9%, Humanity's Last Exam 37.5%, raisonnement frontier

---

## Claude 4.5 Series

**Fournisseur :** Anthropic | **ID API :** `claude-opus-4-5-20251101` / `claude-sonnet-4-5-20250929` / `claude-haiku-4-5-20251001`

**Description :** La serie Claude 4.5 d'Anthropic : Opus (coding frontier + agents), Sonnet (equilibre vitesse/qualite), Haiku (rapide et economique). Extended Thinking, 200K contexte, 64K output.

**Points forts :**
- SWE-bench 80.9% (Opus, #1 coding)
- Extended Thinking configurable
- Computer Use (navigation browser/desktop)
- Fenetre 200K, 64K output
- Vision best-in-class (Opus)

**Points faibles :**
- Opus tres cher ($4/1M input)
- Fenetre contexte plus petite que Gemini 3 (200K vs 1M)
- Computer Use reserve a Opus

**Tarifs :** Opus : $4/1M input · $20/1M output | Sonnet : $2.4/1M input · $12/1M output | Haiku : $0.8/1M input · $4/1M output

**Endpoints supportes :** `/v1/chat/completions` (compatible OpenAI SDK) et `/v1/messages` (API Anthropic native)

**Variantes :**
- `claude-opus-4-5-20251101` — #1 SWE-bench (80.9%), Extended Thinking, Computer Use, meilleure vision
- `claude-sonnet-4-5-20250929` — equilibre vitesse/intelligence, Extended Thinking hybride, usage general
- `claude-haiku-4-5-20251001` — le plus rapide et economique, taches simples a haute frequence
