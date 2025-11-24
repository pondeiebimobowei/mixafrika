import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Moon, LogOut, ChevronRight, Bell, Mail, Repeat, User, ShieldCheck } from 'lucide-react-native';
import { useAuthStore, useUserSettings } from '@/store';
import { router } from 'expo-router';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsSheet() {
  const { enable_dark_mode, enable_email_notification, enable_push_notification } = useUserSettings()
  const { updateDarkMode, updateEmailNotification, updatePushNotification } = useUserSettings()
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className="text-gray-400 font-semibold mb-2 px-4">{title}</Text>
      <View className="bg-[#2C2C2E] rounded-lg">{children}</View>
    </View>
  );

  const Item = ({
    icon,
    label,
    description,
    control,
    onPress,
    isFirst,
    isLast,
  }: {
    icon: React.ReactNode;
    label: string;
    description?: string;
    control?: React.ReactNode;
    onPress?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
  }) => (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View
        className={cn(
          'flex-row items-center justify-between p-4',
          !isLast && 'border-b border-gray-700'
        )}
      >
        <View className="flex-row items-center gap-4">
          <View className="w-8 h-8 items-center justify-center bg-[#3A3A3C] rounded-full">
            {icon}
          </View>
          <View>
            <Text className="text-white text-base font-medium">{label}</Text>
            {description && <Text className="text-gray-400 text-sm">{description}</Text>}
          </View>
        </View>
        {control}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-[#1A1A1A] p-4 pt-6 flex-1">
      <ScrollView>
        <Text className="text-xl font-bold text-white text-center mb-6">Settings</Text>

        <Section title="Appearance">
          <Item
            isFirst
            isLast
            icon={<Moon size={18} color="#8A8A8E" />}
            label="Dark Mode"
            description="Toggle light and dark theme"
            control={
              <Switch
                checked={enable_dark_mode}
                onCheckedChange={()=> updateDarkMode(!enable_dark_mode)}
              />
            }
          />
        </Section>

        <Section title="Account Actions">
          <Item
            isFirst
            isLast
            icon={<Repeat size={18} color="#8A8A8E" />}
            label="Switch to Investor View"
            control={
              <Button variant="outline" size="sm" className="border-green-500 bg-transparent px-4">
                <Text className="text-green-500">Switch</Text>
              </Button>
            }
          />
        </Section>

        <Section title="Notifications">
          <Item
            isFirst
            icon={<Mail size={18} color="#8A8A8E" />}
            label="Email Notifications"
            control={
              <Switch
                  checked={enable_email_notification}
                  onCheckedChange={()=> updateEmailNotification(!enable_email_notification)}
              />
            }
          />
          <Item
            isLast
            icon={<Bell size={18} color="#8A8A8E" />}
            label="Push Notifications"
            control={
              <Switch
                checked={enable_push_notification}
                onCheckedChange={()=> updatePushNotification(!enable_push_notification)}
              />
            }
          />
        </Section>

        <Section title="Security & Account">
          <Item
            isFirst
            icon={<User size={18} color="#8A8A8E" />}
            label="Edit Profile"
            control={<ChevronRight size={20} color="#8A8A8E" />}
          />
          <Item
            isLast
            icon={<ShieldCheck size={18} color="#8A8A8E" />}
            label="Change Password"
            control={<ChevronRight size={20} color="#8A8A8E" />}
          />
        </Section>

        <Button
          className="bg-pink-600/20 mt-4 h-14"
          onPress={handleLogout}
        >
          <View className="flex-row items-center gap-3">
            <LogOut size={20} color="#F9A8D4" />
            <Text className="text-pink-300 font-bold text-base">Log Out</Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
