import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store';
import '../../global.css';

export default function RootLayoutNav() {

  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={user?.role === 'trader'}>
        <Stack.Screen
          name="(protected)/(trader)"
          options={{ title: 'Trader Dashboard', headerShown: false }}
        />
      </Stack.Protected>

      <Stack.Protected guard={user?.role != 'trader'}>
        <Stack.Screen name="(auth)/trader-login" />
      </Stack.Protected>
    </Stack>
  );
}
