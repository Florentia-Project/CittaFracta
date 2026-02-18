// src/hooks/useHistoricalData.ts
import { useState, useEffect } from 'react';
import { INITIAL_DATASET, EVENTS } from '../constants';
import { Family, HistoricalEvent } from '../types';
import { fetchFamiliesFromSheet } from '../services/sheetService';

export const useHistoricalData = () => {
  // --- State Initialization ---
  const [data, setData] = useState<Family[]>(() => {
    try {
      const savedData = localStorage.getItem('florentine_factions_data_v4');
      return savedData ? JSON.parse(savedData) : INITIAL_DATASET;
    } catch (error) {
      console.error('Failed to load data from local storage:', error);
      return INITIAL_DATASET;
    }
  });

  const [events, setEvents] = useState<HistoricalEvent[]>(() => {
      try {
          const savedEvents = localStorage.getItem('florentine_factions_events_v2');
          return savedEvents ? JSON.parse(savedEvents) : EVENTS;
      } catch (error) {
          return EVENTS;
      }
  });

  const [isLoading, setIsLoading] = useState(true);

  // 1. Load data from Google Sheets on initialization
  useEffect(() => {
    const initData = async () => {
      try {
        console.log("🔄 Starting data sync from Google Sheets...");
        const freshData = await fetchFamiliesFromSheet();
        
        if (freshData && freshData.length > 0) {
          console.log(`✅ Data synced successfully! Loaded ${freshData.length} families.`);
          setData(freshData); 
          localStorage.setItem('florentine_factions_data_v4', JSON.stringify(freshData));
        } else {
           console.warn("⚠️ Sheet returned empty data. Keeping existing data.");
        }
      } catch (error) {
        console.error("❌ Failed to sync with Sheets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  // 2. Persist family data changes to local storage
  useEffect(() => {
    localStorage.setItem('florentine_factions_data_v4', JSON.stringify(data));
  }, [data]);

  // 3. Persist chronicle events changes to local storage
  useEffect(() => {
      localStorage.setItem('florentine_factions_events_v2', JSON.stringify(events));
  }, [events]);

  return { 
    data, 
    setData, 
    events, 
    setEvents, 
    isLoading 
  };
};