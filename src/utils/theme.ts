/**
 * Statifly Design Tokens
 * Based on dark theme with green accents (reference UI).
 */

export const colors = {
  // Backgrounds
  bg: '#0D0D0D',
  bgCard: '#1A1A1A',
  bgCardLight: '#242424',
  bgInput: '#2A2A2A',

  // Primary (green accent)
  primary: '#A8E847',       // bright lime green
  primaryDark: '#7CB830',
  primaryMuted: 'rgba(168, 232, 71, 0.15)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',

  // Functional
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#60A5FA',

  // Borders
  border: '#2A2A2A',
  borderLight: '#333333',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  hero: 36,
} as const;
