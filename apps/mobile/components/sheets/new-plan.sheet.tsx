import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { X, Target, Lock, Users, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFetchSavings } from '@/store/hooks/savings.hook';


export function NewPlanSheet({ onClose }: { onClose?: () => void }) {
   

    const router = useRouter()


    const renderHeader = (title: string) => (
        <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg text-black dark:text-white font-semibold">{title}</Text>
        </View>
    );

    useFetchSavings()


    return (
        <View className="p-4 pb-10 dark:bg-[#1A1A1A] h-[500px]">
                {renderHeader('Select Plan Type')}
                <View className="gap-4">
                    <TouchableOpacity
                        onPress={() => {onClose && onClose(); router.push('/esusu/target')}}
                        className=" bg-white dark:bg-[#2A2D35] p-4 rounded-xl flex-row items-center"
                    >
                        <View className="w-10 h-10 rounded-full bg-blue-900/20 items-center justify-center mr-4">
                            <Target size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-black dark:text-white ">Target Savings</Text>
                            <Text className="text-gray-400 text-xs">Save towards a specific goal</Text>
                        </View>
                        <Check size={20} color="#3B82F6" className="opacity-0" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {onClose && onClose(); router.push('/esusu/fixed')}}
                        className="bg-white dark:bg-[#2A2D35] p-4 rounded-xl flex-row items-center"
                    >
                        <View className="w-10 h-10 rounded-full bg-red-900/20 items-center justify-center mr-4">
                            <Lock size={20} color="#EF4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-black dark:text-white">Fixed Savings</Text>
                            <Text className="text-gray-400 text-xs">Lock funds for interest</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled
                        className="bg-white dark:bg-[#2A2D35] p-4 rounded-xl flex-row items-center opacity-50"
                    >
                        <View className="w-10 h-10 rounded-full bg-green-900/20 items-center justify-center mr-4">
                            <Users size={20} color="#27AE60" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-black dark:text-white">Group Savings</Text>
                            <Text className="text-gray-400 text-xs">Save with friends (Coming Soon)</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
    );
}
