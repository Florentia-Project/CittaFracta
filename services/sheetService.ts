import Papa from 'papaparse';
import { Family, Relationship } from '../src/types';

const URLS = {
    FAMILIES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkeOA_WfDgVys6FiH5AEw3z_auuZ_Mgrbbx781FkZo-1Iix_c6-Y-I-ls_IRyutjD4BCLPhqqk_Ihg/pub?gid=1270711877&single=true&output=csv',
    RELATIONSHIPS: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkeOA_WfDgVys6FiH5AEw3z_auuZ_Mgrbbx781FkZo-1Iix_c6-Y-I-ls_IRyutjD4BCLPhqqk_Ihg/pub?gid=48875300&single=true&output=csv',
    TIMELINE: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkeOA_WfDgVys6FiH5AEw3z_auuZ_Mgrbbx781FkZo-1Iix_c6-Y-I-ls_IRyutjD4BCLPhqqk_Ihg/pub?gid=1875859082&single=true&output=csv' 
    
};

// נרמול מפתחות: הופך לאותיות קטנות ומוחק כל תו שאינו אות או מספר
const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

const fetchCSV = (url: string) => {
    return new Promise<any[]>((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: 'greedy',
            transformHeader: (header) => normalizeKey(header),
            complete: (results) => resolve(results.data),
            error: (err) => reject(err)
        });
    });
};

export const fetchFamiliesFromSheet = async (): Promise<Family[]> => {
    try {
        // לוג מינימלי
        console.log("🔄 Starting data sync from Google Sheets...");
        
        const [familiesData, relData, timelineData] = await Promise.all([
            fetchCSV(URLS.FAMILIES),
            fetchCSV(URLS.RELATIONSHIPS),
            fetchCSV(URLS.TIMELINE)
        ]);

        // מיפוי טיימליין
        const timelineMap = new Map();
        timelineData.forEach((row: any) => {
            const id = row['id'] || row['familyid'];
            if (id) timelineMap.set(id, row);
        });

        // מיפוי קשרים (שימוש במפתחות מנורמלים)
        const relMap = new Map<string, Relationship[]>();
        relData.forEach((row: any) => {
            const sourceId = row['sourceid'] || row['familyid']; 
            if (!sourceId) return;
            
            const newRel: any = {
                targetId: row['targetid'],       
                targetName: row['targetname'] || row['targetfamilyname'], 
                type: row['type'] || row['relationshiptype'],
                description: row['description'],
                year: (row['year'] || row['yearstart']) ? parseInt(row['year'] || row['yearstart']) : undefined
            };

            if (!relMap.has(sourceId)) relMap.set(sourceId, []);
            relMap.get(sourceId)?.push(newRel);
        });

        // איחוד נתונים
        const mergedFamilies: Family[] = familiesData.map((row: any) => {
            const id = row['id'];
            if (!id) return null; 

            const parentId = String(id).includes('_') ? String(id).split('_')[0] : String(id);
            const timeline = timelineMap.get(parentId) || {};
            const relationships = relMap.get(String(id)) || []; 

            const getInt = (val: string) => val && !isNaN(parseInt(val)) ? parseInt(val) : undefined;
            const getFloat = (val: string) => val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined;

            return {
                id: String(id),
                name: row['name'] || row['familyname'],
                sesto: row['sesto'],
                manualQuartiere: row['quartiere'],
                mapRef: getInt(row['mapref']),
                coordinates: (row['lat'] && row['lng']) ? {
                    x: getFloat(row['lat']),
                    y: getFloat(row['lng'])
                } : undefined,
                yearStart: getInt(row['yearstart']), 
                yearEnd: getInt(row['yearend']),
                originalFaction: timeline['1216_faction'] || 'Guelf',
                relationships: relationships
            } as Family;
        }).filter(Boolean) as Family[];

        console.log(`✅ Data synced successfully! Loaded ${mergedFamilies.length} families.`);
        return mergedFamilies;

    } catch (error) {
        console.error("❌ Error in sheetService:", error);
        return [];
    }
};