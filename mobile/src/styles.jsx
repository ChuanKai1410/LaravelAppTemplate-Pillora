import { StyleSheet, Platform } from 'react-native';

// Design System Colors - Light Mode (Default)
export const colors = {
  // Base colors
  background: '#e0f2fe', // Light blue background
  foreground: '#0f172a',
  card: '#ffffff',
  cardForeground: '#0f172a',
  popover: '#ffffff',
  popoverForeground: '#0f172a',
  
  // Primary colors
  primary: '#0ea5e9',
  primaryForeground: '#ffffff',
  
  // Secondary colors
  secondary: '#e0f2fe',
  secondaryForeground: '#0c4a6e',
  
  // Muted colors
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  
  // Accent colors
  accent: '#dbeafe',
  accentForeground: '#0c4a6e',
  
  // Status colors
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  success: '#10b981',
  successForeground: '#ffffff',
  warning: '#f59e0b',
  warningForeground: '#ffffff',
  info: '#3b82f6',
  infoForeground: '#ffffff',
  
  // UI colors
  border: '#e2e8f0',
  input: 'transparent',
  inputBackground: '#f8fafc',
  switchBackground: '#cbd5e1',
  ring: '#0ea5e9',
  
  // Chart colors
  chart1: '#0ea5e9',
  chart2: '#10b981',
  chart3: '#8b5cf6',
  chart4: '#f59e0b',
  chart5: '#ec4899',
  
  // Sidebar colors
  sidebar: '#ffffff',
  sidebarForeground: '#0f172a',
  sidebarPrimary: '#0ea5e9',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#f1f5f9',
  sidebarAccentForeground: '#0f172a',
  sidebarBorder: '#e2e8f0',
  sidebarRing: '#0ea5e9',
  
  // Legacy aliases for backward compatibility
  text: '#0f172a',
  textLight: '#64748b',
  white: '#ffffff',
  error: '#ef4444',
};

// Dark Mode Colors
export const darkColors = {
  background: '#0f172a',
  foreground: '#f8fafc',
  card: '#1e293b',
  cardForeground: '#f8fafc',
  popover: '#1e293b',
  popoverForeground: '#f8fafc',
  primary: '#0ea5e9',
  primaryForeground: '#ffffff',
  secondary: '#1e3a8a',
  secondaryForeground: '#dbeafe',
  muted: '#334155',
  mutedForeground: '#94a3b8',
  accent: '#1e3a8a',
  accentForeground: '#dbeafe',
  destructive: '#dc2626',
  destructiveForeground: '#ffffff',
  success: '#059669',
  successForeground: '#ffffff',
  warning: '#d97706',
  warningForeground: '#ffffff',
  info: '#2563eb',
  infoForeground: '#ffffff',
  border: '#334155',
  input: '#334155',
  inputBackground: '#1e293b',
  switchBackground: '#475569',
  ring: '#0ea5e9',
  chart1: '#0ea5e9',
  chart2: '#10b981',
  chart3: '#8b5cf6',
  chart4: '#f59e0b',
  chart5: '#ec4899',
  sidebar: '#1e293b',
  sidebarForeground: '#f8fafc',
  sidebarPrimary: '#0ea5e9',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#334155',
  sidebarAccentForeground: '#f8fafc',
  sidebarBorder: '#334155',
  sidebarRing: '#0ea5e9',
  // Legacy aliases
  text: '#f8fafc',
  textLight: '#94a3b8',
  white: '#ffffff',
  error: '#dc2626',
};

// Typography
export const typography = {
  fontSize: 16,
  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',
  lineHeight: 1.5,
  
  // Font sizes
  text2xl: 24,
  textXl: 20,
  textLg: 18,
  textBase: 16,
  textSm: 14,
  textXs: 12,
};

// Spacing & Radius
export const spacing = {
  radius: 16, // 1rem = 16px
  radiusSm: 12, // calc(var(--radius) - 4px)
  radiusMd: 14, // calc(var(--radius) - 2px)
  radiusLg: 16, // var(--radius)
  radiusXl: 20, // calc(var(--radius) + 4px)
};

// Gradient utilities (for use with LinearGradient component)
export const gradients = {
  primary: ['#0ea5e9', '#0284c7'],
  success: ['#10b981', '#059669'],
  warning: ['#f59e0b', '#d97706'],
  danger: ['#ef4444', '#dc2626'],
  purple: ['#8b5cf6', '#7c3aed'],
  pink: ['#ec4899', '#db2777'],
};

// Helper function to get current colors (can be extended for dark mode)
export const getColors = (isDark = false) => {
  return isDark ? darkColors : colors;
};

// Common Styles using Design System
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: typography.text2xl + 8, // 32px
    fontWeight: typography.fontWeightBold,
    color: colors.foreground,
    marginBottom: 8,
    lineHeight: typography.lineHeight * (typography.text2xl + 8),
  },
  subtitle: {
    fontSize: typography.textBase,
    color: colors.mutedForeground,
    lineHeight: typography.lineHeight * typography.textBase,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightMedium,
    color: colors.foreground,
    marginBottom: 8,
    lineHeight: typography.lineHeight * typography.textSm,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: typography.textBase,
    color: colors.foreground,
    fontWeight: typography.fontWeightNormal,
    lineHeight: typography.lineHeight * typography.textBase,
  },
  inputFocused: {
    borderColor: colors.ring,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusMd,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: colors.muted,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightMedium,
    lineHeight: typography.lineHeight * typography.textBase,
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
  },
  linkButton: {
    marginTop: 4,
  },
  linkButtonText: {
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightSemibold,
    color: colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: typography.textSm,
    color: colors.mutedForeground,
  },
  
  // Card styles
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  // Note: For hover effects in React Native, use Pressable with onPressIn/onPressOut
  // or TouchableOpacity with activeOpacity prop
  
  // Status button styles
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonWarning: {
    backgroundColor: colors.warning,
  },
  buttonDanger: {
    backgroundColor: colors.destructive,
  },
  buttonInfo: {
    backgroundColor: colors.info,
  },
  
  // Text styles
  textPrimary: {
    color: colors.primary,
  },
  textMuted: {
    color: colors.mutedForeground,
  },
  textSuccess: {
    color: colors.success,
  },
  textWarning: {
    color: colors.warning,
  },
  textDanger: {
    color: colors.destructive,
  },
  
  // Shadow utilities
  shadowPrimary: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },
  shadowSuccess: {
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },
});

// Utility functions for React Native

/**
 * Get gradient colors for LinearGradient component
 * Usage:
 * import LinearGradient from 'expo-linear-gradient';
 * <LinearGradient colors={getGradientColors('primary')} ... />
 */
export const getGradientColors = (gradientName) => {
  return gradients[gradientName] || gradients.primary;
};

/**
 * Create a pressable card style with elevation/shadow
 * Usage:
 * <Pressable style={({ pressed }) => [
 *   commonStyles.card,
 *   pressed && createCardPressStyle(commonStyles.card)
 * ]}>
 */
export const createCardPressStyle = (baseStyle) => ({
  ...baseStyle,
  opacity: 0.9,
  transform: [{ translateY: -2 }],
  shadowOpacity: baseStyle.shadowOpacity ? baseStyle.shadowOpacity * 1.2 : 0.15,
});

/**
 * Get text gradient style (requires expo-linear-gradient or similar)
 * For React Native, you may need to use a library like react-native-linear-gradient
 * or create a custom component with LinearGradient as background
 */
export const getTextGradientStyle = () => {
  // Note: Text gradients in React Native require special handling
  // Consider using a library or creating a custom component
  return {
    color: colors.primary, // Fallback to solid color
  };
};

