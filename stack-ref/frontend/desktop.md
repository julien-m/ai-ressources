---
last_updated: 2026-03-17
confidence: high
category: frontend
type: desktop
---

# Desktop Apps

## Tauri (Rust + WebView)

**Le meilleur choix pour distribuer une app desktop multiplateforme** quand on vient d'un stack web.

- Backend : Rust (léger, sécurisé, pas de runtime embarqué)
- Frontend : WebView — tu réutilises ton React/shadcn/DaisyUI habituel
- Binaire final : ~5–15 MB (vs ~150 MB Electron)
- macOS / Windows / Linux avec une seule codebase
- Accès système via les plugins Tauri (filesystem, notifications, tray, auto-update...)
- Tauri v2 (stable 2024) — mobile en beta (iOS/Android)

**Quand l'utiliser** : app desktop qui réutilise ton UI web, distribution multiplateforme, binaire léger important (distribution, install rapide).

**Limite** : Rust côté backend — courbe d'apprentissage si besoin de logique custom. Pour des plugins système avancés, il faut écrire du Rust.

---

## SwiftUI (macOS natif)

Pour les apps **macOS-only** qui doivent se sentir vraiment natives.

- Intégration OS maximale : menubar, Spotlight, iCloud, Shortcuts, widgets
- Apple Silicon optimisé nativement
- Live Activities, notifications natives, Handoff, Universal Clipboard
- Distributable via App Store ou direct (notarization)

**Quand l'utiliser** : outil de productivité quotidien mac-only, accès à des APIs Apple exclusives, app qui doit ressembler à une vraie app macOS.

**Limite** : macOS/iOS uniquement. Pas de Windows/Linux.

---

## Wails (Go + WebView)

Même concept que Tauri mais le backend est en **Go**.

- Pertinent si tu as déjà du code Go à partager (CLI, API)
- Frontend WebView identique à Tauri
- Moins mature que Tauri, écosystème plus petit
- Binaire final léger (~8–20 MB)

**Quand l'utiliser** : projet où Go est déjà utilisé côté serveur et que tu veux partager de la logique.

---

## ❌ Electron

À éviter aujourd'hui sauf contrainte forte (équipe existante, plugin spécifique).

- Binaire ~150 MB minimum
- Mémoire importante (Chromium embarqué)
- Tauri est supérieur sur tous les critères pour un nouveau projet

---

## Arbre de décision

```
App desktop ?
├── Multiplateforme (macOS + Windows + Linux)
│   ├── Backend simple / UI web réutilisée → Tauri
│   └── Backend Go existant → Wails
└── macOS uniquement
    ├── Intégration OS native maximale → SwiftUI
    └── UI web réutilisée → Tauri (macOS only build)
```

## Combinaisons stack
- `Tauri + React + shadcn + Rust backend` → app desktop multiplateforme
- `Tauri + React + DaisyUI` → outil interne léger
- `SwiftUI + Supabase SDK` → app macOS native avec backend cloud
- `Wails + Go + React` → app desktop partageant logique avec un serveur Go
