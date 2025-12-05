import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Zap, PiggyBank, Lock, Gem, ArrowRight } from 'lucide-react-native';
import { cn, formatCurrency } from '@/lib/utils';
import { useSavingsState, useFetchSavings } from '@/store/hooks/savings.hook';
import Header from '@/components/layout/header';
import SavingsCardItem from '@/components/savings-card-item';
import ProductCardItem from '@/components/product-card-item';

export default function Savings() {
    const [activeTab, setActiveTab] = useState<'active' | 'rates'>('active');
    const { data: { savings } } = useSavingsState();

    useFetchSavings();

    const totalSavings = 404;
    const interestAccrued = 404;

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-100 dark:bg-black">

            <Header />

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <View className="bg-[#1e1b4b] rounded-3xl p-5 mb-6 relative overflow-hidden">
                    <View className="absolute top-0 right-0 p-4 opacity-20">
                        <PiggyBank size={80} color="white" />
                    </View>

                    <Text className="text-gray-300 mb-1">Total Savings</Text>
                    <Text className="text-white text-4xl font-bold mb-2">{formatCurrency(totalSavings)}</Text>

                    <View className="flex-row items-center gap-1 mb-6">
                        <ArrowRight size={16} color="#10b981" className="rotate-[-45deg]" />
                        <Text className="text-[#10b981] font-medium">+{formatCurrency(interestAccrued)} interest accrued</Text>
                    </View>

                    <View className="flex-row gap-3">
                        <TouchableOpacity className="flex-1 bg-[#10b981] py-3 rounded-xl flex-row items-center justify-center gap-2">
                            <Plus size={20} color="white" />
                            <Text className="text-white font-bold">Create Plan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-[#312e81] py-3 rounded-xl flex-row items-center justify-center gap-2 border border-[#4338ca]">
                            <Zap size={20} color="white" />
                            <Text className="text-white font-bold">Quick Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row bg-transparent dark:bg-[#1f2937] p-1 rounded-xl mb-6">
                    <TouchableOpacity
                        className={cn(
                            "flex-1 py-2 rounded-lg items-center",
                            activeTab === 'active' ? "bg-white dark:bg-[#374151]" : "bg-transparent"
                        )}
                        onPress={() => setActiveTab('active')}
                    >
                        <Text className={cn(
                            "font-semibold",
                            activeTab === 'active' ? "text-black dark:text-white" : "text-gray-400"
                        )}>Active Plans</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={cn(
                            "flex-1 py-2 rounded-lg items-center",
                            activeTab === 'rates' ? "bg-white dark:bg-[#374151]" : "bg-transparent"
                        )}
                        onPress={() => setActiveTab('rates')}
                    >
                        <Text className={cn(
                            "font-semibold",
                            activeTab === 'rates' ? "text-black dark:text-white" : "text-gray-400"
                        )}>Interest Rates</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'active' ? (
                    <View className="pb-8">
                        <Text className="text-black dark:text-white text-lg font-bold mb-4">Active Plans</Text>
                        {savings && savings.length > 0 ? (
                            savings.map((plan, index) => (
                                <SavingsCardItem key={index} plan={plan} />
                            ))
                        ) : (
                            <View className="bg-white dark:bg-[#111827] rounded-3xl p-8 items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <View className="w-16 h-16 bg-[#1f2937] rounded-full items-center justify-center mb-4">
                                    <PiggyBank size={32} color="#6b7280" />
                                </View>
                                <Text className="text-black dark:text-white font-bold text-lg mb-2">No Active Plans</Text>
                                <Text className="text-gray-400 text-center mb-6 px-4">
                                    Start a fixed deposit or target savings plan today.
                                </Text>
                                <TouchableOpacity>
                                    <Text className="text-[#10b981] font-bold">Create your first plan</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ) : (
                    <View className="pb-8">
                        <Text className="text-black dark:text-white text-lg font-bold mb-4">Available Products</Text>
                        <View>
                            {savingRates.map((rate, index) => (
                                <ProductCardItem key={index} {...rate} />
                            ))}
                        </View>

                        <View className="bg-orange-500 rounded-2xl p-4 mt-4 flex-row items-center justify-between">
                            <View>
                                <Text className="text-white font-bold text-lg">Compare All Rates</Text>
                                <Text className="text-white/80 text-xs">See full breakdown by tenor and amount</Text>
                            </View>
                            <View className="bg-white/20 p-2 rounded-full">
                                <ArrowRight size={20} color="white" />
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const savingRates = [
        {
            title: "Flex Save",
            description: "Withdraw anytime. Interest paid daily.",
            rate: "8%",
            minDeposit: 1000,
            action: "Start Flex",
            icon: PiggyBank,
            iconColor: "#3b82f6",
            iconBg: "bg-blue-500/20",
            rateColor: "text-[#3b82f6]"
        },
        {
            title: "Target Locked",
            description: "Lock for 90-180 days. Higher returns.",
            rate: "12.5%",
            minDeposit: 5000,
            action: "Lock Funds",
            icon: Lock,
            iconColor: "#10b981",
            iconBg: "bg-emerald-500/20",
            rateColor: "text-[#10b981]"
        },
        {
            title: "Wealth Builder",
            description: "365 days lock. Maximize your yield.",
            rate: "16%",
            minDeposit: 50000,
            action: "Invest Now",
            icon: Gem,
            iconColor: "#a855f7",
            iconBg: "bg-purple-500/20",
            rateColor: "text-[#a855f7]"
        }
    ]






