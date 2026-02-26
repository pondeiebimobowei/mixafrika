import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface InvestorEarningsChartProps {
    amount: number;
    percentageChange: number;
    data?: any[];
}

export default function InvestorEarningsChart({
    amount,
    percentageChange,
    data,
}: InvestorEarningsChartProps) {
    const chartData = data || [
        { value: 50, label: 'Mon' },
        { value: 80, label: 'Tue' },
        { value: 60, label: 'Wed' },
        { value: 90, label: 'Thu' },
        { value: 50, label: 'Fri' },
        { value: 100, label: 'Sat' },
        { value: 80, label: 'Sun' },
    ];

    return (
        <View className="bg-white dark:bg-[rgb(23,26,33)] p-5 rounded-2xl dark:border border-border dark:border-slate-800">
            <View className="flex-row justify-between items-start mb-4">
                <View>
                    <Text className="text-black dark:text-slate-400 text-sm mb-1">
                        Daily Earnings
                    </Text>
                    <Text className="text-3xl font-bold text-black dark:text-white">
                        {formatCurrency(amount)}
                    </Text>
                </View>
                <View className="bg-green-500/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                    <TrendingUp size={14} color="#22c55e" />
                    <Text className="text-green-500 font-bold text-xs">
                        +{percentageChange}%
                    </Text>
                </View>
            </View>

            <View className="-ml-4">
                <LineChart
                    areaChart
                    data={chartData}
                    curved
                    width={width - 80}
                    height={150}
                    color="#22c55e"
                    thickness={2}
                    hideDataPoints
                    hideYAxisText
                    hideRules
                    startFillColor="rgba(34, 197, 94, 0.3)"
                    endFillColor="rgba(34, 197, 94, 0.01)"
                    startOpacity={0.9}
                    endOpacity={0.1}
                    initialSpacing={20}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    xAxisLabelTextStyle={{ color: 'gray', fontSize: 10 }}
                    isAnimated
                    animationDuration={1200}
                />
            </View>
        </View>
    );
}
