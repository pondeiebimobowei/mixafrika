import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Car, Heart, Target } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
// import { FlatList } from 'react-native-gesture-handler';

interface GoalItemProps {
    title: string;
    currentAmount: number;
    targetAmount: number;
    icon: React.ReactNode;
    color: string;
}

const SavingGoals = [
    {title: "New Car Fund", currentAmount: 16000, targetAmount: 25000, icon: <Car size={20} color="white" />, color: '#3b82f6'}, 
    {title: "Wedding Savings", currentAmount: 12400, targetAmount: 40000, icon: <Heart size={20} color="white" />, color: '#ef4444'}
]

const GoalItem = ({ title, currentAmount, targetAmount, icon, color }: GoalItemProps) => {
    const progress = Math.min((currentAmount / targetAmount) * 100, 100);

    return (
        <View className="bg-gray-10 border border-gray-200 dark:bg-slate-800/50 p-4 rounded-xl flex-1 mr-3 last:mr-0 min-w-[150px]">
            <View className={`w-10 h-10 rounded-full items-center justify-center mb-3`} style={{ backgroundColor: color }}>
                {icon}
            </View>
            <Text className="text-black dark:text-white font-bold mb-1">{title}</Text>
            <Text className="text-gray-600 dark:text-slate-400 text-xs mb-3">
                {Math.round(progress)}% of {formatCurrency(targetAmount, 'USD', 0)}
            </Text>

            <View className="h-1.5 bg-muted dark:bg-slate-700 rounded-full overflow-hidden">
                <View
                    className="h-full rounded-full"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </View>
        </View>
    );
};

export default function FinancialGoalsCard() {
    return (
        <View className="bg-white dark:bg-[rgb(23,26,33)] p-5 rounded-2xl dark:border border-slate-800">
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2">
                    <Target size={20} color="skyblue" />
                    <Text className="text-lg font-bold text-black dark:text-white">
                        Financial Goals
                    </Text>
                </View>
                <TouchableOpacity>
                    <Text className="text-green-500 font-semibold text-sm">Manage</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ItemSeparatorComponent={() => <View className="w-6" />}
                ListEmptyComponent={<Text className="text-center text-gray-600 dark:text-slate-400">No financial goals found</Text>}
                data={SavingGoals}
                horizontal
                renderItem={({item}) => (
                    <GoalItem
                        title={item.title}
                        currentAmount={item.currentAmount}
                        targetAmount={item.targetAmount}
                        icon={item.icon}
                        color={item.color} // Blue
                    />
                )}
            />
        </View>
    );
}
