import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { cn } from '@/lib/utils';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View className="flex-row bg-white dark:bg-[#1A1A1A] dark:border-t dark:border-gray-800 py-2 mb-4">
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                // @ts-ignore                
                if (options.title === '(dashboard)') return null;

                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const color = isFocused ? '#27AE60' : '#8A8A8E'; // Green for active, Gray for inactive

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        className="flex-1 items-center justify-center gap-1"
                    >
                        {options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
                        <Text
                            style={{ color }}
                            className={cn(
                                "text-xs font-medium",
                                isFocused ? "text-[#27AE60]" : "text-[#8A8A8E]"
                            )}
                        >
                            {label as string}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
