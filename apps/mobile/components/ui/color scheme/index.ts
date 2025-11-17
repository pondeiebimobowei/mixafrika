export interface ColorScheme {
  primary: string;
  text: string;
  secondary: string;
  danger: string;
}

export const colorMap: ColorScheme = {
  primary: 'text-blue-600 dark:text-cyan-400',
  text: 'text-gray-900 dark:text-gray-100',

  // Secondary/muted text color: Medium Gray in light, Muted White in dark
  secondary: 'text-gray-500 dark:text-gray-400',

  // Error/Danger color
  danger: 'text-red-600 dark:text-red-400',
};

export type TextColor = keyof typeof colorMap;

// Optional: Define a type for your Color Map structure for TypeScript
// You can use this for better type checking if needed.
// export type ColorScheme = typeof colorMap;
