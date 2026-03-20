# Project Status — CittaFracta

**Last Updated:** 2026-03-20
**Active Phase:** SCRIPTORIUM-FIXES-2 — ALL 10 FIXES COMPLETE ✅

---

## 🎯 Current State

### ✅ Phase 16: SCRIPTORIUM-FIXES-2 (Complete — 2026-03-20)

Second-round visual polish based on live inspection of deployed app.
All problems were diagnosed from exact CSS values in production.

| Fix | Description | Status |
|-----|-------------|--------|
| 1 | Vellum: `cover` + `fixed` + `no-repeat` — no tiling seams | ✅ |
| 2 | Header transparent in Scriptorium — single iron-gall ruling line; FolioHeader conditional class | ✅ |
| 3 | `--parchment-deep` overridden to `rgba(42,26,10,0.20)` — eliminates dark-red border | ✅ |
| 4 | Timeline transparent — no terracotta band; thin ruling line at foot of page | ✅ |
| 5 | Family cells: SVG rect transparent in Scriptorium (JSX); HTML mobile cells as register entries | ✅ |
| 6 | COA images: `mix-blend-mode: multiply` — blend onto vellum, no yellow box | ✅ |
| 7 | City Map sidebar: semi-transparent vellum, no rounded corners, Cinzel buttons, clean search input | ✅ |
| 8 | Family detail panel: vellum-tinted bg, no box-shadow, section labels in Cinzel vermillion | ✅ |
| 9 | Map pins: square ink stamps; Leaflet zoom controls square + Cinzel font | ✅ |
| 10 | Mode toggle button: square stamp, Cinzel, iron-gall, `title`-attribute selector | ✅ |

**Build:** ✅ 0 TypeScript errors after every fix.

---

### ✅ Phase 15: SCRIPTORIUM-DESIGNER — All 14 Steps Complete (2026-03-19)

Full Florentine manuscript mode. Scriptorium is the default on load.

| Step | Description | Status |
|------|-------------|--------|
| 0 | Install animejs v4.3.6 | ✅ |
| 1 | Scriptorium default — localStorage persistence | ✅ |
| 2 | Title → `CITTA·FRACTA`, Italian subtitle | ✅ |
| 3 | Florentine pigment `:root` CSS variables | ✅ |
| 4 | Vellum background — real Inkscape-traced `vellum.svg` | ✅ |
| 5 | Typography & colour overrides | ✅ |
| 6 | Bug fixes — SVG halo, COA onError, header | ✅ |
| 7 | `useScriptoriumReveal` hook — animejs v4 Marauder's Map reveal | ✅ |
| 8 | `scriptorium-*` classes wired to all animation targets | ✅ |
| 9 | Ink fade animation on family name + chronicle title | ✅ |
| 10 | Marginalia creatures — lion, dragon, foliage | ✅ |
| 11 | Mode transition flash — vellum overlay | ✅ |
| 12 | Modern mode audit — inline style reset + CSS defaults | ✅ |
| 13 | Loading state — vellum bg + `C` initial + Italian text | ✅ |
| 14 | `prefers-reduced-motion` + final build | ✅ |

---

### ✅ Phase 14: UI Interaction Fixes (Complete — 2026-03-10)

- Zoom controls moved to TimelineSlider left side
- Historical/Clean mode toggle wired throughout

---

### ✅ Phase 13: SVG Ornament System (Complete — 2026-03-10)

**`public/assets/ornaments/`** — panel-border, divider, arms-frame, chapter-mark, border-corner, border-vertical, border-horizontal, tower, eagle, marzocco-head, initial-F, initial-C

**`public/assets/marginalia/`** — creature-dragon, creature-lion, creature-hybrid, creature-snail, foliage-spray

**`public/assets/textures/`** — vellum.svg (512KB Inkscape), parchment-texture.html, parchment-preview.png

---

### ✅ Phase 12: Manuscript Aesthetic Redesign (Complete — 2026-03-10)

Full "Archivio Vivo" design language. All major components redesigned.

---

### ✅ Phases 1–11: Foundation (Previously Complete)

App.tsx refactoring, geo-map modularization, mobile responsiveness, normalizeAssetPath, multi-select locations, coat of arms normalization. 14/21 Playwright tests passing.

---

## 🔧 Key Architecture Notes

- **`historicalMode` default:** `true` (Scriptorium). Persists via `localStorage`.
- **Toggle:** `◈  MODERN` (in Scriptorium) / `§  SCRIPTORIUM` (in Modern)
- **animejs:** v4.3.6 — named exports only: `createTimeline`, `stagger`, `utils`, `animate`. NOT v3 default import.
- **`scriptorium-*` class map:**
  - `.scriptorium-title` → `h1` in Header.tsx
  - `.scriptorium-subtitle` → `p` in Header.tsx
  - `.scriptorium-header-line` → absolute `<div>` at bottom of `<header>` in App.tsx
  - `.scriptorium-faction-col` → Ghibellines/Guelfs/White/Black `<text>` in HistoricalMap.tsx
  - `.scriptorium-class-label` → Grandi/Grassi/Popolo `<text>` in HistoricalMap.tsx
  - `.scriptorium-family-cell` → inner `<g>` (outer `<g>` owns React translate, inner owns animejs opacity/scale)
  - `.scriptorium-year` → year `<span>` in TimelinePanel.tsx
  - `.scriptorium-timeline` → outer `<div>` in TimelineSlider.tsx
- **SVG family cell fill:** Conditional in JSX — `transparent` in Scriptorium, `#F3EDE2` in Modern
- **COA images:** `mix-blend-mode: multiply` in Scriptorium
- **Vellum:** `background-size: cover; background-attachment: fixed; background-repeat: no-repeat`
- **`--parchment-deep`** overridden inside `.historical-mode` to iron-gall opacity (not red)

---

## 🔧 Active Features

| Feature | Status |
|---------|--------|
| Tab switching (Factions ↔ City Map) | ✅ |
| Timeline slider + play/pause | ✅ |
| Family selection + ledger details panel | ✅ |
| Chronicle event modal | ✅ |
| Coat of arms loading | ✅ |
| Zoom controls in timeline bar | ✅ |
| Scriptorium mode — DEFAULT on load | ✅ |
| Modern mode — clean escape hatch | ✅ |
| Mode persists across reloads (localStorage) | ✅ |
| Vellum full-screen, no tiling | ✅ |
| Florentine pigment CSS variables | ✅ |
| Title: CITTA·FRACTA + Italian subtitle | ✅ |
| Marauder's Map reveal animation | ✅ |
| Ink fade on family/chronicle selection | ✅ |
| Marginalia creatures in panels | ✅ |
| Mode transition flash | ✅ |
| Scriptorium loading state | ✅ |
| Family cells: transparent in Scriptorium | ✅ |
| COA blend-mode onto vellum | ✅ |
| Headers transparent in Scriptorium | ✅ |
| Timeline transparent in Scriptorium | ✅ |
| Sidebar manuscript styling | ✅ |
| Map pins as ink stamps | ✅ |
| Geo-map filters (faction/guild, relationships) | ✅ |
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
- **Modules:** ~1840
- **Bundle:** ~544KB (gzip ~169KB)
- **TypeScript:** Strict, 0 errors
- **Vite:** v6.4.1
- **animejs:** v4.3.6 (named exports only)

---

## 🗺️ Next Up

1. **Data pipeline:** SOURCE-READER → DATA-STEWARD agents (add families, fill sparse data)
2. **Map filters:** Multi-dimensional (faction + class + magnate)
3. **Relationship visualization:** Vendetta / marriage / alliance encoding
4. **Ego network mode:** Connections around selected family
5. **Playwright:** Fix remaining 4 failing tests
