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

            // Check TIMELINE sheet first (faction/status data lives there),
            // then fall back to FAMILIES sheet. Both have already been normalizeKey'd.
            const getField = (...keys: string[]): string | undefined => {
                for (const k of keys) {
                    if (timeline[k] && String(timeline[k]).trim() !== '') return String(timeline[k]).trim();
                }
                for (const k of keys) {
                    if (row[k] && String(row[k]).trim() !== '') return String(row[k]).trim();
                }
                return undefined;
            };

            // FAMILIES sheet only (geographic / identity fields)
            const fromFamilies = (...keys: string[]): string | undefined => {
                for (const k of keys) {
                    if (row[k] && String(row[k]).trim() !== '') return String(row[k]).trim();
                }
                return undefined;
            };

            return {
                id: String(id),
                name: fromFamilies('name', 'familyname'),
                sesto: fromFamilies('sesto'),
                manualQuartiere: fromFamilies('quartiere'),
                mapRef: getInt(fromFamilies('mapref')),
                coordinates: (row['lat'] && row['lng']) ? {
                    x: getFloat(row['lat']),
                    y: getFloat(row['lng'])
                } : undefined,
                yearStart: getInt(fromFamilies('yearstart')),
                yearEnd: getInt(fromFamilies('yearend')),
                coatOfArmsUrl: normalizeAssetPath(fromFamilies('imageurl') ?? ''),

                // Faction timeline — reads from TIMELINE sheet first
                faction1Type:  getField('faction1type', 'faction1', 'faction'),
                faction1Year:  getInt(getField('faction1year', 'factionyear')),
                faction2Type:  getField('faction2type', 'faction2'),
                faction2Year:  getInt(getField('faction2year')),
                subFaction:    getField('subfaction', 'sub', 'subfactiontype'),

                // Social class — reads from TIMELINE sheet first
                status1Class:  getField('status1class', 'status1', 'class', 'status', 'socialclass'),
                status2Class:  getField('status2class', 'status2'),
                status2Year:   getInt(getField('status2year')),

                // Flags — reads from TIMELINE sheet first
                isMagnate: getBool(getField('ismagnate', 'magnate')),

                // Display metadata
                originalFaction:    getField('originalfaction'),
                originalStatus:     getField('originalstatus'),
                noticeablePeople:   getField('noticeablepeople', 'notablepeople', 'people'),
                occupation:         getField('occupation'),
                propertyType:       getField('propertytype', 'property'),
                originalSourceTerm: getField('originalsourceterm', 'sourceterm'),
                sourceCitation:     getField('sourcecitation', 'citation', 'source'),
                description:        getField('description'),
                guild:              getField('guild', 'guildtype'),

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