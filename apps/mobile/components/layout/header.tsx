import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Sun, Moon } from "lucide-react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { useAuthStore } from "@/store";

export default function Header(){
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { user } = useAuthStore();
    return (

        <View className="flex-row items-center justify-between px-4 py-3 mb-4">
                <View className="flex-row items-center gap-3">
                    <Avatar alt="" className="w-8 h-8">
                        <AvatarImage source={{ uri: user?.image || 'https://picsum.photos/seed/301/200/200' }} />
                        <AvatarFallback><Text>{user?.first_name?.charAt(0) || 'U'}</Text></AvatarFallback>
                    </Avatar>
                    <Text className="text-white text-lg font-bold">Dashboard</Text>
                </View>
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity>
                        <Bell size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleColorScheme}>
                        {colorScheme === 'dark' ? (
                            <Sun size={24} color="white" />
                        ) : (
                            <Moon size={24} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
    )
}