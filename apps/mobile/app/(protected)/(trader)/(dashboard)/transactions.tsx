import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useTransactionsStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { Types } from '@mixafrica/shared/enums';
import clsx from 'clsx';


const FILTERS = ['all', ...Object.values(Types)] as const;

export type Filters = (typeof FILTERS)[keyof typeof FILTERS];

export default function TransactionsScreen() {
    const router = useRouter();
    const { transactions, getTransactions, loading } = useTransactionsStore();
    const [activeFilter, setActiveFilter] = useState<Filters>('all');

    useEffect(() => {
        getTransactions();
    }, []);

    useEffect(() => {
        getTransactions(activeFilter);
    }, [activeFilter]);

    const groupedTransactions = transactions;

    const getIcon = (type: string, amount: number) => {
        if (type === Types.WITHDRAWAL) {
            return <ArrowUp size={20} color="white" />;
        }
        if (type === Types.DEPOSIT) {
            return <ArrowDown size={20} color="#27AE60" />;
        }
        if (type === Types.INVESTMENT) {
            if (amount < 0) return <ArrowUp size={20} color="white" />;
            return <ArrowDown size={20} color="#27AE60" />;
        }
        return <ArrowDown size={20} color="#27AE60" />;
    };

    const getIconBg = (type: string, amount: number) => {
        if (type === Types.WITHDRAWAL || (type === Types.INVESTMENT && amount < 0)) {
            return "bg-[#2A2D35]";
        }
        return "bg-[#27AE60]/20";
    };

    return (
        <SafeAreaView className="flex-1 bg-[rgb(23,26,33)]">
            {/* Header */}
            <View className="flex-row items-center p-4 gap-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white text-xl font-semibold flex-1 text-center mr-8">
                    My Transactions
                </Text>
            </View>

            {/* Filters */}
            <View className="px-4 pb-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                    <View className='flex flex-row gap-3'>
                        {FILTERS.map((filter, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setActiveFilter(filter)}
                            className={clsx(
                                "px-2 py-2 rounded-full",
                                activeFilter === filter ? "bg-[#27AE60]" : "bg-[#2A2D35]"
                            )}
                        >
                            <Text className={clsx(
                                "font-medium capitalize",
                                activeFilter === filter ? "text-white" : "text-gray-400"
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
                    {Object.keys(groupedTransactions).map((date) => (
                        <View key={date} className="mb-6">
                            <Text className="text-gray-400 text-sm mb-3 font-medium">{date}</Text>
                            <View className="gap-3">
                                {groupedTransactions[date].map((t, index) => (
                                    <View
                                        key={t.id || index}
                                        className="bg-[#1C1F26] p-4 rounded-xl flex-row items-center justify-between"
                                    >
                                        <View className="flex-row items-center gap-4">
                                            <View className={clsx("w-10 h-10 rounded-full items-center justify-center", getIconBg(t.type, t.amount))}>
                                                {getIcon(t.type, t.amount)}
                                            </View>
                                            <View>
                                                <Text className="text-white font-semibold text-base">
                                                    {t.title || t.type}
                                                </Text>
                                                {t.category && (
                                                    <Text className="text-gray-400 text-xs">
                                                        {t.category}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <Text
                                            className={clsx(
                                                "font-bold text-base",
                                                t.amount > 0 ? "text-[#27AE60]" : "text-white"
                                            )}
                                        >
                                            {t.amount > 0 ? "+" : ""}{formatCurrency(t.amount)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
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
