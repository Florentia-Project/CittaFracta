import React, { useMemo } from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
// שימי לב: אנחנו עולים 3 רמות למעלה כדי להגיע ל-types ב-src
import { Family } from '../../../types'; 

// הגדרת סגנונות הקשרים
const RELATIONSHIP_STYLES: Record<string, { color: string; weight: number; dashArray: string | null }> = {
  'marriage': { color: '#2E8B57', weight: 2, dashArray: null }, 
  'blood':    { color: '#800000', weight: 2, dashArray: null }, 
  'feud':     { color: '#8B0000', weight: 2, dashArray: '4, 16' }, 
  'alliance': { color: '#1E90FF', weight: 2, dashArray: '4, 16' }, 
  'vassal':   { color: '#808080', weight: 1, dashArray: '2, 10' } 
};

// --- כאן התיקון: הגדרת הטיפוסים ---
interface ConnectionsLayerProps {
    data: Family[];
    activeRelTypes: Set<string>; // מגדירים במפורש שזה סט של מחרוזות
    selectedFamilyId?: string | null;
}

const ConnectionsLayer: React.FC<ConnectionsLayerProps> = ({ data, activeRelTypes, selectedFamilyId }) => {
  
  const lines = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // בדיקה בטוחה יותר
    const typesArray = Array.from(activeRelTypes || []);
    if (typesArray.length === 0 && !selectedFamilyId) return [];

    const calculatedLines: any[] = [];
    const processedPairs = new Set<string>();

    data.forEach(source => {
      if (!source.coordinates || !source.relationships) return;
      
      source.relationships.forEach(rel => {
        const targetId = rel.targetId ? String(rel.targetId) : null;
        const targetName = rel.targetName;
        const typeRaw = rel.type || "Unknown";

        // הגדרה מפורשת שמדובר במערך של מחרוזות
        let targetsToFind: string[] = [];
        
        if (targetId && targetId !== "#N/A") {
            targetsToFind = targetId.split(/[,;]+/).map(s => s.trim());
        } else if (targetName && targetName !== "#N/A") {
            targetsToFind = targetName.split(/[,;]+/).map(s => s.trim());
        }

        targetsToFind.forEach(token => {
            if (!token) return;

            const normalizedType = typeRaw.toLowerCase().trim();
            
            // עכשיו TS יודע ש-t הוא string ולכן toLowerCase מותר
            const isActive = typesArray.some((t: string) => t.toLowerCase() === normalizedType);
            const isContextSelected = String(source.id) === String(selectedFamilyId);

            let target = data.find(f => String(f.id) === token); 
            if (!target) {
                target = data.find(f => f.name.toLowerCase() === token.toLowerCase());
            }

            if (!target || !target.coordinates) return;
            if (!isActive && !isContextSelected && String(target.id) !== String(selectedFamilyId)) return;

            const pairKey = [String(source.id), String(target.id)].sort().join('-');
            if (processedPairs.has(pairKey) && normalizedType !== 'feud') return;
            processedPairs.add(pairKey);

            const style = RELATIONSHIP_STYLES[normalizedType] || { color: '#333', weight: 1, dashArray: null };
            const isHighlighted = String(source.id) === String(selectedFamilyId) || String(target.id) === String(selectedFamilyId);

            calculatedLines.push({
              key: `${source.id}-${target.id}-${normalizedType}-${pairKey}`,
              positions: [
                [source.coordinates.x, source.coordinates.y], 
                [target.coordinates.x, target.coordinates.y]
              ],
              color: style.color,
              weight: isHighlighted ? 4 : style.weight, 
              dashArray: isHighlighted ? null : style.dashArray, 
              opacity: isHighlighted ? 1.0 : 0.9,
              label: `${source.name} ↔ ${target.name} (${typeRaw})`
            });
        });
      });
    });

    return calculatedLines;
  }, [data, activeRelTypes, selectedFamilyId]);

  return (
    <>
      {lines.map(line => (
        <React.Fragment key={line.key}>
          {/* קו רקע (Halo) */}
          <Polyline 
            positions={line.positions} 
            pathOptions={{ 
              color: '#ffffff', 
              weight: line.weight + 3, 
              dashArray: line.dashArray, 
              opacity: 0.6,
              lineCap: 'butt',
              lineJoin: 'miter'
            }}
          />

          {/* קו עליון צבעוני */}
          <Polyline 
            positions={line.positions} 
            pathOptions={{ 
              color: line.color, 
              weight: line.weight, 
              dashArray: line.dashArray, 
              opacity: line.opacity,
              lineCap: 'butt', 
              lineJoin: 'miter'
            }}
          >
            <Tooltip sticky>{line.label}</Tooltip>
          </Polyline>
        </React.Fragment>
      ))}
    </>
  );
};

export default ConnectionsLayer;