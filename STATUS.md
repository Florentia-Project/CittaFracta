# Project Status — CittaFracta

**Last Updated:** 2026-03-10
**Active Phase:** Manuscript Redesign & UI Polish — Complete ✨

---

## 🎯 Current State

### ✅ Phase 12: Manuscript Aesthetic Redesign (Complete)

Full visual redesign executing the "Archivio Vivo" design language from `themes/florentine-clean.md` and `themes/florentine-historical.md`. Implemented by DESIGNER agent (Phases 1–5).

**Design tokens established (`index.html` inline Tailwind config + `index.css`):**
- Fonts: `IM Fell English` (display/serif), `Cinzel` (label), `Crimson Pro` (body), `Inter` (ui-chrome only)
- Colors: full parchment/ink/rubric/accent palette — both clean and historical mode
- CSS utilities: `.folio-ruled`, `.rubric-label`, `.manuscript-initial`, `.paper-texture`
- Historical mode: `.historical-mode` class activates "Scriptorium Obscurum" layer

**Components redesigned:**
| Component | Changes |
|---|---|
| `Header.tsx` | IM Fell English, rubric red, manicule subtitle, ruling line |
| `TabNavigation.tsx` | Cinzel labels, rubric active state, no icons |
| `FamilyDetailsPanel.tsx` | Guild register layout, square seal close button, rubric headings |
| `TimelineSlider.tsx` | Diamond position marker, rubric past-events, font-display year labels, square buttons |
| `Section.tsx` (geo-map) | ReactNode icon, `+`/`−` open marks, Cinzel labels |
| `SearchBar.tsx` (geo-map) | Folio header, quill ☞ mark, square search field |
| `MapLayers.tsx` (geo-map) | Inline SVG icons, square stamps, Italian labels |
| `FiltersControl.tsx` (geo-map) | Manuscript SVG icons (heart/branch/swords/rings), manuscript colors |
| `FamiliesListPanel.tsx` (geo-map) | Italian label "Famiglie", ReactNode icon |

---

### ✅ Phase 13: SVG Ornament System (Complete)

ORNAMENT-MAKER agent created all static and animated assets.

**`public/assets/ornaments/`**
- `panel-border.svg` — double-ruled frame, corner registration marks, `preserveAspectRatio="none"`
- `divider.svg` — horizontal ruling with central rubric diamond
- `arms-frame.svg` — gold-leaf civic cartouche ring, evenodd transparent center (64×64 inner area)
- `chapter-mark.svg` — Florentine pilcrow, calligraphic quill strokes

**`public/assets/textures/`**
- `parchment-texture.html` — live p5.js "Velo dell'Oblio" generative aging animation (seeded 1280)
- `parchment-preview.png` — 400×400 static tile generated with Python + Pillow, 3-layer Gaussian noise

**Integrated into `FamilyDetailsPanel`:**
- `panel-border.svg` — absolute overlay, opacity 0.22
- `arms-frame.svg` — 84×84 centered cartouche over coat of arms
- `divider.svg` — between all sections
- `chapter-mark.svg` — before every section heading

**Historical mode texture:** `.historical-mode::before` tiles `parchment-preview.png` at 0.4 opacity.

---

### ✅ Phase 14: UI Interaction Fixes (Complete)

- **Zoom controls moved**: Extracted from `HistoricalMap.tsx` overlay → `TimelineSlider.tsx` left side. No longer overlap `FamilyDetailsPanel` on right. Implemented via `onZoomReady` callback chain: `HistoricalMap` → `SocialMapView` → `App` → `TimelineSlider`.

- **Historical/Clean mode toggle**: `☽ Scriptorio` / `☀ Archivio` button in header. Applies `.historical-mode` class to root div, activating `index.css` historical layer globally.

---

### ✅ Phases 1–11: Foundation (Previously Complete)

- App.tsx refactoring (56% reduction)
- Geo-map modularization (65% reduction, 6 new components)
- Mobile responsiveness (touch pan/zoom, responsive layouts)
- Image path resolver (`normalizeAssetPath`)
- Multi-select location groups
- Coat of arms normalization
- 14/21 Playwright tests passing

---

## 📊 Component Architecture

```
App.tsx (historicalMode state + mode toggle in header)
├── Header.tsx — IM Fell English, rubric, manicule
├── TabNavigation.tsx — Cinzel, rubric active
├── [mode toggle button] — ☽/☀ Scriptorio/Archivio
├── SocialMapView
│   ├── HistoricalMap (exposes onZoomReady)
│   └── TimelinePanel
├── CityMapView
│   └── GeographicalMap
│       └── LeftSidebar
│           ├── SearchBar — folio header, quill mark
│           ├── MapLayers — inline SVG, Italian labels
│           ├── Section — Cinzel, +/− marks, ReactNode icon
│           ├── FiltersControl — manuscript SVG icons
│           └── FamiliesListPanel
├── FamilyDetailsPanel — ledger entry, ornaments integrated
└── TimelineSlider — diamond marker, zoom buttons left
```

---

## 🔧 Active Features

| Feature | Status |
|---|---|
| Tab switching (Factions ↔ City Map) | ✅ |
| Timeline slider + play/pause | ✅ |
| Family selection + ledger details panel | ✅ |
| Chronicle event modal | ✅ |
| Coat of arms loading (normalizeAssetPath) | ✅ |
| Zoom controls in timeline bar | ✅ |
| Historical/Clean mode toggle | ✅ |
| Geo-map filters (faction/guild, relationships) | ✅ |
| Manuscript aesthetic — Archivio Vivo | ✅ |
| Historical mode — Scriptorium Obscurum | ✅ |
| SVG ornaments in FamilyDetailsPanel | ✅ |
| Mobile responsiveness | ✅ (basic) |

---

## ⚠️ Known Issues

- 4 Playwright tests failing (UI timing — not code bugs)
- Data sparse — many families not fully populated
- No multi-dimensional filters yet (planned)
- Mobile UX functional but not polished

---

## 📝 Build

- **Status:** ✅ Passing
- **Modules:** 1786
- **Bundle:** ~488KB gzip ~150KB
- **TypeScript:** Strict, 0 errors
- **Vite:** v6.4.1

---

## 🗺️ Next Up (Planned)

- **Phase 15:** `TimelineSlider` — Phase 5 DESIGNER (full polish pass)
- **Data pipeline:** SOURCE-READER → DATA-STEWARD agents
- **Map filters:** Multi-dimensional (faction + class + magnate)
- **Relationship visualization:** Vendetta / marriage / alliance encoding
- **Ego network mode:** Connections around selected family
- **Uncertainty visualization:** Opacity by `date_precision`
