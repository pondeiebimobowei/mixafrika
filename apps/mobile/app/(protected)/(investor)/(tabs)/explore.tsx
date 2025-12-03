import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, SlidersHorizontal, Sun, Moon, Globe } from 'lucide-react-native';
import { useAuthStore } from '@/store';
import { useColorScheme } from 'nativewind';
import ContinentalBanner from '@/components/banners/continental-banner';
import MarketCard, { MarketCardProps } from '@/components/cards/market-card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClusterState, useFetchCluster } from '@/store/hooks/cluster.hook';

const MARKETS: MarketCardProps[] = [
    {
        name: 'Silicon Savannah Startups',
        location: 'Nairobi, Kenya',
        description:
            'Funding early-stage fintech and agrotech startups in the kilimani tech ecosystem.',
        returnRate: 16.2,
        minInvestment: 4000,
        investorsCount: 210,
        cyclesCount: 3,
        iconType: 'rocket',
    },
    {
        name: 'Mombasa Logistics',
        location: 'Mombasa, Kenya',
        description:
            'Port operations and cargo transport fleet expansion for East African trade routes.',
        returnRate: 13.8,
        minInvestment: 3500,
        investorsCount: 156,
        cyclesCount: 3,
        iconType: 'truck',
    },
];


export default function Explore() {
    const { user } = useAuthStore();
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: { cluster } } = useClusterState()


    useFetchCluster()

    const COUNTRIES = [
        { label: 'Nigeria', value: 'Nigeria' },
        { label: 'South Africa', value: 'South Africa' },
        { label: 'Kenya', value: 'Kenya' },
    ]


    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-200 dark:bg-black px-4 pt-0 pb-6">
            {/* Header Section */}
            <View className="flex flex-row items-center justify-between py-4 mb-2">
                <View className="flex flex-row gap-3 items-center">
                    {user?.image ? (
                        <Image
                            className="w-10 h-10 rounded-full"
                            source={{ uri: user.image }}
                        />
                    ) : (
                        <View className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Text className="text-foreground font-bold">
                                {user?.first_name?.charAt(0) || 'I'}
                            </Text>
                        </View>
                    )}

                    <View>
                        <Text className="text-black dark:text-white text-lg font-bold">Explore</Text>
                    </View>
                </View>

                <View className="flex flex-row gap-4 items-center">
                    <Pressable>
                        <Bell size={24} className="text-white" color="white" />
                    </Pressable>
                    <Pressable onPress={toggleColorScheme}>
                        {colorScheme === 'dark' ? (
                            <Sun size={24} className="text-white" color="white" />
                        ) : (
                            <Moon size={24} className="text-white" color="white" />
                        )}
                    </Pressable>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View className="bg-white dark:bg-[#1f2937] rounded-xl flex-row items-center px-4 py-3 mb-6">
                    <Search size={20} color="#9ca3af" className="mr-3" />
                    <TextInput
                        placeholder="Search markets, categories..."
                        placeholderTextColor="#9ca3af"
                        className="flex-1 text-white text-base"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Continental Banner */}
                <ContinentalBanner />

                {/* Filters */}
                <View className='flex-row items-center justify-between mb-4'>
                    <View className='flex-1 mr-3'>
                        <Select className='w-full'>
                            <SelectTrigger icon={Globe} className='w-full bg-white dark:bg-white/50 border-0'>
                                <SelectValue className='text-black font-medium dark:text-white' placeholder='All Countries' />
                            </SelectTrigger>
                            <SelectContent className='w-11/12  border-none outline-none stroke-none'>
                                <SelectGroup>
                                {
                                    COUNTRIES.map((duration) => (
                                    <SelectItem key={duration.value} label={duration.label} value={duration.value}>
                                        {duration.label}
                                    </SelectItem>
                                    ))
                                }
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                    </View>

                    <Pressable className="bg-white dark:bg-[#1f2937] p-3 rounded-xl">
                        <SlidersHorizontal size={20} color={ colorScheme == 'light' ? 'black': 'white'} />
                    </Pressable>

                    

                </View>

                {/* Results Count */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-gray-400 font-medium">
                        {cluster?.length} Markets Found
                    </Text>
                    <TouchableOpacity>
                        <Text className="text-[#10b981] font-semibold">Clear all</Text>
                    </TouchableOpacity>
                </View>

                {/* Market List */}
                <View className="pb-8">
                    {cluster?.map((market, index) => (
                        <MarketCard key={index} {...{... market}} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}