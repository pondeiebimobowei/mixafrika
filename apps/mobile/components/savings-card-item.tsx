import { formatCurrency } from "@/lib/utils";
import { ChevronRight, Lock, RefreshCw } from "lucide-react-native";
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SavingsCardItem({ plan }: { plan: any }) {
    const progress = Math.min((Number(plan.total_amount) / Number(plan.target_amount)) * 100, 100);
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(`/(protected)/(trader)/esusu/${plan.id}`)}
            activeOpacity={0.8}
            className="mb-4"
        >
            <View className="bg-[#111827] p-4 rounded-2xl border border-gray-800">
                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-row gap-3">
                        <View className="w-10 h-10 rounded-full bg-blue-900/20 items-center justify-center">
                            <Lock size={20} color="#60a5fa" />
                        </View>
                        <View>
                            <Text className="text-white font-bold text-lg">{plan.name}</Text>
                            <View className="flex-row items-center gap-2">
                                <View className="bg-[#10b981]/20 px-2 py-0.5 rounded">
                                    <Text className="text-[#10b981] text-xs font-bold uppercase">{plan.type}</Text>
                                </View>
                                <Text className="text-gray-400 text-xs">• {plan.frequency}</Text>
                            </View>
                        </View>
                    </View>
                    <ChevronRight size={20} color="#4b5563" />
                </View>

                <View className="flex-row justify-between items-end mb-2">
                    <View>
                        <Text className="text-gray-400 text-xs mb-1">Saved</Text>
                        <Text className="text-white font-bold text-xl">{formatCurrency(plan.total_amount)}</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-gray-400 text-xs mb-1">Target</Text>
                        <Text className="text-white font-bold">{formatCurrency(plan.target_amount)}</Text>
                    </View>
                </View>

                <View className="h-2 bg-[#1f2937] rounded-full overflow-hidden mb-4">
                    <View className="h-full bg-[#10b981] rounded-full" style={{ width: `${progress}%` }} />
                </View>

                <View className="flex-row justify-between items-center pt-3 border-t border-gray-800">
                    <Text className="text-gray-400 text-xs">Next Due: <Text className="text-white font-bold">{plan.next_due || 'N/A'}</Text></Text>
                    {plan.auto_save && (
                        <View className="flex-row items-center gap-1">
                            <RefreshCw size={12} color="#10b981" />
                            <Text className="text-[#10b981] text-xs font-bold">Auto-save on</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}