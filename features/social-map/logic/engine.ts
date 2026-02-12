
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

/**
 * The Historical Engine
 * Acts as a transformation layer between Raw Data and Visualization.
 */
export const calculateFamilyState = (family: Family, year: number): CalculatedState => {
  let isExiled = false;
  
  // 1. Determine Current Status (Timeline based)
  let currentStatusLabel = family.status1Class;
  if (family.status2Year && year >= family.status2Year && family.status2Class && family.status2Class !== 'Not in source') {
      currentStatusLabel = family.status2Class;
  }
  
  // 2. Determine Current Faction (Timeline based)
  // Default to Faction 1
  let currentFactionLabel = family.faction1Type;
  if (family.faction1Year && year < family.faction1Year) {
      // Before they officially joined? Assume neutral or use Faction 1
      // We will stick to Faction 1 as "Origin" unless undefined
  }
  
  if (family.faction2Year && year >= family.faction2Year && family.faction2Type && family.faction2Type !== 'Not in source') {
      currentFactionLabel = family.faction2Type;
  }

  // --- MAGNATE LOGIC ---
  // A family is visually highlighted as a Magnate only if they are flagged as such
  // AND the year is >= 1293 (Ordinances of Justice).
  const isMagnate = (family.isMagnate === true) && (year >= 1293);

  // --- EXILE LOGIC ---
  // Specific hardcoded checks based on major historical events if not explicit in data, 
  // but we prefer data-driven. However, general Ghibelline/Guelf rules still apply.
  
  // Rule 1 & 2: The Great Faction Wars (1260 - 1267)
  if (year >= 1260 && year < 1266) {
    if (currentFactionLabel === 'Guelf') {
      isExiled = true;
    }
  } else if (year >= 1266) {
    if (currentFactionLabel === 'Ghibelline') {
      isExiled = true;
    }
  }
  
  // The Schism (1302+)
  if (year >= 1302 && family.subFaction === 'White') {
     // White Guelfs exiled after 1302
     isExiled = true;
  }


  // --- VISUAL GROUPING ---
  let visualGroup: CalculatedState['visualGroup'] = 'Guelf'; // Default fallback
  
  if (isExiled) {
      visualGroup = 'Exile';
  } else {
      if (currentFactionLabel === 'Ghibelline') {
          visualGroup = 'Ghibelline';
      } else if (currentFactionLabel === 'Guelf') {
           // Check Subfactions for Guelfs
           if (year >= 1300) {
               if (family.subFaction === 'White') visualGroup = 'White';
               else if (family.subFaction === 'Black') visualGroup = 'Black';
               else visualGroup = 'Guelf';
           } else {
               visualGroup = 'Guelf';
           }
      }
  }


  // --- POSITIONING LOGIC ---
  // ViewBox: 0 0 260 90 
  // Sidebar (Labels): 0-40 (Increased gutter)
  // Ghibelline: 40-110 (Center 75)
  // Divider: 110
  // Guelf: 110-260 (Center 185)
  // White: 145
  // Black: 225
  
  // Vertical Lanes (Based on Social Class)
  let y = 80; 
  if (currentStatusLabel === 'Noble') {
      y = 24; // Grandi Lane
  } else if (currentStatusLabel === 'Popolo Grasso' || currentStatusLabel === 'Grassi') {
      y = 56; // Grassi Lane
  } else {
      y = 80; // Popolo Lane
  }

  // Horizontal Positioning
  let x = 185;
  
  if (isExiled) {
    // Exiles move to edges. 
    x = (family.faction1Type === 'Ghibelline' || family.faction2Type === 'Ghibelline') ? 45 : 255;
  } else {
    if (visualGroup === 'Ghibelline') {
        x = 75; // Center of Ghibelline Section
    } else if (visualGroup === 'Guelf') {
        x = 185; // Center of Guelf Section
    } else if (visualGroup === 'White') {
        x = 145; 
    } else if (visualGroup === 'Black') {
        x = 225; 
    }
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
