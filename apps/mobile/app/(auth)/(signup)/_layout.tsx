import { useSignup } from '@/hooks/use-signup.hook';
import { Slot, Stack,  } from 'expo-router';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import Toast from 'react-native-toast-message';

export default function SignupFormProviderWrapper() {
  const { form } = useSignup();

  return (  
      <>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </>
  );
}
