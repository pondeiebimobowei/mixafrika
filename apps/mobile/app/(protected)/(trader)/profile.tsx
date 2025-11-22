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
import { SettingsSheet } from '@/components/sheets/settings.sheet';
import { Ionicons } from '@expo/vector-icons';
import { useFetchUserSettings } from '@/store/hooks/settings';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useFetchTransaction, useTransactionState } from '@/store/hooks/transaction.hook';
import { RepaymentStatus, Status, Types } from '@mixafrica/shared/enums';

interface SheetsState {
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

  const [ sheetIsOpen, setSheetIsOpen ] = useState<SheetsState>({ isFundingOpen: false, isRepayOpen: false, isWithdrawOpen: false })
  const router = useRouter();

  useFetchUserSettings()
  useFetchTransaction()

  const quickActions = [
    { label: 'Fund', icon: Wallet, sheetKey: 'isSettings' },
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

const formatAmount = (amount: number, type: Types) => {
    const prefix = type === Types.DEPOSIT ? '+₦' : '-₦';
    return `${prefix}${amount.toLocaleString()}`;
  };


  return (
    <SafeAreaView  className="flex-1 bg-primary justify-start">
      <View className='bg-primary text-gray-600 dark:text-gray-400 text-red-600 dark:text-red-400 text-yellow-600 dark:text-yellow-400' />
      <View className="pb-6 px-4 mb-10">
        <View className="flex flex-col items-center justify-between pt-4 pb-4">

          <View className='mb-6 flex flex-row justify-between items-center w-full'>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>


            <View className=''>
              <Avatar  alt="" className="w-10 h-10">
              <AvatarImage
                source={{ uri: user?.image || 'https://picsum.photos/seed/301/200/200' }}
              />
              <AvatarFallback>
                <Text>{business?.name?.charAt(0) || user?.first_name?.charAt(0) || 'T'}</Text>
              </AvatarFallback>
            </Avatar>
            </View>



            <TouchableOpacity
              onPress={() => router.push('/(protected)/(trader)/(dashboard)/settings')}
              >
                <Settings size={24} color="#fff" />
            </TouchableOpacity>
          </View>


          <View className="flex flex-col justify-center w-full items-center">
            <Text className=" text-center font-semibold text-white mt-2">
              {business?.name || `${user?.first_name} ${user?.last_name}`}
            </Text>
            <Text className="text-sm text-white/80">{user?.email}</Text>
          </View>
        </View>

        <View className="text-center mt-4 items-center">
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-sm text-white/80">Your Wallet Balance</Text>
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
          <Text className="text-4xl font-bold text-white mt-1">
            {isBalanceVisible ? formatCurrency(data?.amount) : '∗∗∗∗∗∗∗∗∗∗'}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#1A1A1A] px-4 -mt-6 rounded-t-3xl">
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
              <Text className="text-xs text-center text-white mt-1">
                {action.label}
              </Text>
            </TouchableOpacity>
          ))
          }
        <View className="flex flex-row justify-around items-center my-4">
          <Link href="/" asChild>
            <TouchableOpacity>
              <View className="flex items-center gap-2 p-4 bg-green-900/20 rounded-full">
                <History size={20} color={'hsl(151 51% 33%)'} />
              </View>
              <Text className="text-xs text-center text-white mt-1">History</Text>
            </TouchableOpacity>
          </Link>
        </View>
        </View>

        <View className="mt-2">
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="tex font-semibold text-white">Recent Transactions</Text>
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text className="text-[#2ECC71] text-sm">See all</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View className="gap-3 mt-4">
              {transactions.map((transaction) => {
                const Icon = transactionIcons[transaction.type as keyof typeof transactionIcons] || Send;

                const iconColor =
                  transaction.type === Types.WITHDRAWAL
                    ? transactionIconColor.debit
                    : transaction.type === Types.INVESTMENT
                    ? transactionIconColor.investment
                    : transaction.type === Types.DEPOSIT
                    ? transactionIconColor.credit
                    : transaction.type === Types.DISBURSEMENT
                    ? transactionIconColor.credit
                    : transaction.type === Types.REPAYMENT
                    ? transactionIconColor.debit
                    : transaction.type === Types.LOAN
                    ? transactionIconColor.credit
                    : transactionIconColor[
                        transaction.type as keyof typeof transactionIconColor
                      ];

        const bgClass =
    transaction.type === Types.WITHDRAWAL
      ? "bg-destructive/10"
      : transaction.type === Types.INVESTMENT
      ? "bg-yellow-100 dark:bg-yellow-900/30"
      : transaction.type === Types.DISBURSEMENT
      ? transactionIconBg.credit
      : transaction.type === Types.DEPOSIT
      ? transactionIconBg.credit
      : transactionIconBg[
          transaction.type as keyof typeof transactionIconBg
        ];
                return (
                  <View key={transaction.id} className="flex flex-row items-center justify-between p-4 bg-card rounded-xl">
                    <View className="flex flex-row items-center gap-2">
                      <View className={cn("flex items-center justify-center h-10 w-10 rounded-full", 
                        transaction.type === Types.WITHDRAWAL ? 'bg-destructive/10' :
                        transaction.type === Types.INVESTMENT ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        transaction.type === Types.DISBURSEMENT ? transactionIconBg['credit'] :
                        transaction.type === Types.DEPOSIT ? transactionIconBg['credit'] :
                        transactionIconBg[transaction.type as keyof typeof transactionIconBg]
                      )}>
                        <Icon strokeWidth={3} size={18} color={iconColor} className={iconColor} />
                        
                      </View>
                      <View>
                        <Text className="font-semibold text-sm">{transaction.title}</Text>
                        <Text className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</Text>
                      </View>
                    </View>
                    <Text className={cn("font-bold text-sm whitespace-nowrap", 
                      transaction.type === Types.WITHDRAWAL ? 'text-destructive' : 
                      transaction.type === Types.INVESTMENT ? 'text-yellow-600 dark:text-yellow-400' :
                      transaction.type === Types.DISBURSEMENT ? transactionColors['credit'] :
                      transaction.type === Types.DEPOSIT ? transactionColors['credit'] :
                      transactionColors[transaction.type as keyof typeof transactionColors]
                    )}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </Text>
                  </View>
                );
              })}
            </View>
        </View>
      </ScrollView>
      {/* <Sheet open={sheetIsOpen.isSettingsOpen} onOpenChange={()=> setSheetIsOpen(prev => ({...prev, isSettingsOpen: !prev.isSettingsOpen }))}>
        <SettingsSheet />
      </Sheet> */}
    </SafeAreaView>
  );
}