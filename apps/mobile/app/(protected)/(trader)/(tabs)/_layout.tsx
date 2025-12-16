import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { TabBar } from '@/components/ui/tab-bar';

export default function TraderTabsLayout() {

  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={props => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Ionicons name="apps-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="esusu"
          options={{
            title: 'Esusu',
            tabBarIcon: ({ color }) => (
              <Ionicons name="basket-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color }) => (
              <Ionicons name="cash-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'profile',
            tabBarIcon: ({ color }) => (
              <Ionicons name="man" size={24} color={color} />
            ),
            headerShown: false,

          }}
        />
      </Tabs>
      
      <Toast />
    </>
  );
}
