import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const router = useRouter();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        
        <Stack.Screen
          name="notification"
          options={{
            headerShown: true,
            title: 'Notification',
            headerStyle: {
              backgroundColor: '#1A1A1A',
            },
            headerTitleAlign: 'center',
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: '900',
            },
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </Pressable>
            ),
          }}
        />
      

        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            title: 'Settings',
            headerStyle: {
              backgroundColor: 'black',
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
          }}
        />

      </Stack>
      
      <Toast />
    </>
  );
}
