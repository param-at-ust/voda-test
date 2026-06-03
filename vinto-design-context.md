# Design Context

---

## Brand Identity

Premium telecom / connectivity brand. The aesthetic communicates technological confidence through high-contrast darkness, a single saturated red accent, and editorial-scale typography. The visual register is: **dark-luxury tech editorial** — cinematic, bold, and minimal.

---

## Color Palette

| Role | Hex | Notes |
|---|---|---|
| Background — Deep | `#000000` / `#010101` | True black, used for primary canvas |
| Background — Surface | `#0E0E0E` / `#111111` | Near-black for sections and cards |
| Background — Elevated | `#1E1E1E` | Card surfaces, modal backgrounds |
| Brand Red — Primary | `#E60000` | Core accent, CTAs, highlights |
| Brand Red — Dark | `#DB0101` | Pressed/hover state, shadows |
| Brand Red — Glow | `#FF3F3F` | Luminous halos, radial glows |
| Brand Red — Soft | `#FF8D8D` | Subtle tints, light-on-dark accents |
| Text — Primary | `#FFFFFF` | All headline and body text |
| Text — Secondary | `#DFDFDF` | Supporting copy, captions |
| Text — Muted | `#666666` | Disabled states, tertiary labels |
| Text — Warm Gray | `#A29191` | Subtext with warm undertone |
| Status — Success | `#4CAF50` | Confirmation states only |

**Palette rule:** Red is the only non-neutral color. Never introduce blues, purples, or yellows — the brand owns red as its singular chromatic statement.

---

## Typography

### Typefaces

| Family | Role | Weights Used |
|---|---|---|
| **Urbanist** | Display & headline | Thin, Light, Regular, Medium, SemiBold |
| **Instrument Serif** | Decorative editorial accent | Regular |
| **Inter** | UI body & functional text | Regular, Medium, SemiBold, Bold |

**Urbanist** is the primary brand voice — geometric, wide, and clean. It carries all hero messages.

**Instrument Serif** appears at key emotional moments (e.g. AI greeting copy, feature callouts). It is high-personality and editorial — never used for UI labels or body paragraphs.

**Inter** handles all functional UI: labels, buttons, chat messages, navigation, and body copy inside app mockups.

### Type Scale

| Token | Size | Family | Weight | Usage |
|---|---|---|---|---|
| `display-xxl` | 322px | Urbanist | Light | Oversized hero phrase (e.g. "The Future") |
| `display-xl` | 240px | Urbanist | Light | Section hero phrase (e.g. "Go Beyond") |
| `display-l` | 112px | Urbanist | Light / Regular | Page-level headline (e.g. "Design Beyond") |
| `display-m` | 64px | Urbanist | Medium | Feature section label |
| `display-s` | 44px | Mixed | — | Sub-page headline |
| `heading-l` | 24px | Urbanist | SemiBold | Section heading |
| `body-l` | 18px | Urbanist | Regular | Long-form body copy |
| `ui-heading` | 16–17px | Inter | Bold / SemiBold | Card titles, UI section labels |
| `ui-body` | 14px | Inter | Regular / Medium | Chat messages, descriptions |
| `ui-label` | 11–12px | Inter | Medium | Tags, badges, small labels |
| `serif-accent` | Contextual | Instrument Serif | Regular | AI responses, decorative headers |

---

## Visual Language

### Backgrounds & Surfaces
- The canvas is deep black. Sections never use white or light backgrounds.
- Surface elevation is expressed through subtle lightening: `#000` → `#111` → `#1E1E1E`.
- Red radial gradients and glowing halos are the primary source of visual warmth and depth.

### The Ripple / Vortex Motif
A swirling red vortex (referenced internally as "Ripple wave / dark") is a signature graphic device. It appears as:
- A full-bleed abstract background element
- A glowing focal point around product imagery
- A motion-implied energy swirl behind UI components

This is the brand's visual metaphor for connectivity and signal.

### Glow & Luminosity
Red glows are applied extensively — soft radial halos behind phones, CTAs, and typographic elements. They should feel luminous, not flat. Layer red glow effects using: outer glow color `#E60000` at low opacity spread, on dark backgrounds.

### Photography / Product Imagery
- Subjects are photographed with dramatic, cinematic lighting — often backlit or against dark backgrounds.
- Phone mockups are rendered dark with red-accented UI.
- Photos blend into the dark canvas (edge-darkened, color-treated cool-to-red).

### Cards & App UI
- Card backgrounds: `#1E1E1E` with subtle borders or no border.
- Corner radius: Medium-large (consistent rounded feel).
- Red used sparingly as a highlight pill, icon accent, or active state.
- App UI is compact and dense with Inter at 11–16px.

---

## AI / Conversational UI Patterns

The brand prominently features an AI voice assistant. UI conventions:
- Greeting: Instrument Serif (e.g. *"How can I help you?"*)
- User messages: Inter Regular, neutral bubble
- AI responses: Inter Medium, white text
- Status chips: *"Listening…"*, *"Booked"* — Inter Regular small
- Confirmation cards: Red accent, icon + short label, Inter Medium

---

## Layout Principles

- **Full-width sections** — no gutters between sections; content bleeds edge-to-edge.
- **Hero typography dominates** — oversized Urbanist Light fills most of the vertical real estate at page top.
- **Split compositions** — text left or centered, phone mockup right or overlapping.
- **Generous vertical rhythm** — sections breathe; large whitespace (dark space) between content blocks.
- **Desktop grid**: 1440px wide canvas. No explicit column count surfaced, but content appears centered in a ~1200px content container.

---

## Do / Don't

| Do | Don't |
|---|---|
| Use Urbanist Light for display copy | Use heavy/bold weights for large headlines |
| Keep backgrounds near-black | Use white or light-mode backgrounds |
| Use `#E60000` as the sole accent color | Introduce additional accent hues |
| Apply red glows to create depth | Use flat red fills without luminosity |
| Use Instrument Serif for emotional moments | Use Instrument Serif for UI labels or navigation |
| Let typography carry the visual weight | Overcrowd layouts with many competing elements |
| Treat phone mockups as hero imagery | Use generic device frames without contextual UI |