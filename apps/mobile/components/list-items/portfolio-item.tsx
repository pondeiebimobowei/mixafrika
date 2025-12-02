import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatCurrency } from '@/lib/utils';
import { Tractor, Shirt, Monitor } from 'lucide-react-native';
import { Progress } from '../ui/progress';

export interface PortfolioItemProps {
    name: string;
    category: string;
    duration: string;
    investedAmount: number;
    currentReturn: number;
    status: 'Pending' | 'Active' | 'Completed';
    repaymentProgress: number;
    iconType: 'agriculture' | 'manufacturing' | 'technology';
}

const getIcon = (type: string) => {
    switch (type) {
        case 'agriculture':
            return <Tractor size={20} color="#10b981" />;
        case 'manufacturing':
            return <Shirt size={20} color="#10b981" />;
        case 'technology':
            return <Monitor size={20} color="#10b981" />;
        default:
            return <Tractor size={20} color="#10b981" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending':
            return 'text-yellow-500 bg-yellow-500/10';
        case 'Active':
            return 'text-green-500 bg-green-500/10';
        case 'Completed':
            return 'text-blue-500 bg-blue-500/10';
        default:
            return 'text-gray-500 bg-gray-500/10';
    }
};

export default function PortfolioItem({
    name,
    category,
    duration,
    investedAmount,
    currentReturn,
    status,
    repaymentProgress,
    iconType,
}: PortfolioItemProps) {
    return (
        <View className="bg-white dark:bg-[rgb(23,26,33)] p-4 rounded-2xl dark:border border-border dark:border-slate-800 mb-4">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row gap-3">
                    <View className="w-10 h-10 rounded-xl bg-green-500/10 items-center justify-center">
                        {getIcon(iconType)}
                    </View>
                    <View>
                        <Text className="text-black dark:text-white font-bold text-base">{name}</Text>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-muted-foreground dark:text-slate-400 text-xs">{category}</Text>
                            <View className="bg-muted dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                                <Text className="text-white dark:text-slate-400 text-[10px]">{duration}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className={`px-2 py-1 rounded ${getStatusColor(status).split(' ')[1]}`}>
                    <Text className={`text-xs font-medium ${getStatusColor(status).split(' ')[0]}`}>
                        {status}
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between mb-4">
                <View>
                    <Text className="text-muted-foreground dark:text-slate-400 text-xs mb-1">Invested</Text>
                    <Text className="text-black dark:text-white font-bold text-lg">
                        {formatCurrency(investedAmount)}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-muted-foreground dark:text-slate-400 text-xs mb-1">Current Return</Text>
                    <Text className="text-green-500 font-bold text-lg">
                        +{formatCurrency(currentReturn)}
                    </Text>
                </View>
            </View>

            <Progress value={repaymentProgress} showLabel label="Repayment Progress" />

            {/* <View>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-muted-foreground dark:text-slate-400 text-xs">Repayment Progress</Text>
                    <Text className="text-muted-foreground dark:text-white text-xs font-medium">{repaymentProgress}%</Text>
                </View>
                <View className="h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${repaymentProgress}%` }}
                    />
                </View>
            </View> */}
        </View>
    );
}
