import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuthStore, useUserBusiness } from '@/store';
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
              <Ionicons name="home-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="esusu"
          options={{
            title: 'Esusu',
            tabBarIcon: ({ color }) => (
              <Ionicons name="cash-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <Ionicons name="man" size={24} color={color} />
            ),
            headerShown: false,

          }}
        />


        <Tabs.Screen
          name="(dashboard)"
          options={{
            title: '(dashboard)',
            href: null,
          }}
        />

        <Tabs.Screen
          name="(tab-screens)"
          options={{
            title: '(tab-screens)',
            href: null,
          }}
        />
      </Tabs>
      
      <Toast />
    </>
  );
}
