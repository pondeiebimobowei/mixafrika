import { Area, CartesianChart } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
// @ts-expect-error
import inter from "@/roboto.ttf";

export default function LineChartKit(){
    const font = useFont(inter, 12);
    const DATA = Array.from({ length: 20 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));
    return (
        <CartesianChart axisOptions={{ font}} data={DATA} xKey="day" yKeys={["highTmp"]}>
            {({ points, chartBounds }) => (
            <Area
                points={points.highTmp}
                color="green"
                y0={chartBounds.bottom}
                curveType="natural"
                animate={{ type: "timing", duration: 1200 }}
            />
            )}
        </CartesianChart>
    )
}