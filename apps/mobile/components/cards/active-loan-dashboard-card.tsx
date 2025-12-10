import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'expo-router';

export default function ActiveLoanDashboardCard() {
    const router = useRouter();

    // Mock Data based on screenshot
    const loanData = {
        outstanding: 36670,
        dueDate: "Oct 31, 2023",
        progress: 33,
        dailyInstallment: 1833
    };

    return (
        <View className="bg-[#059669] rounded-2xl p-5 mb-6 relative overflow-hidden">
            {/* Top Row: Balance & Due Date */}
            <View className="flex-row justify-between items-start mb-4">
                <View>
                    <Text className="text-emerald-100 text-xs font-medium mb-1">Outstanding Balance</Text>
                    <Text className="text-white text-3xl font-bold">{formatCurrency(loanData.outstanding)}</Text>
                </View>
                <View className="items-end">
                    <Text className="text-emerald-100 text-xs font-medium mb-1">Due Date</Text>
                    <Text className="text-white font-bold">{loanData.dueDate}</Text>
                </View>
            </View>

            {/* Repayment Progress */}
            <View className="mb-6">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-emerald-100 text-xs font-medium">Repayment Progress</Text>
                    <Text className="text-white text-xs font-bold">{loanData.progress}%</Text>
                </View>
                <View className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <View style={{ width: `${loanData.progress}%` }} className="h-full bg-white rounded-full" />
                </View>
            </View>

            {/* Bottom Action Area */}
            <View className="bg-[#047857] rounded-xl p-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-emerald-100 text-[10px] uppercase font-bold mb-0.5">Daily Installment</Text>
                    <Text className="text-white text-xl font-bold">{formatCurrency(loanData.dailyInstallment)}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/repayment-history')}
                    className="bg-white px-6 py-3 rounded-lg"
                >
                    <Text className="text-[#059669] font-bold">Pay Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
