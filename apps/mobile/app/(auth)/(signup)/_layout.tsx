import { Stack,  } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';

export default function SignupFormProviderWrapper() {

  return (  
      <>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </>
  );
}
