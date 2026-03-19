import type { Config } from 'tailwindcss';

/*
 * tailwind.config.ts — CittaFracta Design System (Modern default)
 *
 * NOTE: The CDN Tailwind in index.html has an inline tailwind.config
 * that is the ACTIVE config for the browser. This file mirrors it
 * exactly for Vite build consistency. Keep both in sync.
 *
 * Two modes:
 *   Modern (default) — clean, readable parchment palette
 *   Scriptorio       — toggled via .historical-mode CSS class in index.css
 */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        display: ['Cinzel', 'serif'],
        label: ['Cinzel', 'serif'],
        body: ['Crimson Pro', 'serif'],
        medieval: ['MedievalSharp', 'cursive'],
      },
      colors: {
        'parchment': '#F3EDE2',
        'parchment-mid': '#EDE0BF',
        'parchment-dark': '#E6DCCF',
        'parchment-deep': '#D9C9A3',
        'ink': '#332D28',
        'ink-light': '#6B665F',
        'ink-faded': '#5C4033',
        'earth-brown': '#8B5E3C',
        'earth-orange': '#C17C59',
        'earth-green': '#7D8471',
        'rubric': '#8B1A1A',
        'rubric-light': '#C0392B',
      },
    },
  },
  plugins: [],
} satisfies Config;
