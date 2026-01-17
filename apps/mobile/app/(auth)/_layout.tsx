import { useSignup } from '@/hooks/use-signup.hook';
import { Stack } from 'expo-router';
import React from 'react';
import { FormProvider } from 'react-hook-form';

export default function SignupFormProviderWrapper() {
  const { form } = useSignup(null);

  return (
    <FormProvider {...form}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="login"
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="(signup)/select-role"
          options={{ title: 'Signup' }}
        />
        <Stack.Screen
          name="(signup)/personal"
          options={{ title: 'Personal' }}
        />
      </Stack>
    </FormProvider>
  );
}
