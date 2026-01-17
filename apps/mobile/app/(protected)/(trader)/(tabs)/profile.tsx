import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

import { useAuthStore, useUserBusiness } from '@/store';
import { useFetchBusiness } from '@/store/hooks/business';
import { useFetchWallet, useWalletState } from '@/store/hooks/wallet.hook';

import {
  Bell,
  Sun,
  Moon,
  Pencil,
  Eye,
  EyeOff,
  Plus,
  ArrowUp,
  ChevronRight,
  ShieldCheck,
  User,
  Wallet,
  Gift,
  GraduationCap,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  Phone,
  MessageSquare,
  Trophy,
  Leaf,
  Repeat
} from 'lucide-react-native';
import { cn, formatCurrency } from '@/lib/utils';
import Sheet from '@/components/ui/sheet';
import { FundingSheet } from '@/components/sheets/funding.sheet';
import { RepaymentSheet } from '@/components/sheets/repayment.sheet';

export interface SheetsState {
  isFundingOpen: boolean,
  isRepayOpen: boolean,
  isWithdrawOpen: boolean,
}

export default function Profile() {
  const { user, logout, current_role, set_current_role } = useAuthStore();
  const { business } = useUserBusiness();
  const { data } = useWalletState();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const router = useRouter();

  useFetchBusiness();
  useFetchWallet();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [sheetIsOpen, setSheetIsOpen] = useState<SheetsState>({ isFundingOpen: false, isRepayOpen: false, isWithdrawOpen: false })

  const MENU_ITEMS = [
    {
      icon: ShieldCheck,
      title: 'Identity Verification',
      subtitle: 'Tier 1 - Verified',
      route: '/(protected)/(investor)/verification'
    },
    {
      icon: User,
      title: 'Personal Information',
      subtitle: 'Name, Email, Phone',
      route: '/(protected)/(investor)/personal-info'
    },
    {
      icon: Wallet,
      title: 'Payment Methods',
      subtitle: 'Bank Accounts, Cards',
      route: '/(protected)/(investor)/payment-methods'
    },
    {
      icon: Leaf,
      title: 'My Impact',
      subtitle: 'Social & Environmental stats',
      route: '/(protected)/(investor)/impact'
    },
    {
      icon: Gift,
      title: 'Refer & Earn',
      subtitle: 'Invite friends, earn cash',
      route: '/(protected)/(investor)/referrals'
    },
    {
      icon: GraduationCap,
      title: 'Learning Hub',
      subtitle: 'Tutorials, Guides, News',
      route: '/(protected)/(investor)/learning'
    },
    {
      icon: Shield,
      title: 'Security',
      subtitle: 'Password, 2FA',
      route: '/(protected)/(investor)/security'
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Email, Push, SMS',
      route: '/(protected)/(trader)/notifications'
    },
    {
      icon: FileText,
      title: 'Terms & Privacy',
      subtitle: 'Legal Information',
      route: '/(protected)/(investor)/legal'
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'FAQ, Contact Support',
      route: '/(protected)/(trader)/support'
    },
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 mb-4">
        <View className="flex-row items-center gap-3">
          <Avatar alt="" className="w-8 h-8">
            <AvatarImage source={{ uri: user?.image || 'https://picsum.photos/seed/301/200/200' }} />
            <AvatarFallback><Text>{user?.first_name?.charAt(0) || 'U'}</Text></AvatarFallback>
          </Avatar>
          <Text className="text-white text-lg font-bold">Dashboard</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Bell size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleColorScheme}>
            {colorScheme === 'dark' ? (
              <Sun size={24} color="white" />
            ) : (
              <Moon size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="items-center mb-8">
          <View className="relative mb-3">
            <Avatar alt="" className="w-24 h-24 border-2 border-gray-800">
              <AvatarImage source={{ uri: user?.image || 'https://picsum.photos/seed/301/200/200' }} />
              <AvatarFallback className="bg-gray-800">
                <Text className="text-3xl text-white">{user?.first_name?.charAt(0) || 'U'}</Text>
              </AvatarFallback>
            </Avatar>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-[#10b981] p-1.5 rounded-full border-2 border-black">
              <Pencil size={14} color="black" />
            </TouchableOpacity>
          </View>

          <Text className="text-white text-xl font-bold mb-1">
            {business[0]?.name || `${user?.first_name} ${user?.last_name}`}
          </Text>
          <Text className="text-gray-400 mb-4">{user?.email}</Text>

          <TouchableOpacity className="flex-row items-center bg-[#3f2e05] px-4 py-1.5 rounded-full border border-[#856404]">
            <Trophy size={14} color="#fbbf24" className="mr-1" />
            <Text className="text-[#fbbf24] font-bold mr-1">TRADER</Text>
            <ChevronRight size={14} color="#fbbf24" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View className="bg-[#111827] rounded-3xl p-5 mb-6 border border-gray-800">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-gray-400">Available Balance</Text>
            <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
              {isBalanceVisible ? (
                <Eye size={16} color="#9ca3af" />
              ) : (
                <EyeOff size={16} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-white text-4xl font-bold mb-6">
            {isBalanceVisible ? formatCurrency(data?.available_balance) : '∗∗∗∗∗∗∗∗∗∗'}
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setSheetIsOpen(prev => ({ ...prev, isFundingOpen: true }))}
              className="flex-1 bg-[#10b981] py-3 rounded-xl flex-row items-center justify-center gap-2"
            >
              <Plus size={20} color="white" />
              <Text className="text-white font-bold">Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSheetIsOpen(prev => ({ ...prev, isWithdrawOpen: true }))}
              className="flex-1 bg-[#1f2937] py-3 rounded-xl flex-row items-center justify-center gap-2"
            >
              <ArrowUp size={20} color="white" />
              <Text className="text-white font-bold">Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Field Agent Card */}
        <View className="bg-[#111827] rounded-2xl p-4 mb-6 flex-row items-center justify-between border border-gray-800">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-gray-800 relative">
              {/* Placeholder for agent image */}
              <Avatar alt="" className="w-12 h-12">
                <AvatarImage source={{ uri: 'https://picsum.photos/seed/agent/200/200' }} />
                <AvatarFallback><Text>AM</Text></AvatarFallback>
              </Avatar>
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111827]" />
            </View>
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase mb-0.5">Your Field Agent</Text>
              <Text className="text-white font-bold text-base">Agent Michael</Text>
              <Text className="text-gray-500 text-xs">Available Mon-Sat</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-[#1f2937] border border-gray-700 items-center justify-center">
              <Phone size={18} color="#10b981" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-[#1f2937] border border-gray-700 items-center justify-center">
              <MessageSquare size={18} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-[#111827] rounded-3xl overflow-hidden mb-8 border border-gray-800">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={cn(
                "flex-row items-center justify-between p-4 active:bg-gray-800",
                index !== MENU_ITEMS.length - 1 && "border-b border-gray-800"
              )}
              onPress={() => {
                router.push(item.route as any);
              }}
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-xl bg-[#1f2937] items-center justify-center">
                  <item.icon size={20} color="#9ca3af" />
                </View>
                <View>
                  <Text className="text-white font-semibold text-base">{item.title}</Text>
                  {item.subtitle && (
                    <Text className="text-gray-500 text-xs">{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <ChevronRight size={20} color="#4b5563" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Actions */}
        <View className="gap-4 mb-10">
          <Button
            variant="outline"
            className="bg-transparent border-red-900/30 flex-row items-center justify-center gap-2 h-14"
            onPress={() => logout()}
          >
            <LogOut size={20} color="#ef4444" />
            <Text className="text-[#ef4444] font-bold text-lg">Log Out</Text>
          </Button>

          <Button size='sm' className='flex-row items-center justify-center gap-2 bg-transparent' onPress={() => set_current_role(current_role === 'investor' ? 'trader' : 'investor')}>
            <Repeat size={18} color={'white'} />
            <Text className="text-white text-base">Switch Check</Text>
          </Button>
        </View>

        <View className="items-center mb-10">
          <Text className="text-gray-600 text-xs font-bold tracking-widest uppercase">Show Demo Controls</Text>
          <Text className="text-gray-600 text-xs mt-4">Version 2.4.2 (Build 2047)</Text>
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