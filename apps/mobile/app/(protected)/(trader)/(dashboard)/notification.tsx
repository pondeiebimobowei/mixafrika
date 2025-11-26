import { useNotificationsStore } from '@/store';
import { useFetchNotification } from '@/store/hooks/notification';
import { GroupedNotifications, INotification } from '@mixafrica/shared/types/notification';
import {
  User,
  Bell,
} from 'lucide-react-native';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

export default function Notification() {
  const { notifications: groupNotifications } = useNotificationsStore();
  useFetchNotification();

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className="text-gray-400 font-semibold mb-2 px-4 capitalize">{title.replace('_', ' ')}</Text>
      <View className="bg-[#2C2C2E] rounded-lg overflow-hidden">{children}</View>
    </View>
  );

  const hasNotifications = Object.values(groupNotifications).some(g => g.length > 0);

  return (
    <SafeAreaView className="bg-[#1A1A1A] flex-1 p-4 pt-6">
      <Text className="text-xl font-bold text-white text-center mb-6">Notifications</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(groupNotifications).map((groupName) => {
          const notifications = groupNotifications[groupName as keyof GroupedNotifications];
          if (notifications.length === 0) return null;

          return (
            <Section key={groupName} title={groupName}>
              {notifications.map((n, index) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  isLast={index === notifications.length - 1}
                />
              ))}
            </Section>
          );
        })}

        {!hasNotifications && (
          <View className="items-center justify-center mt-20">
            <Bell size={48} color="#3A3A3C" />
            <Text className="text-gray-500 mt-4">No notifications yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationItem({ notification, isLast }: { notification: INotification; isLast?: boolean }) {
  // Default icon logic, can be expanded based on notification type
  const Icon = User;

  return (
    <View
      className={cn(
        'flex-row items-center justify-between p-4 bg-[#2C2C2E]',
        !isLast && 'border-b border-gray-700'
      )}
    >
      <View className="flex-row items-center gap-4 flex-1">
        <View className="w-10 h-10 items-center justify-center bg-[#3A3A3C] rounded-full shrink-0">
          <Icon size={20} color="#fff" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-base font-medium capitalize mb-1">
            {notification.title}
          </Text>
          <Text className="text-gray-400 text-sm leading-5">
            {notification.message}
          </Text>
        </View>
      </View>
    </View>
  );
}
