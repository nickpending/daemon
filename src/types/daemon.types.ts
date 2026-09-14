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
  EXPLORATIONS?: string;
  WHAT_IM_BUILDING?: string;
  FAVORITE_BOOKS?: string;
  FAVORITE_MOVIES?: string;
  FAVORITE_TV?: string;
  PREFERENCES?: string;
  DAILY_ROUTINE?: string;
  PREDICTIONS?: string;
  PHILOSOPHY?: string;
  CONTACT?: string;
}

/**
 * Processed daemon data ready for component consumption
 */
export interface Exploration {
  title: string;
  description: string;
  tags?: string[];
}

export interface ContactLink {
  platform: string;
  url: string;
}

export interface DaemonData {
  about: string;
  mission: string;
  telos: string[];
  currentLocation: string;
  philosophy: string;
  explorations: Exploration[];
  whatImBuilding: string[];
  preferences: string[];
  dailyRoutine: string[];
  favoriteBooks: string[];
  favoriteMovies: string[];
  favoriteTv: string[];
  predictions: string[];
  contact: ContactLink[];
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
