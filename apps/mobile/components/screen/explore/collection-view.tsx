import { MapPin, ShieldCheck } from "lucide-react-native";
import { Text, View } from "react-native";
import ClusterCard from "./cluster-card";
import { useCollectionState } from "@/store/hooks/collection.hook";

export default function CollectionView({ router }: { router: any }) {
    const { data: { collection_by_id }} = useCollectionState();
    return (
        <View className="pb-8">
            {/* Header Info */}
            <View className="mb-6">
                <View className="w-12 h-12 bg-blue-900/30 rounded-xl items-center justify-center mb-4 border border-blue-500/20">
                    <Text className="text-blue-400 font-bold text-xl">{collection_by_id?.name?.charAt(0)}</Text>
                </View>
                <Text className="text-black dark:text-white text-2xl font-bold mb-2">{collection_by_id?.name}</Text>
                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1">
                        <MapPin size={14} color="#9ca3af" />
                        <Text className="text-gray-400">{collection_by_id?.city}, {collection_by_id?.country}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        {/* Icon for category */}
                        <Text className="text-gray-400">Technology</Text>
                    </View>
                </View>
            </View>

            {/* Stats Cards */}
            <View className="flex-row gap-4 mb-6">
                <View className="flex-1 bg-[#111827] p-4 rounded-xl border border-gray-800">
                    <Text className="text-gray-400 text-sm mb-1">Max Return</Text>
                    <Text className="text-[#10b981] text-2xl font-bold">{collection_by_id?.roi}%</Text>
                </View>
                <View className="flex-1 bg-[#111827] p-4 rounded-xl border border-gray-800">
                    <Text className="text-gray-400 text-sm mb-1">Total Investors</Text>
                    <Text className="text-white text-2xl font-bold">{404}</Text>
                </View>
            </View>

            {/* About Section */}
            <View className="bg-[#111827] p-5 rounded-2xl border border-gray-800 mb-8">
                <Text className="text-white text-lg font-bold mb-3">About this Collection</Text>
                <Text className="text-gray-400 leading-6 mb-4">
                    {collection_by_id?.description}
                </Text>

                <View className="bg-[#1f2937] p-3 rounded-xl flex-row items-center gap-3">
                    <ShieldCheck size={24} color="#10b981" />
                    <View>
                        <Text className="text-white font-semibold">Security Type</Text>
                        <Text className="text-gray-400 text-sm">Inventory Backed</Text>
                    </View>
                </View>
            </View>

            {/* Available Clusters */}
            <View>
                <Text className="text-white text-lg font-bold mb-1">Available Clusters</Text>
                <Text className="text-gray-400 mb-4">Choose an investment cycle that fits your goals.</Text>

                <View className="gap-4">
                    {collection_by_id?.cluster.map((cluster, index) => (
                        <ClusterCard key={index} cluster={cluster} router={router} />
                    ))}
                </View>
            </View>
        </View>
    );
}