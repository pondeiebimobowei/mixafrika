import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionsStore } from '@/store';
import { Types } from '@mixafrica/shared/enums';
import clsx from 'clsx';
import TransactionItems from '@/components/cards/transaction-item';


const FILTERS = ['all', ...Object.values(Types)] as const;

export type Filters = (typeof FILTERS)[keyof typeof FILTERS];

export default function TransactionsScreen() {
    const { transactions, getTransactions, loading } = useTransactionsStore();
    const [activeFilter, setActiveFilter] = useState<Filters>('all');

    useEffect(() => {
        getTransactions();
    }, []);

    useEffect(() => {
        getTransactions(activeFilter);
    }, [activeFilter]);

    const groupedTransactions = transactions;


    return (
        <SafeAreaView edges={[]} className="flex-1 bg-gray-200 dark:bg-[rgb(23,26,33)]">

            {/* Filters */}
            <View className="px-4 py-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                    <View className='flex flex-row gap-3'>
                        {FILTERS.map((filter, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setActiveFilter(filter)}
                            className={clsx(
                                "px-2 py-2 rounded-full",
                                activeFilter === filter ? "bg-[#27AE60]" : "bg-white dark:bg-[#2A2D35]"
                            )}
                        >
                            <Text className={clsx(
                                "font-medium capitalize",
                                activeFilter === filter ? "text-white" : "dark:text-gray-400 text-gray-500"
                            )}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                </ScrollView>
            </View>

            {/* Content */}
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#27AE60" />
                </View>
            ) : (
                <ScrollView className="flex-1 px-4">
                    <View className='gap-3 mt-4'>
                        {Object.values(groupedTransactions).flat().map((transaction) => <TransactionItems key={transaction.id} transaction={transaction} />
                        )}
                    </View>
                    <View className="" />
                    <View className="p-4">
                        <TouchableOpacity className="bg-[#27AE60] px-0 py-2 rounded-xl items-center">
                            <Text className="text-white font-bold text-base">Load more</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
