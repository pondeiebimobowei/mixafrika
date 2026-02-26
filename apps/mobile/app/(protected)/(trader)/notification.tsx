import { useNotificationsStore } from '@/store';
import { useFetchNotification } from '@/store/hooks/notification';
import { GroupedNotifications, INotification } from '@mixafrica/shared/types/notification';
import {
  Bell,
  ChevronLeft,
  CheckCheck,
  Wallet,
  Info,
  AlertCircle
} from 'lucide-react-native';
import { Text, View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';

export default function Notification() {
  const { notifications: groupNotifications } = useNotificationsStore();
  useFetchNotification();
  const router = useRouter();

  const hasNotifications = Object.values(groupNotifications).some(g => g.length > 0);

  const handleBack = () => {
    if(router.canGoBack()){
        router.back();
    }else{
        router.replace('/(protected)/(trader)/(tabs)')
    }
  };

  return (
    <SafeAreaView edges={['top']} className="bg-gray-50 dark:bg-[#0a0a0a] flex-1">
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
            <View className="flex-row items-center gap-4">
                <TouchableOpacity 
                    onPress={handleBack}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900"
                >
                    <ChevronLeft size={24} className="text-gray-900 dark:text-white" color="currentColor" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">Notifications</Text>
            </View>
            <TouchableOpacity disabled>
                {/* Placeholder for "Mark all as read" functionality */}
                <CheckCheck size={20} className="text-gray-400" color="currentColor" />
            </TouchableOpacity>
        </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {!hasNotifications ? (
            <View className="items-center justify-center mt-32 px-10">
                <View className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full items-center justify-center mb-6">
                    <Bell size={40} className="text-gray-400" color="currentColor" />
                </View>
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
                    No notifications yet
                </Text>
                <Text className="text-gray-500 text-center leading-6">
                    We'll let you know when there are updates about your loans, repayments, or account activity.
                </Text>
            </View>
        ) : (
            Object.keys(groupNotifications).map((groupName) => {
            const notifications = groupNotifications[groupName as keyof GroupedNotifications];
            if (notifications.length === 0) return null;

            return (
                <View key={groupName} className="mt-6">
                    <Text className="text-gray-500 dark:text-gray-400 font-semibold mb-2 px-4 text-sm uppercase tracking-wider">
                        {groupName.replace('_', ' ')}
                    </Text>
                    <View className="bg-white dark:bg-[#111111] border-y border-gray-100 dark:border-gray-800">
                        {notifications.map((n, index) => (
                            <NotificationItem
                            key={index}
                            notification={n}
                            isLast={index === notifications.length - 1}
                            />
                        ))}
                    </View>
                </View>
            );
            })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationItem({ notification, isLast }: { notification: INotification; isLast?: boolean }) {
  
  const getIcon = () => {
    if (notification.title?.toLowerCase().includes('payment') || notification.title?.toLowerCase().includes('loan')) return Wallet;
    if (notification.title?.toLowerCase().includes('alert')) return AlertCircle;
    return Info;
  };

  const Icon = getIcon();

  return (
    <Pressable
      className={cn(
        'flex-row p-4 active:bg-gray-50 dark:active:bg-[#1a1a1a]', 
        !isLast && 'border-b border-gray-100 dark:border-gray-800'
      )}
    >
        <View className={cn(
            "w-10 h-10 rounded-full items-center justify-center mr-4 shrink-0",
            notification.read ? "bg-gray-100 dark:bg-gray-900" : "bg-blue-50 dark:bg-blue-900/20"
        )}>
            <Icon 
                size={20} 
                className={notification.read ? "text-gray-500" : "text-blue-600 dark:text-blue-400"} 
                color="currentColor" 
            />
        </View>
        
        <View className="flex-1 gap-1">
            <View className="flex-row justify-between items-start">
                <Text className={cn(
                    "text-base flex-1 mr-2",
                    notification.read 
                        ? "font-medium text-gray-900 dark:text-gray-100" 
                        : "font-bold text-gray-900 dark:text-white"
                )}>
                    {notification.title}
                </Text>
            </View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5">
                {notification.message}
            </Text>
        </View>
        
        {!notification.read && (
            <View className="w-2 h-2 rounded-full bg-blue-600 mt-2 ml-2" />
        )}
    </Pressable>
  );
}
