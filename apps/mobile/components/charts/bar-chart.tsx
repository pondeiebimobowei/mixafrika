import { Bar, CartesianChart } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
// @ts-expect-error
import inter from "@/roboto.ttf";


export default function BarChartKit(){

    const font = useFont(inter, 12);
        const DATA = Array.from({ length: 9 }, (_, i) => ({
      day: i,
      highTmp: 40 + 30 * Math.random(),
    }));
    
    return(
        <CartesianChart axisOptions={{ font}} data={DATA} xKey="day" yKeys={["highTmp"]}>
            {({ points, chartBounds }) => (
            <Bar
                points={points.highTmp}
                color="green"
                chartBounds={chartBounds}
                animate={{ type: "timing", duration: 1200 }}
            />
            )}
        </CartesianChart>
    )
}