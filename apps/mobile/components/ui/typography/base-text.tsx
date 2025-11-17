// src/components/BaseText.tsx

import React, { useMemo } from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { colorMap, ColorScheme, TextColor } from '../color scheme';
// Assuming colorMap is available here (or adjust import path)
// import { colorMap, ColorScheme } from "../theme/colorMap";

// --- Type Definitions ---

type FontWeight =
  | 'extralight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';

interface BaseTextProps {
  children: React.ReactNode;
  weight?: FontWeight;
  color?: TextColor; // <--- The theme-aware color prop
  fontSize?: number;
  className?: string;
  fontFamily?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

// --- Font Weight Mapping ---

const fontWeights: Record<FontWeight, TextStyle['fontWeight']> = {
  extralight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// --- BaseText Component Implementation ---

export const BaseText: React.FC<BaseTextProps> = ({
  children,
  weight = 'regular',
  color = 'danger', // Default to the main text color
  fontSize,
  className = '', // Default to empty string for safety
  fontFamily = 'BricolageGrotesque',
  style,
  onPress,
}) => {
  // 1. Get the theme-aware class string from the map
  const colorClass = color ? colorMap[color] : '';

  // 2. Combine dynamic color class with user-provided className
  // Note: If className contains a conflicting color utility (e.g., 'text-red-500'),
  // it will override the colorClass due to NativeWind's style processing order.
  const finalClassName = `${colorClass} ${className}`.trim();

  // --- RN Static Styles (Memoized) ---
  const baseStyles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          // These are static styles that NativeWind does not override easily
          fontFamily: fontFamily,
          fontWeight: fontWeights[weight],
          textAlignVertical: 'center',
        },
      }),
    [fontFamily, weight],
  );

  // --- Combine All Styles ---
  const combinedStyles = [
    baseStyles.text,
    fontSize !== undefined ? { fontSize } : {}, // Apply static fontSize if provided
    style, // Apply any RN `StyleProp<TextStyle>` overrides last
  ];

  return (
    <Text
      // NativeWind handles the classes
      className={finalClassName}
      // React Native StyleSheet handles the static styles
      style={combinedStyles}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

// --- Convenience Components ---

type ConvenienceTextProps = Omit<BaseTextProps, 'weight'>;

export const LightText: React.FC<ConvenienceTextProps> = (props) => (
  <BaseText {...props} weight="light" />
);

export const RegularText: React.FC<ConvenienceTextProps> = (props) => (
  <BaseText {...props} weight="regular" />
);

export const MediumText: React.FC<ConvenienceTextProps> = (props) => (
  <BaseText {...props} weight="medium" />
);

export const SemiBoldText: React.FC<ConvenienceTextProps> = (props) => (
  <BaseText {...props} weight="semibold" />
);

export const BoldText: React.FC<ConvenienceTextProps> = (props) => (
  <BaseText {...props} weight="bold" />
);

export const ExtraboldText: React.FC<ConvenienceTextProps> = (props) => (
  <BaseText {...props} weight="extrabold" />
);

export const ExtraLightText: React.FC<ConvenienceTextProps> = (props) => (
  <BaseText {...props} weight="extralight" />
);
// Optional: Add a size class to size-specific convenience components
export const ExtraSmallText: React.FC<ConvenienceTextProps> = (props) => (
  <BaseText
    {...props}
    weight="extralight"
    className={`text-xs ${props.className || ''}`}
  />
);
