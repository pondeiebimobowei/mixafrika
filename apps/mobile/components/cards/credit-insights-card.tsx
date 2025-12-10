import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BarChart3 } from 'lucide-react-native';

export default function CreditInsightsCard() {
    return (
        <View className="bg-[#1e293b] rounded-2xl p-5 mb-6">
            <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center gap-2">
                    <BarChart3 size={20} color="#10b981" />
                    <Text className="text-white font-bold text-base">Credit Insights</Text>
                </View>
                <View className="flex-row bg-[#0f172a] rounded-lg p-1">
                    <TouchableOpacity className="bg-[#334155] px-3 py-1 rounded-md">
                        <Text className="text-white text-[10px] font-bold uppercase">Trend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-3 py-1 rounded-md">
                        <Text className="text-slate-500 text-[10px] font-bold uppercase">Factors</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Mock Chart Area */}
            <View className="h-32 w-full justify-end relative">
                {/* Horizontal Grid Lines */}
                {[0, 1, 2, 3].map((_, i) => (
                    <View key={i} className="absolute w-full h-[1px] bg-slate-800" style={{ bottom: `${i * 33}%` as any }} />
                ))}

                {/* Simple Trend Line Visual via SVG or just multiple Views would be hard. 
                    Using a simplified bar/area representation with CSS for now. */}
                <View className="flex-row justify-between items-end h-24 px-2">
                    {/* Mock Bars/Points */}
                    <View className="w-1 h-10 bg-[#10b981]/20 rounded-t-full" />
                    <View className="w-1 h-12 bg-[#10b981]/30 rounded-t-full" />
                    <View className="w-1 h-14 bg-[#10b981]/40 rounded-t-full" />
                    <View className="w-1 h-16 bg-[#10b981]/50 rounded-t-full" />
                    <View className="w-1 h-20 bg-[#10b981] rounded-t-full" />
                </View>

                {/* Trend Curve (Simulated with absolute views or SVG if available, keeping simple for standard RN) */}
                <View className="absolute top-10 left-0 right-0 h-20 bg-[#10b981]/5 rounded-xl border-t border-[#10b981]" style={{ transform: [{ skewY: '-5deg' }] }} />
            </View>

            {/* X-Axis Labels */}
            <View className="flex-row justify-between px-2 mt-2">
                {['Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m) => (
                    <Text key={m} className="text-slate-500 text-xs">{m}</Text>
                ))}
            </View>

            <View className="mt-4 pt-4 border-t border-slate-700">
                <Text className="text-slate-400 text-xs text-center">Consistent repayment has boosted your score by 15%.</Text>
            </View>
        </View>
    );
}
