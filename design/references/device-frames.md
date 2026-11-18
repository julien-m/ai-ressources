# Device Frames

Reference canvas dimensions and system overlays for Apple Watch, iPhone and web mockups. Use the canvas dimensions below for the matching preset. Before comparing with a capture, resolve the mapping between the mockup canvas, native layout points or CSS pixels, and image pixels.

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

The mockup omits a separate home-indicator overlay. Backgrounds can extend to the canvas edge. Keep text and controls within the target device’s bottom safe area.

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

## Screen frame border radius

Set the outer Screen Frame radius to `0` for raw screen and viewport comparisons on Watch, iPhone and web. This keeps the canvas rectangular. Apply a device mask to a separate presentation frame when required. Use the normal component radii for inner elements such as cards and the Dynamic Island.

## Content layout margins

Place app content in the **App Content Frame**. Use it as the last child of the Screen Frame, following the system overlay when present. On the web it is the only child. Nest sections, groups and components inside the content frame. Apply screen padding to this parent and section spacing to each owning layout.

| Target | Inline padding | Top padding | Bottom padding |
|---|---|---|---|
| iPhone | `base` (16) | `base` (16) | `base` (16) |
| Apple Watch | `base` (16) | `lg` (24) | `base` (16) |
| Web | Responsive layout tokens | Responsive layout tokens | Responsive layout tokens |

These values are mockup spacing defaults in the target layout’s logical units. Native safe areas are separate from design padding. Resolve the effective insets for the target and apply each system inset once, including any top space already occupied by the overlay. Backgrounds may extend edge to edge. Read [spacing rules](../tokens/spacing.md), [Apple safe-area guidance](../systems/apple-hig.md#safe-areas) and [web margin guidance](../systems/web-standards.md#margins--content-width) when adapting the layout. Consult [Apple’s layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout) for platform and device-specific constraints.

## Pencil structure rule

System overlays (Watch heure, iPhone status bar) MUST be the **first child frame** of the screen frame, integrated into the vertical layout flow. **Never use absolute positioning.** This conforms to the project rule `pencil-frames.md`.

The examples show design padding. Resolve the target’s native safe-area insets separately.

### Example — iPhone 17 Pro (402 × 874)

```
Screen Frame (402 × 874, layout=vertical, gap=0, alignItems=stretch, borderRadius=0)
├── status-bar Frame (height=59, layout=horizontal, justifyContent=space-between, alignItems=center, paddingX=29)
│   ├── Text "10:15" (left)
│   ├── Frame dynamic-island (width=125, height=37, borderRadius=full, fill=#000000)
│   └── Frame status-cluster (layout=horizontal, gap=5)  // cellular + wifi + battery
└── App Content Frame (width=fill_container, layout=vertical, paddingX=16, paddingTop=16, paddingBottom=16)
    └── … screen content …
```

### Example — Apple Watch 46mm (416 × 496)

```
Screen Frame (416 × 496, layout=vertical, gap=0, alignItems=stretch, borderRadius=0)
├── status-bar Frame (height=60, layout=horizontal, justifyContent=flex-end, paddingRight=30, paddingTop=30)
│   └── Text "08:52" (fontSize=42, color=#FFFFFF, weight=700)
└── App Content Frame (width=fill_container, layout=vertical, paddingX=16, paddingTop=24, paddingBottom=16)
    └── … screen content …
```

## Enforcement

For every generated mockup, the audit checklist MUST verify:

1. Frame dimensions match a canonical size from the tables above.
2. Watch screens contain `"08:52"` text at top-right per ratios.
3. iPhone screens (non-SE) contain a status-bar frame as first child with heure (left) + Dynamic Island (center) + status cluster (right).
4. iPhone screens omit a separate home-indicator overlay and keep controls inside the bottom safe area.
5. Web mockups have no browser chrome.
6. System overlays use layout-flow positioning, never absolute.
7. Outer Screen Frames for raw screen and viewport comparisons use `borderRadius = 0`.
8. The App Content Frame owns the content padding and follows the system overlay when present. Native insets are applied once and web padding adapts to the layout.
