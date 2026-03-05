/**
 * Utility for deduplicating families in the political map
 * Since some families have multiple entries (different locations),
 * we only need one for the political/social visualization
 */

import { Family } from '../../../types';

/**
 * Deduplicates families by ID, keeping only the first occurrence
 * This is useful for the political map where coordinates don't matter
 * 
 * @param families - Array of families (may have duplicates by ID)
 * @returns Array of unique families (one per ID)
 */
export const deduplicateFamiliesByID = (families: Family[]): Family[] => {
  const seen = new Set<string>();
  const unique: Family[] = [];

  for (const family of families) {
    if (!seen.has(family.id)) {
      seen.add(family.id);
      unique.push(family);
    }
  }

  return unique;
};

/**
 * Deduplicates families by name (alternative approach)
 * Useful if family names are more reliable than IDs
 * 
 * @param families - Array of families (may have duplicates by name)
 * @returns Array of unique families (one per name)
 */
export const deduplicateFamiliesByName = (families: Family[]): Family[] => {
  const seen = new Set<string>();
  const unique: Family[] = [];

  for (const family of families) {
    const name = family.name.toLowerCase().trim();
    if (!seen.has(name)) {
      seen.add(name);
      unique.push(family);
    }
  }

  return unique;
};
