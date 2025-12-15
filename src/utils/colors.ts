/**
 * Treasures of Titan Color Palette
 * Based on game card colors and board imagery
 */

// Card Colors (primary game colors)
export const cardColors = {
  purple: '#9C27B0',
  orange: '#FF5722',
  blue: '#00BCD4',
  yellow: '#FFC107'
} as const;

// Resource Colors
export const resourceColors = {
  energy: '#FFC107', // Yellow/gold
  food: '#4CAF50', // Green
  lumber: '#8D6E63', // Brown
  mineral: '#607D8B', // Blue-grey
  wild: '#9E9E9E' // Grey
} as const;

// UI Colors
export const colors = {
  // Card colors
  ...cardColors,

  // Resource colors
  ...resourceColors,

  // Background & Board
  background: '#F5F5DC', // Beige (like the game board)
  boardLight: '#E8DCC4',
  boardDark: '#C4B5A0',

  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',

  // Semantic colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Text
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  textOnDark: '#FFFFFF',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)'
} as const;

// Card color names for type safety
export type CardColor = keyof typeof cardColors;
export type ResourceType = keyof typeof resourceColors;

// Helper function to get card color
export function getCardColor(color: CardColor): string {
  return cardColors[color];
}

// Helper function to get resource color
export function getResourceColor(resource: ResourceType): string {
  return resourceColors[resource];
}
