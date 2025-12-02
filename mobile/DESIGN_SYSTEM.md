# Design System Implementation

This document explains how the Figma design system has been translated to React Native.

## Color System

The design system uses CSS variables that have been converted to JavaScript constants:

### Light Mode (Default)
- **Primary**: `#0ea5e9` (Sky blue)
- **Background**: `#f8fafc` (Light gray)
- **Foreground**: `#0f172a` (Dark slate)
- **Muted**: `#f1f5f9` (Light gray)
- **Border**: `#e2e8f0` (Gray)

### Dark Mode
Dark mode colors are available in `darkColors` object. To implement dark mode:
1. Use `getColors(isDark)` helper function
2. Or import `darkColors` directly

## Usage

### Basic Colors
```jsx
import { colors } from './styles.jsx';

<View style={{ backgroundColor: colors.primary }}>
  <Text style={{ color: colors.primaryForeground }}>Hello</Text>
</View>
```

### Typography
```jsx
import { typography } from './styles.jsx';

<Text style={{
  fontSize: typography.textBase,
  fontWeight: typography.fontWeightMedium,
  lineHeight: typography.lineHeight * typography.textBase,
}}>
  Text content
</Text>
```

### Gradients
For gradients, you'll need `expo-linear-gradient`:

```bash
npx expo install expo-linear-gradient
```

Then use:
```jsx
import LinearGradient from 'expo-linear-gradient';
import { getGradientColors } from './styles.jsx';

<LinearGradient
  colors={getGradientColors('primary')}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradientButton}
>
  <Text>Gradient Button</Text>
</LinearGradient>
```

Available gradients:
- `primary` - Blue gradient
- `success` - Green gradient
- `warning` - Orange gradient
- `danger` - Red gradient
- `purple` - Purple gradient
- `pink` - Pink gradient

### Common Styles
```jsx
import { commonStyles } from './styles.jsx';

// Use pre-defined styles
<View style={commonStyles.card}>
  <Text style={commonStyles.title}>Card Title</Text>
</View>

// Status buttons
<TouchableOpacity style={[commonStyles.button, commonStyles.buttonSuccess]}>
  <Text style={commonStyles.buttonText}>Success</Text>
</TouchableOpacity>
```

### Card Hover Effect
React Native doesn't support CSS hover, but you can use `Pressable`:

```jsx
import { Pressable } from 'react-native';
import { commonStyles, createCardPressStyle } from './styles.jsx';

<Pressable
  style={({ pressed }) => [
    commonStyles.card,
    pressed && createCardPressStyle(commonStyles.card)
  ]}
>
  <Text>Pressable Card</Text>
</Pressable>
```

## Radius Values

- `radiusSm`: 12px
- `radiusMd`: 14px
- `radiusLg`: 16px (default)
- `radiusXl`: 20px

## Status Colors

- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Danger/Destructive**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

## Chart Colors

Available chart colors:
- `chart1`: Primary blue
- `chart2`: Success green
- `chart3`: Purple
- `chart4`: Warning orange
- `chart5`: Pink

## Migration Notes

### Backward Compatibility
The old color names are still available as aliases:
- `colors.text` → `colors.foreground`
- `colors.textLight` → `colors.mutedForeground`
- `colors.white` → `colors.white`
- `colors.error` → `colors.destructive`

### Breaking Changes
- `colors.accent` now refers to accent background color (`#dbeafe`)
- Use `colors.primary` for primary actions instead of `colors.accent`
- Input background uses `colors.inputBackground` instead of `colors.white`

## Examples

### Button with Primary Gradient
```jsx
import LinearGradient from 'expo-linear-gradient';
import { getGradientColors, commonStyles } from './styles.jsx';

<LinearGradient
  colors={getGradientColors('primary')}
  style={commonStyles.button}
>
  <Text style={commonStyles.buttonText}>Gradient Button</Text>
</LinearGradient>
```

### Card with Shadow
```jsx
<View style={[commonStyles.card, commonStyles.shadowPrimary]}>
  <Text>Card with primary shadow</Text>
</View>
```

### Status Badge
```jsx
<View style={{
  backgroundColor: colors.success,
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: spacing.radiusSm,
}}>
  <Text style={{ color: colors.successForeground }}>Success</Text>
</View>
```

