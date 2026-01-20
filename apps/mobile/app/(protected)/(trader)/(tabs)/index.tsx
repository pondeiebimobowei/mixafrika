import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { User, Bell, FileText, PiggyBank, Sun, Coins, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useAuthStore,
  useUserBusiness,
} from '@/store';
import { useRouter } from 'expo-router';
import { useFetchLoanAccount } from '@/store/hooks/loan-account';
import { SheetsState } from './profile';

import TraderProfileCard from '@/components/cards/trader-profile-card';
import ActiveLoanDashboardCard from '@/components/cards/active-loan-dashboard-card';
import PrimaryGoalCard from '@/components/cards/primary-goal-card';
import RecentActivityCard from '@/components/cards/recent-activity-card';
import CreditScoreOverView from '@/components/cards/credit-score-overview.card';
import { useFetchBusiness } from '@/store/hooks/business';
import Sheet from '@/components/ui/sheet';
import { RepaymentSheet } from '@/components/sheets/repayment.sheet';
import { useTheme } from '@/context/theme context';
import EsusuGroupDashboardCard from '@/components/cards/esusu-group-dashboard-card';
import { useFetchWallet } from '@/store/hooks/wallet.hook';
import { useFetchUser } from '@/store/hooks/user.hook';

export default function TraderDashboard() {
  const { business } = useUserBusiness();
  const { user } = useAuthStore();
  const router = useRouter();

  useFetchBusiness()
  useFetchWallet();

  const { toggleTheme } =useTheme()
  
  const [sheetIsOpen, setSheetIsOpen] = useState<SheetsState>({ isFundingOpen: false, isRepayOpen: false, isWithdrawOpen: false })

  useFetchLoanAccount();
  useFetchUser()  

  const quickActions = [
    {
      label: 'Apply',
      icon: FileText,
      route: '/loan/apply',
      color: '#3b82f6', // Blue
      bg: '#1e293b'
    },
    {
      label: 'Repay',
      icon: Coins,
      route: '/repayment-history',
      color: '#10b981', // Green
      bg: '#1e293b'
    },
    {
      label: 'Esusu',
      icon: PiggyBank,
      route: '/esusu',
      color: '#a855f7', // Purple
      bg: '#1e293b'
    },
    {
      label: 'Profile',
      icon: User,
      route: '/profile',
      color: '#f59e0b', // Amber
      bg: '#1e293b'
    }
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-200 dark:bg-black px-4 pt-0">
      <ScrollView showsVerticalScrollIndicator={false} className='mb-0'>

        {/* Header Section */}
        <View className="flex-row items-center justify-between py-4 mb-2">
          <View className="flex-row items-center gap-3">
            {user?.image ? (
              <Image
                className="w-10 h-10 rounded-full border-2 border-slate-700"
                source={{ uri: user.image }}
              />
            ) : (
              <View className="h-10 w-10 rounded-full bg-slate-700 items-center justify-center border-2 border-slate-600">
                <Text className="text-white font-bold text-lg">
                  {business[0]?.name?.charAt(0) || user?.first_name?.charAt(0) || 'D'}
                </Text>
              </View>
            )}
            <Text className="text-white text-xl font-bold">Dashboard</Text>
          </View>

          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.push('/(protected)/(trader)/notification')}>
              <Bell color="white" size={24} />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />
            </Pressable>

            {/* Theme Toggle */}
            <Pressable onPress={()=> toggleTheme()}>
              <Sun color="white" size={24} />
            </Pressable>
          </View>
        </View>

        {/* Profile Card */}
        { user?.business_verification_status !== 'verified' && <View className='bg-primary p-6 rounded-2xl mb-6'>
            <View className=''>
                    <ShieldCheck size={28} color={'white'}/>
                </View>

                <View className='my-8'>
                    <Text className='text-2xl text-white font-bold mb-2'>Verify Business</Text>
                    <Text className='text-white'>Verify your business to unlock trading in African clusters and access zero-interest business loans.</Text>
                </View>

                <Pressable onPress={()=> router.push('/(protected)/(trader)/kyc')} className='bg-secondary rounded-lg flex gap-2 flex-row px-2 py-4 items-center justify-center'>
                  <Text className='text-white'>Verify Now</Text><ArrowRight size={18} color={'white'} />
                </Pressable>
            </View>}
        <TraderProfileCard />

        {/* Quick Actions Row */}
        { user?.business_verification_status === 'verified' && <View className="flex-row justify-between mb-6">
          {quickActions.map((action, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => router.push(action.route as any)}
              className="items-center gap-2"
            >
              <View className="w-14 h-14 rounded-2xl items-center justify-center bg-[#1e293b] border border-slate-800">
                <action.icon size={24} color={action.color} />
              </View>
              <Text className="text-slate-400 text-xs font-bold">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>}

        {/* Credit Insights */}
        <CreditScoreOverView />

        {/* Active Loan Card */}
        <ActiveLoanDashboardCard />

        {/* Primary Goal Card */}
        <PrimaryGoalCard />

        {/* Esusu Groups Card */}
        <EsusuGroupDashboardCard />


        {/* Recent Activity */}
        <RecentActivityCard />

      </ScrollView>
      <Sheet
        open={sheetIsOpen.isRepayOpen}
        onOpenChange={() => setSheetIsOpen(prev => ({ ...prev, isRepayOpen: !prev.isRepayOpen }))}
      >
        <RepaymentSheet onClose={() => setSheetIsOpen(prev => ({ ...prev, isRepayOpen: false }))} />
      </Sheet>
    </SafeAreaView>
  );
}
