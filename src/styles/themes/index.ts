export * from './types';
export * from './base';
export * from './clay';
export * from './solar-dusk';
export * from './theme-provider';

// Export available themes for type safety
export const AVAILABLE_THEMES = ['clay', 'solar-dusk'] as const;
export type ThemeName = typeof AVAILABLE_THEMES[number]; 