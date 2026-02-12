import L from 'leaflet';

// 👇 הוספנו export
export const getGuildColor = (guild?: string): string => {
    const normalizedGuild = guild?.toLowerCase() || '';
    if (normalizedGuild.includes('banker') || normalizedGuild.includes('cambio')) return '#FFD700'; 
    if (normalizedGuild.includes('wool') || normalizedGuild.includes('lana')) return '#F5F5DC';   
    if (normalizedGuild.includes('silk') || normalizedGuild.includes('seta')) return '#D8BFD8';   
    if (normalizedGuild.includes('judge')) return '#CD5C5C';   
    if (normalizedGuild.includes('medici') || normalizedGuild.includes('speziali')) return '#2E8B57';  
    return '#3388ff'; 
};

// 👇 הוספנו export (זה מה שהיה חסר!)
export const createCustomIcon = (color: string, isHighlighted: boolean) => {
    const size = isHighlighted ? 24 : 14; 
    const borderWidth = isHighlighted ? '3px' : '2px';
    const boxShadow = isHighlighted 
        ? `0 0 0 4px rgba(255, 255, 255, 0.6), 0 0 15px ${color}, 2px 2px 5px rgba(0,0,0,0.5)` 
        : '1px 1px 3px rgba(0,0,0,0.5)';

    return L.divIcon({
        className: 'custom-historical-pin', 
        html: `
            <div style="
                background-color: ${color}; 
                width: ${size}px; 
                height: ${size}px; 
                border-radius: 50%; 
                border: ${borderWidth} solid #2c241b; 
                box-shadow: ${boxShadow};
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform-origin: center center;
                z-index: ${isHighlighted ? 1000 : 1};
            "></div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -12]
    });
};