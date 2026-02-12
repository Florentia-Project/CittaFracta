
import React, { useMemo, useState, useRef, useLayoutEffect } from 'react';
import { Family } from '../types';
import { calculateFamilyState } from './logic/engine';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface HistoricalMapProps {
  data: Family[];
  year: number;
  onSelectFamily: (family: Family) => void;
  selectedFamilyId?: string;
}

const HistoricalMap: React.FC<HistoricalMapProps> = ({ data, year, onSelectFamily, selectedFamilyId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dimensions of the viewport
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Transform State (Pixels)
  // k = scale (pixels per data unit), x/y = translate in pixels
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Drag Refs
  const isMouseDown = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mouseStart = useRef({ x: 0, y: 0 });
  const hasPanned = useRef(false);

  // --- INITIALIZATION & RESIZE ---
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Fit to screen on first load
  useLayoutEffect(() => {
    if (!initialized && dimensions.width > 0 && dimensions.height > 0) {
        const padding = 40;
        // Data Bounds (Approximate based on layout engine)
        const dataW = 270; 
        const dataH = 100;
        
        // Calculate scale to fit
        const scaleX = (dimensions.width - padding * 2) / dataW;
        const scaleY = (dimensions.height - padding * 2) / dataH;
        const k = Math.min(scaleX, scaleY);
        
        // Center
        const x = (dimensions.width - dataW * k) / 2 + (10 * k); // Offset for sidebar
        const y = (dimensions.height - dataH * k) / 2;
        
        setTransform({ k, x, y });
        setInitialized(true);
    }
  }, [dimensions, initialized]);


  // --- VIEW MODEL CALCULATION (Data Units) ---
  const viewModels = useMemo(() => {
    const nodes = data.map(family => {
      const state = calculateFamilyState(family, year);
      const hasCoA = !!family.coatOfArmsUrl;
      const coAWidth = hasCoA ? 4 : 0;
      const padding = 3; 

      const isGuelfSplitEra = year >= 1300;
      const hasFactionStrip = !state.isExiled && isGuelfSplitEra && family.faction1Type === 'Guelf';
      const stripWidth = hasFactionStrip ? 2.0 : 0; 

      const charWidth = 0.85; 
      const contentWidth = (family.name.length * charWidth) + padding + coAWidth + stripWidth;
      const width = Math.max(13, contentWidth);
      
      let layoutHeight = 4.5;
      if (state.isExiled) layoutHeight += 2.0; 

      return { 
        ...family, 
        ...state,
        width,
        height: 4.5,
        layoutHeight,
        targetX: state.position.x,
        targetY: state.position.y,
        hasCoA,
        stripWidth
      };
    });

    const lanes = {
        Noble: { id: 'Noble', y: 24, nodes: [] as typeof nodes, bounds: { top: 14, bottom: 39 } },
        Grassi: { id: 'Grassi', y: 56, nodes: [] as typeof nodes, bounds: { top: 43, bottom: 71 } },
        Popolo: { id: 'Popolo', y: 81, nodes: [] as typeof nodes, bounds: { top: 75, bottom: 95 } }
    };

    nodes.forEach(node => {
        if (Math.abs(node.targetY - 24) < 15) lanes.Noble.nodes.push(node);
        else if (Math.abs(node.targetY - 56) < 15) lanes.Grassi.nodes.push(node);
        else lanes.Popolo.nodes.push(node);
    });

    Object.values(lanes).forEach(lane => {
        const zoneMap: Record<string, typeof nodes> = {};
        lane.nodes.forEach(node => {
            const key = `${node.visualGroup}-${node.targetX}`;
            if (!zoneMap[key]) zoneMap[key] = [];
            zoneMap[key].push(node);
        });

        const zoneLayouts: { centerX: number, nodes: typeof nodes }[] = [];

        Object.values(zoneMap).forEach(zoneNodes => {
            zoneNodes.sort((a, b) => a.name.localeCompare(b.name));
            const targetX = zoneNodes[0].targetX;
            const laneHeight = lane.bounds.bottom - lane.bounds.top;
            const gapY = 2.0; 
            const avgNodeHeight = 5.5; 
            
            let maxRows = Math.floor(laneHeight / avgNodeHeight);
            if (maxRows < 1) maxRows = 1;

            const columns: typeof nodes[] = [];
            let currentCol: typeof nodes = [];

            zoneNodes.forEach(node => {
                if (currentCol.length >= maxRows) {
                    columns.push(currentCol);
                    currentCol = [];
                }
                currentCol.push(node);
            });
            if (currentCol.length > 0) columns.push(currentCol);

            const colGap = 2;
            const colWidths = columns.map(col => Math.max(...col.map(n => n.width)));
            const totalZoneWidth = colWidths.reduce((sum, w) => sum + w, 0) + (Math.max(0, colWidths.length - 1) * colGap);
            let startX = targetX - (totalZoneWidth / 2);
            
            columns.forEach((col, colIndex) => {
                const colW = colWidths[colIndex];
                const colCenterX = startX + (colW / 2);
                const totalColH = col.reduce((sum, n) => sum + n.layoutHeight, 0) + (Math.max(0, col.length - 1) * gapY);
                let startY = lane.y - (totalColH / 2);
                if (startY < lane.bounds.top) startY = lane.bounds.top;
                if (startY + totalColH > lane.bounds.bottom) startY = lane.bounds.bottom - totalColH;

                col.forEach(node => {
                    node.position = { x: colCenterX, y: startY + (node.height / 2) };
                    startY += node.layoutHeight + gapY;
                });
                startX += colW + colGap;
            });

            const allX = zoneNodes.map(n => n.position.x);
            const actualCenterX = (Math.min(...allX) + Math.max(...allX)) / 2;
            zoneLayouts.push({ centerX: actualCenterX, nodes: zoneNodes });
        });

        const leftZones = zoneLayouts.filter(z => z.centerX < 110);
        const rightZones = zoneLayouts.filter(z => z.centerX >= 110);
        const resolveGroup = (zones: typeof zoneLayouts, minX: number, maxX: number) => {
            if (zones.length === 0) return;
            zones.sort((a, b) => {
                 const minA = Math.min(...a.nodes.map(n => n.position.x - n.width/2));
                 const minB = Math.min(...b.nodes.map(n => n.position.x - n.width/2));
                 return minA - minB;
            });
            for (let pass = 0; pass < 3; pass++) {
                for (let i = 0; i < zones.length - 1; i++) {
                    const current = zones[i];
                    const next = zones[i+1];
                    const gap = 3;
                    const currentRight = Math.max(...current.nodes.map(n => n.position.x + n.width/2));
                    const nextLeft = Math.min(...next.nodes.map(n => n.position.x - n.width/2));
                    if (currentRight + gap > nextLeft) {
                        const shift = (currentRight + gap) - nextLeft;
                        next.nodes.forEach(n => n.position.x += shift);
                    }
                }
                const lastZone = zones[zones.length - 1];
                const lastZoneRight = Math.max(...lastZone.nodes.map(n => n.position.x + n.width/2));
                if (lastZoneRight > maxX) {
                    const shift = lastZoneRight - maxX;
                    lastZone.nodes.forEach(n => n.position.x -= shift);
                }
                for (let i = zones.length - 1; i > 0; i--) {
                     const current = zones[i];
                     const prev = zones[i-1];
                     const gap = 3;
                     const currentLeft = Math.min(...current.nodes.map(n => n.position.x - n.width/2));
                     const prevRight = Math.max(...prev.nodes.map(n => n.position.x + n.width/2));
                     if (prevRight + gap > currentLeft) {
                         const shift = (prevRight + gap) - currentLeft;
                         prev.nodes.forEach(n => n.position.x -= shift);
                     }
                }
                const firstZone = zones[0];
                const firstZoneLeft = Math.min(...firstZone.nodes.map(n => n.position.x - n.width/2));
                if (firstZoneLeft < minX) {
                    const shift = minX - firstZoneLeft;
                    firstZone.nodes.forEach(n => n.position.x += shift);
                }
            }
        };
        resolveGroup(leftZones, 40, 108);
        resolveGroup(rightZones, 112, 258);
    });

    return nodes;
  }, [data, year]);

  const renderedNodes = useMemo(() => {
    if (!selectedFamilyId) return viewModels;
    return [...viewModels].sort((a, b) => {
        if (a.id === selectedFamilyId) return 1;
        if (b.id === selectedFamilyId) return -1;
        return 0;
    });
  }, [viewModels, selectedFamilyId]);


  // --- INTERACTION HANDLERS (PIXEL BASED) ---

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (dimensions.width === 0) return;

    const scaleFactor = 1.05;
    const direction = e.deltaY > 0 ? 1 / scaleFactor : scaleFactor;
    
    // Limits
    const newK = Math.max(0.5, Math.min(20, transform.k * direction));
    
    // Zoom toward mouse pointer
    const rect = containerRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // x' = mx - (mx - x) * (newK / oldK)
    const newX = mouseX - (mouseX - transform.x) * (newK / transform.k);
    const newY = mouseY - (mouseY - transform.y) * (newK / transform.k);

    setTransform({ k: newK, x: newX, y: newY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    hasPanned.current = false;
    mouseStart.current = { x: e.clientX, y: e.clientY };
    dragStart.current = { x: transform.x, y: transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    
    // Drag Sensitivity Threshold (Screen Pixels)
    if (!hasPanned.current) {
        const dist = Math.sqrt(
            Math.pow(e.clientX - mouseStart.current.x, 2) + 
            Math.pow(e.clientY - mouseStart.current.y, 2)
        );
        if (dist > 6) {
            hasPanned.current = true;
            setIsDragging(true);
        } else {
            return;
        }
    }

    const dx = e.clientX - mouseStart.current.x;
    const dy = e.clientY - mouseStart.current.y;
    
    setTransform(prev => ({
        ...prev,
        x: dragStart.current.x + dx,
        y: dragStart.current.y + dy
    }));
  };

  const handleMouseUp = () => { 
      isMouseDown.current = false;
      setIsDragging(false); 
      setTimeout(() => { hasPanned.current = false; }, 0);
  };

  // --- ZOOM CONTROL HELPERS ---
  const applyZoom = (factor: number) => {
      const center = { x: dimensions.width / 2, y: dimensions.height / 2 };
      const newK = Math.max(0.5, Math.min(20, transform.k * factor));
      const newX = center.x - (center.x - transform.x) * (newK / transform.k);
      const newY = center.y - (center.y - transform.y) * (newK / transform.k);
      setTransform({ k: newK, x: newX, y: newY });
  };
  const resetZoom = () => {
    // Re-trigger initial layout logic by toggling init state or just manual reset
    setInitialized(false); // Quick way to re-center
  };

  // --- STICKY / INFINITE CALCULATIONS ---
  
  // Grid Lines (Data Space -> Screen Space)
  const verticalDividerX = 110 * transform.k + transform.x;
  const dashedDividerX = 185 * transform.k + transform.x;
  const horizontalLine1Y = 40 * transform.k + transform.y;
  const horizontalLine2Y = 72 * transform.k + transform.y;

  // Sticky Labels (Clamped to Data Position + Transform)
  const getX = (dataX: number) => dataX * transform.k + transform.x;
  const getY = (dataY: number) => dataY * transform.k + transform.y;
  
  // Constants for label positioning
  const topLabelY = 30; // Fixed pixels from top
  const leftLabelX = 24; // Fixed pixels from left

  return (
    <div className="flex-1 w-full h-full relative p-0 select-none bg-parchment overflow-hidden" ref={containerRef}>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-2">
        <button onClick={() => applyZoom(1.2)} className="bg-parchment-dark border border-ink/20 p-2 rounded shadow hover:bg-white"><ZoomIn size={16}/></button>
        <button onClick={() => applyZoom(1/1.2)} className="bg-parchment-dark border border-ink/20 p-2 rounded shadow hover:bg-white"><ZoomOut size={16}/></button>
        <button onClick={resetZoom} className="bg-parchment-dark border border-ink/20 p-2 rounded shadow hover:bg-white"><Maximize size={16}/></button>
      </div>

      <div 
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg className="w-full h-full block">
          
          {/* --- 1. INFINITE BACKGROUND GRID --- */}
          {/* Vertical Divider (Faction) */}
          <line x1={verticalDividerX} y1={0} x2={verticalDividerX} y2="100%" stroke="#332D28" strokeWidth="1" opacity="0.4" />
          
          {/* Horizontal Dividers (Classes) */}
          <line x1={0} y1={horizontalLine1Y} x2="100%" y2={horizontalLine1Y} stroke="#332D28" strokeWidth="1" opacity="0.3" />
          <line x1={0} y1={horizontalLine2Y} x2="100%" y2={horizontalLine2Y} stroke="#332D28" strokeWidth="1" opacity="0.3" />

          {/* Conditional Dashed Line (White/Black) */}
          {year >= 1300 && (
             <line x1={dashedDividerX} y1={0} x2={dashedDividerX} y2="100%" stroke="#332D28" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
          )}


          {/* --- 2. ZOOMED CONTENT --- */}
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
            {renderedNodes.map((vm) => {
                const { width, height, stripWidth } = vm;
                const hasFactionStrip = stripWidth > 0;
                const stripColor = vm.visualGroup === 'White' ? '#E5E5E5' : (vm.visualGroup === 'Black' ? '#171717' : null);
                const isSelected = selectedFamilyId === vm.id;
                
                const startX = -width / 2;
                const imageSize = 3;
                const imageX = startX + stripWidth + 1; 
                let textX = vm.hasCoA ? imageX + imageSize + 1 : stripWidth / 2;
                const textAnchor = vm.hasCoA ? "start" : "middle";
                const strokeColor = vm.isMagnate ? '#800020' : (vm.isExiled ? '#C17C59' : '#332D28');
                const strokeWidth = vm.isMagnate ? 0.6 : 0.25;

                return (
                  <g 
                    key={vm.id} 
                    className="transition-opacity duration-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasPanned.current) return;
                        onSelectFamily(vm);
                    }}
                    style={{ 
                      transform: `translate(${vm.position.x}px, ${vm.position.y}px)`,
                      opacity: vm.isExiled ? 0.6 : 1,
                    }}
                  >
                     {/* Scale compensation for constant border widths if desired, but here we let them scale naturally for visual depth */}
                     {isSelected && (
                         <rect x={-width/2 - 1.2} y={-height/2 - 1.2} width={width + 2.4} height={height + 2.4} fill="none" stroke="#C17C59" strokeWidth={0.8} rx={1} className="opacity-80"/>
                    )}
                    <rect x={-width/2} y={-height/2} width={width} height={height} fill="#F3EDE2" stroke={strokeColor} strokeWidth={strokeWidth} className="shadow-sm"/>
                    {hasFactionStrip && stripColor && (
                         <rect x={-width/2} y={-height/2} width={stripWidth} height={height} fill={stripColor} stroke="none"/>
                    )}
                    {vm.hasCoA && vm.coatOfArmsUrl && (
                        <foreignObject x={imageX} y={-imageSize/2} width={imageSize} height={imageSize} className="overflow-visible">
                          <div className="w-full h-full flex items-center justify-center">
                             <img src={vm.coatOfArmsUrl} alt="" className="w-full h-full object-contain" style={{ filter: 'sepia(0.2) contrast(1.1)', mixBlendMode: 'multiply' }} />
                          </div>
                        </foreignObject>
                    )}
                    <text x={textX} y={0.5} textAnchor={textAnchor} fontSize={1.6} fontWeight={isSelected ? "bold" : "semibold"} className="font-serif fill-ink pointer-events-none tracking-wide">
                        {vm.name}
                    </text>
                     {vm.isExiled && (
                       <g transform={`translate(0, ${height/2 + 2.0})`}>
                         <text x={0} y={0} textAnchor="middle" fontSize={1.2} fill="#C17C59" className="font-display font-bold uppercase tracking-widest pointer-events-none">EXILE</text>
                       </g>
                    )}
                  </g>
                );
            })}
          </g>

          {/* --- 3. STICKY UI OVERLAY (Stable Frame) --- */}
          {/* These elements are positioned using screen pixels derived from data position, but one axis is clamped */}
          
          <defs>
             <filter id="text-halo" x="-50%" y="-50%" width="200%" height="200%">
                 <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                 <feFlood floodColor="#F3EDE2" result="color"/>
                 <feComposite in="color" in2="blur" operator="in" result="shadow"/>
                 <feMerge>
                     <feMergeNode in="shadow"/>
                     <feMergeNode in="shadow"/>
                     <feMergeNode in="SourceGraphic"/>
                 </feMerge>
             </filter>
          </defs>

          {/* Top Sticky Headers (Factions) - Y is fixed, X tracks map */}
          <text x={getX(75)} y={topLabelY} textAnchor="middle" filter="url(#text-halo)" className="font-display text-sm fill-ink font-bold tracking-[0.3em] uppercase pointer-events-none">Ghibellini</text>
          <text x={getX(185)} y={topLabelY} textAnchor="middle" filter="url(#text-halo)" className="font-display text-sm fill-ink font-bold tracking-[0.3em] uppercase pointer-events-none">Guelfi</text>
          
          {year >= 1300 && (
             <>
                 <text x={getX(147.5)} y={topLabelY + 15} textAnchor="middle" filter="url(#text-halo)" className="font-sans text-[10px] fill-ink/60 font-bold uppercase tracking-wider pointer-events-none">White</text>
                 <text x={getX(222.5)} y={topLabelY + 15} textAnchor="middle" filter="url(#text-halo)" className="font-sans text-[10px] fill-ink/60 font-bold uppercase tracking-wider pointer-events-none">Black</text>
             </>
          )}

          {/* Left Sticky Headers (Classes) - X is fixed, Y tracks map */}
          {/* Note: In data, Row Centers are approx 26, 57, 85. Or use lane tops 14, 46, 78 */}
          <text x={leftLabelX} y={getY(26.5)} textAnchor="start" filter="url(#text-halo)" className="font-display text-xs fill-ink font-bold tracking-[0.2em] uppercase opacity-70 pointer-events-none">Grandi</text>
          <text x={leftLabelX} y={getY(57)} textAnchor="start" filter="url(#text-halo)" className="font-display text-xs fill-ink font-bold tracking-[0.2em] uppercase opacity-70 pointer-events-none">Grassi</text>
          <text x={leftLabelX} y={getY(85)} textAnchor="start" filter="url(#text-halo)" className="font-display text-xs fill-ink font-bold tracking-[0.2em] uppercase opacity-70 pointer-events-none">Popolo</text>

        </svg>
      </div>
    </div>
  );
};

export default HistoricalMap;
