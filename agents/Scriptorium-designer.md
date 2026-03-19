# SCRIPTORIUM-DESIGNER — Master Design Agent
> CittaFracta — The complete Scriptorium mode implementation
> Inspired by: Pentiment × Marauder's Map × 13th century Florentine manuscripts
> This is the single source of truth for all visual design in the app.

---

## The Vision

When a user opens CittaFracta, they see a Florentine manuscript coming to life.
The background is animal-skin vellum. The title writes itself in iron gall ink.
Faction lines rule themselves across the page. Family names appear one by one,
as if an invisible scribe is writing them right now.

This is Scriptorium mode — the default. It is the experience.
Modern mode is just an escape hatch for people who want clean and fast.

---

## BEFORE YOU START — Read All of These

```
CLAUDE.md
themes/florentine-clean.md
themes/florentine-historical.md
hooks/useHistoricalMode.ts
App.tsx
index.css
index.html
components/layout/Header.tsx
components/layout/FolioHeader.tsx
components/layout/TabNavigation.tsx
components/layout/CodexDock.tsx
features/social-map/views/SocialMapView.tsx
features/social-map/HistoricalMap.tsx
components/panels/FamilyDetailsPanel.tsx
features/chronicle/components/ChronicleModal.tsx
features/geo-map/views/CityMapView.tsx
package.json
```

Then run:
```bash
npm run build
```
Confirm 0 errors before touching anything.

---

## Step 0 — Install Anime.js

```bash
npm install animejs
npm install --save-dev @types/animejs
```

Verify it appears in package.json dependencies, then:
```bash
npm run build
```
Must still show 0 errors.

---

## Step 1 — Scriptorium is the Default Mode

**File: `hooks/useHistoricalMode.ts`**

Currently the hook defaults to `false` (Modern mode).
Change the default to `true` (Scriptorium mode).

```ts
// Find this line (or equivalent):
const [isHistoricalMode, setIsHistoricalMode] = useState(false);

// Change to:
const [isHistoricalMode, setIsHistoricalMode] = useState(true);

// Also update localStorage read — if no value stored yet, default to true:
const stored = localStorage.getItem('historicalMode');
const initial = stored === null ? true : stored === 'true';
const [isHistoricalMode, setIsHistoricalMode] = useState(initial);
```

**File: `App.tsx`**

The root div currently toggles `historical-mode` class.
Confirm it looks like this (or equivalent):
```tsx
<div className={isHistoricalMode ? 'historical-mode h-screen ...' : 'h-screen ...'}>
```

**File: `components/layout/Header.tsx`** (desktop)

Find the mode toggle button. It should now read:
- When IN Scriptorium mode: button says `◈ MODERN` — pressing it switches to Modern
- When IN Modern mode: button says `§ SCRIPTORIUM` — pressing it switches back

```tsx
<button onClick={toggleHistoricalMode} ...>
  {isHistoricalMode ? '◈  MODERN' : '§  SCRIPTORIUM'}
</button>
```

**File: `components/layout/FolioHeader.tsx`** (mobile)

Same logic — the § button now shows active state when in Scriptorium,
and tapping it switches to Modern. Tapping again returns to Scriptorium.

Build check: `npm run build` → 0 errors.

---

## Step 2 — App Title: CITTA·FRACTA

The app title must change from "CITTAFRACTA" or "FLORENTINE FACTIONS" to
`CITTA·FRACTA` using the medieval Latin interpunct (middle dot · U+00B7).

**File: `components/layout/Header.tsx`**

Find the title text and change it:
```tsx
// Change from:
CITTAFRACTA  // or whatever it currently says

// Change to:
CITTA·FRACTA
```

Also update the subtitle. Currently "Historical Analysis (1215-1450)".
Change to italic Crimson Pro: *Analisi Storica delle Fazioni Fiorentine*

**File: `index.html`**

Update the `<title>` tag:
```html
<title>CITTA·FRACTA — Analisi Storica</title>
```

Build check: `npm run build` → 0 errors.

---

## Step 3 — The Florentine Pigment Palette

**File: `index.css`**

Add to `:root` (these are always available, both modes):

```css
:root {
  /* Florentine manuscript pigments */
  --vellum:           #EFE5C0;
  --vellum-aged:      #E4D5A0;
  --vellum-shadow:    #C9B882;
  --iron-gall:        #2A1A0A;
  --iron-gall-faded:  #5C3A20;
  --iron-gall-sepia:  #8B6040;
  --vermillion:       #B83A2A;
  --vermillion-light: #D04030;
  --ultramarine:      #1F3A7A;
  --ultramarine-mid:  #2E52A8;
  --verdigris:        #3D7A5A;
  --verdigris-light:  #5A9E78;
  --gold-leaf:        #C9A840;
  --gold-leaf-bright: #E8C850;
  --ochre:            #B8860B;
  --lead-white:       #EDE8DC;
}
```

---

## Step 4 — The Vellum Background

**File: `index.css`**

This is the most important visual change.
Replace ALL existing background on `.historical-mode` with the vellum SVG texture.

```css
.historical-mode {
  /* The vellum skin — everything else sits on top of this */
  background-color: var(--vellum);
  background-image: url('/CittaFracta/assets/textures/vellum.svg');
  background-repeat: repeat;
  background-size: 300px 300px;

  /* Remove the old repeating-linear-gradient ruling lines completely */
  /* The texture IS the texture — no fake ruled lines */
}
```

Also apply to the main content area and any panels that have their own background:

```css
.historical-mode main,
.historical-mode .bg-parchment {
  background-color: transparent;
  /* Let the root vellum texture show through */
}
```

**IMPORTANT:** Find and DELETE this block if it exists anywhere in index.css:
```css
/* DELETE THIS — the striped lines */
background-image: repeating-linear-gradient(
  transparent,
  transparent 27px,
  rgba(44, 26, 14, 0.04) 27px,
  rgba(44, 26, 14, 0.04) 28px
);
```

Build check: `npm run build` → 0 errors.

---

## Step 5 — Scriptorium Typography & Colour Overrides

**File: `index.css`** — inside `.historical-mode { }`

```css
.historical-mode {
  /* Colour overrides */
  --parchment:        var(--vellum);
  --parchment-mid:    var(--vellum-aged);
  --parchment-deep:   var(--vellum-shadow);
  --ink:              var(--iron-gall);
  --ink-faded:        var(--iron-gall-faded);
  --rubric:           var(--vermillion);
  --earth-orange:     var(--gold-leaf);

  /* Typography */
  font-family: 'Crimson Pro', 'IM Fell English', Georgia, serif;
}

/* Headings always IM Fell English in Scriptorium */
.historical-mode h1,
.historical-mode h2,
.historical-mode .font-display {
  font-family: 'IM Fell English', Georgia, serif;
  font-style: italic;
}

/* Remove ALL text-shadow everywhere in Scriptorium mode */
/* (Fixes the glow bug on GHIBELLINES / GUELFS headers) */
.historical-mode * {
  text-shadow: none !important;
}

/* Borders become iron-gall ink lines */
.historical-mode [class*="border-"] {
  border-color: rgba(42, 26, 10, 0.20) !important;
}

/* No rounded corners — manuscripts have none */
.historical-mode * {
  border-radius: 0 !important;
}

/* Gold text selection */
.historical-mode ::selection {
  background: var(--gold-leaf);
  color: var(--iron-gall);
}

/* Scrollbar — iron gall */
.historical-mode ::-webkit-scrollbar { width: 6px; }
.historical-mode ::-webkit-scrollbar-track { background: var(--vellum-aged); }
.historical-mode ::-webkit-scrollbar-thumb { background: var(--iron-gall-faded); border-radius: 0; }
```

---

## Step 6 — Bug Fixes (Three Specific Issues)

### Fix A — Remove the corner square in Header

**File: `components/layout/Header.tsx`**

Find the root element. Look for any child `<div>` or element that:
- Has class `hidden sm:block` with only padding (no real content)
- Sits as the first child before the title
- Renders as a coloured box in certain screen widths

Delete it. If it was providing spacing, replace with `pt-2` on the header itself.

### Fix B — Remove glow on column headers

Already handled by `text-shadow: none !important` in Step 5.
But also go to `features/social-map/HistoricalMap.tsx` and find
the column header elements (GHIBELLINES, GUELFS). Remove any
`drop-shadow`, `shadow`, or explicit `textShadow` style prop if present.

### Fix C — COA images always visible

**File: `features/social-map/HistoricalMap.tsx`**

The family cells need `grid grid-cols-2 w-full` on their container
so both columns always get exactly 50% width, even when empty.

Each family cell:
```tsx
className="w-full min-h-[52px] flex items-center gap-2 px-2 border border-parchment-deep/40"
style={{ touchAction: 'manipulation' }}
```

The COA image:
```tsx
<img
  src={normalizeAssetPath(family.imageUrl)}
  className="w-7 h-7 object-contain shrink-0 block"
  alt={family.name}
  onError={(e) => { e.currentTarget.style.display = 'none'; }}
/>
```

`block` ensures it never collapses to zero-width.
`onError` hides it gracefully if the file is missing.

Build check: `npm run build` → 0 errors.

---

## Step 7 — The Marauder's Map Reveal Animation

This is the centrepiece. When Scriptorium mode activates (on first load,
or when switching from Modern → Scriptorium), the page reveals itself
like the Marauder's Map — ink appearing on vellum.

**New file: `hooks/useScriptoriumReveal.ts`**

```ts
import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface UseScriptoriumRevealOptions {
  isHistoricalMode: boolean;
  isReady: boolean; // data has loaded, DOM is ready
}

export function useScriptoriumReveal({ isHistoricalMode, isReady }: UseScriptoriumRevealOptions) {
  const hasRevealed = useRef(false);

  useEffect(() => {
    if (!isHistoricalMode || !isReady || hasRevealed.current) return;

    hasRevealed.current = true;

    // Everything starts invisible
    const elements = {
      title:        document.querySelector('.scriptorium-title'),
      subtitle:     document.querySelector('.scriptorium-subtitle'),
      headerLine:   document.querySelector('.scriptorium-header-line'),
      factionCols:  document.querySelectorAll('.scriptorium-faction-col'),
      classLabels:  document.querySelectorAll('.scriptorium-class-label'),
      familyCells:  document.querySelectorAll('.scriptorium-family-cell'),
      yearNumber:   document.querySelector('.scriptorium-year'),
      timeline:     document.querySelector('.scriptorium-timeline'),
    };

    // Set all to invisible immediately
    anime.set('.scriptorium-title, .scriptorium-subtitle, .scriptorium-header-line, .scriptorium-faction-col, .scriptorium-class-label, .scriptorium-family-cell, .scriptorium-year, .scriptorium-timeline', {
      opacity: 0
    });

    // The reveal sequence — total ~3.5 seconds
    const timeline = anime.timeline({ easing: 'easeOutExpo' });

    // 0.0s — Title fades in with slight downward drift (ink settling)
    timeline.add({
      targets: '.scriptorium-title',
      opacity: [0, 1],
      translateY: [-4, 0],
      duration: 800,
      delay: 200,
    });

    // 0.8s — Subtitle appears
    timeline.add({
      targets: '.scriptorium-subtitle',
      opacity: [0, 1],
      duration: 500,
    }, '-=200');

    // 1.0s — Header ruling line draws itself left to right
    timeline.add({
      targets: '.scriptorium-header-line',
      opacity: [0, 1],
      scaleX: [0, 1],
      transformOrigin: 'left center',
      duration: 600,
    }, '-=100');

    // 1.4s — Faction column headers appear (GHIBELLINES then GUELFS)
    timeline.add({
      targets: '.scriptorium-faction-col',
      opacity: [0, 1],
      translateY: [-3, 0],
      delay: anime.stagger(150),
      duration: 500,
    });

    // 1.8s — Class row labels appear (GRANDI, GRASSI, POPOLO)
    timeline.add({
      targets: '.scriptorium-class-label',
      opacity: [0, 1],
      translateX: [-6, 0],
      delay: anime.stagger(100),
      duration: 400,
    }, '-=100');

    // 2.2s — Family cells appear in waves, like ink absorbing into vellum
    timeline.add({
      targets: '.scriptorium-family-cell',
      opacity: [0, 1],
      scale: [0.95, 1],
      delay: anime.stagger(30, { from: 'first' }),
      duration: 350,
    }, '-=100');

    // 2.8s — Year number appears large
    timeline.add({
      targets: '.scriptorium-year',
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 600,
    }, '-=200');

    // 3.0s — Timeline bar draws in
    timeline.add({
      targets: '.scriptorium-timeline',
      opacity: [0, 1],
      scaleX: [0, 1],
      transformOrigin: 'left center',
      duration: 500,
    }, '-=300');

  }, [isHistoricalMode, isReady]);

  // Reset hasRevealed when switching from Modern → Scriptorium
  // so re-activating Scriptorium replays the animation
  useEffect(() => {
    if (!isHistoricalMode) {
      hasRevealed.current = false;
    }
  }, [isHistoricalMode]);
}
```

**Wire into `App.tsx`:**

```tsx
import { useScriptoriumReveal } from './hooks/useScriptoriumReveal';

// In App component:
useScriptoriumReveal({
  isHistoricalMode,
  isReady: !isLoading && data.length > 0,
});
```

---

## Step 8 — Add Scriptorium CSS Classes to Components

The animation targets elements by class name.
Add these classes to the right elements in each component.

**`components/layout/Header.tsx`:**
```tsx
// Title element:
className="... scriptorium-title"

// Subtitle element:
className="... scriptorium-subtitle"

// The horizontal line under the header:
className="... scriptorium-header-line"
```

**`features/social-map/HistoricalMap.tsx`:**
```tsx
// GHIBELLINES column header:
className="... scriptorium-faction-col"

// GUELFS column header:
className="... scriptorium-faction-col"

// GRANDI / GRASSI / POPOLO row labels:
className="... scriptorium-class-label"

// Each family cell:
className="... scriptorium-family-cell"
```

**`components/controls/TimelineSlider.tsx`** (or TimelinePanel):
```tsx
// The year number (1215, 1260 etc):
className="... scriptorium-year"

// The timeline bar container:
className="... scriptorium-timeline"
```

**IMPORTANT:** These classes add to existing classes — never replace them.
Always append `scriptorium-*` at the end of the className string.

Build check: `npm run build` → 0 errors.

---

## Step 9 — Ink Fade for Family Name on Selection

When a user taps/clicks a family in Scriptorium mode,
the family name in the details panel appears as if written by a quill.

**File: `components/panels/FamilyDetailsPanel.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import anime from 'animejs';

// Inside the component, after selectedFamily changes:
const nameRef = useRef<HTMLElement>(null);

useEffect(() => {
  if (!selectedFamily || !isHistoricalMode || !nameRef.current) return;

  // Reset
  anime.set(nameRef.current, { opacity: 0, translateX: -4 });

  // Ink settles in
  anime({
    targets: nameRef.current,
    opacity: [0, 1],
    translateX: [-4, 0],
    duration: 500,
    easing: 'easeOutExpo',
    delay: 150,
  });
}, [selectedFamily?.name, isHistoricalMode]);

// On the name element:
<h2 ref={nameRef} className="font-display text-xl text-ink leading-tight">
  {selectedFamily?.name}
</h2>
```

Same treatment for the Chronicle event title in `ChronicleModal.tsx`.

---

## Step 10 — Marginalia Creatures in Panels

When Scriptorium mode is active, decorative creatures appear in panel corners.
These use the SVG files from `public/assets/marginalia/`.

**File: `components/panels/FamilyDetailsPanel.tsx`**

```tsx
{isHistoricalMode && (
  <img
    src={normalizeAssetPath('/assets/marginalia/creature-lion.svg')}
    className="absolute bottom-3 right-3 w-20 h-20 opacity-25 pointer-events-none select-none"
    aria-hidden="true"
    alt=""
  />
)}
```

**File: `features/chronicle/components/ChronicleModal.tsx`**

```tsx
{isHistoricalMode && (
  <img
    src={normalizeAssetPath('/assets/marginalia/creature-dragon.svg')}
    className="absolute bottom-4 right-4 w-24 h-24 opacity-20 pointer-events-none select-none"
    aria-hidden="true"
    alt=""
  />
)}
```

**File: `features/social-map/HistoricalMap.tsx`** — bottom-right of the whole grid:

```tsx
{isHistoricalMode && (
  <img
    src={normalizeAssetPath('/assets/marginalia/foliage-spray.svg')}
    className="absolute bottom-2 right-2 w-28 opacity-30 pointer-events-none select-none"
    aria-hidden="true"
    alt=""
  />
)}
```

All creatures: `opacity-20` to `opacity-30` — subtle, like marginalia.
They are decoration, not UI. `pointer-events-none` always.

**IMPORTANT:** Wrap each creature render in a check:
```tsx
// Only render if the file path resolves — don't break layout if SVG is missing
{isHistoricalMode && creatureExists && (
  <img ... />
)}
```

Or use onError to hide gracefully:
```tsx
<img ... onError={(e) => { e.currentTarget.style.display = 'none'; }} />
```

---

## Step 11 — Mode Transition Flash

When switching between Scriptorium and Modern, a brief vellum flash
signals the mode change — like lifting a page to the light.

**File: `App.tsx`**

```tsx
const [isTransitioning, setIsTransitioning] = useState(false);

const handleToggleMode = () => {
  setIsTransitioning(true);
  setTimeout(() => {
    toggleHistoricalMode();
    setTimeout(() => setIsTransitioning(false), 350);
  }, 150);
};

// Pass handleToggleMode instead of toggleHistoricalMode to all toggle buttons

// Render the flash overlay:
{isTransitioning && (
  <div
    className="fixed inset-0 z-[9999] pointer-events-none"
    style={{
      background: 'var(--vellum)',
      animation: 'modeFlash 350ms ease-in-out forwards',
    }}
  />
)}
```

```css
/* In index.css */
@keyframes modeFlash {
  0%   { opacity: 0; }
  40%  { opacity: 0.7; }
  100% { opacity: 0; }
}
```

---

## Step 12 — Modern Mode (Clean Escape)

Modern mode should feel clean, fast, and uncluttered.
It is NOT the Scriptorium — it removes all the decoration.

**File: `index.css`** — the NON-historical-mode state:

```css
/* Modern mode — when .historical-mode class is NOT present */
/* These are the base styles — clean, readable, fast */

/* No texture overlay */
/* bg-parchment = existing clean parchment colour */
/* All text-shadow removed by default */
/* No creatures, no borders, no marginalia */
```

In Modern mode:
- The `.scriptorium-*` elements are still there in the DOM
- Their opacity is already 1 (animation only runs in Scriptorium)
- The vellum texture background is NOT applied (only on .historical-mode)
- All Scriptorium overlay elements (`creature-lion`, `foliage-spray` etc)
  are conditionally rendered based on `isHistoricalMode` — so they simply
  don't exist in Modern mode

---

## Step 13 — Loading State (Scriptorium)

**File: `App.tsx`**

The loading state is the very first thing the user sees.
It must feel like the manuscript is being unrolled before the reveal.

```tsx
if (isLoading) {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center select-none"
      style={{
        backgroundColor: 'var(--vellum, #EFE5C0)',
        backgroundImage: "url('/CittaFracta/assets/textures/vellum.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
      }}
    >
      {/* The illuminated initial */}
      <span
        className="select-none"
        style={{
          fontFamily: "'IM Fell English', Georgia, serif",
          fontSize: '120px',
          color: 'var(--vermillion, #B83A2A)',
          opacity: 0.15,
          lineHeight: 1,
          animation: 'pulse 2s ease-in-out infinite',
        }}
        aria-hidden="true"
      >
        C
      </span>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '11px',
          letterSpacing: '0.35em',
          color: 'var(--vermillion, #B83A2A)',
        }}>
          CITTA·FRACTA
        </p>
        <p style={{
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontSize: '14px',
          fontStyle: 'italic',
          color: 'var(--iron-gall-faded, #5C3A20)',
          marginTop: '6px',
        }}>
          Caricamento dei registri storici…
        </p>
      </div>
    </div>
  );
}
```

---

## Step 14 — Final Audit

```bash
npm run build
# Must show 0 TypeScript errors
```

### Check list at 1280px (desktop):

**Scriptorium mode (default on load):**
- [ ] Vellum texture visible as background — warm, organic, NOT striped
- [ ] No ruling lines / no notebook paper effect
- [ ] Title reads `CITTA·FRACTA` with interpunct
- [ ] Subtitle in italic Crimson Pro
- [ ] On first load: reveal animation plays (~3.5 seconds)
- [ ] Title fades in first, then faction headers, then families, then year
- [ ] GHIBELLINES / GUELFS headers — no glow, crisp text
- [ ] No corner square in header
- [ ] COA images visible in family cells without hovering
- [ ] Family panel: creature SVG in corner (if file exists)
- [ ] Chronicle: dragon SVG in corner (if file exists)
- [ ] Switching to Modern: brief vellum flash, then clean mode

**Modern mode:**
- [ ] No texture background
- [ ] No creatures
- [ ] No animation on switch
- [ ] Button says `§ SCRIPTORIUM` — pressing it returns to Scriptorium
- [ ] Switching back to Scriptorium: flash + reveal animation replays

**Mobile (390px):**
- [ ] Vellum texture visible
- [ ] Reveal animation plays
- [ ] § button in FolioHeader toggles mode
- [ ] No layout shift between modes
- [ ] Creatures hidden on mobile if they cause layout issues

### Performance check:
- [ ] Vellum SVG tile loads (check Network tab — should be 1 request)
- [ ] Anime.js loaded (check bundle — should add ~17kb)
- [ ] No jank during reveal animation (check Performance tab)
- [ ] Reveal animation respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .scriptorium-title,
  .scriptorium-subtitle,
  .scriptorium-faction-col,
  .scriptorium-class-label,
  .scriptorium-family-cell,
  .scriptorium-year,
  .scriptorium-timeline {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## Asset File Reference

The agent uses these exact paths. Files must exist before running Step 10.
If a file is missing, the `onError` handler hides it gracefully — no crash.

```
public/assets/textures/vellum.svg              ← REQUIRED for Step 4
public/assets/marginalia/creature-lion.svg     ← optional, Step 10
public/assets/marginalia/creature-dragon.svg   ← optional, Step 10
public/assets/marginalia/creature-hybrid.svg   ← optional, Step 10
public/assets/marginalia/creature-snail.svg    ← optional, Step 10
public/assets/marginalia/foliage-spray.svg     ← optional, Step 10
public/assets/ornaments/giglio.svg             ← optional, future use
public/assets/ornaments/eagle.svg              ← optional, future use
public/assets/ornaments/tower.svg              ← optional, future use
public/assets/ornaments/border-corner.svg      ← optional, future use
public/assets/ornaments/border-horizontal.svg  ← optional, future use
public/assets/ornaments/initial-F.svg          ← optional, future use
public/assets/ornaments/initial-C.svg          ← optional, future use
public/assets/ornaments/quill-cursor.svg       ← optional, future use
```

REQUIRED = app won't look right without it.
Optional = degrades gracefully if missing.

---

## Commissioning Prompt

Paste into Claude Code:

```
Read CLAUDE.md then read agents/SCRIPTORIUM-DESIGNER.md completely.

Do Step 0 first: install animejs and confirm the build still passes.
Then do Steps 1 and 2: make Scriptorium the default mode and update
the title to CITTA·FRACTA.

Run npm run build after each step. Show me before continuing to Step 3.
```

Then for each subsequent step:
```
Step [N] looks good. Do Step [N+1] now.
Run npm run build after. Show me before continuing.
```