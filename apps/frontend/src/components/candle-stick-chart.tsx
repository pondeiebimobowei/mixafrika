import type { WeeklyPoolData } from '@/types/chart';
import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type BarProps,
} from 'recharts';


interface CandlestickChartProps {
  data: WeeklyPoolData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const volume = data.volume;
    
    // The payload can be for either bar, check if we have the candlestick data
    if (!volume) return null;

    return (
      <div className="p-2 border rounded-lg bg-background shadow-lg text-sm">
        <p className="font-bold mb-1">{label}</p>
        <p>Open: <span className="font-semibold">₦{(volume[0] / 1e6).toFixed(1)}M</span></p>
        <p>High: <span className="font-semibold text-primary">₦{(volume[1] / 1e6).toFixed(1)}M</span></p>
        <p>Low: <span className="font-semibold text-destructive">₦{(volume[2] / 1e6).toFixed(1)}M</span></p>
        <p>Close: <span className="font-semibold">₦{(volume[3] / 1e6).toFixed(1)}M</span></p>
      </div>
    );
  }

  return null;
};

const Candlestick = (props: any) => {
    const { x, width, low, high, open, close, yAxis } = props;

    if (open === undefined || close === undefined || low === undefined || high === undefined || !yAxis) {
        return null;
    }
    
    const isBullish = close > open;
    const fill = isBullish ? 'hsl(var(--primary))' : 'hsl(var(--destructive))';
    
    // recharts gives `y` as the coordinate for the top of the bar.
    // The `height` is always positive, representing `abs(open-close)`.
    // We need to map `high` and `low` values to their Y-coordinates.
    const highY = yAxis.scale(high);
    const lowY = yAxis.scale(low);
    const openY = yAxis.scale(open);
    const closeY = yAxis.scale(close);

    const candleBodyY = Math.min(openY, closeY);
    const candleBodyHeight = Math.abs(openY - closeY);
    
    return (
        <g stroke={fill} fill={fill} strokeWidth={1}>
            {/* Wick */}
            <line x1={x + width / 2} y1={highY} x2={x + width / 2} y2={lowY} />
            {/* Body */}
            <rect
                x={x}
                y={candleBodyY}
                width={width}
                height={candleBodyHeight > 0 ? candleBodyHeight : 1} // Min height of 1px
            />
        </g>
    );
};


export const CandlestickChartComponent: React.FC<CandlestickChartProps> = ({ data }) => {
    const chartData = data.map(d => {
        const [open, high, low, close] = d.volume;
        return {
            week: d.week,
            openClose: [open, close] as [number, number],
            highLow: [low, high] as [number, number],
            // Pass raw values to shape
            open, close, low, high,
            volume: d.volume
        }
    })

  return (
    <ResponsiveContainer width="100%" height={160}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis hide domain={['dataMin - 500000', 'dataMax + 500000']} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Bar
            dataKey="openClose"
            shape={(props: BarProps) => <Candlestick {...props} />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
