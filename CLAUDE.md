# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
```

No test suite is configured.

## Architecture

This is a **React 19 + Vite** single-page app — a mobile-first marketing/demo page for "Vinto", an AI telecom product. It is configured as a PWA via `vite-plugin-pwa`.

**Component tree:**
```
App
├── BeamsBackground   — full-bleed animated canvas background (gyro/mouse parallax)
│   └── Beams         — WebGL/canvas beam renderer (volumetric light shafts)
├── HeroSection       — headline, subhead, brand mark
├── AIChatPlaceholder — decorative AI chat UI mockup
└── DomainPills       — scrolling pill tags (connectivity domains)
```

**`useGyro` hook** (`src/hooks/useGyro.js`) — drives the parallax tilt effect. On mobile it uses `DeviceOrientationEvent` (with iOS permission flow); on desktop it falls back to mouse position. Values are smoothed via `requestAnimationFrame` lerp and passed as `tiltX`/`tiltY` to `BeamsBackground`.

**Beams** (`src/components/Beams.jsx`) — the most complex component. Renders animated volumetric light shafts on a `<canvas>`. Key props: `beamWidth`, `beamHeight`, `beamNumber`, `lightColor` (`#E60000`), `speed`, `noiseIntensity`, `scale`, `rotation`. Positioning math has been through several rewrites — see recent commits before touching it.

**Styling:** Tailwind CSS v3 with custom tokens defined in `tailwind.config.js`. Brand palette is black/near-black backgrounds with `#E60000` as the only chromatic accent. Fonts: Urbanist (display), Instrument Serif (editorial accents), Inter (UI). Never introduce non-red accent colors.

**Design reference:** `vinto-design-context.md` and `vinto-product-context.md` contain the full brand spec and product narrative — read these before making visual changes.
