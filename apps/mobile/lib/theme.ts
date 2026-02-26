import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
 
export const THEME = {
  light: {
  background: 'hsl(220 4% 2%)',
  foreground: 'hsl(0 0% 98%)',
  card: 'hsl(220 3% 8%)',
  cardForeground: 'hsl(0 0% 98%)',
  popover: 'hsl(240 10% 3.9%)',
  popoverForeground: 'hsl(0 0% 98%)',

  primary: 'hsl(151 51% 33%)',
  primaryForeground: 'hsl(0 0% 98%)',

  secondary: 'hsl(240 3.7% 15.9%)',
  secondaryForeground: 'hsl(0 0% 98%)',

  muted: 'hsl(240 3.7% 15.9%)',
  mutedForeground: 'hsl(240 5% 64.9%)',

  accent: 'hsl(81 92% 75%)',
  accentForeground: 'hsl(151 51% 33%)',

  destructive: 'hsl(346 70% 55%)',
  destructiveForeground: 'hsl(0 0% 98%)',

  border: 'hsl(240 3.7% 15.9%)',
  input: 'hsl(240 3.7% 15.9%)',
  ring: 'hsl(142 76% 36%)',
  radius: '0.625rem',

  chart1: 'hsl(142 76% 36%)',
  chart2: 'hsl(346 70% 55%)',
  chart3: 'hsl(30 80% 55%)',
  chart4: 'hsl(280 65% 60%)',
  chart5: 'hsl(340 75% 55%)',

  grassGreen: 'hsl(120 60% 60%)',
}
,
  dark: {
  background: 'hsl(220 4% 2%)',
  foreground: 'hsl(0 0% 98%)',
  card: 'hsl(220 3% 8%)',
  cardForeground: 'hsl(0 0% 98%)',
  popover: 'hsl(240 10% 3.9%)',
  popoverForeground: 'hsl(0 0% 98%)',

  primary: 'hsl(151 51% 33%)',
  primaryForeground: 'hsl(0 0% 98%)',

  secondary: 'hsl(240 3.7% 15.9%)',
  secondaryForeground: 'hsl(0 0% 98%)',

  muted: 'hsl(240 3.7% 15.9%)',
  mutedForeground: 'hsl(240 5% 64.9%)',

  accent: 'hsl(81 92% 75%)',
  accentForeground: 'hsl(151 51% 33%)',

  destructive: 'hsl(346 70% 55%)',
  destructiveForeground: 'hsl(0 0% 98%)',

  border: 'hsl(240 3.7% 15.9%)',
  input: 'hsl(240 3.7% 15.9%)',
  ring: 'hsl(142 76% 36%)',
  radius: '0.625rem',

  chart1: 'hsl(142 76% 36%)',
  chart2: 'hsl(346 70% 55%)',
  chart3: 'hsl(30 80% 55%)',
  chart4: 'hsl(280 65% 60%)',
  chart5: 'hsl(340 75% 55%)',

  grassGreen: 'hsl(120 60% 60%)',
}
,
};
 
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};