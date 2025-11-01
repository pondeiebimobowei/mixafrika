
import { Shirt, HardHat, Tv } from "lucide-react";
import type { Notification } from '@/types';

export const generateChartData = (numPoints: number, period: string) => {
    let totalValue = 0;
    const data = [];
    const baseValue = 1000;
    const maxValue = 5000;

    for (let i = 0; i < numPoints; i++) {
        const value = baseValue + Math.random() * (maxValue - baseValue);
        totalValue += value;
        data.push({
            date: `${period} ${i + 1}`,
            value: value,
        });
    }

    const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

    const dataWithFill = data.map(d => ({
        ...d,
        fill: d.value > avgValue ? 'hsl(var(--primary))' : 'hsla(var(--primary), 0.5)',
    }));

    const percentageChange = Math.random() * 10;
    
    return {
        data: dataWithFill,
        totalChange: totalValue,
        percentageChange
    };
}

export const chartData1D = {
    data: [
        { date: 'Mon', value: 4000, fill: 'hsl(var(--primary))' },
        { date: 'Tue', value: 3000, fill: 'hsl(var(--primary))' },
        { date: 'Wed', value: 2000, fill: 'hsla(var(--primary), 0.5)' },
        { date: 'Thu', value: 2780, fill: 'hsla(var(--primary), 0.5)' },
        { date: 'Fri', value: 1890, fill: 'hsla(var(--primary), 0.5)' },
        { date: 'Sat', value: 2390, fill: 'hsla(var(--primary), 0.5)' },
        { date: 'Sun', value: 3490, fill: 'hsl(var(--primary))' },
    ],
    totalChange: 19550,
    percentageChange: 8.82
}

export const dashboardClusters = [
    { id: "balogun-textiles", name: "Balogun Textiles", description: "High-volume textile trading", roi: "+₦5,000", roiPercent: "+2.5%", icon: Shirt, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: "onitsha-electronics", name: "Onitsha Electronics", description: "Leading electronics hub", roi: "+₦4,800", roiPercent: "+2.4%", icon: Tv, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { id: "aba-shoes", name: "Aba Shoes", description: "Artisanal shoe manufacturing", roi: "+₦1,200", roiPercent: "+0.6%", icon: HardHat, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
]


export const initialNotificationsData: { Today: Notification[]; "This week": Notification[] } = {
  Today: [
    {
      id: 1,
      type: 'new_match' as const,
      title: 'New Investment Opportunity!',
      message: 'A new high-yield cluster is available.',
      read: false,
      timestamp: '5m ago',
    },
    {
      id: 2,
      type: 'new_cluster' as const,
      title: 'Onitsha Electronics ROI',
      message: 'You have received a return of ₦4,800.',
      read: false,
      timestamp: '30m ago',
    },
    {
      id: 3,
      type: 'goal_achieved' as const,
      title: 'Goal Reached: New Car',
      message: 'You have reached 80% of your goal.',
      read: false,
      timestamp: '1h ago',
    },
  ],
  "This week": [
    {
      id: 4,
      type: 'new_cluster' as const,
      title: 'New Cluster: Kano Grains',
      message: 'A new agricultural cluster has been added.',
      read: false,
      timestamp: '1d ago',
    },
    {
      id: 5,
      type: 'new_match' as const,
      title: 'Balogun Textiles ROI',
      message: 'You have received a return of ₦5,000.',
      read: true,
      timestamp: '2d ago',
    },
    {
      id: 6,
      type: 'new_follower' as const,
      title: 'Tunde O. followed you',
      message: 'You have a new follower on your strategy.',
      read: true,
      timestamp: '3d ago',
    },
    {
      id: 7,
      type: 'new_match' as const,
      title: 'Aba Shoes ROI',
      message: 'You have received a return of ₦1,200.',
      read: true,
      timestamp: '5d ago',
    }
  ]
};
