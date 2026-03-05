# Project Context: CITTAFRACTA
**Description:** A digital history research tool visualization of Florentine factions and families in the 13th century (specifically 1215-1302).
**Goal:** To serve academic researchers by visualizing historical data from Google Sheets onto interactive Geographical and Social/Political maps.

## 1. Tech Stack & Style
* **Framework:** React + Vite + TypeScript.
* **Styling:** Tailwind CSS.
* **Design Language:** "Historical/Academic".
    * Backgrounds: `bg-parchment` (Paper texture).
    * Text: `text-ink` / `text-ink-light`.
    * Fonts: `font-display` (Headings), `font-serif` (Body).
    * Colors: Earth tones, Earth-Orange for highlights.
* **Icons:** Lucide-React.

## 2. Architecture (Feature-Based)
The project is structured by features, not just by file type.
* `src/features/geo-map`: Logic and components for the Geographical Map (The city view).
* `src/features/social-map`: Logic for the Political/Network Map (The factions view).
* `src/features/chronicle`: The event system and modals.
* `src/services/sheetService.ts`: **CRITICAL**. This acts as the backend. It fetches raw data from Google Sheets.
* `src/hooks/useHistoricalData.ts`: The bridge that loads data from the service into the React state.

## 3. Core Logic (App.tsx)
`App.tsx` is the orchestrator. It manages the Global State:
1.  **Time:** `currentYear` (Controlled by a slider/timeline).
2.  **Data:** `data` (List of Families) and `events` (Historical Events).
3.  **View:** `activeTab` switches between `'map'` (Social Visualization) and `'city'` (Geographical Map).
4.  **Selection:** `selectedFamily` handles the sidebar details.

## 4. Data Flow
1.  **Input:** Google Sheets (External Source).
2.  **Fetch:** `sheetService` pulls the data.
3.  **Store:** `useHistoricalData` hook provides the data to `App.tsx`.
4.  **Render:** `App.tsx` passes the *filtered* data (based on `currentYear`) to `HistoricalMap` or `GeographicalMap`.

## 5. Coding Rules for AI
* **Respect the Era:** UI components should feel like a historical document (Modals are chronicles, sidebars are ledgers).
* **No Dummy Data:** Always assume data comes from the `data` prop or the `useHistoricalData` hook.
* **Types:** Always use types from `src/types.ts` (Family, HistoricalEvent).
* **Vibe Coding:** When suggesting changes, explain the *logic* simply. Do not over-engineer. Keep components modular but readable.

