import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { ArrowRight, ChevronRight, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ContinentalBanner() {
    return (
        <TouchableOpacity className="mb-6 overflow-hidden rounded-2xl">
            <LinearGradient
                colors={['#d97706', '#b45309']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                
            >
                <View className="px-4 py-3 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                        <View className="bg-white/20 p-2.5 rounded-xl">
                            <Globe size={20} color="white" />
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-center gap-2 mb-1">
                                <Text className="text-white font-bold text-sm">
                                    Continental Markets
                                </Text>
                                <View className="bg-black/20 px-1.5 py-0.5 rounded text-xs">
                                    <Text className="text-white/90 text-[10px] font-bold">GOLD+</Text>
                                </View>
                            </View>
                            <Text className="text-white/90 text-xs" numberOfLines={1}>
                                Cross-border opportunities across Africa
                            </Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color="white" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}
