# Coat of Arms (CoA) Format Guide

## Standard Dimensions

All CoA SVG files must use **consistent dimensions** for uniform display:
- **Width**: 1000 pixels
- **Height**: 1200 pixels

This maintains the same aspect ratio and proportions across all CoA displays.

## Updating Existing SVG Files

If you have SVG files with different dimensions (mm units, pixel sizes, etc.), update the SVG header as follows:

### Before:
```xml
<svg
   width="185.83632mm"
   height="203.81673mm"
   ...>
```

### After:
```xml
<svg
   width="1000"
   height="1200"
   ...>
```

The `viewBox` attribute does NOT need to be changed - it scales the content automatically.

## What Gets Updated

When uploading new CoA files:
1. Keep all the internal SVG content unchanged
2. Only modify the `width` and `height` attributes in the opening `<svg>` tag
3. Change format from mm (millimeters) to numeric pixels (no units)
4. Set to exactly `1000` × `1200`

## Example

### Full SVG header (correct format):
```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   version="1.1"
   id="svg1"
   width="1000"
   height="1200"
   viewBox="0 0 1824 2340"
   xmlns="http://www.w3.org/2000/svg">
   <!-- SVG content here -->
</svg>
```

## Normalized Files

The following files have been normalized to 1000×1200:
- ✅ ABATi.svg (already correct)
- ✅ ADIMARI.svg (updated from 1824×2340)
- ✅ borgo.svg (updated from 185.83632mm × 203.81673mm)
- ✅ duomo.svg (updated from 185.83632mm × 203.81673mm)
- ✅ oltrarno.svg (updated from 191.18172mm × 209.67929mm)
- ✅ porta_piero.svg (updated from 185.83632mm × 203.81673mm)
- ✅ san_pancrazio.svg (updated from 191.18172mm × 209.67929mm)
- ✅ san_piero.svg (updated from 185.83632mm × 203.81673mm)

## For Future Uploads

When adding new CoA files:
1. Ensure the SVG has `width="1000"` and `height="1200"`
2. Keep a proper `viewBox` to preserve the content ratio
3. Save as `.svg` format in this folder: `public/assets/CoatOfArms/`
4. **Do not upload before updating** - I can help normalize them if needed, but it's better to send already formatted files

If you upload SVG files that don't match this format, just let me know and I can run the same normalization process.
