import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Calendar, CheckCircle2, Circle } from 'lucide-react-native';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useClusterState } from '@/store/hooks/cluster.hook';
import { useColorScheme } from 'nativewind';
import TimelineItem from '@/components/timeline-item';

export default function ClusterDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { data: { cluster_by_id, get_cluster_by_id  } } = useClusterState();


    useEffect(()=>{
        get_cluster_by_id(id as string)
    }, [id])


    const collection = cluster_by_id;
    const progress = Math.min(Math.round((Number(cluster_by_id?.total_funds_raised) / Number(cluster_by_id?.target_fundraising_amount)) * 100) || 0, 100);

    const today = new Date();
    const startDate = cluster_by_id?.start_date ? new Date(cluster_by_id.start_date) : new Date(today.setDate(today.getDate() + 2));
    const maturityDate = cluster_by_id?.end_date ? new Date(cluster_by_id.end_date) : new Date(today.setDate(today.getDate() + 30));
    const payoutDate = new Date(maturityDate);
    payoutDate.setDate(payoutDate.getDate() + 2);

    const { colorScheme } = useColorScheme()

    return (
        <View className="flex-1 bg-gray-200 dark:bg-black">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-4 py-3 mb-2">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text className="text-black dark:text-white text-lg font-bold">{cluster_by_id?.duration} Cycle</Text>
                </View>

                <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                    {/* Top Card */}
                    <View className="bg-[#111827] rounded-3xl p-5 mb-6 border border-gray-800 relative overflow-hidden">
                        {/* Background decoration */}
                        <View className="absolute top-0 right-0 p-4 opacity-10">
                            {/* Placeholder for the icon in top right */}
                            <Calendar size={80} color="white" />
                        </View>

                        <View className="flex-row items-center gap-2 mb-4">
                            <MapPin size={16} color="#9ca3af" />
                            <Text className="text-gray-400 font-medium">{collection?.name}</Text>
                        </View>

                        <View className="flex-row items-baseline gap-2 mb-2">
                            <Text className="text-white text-5xl font-bold tracking-tight">{cluster_by_id?.roi}%</Text>
                            <Text className="text-[#10b981] text-lg font-medium">Return</Text>
                        </View>

                        <Text className="text-gray-400 mb-6 text-base">
                            Fixed return for this {cluster_by_id?.duration}-day liquidity cycle.
                        </Text>

                        <View className="flex-row gap-3">
                            <View className="bg-[#10b981]/20 px-4 py-2 rounded-xl">
                                <Text className="text-[#10b981] font-semibold">Open</Text>
                            </View>
                        </View>
                    </View>

                    {/* Cycle Timeline */}
                    <View className="bg-white dark:bg-[#111827] rounded-3xl p-5 mb-6 dark:border border-gray-800">
                        <View className="flex-row items-center gap-3 mb-6">
                            <Calendar size={20} color="#10b981" />
                            <Text className="text-black dark:text-white text-lg font-bold">Cycle Timeline</Text>
                        </View>

                        <View className="pl-2">
                            {/* Step 1 */}
                            <TimelineItem
                                active={true}
                                title="Open for Investment"
                                date="Today"
                                isLast={false}
                            />
                            {/* Step 2 */}
                            <TimelineItem
                                active={false}
                                title="Cycle Starts"
                                date={formatDate(startDate)}
                                isLast={false}
                            />
                            {/* Step 3 */}
                            <TimelineItem
                                active={false}
                                title="Maturity Date"
                                date={formatDate(maturityDate)}
                                isLast={false}
                            />
                            {/* Step 4 */}
                            <TimelineItem
                                active={false}
                                title="Payout Date"
                                date={formatDate(payoutDate)}
                                isLast={true}
                            />
                        </View>
                    </View>

                    {/* Funding Progress */}
                    <View className="bg-white dark:bg-[#111827] rounded-3xl p-5 mb-6 dark:border border-gray-800">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-black dark:text-white font-bold text-lg">Funding Progress</Text>
                            <Text className="text-[#10b981] font-bold">{progress}% Filled</Text>
                        </View>

                        <View className="h-3 bg-[#1f2937] rounded-full overflow-hidden mb-3">
                            <View className="h-full bg-[#10b981] rounded-full" style={{ width: `${progress}%` }} />
                        </View>

                        <Text className="text-gray-400 text-sm">
                            {404} investors have already joined this cycle.
                        </Text>
                    </View>

                    {/* Cycle Objectives */}
                    <View className="mb-24 dark:text-white">
                        <Text className="text-black dark:text-white text-lg font-bold mb-2">Cycle Objectives</Text>
                        <Text className="text-gray-400 leading-6 text-base">
                            {cluster_by_id?.description}
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-slate-100 dark:bg-[#0f1522] dark:border-t border-gray-800 p-4 pb-8">
                <View className="flex-row items-center justify-between gap-4">
                    <View>
                        <Text className="text-black dark:text-gray-400 text-sm mb-1">Total Payable</Text>
                        {/* <Text className="text-white text-2xl font-bold">{formatCurrency(collection.min_investment)}</Text> */}
                    </View>
                    <TouchableOpacity className="flex-1 bg-[#10b981] py-4 rounded-xl items-center">
                        <Text className="text-white font-bold text-lg">Invest Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


