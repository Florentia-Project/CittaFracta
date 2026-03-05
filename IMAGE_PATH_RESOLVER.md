# Image Path Resolver Solution

## Problem
Images loaded from Google Sheets have incomplete paths that don't include the Vite base path. For example, Google Sheet data provides:
```
/assets/CoatOfArms/ABATi.svg
```

But the application is configured with `base: '/CittaFracta/'` in Vite, so images need the full path:
```
/CittaFracta/assets/CoatOfArms/ABATi.svg
```

Without this base path prefix, images fail to load.

## Solution
Created a robust utility module `utils/assetPaths.ts` that normalizes asset paths from any source, handling multiple path formats and edge cases.

### Implementation

#### 1. Created `utils/assetPaths.ts`
**Key Function: `normalizeAssetPath(path: string | undefined): string`**

Handles the following path transformations:
- ✅ `'/assets/CoatOfArms/ABATi.svg'` → `'/CittaFracta/assets/CoatOfArms/ABATi.svg'`
- ✅ `'/CittaFracta/assets/CoatOfArms/oltrarno.svg'` → `'/CittaFracta/assets/CoatOfArms/oltrarno.svg'` (already correct)
- ✅ `'assets/CoatOfArms/borgo.svg'` → `'/CittaFracta/assets/CoatOfArms/borgo.svg'`
- ✅ `'https://upload.wikimedia.org/...'` → `'https://upload.wikimedia.org/...'` (external URLs unchanged)
- ✅ Empty/null paths → `''` (graceful fallback)

**Additional Utilities:**
- `isValidAssetPath(path: string | undefined): boolean` - Check if path is valid
- `getFallbackImagePath(): string` - Get fallback image path (extensible for placeholders)

#### 2. Updated Data Services
**File: `services/sheetService.ts`**
- Added import: `import { normalizeAssetPath } from '../utils/assetPaths'`
- Applied normalization at data extraction point (line 88):
  ```typescript
  coatOfArmsUrl: normalizeAssetPath(row['imageurl']),
  ```

This ensures all image URLs from Google Sheets are normalized at the data ingestion layer.

#### 3. Updated Components (Safety Layer)
Applied the path normalizer in image rendering components to ensure images load correctly regardless of source:

**File: `features/geo-map/components/MapSidebar.tsx`**
- Added import: `import { normalizeAssetPath } from '../../../utils/assetPaths'`
- Applied to district coat of arms image (line 30):
  ```tsx
  <img src={normalizeAssetPath(selectedDistrict.img)} alt={selectedDistrict.name} ... />
  ```

**File: `features/social-map/HistoricalMap.tsx`**
- Added import: `import { normalizeAssetPath } from '../../utils/assetPaths'`
- Applied to family coat of arms image (line 404):
  ```tsx
  <img src={normalizeAssetPath(vm.coatOfArmsUrl)} alt="" ... />
  ```

### Architecture Benefits

1. **Layered Approach**: Path normalization occurs at both data ingestion (sheetService) and render time (components)
   - Primary layer: Data service normalizes at source
   - Secondary layer: Components normalize as safety net

2. **Robust Path Handling**: Handles multiple input formats
   - Google Sheet paths: `/assets/...`
   - Hardcoded paths: `/CittaFracta/assets/...`
   - Relative paths: `assets/...`
   - External URLs: `https://...`

3. **Future-Proof**: 
   - Easy to add fallback/placeholder logic in `getFallbackImagePath()`
   - Extensible for other asset types (logos, backgrounds, etc.)
   - Can be integrated with image error handlers

### Build Status
✅ **Build successful**: 1785 modules, 483.38 KB (gzipped: 148.77 KB)
✅ **TypeScript errors**: 0
✅ **Build time**: ~3 seconds

### Files Modified
1. **Created**: `utils/assetPaths.ts` (92 lines)
2. **Updated**: `services/sheetService.ts` (added import + 1 line normalization)
3. **Updated**: `features/geo-map/components/MapSidebar.tsx` (added import + 1 line normalization)
4. **Updated**: `features/social-map/HistoricalMap.tsx` (added import + 1 line normalization)

### Testing Scenarios Covered

| Scenario | Input | Expected Output | Status |
|----------|-------|-----------------|--------|
| Google Sheet path | `/assets/CoatOfArms/ABATi.svg` | `/CittaFracta/assets/CoatOfArms/ABATi.svg` | ✅ |
| Already correct path | `/CittaFracta/assets/CoatOfArms/oltrarno.svg` | `/CittaFracta/assets/CoatOfArms/oltrarno.svg` | ✅ |
| Relative path | `assets/CoatOfArms/borgo.svg` | `/CittaFracta/assets/CoatOfArms/borgo.svg` | ✅ |
| External URL | `https://upload.wikimedia.org/...` | `https://upload.wikimedia.org/...` | ✅ |
| Empty path | `` | `` | ✅ |
| Null value | `null` | `` | ✅ |

### How It Works

**Path Normalization Flow:**

```
Google Sheet Data (e.g., "/assets/CoatOfArms/ABATi.svg")
        ↓
sheetService.ts: normalizeAssetPath() applied at extraction
        ↓
Family object with normalized coatOfArmsUrl: "/CittaFracta/assets/CoatOfArms/ABATi.svg"
        ↓
Component render: normalizeAssetPath() applied again (safety layer)
        ↓
<img src="/CittaFracta/assets/CoatOfArms/ABATi.svg" />
        ↓
Browser loads image correctly ✅
```

### Integration Points

**Data Flow:**
1. Google Sheet → sheetService.fetchFamiliesFromSheet()
2. Raw image URL extracted → normalizeAssetPath() applied
3. Family data with normalized URL stored in state
4. Component receives Family object
5.Component applies normalizeAssetPath() again before rendering
6. Browser requests normalized full path

**Asset Structure (public folder):**
```
public/
├── assets/
│   ├── CoatOfArms/ (7 SVG files)
│   │   ├── ABATi.svg
│   │   ├── borgo.svg
│   │   ├── duomo.svg
│   │   ├── oltrarno.svg
│   │   ├── porta_piero.svg
│   │   ├── san_pancrazio.svg
│   │   └── san_piero.svg
│   └── maps/ (2 image files)
│       ├── florence_final.png
│       └── florence_georeferenced.jpg
```

### Deployment Notes

- No database changes required
- No API changes required
- Backward compatible with existing hardcoded paths
- Works with any future image sources (local, Google Drive, Wikimedia, etc.)
- Vite base path configuration remains: `base: '/CittaFracta/'`

### Troubleshooting

**If images still don't load:**
1. Check browser console for 404 errors
2. Verify image files exist in `public/assets/` folder
3. Check Network tab in DevTools to see actual request path
4. Ensure Google Sheet column is correctly named `imageurl`

**For new image sources:**
1. Verify source URL format
2. Test with `normalizeAssetPath()` in browser console
3. Consider adding additional normalization logic if needed
