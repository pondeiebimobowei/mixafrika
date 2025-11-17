import { IUser } from "@mixafrica/shared/types/user";
import { Text, View } from "react-native";
export default function Index() {
  const user: IUser| null = null
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}
