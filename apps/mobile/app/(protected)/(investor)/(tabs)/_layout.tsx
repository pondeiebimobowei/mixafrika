import { TabBar } from '@/components/ui/tab-bar';
import { Ionicons } from '@expo/vector-icons';
import { Stack, Tabs } from 'expo-router';
import React from 'react';

export default function InvestorLayout() {
    return (
    <>
      <Tabs
        screenOptions={{ headerShown: false,}}
        
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
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => (
              <Ionicons name="globe-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="savings"
          options={{
            title: 'Savings',
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
      </Tabs>
      
    </>
  );
}
