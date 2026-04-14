# Cross-Platform Design

Unit mapping, navigation patterns, native behaviors, and platform-specific decisions.

## Unit Correspondence

|iOS|Android|Web|Physical size (at 1×)|
|---|-------|---|---------------------|
|1pt|1dp|1px|~0.16mm (160dpi)|
|44pt|48dp|48px|Minimum tap target|
|16pt|16dp|16px|Default body text|
- **pt and dp are functionally equivalent** — both abstract away screen density
- Web px at standard zoom ≈ 1dp ≈ 1pt
- Always design in logical units, never physical pixels
### Screen Density Reference
|Density|iOS|Android|Web|
|-------|---|-------|---|
|1×|@1x (legacy)|mdpi|96dpi|
|2×|@2x (Retina)|xhdpi|192dpi|
|3×|@3x (Super Retina)|xxhdpi|288dpi|

## Navigation Patterns

|Pattern|iOS|Android|Web|

|-------|---|-------|---|
|**Primary nav**|Tab bar (bottom, 5 max)|Bottom nav bar (3–5 items)|Top nav bar or sidebar|
|**Secondary nav**|Push navigation (back in nav bar)|Top app bar with back arrow|Breadcrumbs or sidebar sub-nav|
|**Search**|Search bar in nav / pull-down|Search bar in top app bar|Search in header or dedicated page|
|**Overflow actions**|Ellipsis menu / long press|Three-dot overflow menu|Dropdown menu or toolbar|
|**Settings**|Grouped table view|Single-column list|Settings page or sidebar section|
|**Contextual actions**|Swipe actions on rows|Long press → bottom sheet|Right-click context menu or inline buttons|

## Native vs Recreated Components

Use native components when platform behavior is expected. Recreate only when brand consistency demands it.
|Component|Recommendation|Reasoning|
|---------|--------------|---------|
|Navigation bar|**Native**|Users expect platform-specific back/gesture behavior|
|Tab bar / bottom nav|**Native**|System-managed safe areas, haptics, accessibility|
|Alerts / dialogs|**Native**|Users recognize platform alert patterns|
|Date/time pickers|**Native**|Complex gesture handling, accessibility built-in|
|Switches / toggles|**Native**|Platform-specific feel and haptics|
|Buttons|**Recreate OK**|Brand styling, consistent cross-platform|
|Cards|**Recreate OK**|Layout component, no native equivalent|
|Forms / inputs|**Hybrid**|Native keyboard handling, custom styling|
|Bottom sheets|**Native preferred**|iOS sheet detents, Android Material bottom sheet|
|Pull-to-refresh|**Native**|Physics feel must match platform expectations|

## Native Gestures to Respect
|Gesture|iOS|Android|Web|
|-------|---|-------|---|
|Back|Swipe from left edge|System back button/gesture|Browser back button|
|Dismiss modal|Swipe down|Swipe down / back gesture|Escape key / backdrop click|
|Pull to refresh|Pull down (native UIRefreshControl)|Pull down (SwipeRefreshLayout)|Custom (not native)|
|Long press|Preview / context menu|Selection / context menu|Right-click → context menu|
|Pinch to zoom|Maps, images (standard)|Maps, images (standard)|Maps, images (ctrl+scroll)|
|Swipe to delete|Swipe left on list row|Swipe left (less common)|Not expected|
- **Never override system gestures** — back swipe on iOS, back gesture on Android
- Custom gestures must not conflict with platform gestures

## Platform Behavioral Differences
|Behavior|iOS|Android|Web|
|--------|---|-------|---|
|**Back navigation**|Nav controller back, swipe-from-edge|System back (stack-based)|Browser history back|
|**Keyboard dismiss**|Scroll down, tap outside (varies)|System back button|Tab away, Escape|
|**Sharing**|UIActivityViewController (share sheet)|Intent system (share sheet)|Web Share API or copy-to-clipboard|
|**Notifications**|APNs, grouped by app|FCM, channels + importance levels|Web Push (requires permission)|
|**Deep links**|Universal Links|App Links|URL routing|
|**Haptics**|UIFeedbackGenerator (taptic engine)|VibrationEffect (varies by device)|Vibration API (limited)|
|**Status bar**|Light/dark content style|Light/dark, immersive mode|N/A (meta theme-color)|
|**Safe areas**|Dynamic Island, home indicator|Navigation bar, gesture bar|Viewport only (env() for PWA)|

## Decision Framework

When building cross-platform, decide per-component:
1. **Is there a strong platform convention?** → Use native
2. **Does the component carry brand identity?** → Recreate with platform adaptations
3. **Is the interaction gesture-heavy?** → Prefer native (physics, haptics)
4. **Is it purely visual layout?** → Safe to recreate (cards, grids, badges)
5. **Does accessibility depend on it?** → Prefer native (screen readers expect platform behavior)

## Cross-References
- Spacing values: [spacing.md](spacing.md)
- Typography mapping: [typography.md](typography.md)
- Color system mapping: [colors.md](colors.md)
- iOS specifics: [../systems/apple-hig.md](../systems/apple-hig.md)
- Android specifics: [../systems/material-design.md](../systems/material-design.md)
- Web specifics: [../systems/web-standards.md](../systems/web-standards.md)
