# SCRIPTORIUM-FIXES-2 Agent
> CittaFracta — Scriptorium mode second round of fixes
> All problems diagnosed by live inspection of the deployed app.
> Every fix is based on exact CSS values found in production.

---

## Read These First

```
CLAUDE.md
index.css
components/layout/Header.tsx
components/layout/FolioHeader.tsx
components/controls/TimelineSlider.tsx
features/social-map/views/SocialMapView.tsx
features/social-map/HistoricalMap.tsx
features/geo-map/views/CityMapView.tsx
features/geo-map/components/LeftSidebar.tsx
App.tsx
```

Run `npm run build` to confirm clean starting state.

---

## Fix 1 — Vellum texture: full screen, no tiling

**What I found:**
`background-size: 300px 300px` with `background-repeat: repeat`.
This tiles the SVG in a grid — visible seams everywhere.

**The correct approach:**
The texture should stretch to cover the entire screen exactly once.
No tiling. No seams. One piece of vellum.

**In `index.css` inside `.historical-mode`:**

```css
.historical-mode {
  background-color: #EAD9A8;
  background-image: url('/CittaFracta/assets/textures/vellum.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}
```

`cover` scales the SVG to cover the full viewport.
`fixed` keeps it fixed to the viewport — content scrolls over it, texture stays.
`no-repeat` — never tiles.

---

## Fix 2 — Header background is terracotta, not vellum

**What I found:**
The mobile `FolioHeader` has `bg-parchment` which in Scriptorium mode
resolves to `rgb(196, 160, 112)` — a strong terracotta/orange.
Its bottom border is `0.8px solid rgb(107, 20, 20)` — a dark red.

The desktop header has a gold bottom border: `rgba(184, 146, 10, 0.5)`.

Neither is correct. Both should be transparent (letting the vellum show through)
with a single thin iron-gall ruling line underneath.

**In `index.css` inside `.historical-mode`:**

```css
/* Both mobile and desktop headers — transparent, let vellum show */
.historical-mode header,
.historical-mode [class*="FolioHeader"],
.historical-mode [class*="folio-header"] {
  background-color: transparent !important;
  border-bottom: 1px solid rgba(42, 26, 10, 0.15) !important;
}

/* Desktop header specifically */
.historical-mode [class*="pt-3"][class*="px-4"],
.historical-mode [class*="pt-3"][class*="px-8"] {
  background-color: transparent !important;
  border-bottom: 1px solid rgba(42, 26, 10, 0.15) !important;
}
```

**In `components/layout/FolioHeader.tsx`:**
Find the `bg-parchment` class on the root `<header>` element.
In Scriptorium mode this must be transparent. Change to:
```tsx
className={`sm:hidden h-11 flex items-center justify-between px-4 
  border-b shrink-0 z-30
  ${isHistoricalMode 
    ? 'bg-transparent border-ink/15' 
    : 'bg-parchment border-parchment-deep'
  }`}
```

---

## Fix 3 — The red/dark-red outer border around the entire app

**What I found:**
The mobile `FolioHeader` has `borderBottomColor: rgb(107, 20, 20)` — 
a very dark red that reads as a thick decorative border around the app.
This comes from `border-parchment-deep` resolving incorrectly in
the historical-mode palette to a dark red/maroon colour.

**In `index.css` inside `.historical-mode`:**

```css
/* Fix parchment-deep in historical mode — it must NOT be red */
.historical-mode {
  --parchment-deep: rgba(42, 26, 10, 0.20);
  /* iron-gall ink at 20% opacity — a light ruling line */
}
```

Also check `tailwind.config.js` or `tailwind.config.ts` for where
`parchment-deep` is defined. If it maps to a reddish value, change it
to a warm dark brown for historical mode only via the CSS variable override above.

---

## Fix 4 — Timeline bar is a separate orange/terracotta band

**What I found:**
The `TimelineSlider` wrapper has `bg-parchment` → `rgb(196, 160, 112)`,
creating a solid terracotta strip at the bottom of the screen.
It has a visible top border separating it from the map.

**In `index.css` inside `.historical-mode`:**

```css
/* Timeline — transparent, sits on the same vellum as everything else */
.historical-mode .scriptorium-timeline,
.historical-mode [class*="pb-4"][class*="pt-2"],
.historical-mode [class*="pb-6"][class*="pt-2"] {
  background-color: transparent !important;
  border-top: 1px solid rgba(42, 26, 10, 0.12) !important;
  /* Single thin ruling line — the foot of the page */
}

/* Current year marker — square ink stamp, not orange circle */
.historical-mode [class*="bg-earth-orange"][class*="rounded-full"],
.historical-mode [class*="w-1.5"][class*="h-1.5"][class*="rounded"] {
  background-color: var(--iron-gall, #2A1A0A) !important;
  border-radius: 0 !important;
  width: 6px !important;
  height: 6px !important;
}

/* Timeline event diamond markers */
.historical-mode [class*="rotate-45"] {
  border-color: rgba(42, 26, 10, 0.4) !important;
  background-color: transparent !important;
}

/* Year labels on timeline */
.historical-mode [class*="text-xs"][class*="text-ink-faded"] {
  color: rgba(42, 26, 10, 0.45) !important;
}
```

---

## Fix 5 — Family cells have white background and modern box styling

**What I found:**
Family cells in the faction grid have:
- `background-color: rgb(255, 255, 255)` — pure white
- `border-radius: rounded` — modern pill/chip look
- Class: `rounded border text-[10px] font-bold`

These look like modern UI tags. On a manuscript, family names are
written in ink directly on the page — no box, no background.

**In `index.css` inside `.historical-mode`:**

```css
/* Family cells — no box, no white background */
/* They should look like entries in a register, not UI chips */
.historical-mode [class*="flex"][class*="items-center"][class*="rounded"][class*="border"] {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid rgba(42, 26, 10, 0.10) !important;
  border-radius: 0 !important;
  padding: 4px 6px !important;
}

/* Hover state — a marginal mark, not a highlight box */
.historical-mode [class*="flex"][class*="items-center"][class*="rounded"][class*="border"]:hover {
  background-color: rgba(42, 26, 10, 0.04) !important;
  border-left: 2px solid rgba(184, 58, 42, 0.5) !important;
}
```

**In `features/social-map/HistoricalMap.tsx`:**
Find the family button/cell element. It likely has classes like:
`rounded border px-2 py-2 flex items-center gap-2`

In Scriptorium mode, pass additional classes:
```tsx
className={`flex items-center gap-2 px-2 py-1 text-[10px] font-bold transition-all
  ${isHistoricalMode 
    ? 'bg-transparent border-0 border-b border-ink/10 rounded-none' 
    : 'rounded border bg-white'
  }
  ${isSelected ? (isHistoricalMode ? 'border-l-2 border-rubric' : 'bg-selected') : ''}
`}
```

---

## Fix 6 — COA images have white/yellow background

**What I found:**
COA images (e.g. ABATI.svg) have `background-color: rgb(237, 214, 138)` —
a yellow box baked into the SVG file itself.

**In `index.css` inside `.historical-mode`:**

```css
/* COA images — blend onto vellum, no bounding box */
.historical-mode img[src*="CoatOfArms"],
.historical-mode img[src*=".svg"] {
  mix-blend-mode: multiply;
  background-color: transparent !important;
  filter: sepia(0.15) contrast(1.05);
}
```

`mix-blend-mode: multiply` makes white/light pixels in the SVG
transparent against the vellum — the COA appears painted directly
on the skin with no border box.

---

## Fix 7 — City Map sidebar: modern UI components

**What I found:**
The LEFT SIDEBAR on City Map contains:
- White background buttons with `rounded` corners
- Orange slider for the 1584 overlay
- Modern iOS-style toggles
- `CLEAN / SATELLITE / DARK` segmented buttons

The map itself (the 1584 Florence overlay) is perfect.
The sidebar ruins the manuscript feel completely.

**In `index.css` inside `.historical-mode`:**

```css
/* Sidebar background — transparent like everything else */
.historical-mode [class*="w-80"],
.historical-mode [class*="sidebar"] {
  background-color: rgba(234, 217, 168, 0.3) !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
  border-right: 1px solid rgba(42, 26, 10, 0.15) !important;
}

/* ALL buttons in sidebar — no rounded corners, no white bg */
.historical-mode [class*="w-80"] button,
.historical-mode [class*="sidebar"] button {
  border-radius: 0 !important;
  background-color: transparent !important;
  border-color: rgba(42, 26, 10, 0.20) !important;
  color: var(--iron-gall, #2A1A0A) !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 0.1em !important;
}

/* Active/selected state — vermillion mark */
.historical-mode [class*="w-80"] button[class*="bg-earth"],
.historical-mode [class*="sidebar"] button[class*="active"],
.historical-mode [class*="w-80"] button[class*="bg-rubric"] {
  background-color: var(--vermillion, #B83A2A) !important;
  color: var(--vellum, #EFE5C0) !important;
}

/* Slider (1584 overlay opacity) — minimal ink line */
.historical-mode input[type="range"] {
  accent-color: var(--iron-gall, #2A1A0A);
}

/* Section labels — INFORMATION & FILTERS, MAP LAYERS etc */
.historical-mode [class*="w-80"] [class*="font-label"],
.historical-mode [class*="sidebar"] [class*="tracking"] {
  color: var(--vermillion, #B83A2A) !important;
  letter-spacing: 0.25em !important;
}

/* Search input */
.historical-mode input[placeholder*="Search"] {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid rgba(42, 26, 10, 0.2) !important;
  border-radius: 0 !important;
  font-family: 'Crimson Pro', serif !important;
  color: var(--iron-gall, #2A1A0A) !important;
}
```

---

## Fix 8 — Family detail panel: vellum background, no overlapping chaos

**What I found:**
When a family is selected the panel overlaps the Chronicle text awkwardly.
The panel has its own background that doesn't match the vellum.
The COA has a visible yellow box.

**In `index.css` inside `.historical-mode`:**

```css
/* Family details panel — same vellum as the page */
.historical-mode [class*="FamilyDetails"],
.historical-mode [class*="family-details"],
.historical-mode [class*="w-80"][class*="border-l"] {
  background-color: rgba(234, 217, 168, 0.85) !important;
  border-left: 1px solid rgba(42, 26, 10, 0.15) !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}

/* CLOSE button — manuscript style */
.historical-mode [class*="CLOSE"],
.historical-mode button[class*="close"] {
  border-radius: 0 !important;
  border: 1px solid rgba(42, 26, 10, 0.2) !important;
  background-color: transparent !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 0.2em !important;
  color: var(--iron-gall, #2A1A0A) !important;
}

/* POLITICAL STATUS / ORIGINS & PLACES section headers */
.historical-mode [class*="POLITICAL"],
.historical-mode [class*="ORIGINS"] {
  color: var(--vermillion, #B83A2A) !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 0.2em !important;
  font-size: 9px !important;
}
```

---

## Fix 9 — Map location pins: square ink stamps

**What I found:**
The family location markers on the City Map are modern square boxes
with visible borders and backgrounds. On a manuscript map these would
be small ink dots or stamped marks.

**In `index.css` inside `.historical-mode`:**

```css
/* Map pins — ink dots, not UI boxes */
.historical-mode [class*="leaflet-marker"],
.historical-mode .family-marker {
  border-radius: 0 !important;
  border: 1px solid rgba(42, 26, 10, 0.6) !important;
  background-color: rgba(42, 26, 10, 0.7) !important;
  box-shadow: none !important;
}

/* Leaflet zoom controls — manuscript style */
.historical-mode .leaflet-control-zoom a {
  background-color: rgba(234, 217, 168, 0.9) !important;
  border: 1px solid rgba(42, 26, 10, 0.2) !important;
  border-radius: 0 !important;
  color: var(--iron-gall, #2A1A0A) !important;
  font-family: 'Cinzel', serif !important;
}
```

---

## Fix 10 — The Scriptorium mode button styling

**What I found:**
The `§ SCRIPTORIUM` / `◈ MODERN` toggle button has rounded corners
and modern styling in both modes.

**In `index.css` inside `.historical-mode`:**

```css
/* Mode toggle button in Scriptorium */
.historical-mode [class*="MODERN"],
.historical-mode button[class*="modern"],
.historical-mode [aria-label*="mode"] {
  border-radius: 0 !important;
  border: 1px solid rgba(42, 26, 10, 0.25) !important;
  background-color: transparent !important;
  font-family: 'Cinzel', serif !important;
  letter-spacing: 0.15em !important;
  color: var(--iron-gall, #2A1A0A) !important;
  font-size: 9px !important;
}
```

---

## Build and Verify

```bash
npm run build
# Must show 0 errors
```

Check in browser with Scriptorium mode active at 1440px wide:

**Background:**
- [ ] Vellum texture covers full screen — no tiling seams
- [ ] Header area same warm vellum as the rest — no colour boundary

**Header:**
- [ ] Header background transparent — continuous vellum
- [ ] Bottom border: single thin iron-gall line only
- [ ] No dark-red/maroon thick border visible

**Timeline:**
- [ ] Same vellum as the map above it — no orange/terracotta band
- [ ] Year marker: small dark square dot, not orange circle
- [ ] Only a thin ruling line separates it from the map

**Faction grid:**
- [ ] Family cells: no white background, no rounded corners
- [ ] Names written directly on vellum with only a thin bottom rule
- [ ] COA images: no yellow box, appear directly on vellum (mix-blend-mode)

**City Map:**
- [ ] Sidebar: no white/solid background — warm semi-transparent vellum
- [ ] Sidebar buttons: no rounded corners, Cinzel font
- [ ] Search input: single bottom border only, no box
- [ ] Map pins: ink dots, no modern box styling

**Family detail panel:**
- [ ] Vellum-tinted background — not white/different colour
- [ ] No box shadow
- [ ] CLOSE button: no border-radius, Cinzel font

**Modern mode — must still work perfectly:**
- [ ] Press ◈ MODERN — all Scriptorium styles disappear
- [ ] Modern mode looks exactly as before

---

## Commissioning Prompt

Paste into Claude Code:

```
Read CLAUDE.md then read agents/SCRIPTORIUM-FIXES-2.md completely.

Work through fixes 1 to 10 in order.
After every fix run npm run build and confirm 0 errors.
Show me the full result after all ten fixes are done.
```
