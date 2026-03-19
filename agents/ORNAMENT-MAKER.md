# ORNAMENT-MAKER Agent
> CittaFracta — Florentine Marginalia & Ornament System
> Inspired by: Pentiment (Obsidian, 2022) × 13th century Florentine illuminated manuscripts
> Output: SVG files in `public/assets/ornaments/` and `public/assets/marginalia/`

---

## Your Mission

Create the complete decorative ornament system for Scriptorium mode.
You are producing SVG assets that look hand-drawn in the style of 13th century
Florentine manuscripts — NOT generic medieval clip art, NOT modern flat icons.

Study the Florentine manuscript tradition before drawing anything:
- The Biblioteca Medicea Laurenziana holds the canonical examples
- Key works: Bibbia Atlantica, the Laudario of the Compagnia di Sant'Agnese
- Style: bold outlines, limited flat colour fills, no gradients, no shading
- Everything looks like it was painted with a broad quill and then outlined in iron gall ink

---

## The Florentine Pigment Palette (STRICT — use ONLY these values)

```css
--vellum:        #F2E8D0   /* warm off-white — the page itself */
--iron-gall:     #2C1A0E   /* near-black ink — all outlines */
--vermillion:    #C0392B   /* red — rubric headings, dragon tongues, emphasis */
--ultramarine:   #1F3A7A   /* expensive blue — Guelph heraldry, sky, robes */
--verdigris:     #3D7A5A   /* green — foliage, vines, hybrid creature scales */
--gold-leaf:     #C9A84C   /* gold — halos, initial letters, borders */
--ochre:         #B8860B   /* yellow-brown — secondary fills */
--lead-white:    #EDE8DC   /* highlight — used sparingly on faces, gems */
```

No other colours. No gradients. No drop shadows. No opacity below 0.85.
Outlines are always `--iron-gall` at stroke-width 1.5–2.5px.

---

## What to Create

### Set 1: Border Elements (the ruling system)

**File: `public/assets/ornaments/border-horizontal.svg`**
A horizontal ruling line, 800px wide × 20px tall.
- Double ruled line (two parallel lines 4px apart)
- Small ink blot at left end (a natural imperfection)
- A tiny Florentine lily (*giglio*) centered between the lines
- Colour: iron-gall on vellum

**File: `public/assets/ornaments/border-corner.svg`**
A corner ornament, 60px × 60px.
- Acanthus leaf curling inward
- One small dot cluster (common in Florentine ms borders)
- Colour: verdigris leaf, iron-gall outline, gold-leaf dot

**File: `public/assets/ornaments/border-vertical.svg`**
A vertical ruling strip, 20px wide × 600px tall.
- Continuous vine of small acanthus leaves
- Occasional berry cluster
- Colour: verdigris, iron-gall outline

### Set 2: Florentine Symbols

**File: `public/assets/ornaments/giglio.svg`**
The Florentine lily (*giglio fiorentino*), 40px × 48px.
- Three petals, stylized — NOT photorealistic
- Exactly as it appears on the Florentine coat of arms
- Use: section dividers, bullet points, decorative accents
- Colour: vermillion on vellum (or gold-leaf variant)

**File: `public/assets/ornaments/marzocco-head.svg`**
The Marzocco lion head, 48px × 48px.
- Simple heraldic lion face, full front view
- Bold outline style — like a seal or coin
- Use: Guelph sections, power indicators
- Colour: gold-leaf fill, iron-gall outline

**File: `public/assets/ornaments/tower.svg`**
A Florentine tower (*torre*), 32px × 56px.
- Simple rectangular tower with battlements (*merlature guelfe* — square tops)
- Small window openings
- Use: Grandi family indicator, power sections
- Colour: ochre fill, iron-gall outline

**File: `public/assets/ornaments/eagle.svg`**
The Ghibelline imperial eagle, 48px × 40px.
- Heraldic spread eagle, facing right
- Simple flat style — NOT detailed feathers
- Use: Ghibelline faction sections
- Colour: iron-gall on gold-leaf, or iron-gall on vellum

### Set 3: Marginalia Creatures (the Pentiment element)

These are the hybrid creatures that live in manuscript margins.
Each one is 64px × 64px. Each one looks like a monk drew it while distracted.
Slightly imperfect. Slightly charming. Definitely alive.

**File: `public/assets/marginalia/creature-dragon.svg`**
A small wyvern/dragon in profile. Florentine manuscripts love these.
- Two legs (not four — manuscript artists often simplified)
- Curling tail
- Small wing
- Tongue out (vermillion)
- Colour: verdigris body, iron-gall outline, vermillion tongue

**File: `public/assets/marginalia/creature-lion.svg`**
A rampant lion, but small and slightly goofy — marginalia style.
- Standing on hind legs
- One paw raised
- Wide eyes (manuscript creatures are always slightly surprised-looking)
- Colour: gold-leaf/ochre body, iron-gall outline

**File: `public/assets/marginalia/creature-hybrid.svg`**
A hybrid creature — bird body, human head, wearing a small hat.
This is extremely common in 13th century Italian marginalia.
- Bird body with wings
- Small human face
- Pointed scholar's cap (*birrus*)
- Colour: ultramarine body, iron-gall outline, ochre hat

**File: `public/assets/marginalia/creature-snail.svg`**
A knight fighting a giant snail. This is THE iconic medieval marginalia image.
- Tiny armoured knight (iron-gall outline only, stick-figure simple)
- Large snail with spiral shell
- The snail is winning
- Colour: verdigris snail shell, iron-gall knight

**File: `public/assets/marginalia/foliage-spray.svg`**
Not a creature — a spray of acanthus foliage, 120px × 80px.
Used to fill corner spaces in panels.
- Three or four curling acanthus leaves
- Small berry or bud at each tip
- Colour: verdigris leaves, gold-leaf berries, iron-gall outline

### Set 4: Initial Letters

**File: `public/assets/ornaments/initial-F.svg`**
A decorated initial capital "F" — for "Fazioni", the app's main section.
80px × 80px.
- Bold letter F in IM Fell English style
- Surrounded by small acanthus tendrils
- One tiny creature peeking out from the bottom serif
- Colour: ultramarine letter, verdigris tendrils, iron-gall outline, gold-leaf accents

**File: `public/assets/ornaments/initial-C.svg`**
A decorated initial capital "C" — for "Città".
Same size and treatment as the F.
- The C curves naturally accommodate a small creature inside it
- Colour: vermillion letter, verdigris tendrils

---

## SVG Technical Requirements

Every SVG must:
1. Have `viewBox` set — no fixed width/height on the root element
2. Use `role="img"` and `aria-label` for accessibility
3. Have all paths use `fill` and `stroke` with the palette hex values above
4. Have `stroke-linecap="round"` and `stroke-linejoin="round"` on all paths
5. NOT use any external fonts, filters, or blur effects
6. Be self-contained — no `<use>` references to external files
7. Work on both light (vellum) and transparent backgrounds

Style rule for all outlines:
```svg
stroke="#2C1A0E" stroke-width="2" fill="none"
```

Style rule for fills:
```svg
fill="#[palette-colour]" stroke="#2C1A0E" stroke-width="1.5"
```

---

## Drawing Technique Notes

To make these look hand-drawn (the Pentiment effect):

1. **Slightly wobbly lines** — use bezier curves rather than straight lines even for "straight" elements. Real manuscripts aren't perfectly straight.

2. **Uneven stroke width** — vary stroke-width between 1.5 and 2.5 on the same path to simulate quill pressure. Use `stroke-width` variations or multiple overlapping paths.

3. **Imperfect symmetry** — if drawing a symmetrical creature, make the two sides slightly different. The left eye can be marginally larger than the right.

4. **Ink pooling** — add small filled circles at path endpoints and corners to simulate ink pooling at the quill tip.

5. **No mechanical circles** — use path arcs rather than `<circle>` elements for eyes, joints, etc. This gives organic irregularity.

---

## Execution Order

Create in this order, running `npm run build` does NOT apply here —
these are pure SVG asset files, no build step needed.

1. `border-horizontal.svg` — simplest, establishes the palette
2. `giglio.svg` — the key Florentine symbol
3. `tower.svg` — fast to draw
4. `eagle.svg`
5. `marzocco-head.svg`
6. `border-corner.svg`
7. `border-vertical.svg`
8. `creature-dragon.svg`
9. `creature-lion.svg`
10. `creature-hybrid.svg`
11. `creature-snail.svg`
12. `foliage-spray.svg`
13. `initial-F.svg`
14. `initial-C.svg`

After each SVG, open it in a browser (`start [filename].svg`) and describe what it looks like.
Ask: "Does this look like it was drawn by a 13th century Florentine monk, or does it look like clip art?"
If clip art — redo it with wobblier lines and less symmetry.

---

## Gemini Upgrade Note

These SVGs are Phase 1 — functional placeholders in the correct style.
The user will later use Gemini image generation to create richer versions.
When that happens, the replacement images go in the same file paths.
Design the SVGs so they can be swapped 1:1 with image files.

---

## Handoff to SCRIPTORIUM-DESIGNER

When all 14 files exist, tell the user:
> "Ornaments complete. 14 files created in public/assets/ornaments/ and public/assets/marginalia/.
> Open them in a browser to review.
> When you're happy, run the SCRIPTORIUM-DESIGNER agent to apply them to the UI."