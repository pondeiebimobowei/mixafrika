import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PiggyBank, ChevronRight } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useSavingsState } from '@/store/hooks/savings.hook';

export default function EsusuGroupDashboardCard() {
    const router = useRouter();

    const { data: { savings } } = useSavingsState()

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
                {
                savings?.length > 0 ? (savings.slice(0,2).map((group) => (
                    <View key={group.id} className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <View className="flex-row justify-between items-start mb-1">
                            <Text className="text-white font-bold text-base">{group.name}</Text>
                            <View className="bg-white/20 px-2 py-1 rounded">
                                <Text className="text-white text-[10px]">{group.frequency}</Text>
                            </View>
                        </View>
                        <Text className="text-purple-100 text-sm">
                            Saved: <Text className="text-white font-bold">{formatCurrency(group.total_amount)}</Text>
                        </Text>
                    </View>
                ))) : (
                    <View className="flex items-center justify-center">
                        <Text className="text-white text-sm text-center">Join a savings circle today</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/esusu')}
                            className="bg-white rounded-xl px-6 py-2 mt-2"
                        >
                            <Text className="text-gray-500 font-bold text-xs">Join Now</Text>
                        </TouchableOpacity>
                    </View>
                )
                }
            </View>
        </View>
    );
}
