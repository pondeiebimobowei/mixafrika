import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ArrowDown, ArrowLeft, Plus, Users, ShieldCheck, Lock, Target, RefreshCw, ChevronRight, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { clsx } from 'clsx';
import { formatCurrency } from '@/lib/utils';
import { apiPrivate } from '@/axios/axios-config';

import Sheet from '@/components/ui/sheet';
import { NewPlanSheet } from '@/components/sheets/new-plan.sheet';
import { useFetchSavings } from '@/store/hooks/savings.hook';

export default function Esusu() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Plans' | 'Rates'>('Plans');
  const [plans, setPlans] = useState<any[]>([]);
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await apiPrivate.get('/savings');
      if (res.data.success) {
        setPlans(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching savings plans', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

    useFetchSavings()


  const actions = [
    { label: 'Contribute', icon: ArrowDown, color: '#27AE60', bg: 'rgba(39, 174, 96, 0.1)' },
    { label: 'Join Group', icon: Users, color: '#27AE60', bg: 'rgba(39, 174, 96, 0.1)' },
    { label: 'New Plan', icon: Plus, color: '#27AE60', bg: 'rgba(39, 174, 96, 0.1)', onPress: () => setIsNewPlanOpen(true) },
  ];

  const renderPlanCard = (plan: any) => {
    if (plan.type === 'personal') {
      return (
        <View key={plan.id} className="dark:bg-[#1C1F26] p-4 rounded-xl mb-4">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-white font-bold text-lg">{plan.name}</Text>
              {plan.auto_save && (
                <View className="flex-row items-center mt-1">
                  <RefreshCw size={12} color="#F59E0B" />
                  <Text className="text-[#F59E0B] text-xs ml-1 font-medium">AutoSave</Text>
                </View>
              )}
            </View>
            <Text className="text-white font-bold text-xl">{formatCurrency(plan.total_amount)}</Text>
          </View>
          <Text className="text-gray-400 text-xs mt-2">Next debit: <Text className="text-white font-bold">{plan.next_debit}</Text></Text>
        </View>
      );
    }

    if (plan.type === 'target') {
      return (
        <View key={plan.id} className="bg-white dark:bg-[#1C1F26] p-4 rounded-xl mb-4">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-black dark:text-white font-bold text-lg">{plan.name}</Text>
              <View className="flex-row items-center mt-1">
                <Target size={12} color="#3B82F6" />
                <Text className="text-[#3B82F6] text-xs ml-1 font-medium">Target</Text>
              </View>
            </View>
            <Text className="text-black dark:text-white font-bold text-xl">{formatCurrency(plan.total_amount)}</Text>
          </View>

          <View className="w-full h-1.5 bg-gray-700 rounded-full mt-2 mb-1">
            <View className="h-full bg-[#27AE60] rounded-full" style={{ width: `${plan.progress || 0}%` }} />
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-800 dark:text-gray-400 text-xs">{plan.progress || 0}% complete</Text>
            <Text className="text-gray-800 dark:text-gray-400 text-xs">Target: {formatCurrency(plan.target_amount)}</Text>
          </View>
          <Text className="text-gray-800 dark:text-gray-400 text-xs">Maturity: <Text className="text-black dark:text-white font-bold">{plan.maturity}</Text></Text>
        </View>
      );
    }

    if (plan.type === 'locked') {
      return (
        <View key={plan.id} className="bg-white dark:bg-[#1C1F26] p-4 rounded-xl mb-4">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-black dark:text-white font-bold text-lg">{plan.name}</Text>
              <View className="flex-row items-center mt-1">
                <Lock size={12} color="#EF4444" />
                <Text className="text-[#EF4444] text-xs ml-1 font-medium">Locked</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-black dark:text-white font-bold text-xl">{formatCurrency(plan.total_amount)}</Text>
              <Text className="text-[#27AE60] text-xs font-medium">+{plan.interest_rate}% interest</Text>
            </View>
          </View>
          <Text className="text-gray-800 dark:text-gray-400 text-xs mt-2">Maturity: <Text className="text-black dark:text-white font-bold">{plan.maturity}</Text></Text>
        </View>
      );
    }

    if (plan.type === 'group') {
      return (
        <View key={plan.id} className="bg-[#1C1F26] p-4 rounded-xl mb-4">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-white font-bold text-lg">{plan.name}</Text>
              <View className="flex-row items-center mt-1">
                <RefreshCw size={12} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-1">Rotational | {plan.frequency}</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-[#27AE60] font-bold text-lg">{formatCurrency(plan.total_amount)}</Text>
              <Text className="text-gray-400 text-xs">per cycle</Text>
            </View>
          </View>

          {plan.target_amount && (
            <>
              <View className="w-full h-1.5 bg-gray-700 rounded-full mt-2 mb-1">
                <View className="h-full bg-[#27AE60] rounded-full" style={{ width: `${(plan.saved_amount / plan.target_amount) * 100}%` }} />
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400 text-xs">{formatCurrency(plan.saved_amount)} saved</Text>
                <Text className="text-gray-400 text-xs">Target: {formatCurrency(plan.target_amount)}</Text>
              </View>
            </>
          )}

          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row">
              {/* Mock Avatars */}
              {[1, 2, 3].map((i) => (
                <View key={i} className="w-6 h-6 rounded-full bg-gray-600 border border-[#1C1F26] -ml-2 first:ml-0 items-center justify-center">
                  <Text className="text-[8px] text-white">U{i}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-400 text-xs mr-1">View Group</Text>
              <ChevronRight size={12} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-200 dark:bg-[#121212]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        {/* <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity> */}
        <View></View>
        <Text className="text-black dark:text-white text-center text-lg font-bold">My Esusu</Text>
        <ShieldCheck size={24} color="white" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        {/* Actions */}
        <View className="flex-row justify-between mb-6 mt-2">
          {actions.map((action) => (
            <TouchableOpacity key={action.label} className="items-center" onPress={action.onPress}>
              <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: action.bg }}>
                <action.icon size={20} color={action.color} />
              </View>
              <Text className="text-black dark:text-white text-xs">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner */}
        <View className="h-32 rounded-xl overflow-hidden mb-6 relative bg-white dark:bg-gray-800">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop' }}
            className="absolute w-full h-full opacity-50"
          />
          <View className="p-4 justify-center h-full">
            <Text className="text-black dark:text-white font-bold text-lg mb-1">Strength in Numbers 💪</Text>
            <Text className="text-black dark:text-gray-200 text-xs">Achieve your goals faster with Group Savings.</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white dark:bg-[#1C1F26] p-1 rounded-lg mb-4">
          {['Plans', 'Rates'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={clsx(
                "flex-1 py-2 items-center rounded-md",
                activeTab === tab ? "bg-primary dark:bg-[#2A2D35]" : ""
              )}
            >
              <Text className={clsx("font-medium text-sm", activeTab === tab ? "dark:text-white" : "text-gray-400")}>
                {tab === 'Plans' ? 'My Plans' : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plans List */}
        <View className="mb-6">
          {plans.map(renderPlanCard)}
        </View>

        {/* Recent Activity */}
        <View className="mb-8">
          <Text className="text-black dark:text-white mb-4">Recent Activity</Text>

          {/* Mock Activity Items */}
          <View className="flex-row items-center justify-between mb-4 bg-white dark:bg-[#1C1F26] p-3 rounded-xl">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-green-900/20 items-center justify-center mr-3">
                <ArrowDown size={18} color="#27AE60" />
              </View>
              <View>
                <Text className="text-black dark:text-white font-medium">Contribution</Text>
                <Text className="text-gray-500 dark:text-slate-400 text-xs">Daily Savings</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-[#27AE60] font-bold">+₦1,000</Text>
              <Text className="text-gray-400 text-[10px]">2h ago</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-4 bg-white dark:bg-[#1C1F26] p-3 rounded-xl">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-green-900/20 items-center justify-center mr-3">
                <ArrowDown size={18} color="#27AE60" />
              </View>
              <View>
                <Text className="text-black dark:text-white font-medium">Contribution</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Balogun Market Ajo</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-[#27AE60] font-bold">+₦10,000</Text>
              <Text className="text-gray-400 text-[10px]">1d ago</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-4 bg-white dark:bg-[#1C1F26] p-3 rounded-xl">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-blue-900/20 items-center justify-center mr-3">
                <Send size={18} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-black dark:text-white">Payout</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Old Group Savings</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-[#3B82F6] font-bold">+₦50,000</Text>
              <Text className="text-gray-400 text-[10px]">1w ago</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <Sheet open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
        <NewPlanSheet onClose={() => setIsNewPlanOpen(false)} />
      </Sheet>
    </SafeAreaView>
  );
}
