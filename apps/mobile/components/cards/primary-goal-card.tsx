import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Flag, Plus } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'expo-router';

export default function PrimaryGoalCard() {
    const router = useRouter();

    const goal: Record<string, any> = {};

    const progress = (goal.saved / goal.target) * 100 || 0;

    return (
        <View className="bg-[#1e293b] rounded-2xl p-5 mb-6">
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2">
                    <Flag size={20} color="#10b981" />
                    <Text className="text-white font-bold text-base">Primary Goal</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/esusu')}>
                    <Text className="text-[#10b981] text-xs font-bold">View All</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-end mb-2">
                <Text className="text-white font-bold text-lg">{goal.name}</Text>
                <Text className="text-slate-400 text-xs">
                    {formatCurrency(goal.saved)} / <Text className="text-slate-500">{formatCurrency(goal.target)}</Text>
                </Text>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-[#334155] rounded-full overflow-hidden mb-4">
                <View style={{ width: `${progress}%` }} className="h-full bg-[#10b981] rounded-full" />
            </View>

            <TouchableOpacity className="bg-[#1e293b] border border-slate-700 p-3 rounded-xl items-center flex-row justify-center gap-2">
                <Plus size={16} color="#10b981" />
                <Text className="text-[#10b981] font-bold text-sm">Add Funds</Text>
            </TouchableOpacity>
        </View>
    );
}
