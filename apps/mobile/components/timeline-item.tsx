import { cn } from "@/lib/utils";
import { Text, View } from "react-native";

export default function TimelineItem({ active, title, date, isLast }: { active: boolean; title: string; date: string; isLast: boolean }) {
    return (
        <View className="flex-row h-16">
            <View className="items-center mr-4 w-6">
                <View className={cn(
                    "w-4 h-4 rounded-full border-2 z-10",
                    active ? "bg-[#10b981] border-[#10b981]" : "bg-[#1f2937] border-[#374151]"
                )} />
                {!isLast && (
                    <View className="w-0.5 h-full bg-[#1f2937] -mt-1" />
                )}
            </View>
            <View className="-mt-1">
                <Text className={cn(
                    "font-bold text-base mb-0.5",
                    active ? "text-black dark:text-white" : "text-gray-500"
                )}>{title}</Text>
                <Text className="text-gray-500 text-sm">{date}</Text>
            </View>
        </View>
    );
}