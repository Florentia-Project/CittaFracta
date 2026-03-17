import Papa from 'papaparse';
import { Family, Relationship } from '../types';
import { normalizeAssetPath } from '../utils/assetPaths';

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

        // The snapshot years that the TIMELINE sheet uses as column pairs:
        // "<year>_Faction" and "<year>_Status" — normalizeKey strips the underscore.
        const SNAPSHOT_YEARS = [1216, 1250, 1260, 1266, 1282, 1289, 1293, 1300, 1343, 1378, 1434];

        // איחוד נתונים
        const mergedFamilies: Family[] = familiesData.map((row: any) => {
            const id = row['id'];
            if (!id) return null;

            const parentId = String(id).includes('_') ? String(id).split('_')[0] : String(id);
            const timeline = timelineMap.get(parentId) || {};
            const relationships = relMap.get(String(id)) || [];

            const getInt = (val: string | undefined) => val && !isNaN(parseInt(val)) ? parseInt(val) : undefined;
            const getFloat = (val: string | undefined) => val && !isNaN(parseFloat(val)) ? parseFloat(val) : undefined;
            const getBool = (val: string | undefined) => !!val && ['true', '1', 'yes'].includes(String(val).toLowerCase().trim());
            const fromRow = (...keys: string[]): string | undefined => {
                for (const k of keys) { if (row[k]?.trim()) return row[k].trim(); }
                return undefined;
            };
            const fromTimeline = (...keys: string[]): string | undefined => {
                for (const k of keys) { if (timeline[k]?.trim()) return timeline[k].trim(); }
                return undefined;
            };

            // --- Parse TIMELINE year-snapshot columns ---
            // normalizeKey turns "1216_Faction" → "1216faction", "1216_Status" → "1216status"
            const factionSnapshots: Record<number, { faction: string; status: string }> = {};
            for (const y of SNAPSHOT_YEARS) {
                const faction = timeline[`${y}faction`]?.trim();
                const status  = timeline[`${y}status`]?.trim();
                if (faction || status) {
                    factionSnapshots[y] = { faction: faction ?? '', status: status ?? '' };
                }
            }

            return {
                id: String(id),
                name: fromRow('name', 'familyname'),
                sesto: fromRow('sesto'),
                manualQuartiere: fromRow('quartiere'),
                mapRef: getInt(fromRow('mapref')),
                coordinates: (row['lat'] && row['lng']) ? {
                    x: getFloat(row['lat']),
                    y: getFloat(row['lng'])
                } : undefined,
                yearStart: getInt(fromRow('yearstart')),
                yearEnd: getInt(fromRow('yearend')),
                coatOfArmsUrl: normalizeAssetPath(fromRow('imageurl') ?? ''),

                // Snapshot data from TIMELINE sheet (the primary faction/status source)
                factionSnapshots: Object.keys(factionSnapshots).length > 0 ? factionSnapshots : undefined,

                // Display metadata (check TIMELINE then FAMILIES)
                isMagnate:          getBool(fromTimeline('ismagnate', 'magnate') ?? fromRow('ismagnate', 'magnate')),
                noticeablePeople:   fromTimeline('noticeablepeople', 'notablepeople', 'people') ?? fromRow('noticeablepeople', 'notablepeople'),
                occupation:         fromTimeline('occupation') ?? fromRow('occupation'),
                propertyType:       fromTimeline('propertytype', 'property') ?? fromRow('propertytype', 'property'),
                originalSourceTerm: fromTimeline('originalsourceterm', 'sourceterm') ?? fromRow('originalsourceterm', 'sourceterm'),
                sourceCitation:     fromTimeline('sourcecitation', 'citation', 'source') ?? fromRow('sourcecitation', 'citation'),
                description:        fromTimeline('description') ?? fromRow('description'),
                guild:              fromTimeline('guild', 'guildtype') ?? fromRow('guild', 'guildtype'),

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