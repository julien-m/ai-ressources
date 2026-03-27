# Quick Reference — AI Model Selection

> Condensed decision guide for the most common questions. For full details, see [overview.md](overview.md) and individual type files.

```yaml
last_updated: 2026-03-27
source: overview.md, chat.md, image.md, video.md, music.md
```

---

## Chat / LLM

| Question | Answer |
|----------|--------|
| Cheapest? | Gemini 3 Flash ($0.4/1M in) |
| Fastest? | Gemini 3 Flash (3x faster than 2.5 Pro) |
| Best reasoning? | GPT-5.4 Thinking (GPQA 92.8%) |
| Best coding? | OpenAI Codex GPT-5.3 (SWE-Bench Pro SOTA) |
| Best agentic? | Claude Opus 4.6 (agentic search 84%) |
| Largest context? | Gemini 3 Flash/Pro or Claude 4.6 (1M tokens) |
| Largest output? | Claude Opus 4.6 (128K output) |
| Computer use? | Claude Opus 4.6 (72.7%) |
| High-frequency / budget? | Claude Haiku 4.5 ($0.8/1M in) |
| Best all-rounder? | Claude Sonnet 4.6 (cost/quality/speed balance) |

### When to pick what

```
Chat model?
├── Budget minimal, batch, outils integres → Gemini 3 Flash ($0.4)
├── Haute frequence, support client, classification → Claude Haiku 4.5 ($0.8)
├── Raisonnement frontier, recherche → GPT-5.4 Thinking ($1.75)
├── Coding specialise, debugging, tests → OpenAI Codex GPT-5.3 ($1.75)
├── Data processing, automation → GPT-5.4 Pro ($1.75)
├── Usage quotidien, coding general → Claude Sonnet 4.6 ($3)
└── Agents autonomes, computer use, gros codebases → Claude Opus 4.6 ($5)
```

---

## Image

| Question | Answer |
|----------|--------|
| Cheapest? | Z-Image or GPT Image 1.5 (2 cr) |
| Fastest? | Z-Image (< 1 second) |
| Best quality? | Seedream 4.5 (4K) or Nano Banana Pro |
| Best editing? | GPT Image 1.5 Edit (surgical) |
| Best multi-ref consistency? | FLUX.2 Flex (10 refs + hex) or Nano Banana Pro (14 refs) |
| Best text rendering? | GPT Image 1.5 or Nano Banana 2 (CJK) |
| Real-time trends? | Seedream 5.0 Lite (web search) |
| Best color control? | FLUX.2 Pro/Flex (hex matching) |
| Conversational refinement? | GPT-4o Image (128K context, iterative dialog) |
| Self-hostable? | Z-Image (6B params, Apache 2.0, < 16GB VRAM) |

### When to pick what

```
Image model?
├── Quick draft, banner, texture → Z-Image (2 cr, < 1s)
├── Precise edit, logo, UI mockup → GPT Image 1.5 (2 cr)
├── Conversational iteration, infographic → GPT-4o Image (4 cr)
├── E-commerce batch, 4K, multilingual → Nano Banana 2 (5 cr)
├── Trending content, web-aware → Seedream 5.0 Lite (5 cr)
├── Commercial photo, cinema, print → Seedream 4.5 (5 cr)
├── Brand assets, hex colors, typography → FLUX.2 Pro (6 cr)
├── Fun/viral, social media → Grok Imagine (6 cr)
├── Premium assets, multi-person coherence → Nano Banana Pro (8 cr)
└── Max precision, icon sets, brand consistency → FLUX.2 Flex (18 cr)
```

---

## Video

| Question | Answer |
|----------|--------|
| Cheapest? | Hailuo 02 Standard (3 cr/s) or Wan 2.2 Fast (6 cr) |
| Fastest? | Seedance 1.0 Pro (10x faster) |
| Best quality? | Runway Gen-4.5 (visual fidelity) or Hailuo 02 Pro (physics) |
| Best value? | Seedance 1.0 Pro (21 cr) or Sora 2 (14 cr) |
| With audio? | Sora 2, Kling 2.6, Kling 3.0, Seedance 1.5 Pro, Wan 2.5/2.6 |
| Multi-shots? | Kling 3.0, Seedance 1.0/1.5 Pro, Wan 2.6 |
| Lip-sync / dialogue? | Seedance 1.5 Pro (multilang) or Kling 2.6 (semantic sync) |
| Motion control? | Kling 2.6 MC (pro) or Kling 3.0 MC |
| Avatar from photo? | Wan Animate (7 cr) |
| Start + end frame? | Kling 2.1 Pro (55 cr) |

### When to pick what

```
Video model?
├── Prototype, test concept → Wan 2.2 Fast (6 cr)
├── Avatar from photo → Wan Animate (7 cr)
├── Dialogue, lip-sync multilangue → Seedance 1.5 Pro (9 cr)
├── Clip cinema + audio sync → Sora 2 (14 cr)
├── Multi-shots, best value → Seedance 1.0 Pro (21 cr)
├── Multi-shots + audio multilingue → Kling 3.0 (27 cr/s)
├── Commercial short + audio → Wan 2.5 (30 cr)
├── Expressive human motion → Hailuo 2.3 (35 cr)
├── Flexible start/end frame → Kling 2.5 Turbo Pro (42 cr)
├── Premium audio sync, flexible duration → Sora 2 Official (48 cr)
├── 1080p + audio natif + lip-sync → Kling 2.6 (65 cr)
├── Cinema premium, art direction → Runway Gen-4.5 (75 cr)
└── Multi-shots + audio + lip-sync all-in-one → Wan 2.6 (80 cr)
```

---

## Music (Suno-powered)

| Question | Answer |
|----------|--------|
| Create from scratch? | AI Music (20 cr) |
| Extend existing? | Extend Music (20 cr, Suno) or Upload & Extend (20 cr, file) |
| Change style/genre? | Upload and Cover Audio (20 cr) |
| Edit a section? | Replace Section (10 cr) |
| Add backing track? | Add Instrumental (20 cr) |
| Add vocals? | Add Vocals (20 cr) |
| Separate stems? | Vocal Remover (15 cr simple, 70 cr multi-stem) |
| Quick variations? | Generate Music Cover (1 cr) |
| Lyrics with timestamps? | Get Timestamped Lyrics (1 cr) |
| Music video? | AI Music Video (4 cr) |

### When to pick what

```
Music task?
├── Original track → AI Music (20 cr)
├── Make it longer (Suno track) → Extend Music (20 cr)
├── Make it longer (uploaded file) → Upload and Extend (20 cr)
├── Change genre/style → Upload and Cover (20 cr)
├── Add instruments to vocals → Add Instrumental (20 cr)
├── Add vocals to instrumental → Add Vocals (20 cr)
├── Fix a specific section → Replace Section (10 cr)
├── Extract stems → Vocal Remover (15-70 cr)
├── Auto music video → AI Music Video (4 cr)
├── Quick variations → Generate Music Cover (1 cr)
├── Optimize prompt → Boost Music Style (1 cr)
├── Reusable voice profile → Generate Persona (1 cr)
├── Write lyrics → Generate Lyrics (1 cr)
├── Karaoke/sync → Get Timestamped Lyrics (1 cr)
└── Lossless export → Convert to WAV (1 cr)
```

---

## Cross-Type Quick Picks

| Need | Model | Price |
|------|-------|-------|
| Cheapest AI content (any type) | Z-Image (image) | 2 cr |
| Cheapest video | Hailuo 02 Standard | 3 cr/s |
| Cheapest chat | Gemini 3 Flash | $0.4/1M in |
| Best bang for buck (video) | Seedance 1.0 Pro | 21 cr |
| Best bang for buck (chat) | Gemini 3 Flash | $0.4/1M in |
| Production-grade everything | Claude Opus 4.6 + Seedream 4.5 + Runway Gen-4.5 | Premium |
