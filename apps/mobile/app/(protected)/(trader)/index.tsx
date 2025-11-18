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
  useLoanAccount,
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

export default function TraderDashboard() {
  const { business } = useUserBusiness();
  const { user } = useAuthStore();
  const { amount } = useWallet();
  const router = useRouter();

  useFetchWallet();
  const { loan_account } = useLoanAccount();
  const hasActiveLoan = (loan_account?.recieved_amount || 10) > 10000;

  const [showMakeRepaymentModal, setShowMakeRepaymentModal] =
    useState<boolean>(false);
  const quickActions = [
    { label: 'Apply', icon: FileText, route: 'TraderApply' },
    { label: 'Repay', icon: Repeat, route: 'TraderRepayments' },
    { label: 'Esusu', icon: PiggyBank, route: 'TraderEsusu' },
    { label: 'Profile', icon: User, route: 'TraderProfile' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[rgb(23,26,33)] p-3">
      <View className="flex flex-row items-center justify-between py-3 border">
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
            <Text className="text-lg text-white ">Hello,</Text>
            <Text className="text-white text-2xl font-bold capitalize">
              {user?.first_name}
            </Text>
          </View>
        </View>

        <View className="flex flex-row gap-10">
          <Pressable
            onPress={() =>
              router.push('/(protected)/(trader)/(dashboard)/notification')
            }
          >
            <Bell color={'orange'} className="h-6 w-6" />
          </Pressable>
          <User color={'white'} className="h-6 w-6" />
        </View>
      </View>
      <ScrollView>
        {hasActiveLoan ? (
          <LoanOverviewCard />
        ) : (
          <WelcomeCard />
        )}

        <View className="flex flex-row">
          <View className="p-10 rounded-xl bg-card grow">
            <Text className="text-slate-300">Wallet Balance</Text>
            <Text className="text-white text-2xl">
              ₦{amount.toLocaleString() || 1}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowMakeRepaymentModal((prev) => !prev)}
          >
            <View className="p-10 rounded-xl grow">
              <Text className="text-white text-xl">Make Repayment</Text>
              <Text className="text-slate-400">Next payment due</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <MakePaymentModal
            show={showMakeRepaymentModal}
            onClose={() => setShowMakeRepaymentModal((prev) => !prev)}
          />

          <View className="flex flex-row justify-around items-center my-10">
            {quickActions.map((action) => (
              <TouchableOpacity key={action.label}>
                <View className="flex items-center gap-2 p-4 bg-green-900/20 rounded-full">
                  <action.icon size={28} color={'hsl(151 51% 33%)'} />
                </View>
                <Text className=" text-center text-white mt-1">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <CreditScoreOverView />
        <NewsAndUpdates />
      </ScrollView>
    </SafeAreaView>
  );
}
