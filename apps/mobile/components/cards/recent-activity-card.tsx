import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'expo-router';

export default function RecentActivityCard() {
    const router = useRouter();

    const activities = [
        {
            id: 1,
            title: "Daily Loan Repayment",
            time: "Today, 9:00 AM",
            amount: 1833,
            type: 'debit'
        },
        {
            id: 2,
            title: "Esusu Contribution",
            time: "Today, 8:30 AM",
            amount: 5000,
            type: 'debit'
        },
        {
            id: 3,
            title: "Savings Deposit",
            time: "Yesterday",
            amount: 2500,
            type: 'debit' // Assuming deposit into savings is a debit from wallet, or maybe credit? Screenshot shows red arrow up, usually indicative of money LEAVING (expense/payment).
            // Wait, Red Arrow Up usually means Money Out (Sent). Green Arrow Down usually means Money In (Received).
            // Screenshot shows Red circle with arrow UP. This likely means "Payment Sent" or "Money Out".
        }
    ];

    return (
        <View className="bg-[#1e293b] rounded-2xl p-5 mb-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-bold text-lg">Recent Activity</Text>
                <TouchableOpacity onPress={() => router.push('/(protected)/(trader)/(tabs)/transactions' as any)}>
                    <Text className="text-[#10b981] text-xs font-bold">See All</Text>
                </TouchableOpacity>
            </View>

            <View className="gap-4">
                {activities.map((item) => (
                    <View key={item.id} className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center">
                                <ArrowUp size={18} color="#ef4444" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-sm">{item.title}</Text>
                                <Text className="text-slate-400 text-xs">{item.time}</Text>
                            </View>
                        </View>
                        <Text className="text-white font-bold">{formatCurrency(item.amount)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
