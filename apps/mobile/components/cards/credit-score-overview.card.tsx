import { useAuthStore } from "@/store";
import { ChartViews } from "@mixafrica/shared/types/utilities/chart";
import { BarChart as BarChartIcon, ChartAreaIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import BarChartKit from "../charts/bar-chart";
import LineAreaChart from "../charts/line-area-chart";

export default function CreditScoreOverView(){
    const { user } = useAuthStore()
    const [chartView, setChartView ] = useState<ChartViews>("line")


    return(
        <View className="py-10 mb-6 px-6 bg-white dark:bg-[#1e293b] rounded-xl">
            <View>
                <Text className="dark:text-white text-lg font-semibold">Credit Score</Text>
                <View className="my-2">
                    <View className="flex flex-row justify-between">
                        <View>
                            <Text className="dark:text-white text-3xl font-semibold">{user?.credit_score}</Text>
                            <Text className="dark:text-white text-lg capitalize">{user?.credit_score_status}</Text>
                        </View>
                        <View className="flex flex-row gap-1">
                            <Pressable onPress={()=> setChartView("bar")} className={``}>
                                <View className={` ${chartView === "bar" ? "bg-slate-700":"bg-slate-400 dark:bg-slate-800"} rounded-xl p-2`}>
                                    <BarChartIcon className="" strokeWidth={6} size={14} color={`${chartView == 'bar' ? "green":"white"}`} />

                                </View>
                            </Pressable>
                            <Pressable onPress={()=> setChartView("line")}>
                                <View className={` ${chartView === "line" ? "bg-slate-700":"bg-slate-400 dark:bg-slate-800"} rounded-xl p-2`}>
                                    <ChartAreaIcon size={14} strokeWidth={4} color={`${chartView == 'line' ? "green":"white"}`} />
                                </View>
                            </Pressable>
                        </View>
                    </View>
                    <Text className="text-slate-400 text-sm">Bassed on your repayment history</Text>

                </View>
                <View style={{ height: 200 }}>
                    { chartView === 'bar' && <BarChartKit />}
                    { chartView === 'line' && <LineAreaChart />}
                </View>
            </View>
        </View>
    )
}