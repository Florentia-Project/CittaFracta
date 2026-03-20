import { useEffect, useRef } from 'react';
import { createTimeline, stagger, utils } from 'animejs';

interface UseScriptoriumRevealOptions {
  isHistoricalMode: boolean;
  isReady: boolean;
}

const TARGETS = [
  '.scriptorium-title',
  '.scriptorium-subtitle',
  '.scriptorium-header-line',
  '.scriptorium-faction-col',
  '.scriptorium-class-label',
  '.scriptorium-family-cell',
  '.scriptorium-year',
  '.scriptorium-timeline',
].join(', ');

export function useScriptoriumReveal({ isHistoricalMode, isReady }: UseScriptoriumRevealOptions) {
  const hasRevealed = useRef(false);

  useEffect(() => {
    if (!isHistoricalMode || !isReady || hasRevealed.current) return;
    hasRevealed.current = true;

    // Start everything invisible
    utils.set(TARGETS, { opacity: 0 });

    const tl = createTimeline({ ease: 'outExpo', autoplay: true });

    // 0.2s — Title drifts in (ink settling onto vellum)
    tl.add('.scriptorium-title', {
      opacity: [0, 1],
      translateY: [-4, 0],
      duration: 800,
    }, 200);

    // 0.8s — Subtitle
    tl.add('.scriptorium-subtitle', {
      opacity: [0, 1],
      duration: 500,
    }, '-=200');

    // 1.0s — Header ruling line draws left to right
    tl.add('.scriptorium-header-line', {
      opacity: [0, 1],
      scaleX: [0, 1],
      transformOrigin: 'left center',
      duration: 600,
    }, '-=100');

    // 1.4s — Faction column headers
    tl.add('.scriptorium-faction-col', {
      opacity: [0, 1],
      translateY: [-3, 0],
      delay: stagger(150),
      duration: 500,
    });

    // 1.8s — Class row labels
    tl.add('.scriptorium-class-label', {
      opacity: [0, 1],
      translateX: [-6, 0],
      delay: stagger(100),
      duration: 400,
    }, '-=100');

    // 2.2s — Family cells wave in like ink absorbing into vellum
    tl.add('.scriptorium-family-cell', {
      opacity: [0, 1],
      scale: [0.95, 1],
      delay: stagger(30),
      duration: 350,
    }, '-=100');

    // 2.8s — Year number
    tl.add('.scriptorium-year', {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 600,
    }, '-=200');

    // 3.0s — Timeline bar
    tl.add('.scriptorium-timeline', {
      opacity: [0, 1],
      scaleX: [0, 1],
      transformOrigin: 'left center',
      duration: 500,
    }, '-=300');

  }, [isHistoricalMode, isReady]);

  // Reset when switching to Modern: clear animejs inline styles so elements are visible
  useEffect(() => {
    if (!isHistoricalMode) {
      hasRevealed.current = false;
      // Remove inline opacity/transform that animejs may have set, restoring CSS defaults
      const elements = document.querySelectorAll<HTMLElement>(TARGETS);
      elements.forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
      });
    }
  }, [isHistoricalMode]);
}
