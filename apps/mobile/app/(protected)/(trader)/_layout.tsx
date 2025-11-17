import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TraderTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
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
        name="loan/apply"
        options={{
          title: 'Apply',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
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
        }}
      />

      <Tabs.Screen
        name="(dashboard)"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
