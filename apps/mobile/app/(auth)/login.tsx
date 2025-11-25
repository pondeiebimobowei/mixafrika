import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChartArea, LucideIcon, TrendingUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type RootStackParamList = {
  '/(auth)/trader-login': undefined;
  '/(auth)/investor-login': undefined;
  '/(auth)/agent-login': undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  '/(auth)/trader-login'
>;

const CardWrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <View className="w-full max-w-sm rounded-lg border border-border bg-card shadow-lg">
    {children}
  </View>
);

const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <View className="p-6 border-b border-border/50">{children}</View>
);

const CardTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Text className="text-2xl font-bold font-headline text-card-foreground">
    {children}
  </Text>
);

const CardDescription: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Text className="text-sm text-muted-foreground mt-1">{children}</Text>
);

const CardContent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <View className="p-6 space-y-4">{children}</View>
);

interface RoleButtonProps {
  Icon: React.ComponentType<{
    className?: string;
    size?: number;
    color?: string;
  }>;
  roleName: string;
  onPress: () => void;
}

const RoleButton: React.FC<RoleButtonProps> = ({ Icon, roleName, onPress }) => {
  return (
    <TouchableOpacity
      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4"
      onPress={onPress}
    >
      <Icon className="mb-3" size={24} color={'hsl(var(--primary))'} />
      <Text className="text-card-foreground font-semibold">{roleName}</Text>
    </TouchableOpacity>
  );
};

export default function LoginPage() {
  const roleOptions: {
    id: string;
    label: string;
    icon: LucideIcon;
    screen: keyof RootStackParamList;
  }[] = [
    {
      id: 'investor',
      label: 'Investor',
      icon: ChartArea,
      screen: '/(auth)/investor-login',
    },
    {
      id: 'trader',
      label: 'Trader',
      icon: TrendingUp,
      screen: '/(auth)/trader-login',
    },
    {
      id: 'agent',
      label: 'Agent',
      icon: TrendingUp,
      screen: '/(auth)/agent-login',
    },
  ];

  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <SafeAreaView className="bg-slate-950 flex-1 p-5">
      <View className="flex-1 items-center justify-center py-10">
        <View className="w-full gap-10">
          <Text className="text-white text-6xl font-semibold text-center">
            MIX
          </Text>

          <View className="flex items-center justify-center">
            <Text className="text-white w-full text-center text-xl font-bold mb-5">
              Market Investment Exchange
            </Text>
            <Text>Please select your role to sign in</Text>

            <View className="w-5/6 flex space-y-10 gap-6">
              {roleOptions.map((role) => {
                const IconComponent = role.icon;
                return (
                  <TouchableOpacity
                    key={role.id}
                    onPress={() => router.push(role?.screen)}
                    className="w-full border border-[#10b981] py-6 rounded-xl gap-2 flex-row items-center justify-center shadow-md shadow-[#10b981]/50"
                  >
                    <IconComponent size={24} color="white" className="mr-3" />
                    <Text className="text-white text-xl font-semibold">
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-white text-center my-20">
              Don't have an account?{' '}
              <Text
                className="text-primary text-lg font-semibold"
                onPress={() => router.push('/(auth)/(signup)/select-role')}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
