# Modeles chat/LLM — Guide de selection

## Tableau decisionnel

| Cas d'usage | Modele recommande | Prix min | Quand l'utiliser | Quand NE PAS l'utiliser |
|---|---|---|---|---|
| Raisonnement expert, analyse complexe, recherche approfondie | GPT-5.4 Thinking | ~$1.75/1M input | GPQA Diamond 92.8% (#1), GDPval 83%, OSWorld 75%, multi-step planning, agentic web search | Budget serre, taches simples |
| Traitement haute performance, large-scale data, temps reel | GPT-5.4 Pro | ~$1.75/1M input | Maximum speed + compute, large-scale data processing, real-time decision-making | Taches de raisonnement profond (preferer Thinking), budget serre |
| Coding specialise, debugging, refactoring, tests auto | OpenAI Codex (GPT-5.3) | ~$1.75/1M input | SWE-Bench Pro SOTA, reasoning levels (low/medium/high/xhigh), agentic coding autonome, multi-language | Taches non-coding, raisonnement general (preferer GPT-5.4) |
| Coding agentique, prototypage rapide, agents AI | Gemini 3 Flash | $0.4/1M input | 3x plus rapide que 2.5 Pro, fenetre 1M tokens, SWE-bench 78%, outils integres (Google Search, Code Execution, File Search, URL Context) | Raisonnement tres profond (preferer Pro), taches PhD-level |
| Analyse de gros fichiers, contexte massif | Gemini 3 Flash | $0.4/1M input | Fenetre 1M tokens (la plus grande), multimodal complet (texte/image/audio/video/PDF), economique | Besoin de raisonnement frontier, taches critiques necessitant la meilleure precision |
| Raisonnement complexe, recherche, PhD-level tasks | Gemini 3 Pro | $0.8/1M input | #1 LMArena (1501 Elo), GPQA Diamond 91.9%, MoE 1T+ parametres, Humanity's Last Exam 37.5% | Budget serre (5x plus cher que Flash), taches simples |
| Coding complexe, agents autonomes, computer use, agentic search | Claude Opus 4.6 | ~$5/1M input | Fenetre 1M tokens (beta), 128K output, adaptive thinking, agentic search 84%, computer use 72.7%, graduate reasoning 91.3% | Budget serre, taches simples |
| Usage quotidien equilibre, coding general, computer use | Claude Sonnet 4.6 | ~$3/1M input | Fenetre 1M tokens (beta), computer use, context compaction, equilibre vitesse/intelligence, agentic planning | Besoin du meilleur coding (preferer Opus), taches a haute frequence (preferer Haiku) |
| Taches rapides, haute frequence, cout minimal | Claude Haiku 4.5 | $0.8/1M input | Le plus rapide et economique de la serie Claude, taches simples a haute frequence | Raisonnement complexe, coding avance, computer use |

## Raccourcis decisionnels

- **Le moins cher** → Gemini 3 Flash ($0.4/1M input) ou Claude Haiku 4.5 ($0.8/1M input)
- **Le plus rapide** → Gemini 3 Flash (3x plus rapide que 2.5 Pro)
- **Le plus polyvalent** → Claude Sonnet 4.6 (equilibre cout/qualite/vitesse, 1M context, computer use) ou GPT-5.4 Pro
- **La meilleure qualite** → GPT-5.4 Thinking (GPQA 92.8%) ou Gemini 3 Pro (#1 LMArena)
- **Le meilleur pour le coding** → OpenAI Codex GPT-5.3 (SWE-Bench Pro SOTA) ou Claude Opus 4.6 (agentic terminal coding 65.4%)
- **La plus grande fenetre contexte** → Gemini 3 Flash/Pro (1M tokens) ou Claude Opus/Sonnet 4.6 (1M tokens beta)
- **Computer Use (browser/desktop)** → Claude Opus 4.6 (72.7%) ou Claude Sonnet 4.6 (maintenant disponible) — GPT-5.4 a OSWorld 75% via API
- **Le meilleur raisonnement** → GPT-5.4 Thinking (GPQA 92.8%) puis Gemini 3 Pro (GPQA 91.9%) puis Claude Opus 4.6 (91.3%)
- **Agents autonomes** → Claude Opus 4.6 (agentic search 84%, adaptive thinking) ou OpenAI Codex (agentic coding, long-running workflows)
- **Vision / multimodal** → Claude Opus 4.6 (meilleure vision) ou Gemini 3 Flash/Pro (video + audio + PDF natif)
- **Coding specialise / debugging** → OpenAI Codex (code gen, debugging, refactoring, test gen, multi-language)
- **Document automation / spreadsheets** → GPT-5.4 (high-accuracy data processing, document automation)
- **Le plus gros output** → Claude Opus 4.6 (128K output tokens)

## Par besoin produit

**Generer du copy marketing (emails, landing, taglines)**
→ Gemini 3 Flash ($0.4/1M in) — rapide et economique pour du batch, outils integres (Google Search pour tendances)
→ Claude Sonnet 4.6 (~$3/1M in) — meilleur suivi d'instructions nuancees, computer use pour verifier le rendu
→ GPT-5.4 Pro (~$1.75/1M in) — haute performance pour du batch large-scale avec instruction following avance

**Analyser des docs longues (specs, contrats, rapports)**
→ Gemini 3 Flash ($0.4/1M in) — fenetre 1M tokens, multimodal (PDF, images), le moins cher pour du contexte massif
→ Claude Opus 4.6 (~$5/1M in) — fenetre 1M tokens (beta), 128K output, adaptive thinking pour analyse approfondie
→ GPT-5.4 Thinking (~$1.75/1M in) — document understanding multimodal, analyse experte (GPQA 92.8%)

**Coding agent autonome / dev complexe**
→ OpenAI Codex GPT-5.3 (~$1.75/1M in) — SWE-Bench Pro SOTA, reasoning levels configurables, agentic coding autonome long-running
→ Claude Opus 4.6 (~$5/1M in) — agentic terminal coding 65.4%, adaptive thinking, 1M context pour gros codebases
→ Gemini 3 Flash ($0.4/1M in) — SWE-bench 78%, 10x moins cher, suffisant pour du coding standard

**Support client / FAQ bot (haute frequence)**
→ Claude Haiku 4.5 ($0.8/1M in) — le plus rapide et economique de la serie Claude
→ Gemini 3 Flash ($0.4/1M in) — encore moins cher, outils integres pour chercher dans la doc

**Traduction / localisation de produit**
→ Gemini 3 Flash ($0.4/1M in) — multimodal (traduit aussi images/PDF), fenetre 1M pour des gros fichiers de traduction
→ Claude Sonnet 4.6 (~$3/1M in) — meilleure nuance linguistique pour du contenu marketing, context compaction

**Review de code / PR review**
→ OpenAI Codex (~$1.75/1M in) — debugging, detection de failles logiques, risques runtime, refactoring intelligent
→ Claude Opus 4.6 (~$5/1M in) — meilleur code review sur gros codebases (1M context), adaptive thinking
→ Claude Sonnet 4.6 (~$3/1M in) — bon equilibre pour des reviews courantes, moins cher

**Brainstorm features / redaction de specs**
→ GPT-5.4 Thinking (~$1.75/1M in) — raisonnement expert (GPQA 92.8%), multi-step planning
→ Gemini 3 Pro ($0.8/1M in) — #1 LMArena (1501 Elo), ideal pour structurer des idees complexes
→ Claude Sonnet 4.6 (~$3/1M in) — adaptive thinking, bon pour alterner reflexion et redaction

**Agents AI / workflows agentiques**
→ Claude Opus 4.6 (~$5/1M in) — agentic search 84%, adaptive thinking, effort controls, computer use 72.7%, sustained long-horizon tasks
→ OpenAI Codex (~$1.75/1M in) — agentic coding autonome, long-running engineering tasks, reasoning levels
→ Gemini 3 Flash ($0.4/1M in) — outils integres (Google Search, Code Execution, Function Calling), 10x moins cher

**Business intelligence / analyse de marche**
→ GPT-5.4 Thinking (~$1.75/1M in) — agentic web search avec synthese multi-sources, document automation
→ Gemini 3 Pro ($0.8/1M in) — raisonnement frontier + Google Search pour donnees temps reel
→ Claude Opus 4.6 (~$5/1M in) — analyse predictive, compliance, 1M context pour rapports massifs

**Education / contenu pedagogique**
→ Gemini 3 Flash ($0.4/1M in) — multimodal complet (audio, video, images), apps d'apprentissage riches
→ GPT-5.4 Thinking (~$1.75/1M in) — raisonnement expert pour contenu PhD-level, analyse approfondie
→ Claude Opus 4.6 (~$5/1M in) — adaptive thinking pour explications etape par etape, 128K output pour contenu detaille

**Debugging / refactoring de code legacy**
→ OpenAI Codex GPT-5.3 (~$1.75/1M in) — detection de failles logiques et risques runtime, refactoring context-aware, modernisation de code legacy
→ Claude Opus 4.6 (~$5/1M in) — 1M context pour analyser des codebases entieres, debugging ameliore vs 4.5

**Generation de tests automatises**
→ OpenAI Codex (~$1.75/1M in) — generation de tests unitaires alignes sur la logique du projet, edge cases, multi-language
→ Claude Sonnet 4.6 (~$3/1M in) — bon equilibre pour des tests standards, computer use pour verifier les resultats

**Data processing / automation de documents**
→ GPT-5.4 Pro (~$1.75/1M in) — large-scale data processing, spreadsheet automation, high-accuracy
→ GPT-5.4 Thinking (~$1.75/1M in) — si l'analyse necessite un raisonnement profond sur les donnees
→ Gemini 3 Flash ($0.4/1M in) — multimodal (PDF, images, spreadsheets), fenetre 1M tokens, economique

**Automation d'interfaces (remplir formulaires, naviguer apps, scraping)**
→ Claude Opus 4.6 (~$5/1M in) — computer use 72.7%, navigation web, formulaires, spreadsheets
→ Claude Sonnet 4.6 (~$3/1M in) — computer use maintenant disponible (etait Opus-only en 4.5), moins cher
→ GPT-5.4 (~$1.75/1M in) — OSWorld 75% mais via API, pas de computer use natif

---

## GPT-5.4

**Fournisseur :** OpenAI | **ID API :** `gpt-5.4` (Thinking) / `gpt-5.4-pro` (Pro)

**Description :** Flagship OpenAI pour le raisonnement complexe, le coding et le knowledge work professionnel. Deux variantes : Thinking (raisonnement multi-step, analyse approfondie) et Pro (performance maximale, large-scale data, temps reel). Multimodal (texte + images), agentic web search avec synthese multi-sources.

**Points forts :**
- GPQA Diamond 92.8% (raisonnement expert, #1)
- GDPval 83% (knowledge work)
- OSWorld 75% (computer use)
- Coding avance et instruction following de production
- Multimodal document understanding (texte + images)
- Agentic web search avec synthese multi-sources
- Document & spreadsheet automation haute precision
- Optimise pour workflows agentiques multi-step et long-running

**Points faibles :**
- Prix eleve (~$1.75/1M input, ~$14/1M output — prix officiels estimes)
- Fenetre contexte non specifiee (probablement 128-200K)
- Pas de Computer Use natif comme Claude
- Pas d'outils integres comme Gemini (Google Search, Code Execution)

**Use cases :**
- Raisonnement expert et recherche — analyse approfondie, consulting, education, PhD-level tasks (Thinking)
- Large-scale data processing — traitement de donnees en temps reel, decision-making automatise (Pro)
- Document automation — traitement de documents et spreadsheets avec haute precision
- Agentic web search — recherches approfondies avec synthese de multiples sources
- Coding & instruction following — code de production et automatisation de taches complexes

**Tarifs :** ~$1.75/1M input · ~$14/1M output (prix officiels estimes)

**Variantes :**
- `gpt-5.4` (Thinking) — raisonnement complexe, multi-step planning, analyse approfondie
- `gpt-5.4-pro` (Pro) — performance maximale, large-scale data processing, temps reel

---

## OpenAI Codex

**Fournisseur :** OpenAI | **ID API :** `gpt-5.3-codex` (recommande) / `gpt-5.4-codex` / `gpt-5.2-codex` / `gpt-5.1-codex` / `gpt-5-codex`

**Description :** Modele specialise coding construit sur la serie GPT-5. Code generation, debugging, refactoring et test generation avec raisonnement configurable. GPT-5.3 Codex est la variante recommandee (25% plus rapide, SWE-Bench Pro SOTA, reasoning levels).

**Points forts :**
- SWE-Bench Pro SOTA (GPT-5.3)
- 25% plus rapide que les versions precedentes (GPT-5.3)
- Reasoning levels configurables (low/medium/high/xhigh)
- Code generation natural language → production-ready
- Debugging intelligent (failles logiques, risques runtime, problemes structurels)
- Refactoring context-aware (modernisation de code legacy, preservation de fonctionnalite)
- Generation de tests unitaires et edge-case scenarios
- Agentic coding autonome pour workflows long-running
- Multi-language engineering

**Points faibles :**
- Specialise coding — moins adapte pour le raisonnement general ou le content writing
- Prix similaire a GPT-5.4 pour un scope plus restreint
- Pas d'outils integres (Google Search, etc.)

**Use cases :**
- Rapid feature development — scaffolding de modules, connexion d'APIs, implementation de logique backend avec moins d'iterations
- Debugging and code refactoring — analyse de logique complexe, patches, modernisation de code legacy
- Long-running engineering tasks — workflows etendus necessitant un raisonnement profond pour restructuration de repositories
- Test generation and quality assurance — tests unitaires alignes sur la logique reelle du projet, edge cases

**Tarifs :** GPT-5.3/5.4 Codex : ~$1.75/1M input · ~$14/1M output | GPT-5/5.1 Codex : ~$1.25/1M input · ~$10/1M output (prix officiels estimes)

**Variantes :**
- `gpt-5.3-codex` — recommande : 25% plus rapide, SWE-Bench Pro SOTA, reasoning levels
- `gpt-5.4-codex` — top-tier, derniere generation
- `gpt-5.2-codex` — raisonnement profond, long-context
- `gpt-5.1-codex` — instruction adherence amelioree
- `gpt-5-codex` — stable, everyday development

---

## Gemini 3 Series

**Fournisseur :** Google | **ID API :** `gemini-3-flash-preview` ou `gemini-3-pro-preview`

**Description :** La serie Gemini 3 de Google : Flash (rapidite + coding) et Pro (raisonnement frontier, #1 LMArena). Fenetre contextuelle 1M tokens, raisonnement dynamique configurable, outils integres.

**Points forts :**
- Fenetre 1M tokens (la plus grande)
- Thinking levels configurables (minimal/low/medium/high)
- Outils integres (Google Search, Code Execution, File Search, URL Context)
- Multimodal complet (texte/image/audio/video/PDF)
- Pro #1 LMArena (1501 Elo), GPQA Diamond 91.9%, Humanity's Last Exam 37.5%
- Flash : SWE-bench 78%, 3x plus rapide
- Dual API : OpenAI SDK compatible + Gemini natif

**Points faibles :**
- Pro plus cher que Flash (5x)
- Output pricing eleve pour Pro
- Flash moins adapte aux taches de raisonnement tres profond

**Use cases :**
- Software development teams — code generation, review, refactoring avec SWE-bench 78% (Flash)
- Research & knowledge workers — raisonnement LMArena-leading + Google Search pour workflows de recherche (Pro)
- AI agent developers — agents sophistiques avec outils integres (Google Search, Code Execution, Function Calling)
- Enterprise & business intelligence — collections documentaires massives, filings reglementaires, rapports de marche avec fenetre 1M tokens
- Education & content creation — apps d'apprentissage multimodales riches (audio, video, images)

**Tarifs :** Flash : $0.4/1M input · $2.4/1M output | Pro : $0.8/1M input · $4.8/1M output

**Endpoints supportes :** `/v1/chat/completions` (compatible OpenAI SDK) et `/v1beta/models/{model}:generateContent` (Gemini natif)

**Variantes :**
- `gemini-3-flash-preview` — 3x plus rapide que 2.5 Pro, SWE-bench 78%, ideal coding/agents
- `gemini-3-pro-preview` — MoE 1T+ parametres, GPQA Diamond 91.9%, Humanity's Last Exam 37.5%, MathArena Apex 23.4%, raisonnement frontier

---

## Claude 4.6 Series

**Fournisseur :** Anthropic | **ID API :** `claude-opus-4-6` / `claude-sonnet-4-6`

**Description :** La serie Claude 4.6 d'Anthropic : Opus (coding frontier + agents autonomes + agentic search) et Sonnet (equilibre vitesse/qualite + computer use). Fenetre 1M tokens (beta), adaptive thinking avec effort controls, context compaction, 128K output (Opus).

**Points forts :**
- Fenetre 1M tokens (beta) — rattrape Gemini 3 sur le contexte
- Opus 128K output tokens (vs 64K en 4.5)
- Adaptive thinking avec effort controls (balance intelligence/latence/cout)
- Context compaction (haute precision de recall avec efficacite token)
- Computer Use sur Opus ET Sonnet (etait Opus-only en 4.5)
- Agentic search 84% (Opus)
- Agentic computer use 72.7% (Opus)
- Graduate-level reasoning 91.3% (Opus)
- Multidisciplinary reasoning 53% avec outils (Opus)
- Debugging et code review ameliores vs 4.5
- Dual API : OpenAI SDK compatible + Anthropic natif

**Points faibles :**
- Opus tres cher (~$5/1M input, ~$25/1M output)
- Fenetre 1M encore en beta
- Sonnet plus cher que Gemini Flash pour des performances similaires

**Benchmarks Opus 4.6 vs 4.5 :**

| Benchmark | Opus 4.6 | Opus 4.5 | Delta |
|---|---|---|---|
| Agentic terminal coding | 65.4% | 59.8% | +5.6 |
| Agentic computer use | 72.7% | 66.3% | +6.4 |
| Agentic search | 84.0% | 67.8% | +16.2 |
| Multidisciplinary reasoning (no tools) | 40.0% | 30.8% | +9.2 |
| Multidisciplinary reasoning (with tools) | 53.0% | 43.4% | +9.6 |
| Graduate-level reasoning | 91.3% | 87.0% | +4.3 |

**Use cases :**
- Coding assistants — debugging, code review, generation ameliores sur gros codebases (1M context)
- Agentic workflows — agents autonomes avec agentic search 84%, effort controls, computer use
- Research tools — raisonnement graduate-level 91.3%, analyse multi-step avec adaptive thinking
- Document analysis — docs massifs avec fenetre 1M, context compaction pour precision de recall
- Long-context reasoning — raisonnement etendu sur inputs denses avec 128K output
- Financial analysis — compliance, audit, analyse predictive sur documents volumineux
- Interface automation — computer use pour navigation web, formulaires, spreadsheets (Opus + Sonnet)

**Tarifs :** Opus : ~$5/1M input · ~$25/1M output | Sonnet : ~$3/1M input · ~$15/1M output (prix officiels estimes)

**Variantes :**
- `claude-opus-4-6` — 1M context (beta), 128K output, adaptive thinking, agentic search 84%, computer use 72.7%
- `claude-sonnet-4-6` — 1M context (beta), computer use, context compaction, equilibre vitesse/intelligence, agentic planning

---

## Claude Haiku 4.5

**Fournisseur :** Anthropic | **ID API :** `claude-haiku-4-5-20251001`

**Description :** Le modele le plus rapide et economique de la serie Claude. Ideal pour taches simples a haute frequence, support client, classification.

**Points forts :**
- Le plus rapide de la serie Claude
- Le moins cher ($0.8/1M input)
- 200K contexte, 64K output
- Suffisant pour taches simples et classification

**Points faibles :**
- Pas de raisonnement complexe
- Pas de coding avance
- Pas de computer use
- Fenetre plus petite que les modeles 4.6 (200K vs 1M)

**Use cases :**
- Support client / FAQ bots — reponses rapides et economiques a haute frequence
- Classification et routing — triage de tickets, categorisation de contenu
- Extraction d'information — extraction structuree depuis texte simple
- Pre-processing — filtrage et preparation avant envoi a un modele plus puissant

**Tarifs :** $0.8/1M input · $4/1M output
