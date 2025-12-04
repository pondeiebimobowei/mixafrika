import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';
import UpdatesTab from '@/components/screen/explore/updates-tab';
import { useCollectionState } from '@/store/hooks/collection.hook';
import CollectionView from '@/components/screen/explore/collection-view';

// Mock data for updates since we don't have it in the store yet
const UPDATES = [
    {
        id: '1',
        type: 'NEWS',
        title: 'New Shipment Arrived',
        date: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1566576912906-2200289b0188?auto=format&fit=crop&w=800&q=80',
        content: 'A major consignment of high-end laptops from Shenzhen has successfully cleared customs and arrived at the Ikeja warehouse. Distribution to retailers begins tomorrow.'
    },
    {
        id: '2',
        type: 'MILESTONE',
        title: 'Q3 Sales Record Broken',
        date: '3 days ago',
        content: 'The Computer Village Hub has recorded its highest quarterly turnover in history, driven by increased demand for remote work equipment.'
    }
];

export default function MarketDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [activeTab, setActiveTab] = useState<'overview' | 'updates'>('overview');

    const { data: { collection_by_id, get_collection_by_id } } = useCollectionState();

    useEffect(()=>{
        get_collection_by_id(id as string)
    }, [id])



    if (!collection_by_id) {
        return (
            <SafeAreaView className="flex-1 bg-black items-center justify-center">
                <Text className="text-white">Loading...</Text>
            </SafeAreaView>
        );
    }

    const { cluster } = collection_by_id;

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-black">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text className="text-black dark:text-white text-lg font-bold">{collection_by_id.name}</Text>
                </View>
                <TouchableOpacity>
                    <Bookmark size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className="flex-row border-b-[0.2px] border-gray-800 mt-2">
                <Pressable
                    onPress={() => setActiveTab('overview')}
                    className={cn(
                        "flex-1 items-center py-3 border-b-[1.5px]",
                        activeTab === 'overview' ? "border-[#10b981]" : "border-transparent"
                    )}
                >
                    <Text className={cn(
                        "font-semibold",
                        activeTab === 'overview' ? "text-[#10b981]" : "text-gray-400"
                    )}>Overview</Text>
                </Pressable>
                <Pressable
                    onPress={() => setActiveTab('updates')}
                    className={cn(
                        "flex-1 items-center py-3 border-b-2 flex-row justify-center gap-2",
                        activeTab === 'updates' ? "border-[#10b981]" : "border-transparent"
                    )}
                >
                    <Text className={cn(
                        "font-semibold",
                        activeTab === 'updates' ? "text-[#10b981]" : "text-gray-400"
                    )}>Market Updates</Text>
                    <View className="bg-[#10b981] rounded-full w-7 h-7 items-center justify-center">
                        <Text className="text-white dark:text-black text-xs font-bold">404</Text>
                    </View>
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-4 pt-6">
                {activeTab === 'overview' ? (
                    <CollectionView router={router} />
                ) : (
                    <UpdatesTab updates={UPDATES} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}