import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowRight, MapPin, Rocket, Truck } from 'lucide-react-native';
import { cn, formatCurrency } from '@/lib/utils';
import { ICluster, IClusterWithCollection } from '@mixafrica/shared/types/cluster';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export interface MarketCardProps {
    name: string;
    location: string;
    description: string;
    returnRate: number;
    minInvestment: number;
    investorsCount: number;
    cyclesCount: number;
    iconType: 'rocket' | 'truck' | 'default';
    onPress?: () => void;
}

export default function MarketCard({
    name,
    cover_image,
    roi,
    collection
}: IClusterWithCollection) {
    return (
        <TouchableOpacity
            className="bg-white dark:bg-[#111827] rounded-2xl p-4 dark:border border-gray-800 mb-4"
        >
            {/* Header */}
            <View className="flex-row items-start gap-3 mb-3">
                <View className="">
                    <View className=''>
                        <Avatar alt="" className="w-10 h-10">
                            <AvatarImage
                            source={{ uri: cover_image as string }}
                            />
                            <AvatarFallback className='bg-blue-200 dark:bg-blue-300/60'>
                                <Text className='text-black dark:text-white font-bold text-lg'>{name?.charAt(0)}</Text>
                            </AvatarFallback>
                        </Avatar>
                    </View>
                </View>
                <View>
                    <Text className="text-black dark:text-white font-bold text-lg">{name}</Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                        <MapPin size={12} color="#9ca3af" />
                        <Text className="text-gray-600 dark:text-gray-400 text-xs">{collection.city +  ' ' +  collection.state + ' ' + collection.country }</Text>
                    </View>
                </View>
            </View>

            {/* Description */}
            <Text className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-5">
                {collection.description}
            </Text>

            {/* Stats Grid */}
            <View className="flex-row gap-3 mb-4">
                <View className="flex-1 bg-gray-200 dark:bg-[#1f2937] p-3 rounded-xl">
                    <Text className="text-gray-400 text-xs mb-1">Up to</Text>
                    <Text className="text-green-500 md:text-emerald-400 font-bold text-lg">
                        {roi}% Return
                    </Text>
                </View>
                <View className="flex-1 bg-gray-200 dark:bg-[#1f2937] p-3 rounded-xl">
                    <Text className="text-gray-400 text-xs mb-1">Min Investment</Text>
                    <Text className="text-white font-bold text-lg">
                        {formatCurrency(collection.min_investment)}
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-between border-t border-gray-800 pt-3">
                <Text className="text-gray-400 text-xs">
                    {0} Active Investors
                </Text>
                <View className="flex-row items-center gap-1">
                    <Text className="text-blue-400 text-xs font-semibold">
                        View {1} Cycles
                    </Text>
                    <ArrowRight size={14} color="#60a5fa" />
                </View>
            </View>
        </TouchableOpacity>
    );
}
