
import type { Investment, ReinvestCluster } from '@/types';
import { HardHat, Wheat, Shirt, Tv } from 'lucide-react';

export const allClustersForReinvest: ReinvestCluster[] = [
  {
    id: 'aba-shoes',
    name: 'Aba Market (Shoes)',
    logo: HardHat,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    status: 'active' as const,
  },
  {
    id: 'kano-grains',
    name: 'Kano Market (Grains)',
    logo: Wheat,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    status: 'pooling' as const,
  },
  {
    id: 'balogun-textiles',
    name: 'Balogun Market (Textiles)',
    logo: Shirt,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    status: 'active' as const,
  },
  {
    id: 'onitsha-electronics',
    name: 'Onitsha Market (Electronics)',
    logo: Tv,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    status: 'pooling' as const,
  },
];


export const activeInvestments: Investment[] = [
    {
        id: 'inv-1',
        clusterId: 'balogun-textiles',
        name: 'Balogun Textiles',
        amountInvested: 100000,
        currentValue: 108500,
        cycleProgress: 30,
        cycleEnds: 'in 60 days',
        status: 'active',
    },
    {
        id: 'inv-2',
        clusterId: 'onitsha-electronics',
        name: 'Onitsha Electronics',
        amountInvested: 250000,
        currentValue: 272000,
        cycleProgress: 80,
        cycleEnds: 'in 9 days',
        status: 'active',
    }
]

export const pastInvestments: Investment[] = [
     {
        id: 'inv-3',
        clusterId: 'aba-shoes',
        name: 'Aba Shoes',
        amountInvested: 50000,
        return: 14000,
        returnPercentage: 28,
        status: 'completed',
        date: 'Jan 2025',
    },
     {
        id: 'inv-4',
        clusterId: 'balogun-textiles',
        name: 'Balogun Textiles',
        amountInvested: 100000,
        return: 25000,
        returnPercentage: 25,
        status: 'completed',
        date: 'Dec 2024',
    }
]
