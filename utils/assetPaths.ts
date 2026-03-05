/**
 * Utility functions for resolving asset paths
 * Handles normalization of paths from different sources (local, Google Sheets, etc.)
 */

const BASE_PATH = '/CittaFracta/';
const ASSETS_PREFIX = '/assets/';

/**
 * Normalizes an asset path to include the Vite base path if needed
 * 
 * @param path - The asset path to normalize (e.g., '/assets/CoatOfArms/ABATi.svg')
 * @returns The normalized path (e.g., '/CittaFracta/assets/CoatOfArms/ABATi.svg')
 * 
 * @example
 * // From Google Sheets
 * normalizeAssetPath('/assets/CoatOfArms/ABATi.svg') 
 * // => '/CittaFracta/assets/CoatOfArms/ABATi.svg'
 * 
 * // Already has base path
 * normalizeAssetPath('/CittaFracta/assets/CoatOfArms/oltrarno.svg')
 * // => '/CittaFracta/assets/CoatOfArms/oltrarno.svg'
 * 
 * // External URL (unchanged)
 * normalizeAssetPath('https://upload.wikimedia.org/...')
 * // => 'https://upload.wikimedia.org/...'
 */
export const normalizeAssetPath = (path: string | undefined): string => {
  // Handle empty or falsy values
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return '';
  }

  path = path.trim();

  // External URLs (http, https) - return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Already includes the base path - return as-is
  if (path.startsWith(BASE_PATH)) {
    return path;
  }

  // Local asset path without base (from Google Sheets)
  if (path.startsWith(ASSETS_PREFIX)) {
    return BASE_PATH + path.slice(1); // Remove leading '/' from '/assets/' to avoid double slash
  }

  // Relative path without leading slash - add base path
  if (path.startsWith('assets/')) {
    return BASE_PATH + path;
  }

  // Path that doesn't start with slash but contains /assets/
  if (path.includes('/assets/')) {
    const assetsIndex = path.indexOf('/assets/');
    return BASE_PATH + path.slice(assetsIndex + 1);
  }

  // Any other path - assume it's a local asset and add base path
  if (!path.startsWith('/')) {
    return BASE_PATH + 'assets/' + path;
  }

  // Single slash path - add base path
  return BASE_PATH + path.slice(1);
};

/**
 * Validates if an asset path is valid and not empty
 * Useful for conditional rendering
 */
export const isValidAssetPath = (path: string | undefined): boolean => {
  if (!path || typeof path !== 'string') {
    return false;
  }
  const normalized = normalizeAssetPath(path);
  return normalized.length > 0 && normalized !== BASE_PATH;
};

/**
 * Gets a fallback image path (e.g., for missing coat of arms)
 * Can be used when an image fails to load
 */
export const getFallbackImagePath = (): string => {
  // You could return a path to a placeholder image if one exists
  // For now, returns empty string to show alt text
  return '';
};
