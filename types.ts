// src/types.ts

// --- 1. Basic Types & Unions ---
export type Faction = 'Guelf' | 'Ghibelline' | 'Not in source' | string;
export type SocialStatus = 'Noble' | 'Popolo' | 'Popolo Grasso' | 'Not in source' | string;
export type SubFaction = 'White' | 'Black' | 'None' | string;

// New: Standardized Guild types for map coloring
export type GuildType = 'Bankers' | 'Wool' | 'Silk' | 'Judges' | 'Medici e Speziali' | 'None' | string;

// --- 2. Sub-Interfaces ---
export interface Relationship {
  targetId: string;
  type: 'Marriage' | 'Alliance' | 'Feud' | 'Blood'| 'Patronage' | 'Business' | 'Godparent';
  description?: string;
  year?: number; // הוספנו את זה בשביל התזמון
}

export interface HistoricalSource {
  title: string;
  quote?: string;
}

export interface ExternalLinks {
  openHeritage3D?: string; // Link to 3D model viewer
  florence4D?: string;     // Link to Florence4D dataset
  other?: string;
}

export interface HistoricalEvent {
  year: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  sources?: HistoricalSource[];
}

// --- 3. Main Family Interface ---
export interface Family {
  // -- Identity --
  id: string;
  name: string;
  branchId?: string;
  
  // -- Historical Data (Timeline & Factions) --
  status1Year?: number;
  status1Class?: SocialStatus;
  status2Year?: number;
  status2Class?: SocialStatus;
  
  isMagnate?: boolean; 
  
  faction1Year?: number;
  faction1Type?: Faction;
  faction2Year?: number;
  faction2Type?: Faction;
  
  subFaction?: SubFaction;
  
  // -- Visualization --
  yearStart?: number; 
  yearEnd?: number; 
  guild?: GuildType; 

  // -- Metadata & Display --
  originalSourceTerm?: string;
  sourceCitation?: string;
  noticeablePeople?: string;
  occupation?: string;   
  propertyType?: string;
  coatOfArmsUrl?: string; 
  description?: string;  
  links?: ExternalLinks; 
  
  // -- Geography & Location --
  mapId?: number;             
  mapRef?: number;            // מספר במפה העתיקה
  sesto?: string;             // הרובע המקורי
  manualQuartiere?: string;   // <--- הדריסה הידנית (חשוב!)
  gridLocations?: string[];   
  coordinates?: { x: number; y: number }; // GPS
  
  // -- Connections --
  relationships?: Relationship[];

  // -- Computed / Legacy Helpers --
  originalFaction?: Faction; 
  originalStatus?: SocialStatus;
}

// --- 4. Simulation State (Computed) - זה מה שהיה חסר לך בעיניים! ---
export interface CalculatedState {
  familyId: string;
  currentFactionLabel: string;
  currentStatusLabel: string;
  isExiled: boolean;
  isMagnate: boolean; 
  position: { x: number; y: number }; 
  visualGroup: 'Ghibelline' | 'Guelf' | 'White' | 'Black' | 'Exile';
}