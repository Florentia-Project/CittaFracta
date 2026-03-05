// Map configuration - coordinates and zoom levels

export const FLORENCE_CENTER: [number, number] = [43.7710, 11.2560];

export const MAP_CONFIG = {
    initialZoom: 15,
    minZoom: 13,
    maxZoom: 22,
    maxNativeZoom: 19,
    historicalMapMaxZoom: 22,
    historicalMapMaxNativeZoom: 20,
    flyToDuration: 1.5,
    animateZoomOnDoubleClick: true
};

export const HISTORICAL_MAP_URL = "https://tiles.arcgis.com/tiles/9NvE8jKNWWlDGsUJ/arcgis/rest/services/BuonsignoriGeoRef2016/MapServer/tile/{z}/{y}/{x}";
export const HISTORICAL_MAP_ATTRIBUTION = 'Georeferencing by Colin Rose';
export const HISTORICAL_MAP_DEFAULT_OPACITY = 0.8;

export const PIN_CONFIG = {
    defaultColor: '#8B4513',
    selectedColor: '#D2691E',
    ghibellineColor: '#F2E8C9',
    guelfColor: '#478989',
    highlightedZIndex: 10000,
    defaultZIndex: 100,
    defaultOpacity: 0.85,
    highlightedOpacity: 1
};
