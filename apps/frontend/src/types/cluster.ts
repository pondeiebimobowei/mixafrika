
import type { LucideIcon } from 'lucide-react';

export type ClusterStatus = 'active' | 'pooling';

export interface Trader {
  name: string;
  experience: string;
  rating: number;
  avatar: string;
}

export interface Sentiment {
    user: string;
    rating: number;
    comment: string;
    avatar: string;
}

export interface Activity {
    type: string;
    message: string;
    time: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

export interface Cluster {
    id: string;
    name: string;
    category: string;
    description?: string;
    totalVolume?: number;
    performance?: number;
    cycle?: string;
    repayment: string;
    status: ClusterStatus;
    traders?: Trader[];
    sentiments?: Sentiment[];
    activities?: Activity[];
    cycleProgress?: {
        daysElapsed: number;
        daysTotal: number;
    };
    poolCurrent?: number;
    poolTarget?: number;
    roi: string;
    trend: 'up' | 'down';
    logo: LucideIcon;
    color: string;
    bgColor: string;
}

export interface ReinvestCluster {
    id: string;
    name: string;
    status: 'active' | 'pooling';
    logo: React.ElementType;
    color: string;
    bgColor: string;
};

export type FilterType = 'all' | 'active' | 'pooling' | 'continental';
export type ChartView = 'area' | 'bar' | 'candlestick';
