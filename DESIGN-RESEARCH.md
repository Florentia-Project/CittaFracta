# Design Research: Florentine Manuscript Aesthetics
**Date:** 2026-03-09
**Researcher:** Claude Code MANUSCRIPT-RESEARCHER Agent

---

## 1. Color Palette

### Source Authority
Primary references: Fitzwilliam Museum Cambridge "Colour: The Art and Science of Illuminated Manuscripts" exhibition data; Webexhibits.org Pigments Through the Ages (500–1400); surviving Florentine Duecento works (Cimabue, Pacino di Bonaguida, Laudario di Sant'Agnese c.1340); Baptistery mosaics.

### Parchment & Ground Colors

| Role | Color Name | Hex | Notes |
|---|---|---|---|
| Primary background | Aged vellum | `#F1E9D2` | Warm pale cream — newly-scraped parchment |
| Secondary surface | Aged parchment | `#E8D5B0` | Slightly more tanned — folded pages, document sheets |
| Deep aged parchment | Old manuscript | `#D4BB8C` | Water-stained or heavily handled folios |
| Dark document tone | Medieval manuscript | `#998468` | Heavily aged, exposed margins |

**Usage rule:** Use `#F1E9D2` as the primary `bg-parchment`. Use `#E8D5B0` for card surfaces, panels. Use `#D4BB8C` for borders and section dividers. **Never use pure white `#FFFFFF` anywhere** — it reads as digital, not historical.

### Ink Colors

| Role | Color Name | Hex | Notes |
|---|---|---|---|
| Primary text ink | Iron gall black-brown | `#1C1008` | Iron gall dried to near-black with warm brown undertone |
| Secondary text ink | Aged brown | `#3D2010` | Faded iron gall — secondary text, annotations |
| Faint marginalia | Pale brown | `#6B4423` | Very faded — tertiary info, timestamps |

**Historical basis:** Iron gall ink appeared grey-purple when wet but oxidised to near-black with warm brown undertones. **Never use pure CSS `#000000`** — it looks digital.

### Pigment Colors (for faction coding, highlights, accents)

| Pigment | Color Name | Hex | Historical Source |
|---|---|---|---|
| Vermillion | Mercuric sulfide red | `#C5372C` | Ground cinnabar from Siena's Monte Amiata — rubrication |
| Red lead (minium) | Orange-red | `#C4441A` | Used for chapter marks, smaller capitals |
| Ultramarine | Lapis lazuli blue | `#274E8C` | From Afghanistan — most expensive, reserved for Virgin's robes |
| Azurite | Copper blue | `#3A6EA5` | Less costly blue — alternating with vermillion in capitals |
| Verdigris | Copper green | `#4A7A5A` | Copper acetate — borders and decorative foliage |
| Orpiment | Arsenic yellow | `#C9A020` | Warm gold-yellow — used for highlights |
| Gold leaf | Burnished gold | `#B8920A` | Real gold leaf in luxury manuscripts |
| Lead white | Opaque white | `#EDE8D5` | Mixed with pigments for highlights and flesh tones |

### Faction Color Coding (Historically Grounded)

Medieval heraldry used "tinctures" — not arbitrary colors but codified symbolic hues:

| Faction | Heraldic Tincture | Hex | Rationale |
|---|---|---|---|
| Guelph | Gules (red) | `#A02020` | Traditional Guelph heraldic color — papal/Angevin association |
| Ghibelline | Azure (blue) | `#1E3F7A` | Imperial association — Holy Roman Empire |
| White Guelph | Argent-white + blue trim | `#B0C4D8` | Cerchi faction — cooler, mercantile |
| Black Guelph | Sable + red | `#3A1515` | Donati faction — older nobility, darker |
| Neutral/None | Unbleached linen | `#C8B896` | Natural parchment — no faction color |

---

## 2. Typography

### Historical Script Context

13th-century Florentine documents used three distinct scripts for different purposes:

1. **Littera Bononiensis / Rotunda** — The formal Italian Gothic bookhand used at universities (Bologna) and for liturgical books. Round, compact, very legible. Distinguished from northern Textualis by its genuinely round letterforms. This was the prestige script for manuscripts made in Florence.
2. **Mercantesca** — The Florentine merchant cursive. Angular, fast-written, practical. Used in account books, guild registers, family diaries (*ricordanze*). More informal than Rotunda.
3. **Minuscola cancelleresca** — Notarial / chancery hand for legal documents. Between formal and cursive.

### Recommended Google Fonts (All SIL OFL Licensed)

| Role | Font | Notes |
|---|---|---|
| **Display headings** | IM Fell English | Historical English letterpress — closest to Rotunda feel in Latin script; authentic aged quality with irregular baseline. Available at `fonts.google.com/specimen/IM+Fell+English` |
| **Large initials / Chapter titles** | MedievalSharp | Gothic display, sharp serifs — for rubricated capitals, section headers. Available at `fonts.google.com/specimen/MedievalSharp` |
| **Body serif text** | Crimson Pro | High-quality renaissance-adjacent serif — readable at small sizes while feeling historically grounded. Available at `fonts.google.com/specimen/Crimson+Pro` |
| **Blackletter (use sparingly)** | UnifrakturMaguntia | Only for very large decorative initials (dropcaps) — too illegible for body text. SIL OFL licensed. |

### Google Fonts Import String
```css
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=MedievalSharp&display=swap');
```

### Usage Guidelines

- **Never use sans-serif** for any content text — only for dev/debug UI if needed
- **Heading hierarchy:**
  - H1 (page titles): MedievalSharp, letter-spaced
  - H2 (section titles): IM Fell English, with rubrication color `#C5372C`
  - H3 (subsections): IM Fell English italic
  - Body: Crimson Pro 16–18px (legibility priority)
- **Rubrication:** Red (`#C5372C`) for first letter of a section or alternating capitals — this is the single most authentic medieval typographic convention
- **Versals (decorated initials):** Large first letters of major sections, 3–4 lines tall, in vermillion or azurite

---

## 3. Layout & Grid Patterns

### Manuscript Column Structure

Surviving Florentine manuscripts (liturgical) typically use:
- **Single wide column** with generous outer margin (30–40% of page width) reserved for marginalia
- **Double column** for dense text (registers, chronicles) with a narrow gutter between columns
- All text **justified** on both sides — ragged margins look modern
- Horizontal **ruling lines** (fine brown, ~1px) visible under text as a baseline grid

### Guild Register / Civic Document Layout

Based on Florentine Catasto records (the 1427 Catasto digitised at Brown University) and notarial registers:
- **Left column (narrow, ~20%):** Entry number or date in margin — written in red (rubricated)
- **Center column (wide, ~60%):** Family name in larger script, then details below in smaller script
- **Right column (narrow, ~20%):** Monetary amount, status, or cross-reference
- **Horizontal rules** between entries — alternating red and plain ink every few lines
- **Family entry format:** Name in capitals → sestiere (district) → faction notation in margin → property/status below

### For CittaFracta UI

Apply these column principles to:
- **Social Map:** Three faction columns = three manuscript columns, each with a column heading rubricated in red
- **Family cards:** Left edge = red vertical rule (2px `#C5372C`), like a manuscript column marker
- **Sidebar panels:** Use the "margin" metaphor — marginalia always on the outer edge, narrower than main content

### Margins and Whitespace

- Manuscripts had **very intentional whitespace** — not padding, but breath
- Outer margins were sacred: annotation space, never crowded
- Use `padding-x` generously — cramped text looks digital, not manuscript
- Section breaks: horizontal rule in `#C5372C` (vermillion) or `#998468` (aged parchment brown)

### Manuscript Ruling Line Pattern (CSS)

```css
/* 24px line-height creates the faint horizontal ruling lines visible in vellum documents */
background-image:
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 23px,
    rgba(155, 120, 80, 0.08) 24px
  );
```

---

## 4. Decorative Elements

### Capitals and Initials (Highest Priority)

The single most recognisable element of medieval manuscripts:

1. **Alternating red/blue capitals** — When a new section begins, the first letter is painted in vermillion (`#C5372C`) OR azurite (`#3A6EA5`), alternating through the text. This is non-negotiable for authenticity.
2. **Pen flourishes (penwork filigree)** — Large initials have thin pen-drawn hairlines extending from the letter, creating a cage-like decorative pattern around it. In CSS: use a decorated `::before` pseudo-element or SVG inline.
3. **Dropcap versals** — Major sections (like a new tab view) should open with a 3-line-tall decorated initial.

### Border Patterns

- **Rinceaux borders:** Scrolling vine stems with stylised leaves, alternating gold and red/blue. Used in top and bottom margins of luxury manuscripts.
- **Simple ruling bands:** For less luxurious documents — just a double horizontal line in brown ink with occasional small flourishes at corners.
- **Gold leaf dots (chrysography):** Small gold dots scattered along border lines of luxury pages.

### Marginalia Aesthetic

- Annotations written at an angle to the ruled lines
- Pointing hands (*manicules*) indicating important passages — ☞ shape
- Small sketches in margins (manikins, grotesques, heraldic shields)
- **For CittaFracta:** Filter labels and metadata should look like marginal annotations — slightly smaller font, in `#3D2010` (aged brown), at the left or right edge

### Rubrication Pattern

Standard medieval rubrication pattern:
- Chapter/section headings: written in red ink (`#C5372C`)
- Paragraph marks (¶ pilcrow): alternating red and blue
- Running headers: red
- Dates and names: often underlined in red

---

## 5. Map Visual Language

### Historical Maps of the Period

**Paolino Minorita's maps (c.1320–1330):** Fra Paolino (Paolino Venetiano), Franciscan friar, created the oldest known city map of Venice (~1330) and a well-known map of Rome embedded in his *Chronologia Magna*. His approach combined *grata pictura* (a chronological visual overview that allows at-a-glance understanding) with *mapa duplex* (visual AND verbal signs working together). Key visual qualities:
- City represented as a dense cluster of towers and buildings in elevation/silhouette view
- Territorial boundaries marked with text labels, not lines
- Political data embedded as text annotations within the map space
- No coordinate grid — orientation is conceptual, not cardinal
- Parchment-coloured background with brown ink drawing

**Visual language for CittaFracta geo map:**
- Leaflet tile layer: use a sepia/parchment-toned custom tile style (e.g., Stamen Toner or a warm-beige OSM style)
- Remove all modern colours from the tile layer if possible
- Sestiere (district) boundaries: thin `#998468` lines, slightly dashed, like hand-drawn
- Family location markers: NOT pin drops — use circular wax seal icons (see below)

### Marker Style: Wax Seal Medallions

Medieval documents were authenticated with wax seals — round, embossed, hanging from documents. **Family markers on the geo map should look like wax seals:**
- Circle, ~32–40px diameter
- Background in faction colour (muted heraldic tincture)
- Family initial or coat of arms silhouette
- Thin aged-gold border ring (`#B8920A`)
- Slight drop shadow using warm brown (`rgba(28, 16, 8, 0.20)`) — not modern blue/grey

### Social Map Visual Language (Faction Matrix)

- Column headers: rubricated section titles, red capitals on parchment
- Family entries in columns: like guild register rows
- Connection lines between families: thin ink-brown curves (`#3D2010`), NOT geometric straight lines — use CSS curves or SVG paths
- Relationship type encoding: line dash pattern (solid = alliance, dashed = marriage, dotted = vendetta)

---

## 6. UI Element Translation Table

| Modern UI Element | Historical Florentine Analogue | Visual Treatment |
|---|---|---|
| Navigation tabs | **Chapter tabs** on a bound manuscript (visible vellum tabs protruding from the edge) | Parchment-coloured tabs with rubricated italic label; active tab = vermillion text + solid bottom rule; inactive = faded ink; **no rounded corners** — medieval binding tabs were rectangular |
| Filter panel | **Marginal annotations** (quill notes in the outer margin of a folio) | Narrow right/left panel, smaller italic font (`#3D2010`), each filter like a handwritten marginal note with a ruling-line underline; use pilcrow (¶) or manicule (☞) as filter markers |
| Family card | **Named entry in a guild register** (like the Arte della Lana membership rolls) | Left red vertical rule (2px `#C5372C`), family name in IM Fell English, sestiere below in smaller Crimson Pro, faction colour as a small heraldic smudge in the top-right corner |
| Timeline slider | **Scroll with chapter marks** (like a liturgical lectionary with year markers) | Horizontal track in aged parchment `#D4BB8C`, thumb = a wax seal circle, tick marks = small rotated-diamond rubrication marks (◆), current year in red numeral above in italic serif |
| Modal/overlay | **A full chronicle folio** (an open illuminated manuscript page) | Full-screen overlay in `#F1E9D2`, decorative versal in top-left, close button = a small square correction mark; **no rounded dialog box corners** |
| Map markers | **Wax seal medallions** (hanging seals on civic documents) | Circular, faction-coloured, with family initial, thin gold border ring, warm brown shadow |
| Connection lines between families | **Ruled ink lines with annotation** (like a genealogical tree in a chronicle) | SVG paths, `#3D2010` brown, 1–1.5px, curved (not straight); relationship type encoded in dash pattern |
| Faction colour coding | **Heraldic tinctures** (the codified medieval heraldry system) | Guelph = gules (`#A02020`), Ghibelline = azure (`#1E3F7A`), always muted/tinted — never pure saturated hues; think faded fresco, not bold graphic design |

---

## 7. What to AVOID

### Colours to Never Use
- **Pure white `#FFFFFF`** — looks digital, breaks the parchment illusion
- **Pure black `#000000`** — no medieval pigment is truly black; use `#1C1008`
- **Teal, purple, grey gradients** — AI-default palette, completely anachronistic
- **Neon or highly saturated hues** — medieval pigments were never neon; they were rich but earthy
- **Blue hyperlink colour** — hyperlink convention is a 1990s invention

### Layout Patterns to Never Use
- **Rounded corners everywhere** — medieval documents had no rounded corners; use sharp right angles
- **Flat white cards with drop shadows** — generic Material Design, breaks the manuscript feel
- **CSS gradients in blue/purple/grey** — the default AI colour scheme
- **Centered text layouts** — medieval manuscripts were strictly left-aligned or justified
- **Full-bleed images without border treatment** — images should sit inside a manuscript context

### Typography Mistakes
- **Sans-serif body text** for content — ever. This is the single biggest aesthetic failure.
- **All-caps for body text** — medieval text was NOT all-caps; use proper small caps for headings
- **Tight letter-spacing** — medieval scripts had natural, generous spacing

### Interaction Patterns
- **Smooth Material-style sliding animations** — use subtle fade or unfurl (like unrolling a scroll)
- **Floating action buttons** — no medieval analogue; avoid
- **Tab bars at the bottom** (mobile) — use a top-bound folio tab metaphor instead

---

## 8. Implementation Notes for DESIGNER Agent

### Tailwind Config — Colors to Add

The active Tailwind config is the **inline `<script>tailwind.config = {...}</script>` in `index.html`** (CDN Tailwind), not `tailwind.config.ts`. Update the inline config first.

```javascript
colors: {
  // Parchment grounds — never pure white
  'parchment':      '#F1E9D2',  // Primary background — aged vellum
  'parchment-dark': '#D4BB8C',  // Borders, dividers — handled folios
  'parchment-aged': '#998468',  // Exposed margins — very aged

  // Iron gall ink — never pure #000000
  'ink':            '#1C1008',  // Primary text
  'ink-light':      '#6B4423',  // Secondary / marginalia
  'ink-brown':      '#3D2010',  // Tertiary / very faded

  // Pigment accents (surviving Duecento palette)
  'earth-orange':   '#C5372C',  // Vermillion — rubrication (replaces generic terracotta)
  'earth-brown':    '#8B4513',  // Sienna brown
  'earth-green':    '#4A7A5A',  // Verdigris — copper acetate

  // Manuscript pigments (explicit names)
  'vermillion':     '#C5372C',  // Cinnabar — chapter headings
  'azurite':        '#3A6EA5',  // Copper blue — alternating capitals
  'verdigris':      '#4A7A5A',  // Copper green — decorative borders
  'orpiment':       '#C9A020',  // Arsenic yellow — warm highlights
  'gold-leaf':      '#B8920A',  // Burnished gold — premium accent

  // Faction heraldic tinctures
  'guelph':         '#A02020',  // Gules — papal/Angevin
  'ghibelline':     '#1E3F7A',  // Azure — imperial
  'white-guelph':   '#B0C4D8',  // Argent + blue — Cerchi
  'black-guelph':   '#3A1515',  // Sable + red — Donati
}
```

### Tailwind Config — Fonts to Add

```javascript
fontFamily: {
  sans:       ['Inter', 'sans-serif'],                              // UI labels only
  serif:      ['"IM Fell English"', 'Garamond', 'Georgia', 'serif'], // Manuscript body
  display:    ['MedievalSharp', 'serif'],                           // Capitals / headings
  body:       ['"Crimson Pro"', 'Georgia', 'serif'],                // Dense reading text
  manuscript: ['"IM Fell English"', 'serif'],                       // Explicit alias
}
```

### Critical CSS Patterns

```css
/* Parchment texture — no image required, CSS only */
.parchment-ruled {
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 23px,
      rgba(155, 120, 80, 0.08) 24px
    );
}

/* Rubricated heading */
.rubric {
  color: #C5372C;
  font-family: 'MedievalSharp', serif;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Left red rule — manuscript column marker */
.folio-entry {
  border-left: 2px solid #C5372C;
  padding-left: 0.875rem;
}

/* Marginal annotation style */
.marginalia {
  font-family: 'IM Fell English', Georgia, serif;
  font-style: italic;
  font-size: 0.75rem;
  color: #3D2010;
  letter-spacing: 0.02em;
}

/* Square seal button — no rounded corners */
.seal-button {
  border: 1px solid rgba(28, 16, 8, 0.25);
  transition: border-color 200ms, color 200ms;
}
.seal-button:hover {
  border-color: #C5372C;
  color: #C5372C;
}
```

### Priority Implementation Order for DESIGNER

1. **First:** Update `index.html` inline Tailwind config — swap colour palette and fonts
2. **Second:** Update `index.css` — font imports, CSS custom properties, add utility classes
3. **Third:** Rubrication — all headings/section titles in `#C5372C` vermillion
4. **Fourth:** Left red border rule on family cards — highest single-element impact
5. **Fifth:** Header as rubricated manuscript title (not a generic navbar)
6. **Sixth:** Timeline slider as chronicle scroll with Anno Domini year display
7. **Seventh:** Decorative initials / dropcaps for major sections
8. **Last:** Border decorations, rinceaux patterns (CSS only, no images)

### Paper Grain Texture (already in index.html)

The `.paper-texture` class uses SVG fractal noise. Increase opacity from `0.05` to `0.07–0.08` for a more visible parchment grain.

---

## Sources Consulted

- Fitzwilliam Museum Cambridge — "COLOUR: The Art and Science of Illuminated Manuscripts" (`colour-illuminated.fitzmuseum.cam.ac.uk`)
- Webexhibits.org — "Pigments Through the Ages: Medieval Age (500–1400)"
- Metropolitan Museum of Art — "Manuscript Illumination in Italy, 1400–1600" press release
- Medievalists.net — "14th century depiction of Venice discovered" (Paolino Venetiano, 2020)
- Academia.edu — "Grata pictura and mapa duplex: Paolino Minorita's Late Medieval Map of Rome" (Convivium II,1 2015)
- Wikipedia — Rotunda (script), Illuminated manuscript, Duecento articles
- Google Fonts — IM Fell English, MedievalSharp, Crimson Pro, UnifrakturMaguntia (all SIL OFL licensed)
- Encycolorpedia.com — hex documentation for `#998468` "Medieval Manuscript", `#EBD5B3` "Vellum Parchment"
- htmlcolorcodes.com — Parchment colour reference `#F1E9D2`
- University of Pittsburgh d-scholarship — "Common Medieval Pigments" (Baker, 2004)
