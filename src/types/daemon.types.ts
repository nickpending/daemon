/**
 * Type definitions for daemon.md parsing
 */

/**
 * Raw parsed sections from daemon.md
 * Keys match section headers: [ABOUT], [MISSION], etc.
 */
export interface DaemonSections {
  ABOUT?: string;
  CURRENT_LOCATION?: string;
  MISSION?: string;
  TELOS?: string;
  WHAT_IM_BUILDING?: string;
  FAVORITE_BOOKS?: string;
  FAVORITE_MOVIES?: string;
  FAVORITE_TV?: string;
  PREFERENCES?: string;
  DAILY_ROUTINE?: string;
  PREDICTIONS?: string;
  PHILOSOPHY?: string;
}

/**
 * Processed daemon data ready for component consumption
 */
export interface DaemonData {
  about: string;
  mission: string;
  telos: string[];
  currentLocation: string;
  philosophy: string;
  whatImBuilding: string[];
  preferences: string[];
  dailyRoutine: string[];
  favoriteBooks: string[];
  favoriteMovies: string[];
  favoriteTv: string[];
  predictions: string[];
  lastUpdated: string;
}

/**
 * Hero-specific data subset
 */
export interface HeroData {
  tagline: string;
  location: string;
  subtitle: string;
}
