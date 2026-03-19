# Theme: Florentine Manuscript — Historical Mode
*Layered ON TOP of Clean Mode via `.historical-mode` CSS class. Never changes layout.*

## Design Movement Name
"Scriptorium Obscurum" — The Dark Workshop

## Design Philosophy
Historical Mode is not decoration — it is archaeological depth. When toggled, the interface
should feel like the user has moved from the reading room into the scriptorium itself:
darker, richer, more complex. Ink stains the margins. Parchment has aged a century further.
The ruled lines are visible now. The rubricator's red has oxidized to something deeper.

This is not a costume. It is the same document, but older — as if the manuscript has been
sitting in a Florentine archive since 1302, and only now opened. Every layer of aging is
intentional, painstaking, the product of someone who has studied the Laurentian Library's
collection and translated that knowledge into CSS with the care of a conservator.

The visual hierarchy becomes more ornate: headings acquire decorative terminals, section
dividers become ruling lines, panels acquire the quality of folio pages.
The map tilts toward cartographic antiquity — sepia-washed, grid-free.

## Additional Colors (Historical Mode only)
```css
/* These SUPPLEMENT the Clean Mode palette — they don't replace it */
--parchment-aged:    #D4B896;   /* darker, more oxidized parchment */
--parchment-stain:   #C9A87C;   /* age stain areas */
--ink-deep:          #1A0D05;   /* older, more concentrated ink */
--rubric-oxidized:   #6B1414;   /* aged red, darker */
--margin-tone:       #E8D5B0;   /* slightly lighter margin areas */
--ruling-line:       rgba(139, 100, 60, 0.25);  /* visible ruled lines */
```

## Historical Mode CSS Block
*This entire block goes under `.historical-mode { }` in index.css.
NEVER put layout properties here. Only visual/aesthetic properties.*

```css
/* ============================================
   HISTORICAL MODE — Scriptorium Obscurum
   Scope: .historical-mode only
   Layout: UNTOUCHED
   ============================================ */

/* Base parchment — aged, richer */
.historical-mode {
  background-color: #D4B896;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 27px,
      rgba(139, 100, 60, 0.12) 27px,
      rgba(139, 100, 60, 0.12) 28px
    ),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
}

/* Typography — more ornate */
.historical-mode h1,
.historical-mode .font-display {
  color: #1A0D05;
  text-shadow: 1px 1px 0 rgba(139,100,60,0.3);
  letter-spacing: 0.08em;
}

/* Header — manuscript title page treatment */
.historical-mode header {
  border-bottom: 2px solid #6B1414;
  background-color: #C9A87C;
  box-shadow: 0 2px 8px rgba(26, 13, 5, 0.15);
}

/* Ruling line on every row */
.historical-mode tr,
.historical-mode .family-card {
  border-bottom: 1px solid rgba(139, 100, 60, 0.2);
}

/* Panels — aged folio treatment */
.historical-mode aside {
  background-color: #CEAD85;
  border-left: 3px solid #6B1414;
  box-shadow: inset -2px 0 8px rgba(26,13,5,0.08);
}

/* Section labels — rubric style */
.historical-mode .faction-label,
.historical-mode [class*="label"] {
  color: #6B1414;
  letter-spacing: 0.2em;
  font-weight: 600;
  border-bottom: 1px solid rgba(107, 20, 20, 0.3);
  padding-bottom: 2px;
}

/* Map — aged cartographic treatment */
.historical-mode .leaflet-container {
  filter: sepia(45%) contrast(90%) brightness(95%) saturate(80%);
}

/* Timeline — chronicle scroll style */
.historical-mode [class*="timeline"],
.historical-mode [class*="slider"] {
  border-top: 2px solid #6B1414;
  background-color: #C9A87C;
}

/* Coat of arms — illuminated frame */
.historical-mode img[class*="coat"],
.historical-mode img[class*="arms"],
.historical-mode img[class*="crest"] {
  border: 2px solid #B8960C;
  box-shadow: 0 0 0 1px #6B1414, 2px 2px 8px rgba(26,13,5,0.3);
  background: #EDD68A;
}

/* Tab navigation — folio tab style */
.historical-mode nav button,
.historical-mode [role="tab"] {
  border-top: 3px solid transparent;
}
.historical-mode nav button[aria-selected="true"],
.historical-mode [role="tab"][aria-selected="true"] {
  border-top-color: #6B1414;
  background-color: #C9A87C;
}

/* Decorative initial — first letter of section headings */
.historical-mode .manuscript-initial::first-letter {
  font-family: 'IM Fell English', serif;
  font-size: 3.5em;
  line-height: 0.7;
  float: left;
  padding-right: 6px;
  color: #6B1414;
  text-shadow: 1px 1px 0 #B8960C;
}

/* Marginalia annotations */
.historical-mode [data-annotation]::after {
  content: attr(data-annotation);
  font-family: 'Crimson Pro', serif;
  font-style: italic;
  font-size: 0.7em;
  color: #5C4033;
  display: block;
  margin-top: 2px;
  opacity: 0.75;
}

/* Year number — the centerpiece */
.historical-mode .year-display {
  color: #1A0D05;
  text-shadow:
    2px 2px 0 rgba(139,100,60,0.4),
    0 0 20px rgba(184, 150, 12, 0.1);
}

/* Chronicle panel — scroll-like */
.historical-mode [class*="chronicle"] {
  background-color: #CEAD85;
  border: 1px solid #6B1414;
  border-radius: 0;
  padding: 12px 16px;
  position: relative;
}
.historical-mode [class*="chronicle"]::before {
  content: '§';
  color: #6B1414;
  font-family: 'IM Fell English', serif;
  font-size: 1.2em;
  margin-right: 8px;
}
```

## Toggle Button Design
The toggle button sits in the header. Two states:

**OFF state** — clean, subtle:
```
[ 📜 Historical Mode ]
```
- Border: 1px solid var(--parchment-deep)
- Background: transparent
- Text: var(--ink-faded), small tracking

**ON state** — illuminated, warm:
```
[ ✦ Scriptorium ✦ ]
```
- Border: 1px solid var(--rubric)
- Background: rgba(184, 150, 12, 0.12) — faint gold glow
- Text: var(--rubric), slightly bolder

Keyboard: `H` key. Show `[H]` as a small hint on hover.

## Anti-Patterns — Never Do These
- No drop shadows that look "digital"
- No blur effects (backdrop-filter: blur — this is not iOS)
- No glow that looks like a video game
- No "parchment" stock photo background images from Unsplash
- The map filter must not be so strong it hides the geographical data
- Animations: NONE. Historical Mode snaps instantly. Pages don't animate.
