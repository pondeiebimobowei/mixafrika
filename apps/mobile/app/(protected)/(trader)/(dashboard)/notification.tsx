import { useNotificationsStore } from '@/store';
import { useFetchNotification } from '@/store/hooks/notification';
import { GroupedNotifications, INotification } from '@mixafrica/shared/types/notification';
import {
  Archive,
  Calendar,
  Clock,
  LucideIcon,
  User,
} from 'lucide-react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notification() {
  const { notifications: groupNotifications } = useNotificationsStore();
  useFetchNotification();

  const groupIcons: { [key: string]: LucideIcon } = {
    today: Clock,
    this_week: Calendar,
    last_week: Calendar,
    older: Archive,
  };

  const notificationTypeIcons: { [key: string]: LucideIcon } = {
    deposit: User,
  };

  return (
    <SafeAreaView className="bg-black flex-1 py-10 px-6">
      <View>
        <Text className="text-white font-bold text-4xl text-center">
          Notifications
        </Text>

        <View className="mt-6">
          {Object.keys(groupNotifications).map((groupName) => {
            const notifications =
              groupNotifications[groupName as keyof GroupedNotifications];
            if (notifications.length === 0) {
              return null;
            }

            const IconComponent = groupIcons[groupName];

            return (
              <View key={groupName}>
                <View>
                  {/* <IconComponent /> */}
                  <Text className="text-slate-400 text-2xl font-bold">
                    {groupName} ({notifications.length})
                  </Text>
                </View>

                <View>
                  {notifications.map((n) => (
                    <View>
                      <NotificationItem key={n.id} notification={n} />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function NotificationItem({ notification }: { notification: INotification }) {
  return (
    <View className="mt-4">
      <View>
        <View>
          <Text className="text-white text-2xl font-bold capitalize">
            {notification.title}
          </Text>
          <Text className="text-white  text-lg">{notification.message}</Text>
        </View>
      </View>
    </View>
  );
}
