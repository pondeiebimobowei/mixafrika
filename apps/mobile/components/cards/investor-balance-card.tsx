import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, Plus, ArrowUp } from 'lucide-react-native';
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
    const { colorScheme } = useColorScheme()
    return (
        <View className="bg-white dark:bg-[rgb(23,26,33)] p-5 rounded-2xl dark:border border-border dark:border-slate-800">
            <View className="flex-row justify-between items-start mb-4">
                <View>
                    <Text className="text-gray-600 dark:text-slate-400 text-sm mb-1">
                        Available Balance
                    </Text>
                    <Text className="text-3xl font-bold text-black dark:text-white">
                        {formatCurrency(balance)}
                    </Text>
                </View>
                <View className="bg-white dark:bg-slate-800 p-2 rounded-full">
                    <Wallet size={24} className="text-foreground dark:text-slate-300" color={colorScheme === 'dark' ? 'white' : 'black'} />
                </View>
            </View>

            <View className="flex-row gap-4">
                <TouchableOpacity
                    onPress={onDeposit}
                    className="flex-1 bg-primary flex-row items-center justify-center py-3 rounded-xl gap-2"
                >
                    <Plus size={20} color="white" />
                    <Text className="text-primary-foreground font-semibold">Deposit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onWithdraw}
                    className="flex-1 bg-white border border-gray-300 dark:border-slate-800 dark:bg-slate-800 flex-row items-center justify-center py-3 rounded-xl gap-2"
                >
                    <ArrowUp size={20} className="text-foreground dark:text-white" color={colorScheme === 'dark' ? 'white' : 'black'} />
                    <Text className="text-black dark:text-white font-semibold">Withdraw</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
