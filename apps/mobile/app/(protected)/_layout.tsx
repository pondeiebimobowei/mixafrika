import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store';
import '../../global.css';

export default function RootLayoutNav() {

  const { isLoggedIn, current_role } = useAuthStore();

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>

      <Stack.Protected guard={current_role === 'trader'}>
        <Stack.Screen name="(trader)" options={{ title: 'Trader Dashboard' }} />
      </Stack.Protected>

      <Stack.Protected guard={current_role === 'investor'}>
        <Stack.Screen name="(investor)" options={{ title: 'Investor Dashboard' }} />
      </Stack.Protected>
    </Stack>
  );
}
