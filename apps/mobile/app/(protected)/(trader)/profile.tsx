import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';

import { useAuthStore, useUserBusiness } from '@/store';
import { useFetchBusiness } from '@/store/hooks/business';
import { useFetchWallet, useWalletState } from '@/store/hooks/wallet.hook';

import { ArrowDown, ArrowUp, Eye, EyeOff, History, Landmark, Repeat, Send, Settings, Wallet, X } from 'lucide-react-native';
import Sheet from '@/components/ui/sheet';
import { useFetchUserSettings } from '@/store/hooks/settings';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useFetchTransaction, useTransactionState } from '@/store/hooks/transaction.hook';
import { Types } from '@mixafrica/shared/enums';
import { FundingSheet } from '@/components/sheets/funding.sheet';
import { RepaymentSheet } from '@/components/sheets/repayment.sheet';
import TransactionItems from '@/components/cards/transaction-item';

export interface SheetsState {
  isFundingOpen: boolean,
  isRepayOpen: boolean,
  isWithdrawOpen: boolean,
}

export default function Profile() {
  const { user } = useAuthStore();
  const { business } = useUserBusiness();
  const { data } = useWalletState();
  const { data: { transactions } } = useTransactionState();


  useFetchBusiness();
  useFetchWallet();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const [sheetIsOpen, setSheetIsOpen] = useState<SheetsState>({ isFundingOpen: false, isRepayOpen: false, isWithdrawOpen: false })

  useFetchUserSettings()
  useFetchTransaction()

  const quickActions = [
    { label: 'Fund', icon: Wallet, sheetKey: 'isFundingOpen' },
    { label: 'Repay', icon: Repeat, sheetKey: 'isRepayOpen' },
    { label: 'Withdraw', icon: Landmark, sheetKey: 'isWithdrawOpen' },
  ];

  const transactionIcons = {
    deposit: ArrowDown,
    withdrawal: ArrowUp,
    failed: X,
    repayment: Repeat,
    loan: ArrowDown
  };

  const transactionColors = {
    credit: 'text-primary',
    debit: 'text-foreground',
    failed: 'text-destructive',
  };

  const transactionIconBg = {
    credit: 'bg-primary/15',
    debit: 'bg-gray-100 dark:bg-gray-800/70',
    failed: 'bg-red-100 dark:bg-red-900/30',
  };

  const transactionIconColor = {
    credit: 'hsl(151 51% 33%)',
    debit: 'hsl(346 70% 55%)',
    failed: 'hsl(346 70% 55%)',
    investment: 'grey'
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-200 dark:bg-primary justify-start">
      <View className='dark:bg-primary text-gray-600 dark:text-gray-400 text-red-600 dark:text-red-400 text-yellow-600 dark:text-yellow-400' />
      <View className="pb-6 px-4 mb-10">
        <View className="flex flex-col items-center justify-between pt-4 pb-4">

          <View className='mb-6 flex flex-row justify-between items-center w-full'>
            <View></View>


            <View className=''>
              <Avatar alt="" className="w-10 h-10">
                <AvatarImage
                  source={{ uri: user?.image || 'https://picsum.photos/seed/301/200/200' }}
                />
                <AvatarFallback>
                  <Text>{business?.name?.charAt(0) || user?.first_name?.charAt(0) || 'T'}</Text>
                </AvatarFallback>
              </Avatar>
            </View>



            
            <Link href="/settings" asChild>
              <TouchableOpacity>
                <Settings size={24} color="#fff" />
              </TouchableOpacity>
            </Link>
          </View>


          <View className="flex flex-col justify-center w-full items-center">
            <Text className=" text-center font-semibold text-black dark:text-white mt-2">
              {business?.name || `${user?.first_name} ${user?.last_name}`}
            </Text>
            <Text className="text-sm text-black dark:text-white/80">{user?.email}</Text>
          </View>
        </View>

        <View className="text-center mt-4 items-center">
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-sm text-black dark:text-white/80">Your Wallet Balance</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
              className="h-6 w-6 items-center justify-center"
            >
              {isBalanceVisible ? (
                <Eye size={16} color="white" />
              ) : (
                <EyeOff size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-4xl font-bold text-black dark:text-white mt-1">
            {isBalanceVisible ? formatCurrency(data?.amount) : '∗∗∗∗∗∗∗∗∗∗'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-white dark:bg-[#1A1A1A] px-4 -mt-6 rounded-t-3xl">
        <View className="flex flex-row justify-around items-center my-4">
          {quickActions.map((action) => (
            <TouchableOpacity
              onPress={() =>
                setSheetIsOpen((prev) => ({
                  ...prev,
                  [action.sheetKey]: !prev[action.sheetKey as keyof SheetsState],
                }))
              }
              key={action.label}>
              <View className="flex items-center gap-2 p-4 bg-green-900/20 rounded-full">
                <action.icon size={20} color={'hsl(151 51% 33%)'} />
              </View>
              <Text className="text-xs text-center text-black dark:text-white mt-1">
                {action.label}
              </Text>
            </TouchableOpacity>
          ))
          }
          <View className="flex flex-row justify-around items-center my-4">
            <Link href="/(protected)/(trader)/(dashboard)/transactions" push asChild>
              <TouchableOpacity>
                <View className="flex items-center gap-2 p-4 bg-green-900/20 rounded-full">
                  <History size={20} color={'hsl(151 51% 33%)'} />
                </View>
                <Text className="text-xs text-center text-black dark:text-white mt-1">History</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View className="mt-2">
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="tex font-semibold text-black dark:text-white">Recent Transactions</Text>
            <Link href="/(protected)/(trader)/(dashboard)/transactions" push asChild>
              <TouchableOpacity>
                <Text className="text-[#2ECC71] text-sm">See all</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View className="gap-3 mt-4">
            {Object.values(transactions).flat().map((transaction) => <TransactionItems key={transaction.id} transaction={transaction} className='bg-gray-200' />)
            }
          </View>
        </View>
      </ScrollView>

      <Sheet
        open={sheetIsOpen.isFundingOpen}
        onOpenChange={() => setSheetIsOpen(prev => ({ ...prev, isFundingOpen: !prev.isFundingOpen }))}
      >
        <FundingSheet />
      </Sheet>

      <Sheet
        open={sheetIsOpen.isRepayOpen}
        onOpenChange={() => setSheetIsOpen(prev => ({ ...prev, isRepayOpen: !prev.isRepayOpen }))}
      >
        <RepaymentSheet onClose={() => setSheetIsOpen(prev => ({ ...prev, isRepayOpen: false }))} />
      </Sheet>
    </SafeAreaView>
  );
}