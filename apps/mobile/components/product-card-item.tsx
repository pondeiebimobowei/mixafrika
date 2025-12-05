import { cn, formatCurrency } from "@/lib/utils";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProductCardItem({ title, description, rate, minDeposit, action, icon: Icon, iconColor, iconBg, rateColor = "text-blue-400" }: any) {
    return (
        <View className="bg-[#111827] p-4 rounded-2xl border border-gray-800 mb-4">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row gap-3 flex-1">
                    <View className={cn("w-10 h-10 rounded-full items-center justify-center", iconBg)}>
                        <Icon size={20} color={iconColor} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg">{title}</Text>
                        <Text className="text-gray-400 text-xs leading-4 mt-1">{description}</Text>
                    </View>
                </View>
                <View className="bg-[#1f2937] px-3 py-2 rounded-lg items-center">
                    <Text className={cn("font-bold text-lg", rateColor)}>{rate}</Text>
                    <Text className="text-gray-500 text-[10px] uppercase">P.A.</Text>
                </View>
            </View>

            <View className="h-[1px] bg-gray-800 my-3" />

            <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-xs">Min Deposit: <Text className="text-white font-bold">{formatCurrency(minDeposit)}</Text></Text>
                <TouchableOpacity className="bg-white py-2 px-4 rounded-lg">
                    <Text className="text-black font-bold text-xs">{action}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}