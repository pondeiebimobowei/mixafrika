import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, MapPin, Plus } from 'lucide-react-native';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore, useUserBusiness, useWallet } from '@/store';

export default function TraderProfileCard() {
    const { business } = useUserBusiness();
    const { available_balance } = useWallet();
    const [isBalanceVisible, setIsBalanceVisible] = useState(false);
    const { user } = useAuthStore();

    const creditScore = user?.credit_score;

    return (
        <View className="bg-[#1e293b] rounded-2xl p-5 mb-6">
            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-white text-2xl font-bold mb-1">{business?.name || 'Business Name'}</Text>
                    <View className="flex-row items-center gap-1">
                        <MapPin size={14} color="#94a3b8" />
                        <Text className="text-slate-400 text-sm">{business?.city}, {business?.state}</Text>
                    </View>
                </View>

                {/* Credit Score Badge */}
                <View className="bg-[#334155] px-3 py-2 rounded-xl items-center">
                    <Text className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">Credit Score</Text>
                    <Text className="text-[#34d399] text-2xl font-bold">{creditScore}</Text>
                </View>
            </View>

            {/* Wallet Section */}
            <View className="flex-row gap-4">
                {/* Balance Box */}
                <View className="flex-[2] bg-[#0f172a] rounded-xl p-3 justify-center pl-4">
                    <TouchableOpacity
                        onPress={() => setIsBalanceVisible(prev => !prev)}
                        className="flex-[2]  justify-between"
                    >
                        <Text className="text-slate-400 text-xs mb-1">Wallet Balance</Text>
                        
                        <View className='flex-row items-center gap-4 justify-between'>
                            <Text className="text-white text-xl font-bold h-7">
                                {isBalanceVisible ? formatCurrency(available_balance ) : '******'}
                            </Text>
                            {isBalanceVisible ? (
                                <EyeOff size={16} color="#64748b" />
                            ) : (
                                <Eye size={16} color="#64748b" />
                            )}

                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
