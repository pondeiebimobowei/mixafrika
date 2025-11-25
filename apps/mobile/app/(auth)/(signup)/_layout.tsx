import { useSignup } from '@/hooks/use-signup.hook';
import { Stack } from 'expo-router';
import React from 'react';
import { FormProvider } from 'react-hook-form';

export default function SignupFormProviderWrapper() {
  const { form } = useSignup();

  return (
    <FormProvider {...form}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="select-role"
          options={{ title: 'Signup' }}
        />
      </Stack>
    </FormProvider>
  );
}
