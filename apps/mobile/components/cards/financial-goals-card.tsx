import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Car, Heart, Target, TargetIcon } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
import { useGoalsStore } from '@/store';
import { Progress } from '../ui/progress';
// import { FlatList } from 'react-native-gesture-handler';

interface GoalItemProps {
    title: string;
    current_amount: number;
    target_amount: number;
    icon: React.ReactNode;
    color: string;
}


const GoalItem = ({ title, current_amount, target_amount, icon, color }: GoalItemProps) => {
    const progress = Math.min((current_amount / target_amount) * 100, 100);

    return (
        <View className="bg-gray-10 border border-gray-200 dark:bg-slate-800/50 p-4 rounded-xl flex-1 mr-3 last:mr-0 min-w-[150px]">
            <View className={`w-10 h-10 rounded-full items-center justify-center mb-3`}>
                {icon}
            </View>
            <Text className="text-black dark:text-white font-bold mb-1">{title}</Text>
            <Text className="text-gray-600 dark:text-slate-400 text-xs mb-3">
                {Math.round(progress)}% of {formatCurrency(target_amount, 'USD', 0)}
            </Text>

            <Progress size='sm' value={progress} className='bg-gray-200' indicatorClassName='bg-green-600' />
            
        </View>
    );
};

export default function FinancialGoalsCard() {
    const { goals} = useGoalsStore()
    return (
        <View className="bg-white dark:bg-[rgb(23,26,33)] my-6 p-5 rounded-2xl dark:border border-slate-800">
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2">
                    <TargetIcon size={24} color="#3b82f6" />
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
                data={goals}
                horizontal
                renderItem={({item}) => (
                    <GoalItem
                        title={item.name}
                        current_amount={10}
                        target_amount={50}
                        icon={<TargetIcon size={28} color="#3b82f6" />}
                        color={"green"} // Blue
                    />
                )}
            />
        </View>
    );
}
