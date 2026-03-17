
import { Family, CalculatedState } from '../../../src/types';

/**
 * Helper to convert "2C" or "5-6F" into X/Y percentages
 */
export const getGridCoordinates = (gridCode: string): { x: number; y: number } | null => {
  if (!gridCode) return null;

  // Clean string (e.g., "5-6F" -> "5F" for simplicity, or handle ranges if ambitious)
  // For this v1, we take the first number and first letter found.
  const cleanCode = gridCode.replace(/[^0-9A-G]/g, ''); 
  
  const colChar = cleanCode.match(/[A-G]/)?.[0];
  const rowChar = cleanCode.match(/[1-7]/)?.[0];

  if (!colChar || !rowChar) return null;

  // Map A-G to 0-6 index
  const colIndex = colChar.charCodeAt(0) - 'A'.charCodeAt(0);
  // Map 1-7 to 0-6 index
  const rowIndex = parseInt(rowChar) - 1;

  // Calculate center of that square (100% / 7 squares = ~14.28% per square)
  const cellSize = 100 / 7;
  
  // Center point = (Index * Size) + (Half Size)
  return {
    x: (colIndex * cellSize) + (cellSize / 2),
    y: (rowIndex * cellSize) + (cellSize / 2)
  };
};

// --- Normalizers ---
// Accept the user's sheet values (case-insensitive) and map to engine-internal labels.

function normalizeFaction(raw: string | undefined): { faction: string; subFaction: 'White' | 'Black' | undefined } {
  const v = (raw ?? '').toLowerCase().trim();
  if (v === 'white guelph' || v === 'white guelf') return { faction: 'Guelf', subFaction: 'White' };
  if (v === 'black guelph' || v === 'black guelf') return { faction: 'Guelf', subFaction: 'Black' };
  if (v === 'guelph' || v === 'guelf' || v === 'guelfi') return { faction: 'Guelf', subFaction: undefined };
  if (v === 'ghibelline' || v === 'ghibellino' || v === 'ghibellini') return { faction: 'Ghibelline', subFaction: undefined };
  return { faction: raw ?? '', subFaction: undefined };
}

function normalizeStatus(raw: string | undefined): string {
  const v = (raw ?? '').toLowerCase().trim();
  if (v === 'grandi' || v === 'noble' || v === 'nobles') return 'Noble';
  if (v === 'grassi' || v === 'popolo grasso' || v === 'merchant elite') return 'Grassi';
  if (v === 'popolo' || v === 'people') return 'Popolo';
  return raw ?? '';
}

/**
 * The Historical Engine
 * Acts as a transformation layer between Raw Data and Visualization.
 *
 * Reads from factionSnapshots (TIMELINE sheet year-columns) when present.
 * Falls back to legacy faction1Type/faction2Type fields.
 */
export const calculateFamilyState = (family: Family, year: number): CalculatedState => {
  let isExiled = false;

  // --- 1. Resolve faction + status for this year ---
  let rawFaction: string | undefined;
  let rawStatus: string | undefined;

  if (family.factionSnapshots && Object.keys(family.factionSnapshots).length > 0) {
    // Snapshot path: find the most recent snapshot year <= current year
    const snapshotYears = Object.keys(family.factionSnapshots).map(Number).sort((a, b) => a - b);
    const applicableYear = [...snapshotYears].reverse().find(y => y <= year);
    if (applicableYear !== undefined) {
      rawFaction = family.factionSnapshots[applicableYear].faction;
      rawStatus  = family.factionSnapshots[applicableYear].status;
    }
  } else {
    // Legacy path: faction1Type / faction2Type fields
    rawFaction = family.faction1Type;
    rawStatus  = family.status1Class;
    if (family.faction2Year && year >= family.faction2Year && family.faction2Type && family.faction2Type !== 'Not in source') {
      rawFaction = family.faction2Type;
    }
    if (family.status2Year && year >= family.status2Year && family.status2Class && family.status2Class !== 'Not in source') {
      rawStatus = family.status2Class;
    }
  }

  const { faction: currentFactionLabel, subFaction } = normalizeFaction(rawFaction);
  const currentStatusLabel = normalizeStatus(rawStatus);

  // --- 2. Magnate (affects color only, not position) ---
  const isMagnate = (family.isMagnate === true) && (year >= 1293);

  // --- 3. Exile logic (historical events, applied on top of faction data) ---
  // Battle of Montaperti 1260: Ghibellines take Florence, Guelf families expelled
  if (year >= 1260 && year < 1266) {
    if (currentFactionLabel === 'Guelf') isExiled = true;
  }
  // Battle of Benevento 1266: Ghibellines expelled permanently
  if (year >= 1266) {
    if (currentFactionLabel === 'Ghibelline') isExiled = true;
  }
  // The Schism 1302: White Guelfs exiled (Dante etc.)
  if (year >= 1302 && subFaction === 'White') isExiled = true;

  // --- 4. Visual group ---
  let visualGroup: CalculatedState['visualGroup'] = 'Guelf';
  if (isExiled) {
    visualGroup = 'Exile';
  } else if (currentFactionLabel === 'Ghibelline') {
    visualGroup = 'Ghibelline';
  } else if (currentFactionLabel === 'Guelf') {
    if (year >= 1300 && subFaction === 'White') visualGroup = 'White';
    else if (year >= 1300 && subFaction === 'Black') visualGroup = 'Black';
    else visualGroup = 'Guelf';
  }

  // --- 5. Positioning ---
  // ViewBox: 0 0 260 90
  // Sidebar labels: 0–40 | Ghibelline: 40–110 (center 75) | Guelf: 110–260 (center 185)
  // White: 145 | Black: 225

  let y = 80; // Popolo lane (default)
  if (currentStatusLabel === 'Noble') y = 24;
  else if (currentStatusLabel === 'Grassi') y = 56;

  let x = 185;
  if (isExiled) {
    // Exiled Ghibellines drift left, exiled Guelfs drift right
    x = currentFactionLabel === 'Ghibelline' ? 45 : 255;
  } else if (visualGroup === 'Ghibelline') {
    x = 75;
  } else if (visualGroup === 'White') {
    x = 145;
  } else if (visualGroup === 'Black') {
    x = 225;
  } else {
    x = 185; // Guelf center
  }

  return {
    familyId: family.id,
    currentFactionLabel,
    currentStatusLabel,
    isExiled,
    isMagnate,
    position: { x, y },
    visualGroup
  };
};
