# CLAUDE.md — CittaFracta Master Context
> This file is read automatically by Claude Code at the start of every session.
> It is the single source of truth for this project. All agents must respect it.

---

## 🏛️ Project Identity

**Name:** CittaFracta (Città Fracta — "The Fractured City")
**Purpose:** A digital humanities research tool for visualizing Florentine factions, families, and geography in the 13th century (1215–1302).
**Audience:** Academic researchers, historians, and serious students of medieval Italian history.
**Data Sources:** Primary sources (Dante, Dino Compagni, Giovanni Villani), academic books, and articles — loaded via Google Sheets.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 + TypeScript (strict) |
| Styling | Tailwind CSS (utility-first) |
| Maps | Leaflet.js + react-leaflet |
| Data | Google Sheets → `services/sheetService.ts` |
| Testing | Playwright |
| Deploy | GitHub Pages (base: `/CittaFracta/`) |

---

## 🎨 Design Language — "Florentine Manuscript"

The app must feel like a **13th century Florentine manuscript brought to life**, not a generic web app with parchment colors.

### Color Palette
- **Background:** `bg-parchment` — aged paper texture, never pure white
- **Text:** `text-ink` (primary) / `text-ink-light` (secondary)
- **Accent:** `earth-orange` — used sparingly for highlights
- **Never use:** blue links, generic grays, flat white cards, or neon colors

### Typography
- **Headings:** `font-display` — must feel like manuscript capitals
- **Body:** `font-serif` — readable but historically grounded
- **No sans-serif for content text** (only UI chrome)

### UI Metaphors (ENFORCE THESE)
- Modals → **Chronicles** (scrolls, not dialog boxes)
- Sidebars → **Ledgers** (folios, not panels)
- Tables → **Registers** (guild records, not spreadsheets)
- Buttons → **Seals** (stamped, not flat material design)
- Filters → **Quill annotations** (marginal notes aesthetic)

### What to AVOID
- Generic card shadows (use parchment texture instead)
- AI-default color schemes (teal/purple/gray gradients)
- Flat modern iconography without historical grounding
- Mobile-first generic layouts that ignore the manuscript metaphor

---

## 🏗️ Architecture

```
App.tsx (Orchestrator — 120 lines, keep it lean)
├── components/
│   ├── layout/         → Header, TabNavigation
│   ├── panels/         → FamilyDetailsPanel, TimelinePanel
│   ├── controls/       → TimelineSlider
│   └── ui/             → Shared UI primitives
├── features/
│   ├── social-map/     → Political faction matrix + HistoricalMap
│   ├── geo-map/        → Leaflet geographical map
│   └── chronicle/      → Event modal system
├── hooks/              → useTimeline, useHistoricalData
├── services/           → sheetService.ts (THE data gateway)
├── utils/              → assetPaths.ts + helpers
├── data/               → Local fallback data
└── types.ts            → Single source of type truth
```

### Critical Files — Handle With Care
| File | Why It's Critical |
|---|---|
| `services/sheetService.ts` | The entire app's data backbone |
| `types.ts` | All TypeScript types — never break contracts |
| `utils/assetPaths.ts` | Image path normalization — fragile if changed |
| `hooks/useHistoricalData.ts` | Bridge between service and state |

---

## 📊 Data Flow

```
Google Sheets
    ↓ (fetch)
sheetService.ts
    ↓ (transform)
useHistoricalData hook
    ↓ (state)
App.tsx
    ↓ (props)
SocialMapView / CityMapView
```

**Rule:** Never hardcode historical data. Always route through the hook.

---

## ⚙️ Current State (March 2026)

### ✅ Working
- Tab switching (Social Map ↔ City Map)
- Timeline slider with play/pause
- Family selection + details panel
- Chronicle event modal
- Coat of arms SVG loading
- Mobile responsiveness (basic)
- 14/21 Playwright tests passing
- **Full manuscript aesthetic redesign** (DESIGNER agent — Phases 1–5 complete)
  - Fonts: IM Fell English (display), Cinzel (labels), Crimson Pro (body)
  - Colors: full "Archivio Vivo" + "Scriptorium Obscurum" palette tokens
  - Components: Header, TabNavigation, FamilyDetailsPanel, TimelineSlider, geo-map sidebar
- **SVG ornament system** (ORNAMENT-MAKER agent — Parts 1 & 2 complete)
  - `public/assets/ornaments/`: panel-border, divider, arms-frame, chapter-mark
  - `public/assets/textures/`: parchment-texture.html (p5.js), parchment-preview.png
  - Ornaments integrated into FamilyDetailsPanel
- **Historical / Clean mode toggle** — `☽ Scriptorio` button in header applies `.historical-mode` CSS class globally
- **Zoom controls relocated** to TimelineSlider left side (no longer overlap FamilyDetailsPanel)
- **Geo-map sidebar redesigned**: manuscript SVG icons, square stamps, Italian register labels

### ⚠️ Known Issues
- 4 Playwright tests failing (timing, not logic)
- Data is sparse — many families not yet fully populated
- No multi-dimensional filters on either map
- Mobile UX is functional but not polished

### 🚫 Removed Features
- Edit mode (deliberately removed — app is read-only viewer)

### 🗺️ Planned Features (via agents)
- **Design:** Full manuscript aesthetic redesign (MANUSCRIPT-RESEARCHER → DESIGNER)
- **Data:** Chicago-cited extraction pipeline with Excel review (SOURCE-READER → DATA-STEWARD)
- **Maps:** Multi-dimensional filters (faction + class + magnate + switchers)
- **Maps:** Relationship type visual encoding (vendetta/marriage/alliance/economic)
- **Maps:** Ego network focus mode (show connections around selected family)
- **Maps:** Faction transition visualization with history timeline
- **Maps:** Uncertainty visualization (opacity by date_precision)
- **Maps:** Path finding — "how are Family A and Family B connected?"
- **Maps:** District/sestiere layer overlay
- **Maps:** Timeline integration on geo map

---

## 📐 Coding Rules

1. **Respect the Era:** Every UI decision should pass the question: *"Would a Florentine scholar recognize this?"*
2. **No Dummy Data:** Always use `data` prop or `useHistoricalData` hook
3. **Types:** Always import from `types.ts` — never re-declare. Never use `any` — if you're tempted, ask for a strict type instead.
4. **Modularity:** Keep components under 200 lines. Split if larger.
5. **No over-engineering:** Simple, readable code over clever abstractions
6. **Mobile-aware:** Use `sm:` breakpoint for all responsive changes
7. **Asset paths:** Always use `normalizeAssetPath()` from `utils/assetPaths.ts`
8. **Explain before changing:** Always describe what you're about to change and why
9. **Boy Scout Rule:** If you see repeated logic that should be a reusable function, refactor it immediately — don't leave AI-generated lazy code behind
10. **Historical Accuracy > Fancy Code:** If a solution works but distorts the historical data representation, it is rejected

---

## 🧭 The Historian's Code (Core Philosophy)

These are the non-negotiable principles for working on this project:

- **Context is King:** Before starting any task, read `STATUS.md`. Do not start coding a feature if the previous work isn't stable.
- **Understand Before Implementing:** Never copy-paste AI code you don't understand. Before accepting any suggestion, ask: *"Why does this work?"* and *"What does this break?"*
- **Historical Accuracy First:** The data represents real people and real events. A bug that misrepresents a family's faction allegiance is worse than a visual glitch.
- **The AI Rule:** Claude Code is a tool, not the author. You (the developer) are responsible for every line that goes into `main`.

---

## 🔀 Workflow

### Branching
- Use `feature/` branches for new ideas and experiments
- `main` must always be stable and deployable
- Never push broken code to `main`

### Commit Messages
Write for your future self — be specific:
```
✅ "Fix timeline slider not updating geo map year on mobile"
❌ "fix bug"

✅ "feat: Add vendetta connection type to geo map filters"  
❌ "update map"
```

### The Sanity Check (before every merge to main)
Manually verify these three things every time:
1. Does the Geo Map load and show markers?
2. Does the Social Map load and show families in faction columns?
3. Does the Timeline slider move families and update the year?

If any of these fail → do not merge.

---

## 🔒 Security

**There are two completely separate API keys in this project — don't confuse them:**

| Key | What It's For | Who Uses It | Lives Where |
|---|---|---|---|
| **Anthropic API key** | Claude Code (your dev tool) | You, the developer, on your machine only | Your terminal environment — never in this repo |
| **Google Sheets API key** | Fetching historical data into the app | The app at runtime | `.env.local` — already in `.gitignore` |

Neither key is ever seen by users. Neither key is ever committed to GitHub.

- **Read-Only:** The app has READ-ONLY access to Google Sheets. Never write code that attempts to modify the sheet from the client side.
- **No Secrets in Code:** No credentials, tokens, or private URLs hardcoded in any source file.
- **Users need nothing:** CittaFracta has no login, no user API keys, no authentication. It is a read-only research viewer.

---

## 📝 Documentation Maintenance

- Update `CONTEXT.md` when a major feature is added (e.g., a new map layer, a new data type)
- Update `STATUS.md` after completing any significant phase of work
- Update `CLAUDE.md` (this file) if the architecture changes significantly
- The `agents/` folder documents are living documents — update them as you learn what works

---

## 🗂️ Agent System

This project uses specialized Claude Code agents. Each lives in `agents/`.

| Agent File | Role | Run When |
|---|---|---|
| `agents/MANUSCRIPT-RESEARCHER.md` | Research Florentine manuscript aesthetics | Before any design work |
| `agents/DESIGNER.md` | Execute UI redesign based on research | After MANUSCRIPT-RESEARCHER |
| `agents/SOURCE-READER.md` | Extract + cite data from primary/academic sources | When adding new historical data |
| `agents/DATA-STEWARD.md` | Validate + prepare data for upload | After SOURCE-READER |
| `agents/PROSOPO-RESEARCHER.md` | Research prosopography broadly + feature ideas | Before map feature work |
| `agents/MAP-ENHANCER.md` | Implement map + filter + visualization features | After PROSOPO-RESEARCHER |
| `agents/QA.md` | Write + run tests, catch regressions | After any significant change |

### Data Pipeline Detail
```
Source (Dante / Villani / academic book)
    ↓
SOURCE-READER → data/extracted/[name]-REVIEW.xlsx  (you review this)
    ↓
DATA-STEWARD → data/ready-to-upload/[name]-UPLOAD.xlsx  (you paste to Google Sheet)
    ↓
App fetches from Google Sheet automatically
```

### Map Enhancement Pipeline
```
PROSOPO-RESEARCHER → PROSOPO-RESEARCH.md  (research brief)
    ↓
MAP-ENHANCER reads brief + implements features
    ↓
QA writes + runs tests
```

### How to Run an Agent
```bash
# In your terminal, inside the project folder:
claude --agent agents/DESIGNER.md

# Or reference it in a prompt:
# "Follow the instructions in agents/DESIGNER.md"
```

---

## 🔤 Glossary & Taxonomy (for AI context)

### Factions (mutually exclusive per time period — families change)
| Term | Period | Notes |
|---|---|---|
| `Guelph` | pre-1266 | Generic, before the split hardened |
| `Ghibelline` | 1215–1280s | Pro-imperial |
| `White Guelph` | 1295–1302+ | *Guelfi Bianchi* — Cerchi faction |
| `Black Guelph` | 1295–1302+ | *Guelfi Neri* — Donati faction |
| `None` | any | Neutral, retired, or unknown |

### Social Class (separate from faction — record independently)
| Term | Definition |
|---|---|
| `Popolo` | General merchant/artisan class |
| `Popolo Grasso` | Wealthy merchant elite, guild leaders |
| `Grandi` | The noble families — old aristocracy |

### Legal Status
| Term | Definition |
|---|---|
| `Magnate` | Under *Ordinances of Justice* (1293) — families excluded from office |

### General Terms
| Term | Meaning |
|---|---|
| Sestiere | One of Florence's six city districts |
| Consorteria | A family alliance/clan group |
| Priorato | The governing council (est. 1282) |
| Cerchi / Donati | The two families at the heart of the Black/White split |
| Calendimaggio | May Day — the 1300 brawl that triggered the split |
| Ordinances of Justice | 1293 law creating the Magnate legal category |
