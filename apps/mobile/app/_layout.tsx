import { Stack, useNavigationContainerRef, useRootNavigationState } from "expo-router";
import "@/global.css"
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { PortalHost } from '@rn-primitives/portal'
import { useEffect } from "react";
import { useAuthStore, useUserSettings } from "@/store";
import { useColorScheme } from "nativewind";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { enable_dark_mode } = useUserSettings()

  useEffect(()=>{

    const darkMode = enable_dark_mode;
    if(darkMode){
      colorScheme.setColorScheme('dark');
    }else{
      colorScheme.setColorScheme('light');
    }
  },[enable_dark_mode])

  return <>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
        <PortalHost />
      </SafeAreaProvider>
    </>;
}
