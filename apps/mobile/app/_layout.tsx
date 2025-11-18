import { Stack } from "expo-router";
import "@/global.css"
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { PortalHost } from '@rn-primitives/portal'

export default function RootLayout() {
  return <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
      <PortalHost />
    </>;
}
