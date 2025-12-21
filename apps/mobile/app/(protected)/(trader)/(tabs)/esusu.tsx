import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ArrowDown, Plus, ShieldCheck, Send, PiggyBank, ArrowRight, Zap } from 'lucide-react-native';
import { cn, formatCurrency } from '@/lib/utils';

import Sheet from '@/components/ui/sheet';
import { NewPlanSheet } from '@/components/sheets/new-plan.sheet';
import { useFetchSavings, useSavingsState } from '@/store/hooks/savings.hook';
import SavingsCardItem from '@/components/savings-card-item';
import { savingRates } from '../../(investor)/(tabs)/savings';
import ProductCardItem from '@/components/product-card-item';
import NoActivePlanCard from '@/components/cards/no-active-plan-card';

export default function Esusu() {
  const [activeTab, setActiveTab] = useState<'Plans' | 'Rates'>('Plans');
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);

  
  const { data: { savings }, loading } = useSavingsState()
  useFetchSavings()


  const ActivityIcon = {
    deposit: ArrowDown,
    payout: Send,
  }
  
  const ActivityColor = {
    deposit: '#27AE60',
    payout: '#3B82F6',
  }

    const totalSavings = 404;
    const interestAccrued = 404;
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-200 dark:bg-[#121212]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <View></View>
        <Text className="text-black dark:text-white text-center text-lg font-bold">My Esusu</Text>
        <ShieldCheck size={24} color="white" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        
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
                        <TouchableOpacity onPress={() => setIsNewPlanOpen(true)} className="flex-1 bg-[#10b981] py-3 rounded-xl flex-row items-center justify-center gap-2">
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
                            activeTab === 'Plans' ? "bg-white dark:bg-[#374151]" : "bg-transparent"
                        )}
                        onPress={() => setActiveTab('Plans')}
                    >
                        <Text className={cn(
                            "font-semibold",
                            activeTab === 'Plans' ? "text-black dark:text-white" : "text-gray-400"
                        )}>Active Plans</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={cn(
                            "flex-1 py-2 rounded-lg items-center",
                            activeTab === 'Rates' ? "bg-white dark:bg-[#374151]" : "bg-transparent"
                        )}
                        onPress={() => setActiveTab('Rates')}
                    >
                        <Text className={cn(
                            "font-semibold",
                            activeTab === 'Rates' ? "text-black dark:text-white" : "text-gray-400"
                        )}>Interest Rates</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'Plans' ? (
                    <View className="pb-8">
                        <Text className="text-black dark:text-white text-lg font-bold mb-4">Active Plans</Text>
                        {loading ? <ActivityIndicator /> : (savings && savings.length > 0 ? (
                            savings.map((plan, index) => (
                                <SavingsCardItem key={index} plan={plan} />
                            ))
                        ) : (
                            <NoActivePlanCard />
                        ))}
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

      <Sheet open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
        <NewPlanSheet onClose={() => setIsNewPlanOpen(false)} />
      </Sheet>
    </SafeAreaView>
  );
}
