import React from "react";
import { View, ViewProps, Text } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export interface ProgressProps extends ViewProps {
  value: number;
  size?: "xs" | "sm" | "md";
  label?: string;
  showLabel?: boolean;
  className?: string;
  indicatorClassName?: string;
}

export const Progress = ({
  value,
  size = "md",
  label = "Progress",
  showLabel = false,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) => {
  const heightMap = { xs: 4, sm: 6, md: 8 };
  const height = heightMap[size];

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(value, 0), 100)}%`,
  }));

  return (
    <View className={`w-full ${className}`} {...props}>
      {showLabel && (
        <View className="flex-row justify-between mb-2">
          <Text className="text-muted-foreground dark:text-slate-400 text-xs">
            {label}
          </Text>
          <Text className="text-muted-foreground dark:text-white text-xs font-medium">
            {value}%
          </Text>
        </View>
      )}

      <View
        className="bg-muted dark:bg-slate-800 rounded-full overflow-hidden"
        style={{ height }}
      >
        <Animated.View
          className={`bg-green-500 rounded-full ${indicatorClassName}`}
          style={[{ height: "100%" }, animatedStyle]}
        />
      </View>
    </View>
  );
};
