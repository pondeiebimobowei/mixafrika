import React, { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MoreVertical, CreditCard, ArrowUpCircle, ArrowDown, Store } from 'lucide-react-native';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useColorScheme } from 'nativewind';
import { useSavingsState } from '@/store/hooks/savings.hook';

export default function SavingsDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const {  data: { selectedSavings, getSavingsById }} = useSavingsState()

    
    const progress = Math.min((Number(selectedSavings?.total_amount) / Number(selectedSavings?.target_amount)) * 100, 100);

    useEffect(()=> {
        getSavingsById(id as string)
    },[id])


    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-100 dark:bg-black">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text className="text-black dark:text-white text-lg font-bold">{selectedSavings?.name}</Text>
                </View>
                <TouchableOpacity>
                    <MoreVertical size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 pt-2 pb-10" showsVerticalScrollIndicator={false}>

                {/* Balance Card */}
                <View className="bg-[#1e1b4b] rounded-3xl p-6 mb-6">
                    <View className="items-center mb-6">
                        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Current Balance</Text>
                        <Text className="text-white text-4xl font-bold">{formatCurrency(selectedSavings?.total_amount)}</Text>
                    </View>

                    <View className="bg-[#312e81] rounded-2xl p-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-[#10b981] font-bold text-xs">{progress.toFixed(0)}% Reached</Text>
                            <Text className="text-gray-400 text-xs">Target: {formatCurrency(selectedSavings?.target_amount)}</Text>
                        </View>
                        <View className="h-3 bg-[#1e1b4b] rounded-full overflow-hidden">
                            <View
                                className="h-full bg-[#10b981] rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </View>
                    </View>
                </View>

                {/* Info Grid */}
                <View className="flex-row flex-wrap gap-4 mb-6">
                    {/* Interest Rate */}
                    <View className="flex-1 min-w-[45%] bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Interest Rate</Text>
                        <Text className="text-black dark:text-white text-xl font-bold">{selectedSavings?.interest_rate}</Text>
                    </View>

                    {/* Maturity */}
                    {selectedSavings?.type === 'fixed' && (
                    <View className="flex-1 min-w-[45%] bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Maturity</Text>
                        <Text className="text-black dark:text-white text-xl font-bold">{formatDate(selectedSavings?.maturity_date as Date)}</Text>
                    </View>
                    )}
                    

                    {/* Next Deposit */}
                    {selectedSavings?.type === 'target' && (
                    <View className="flex-1 min-w-[45%] bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Frequency</Text>
                        <Text className="text-black dark:text-white text-xl capitalize font-bold">{selectedSavings?.frequency}</Text>
                    </View>
                    )}

                    {/* Status */}
                    <View className="flex-1 min-w-[45%] bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Type</Text>
                        <Text className="text-[#10b981] text-xl capitalize font-bold">{selectedSavings?.type}</Text>
                    </View>

                    <View className="flex-1 min-w-[45%] bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Locked</Text>
                        <Text className="text-[#10b981] text-xl capitalize font-bold">{selectedSavings?.is_locked ? 'Yes' : 'No'}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="gap-3 mb-8">
                    <TouchableOpacity className="bg-[#10b981] py-4 rounded-xl flex-row items-center justify-center gap-2">
                        <CreditCard size={20} color="white" />
                        <Text className="text-white font-bold text-base">Top Up with Card / Wallet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-[#1f2937] py-4 rounded-xl flex-row items-center justify-center gap-2">
                        <Store size={20} color="white" />
                        <Text className="text-white font-bold text-base">Deposit via Agent</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-[#450a0a] py-4 rounded-xl flex-row items-center justify-center gap-2">
                        <ArrowUpCircle size={20} color="#f87171" />
                        <Text className="text-[#f87171] font-bold text-base">Withdraw Funds</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Contributions */}
                <View className="mb-8">
                    <Text className="text-black dark:text-white text-lg font-bold mb-4">Recent Contributions</Text>

                    {selectedSavings?.history?.map((transaction) => (
                        <View key={transaction.id} className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 mb-3 flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 rounded-full bg-[#10b981]/20 items-center justify-center">
                                    <ArrowDown size={20} color="#10b981" />
                                </View>
                                <View>
                                    <Text className="text-black dark:text-white font-bold">{transaction.type}</Text>
                                    <Text className="text-gray-500 dark:text-gray-400 text-xs">{transaction.createdAt}</Text>
                                </View>
                            </View>
                            <Text className="text-[#10b981] font-bold">+{formatCurrency(transaction.amount)}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
