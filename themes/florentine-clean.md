# Theme: Florentine Manuscript — Clean Mode
*The default mode. Manuscript-inspired but readable. Used always.*

## Design Movement Name
"Archivio Vivo" — The Living Archive

## Design Philosophy
A research tool should feel like a document that has survived centuries, not like a website
that was built last week. Clean mode channels the Florentine notarial tradition: precise,
spare, authoritative. Every element earns its place as if the scribe had limited parchment.
The aesthetic is that of a freshly-copied register — new, legible, but unmistakably of its era.

Space is not empty — it is deliberate silence between entries. The grid is the ruled page.
Labels are marginal annotations. The matrix is the register folio, laid open on a lectern.

Craftsmanship is non-negotiable: every spacing decision, every color choice, every typographic
weight must feel like it was labored over by a master illuminator who also happened to know React.

## Color Palette
```css
--parchment:        #F5EDD6;   /* aged cream — base background */
--parchment-mid:    #EDE0BF;   /* slightly darker — panel dividers */
--parchment-deep:   #D9C9A3;   /* ruled line color, borders */
--ink:              #2C1A0E;   /* carbon black — primary text */
--ink-faded:        #5C4033;   /* iron gall brown — secondary text */
--rubric:           #8B1A1A;   /* rubrication red — headings, accents */
--rubric-light:     #C0392B;   /* brighter red — active states */
--earth-orange:     #C4622D;   /* terracotta — hover, highlights */
--verdigris:        #4A7C6A;   /* manuscript green — Guelph accent */
--ultramarine:      #2A4A7F;   /* lapis lazuli — Ghibelline accent */
--gold-leaf:        #B8960C;   /* illuminated gold — coat of arms frames */
```

## Typography
- **Display (titles, year number):** `IM Fell English` — closest Google Font to Rotunda book hand. Feels medieval without being costume-shop.
- **UI Labels (faction, class labels):** `Cinzel` — Roman lapidary, used for civic inscriptions. Tracks widely, all caps, feels authoritative.
- **Body (family names, descriptions):** `Crimson Pro` — humanist serif, highly readable at small sizes, warm and scholarly.
- **Captions/Annotations:** `Cinzel` at small size, widely tracked.

```html
<!-- Paste into index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet">
```

## What Makes This UNFORGETTABLE
The year number in `IM Fell English` at massive scale. That single typographic choice separates
this from every other data visualization tool. Nothing else needs to be loud — the year carries
the weight of time passing.

## Anti-Patterns — Never Do These
- No Inter, Roboto, Arial, or any sans-serif except for truly functional UI chrome
- No drop shadows (that's not 1260 Florence, that's 2015 Material Design)
- No rounded corners on data cells — registers have right angles
- No gradients on backgrounds — parchment is flat texture, not a gradient
- No icons from Lucide or FontAwesome — use text labels or Unicode symbols
- No purple. Ever.
- No "glass morphism" or frosted glass effects
- No skeleton loaders — show data or show nothing
