import { useAuthStore } from "@/store";
import { ChartViews } from "@mixafrica/shared/types/utilities/chart";
import { BarChart as BarChartIcon, ChartAreaIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import LineChartKit from "../charts/line-chart";
import BarChartKit from "../charts/bar-chart";

export default function CreditScoreOverView(){
    const { user } = useAuthStore()
    const [chartView, setChartView ] = useState<ChartViews>("bar")

    return(
        <View className="py-10 px-2 bg-card rounded-xl">
            <View>
                <Text className="text-white text-2xl font-bold">Credit Score</Text>
                <View className="my-6">
                    <View className="flex flex-row justify-between">
                        <View>
                            <Text className="text-white text-5xl font-bold">{user?.credit_score}</Text>
                            <Text className="text-white text-2xl capitalize">{user?.credit_score_status}</Text>
                        </View>
                        <View className="flex flex-row gap-3">
                            <Pressable onPress={()=> setChartView("bar")} className={``}>
                                <View className={` ${chartView === "bar" ? "bg-slate-700 rounded-xl":""} p-2`}>
                                    <BarChartIcon className="" size={18} color={"white"} />

                                </View>
                            </Pressable>
                            <Pressable onPress={()=> setChartView("line")}>
                                <View className={` ${chartView === "line" ? "bg-slate-700 rounded-xl":""} p-2`}>
                                    <ChartAreaIcon size={18} color={"white"} />
                                </View>
                            </Pressable>
                        </View>
                    </View>
                    <Text className="text-slate-400 text-lg">Bassed on your repayment history</Text>

                </View>

                { chartView === "bar" ?
                    (
                        <BarChartKit />
                    ) :  (
                        <LineChartKit />
                    )
                }
            </View>
        </View>
    )
}