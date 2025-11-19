import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore, useUserBusiness } from '@/store';
import { Settings } from 'lucide-react-native';

export default function TraderTabsLayout() {
    const { user } = useAuthStore();
    const { business } = useUserBusiness();
    const router = useRouter();
    
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
          headerShown: false,
          headerTitle: () =>(
            <View className=''>
              <Avatar  alt="" className="w-10 h-10">
              <AvatarImage
                source={{ uri: user?.image || 'https://picsum.photos/seed/301/200/200' }}
              />
              <AvatarFallback>
                <Text>{business?.name?.charAt(0) || user?.first_name?.charAt(0) || 'T'}</Text>
              </AvatarFallback>
            </Avatar>
            </View>
          ),
          headerStyle: {
            backgroundColor: 'hsl(151 51% 33%)',
            paddingHorizontal: 10,
            paddingVertical: 10,
            paddingTop: 10,
            paddingBottom: 20,
            
          },
          headerTitleContainerStyle: {
            padding: 10,
          },
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '900',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            >
              <Settings size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="(dashboard)"
        options={{
          href: null,
        }}
      />
      <Toast />
    </Tabs>
  );
}
