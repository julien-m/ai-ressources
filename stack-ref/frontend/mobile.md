---
last_updated: 2026-03-17
confidence: high
category: frontend
type: mobile
---

# Mobile Apps

## React Native + Expo — Recommandation cross-platform

**Le choix par défaut si l'app est simple et ne nécessite pas d'accès hardware avancé.**

- iOS + Android depuis une seule codebase TypeScript/React
- Expo SDK : accès aux fonctionnalités courantes (camera, notifications push, localisation, contacts, filesystem) sans écrire de code natif
- `expo-router` — navigation file-based (comme Next.js)
- EAS (Expo Application Services) : build cloud, OTA updates, distribution
- Partage de logique et types avec ton app web Next.js
- Expo Go pour tester sans compiler (itération très rapide)

**Zone grise hardware** : Bluetooth basique, NFC simple, audio standard → géré par des libs Expo/RN communautaires. Tester au cas par cas.

**Limites** : dès que tu as besoin de Bluetooth BLE en profondeur, audio low-level, ARKit/ARCore, ou des APIs OS très récentes → natif obligatoire.

---

## Swift / SwiftUI — iOS natif

Pour les apps **iOS-only nécessitant une intégration hardware ou OS avancée**.

- Bluetooth BLE avancé (CoreBluetooth)
- Audio low-level (CoreAudio, AVFoundation)
- ARKit (réalité augmentée)
- HealthKit, HomeKit, CarPlay, WatchKit
- Live Activities, Dynamic Island
- Performance maximale, accès à toutes les APIs Apple
- Distribution App Store ou TestFlight

**Quand l'utiliser** : app IoT avec Bluetooth, app santé avec HealthKit, app AR, jeu avec Metal, tout ce qui nécessite des APIs Apple exclusives.

---

## Kotlin — Android natif

Pour les apps **Android-only nécessitant une intégration hardware ou OS avancée**.

- Bluetooth BLE avancé (Android Bluetooth API)
- Accès capteurs (acceleromètre, gyroscope, baromètre)
- Android-specific : widgets, notifications avancées, background services
- Google APIs : Maps SDK natif, ML Kit, Pay
- Jetpack Compose — UI déclaratif moderne (équivalent SwiftUI)
- Performance maximale sur Android

**Quand l'utiliser** : même cas que Swift mais pour Android. App IoT, app avec background services intensifs, deep Android integration.

---

## Arbre de décision

```
App mobile ?
├── Simple + cross-platform (iOS + Android)
│   └── Pas de hardware deep → React Native + Expo
└── Hardware avancé / intégration OS native
    ├── iOS uniquement → Swift / SwiftUI
    ├── Android uniquement → Kotlin / Jetpack Compose
    └── iOS + Android natifs → deux codebases séparées
        (pas d'autre choix propre pour du vrai natif cross-platform)
```

## Ce que "hardware avancé" veut dire

| Fonctionnalité | RN+Expo | Swift/Kotlin natif |
|---------------|---------|-------------------|
| Push notifications | ✅ | ✅ |
| Camera / photo | ✅ | ✅ |
| Localisation GPS | ✅ | ✅ |
| Bluetooth basique | ⚠️ lib tierce | ✅ |
| Bluetooth BLE avancé | ❌ | ✅ |
| Audio low-level | ❌ | ✅ |
| ARKit / ARCore | ❌ | ✅ |
| HealthKit / Health Connect | ⚠️ partiel | ✅ |
| Background services intensifs | ⚠️ limité | ✅ |
| Widgets OS | ❌ | ✅ |

## Combinaisons stack
- `Expo + Supabase SDK + Stripe` → app SaaS mobile standard
- `Expo + tRPC + Neon` → app full-stack TypeScript partagé web+mobile
- `Swift + Supabase` → app iOS native avec backend cloud
- `Kotlin + Firebase SDK` → app Android avec realtime et push
