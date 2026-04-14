---
extends: [react]
---
# Remotion Rules (Delta)

> These rules complement [`react.md`](react.md) and [`javascript.md`](javascript.md). Only Remotion-specific conventions are listed here.
## Project Structure
- Compositions defined in `src/Root.tsx` — entry point for all videos
- Each video scene in its own component: `src/scenes/Intro.tsx`, `src/scenes/Outro.tsx`
- Shared assets in `public/` — accessed via `staticFile()`
- Config in `remotion.config.ts`

## Compositions
```tsx
import { Composition } from 'remotion';

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: 'Hello' }}
  />
);
```

- Every composition must have explicit `durationInFrames`, `fps`, `width`, `height`
- Use `calculateMetadata` for dynamic duration based on props
- Composition `id` must be unique and URL-safe

## Animation Fundamentals
```tsx
import { useCurrentFrame, interpolate, spring } from 'remotion';

const MyScene = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = spring({ frame, fps: 30, config: { damping: 12 } });

  return <div style={{ opacity, transform: `scale(${scale})` }}>Hello</div>;
};
```

- Always use `extrapolateRight: 'clamp'` to prevent values going beyond target
- Use `spring()` for natural motion — configure `damping`, `mass`, `stiffness`
- Use `interpolate()` for linear/eased transitions between keyframes
- Prefer `Easing` functions from `remotion` for custom curves

## Sequencing
```tsx
import { Sequence, AbsoluteFill } from 'remotion';

const MyVideo = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90}>
      <Intro />
    </Sequence>
    <Sequence from={90} durationInFrames={120}>
      <MainContent />
    </Sequence>
    <Sequence from={210}>
      <Outro />
    </Sequence>
  </AbsoluteFill>
);
```

- Use `<Sequence>` for temporal composition — each resets `useCurrentFrame()` to 0
- `<AbsoluteFill>` for full-frame positioning
- Use `<Series>` for sequential scenes without manual `from` calculation

## Assets
- `staticFile('image.png')` for bundled assets — never relative paths
- `<Img>` from `remotion` instead of `<img>` — handles loading states
- `<Video>` and `<Audio>` from `remotion` — never native HTML elements
- `<OffthreadVideo>` for better performance with multiple videos
- Use `getVideoMetadata()` / `getAudioDurationInSeconds()` for dynamic duration

## Audio
- `<Audio volume={0.5} />` for constant volume
- Use callback for volume automation: `volume={(f) => interpolate(f, [0, 30], [0, 1])}`
- `startFrom` and `endAt` for trimming (in frames)
- `playbackRate` for speed changes

## Fonts
- Load via `@remotion/google-fonts` or `staticFile()` for local fonts
- Always `loadFont()` before using — fonts must be loaded at render time
- Use `fontFamily` from the loaded font object

## Rendering
```bash
npx remotion render MyVideo out/video.mp4   # render specific composition
npx remotion preview                         # local preview with controls
npx remotion lambda render                   # cloud rendering via AWS Lambda
```

- Use `--codec h264` for MP4, `--codec vp8` for WebM
- `--image-format png` for transparency support
- `--concurrency` to control parallel frame rendering

## Performance
- Avoid re-renders: memoize heavy calculations, use `useMemo` for complex interpolations
- Use `<OffthreadVideo>` instead of `<Video>` for multi-video compositions
- Precompute data outside components when possible
- Use `delayRender()` / `continueRender()` for async data loading

## Anti-Patterns
- No native `<img>`, `<video>`, `<audio>` — use Remotion equivalents
- No `setTimeout` / `setInterval` — use frame-based logic
- No CSS animations — use `interpolate()` and `spring()`
- No relative file paths — use `staticFile()`
- No `useEffect` for timing — derive everything from `useCurrentFrame()`
