# MOBILE-REDESIGN Agent
> CittaFracta — Mobile overhaul
> Stack: React 19 + Vite + TypeScript + Tailwind CSS
> Golden rule: no prefix = mobile, `sm:` = desktop (640px+). **Never remove a `sm:` class.**

---

## Design Philosophy

The desktop user is a researcher. The mobile user wants one thing at a time.
Every screen must answer ONE question. No competing panels.

- **No rounded corners** anywhere. `style={{ borderRadius: 0 }}` on all new components.
- **Unicode sigils only**: § ¶ ✦ ⊕ ◈ ✕ ✓ — no Lucide icons in new mobile UI.
- **44px minimum** on all tap targets. No exceptions.
- **IM Fell English** for year numbers everywhere on mobile.
- **Drop cap** in Chronicle (see Phase 6) — most important single detail.

---

## Read These Files First

```
CLAUDE.md
themes/florentine-clean.md
App.tsx
components/layout/Header.tsx
components/layout/TabNavigation.tsx
components/panels/FamilyDetailsPanel.tsx
components/controls/TimelineSlider.tsx
features/social-map/views/SocialMapView.tsx
features/social-map/HistoricalMap.tsx
features/geo-map/views/CityMapView.tsx
features/geo-map/components/LeftSidebar.tsx (or equivalent)
features/chronicle/components/ChronicleModal.tsx
index.css
```

---

## New Files to Create

```
components/layout/FolioHeader.tsx
components/layout/CodexDock.tsx
components/sheets/YearSheet.tsx
features/geo-map/components/FilterFolio.tsx
```

## Files to Modify

```
App.tsx
components/layout/Header.tsx
components/layout/TabNavigation.tsx
components/panels/FamilyDetailsPanel.tsx
components/controls/TimelineSlider.tsx
features/social-map/views/SocialMapView.tsx
features/social-map/HistoricalMap.tsx
features/geo-map/views/CityMapView.tsx
features/chronicle/components/ChronicleModal.tsx
index.css
```

---

## Phase 1 — Global Shell

**After this phase:** mobile has a compact header and a fixed bottom dock. Desktop is unchanged.

### Step 1: Hide existing header and tabs on mobile

`Header.tsx` → add `hidden sm:block` to the root element.
`TabNavigation.tsx` → add `hidden sm:flex` to the root element.

### Step 2: Create `components/layout/FolioHeader.tsx`

```tsx
import React from 'react';

interface FolioHeaderProps {
  activeTab: string;
  isHistoricalMode: boolean;
  toggleHistoricalMode: () => void;
}

export function FolioHeader({ activeTab, isHistoricalMode, toggleHistoricalMode }: FolioHeaderProps) {
  const title = activeTab === 'city' ? 'CITTÀ DI FIRENZE' : 'FAZIONI';

  return (
    <header className="sm:hidden h-11 flex items-center justify-between px-4 bg-parchment border-b border-parchment-deep shrink-0 z-30">
      <span className="font-label text-earth-orange text-lg select-none">✦</span>

      <span className="font-label text-ink text-[10px] tracking-[0.25em]">
        {title}
      </span>

      <button
        onClick={toggleHistoricalMode}
        className="font-label text-lg min-w-[44px] h-11 flex items-center justify-center"
        style={{ borderRadius: 0 }}
        aria-label="Toggle Historical Mode"
      >
        <span className={isHistoricalMode ? 'text-rubric' : 'text-ink-faded'}>§</span>
      </button>
    </header>
  );
}
```

### Step 3: Create `components/layout/CodexDock.tsx`

```tsx
import React from 'react';

interface CodexDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentYear: number;
  onYearTap: () => void;
}

export function CodexDock({ activeTab, setActiveTab, currentYear, onYearTap }: CodexDockProps) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-14 z-40 bg-parchment border-t border-parchment-deep grid grid-cols-3">

      {/* FAZIONI */}
      <button
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center gap-0.5 ${activeTab === 'map' ? 'text-rubric border-t-2 border-rubric' : 'text-ink-faded'}`}
        style={{ borderRadius: 0 }}
      >
        <span className="font-label text-base leading-none">⊕</span>
        <span className="font-label text-[8px] tracking-widest">FAZIONI</span>
      </button>

      {/* ANNO */}
      <button
        onClick={onYearTap}
        className="flex flex-col items-center justify-center"
        style={{ borderRadius: 0 }}
        aria-label="Open year navigation"
      >
        <span className="font-display text-[20px] text-ink leading-none">{currentYear}</span>
        <span className="font-label text-[6px] tracking-widest text-ink-faded mt-0.5">ANNO DOMINI</span>
      </button>

      {/* CITTÀ */}
      <button
        onClick={() => setActiveTab('city')}
        className={`flex flex-col items-center justify-center gap-0.5 ${activeTab === 'city' ? 'text-rubric border-t-2 border-rubric' : 'text-ink-faded'}`}
        style={{ borderRadius: 0 }}
      >
        <span className="font-label text-base leading-none">◈</span>
        <span className="font-label text-[8px] tracking-widest">CITTÀ</span>
      </button>

    </nav>
  );
}
```

### Step 4: Update `App.tsx`

Add imports:
```tsx
import { FolioHeader } from './components/layout/FolioHeader';
import { CodexDock } from './components/layout/CodexDock';
```

Add state:
```tsx
const [yearSheetOpen, setYearSheetOpen] = useState(false);
```

Confirm `useHistoricalMode` is called:
```tsx
const { isHistoricalMode, toggleHistoricalMode } = useHistoricalMode();
```

Add `pb-14 sm:pb-0` to the main content wrapper.

Render before the existing desktop `<header>`:
```tsx
<FolioHeader
  activeTab={activeTab}
  isHistoricalMode={isHistoricalMode}
  toggleHistoricalMode={toggleHistoricalMode}
/>
```

Render after `</main>`:
```tsx
<CodexDock
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  currentYear={currentYear}
  onYearTap={() => setYearSheetOpen(true)}
/>
```

**Run `npm run build`. Fix any errors before Phase 2.**

---

## Phase 2 — Faction Grid (Social Map)

**Problem:** The faction grid is 95% empty on mobile. Families are crammed into one corner.
**Fix:** Full-width two-column grid. No horizontal scroll.

In `HistoricalMap.tsx` (or wherever family cells render):

**Grid outer wrapper** — add: `w-full overflow-y-auto overflow-x-hidden`

**Column headers row** (GHIBELLINI / GUELFI) — add:
```
sticky top-0 z-20 bg-parchment grid grid-cols-2
```
Each header cell:
```
h-9 flex items-center justify-center font-label text-[9px] tracking-[0.2em] text-rubric border-b border-parchment-deep
```

**Class row dividers** (GRANDI / GRASSI / POPOLO):
```
col-span-2 h-7 flex items-center px-3 font-label text-[8px] tracking-[0.3em] italic text-ink-faded bg-parchment-mid border-y border-parchment-deep
```

**Each family cell:**
```
min-h-[52px] flex items-center gap-2 px-2 border border-parchment-deep/40
```
Add `style={{ touchAction: 'manipulation' }}`.
Selected: `border-l-4 border-rubric bg-parchment-mid`

**Inside family cell:**
- Coat of arms: `w-7 h-7 object-contain shrink-0`
- Name: `font-display text-[13px] text-ink leading-tight overflow-hidden text-ellipsis whitespace-nowrap`

**Hide timeline on mobile:**
- `TimelineSlider` wrapper: add `hidden sm:flex` (or `hidden sm:block`)
- `TimelinePanel` right sidebar: add `hidden sm:flex`

**Run `npm run build`. Fix errors before Phase 3.**

---

## Phase 3 — Year Sheet

**Create `components/sheets/YearSheet.tsx`**

```tsx
import React from 'react';

interface YearSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  activeEventTitle?: string;
  onPrevEvent: () => void;
  onNextEvent: () => void;
  timelineSlider: React.ReactNode;
}

export function YearSheet({
  isOpen, onClose, currentYear, isPlaying, setIsPlaying,
  activeEventTitle, onPrevEvent, onNextEvent, timelineSlider
}: YearSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="sm:hidden fixed inset-0 bg-ink/20 z-40" onClick={onClose} />

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-parchment border-t-2 border-parchment-deep flex flex-col max-h-[60vh] sheet-open">

        <div className="w-12 h-0.5 bg-parchment-deep/60 mx-auto mt-3 mb-3 shrink-0" />

        <p className="font-display text-5xl text-ink text-center leading-none mb-2 shrink-0">
          {currentYear}
        </p>

        {activeEventTitle && (
          <p className="font-serif text-sm text-ink-faded italic text-center px-8 mb-4 shrink-0 line-clamp-2">
            {activeEventTitle}
          </p>
        )}

        <div className="flex justify-center gap-12 mb-4 shrink-0">
          <button onClick={onPrevEvent} className="font-label text-[9px] tracking-wide text-rubric min-h-[44px] px-4" style={{ borderRadius: 0 }}>
            ◀ PRECEDENTE
          </button>
          <button onClick={onNextEvent} className="font-label text-[9px] tracking-wide text-rubric min-h-[44px] px-4" style={{ borderRadius: 0 }}>
            SUCCESSIVO ▶
          </button>
        </div>

        <div className="px-5 shrink-0">{timelineSlider}</div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-4/5 mx-auto h-12 mt-4 mb-6 font-label text-[10px] tracking-[0.3em] shrink-0 border ${
            isPlaying ? 'bg-parchment-deep text-ink border-parchment-deep' : 'bg-rubric text-parchment border-rubric'
          }`}
          style={{ borderRadius: 0 }}
        >
          {isPlaying ? '◼  FERMA' : '▶  AVANZA NEL TEMPO'}
        </button>

      </div>
    </>
  );
}
```

In `App.tsx`, import `YearSheet` and render it below `CodexDock`. Pass `<TimelineSlider ... />` as the `timelineSlider` prop so the real slider is reused.

**Run `npm run build`. Fix errors before Phase 4.**

---

## Phase 4 — City Map

**Problem:** Left sidebar takes ~60% of mobile screen. Map is barely visible.
**Fix:** Sidebar hidden on mobile. Map full screen. Floating controls overlay.

In `CityMapView.tsx`:

1. Add `hidden sm:flex` (or `hidden sm:block`) to the `LeftSidebar` container.

2. Confirm map container is `w-full h-full` without being constrained by a flex sibling.

3. Add floating year pill (inside map container, which needs `position: relative`):
```tsx
<div
  className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-parchment/90 border border-parchment-deep px-4 py-1.5 font-display text-sm text-ink pointer-events-none"
  style={{ borderRadius: 0 }}
>
  {currentYear}
</div>
```

4. Add floating filter button:
```tsx
<button
  onClick={() => setFilterFolioOpen(true)}
  className="sm:hidden absolute z-[1000] w-11 h-11 bg-parchment border border-parchment-deep flex items-center justify-center font-label text-rubric text-xl"
  style={{ borderRadius: 0, bottom: '88px', right: '16px', boxShadow: '2px 2px 0 rgba(44,26,14,0.15)' }}
  aria-label="Open filters"
>
  §
</button>
```

5. Add state: `const [filterFolioOpen, setFilterFolioOpen] = useState(false);`

### Create `features/geo-map/components/FilterFolio.tsx`

A bottom sheet with all the same controls as LeftSidebar. Receives the same props from parent.

Structure:
- **Backdrop:** `fixed inset-0 bg-ink/15 z-40 sm:hidden`, tap to close
- **Sheet:** `fixed bottom-0 left-0 right-0 z-50 bg-parchment border-t-2 border-parchment-deep max-h-[70vh] flex flex-col sm:hidden sheet-open`
- **Header:** `flex justify-between items-center px-4 h-11 shrink-0 border-b border-parchment-deep`
  - Left: `<span className="font-label text-[9px] tracking-[0.3em] text-rubric">§ FILTRI</span>`
  - Right: close button `✕` min 44×44px, `style={{ borderRadius: 0 }}`
- **Scrollable body:** `flex-1 overflow-y-auto px-4 pb-8`

Section label pattern:
```tsx
<p className="font-label text-[8px] tracking-[0.3em] text-ink-faded mt-5 mb-2">¶ STRATI DELLA MAPPA</p>
```

Map layer buttons (CLEAN / SATELLITE / DARK):
```tsx
<div className="flex gap-1">
  {['CLEAN', 'SATELLITE', 'DARK'].map(layer => (
    <button key={layer}
      onClick={() => setLayer(layer)}
      className={`flex-1 h-9 border font-label text-[8px] tracking-[0.1em] ${
        activeLayer === layer ? 'bg-parchment-deep border-ink text-ink' : 'border-parchment-deep text-ink-faded'
      }`}
      style={{ borderRadius: 0 }}
    >
      {layer}
    </button>
  ))}
</div>
```

Manuscript checkbox (replace all iOS toggles):
```tsx
<button
  onClick={() => setEnabled(!enabled)}
  className="w-6 h-6 border border-ink-faded flex items-center justify-center font-label text-rubric text-sm"
  style={{ borderRadius: 0, minHeight: 'unset', minWidth: 'unset' }}
>
  {enabled ? '✓' : ''}
</button>
```

Relationship buttons: 2×2 grid, each `h-11 border border-parchment-deep font-label text-[8px]`, active: `text-rubric border-rubric`, `style={{ borderRadius: 0 }}`

**Run `npm run build`. Fix errors before Phase 5.**

---

## Phase 5 — Family Details Panel

In `FamilyDetailsPanel.tsx`:

**Panel root:**
- Remove any rounded top corners (no `rounded-t-*`)
- Add `style={{ borderRadius: 0 }}`
- Add `max-h-[82vh] sm:max-h-full`
- Add `border-t-2 border-parchment-deep`

**Drag handle** (add before panel content):
```tsx
<div className="sm:hidden w-12 h-0.5 bg-parchment-deep/60 mx-auto mt-3 mb-3" />
```

**Family header** (non-scrolling, `shrink-0`):
```
flex items-start gap-3 px-4 pb-4 border-b border-parchment-deep
```
- Coat of arms: `w-14 h-14 object-contain shrink-0`
- Name: `font-display text-xl text-ink leading-tight`
- Faction: `font-label text-[9px] tracking-[0.2em] text-rubric`
- Class: `font-label text-[9px] tracking-[0.2em] text-ink-faded`

**Scrollable body:** `flex-1 overflow-y-auto px-4 py-4`

Section header pattern:
```tsx
<div className="flex items-center gap-2 mb-2">
  <span className="font-label text-xs text-rubric">§</span>
  <span className="font-label text-[8px] tracking-[0.3em] text-ink-faded uppercase">Stato Politico</span>
</div>
```
Use § ¶ ✦ for different sections.

Between sections: `<hr className="border-t border-parchment-deep my-4" />`

**Close button** (`shrink-0`, non-scrolling):
```tsx
<button
  onClick={onClose}
  className="shrink-0 mx-4 mb-4 mt-auto w-[calc(100%-2rem)] h-12 border border-rubric/40 bg-transparent font-label text-[9px] tracking-[0.3em] text-rubric"
  style={{ borderRadius: 0 }}
>
  ✕  CHIUDI
</button>
```

**Run `npm run build`. Fix errors before Phase 6.**

---

## Phase 6 — Chronicle Modal (Full-Screen Folio)

This is the highest-impact phase. The drop cap is the single detail that makes this app feel genuinely medieval.

In `ChronicleModal.tsx`, detect mobile and render differently:

```tsx
// Add near top of component:
const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

// Mobile rendering — return early with full-screen folio:
if (isMobile && isOpen) {
  return (
    <div className="fixed inset-0 z-50 bg-parchment flex flex-col">

      {/* Header */}
      <div className="h-11 flex items-center justify-between px-4 border-b border-parchment-deep shrink-0">
        <button
          onClick={onClose}
          className="font-label text-[9px] tracking-wide text-rubric min-h-[44px] flex items-center"
          style={{ borderRadius: 0 }}
        >
          ← TORNA
        </button>
        <span className="font-label text-[8px] tracking-[0.3em] text-ink-faded">CRONACA</span>
        <div className="w-16" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        <p className="font-display text-4xl text-ink leading-none pb-2 mb-6 border-b border-rubric/40 inline-block">
          {event.year}
        </p>

        {/* THE DROP CAP — most important detail in the entire app */}
        <div className="font-serif text-base text-ink leading-[1.8]">
          <span
            className="text-rubric float-left leading-none mr-3 mb-1 select-none"
            style={{ fontFamily: "'IM Fell English', serif", fontSize: '72px', lineHeight: 0.85 }}
            aria-hidden="true"
          >
            {event.description[0]}
          </span>
          {event.description.slice(1)}
        </div>

      </div>
    </div>
  );
}

// Desktop: existing modal code continues below (unchanged)
```

**Run `npm run build`. Fix errors before Phase 7.**

---

## Phase 7 — Touch & Motion System

Append to end of `index.css`:

```css
/* ═══════════════════════════════════════
   MOBILE — Touch & Motion
   ═══════════════════════════════════════ */

@media (max-width: 639px) {

  button, [role="button"], a[href], input, select {
    min-height: 44px;
    touch-action: manipulation;
  }
  .touch-exempt {
    min-height: unset !important;
    min-width: unset !important;
  }

  button:active, [role="button"]:active {
    opacity: 0.7;
    transform: scale(0.97);
    transition: none;
  }
  button, [role="button"] {
    transition: opacity 150ms ease-out, transform 150ms ease-out;
  }

  .overflow-y-auto, .overflow-auto {
    -webkit-overflow-scrolling: touch;
  }

  body, #root {
    overflow-x: hidden;
    max-width: 100vw;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes slideDown {
    from { transform: translateY(0); }
    to   { transform: translateY(100%); }
  }
  .sheet-open  { animation: slideUp  200ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .sheet-close { animation: slideDown 180ms ease-in forwards; }

  .leaflet-control-zoom a {
    width: 40px !important;
    height: 40px !important;
    line-height: 40px !important;
    font-size: 20px !important;
  }
  .leaflet-control-attribution {
    font-size: 8px !important;
  }
}
```

---

## Phase 8 — Loading State

In `App.tsx`, update the loading return:

```tsx
if (isLoading) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-parchment select-none px-8 gap-6 text-center">
      <span
        className="text-9xl text-rubric animate-pulse"
        style={{ fontFamily: "'IM Fell English', serif", opacity: 0.18, lineHeight: 1 }}
        aria-hidden="true"
      >
        F
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="font-label text-rubric text-[10px] tracking-[0.4em]">ARCHIVIO FIORENTINO</p>
        <p className="font-serif text-sm text-ink-faded italic">Caricamento dei registri storici…</p>
      </div>
    </div>
  );
}
```

---

## Phase 9 — Verify Historical Mode

In `App.tsx`, confirm:
1. `const { isHistoricalMode, toggleHistoricalMode } = useHistoricalMode();` is present
2. Root div toggles `historical-mode` class based on `isHistoricalMode`
3. `FolioHeader` receives both props

No new code needed — just verify these three things.

---

## Phase 10 — Final Audit

```bash
npm run build
# Must show 0 TypeScript errors
```

Resize browser to 390px wide and check:

- [ ] FolioHeader visible (44px), original Header hidden on mobileמם
- [ ] CodexDock fixed bottom, FAZIONI + year + CITTÀ, no content hidden behind it
- [ ] Faction grid: full width, both columns visible, no empty left region
- [ ] Tap family → bottom sheet rises
- [ ] Tap ANNO in dock → YearSheet rises, large year, play button
- [ ] City map: full screen, no sidebar, § button visible
- [ ] Tap § → FilterFolio with manuscript checkboxes (no iOS toggles)
- [ ] Family panel: no rounded corners, coat of arms + IM Fell English name
- [ ] Chronicle: full screen, **drop cap visible** (72px rubric letter, float left)
- [ ] All buttons respond immediately on tap
- [ ] No horizontal scroll anywhere
- [ ] Desktop layout unchanged at 640px+
