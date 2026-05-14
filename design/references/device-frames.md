# Device Frames

Canonical frame dimensions and mandatory system overlays for mockups (Watch, iPhone, Web). Used by `/mockup-factory` and any Pencil-based mockup generation. All sizes are **logical points** (what the simulator reports), not pixel exports.

> **Ratio base convention.** Watch overlay ratios are relative to **frame height**. iPhone overlay ratios use the basis explicitly stated per column (× frame width or × frame height). Resolve every ratio against its declared basis — do not assume.

## Apple Watch

### Canonical sizes

| Modèle | Frame |
|---|---|
| Series 10 / Ultra 2 — **46mm (DEFAULT)** | **416 × 496** |
| Ultra / Ultra 2 — 49mm | 410 × 502 |
| SE — 44mm | 368 × 448 |
| Series 10 — 42mm | 374 × 446 |

### System overlay — heure (top-right)

Every Watch screen MUST display the simulator clock. Rendered as a system overlay (first child of the screen frame, see `Pencil structure rule` below).

| Property | Value |
|---|---|
| Text | `"08:52"` |
| Color | `#FFFFFF` |
| Font | Inter (SF Pro proxy), weight 700 |
| fontSize ratio (× frame height) | `0.085` |
| marginRight ratio (× frame width) | `0.072` |
| marginTop ratio (× frame height) | `0.060` |
| Anchor | top-right, text-align right |

Resolved example on 416×496 frame: fontSize ≈ 42, marginRight ≈ 30, marginTop ≈ 30.

## iPhone

### Canonical sizes

| Modèle | Frame | Status bar height |
|---|---|---|
| 17 Pro Max / 16 Pro Max | 440 × 956 | 59 |
| **17 Pro / 16 Pro (DEFAULT)** | **402 × 874** | 59 |
| 17 / 16 | 393 × 852 | 54 |
| SE (3) — legacy, no Dynamic Island | 375 × 667 | 20 |

### System overlay — status bar

Every iPhone screen (except SE legacy) MUST include a status bar as the first child frame of the screen. Layout horizontal, justify-content space-between, paddingX from canonical ratios, height = status-bar height from table above. Three children:

**Heure** (left)

| Property | Value |
|---|---|
| Text | `"10:15"` |
| Color | `#FFFFFF` |
| Font | SF Pro Semibold (Inter Semibold as proxy) |
| fontSize ratio (× frame width) | `0.020` (~17pt @ 402 wide) |
| marginLeft ratio (× frame width) | `0.072` |
| marginTop ratio (× frame height) | `0.022` |

**Dynamic Island** (center)

| Property | Value |
|---|---|
| Color | `#000000` |
| Width ratio (× frame width) | `0.310` |
| Height ratio (× frame height) | `0.042` |
| marginTop ratio (× frame height) | `0.013` |
| Border radius | full (pill) |

**Status cluster** (right) — cellular dots + wifi + battery icons, horizontal gap ~5pt

| Property | Value |
|---|---|
| Color | `#FFFFFF` |
| Icon height ratio (× frame height) | `0.014` |
| marginRight ratio (× frame width) | `0.062` |
| marginTop ratio (× frame height) | `0.025` |

### Bottom

**No reserved space.** Content fills to the bottom edge of the frame — no home-indicator zone is rendered or reserved.

### SE legacy

iPhone SE has no Dynamic Island. Status bar height 20pt, single heure centered or top-left (treat as legacy — document explicitly per screen).

## Web

Frame nue — **no browser chrome** is rendered. The mockup is the viewport interior only.

| Cible | Frame |
|---|---|
| **Desktop standard (DEFAULT)** | **1440 × 900** |
| Desktop large | 1920 × 1080 |
| Laptop | 1280 × 800 |
| Tablet portrait | 768 × 1024 |
| Mobile web | 390 × 844 |

## Pencil structure rule

System overlays (Watch heure, iPhone status bar) MUST be the **first child frame** of the screen frame, integrated into the vertical layout flow. **Never use absolute positioning.** This conforms to the project rule `pencil-frames.md`.

### Example — iPhone 17 Pro (402 × 874)

```
Screen Frame (402 × 874, layout=vertical, gap=0, alignItems=stretch)
├── status-bar Frame (height=59, layout=horizontal, justifyContent=space-between, alignItems=center, paddingX=29)
│   ├── Text "10:15" (left)
│   ├── Frame dynamic-island (width=125, height=37, borderRadius=full, fill=#000000)
│   └── Frame status-cluster (layout=horizontal, gap=5)  // cellular + wifi + battery
└── App content Frame (width=fill_container, layout=vertical)
    └── … screen content …
```

### Example — Apple Watch 46mm (416 × 496)

```
Screen Frame (416 × 496, layout=vertical, gap=0, alignItems=stretch)
├── status-bar Frame (height=60, layout=horizontal, justifyContent=flex-end, paddingRight=30, paddingTop=30)
│   └── Text "08:52" (fontSize=42, color=#FFFFFF, weight=700)
└── App content Frame (width=fill_container, layout=vertical)
    └── … screen content …
```

## Enforcement

For every generated mockup, the audit checklist MUST verify:

1. Frame dimensions match a canonical size from the tables above.
2. Watch screens contain `"08:52"` text at top-right per ratios.
3. iPhone screens (non-SE) contain a status-bar frame as first child with heure (left) + Dynamic Island (center) + status cluster (right).
4. iPhone screens have no reserved bottom zone.
5. Web mockups have no browser chrome.
6. System overlays use layout-flow positioning, never absolute.
