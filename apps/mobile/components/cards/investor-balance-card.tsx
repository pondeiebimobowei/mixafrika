import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, Plus, ArrowUp, Eye, EyeOff } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
import { useColorScheme } from 'nativewind';

interface InvestorBalanceCardProps {
    balance: number;
    onDeposit?: () => void;
    onWithdraw?: () => void;
}

export default function InvestorBalanceCard({
    balance,
    onDeposit,
    onWithdraw,
}: InvestorBalanceCardProps) {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    return (
        <View className="bg-white dark:bg-[rgb(23,26,33)] p-5 rounded-3xl border border-gray-800 relative overflow-hidden">
            <View className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet size={80} color="white" />
            </View>

            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-gray-400 text-sm">
                            Available Balance
                        </Text>
                        <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                            {isBalanceVisible ? (
                                <Eye size={16} color="#9ca3af" />
                            ) : (
                                <EyeOff size={16} color="#9ca3af" />
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text className="text-4xl font-bold text-white">
                        {isBalanceVisible ? formatCurrency(balance) : '∗∗∗∗∗∗∗∗∗∗'}
                    </Text>
                </View>
                <View className="bg-[#1f2937] p-2 rounded-full">
                    <Wallet size={24} color="white" />
                </View>
            </View>

            <View className="flex-row gap-4">
                <TouchableOpacity
                    onPress={onDeposit}
                    className="flex-1 bg-[#10b981] flex-row items-center justify-center py-3 rounded-xl gap-2"
                >
                    <Plus size={20} color="white" />
                    <Text className="text-white font-bold">Deposit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onWithdraw}
                    className="flex-1 bg-[#1f2937] border border-gray-700 flex-row items-center justify-center py-3 rounded-xl gap-2"
                >
                    <ArrowUp size={20} color="white" />
                    <Text className="text-white font-bold">Withdraw</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
