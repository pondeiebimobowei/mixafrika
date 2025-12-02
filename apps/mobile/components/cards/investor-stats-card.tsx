import React from 'react';
import { View, Text } from 'react-native';
import { formatCurrency } from '@/lib/utils';

interface InvestorStatsCardProps {
    label: string;
    amount: number;
    icon?: React.ReactNode;
}

export default function InvestorStatsCard({ label, amount, icon }: InvestorStatsCardProps) {
    return (
        <View className="flex-1 bg-white dark:bg-[rgb(23,26,33)] p-4 rounded-2xl dark:border border-border dark:border-slate-800">
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-black dark:text-slate-400 text-xs font-medium">
                    {label}
                </Text>
                
            </View>
            <Text className="text-xl font-bold text-black dark:text-white">
                {formatCurrency(amount)}
            </Text>
        </View>
    );
}
