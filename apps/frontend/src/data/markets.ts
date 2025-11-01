
import type { Cluster, ClusterStatus, Activity } from '@/types';
import { type WeeklyPoolData } from '@/types/chart';
import { HardHat, Wheat, Shirt, Tv, TrendingUp, Info, Repeat, CheckCircle } from 'lucide-react';

export const allClusters: Cluster[] = [
  {
    id: 'aba-shoes',
    name: 'Aba Market (Shoes)',
    category: 'Artisanal Manufacturing',
    roi: '+28%',
    repayment: '96%',
    trend: 'up' as const,
    logo: HardHat,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    status: 'active' as ClusterStatus,
  },
  {
    id: 'kano-grains',
    name: 'Kano Market (Grains)',
    category: 'Agriculture',
    roi: '+32%',
    repayment: '98%',
    trend: 'up' as const,
    logo: Wheat,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    status: 'pooling' as ClusterStatus,
    poolCurrent: 8000000,
    poolTarget: 12000000,
  },
  {
    id: 'balogun-textiles',
    name: 'Balogun Market (Textiles)',
    category: 'Textiles & Apparel',
    roi: '+25%',
    repayment: '95%',
    trend: 'up' as const,
    logo: Shirt,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    status: 'active' as ClusterStatus,
  },
  {
    id: 'onitsha-electronics',
    name: 'Onitsha Market (Electronics)',
    category: 'Consumer Electronics',
    roi: '+30%',
    repayment: '14%',
    trend: 'down' as const,
    logo: Tv,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    status: 'pooling' as ClusterStatus,
    poolCurrent: 18500000,
    poolTarget: 25000000,
  },
];

interface ClusterDetails {
    growth: number;
    cycle: number;
    volume: number;
    repayment: string;
    investorSentiment: number;
    activities: Activity[];
    performanceData: { month: string; performance: number }[];
}

export const clusterDetailsData: { [key: string]: ClusterDetails } = {
  'aba-shoes': {
    growth: 28,
    cycle: 30,
    volume: 8000000,
    repayment: '96%',
    investorSentiment: 4.5,
    activities: [
      { type: 'roi', message: 'Daily ROI of +0.93% credited', time: '1h ago', icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-500/10' },
      { type: 'investment', message: 'New investment of ₦150,000 received', time: '3d ago', icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
      { type: 'repayment', message: 'Trader repayment received', time: '4d ago', icon: Repeat, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    ],
    performanceData: [
      { month: "Jan", performance: 22 }, { month: "Feb", performance: 25 },
      { month: "Mar", performance: 24 }, { month: "Apr", performance: 28 },
    ],
  },
  'kano-grains': {
    growth: 32,
    cycle: 60,
    volume: 12000000,
    repayment: '98%',
    investorSentiment: 4.8,
    activities: [
      { type: 'investment', message: 'New investment of ₦300,000 received', time: '1d ago', icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
      { type: 'repayment', message: 'Bulk repayment from farmers coop', time: '2d ago', icon: Repeat, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    ],
     performanceData: [
      { month: "Jan", performance: 28 }, { month: "Feb", performance: 30 },
      { month: "Mar", performance: 29 }, { month: "Apr", performance: 32 },
    ],
  },
  'balogun-textiles': {
    growth: 25,
    cycle: 90,
    volume: 15000000,
    repayment: '95%',
    investorSentiment: 4.6,
    activities: [
      { type: 'roi', message: 'Daily ROI of +0.83% credited', time: '3h ago', icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-500/10' },
      { type: 'investment', message: 'New investment of ₦250,000 received', time: '1d ago', icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
      { type: 'payout', message: 'Cycle completed. Payouts processed.', time: '31d ago', icon: CheckCircle, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    ],
     performanceData: [
      { month: "Jan", performance: 20 }, { month: "Feb", performance: 22 },
      { month: "Mar", performance: 23 }, { month: "Apr", performance: 25 },
    ],
  },
  'onitsha-electronics': {
    growth: 30,
    cycle: 45,
    volume: 25000000,
    repayment: '14%',
    investorSentiment: 3.2,
    activities: [
       { type: 'investment', message: 'New investment of ₦500,000 received', time: '2d ago', icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
       { type: 'repayment', message: 'Late repayment received from trader', time: '5d ago', icon: Repeat, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    ],
     performanceData: [
      { month: "Jan", performance: 35 }, { month: "Feb", performance: 33 },
      { month: "Mar", performance: 31 }, { month: "Apr", performance: 30 },
    ],
  }
};

export const adBanners = [
  {
    title: 'Hot Investment 🔥',
    description: 'Onitsha Electronics cluster is booming. Invest now!',
    imageId: 'ad-banner-electronics',
    link: '/clusters/onitsha-electronics',
  },
  {
    title: 'New Cluster Alert!',
    description: 'Kano Grains is now open for investment. Don\'t miss out!',
    imageId: 'ad-banner-grains',
    link: '/clusters/kano-grains',
  },
    {
    title: 'Steady Returns',
    description: 'Balogun Textiles offers consistent ROI. A safe bet.',
    imageId: 'ad-banner-textiles',
    link: '/clusters/balogun-textiles',
  },
];

export const weeklyPoolData: WeeklyPoolData[] = [
  { week: "Wk 1", volume: [1.2e6, 1.5e6, 1.1e6, 1.4e6] },
  { week: "Wk 2", volume: [1.8e6, 2.1e6, 1.7e6, 2.0e6] },
  { week: "Wk 3", volume: [1.5e6, 1.9e6, 1.4e6, 1.8e6] },
  { week: "Wk 4", volume: [2.2e6, 2.5e6, 2.1e6, 2.4e6] },
  { week: "Wk 5", volume: [2.5e6, 2.8e6, 2.4e6, 2.7e6] },
  { week: "Wk 6", volume: [2.3e6, 2.6e6, 2.2e6, 2.5e6] },
  { week: "Wk 7", volume: [2.8e6, 3.1e6, 2.7e6, 3.0e6] },
]

export const clusterPerformanceData = [
  { month: 'Jan', balogun: 20, onitsha: 35, aba: 22, kano: 28 },
  { month: 'Feb', balogun: 22, onitsha: 33, aba: 25, kano: 30 },
  { month: 'Mar', balogun: 23, onitsha: 31, aba: 24, kano: 29 },
  { month: 'Apr', balogun: 25, onitsha: 30, aba: 28, kano: 32 },
  { month: 'May', balogun: 26, onitsha: 31, aba: 29, kano: 33 },
  { month: 'Jun', balogun: 27, onitsha: 32, aba: 30, kano: 34 },
];
