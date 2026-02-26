import { cn } from "@/lib/utils";
import { Image, Text, View } from "react-native";

export default function UpdatesTab({ updates }: { updates: any[] }) {
    return (
        <View className="pb-8 pl-4">
            {updates.map((update, index) => (
                <View key={index} className="flex-row">
                    {/* Timeline Line */}
                    <View className="items-center mr-4">
                        <View className="w-3 h-3 rounded-full border-2 border-[#10b981] bg-black z-10" />
                        {index !== updates.length - 1 && (
                            <View className="w-0.5 h-full bg-gray-800 -mt-1" />
                        )}
                    </View>

                    {/* Content */}
                    <View className="flex-1 bg-[#111827] rounded-xl p-4 mb-6 border border-gray-800">
                        <View className="flex-row justify-between items-center mb-2">
                            <View className={cn(
                                "px-2 py-0.5 rounded text-xs",
                                update.type === 'NEWS' ? "bg-blue-500/20" : "bg-purple-500/20"
                            )}>
                                <Text className={cn(
                                    "text-[10px] font-bold uppercase",
                                    update.type === 'NEWS' ? "text-blue-400" : "text-purple-400"
                                )}>{update.type}</Text>
                            </View>
                            <Text className="text-gray-400 text-xs">{update.date}</Text>
                        </View>

                        <Text className="text-white font-bold text-lg mb-2">{update.title}</Text>

                        {update.image && (
                            <Image
                                source={{ uri: update.image }}
                                className="w-full h-32 rounded-lg mb-3"
                                resizeMode="cover"
                            />
                        )}

                        <Text className="text-gray-300 leading-5 text-sm">
                            {update.content}
                        </Text>
                    </View>
                </View>
            ))}

            <View className="items-center mt-4">
                <Text className="text-gray-500 text-sm">End of updates</Text>
            </View>
        </View>
    );
}