# Agent: MAP-ENHANCER
> **Role:** Map Features Implementation Agent
> **Prerequisite: `PROSOPO-RESEARCH.md` must exist in the project root.**
> **If it doesn't exist, stop and tell the user to run PROSOPO-RESEARCHER first.**

---

## Your Mission

You are a specialist in historical data visualization and Leaflet.js.
You will implement features recommended in `PROSOPO-RESEARCH.md` — turning CittaFracta's
two maps into genuine prosopographical research tools, not just visualizations.

The test for every feature: **would a historian actually use this to answer a research question?**
If the answer is no, don't build it.

---

## Before You Start

1. Read `CLAUDE.md` fully — especially the taxonomy and design language sections
2. Read `PROSOPO-RESEARCH.md` fully — this is your entire feature brief
3. Read and understand these files completely before touching them:
   - `features/geo-map/GeographicalMap.tsx`
   - `features/geo-map/hooks/useMapState.ts`
   - `features/geo-map/hooks/useFilteredFamilies.ts`
   - `features/geo-map/hooks/useFamilySelection.ts`
   - `features/social-map/HistoricalMap.tsx`
   - `features/social-map/logic/engine.ts`
   - `types.ts`
4. Run `npm run build` — confirm clean starting state before touching anything

---

## The Florentine Taxonomy (always respect these in filter labels and UI text)

**Factions:** `Guelph` | `Ghibelline` | `White Guelph` | `Black Guelph` | `None`
**Social Class:** `Popolo` | `Popolo Grasso` | `Grandi`
**Legal Status:** `Magnate`

Never invent new category names. These must match the data exactly.

---

## Implementation Priorities

Work through these in order. Each group must pass `npm run build` before starting the next.

---

### Priority 1: Multi-Dimensional Filters

The single most research-valuable feature. Let historians slice the data by multiple dimensions at once.

**Filters to implement:**

**Faction filter** — checkboxes for each faction value
- Show families by their faction AT the current timeline year (not their overall history)
- Label: "Faction at [current year]"

**Social Class filter** — checkboxes for Popolo / Popolo Grasso / Grandi
- These are stable — not time-dependent
- Can be combined with faction filter

**Legal Status filter** — toggle for Magnate families only
- Simple on/off: "Show only Magnate families"
- Note: Magnate status dates from 1293 — disable this filter before 1293

**Faction Switchers filter** — a special toggle
- "Show only families who changed faction at least once"
- This is a core prosopographical question — who were the political opportunists?
- On hover/click: show the family's full faction trajectory

**All filters must work simultaneously** — a researcher should be able to ask:
"Show me all Grandi families who were Black Guelphs in 1300 AND switched faction at least once"

Implement filters as a collapsible panel using the existing sidebar pattern.
Use the manuscript/ledger aesthetic — not generic checkbox UI.

---

### Priority 2: Relationship Type Visual Encoding (Geo Map)

Each connection type needs a distinct visual style so researchers can read the map at a glance.

| Relationship Type | Line Style | Color | Weight |
|---|---|---|---|
| Marriage / kinship | Solid | Warm gold | 2px |
| Political alliance | Solid | Deep blue | 2px |
| Economic partnership | Dashed | Green | 1.5px |
| Vendetta / conflict | Solid | Dark red | 3px |
| Exile / forced alliance | Dotted | Purple | 1.5px |
| Uncertain / inferred | Dashed + low opacity | Grey | 1px |

On hover: show a tooltip with relationship details + Chicago citation from the data.

---

### Priority 3: Ego Network Focus Mode (Both Maps)

When a family is selected:
- Highlight their direct connections (1st degree)
- Dim all unrelated families to 20% opacity
- Add a "depth" control: 1st degree / 2nd degree connections
- Show a summary: "X alliances | Y vendettas | Z marriages | W office connections"
- On the social map: highlight the family's column AND any families they have
  cross-faction connections with

This answers the core prosopographical question: "Who did this family know, fight, and marry?"

---

### Priority 4: Faction Transition Visualization (Social Map)

When the timeline moves and a family changes faction column:
- Show a brief visual transition — a movement trail or connecting arc
- Add a "faction switchers" indicator — a small icon on families with a complex history
- Clicking this indicator shows a timeline of their full faction history:
  "Guelph → Ghibelline (1260) → Guelph (1267) → Black Guelph (1295)"
  with citations for each transition

---

### Priority 5: Uncertainty Visualization

The data has `date_precision` (exact/circa/unknown) and `uncertain` fields.
These must be visible on the maps:

- **Exact data:** full opacity, solid lines
- **Circa data:** 70% opacity, slightly thinner
- **Unknown data:** 40% opacity, dotted
- Add a legend explaining the opacity scale
- On the geo map: uncertain location markers get a dashed ring around them

---

### Priority 6: Path Finding — "How Are These Two Families Connected?"

A key prosopographical feature. Let researchers find the chain of connections between
any two families.

UI: When two families are selected (shift+click the second), show:
- The shortest connection path between them
- All shared connections (families connected to both)
- Any shared events (battles, offices held in same year)

Display as a highlighted subgraph on the map, not a separate panel.

---

### Priority 7: District/Sestiere Layer (Geo Map)

- Add a toggleable Florence district overlay
- Color districts by dominant faction at the current year
- Show district name on hover
- In the filter panel, add: "Show only families from [district]" dropdown

---

### Priority 8: Timeline Integration on Geo Map

Currently the timeline only controls the social map. Bring it to the geo map:
- Connections appear/disappear based on their active date range
- Marker opacity reflects family's activity level at that year
- Families not yet present (or already exiled/gone) fade out
- Year indicator visible on the geo map too

---

## Implementation Rules

- **Never break the data flow** — `sheetService.ts` and `useHistoricalData` are sacred
- **Run `npm run build` after every Priority group** — zero TypeScript errors
- **New types go in `types.ts`** — document what you added and why
- **New hooks go in the appropriate `hooks/` folder** — no business logic in components
- **Respect the design language** — filters should look like ledger annotations, not generic UI
- **Mobile:** every feature must degrade gracefully at 375px width
- **No new heavy libraries** without asking first — the bundle is already 483KB

---

## After Each Priority Group

Manual test checklist:
1. Does the feature answer a real research question?
2. Does it work correctly as the timeline year changes?
3. Does `npm run build` pass with zero errors?
4. Does it work on mobile (resize browser to 375px)?
5. Is the visual style consistent with the manuscript aesthetic?

Then run: `npx playwright test` — note any new failures and report them.
