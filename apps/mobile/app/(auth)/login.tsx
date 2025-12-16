import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { ChartLine, Store, ShieldCheck, ArrowRight, LucideIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Controller, useFormContext } from 'react-hook-form';
import { Create_user_dto } from '@mixafrica/shared/validation/create-user-dto';
import Toast from 'react-native-toast-message';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  iconBgColor: string;
  // onPress: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon: Icon, color, bgColor, iconBgColor }) => (
  <View
    // onPress={onPress}
    className={`w-full p-5 rounded-3xl border border-white/10 ${bgColor}`}
    // activeOpacity={0.9}
  >
    <View className="flex-row justify-between items-start mb-4">
      <View className={`p-3 rounded-2xl ${iconBgColor}`}>
        <Icon size={24} color={color} />
      </View>
      <View className="p-2 rounded-full bg-white/5">
        <ArrowRight size={20} color="white" />
      </View>
    </View>
    <Text className="text-white text-xl capitalize font-bold mb-2">{title}</Text>
    <Text className="text-gray-400 w-2/3 text-sm leading-5">{description}</Text>
  </View>
);

export default function RoleSelectScreen() {
  const { control, trigger } = useFormContext<Create_user_dto>();
    const router = useRouter();
  
    const [selectedRole, setSelectedRole] = useState('');
  
    const handleNext = async () => {
      const isValid = await trigger(['role']);
  
      if (isValid) {
        router.push('/(auth)/(signup)/personal');
      }else{
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select a role',
        } )
      }
    };

    const roles = [
      {
        title: 'investor',
        description: 'Fund businesses, earn attractive returns, and track your portfolio.',
        icon: ChartLine,
        color: '#3B82F6', // Blue
        bgColor: 'bg-[#1e293b]', // Dark blue-ish slate
        iconBgColor: 'bg-blue-900/30',
        onPress: () => router.push('/(auth)/investor-login')
      },
      {
        title: 'trader',
        description: 'Apply for loans, grow your business, and join Esusu savings groups.',
        icon: Store,
        color: '#10B981', // Green
        bgColor: 'bg-[#1e293b]',
        iconBgColor: 'bg-emerald-900/30',
        onPress: () => router.push('/(auth)/trader-login')
      },
      {
        title: 'agent',
        description: 'Onboard traders, monitor repayments, and manage field operations.',
        icon: ShieldCheck,
        color: '#8B5CF6', // Purple
        bgColor: 'bg-[#1e293b]',
        iconBgColor: 'bg-violet-900/30',
        onPress: () => router.push('/(auth)/agent-login')
      }
    ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header Icon */}
        <View className="items-center mt-10 mb-6">
          <View className="p-4 rounded-3xl bg-green-900/20 border border-green-900/30">
            {/* Using a generic Box icon or Logo placeholder if actual logo isn't available. 
                             The image shows a hexagon/box logo. 
                             I'll use a generic icon for now or just the text if logo is complex.
                             Using Store for now as a placeholder for the app logo, or just empty View with style.
                         */}
            <View className="w-6 h-6 items-center justify-center">
              {/* Simple SVG shape or icon */}
              <View className="w-4 h-4 border-2 border-emerald-500 transform rotate-45" />
            </View>
          </View>
        </View>

        {/* Title */}
        <View className="items-center mb-12">
          <Text className="text-white text-4xl font-extrabold text-center">
            Welcome
          </Text>
          <Text className="text-gray-400 text-base text-center">
            Choose how you want to use the platform
          </Text>
        </View>

        {/* Cards */}
        <View className="py-10 w-full">
            <Controller
              control={control}
              name="role"
              render={({ field, fieldState: { error } }) => (
                <>
                  <View className="flex justify-between gap-4 items-center">
                    {roles.map((role) => {
                      const isSelected = selectedRole === role.title;

                      return (
                        <Pressable
                          key={role.title}
                          onPress={() => {
                            field.onChange(role.title);
                            setSelectedRole(role.title);
                            role.onPress();
                            
                          }}
                          className={`
                               w-full items-center px-3  rounded-xl
                              flex flex-row gap-6
                            `}
                        >
                          <RoleCard
                            title={role.title}
                            description={role.description}
                            icon={role.icon}
                            color={role.color}
                            bgColor={role.bgColor}
                            iconBgColor={role.iconBgColor}
                            // onPress={role.onPress}
                          />
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}
            />
          </View>


        {/* Footer */}
        <View className="mt-10 items-center">
          <Text className="text-gray-500 text-xs text-center">
            By continuing, you agree to our Terms of Service.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

