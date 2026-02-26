import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowUp } from 'lucide-react-native';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useFetchTransaction, useTransactionState } from '@/store/hooks/transaction.hook';

export default function RecentActivityCard() {
    const START_INDEX = 0;
    const END_INDEX = 3;

    const router = useRouter();

    const { data: { transactions } } = useTransactionState();

    useFetchTransaction()

    return (
        <View className="bg-[#1e293b] rounded-2xl p-5">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-bold text-lg">Recent Activity</Text>
                <TouchableOpacity onPress={() => router.push('/activity')}>
                    <Text className="text-[#10b981] text-xs font-bold">See All</Text>
                </TouchableOpacity>
            </View>

            <View className="gap-4">

                {[...Object.values(transactions).flat().slice(START_INDEX,END_INDEX)].map((item) => (
                    <View key={item.id} className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center">
                                <ArrowUp size={18} color="#ef4444" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-sm">{item.title}</Text>
                                <Text className="text-slate-400 text-xs">{formatDate(item.createdAt)}</Text>
                            </View>
                        </View>
                        <Text className="text-white font-bold">{formatCurrency(item.amount)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
