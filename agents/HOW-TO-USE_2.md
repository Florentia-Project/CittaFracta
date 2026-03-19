# How to Use the CittaFracta Agent System

---

## The Agents

| Agent | What it does | Run order |
|---|---|---|
| MANUSCRIPT-RESEARCHER | Researches Florentine manuscript aesthetics, generates CSS | 1st |
| DESIGNER | Implements fonts, colors, Historical Mode toggle | 2nd |
| ORNAMENT-MAKER | Creates SVG decorative assets + animated texture | 3rd |
| SOURCE-READER | Extracts historical data from sources | Any time |
| DATA-STEWARD | Validates and prepares data for upload | After SOURCE-READER |
| PROSOPO-RESEARCHER | Researches prosopography features | Any time |
| MAP-ENHANCER | Implements map filters and visualizations | After PROSOPO-RESEARCHER |
| QA | Tests and fixes bugs | Any time |

---

## Design Track (run in order)

**Step 1 — Research:**
```
Read CLAUDE.md then read agents/MANUSCRIPT-RESEARCHER.md and follow its instructions completely.
```
This creates `DESIGN-RESEARCH.md` in your project root.

**Step 2 — Design implementation:**
```
Read CLAUDE.md, then read themes/florentine-clean.md and themes/florentine-historical.md,
then read DESIGN-RESEARCH.md, then read agents/DESIGNER.md and follow Phase 1 only.
Show me the result before continuing.
```
Run Phase 1 first. Check it. Then ask for Phase 2, and so on.

**Step 3 — Ornaments:**
```
Read CLAUDE.md then read agents/ORNAMENT-MAKER.md and follow Part 1 first.
Create all SVG ornaments, show me the result, then proceed to Part 2.
```

---

## Before Each Session

Always start with:
```
Read CLAUDE.md before doing anything.
```

---

## If Something Breaks

In your terminal (PowerShell or Git Bash):
```powershell
# See what changed
git diff

# Revert ONE file
git checkout src/components/layout/Header.tsx

# Revert EVERYTHING (nuclear option)
git checkout .
```

---

## The Two Modes Explained

**Clean Mode** (default, always on):
- Manuscript fonts: IM Fell English, Cinzel, Crimson Pro
- Warm parchment colors
- Clean readable layout — same as before but more beautiful

**Historical Mode** (press H or click button in header):
- Same layout, same data
- Richer aged parchment, visible ruling lines
- Sepia map treatment
- Ornate rubric headings
- Marginalia annotation effects

The layout NEVER changes between modes. Only visual styling.

---

## File Locations

```
cittaFracta/
├── CLAUDE.md                           ← always read first
├── DESIGN-RESEARCH.md                  ← created by MANUSCRIPT-RESEARCHER
├── themes/
│   ├── florentine-clean.md             ← Clean Mode theme spec
│   └── florentine-historical.md        ← Historical Mode theme spec
├── agents/                             ← all agent instructions
├── public/
│   └── assets/
│       ├── ornaments/                  ← created by ORNAMENT-MAKER
│       └── textures/                   ← created by ORNAMENT-MAKER
└── src/
    └── hooks/
        └── useHistoricalMode.ts        ← created by DESIGNER
```
