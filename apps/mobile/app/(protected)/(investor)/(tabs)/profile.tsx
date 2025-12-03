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
import {  formatCurrency } from '@/lib/utils';

export interface SheetsState {
  isFundingOpen: boolean,
  isRepayOpen: boolean,
  isWithdrawOpen: boolean,
}

export default function Profile() {
  const { user } = useAuthStore();
  const { business } = useUserBusiness();
  const { data } = useWalletState();


  useFetchBusiness();
  useFetchWallet();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-200 dark:bg-primary justify-start">
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



            
            <Link href="/(protected)/(investor)/settings" asChild>
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
      <View className='flex-1 bg-white dark:bg-[#1A1A1A] px-4 -mt-6 rounded-t-3xl'>

      </View>
    </SafeAreaView>
  );
}