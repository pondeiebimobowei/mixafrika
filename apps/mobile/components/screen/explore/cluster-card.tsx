import { ICluster } from "@mixafrica/shared/types/cluster";
import { Clock } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function ClusterCard({ cluster, router }: { cluster: ICluster, router: any }) {
    const progress = Math.min(Math.round((cluster.total_funds_raised / cluster.target_fundraising_amount) * 100) || 0, 100);

    const isFillingFast = progress > 50;
    const status = isFillingFast ? "FILLING FAST" : "OPEN";
    const statusColor = isFillingFast ? "text-yellow-500" : "text-[#10b981]";
    const statusBg = isFillingFast ? "bg-yellow-500/20" : "bg-[#10b981]/20";

    return (
        <View className="bg-[#111827] p-4 rounded-2xl border border-gray-800">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#1f2937] items-center justify-center">
                        <Clock size={20} color="#10b981" />
                    </View>
                    <View>
                        <Text className="text-white font-bold text-lg">{cluster.duration} days Cycle</Text>
                        {/* <Text className="text-gray-400">Min. {formatCurrency(cluster.collection.min_investment)}</Text> */}
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-[#10b981] font-bold text-lg">{cluster.roi}% Return</Text>
                    <View className={`${statusBg} px-2 py-0.5 rounded text-xs mt-1`}>
                        <Text className={`${statusColor} text-[10px] font-bold uppercase`}>{status}</Text>
                    </View>
                </View>
            </View>

            <View className="mb-4">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400 text-sm">Progress</Text>
                    <Text className="text-white text-sm font-bold">{progress}%</Text>
                </View>
                <View className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                    <View className="h-full bg-[#10b981] rounded-full" style={{ width: `${progress}%` }} />
                </View>
            </View>

            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={() => router.push(`/cluster/${cluster.id}`)}
                    className="flex-1 bg-[#1f2937] py-3 rounded-xl items-center"
                >
                    <Text className="text-white font-semibold">View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-[#10b981] py-3 rounded-xl items-center">
                    <Text className="text-white font-semibold">Invest Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}