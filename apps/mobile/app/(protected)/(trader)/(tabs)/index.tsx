import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { User, Bell, FileText, Repeat, PiggyBank } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useAuthStore,
  useLoanAccountStore,
  useUserBusiness,
  useWallet,
} from '@/store';
import WelcomeCard from '@/components/cards/welcome-card';
import LoanOverviewCard from '@/components/cards/loan-overview-card';
import MakePaymentModal from '@/components/modal/make-payment-modal';
import { useFetchWallet } from '@/store/hooks/wallet.hook';
import { useRouter } from 'expo-router';
import NewsAndUpdates from '@/components/cards/news-and-update.card';
import CreditScoreOverView from '@/components/cards/credit-score-overview.card';
import { useFetchLoanAccount } from '@/store/hooks/loan-account';
import { formatCurrency } from '@/lib/utils';
import Sheet from '@/components/ui/sheet';
import { RepaymentSheet } from '@/components/sheets/repayment.sheet';
import { SheetsState } from './profile';
import { LoanStatus } from '@mixafrica/shared/enums';

export default function TraderDashboard() {
  const { business } = useUserBusiness();
  const { user } = useAuthStore();
  const { available_balance } = useWallet();
  const router = useRouter();

  const [sheetIsOpen, setSheetIsOpen] = useState<SheetsState>({ isFundingOpen: false, isRepayOpen: false, isWithdrawOpen: false })

  useFetchWallet();
  const { loan_account } = useLoanAccountStore();
  useFetchLoanAccount()
  const hasActiveLoan = Boolean(loan_account?.status === LoanStatus.APPROVED)

  const quickActions = [
    { label: 'Apply', icon: FileText, route: '/loan/apply' },
    { label: 'Repay', icon: Repeat, route: '/repayment-history' },
    { label: 'Esusu', icon: PiggyBank, route: '/esusu' },
    { label: 'Profile', icon: User, route: '/profile' },
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-200 dark:bg-[rgb(23,26,33)] px-4 pt-0 pb-6">
      <View className="flex flex-row items-center justify-between py-3">
        <View className="flex flex-row gap-3 items-center">
          {user?.image ? (
            <Image
              className=" w-10 h-10 rounded-full"
              source={{ uri: 'https://picsum.photos/seed/696/3000/2000' }}
            />
          ) : (
            <View className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Text className="text-foreground">
                {business?.name?.charAt(0) || 'T'}
              </Text>
            </View>
          )}

          <View>
            <Text className="dark:text-white ">Hello,</Text>
            <Text className="dark:text-white font-bold capitalize">
              {user?.first_name}
            </Text>
          </View>
        </View>

        <View className="flex flex-row gap-10">
          <Pressable
            onPress={() =>
              router.push('/(protected)/(trader)/notification')
            }
          >
            <Bell color={'orange'} className="h-6 w-6" />
          </Pressable>
          <Pressable
            onPress={() => router.push('/profile')}
          >
            <User color={'white'} className="h-6 w-6" />
          </Pressable>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {hasActiveLoan ? (
          <LoanOverviewCard />
        ) : (
          <WelcomeCard />
        )}

        <View className="flex flex-row justify-between">
          <View className="w-[48%] py-6 px-4 rounded-xl bg-white dark:bg-card">
            <Text className="dark:text-slate-300 text-sm">Wallet Balance</Text>
            <Text className="dark:text-white text-xl">
              {formatCurrency(available_balance)}
            </Text>
          </View>

          <TouchableOpacity
            className='w-[48%] border border-slate-300 dark:border-slate-700 rounded-xl'
            disabled={!hasActiveLoan}
            onPress={() => setSheetIsOpen(prev => ({ ...prev, isRepayOpen: !prev.isRepayOpen }))}
          >
            <View className="py-6 px-4  rounded-xl">
              <Text className="dark:text-white  font-semibold">Make Repayment</Text>
              <Text className="dark:text-slate-400">Next payment due</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>

          <View className="flex flex-row justify-around items-center my-6">
            {quickActions.map((action) => (
              <TouchableOpacity onPress={()=> router.push(action.route as any)} key={action.label}>
                <View className="flex items-center gap-2 p-4 bg-green-900/10 rounded-full">
                  <action.icon size={20} color={'hsl(151 51% 33%)'} />
                </View>
                <Text className="text-xs text-center dark:text-white mt-1">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <CreditScoreOverView />
        <NewsAndUpdates />
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
