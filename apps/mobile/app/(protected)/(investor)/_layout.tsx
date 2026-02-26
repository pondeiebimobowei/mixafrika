import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const router = useRouter();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen
          name="(tabs)"
          options={{
            title: "Home",
            headerShown: false,
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

        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            title: 'Notification Preferences',
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

        <Stack.Screen
          name="support"
          options={{
            headerShown: true,
            title: 'Help & Support',
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
