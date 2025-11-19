import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';

import { useAuthStore, useUserBusiness } from '@/store';
import { useFetchBusiness } from '@/store/hooks/business';
import { useFetchWallet, useWalletState } from '@/store/hooks/wallet.hook';

import { Eye, EyeOff, History, Landmark, Repeat, Settings, Wallet } from 'lucide-react-native';
import Sheet from '@/components/ui/sheet';
import { SettingsSheet } from '@/components/sheets/settings.sheet';
import { Ionicons } from '@expo/vector-icons';
import { useFetchUserSettings } from '@/store/hooks/settings';
import { Button } from '@/components/ui/button';

interface SheetsState {
  isFundingOpen: boolean,
  isRepayOpen: boolean,
  isWithdrawOpen: boolean,
  isSettingsOpen: boolean
}

export default function Profile() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { business } = useUserBusiness();
  const { data } = useWalletState();


  useFetchBusiness();
  useFetchWallet();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const [ sheetIsOpen, setSheetIsOpen ] = useState<SheetsState>({ isFundingOpen: false, isRepayOpen: false, isWithdrawOpen: false, isSettingsOpen: false })
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  useFetchUserSettings()

  const quickActions = [
    { label: 'Fund', icon: Wallet, sheetKey: 'isSettings' },
    { label: 'Repay', icon: Repeat, sheetKey: 'isRepayOpen' },
    { label: 'Withdraw', icon: Landmark, sheetKey: 'isWithdrawOpen' },
  ];


  return (
    <SafeAreaView  className="flex-1 bg-primary justify-start">
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
              onPress={() => setSheetIsOpen( prev => ({ ...prev, isSettingsOpen: !prev.isSettingsOpen }))}
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
            {isBalanceVisible ? formatCurrency(data?.amount || 0) : '∗∗∗∗∗∗∗∗∗∗'}
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
        </View>
      </ScrollView>
      <Sheet open={sheetIsOpen.isSettingsOpen} onOpenChange={()=> setSheetIsOpen(prev => ({...prev, isSettingsOpen: !prev.isSettingsOpen }))}>
        <SettingsSheet />
      </Sheet>
    </SafeAreaView>
  );
}