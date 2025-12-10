import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PiggyBank, ChevronRight } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'expo-router';

export default function EsusuGroupDashboardCard() {
    const router = useRouter();

    // Mock Data based on screenshot
    const groups = [
        {
            id: 1,
            name: "Lagos Traders Circle",
            frequency: "Daily Contribution",
            saved: 45000,
        },
        {
            id: 2,
            name: "Weekly Shop Owners",
            frequency: "Weekly Contribution",
            saved: 220000,
        }
    ];

    return (
        <View className="bg-[#a855f7] rounded-2xl p-5 mb-6">
            {/* Header */}
            <TouchableOpacity
                onPress={() => router.push('/esusu')}
                className="flex-row justify-between items-center mb-4"
            >
                <View className="flex-row items-center gap-2">
                    <PiggyBank size={20} color="white" />
                    <Text className="text-white text-lg font-bold">Esusu Groups</Text>
                </View>
                <ChevronRight size={20} color="white" />
            </TouchableOpacity>

            {/* Groups List */}
            <View className="gap-3">
                {groups.map((group) => (
                    <View key={group.id} className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <View className="flex-row justify-between items-start mb-1">
                            <Text className="text-white font-bold text-base">{group.name}</Text>
                            <View className="bg-white/20 px-2 py-1 rounded">
                                <Text className="text-white text-[10px]">{group.frequency}</Text>
                            </View>
                        </View>
                        <Text className="text-purple-100 text-sm">
                            Saved: <Text className="text-white font-bold">{formatCurrency(group.saved)}</Text>
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
