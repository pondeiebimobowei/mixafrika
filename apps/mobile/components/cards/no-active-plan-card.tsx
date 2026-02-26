import { PiggyBank } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function NoActivePlanCard() {
    return (
        <View className="bg-white dark:bg-[#111827] rounded-3xl p-8 items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800">
            <View className="w-16 h-16 bg-[#1f2937] rounded-full items-center justify-center mb-4">
                <PiggyBank size={32} color="#6b7280" />
            </View>
            <Text className="text-black dark:text-white font-bold text-lg mb-2">No Active Plan</Text>
            <Text className="text-gray-400 text-center mb-6 px-4">
                Start a fixed deposit or target savings plan today.
            </Text>
            <TouchableOpacity>
                <Text className="text-[#10b981] font-bold">Create your first plan</Text>
            </TouchableOpacity>
        </View>
    )
}