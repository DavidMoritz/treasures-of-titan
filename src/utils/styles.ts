import { StyleSheet } from 'react-native';
import { colors } from './colors';

/**
 * Global styles for Treasures of Titan
 * Check this file before creating new styles - reuse where possible
 */

export const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  containerCentered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  containerPadded: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background
  },

  // Flexbox utilities
  row: {
    flexDirection: 'row'
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  column: {
    flexDirection: 'column'
  },
  columnCentered: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Text styles
  text: {
    color: colors.textPrimary,
    fontSize: 16
  },
  textBold: {
    fontWeight: 'bold'
  },
  textSecondary: {
    color: colors.textSecondary,
    fontSize: 14
  },
  textSmall: {
    fontSize: 12
  },
  textLarge: {
    fontSize: 20
  },
  heading1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary
  },

  // Buttons
  button: {
    backgroundColor: colors.blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonSecondary: {
    backgroundColor: colors.grey300,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    backgroundColor: colors.grey400,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  cardElevated: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },

  // Spacing
  marginSmall: {
    margin: 8
  },
  marginMedium: {
    margin: 16
  },
  marginLarge: {
    margin: 24
  },
  paddingSmall: {
    padding: 8
  },
  paddingMedium: {
    padding: 16
  },
  paddingLarge: {
    padding: 24
  },

  // Borders
  border: {
    borderWidth: 1,
    borderColor: colors.grey300
  },
  borderRounded: {
    borderRadius: 8
  },
  borderCircle: {
    borderRadius: 9999
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay
  },
  overlayLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayLight
  },
  overlayDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayDark
  },

  // Utilities
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  shadowLarge: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  }
});

// Common constants for inline styles
export const center = 'center' as const;
export const absolute = 'absolute' as const;
export const relative = 'relative' as const;
export const bold = 'bold' as const;
export const row = 'row' as const;
export const column = 'column' as const;
