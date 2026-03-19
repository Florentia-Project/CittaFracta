# Agent: DESIGNER
> **Role:** UI/UX Redesign Executor
> **Prerequisite: `DESIGN-RESEARCH.md` must exist in the project root.**
> **If it doesn't exist, stop and tell the user to run MANUSCRIPT-RESEARCHER first.**

---

## Your Mission

You will implement two things:

1. **A permanent base improvement** — apply the beautiful fonts and parchment colors
   from `DESIGN-RESEARCH.md` to the existing layout WITHOUT moving anything.

2. **A "Historical Mode" feature** — a toggle that layers the full manuscript
   treatment ON TOP of the clean layout. When off, the app looks clean and functional.
   When on, it looks like a 13th century Florentine manuscript.

---

## IRON RULES — Read Before Touching Anything

### The Layout Is Untouchable
The current desktop layout MUST remain pixel-identical in structure:
- The faction matrix fills the main area
- The right sidebar has the year display, play/pause, chronicle, controls
- The timeline sits at the bottom
- The family details panel slides in from the right

**You are adding a costume. You are not moving the furniture.**

If you find yourself changing `flex-direction`, `width`, `height`, `position`,
`translate`, or any layout-affecting property on a major container — STOP.
That is not your job. Revert it.

### The `sm:` Rule
Every class you add that affects layout must have a `sm:` desktop version.
Never add a class that changes desktop layout without preserving the existing `sm:` behavior.

### One Phase, Then Verify
After every phase: run `npm run dev`, open the browser, confirm the layout is identical
to before. If anything moved — revert that file with `git checkout [filename]` and report.

### Read Before Touching
Read every file completely before editing it. If you don't understand what a class does,
check `index.css` and Tailwind config first. Do not guess.

---

## Before You Start

1. Read `CLAUDE.md` fully
2. Read `DESIGN-RESEARCH.md` fully  
3. Run `npm run build` — confirm zero errors
4. Read these files completely:
   - `index.css`, `index.html`, `App.tsx`
   - `components/layout/Header.tsx`
   - `components/layout/TabNavigation.tsx`
   - `components/panels/FamilyDetailsPanel.tsx`
   - `components/controls/TimelineSlider.tsx`
   - `hooks/useTimeline.ts` (to understand keyboard shortcut pattern)
5. Write down the current desktop layout in one sentence before touching anything.
   If you can't describe it accurately, keep reading until you can.

---

## Phase 1: Base Fonts & Colors (safest — no layout risk)

**Files: `index.css`, `index.html` only**

- [ ] Import fonts from `DESIGN-RESEARCH.md` in `index.html` (Google Fonts, preconnect)
- [ ] Set `font-display` and `font-serif` to the researched fonts
- [ ] Update color token VALUES only — do NOT rename any tokens
  - `bg-parchment` → update the hex value
  - `text-ink` → update the hex value
  - `earth-orange` → update the hex value
  - Add any new tokens the research recommends
- [ ] Add a subtle paper texture to `bg-parchment` using CSS background-image if the
  research recommends one

**Verify:** `npm run dev` → layout identical, fonts changed, colors improved.

---

## Phase 2: Header Typography (cosmetic only)

**File: `components/layout/Header.tsx` only**

Allowed:
- [ ] Change font size, weight, letter-spacing classes on the title text
- [ ] Change text color classes
- [ ] Add a subtle ruling line decoration (CSS border, not a new element)

NOT allowed:
- Do NOT change flex layout of the header row
- Do NOT change the position of the tab navigation relative to the title
- Do NOT change padding so much that header height changes significantly

**Verify:** Header looks manuscript-inspired. Layout unchanged.

---

## Phase 3: Historical Mode — The Toggle System

**This is the main feature. Build it carefully.**

### What Historical Mode Does

When `isHistoricalMode = true`, apply CSS classes that add:
- Richer parchment texture (darker, more aged)
- More ornate typography (decorative initials, rubric-style headings)
- Sepia/aged color treatment
- Marginalia-style annotations on the family panel
- Ink and texture effects

When `isHistoricalMode = false`, the app looks clean and functional (current style).

**Crucially: the layout NEVER changes. Only visual styling changes.**

### Step 3a: Create the state and context

Create `hooks/useHistoricalMode.ts`:
```typescript
// Manages Historical Mode state with keyboard shortcut (H key)
// Returns: { isHistoricalMode, toggleHistoricalMode }
// Keyboard: pressing 'H' toggles (when not typing in an input)
// Persists to localStorage so it remembers between sessions
```

### Step 3b: Add toggle button to Header

In `components/layout/Header.tsx`, add a toggle button:
- Position: in the header, near the tab navigation (right side)
- OFF state: simple, clean — label "Historical Mode" or a scroll icon
- ON state: slightly illuminated, warm — indicates active
- Keyboard shortcut: `H` — show this as a hint on hover
- Style: must match the manuscript aesthetic — not a generic toggle switch

### Step 3c: Add mode class to App root

In `App.tsx`, add the `isHistoricalMode` state via the hook.
Apply a class to the root div: `historical-mode` when active.
```tsx
<div className={`h-screen ... ${isHistoricalMode ? 'historical-mode' : ''}`}>
```

### Step 3d: Create Historical Mode CSS

In `index.css`, create a `historical-mode` section:

```css
/* ============================================
   HISTORICAL MODE — Full Manuscript Treatment
   All styles scoped to .historical-mode
   Layout is NEVER changed here — only visuals
   ============================================ */

.historical-mode {
  /* Richer parchment — darker, more aged */
}

.historical-mode .font-display {
  /* More ornate — decorative letter-spacing, text-shadow for depth */
}

.historical-mode header {
  /* Ruling line treatment — red ink border */
}

.historical-mode [data-panel] {
  /* Ledger/folio treatment */
}

/* Sepia treatment on map containers */
.historical-mode .leaflet-container {
  filter: sepia(30%) contrast(95%);
}

/* Marginalia annotation style for labels */
.historical-mode .faction-label,
.historical-mode .family-label {
  /* Manuscript annotation look */
}
```

Use everything from `DESIGN-RESEARCH.md` in this section:
- All the textures, patterns, decorative elements go HERE
- The ornate typography goes HERE
- The ink effects go HERE
- The sepia treatment goes HERE

The base styles (outside `.historical-mode`) stay clean and functional.

---

## Phase 4: Family Details Panel Polish

**File: `components/panels/FamilyDetailsPanel.tsx`**

Base (always):
- [ ] Clean typography improvements — name as a stronger heading
- [ ] Ruled line dividers between sections

Historical Mode additions (in `index.css` under `.historical-mode`):
- [ ] Ledger-style row treatment
- [ ] Marginalia annotation styling for faction/alliance info
- [ ] Coat of arms framed like a manuscript miniature
- [ ] More ornate heading treatment

---

## Phase 5: Timeline Polish

**File: `components/controls/TimelineSlider.tsx`**

Base (always):
- [ ] Clean typography for year markers and event names
- [ ] Color updates to match new palette

Historical Mode additions (in `index.css`):
- [ ] Year markers styled as chronicle chapter markers
- [ ] Event markers as marginal scroll annotations

---

## Phase 6: Final Verification

- [ ] `npm run build` → zero errors
- [ ] Desktop layout identical to before in both modes
- [ ] Mobile layout still works in both modes  
- [ ] `H` key toggles correctly
- [ ] Button in header toggles correctly
- [ ] Historical mode CSS doesn't affect layout — only visuals
- [ ] Both modes look intentional, not broken

---

## If Anything Breaks

```bash
# Revert a specific file
git checkout components/layout/Header.tsx

# Revert everything
git checkout .

# See what changed
git diff
```

Tell the user: what broke, in which file, what you tried, what you're reverting.