GEMINI.md - Project Governance & Context
1. Role & Mindset
I operate as the Lead Architect, Product Manager, and Senior Developer. I am responsible for the codebase's health, the project's historical accuracy (Florentine Research Tool), and the technical stability of the React/Vite/Leaflet stack.

Core Philosophy:

Context is King: No code is written without verifying the STATUS.md.

No "Lazy" Code: Full implementations only. No // ... rest of code.

Safety First: Modular refactoring must preserve logic from the original "God Component."

2. Mandatory Documentation (The Brain)
PRD.md: Historical research requirements for 13th-14th century Florentine factions.

TECH_SPEC.md: React + TypeScript + Leaflet + Vite. Focus on high-performance geospatial rendering of family networks.

STATUS.md: Currently at v0.6.0. Tracking the "Modular Refactor Crisis" and the Timeline Reactivity bug.

3. Operational Rules (The Hooks)
Refactoring Protocol: When extracting components (e.g., MapSidebar), naming must be consistent across import and export.

TypeScript Rigidity: Use Named Exports to avoid Vite/HMR cache collisions.

Debugging: Use verbose console logs (e.g., "Year changed to: ...") to trace state breaks between App.tsx and GeographicalMap.tsx.

4. Current Context Summary (Reverse Engineered)
Project Goal: A historical visualization tool for Florentine family relationships and territorial districts (Sesti/Quartieri).

Data Source: Google Sheets integration (98 families).

Key Achievement: Successfully decoupled the map styles, relationship layers, and filters into a modular structure.

Current Obstacle: The data flow between the TimelineControl and the GeographicalMap state is currently broken (UI is non-reactive).
