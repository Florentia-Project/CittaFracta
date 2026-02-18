// src/hooks/useTimeline.ts
import { useState, useEffect, useCallback } from 'react';
import { INITIAL_YEAR, MAX_YEAR } from '../constants';
import { HistoricalEvent } from '../types';

export const useTimeline = (events: HistoricalEvent[], isKeyboardEnabled: boolean = true) => {
  const [currentYear, setCurrentYear] = useState<number>(INITIAL_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);

  // פונקציית הקפיצה - משתמשת בפונקציית עדכון (prev) כדי להבטיח דיוק
  const jumpToEvent = useCallback((direction: 'next' | 'prev') => {
    setCurrentYear(prev => {
      const sortedEvents = [...events].sort((a, b) => a.year - b.year);
      if (direction === 'next') {
        const next = sortedEvents.find(e => e.year > prev);
        return next ? next.year : prev;
      } else {
        const prevEv = [...sortedEvents].reverse().find(e => e.year < prev);
        return prevEv ? prevEv.year : prev;
      }
    });
  }, [events]);

  // פליי/פאוז אוטומטי
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= MAX_YEAR) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // המאזין למקלדת - הפעם עם פתרון לבעיית ה-Focus
  useEffect(() => {
    // אם המקלדת מכובה (למשל במפה הגיאוגרפית) - אל תרשום את המאזין בכלל
    if (!isKeyboardEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // בדיקה אם המשתמש מקליד בתיבת טקסט
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'range') return;
      if (target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (e.shiftKey) jumpToEvent('next');
        else setCurrentYear(prev => Math.min(prev + 1, MAX_YEAR));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (e.shiftKey) jumpToEvent('prev');
        else setCurrentYear(prev => Math.max(prev - 1, INITIAL_YEAR));
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    // הצמדה ל-window מבטיחה שזה יעבוד מכל מקום
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isKeyboardEnabled, jumpToEvent]); // מאזין מחדש רק כשהטאב משתנה

  return { currentYear, setCurrentYear, isPlaying, setIsPlaying, jumpToEvent };
};