import { cn } from "@/lib/utils";
import React from "react";
import { View, ViewProps, Text } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export interface ProgressProps extends ViewProps {
  value: number;
  size?: "xs" | "sm" | "md";
  label?: string;
  showLabel?: boolean;
  className?: string;
  labelClassName?: string;
  indicatorClassName?: string;
}

export const Progress = ({
  value,
  size = "md",
  label = "Progress",
  showLabel = false,
  className,
  indicatorClassName,
  labelClassName,
  ...props
}: ProgressProps) => {
  const heightMap = { xs: 4, sm: 6, md: 8 };
  const height = heightMap[size];

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(value, 0), 100)}%`,
  }));

  return (
    <View className={`w-full`} {...props}>
      {showLabel && (
        <View className="flex-row justify-between mb-2">
          <Text className={cn("text-muted-foreground dark:text-slate-400 text-xs", labelClassName)}>
            {label}
          </Text>
          <Text className={cn("text-muted-foreground dark:text-white text-xs font-medium", labelClassName)}>
            {value.toFixed(1)}%
          </Text>
        </View>
      )}

      <View
        className={cn("bg-muted dark:bg-slate-800 rounded-full overflow-hidden", className )}
        style={{ height }}
      >
        <Animated.View
          className={cn("bg-green-500 rounded-full", indicatorClassName)}
          style={[{ height: "100%" }, animatedStyle]}
        />
      </View>
    </View>
  );
};
