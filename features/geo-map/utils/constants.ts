// Map configuration constants and defaults

export const CHRONICLE_YEARS = [1216, 1250, 1260, 1266, 1282, 1293, 1300, 1302];

export const BASE_MAPS = {
    clean: { 
        name: "Clean Light", 
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", 
        attribution: '&copy; OSM & CARTO' 
    },
    satellite: { 
        name: "Satellite", 
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", 
        attribution: '&copy; Esri' 
    },
    dark: { 
        name: "Dark Mode", 
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", 
        attribution: '&copy; CARTO' 
    }
};

export const DEFAULT_OPEN_SECTIONS = {
    layers: true,
    info: true,
    timeline: true,
    locations: false,
    families: true
};
