import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="loan/apply"
        options={{
          headerShown: true,
          title: 'Apply for Funds',
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
        name="repayment-history"
        options={{
          headerShown: true,
          title: 'Repayment History',
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
        name="esusu/target"
        options={{
          headerShown: true,
          title: 'Esusu - Target Savings',
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
        name="esusu/fixed"
        options={{
          headerShown: true,
          title: 'Esusu - Fixed Savings',
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

      <Toast />
    </Stack>
  );
}
