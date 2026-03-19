# Project Status — CittaFracta

**Last Updated:** 2026-03-19
**Active Phase:** SCRIPTORIUM-DESIGNER — Steps 0–8 complete, paused at Step 9

---

## 🎯 Current State

### 🔄 Phase 15: SCRIPTORIUM-DESIGNER (In Progress)

Executing `agents/Scriptorium-designer.md` — the full Scriptorium mode implementation.
Inspired by Pentiment × Marauder's Map × 13th-century Florentine manuscripts.

**Core change:** Scriptorium mode is now the DEFAULT. Modern mode is the escape hatch.

#### Steps Complete

| Step | Description | Status |
|---|---|---|
| 0 | Install animejs v4.3.6 + @types/animejs | ✅ |
| 1 | Scriptorium default — localStorage persistence, `true` on first load | ✅ |
| 2 | Title → `CITTA·FRACTA` (interpunct · U+00B7), subtitle in Crimson Pro Italian | ✅ |
| 3 | Florentine pigment `:root` CSS variables (`--vellum`, `--iron-gall`, `--vermillion`, etc.) | ✅ |
| 4 | Vellum background — real Inkscape-traced `vellum.svg` tile (512KB), panels transparent | ✅ |
| 5 | Typography & colour overrides — IM Fell italic headings, `text-shadow: none`, `border-radius: 0`, scrollbar, selection | ✅ |
| 6 | Bug fixes — SVG halo filter removed from headers, COA `block`+`onError`, header clean | ✅ |
| 7 | `useScriptoriumReveal` hook — animejs v4 timeline, 3.5s Marauder's Map reveal | ✅ |
| 8 | `scriptorium-*` CSS classes wired to all animation targets | ✅ |

#### Steps Remaining

| Step | Description |
|---|---|
| 9 | Ink fade animation for family name on panel selection (animejs in FamilyDetailsPanel + ChronicleModal) |
| 10 | Marginalia creatures in panels (lion in FamilyDetailsPanel, dragon in Chronicle, foliage in HistoricalMap) |
| 11 | Mode transition flash — brief vellum overlay when switching Scriptorium ↔ Modern |
| 12 | Modern mode audit — confirm no texture/creatures leak into clean mode |
| 13 | Loading state — vellum background + `C` illuminated initial + Italian text |
| 14 | Final audit checklist (1280px + 390px + performance) |

---

### ✅ Phase 14: UI Interaction Fixes (Complete — 2026-03-10)

- Zoom controls moved to TimelineSlider left side (no longer overlap FamilyDetailsPanel)
- Historical/Clean mode toggle wired throughout

---

### ✅ Phase 13: SVG Ornament System (Complete — 2026-03-10)

ORNAMENT-MAKER agent completed all 14 SVG assets:

**`public/assets/ornaments/`** — panel-border, divider, arms-frame, chapter-mark, border-corner, border-vertical, border-horizontal, tower, eagle, marzocco-head, initial-F, initial-C

**`public/assets/marginalia/`** — creature-dragon, creature-lion, creature-hybrid, creature-snail, foliage-spray

**`public/assets/textures/`** — vellum.svg (Inkscape-traced real parchment, 512KB), parchment-texture.html (p5.js live), parchment-preview.png (Python/Pillow static tile)

---

### ✅ Phase 12: Manuscript Aesthetic Redesign (Complete — 2026-03-10)

Full "Archivio Vivo" design language. Components redesigned: Header, TabNavigation, FamilyDetailsPanel, TimelineSlider, Section, SearchBar, MapLayers, FiltersControl, FamiliesListPanel.

---

### ✅ Phases 1–11: Foundation (Previously Complete)

App.tsx refactoring, geo-map modularization, mobile responsiveness, normalizeAssetPath, multi-select locations, coat of arms normalization. 14/21 Playwright tests passing.

---

## 🔧 Key Architecture Changes (Phase 15)

- **`historicalMode` default:** `true` (Scriptorium). Persists via `localStorage`.
- **Toggle button:** `◈  MODERN` (when in Scriptorium) / `§  SCRIPTORIUM` (when in Modern)
- **`hooks/useScriptoriumReveal.ts`:** animejs v4 named exports (`createTimeline`, `stagger`, `utils.set`). NOT v3 default-import API.
- **`scriptorium-*` class map:**
  - `.scriptorium-title` → `h1` in Header.tsx
  - `.scriptorium-subtitle` → `p` in Header.tsx
  - `.scriptorium-header-line` → `<div>` absolute bottom of `<header>` in App.tsx (replaced `border-b`)
  - `.scriptorium-faction-col` → Ghibellines/Guelfs/White/Black `<text>` in HistoricalMap.tsx
  - `.scriptorium-class-label` → Grandi/Grassi/Popolo `<text>` in HistoricalMap.tsx
  - `.scriptorium-family-cell` → inner `<g>` wrapping family content (outer `<g>` owns React translate, inner owns opacity/scale)
  - `.scriptorium-year` → year `<span>` in TimelinePanel.tsx
  - `.scriptorium-timeline` → outer `<div>` in TimelineSlider.tsx
- **SVG header halo removed:** `filter="url(#text-halo)"` stripped from all 7 SVG text headers (glow bug fixed)
- **Vellum background:** `.historical-mode` uses `vellum.svg` tile. `.historical-mode main, .bg-parchment` → transparent (texture shows through)
- **CSS variables in `:root`:** `--vellum`, `--vellum-aged`, `--vellum-shadow`, `--iron-gall`, `--iron-gall-faded`, `--iron-gall-sepia`, `--vermillion`, `--vermillion-light`, `--ultramarine`, `--ultramarine-mid`, `--verdigris`, `--verdigris-light`, `--gold-leaf`, `--gold-leaf-bright`, `--ochre`, `--lead-white`

---

## 📊 Component Architecture

```
App.tsx (historicalMode state — default true, localStorage)
├── FolioHeader.tsx — mobile, § toggle button
├── Header.tsx — CITTA·FRACTA title + subtitle + scriptorium-* classes
├── TabNavigation.tsx
├── [mode toggle] — ◈ MODERN / § SCRIPTORIUM
├── SocialMapView
│   ├── HistoricalMap.tsx — scriptorium-faction-col, scriptorium-class-label, scriptorium-family-cell
│   └── TimelinePanel.tsx — scriptorium-year
├── CityMapView
│   └── GeographicalMap → LeftSidebar (SearchBar, MapLayers, FiltersControl, FamiliesListPanel)
├── FamilyDetailsPanel.tsx
├── TimelineSlider.tsx — scriptorium-timeline
└── hooks/useScriptoriumReveal.ts — animejs v4 timeline, wired in App.tsx
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
| Scriptorium mode — DEFAULT on load | ✅ |
| Modern mode — clean escape hatch | ✅ |
| Mode persists across reloads (localStorage) | ✅ |
| Vellum texture background | ✅ |
| Florentine pigment CSS variables | ✅ |
| Title: CITTA·FRACTA + Italian subtitle | ✅ |
| SVG glow removed from map headers | ✅ |
| Marauder's Map reveal animation (hook ready) | ✅ (classes wired, Step 8 done) |
| Ink fade on family selection | ⏳ Step 9 |
| Marginalia creatures in panels | ⏳ Step 10 |
| Mode transition flash | ⏳ Step 11 |
| Scriptorium loading state | ⏳ Step 13 |
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
- **Bundle:** ~504KB gzip ~154KB (animejs added ~17KB)
- **TypeScript:** Strict, 0 errors
- **Vite:** v6.4.1
- **animejs:** v4.3.6 (named exports — NOT default import)

---

## 🗺️ Next Up

1. **Continue SCRIPTORIUM-DESIGNER Steps 9–14** (resume with: "yes" to Step 9)
2. **Data pipeline:** SOURCE-READER → DATA-STEWARD agents
3. **Map filters:** Multi-dimensional (faction + class + magnate)
4. **Relationship visualization:** Vendetta / marriage / alliance encoding
5. **Ego network mode:** Connections around selected family
