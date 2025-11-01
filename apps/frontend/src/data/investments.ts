
import type { Investment } from '@/types';

export const investmentData: { [key: string]: Investment } = {
  'inv-1': {
    id: 'inv-1',
    status: 'active',
    clusterId: 'balogun-textiles',
    name: 'Balogun Textiles',
    amountInvested: 100000,
    currentValue: 108500,
    cycleProgress: 30,
    cycleTotalDays: 90,
    cycleStartDate: '2025-03-15',
    roiData: [
        { date: 'Apr 1', earnings: 83 }, { date: 'Apr 2', earnings: 166 }, { date: 'Apr 3', earnings: 250 },
        { date: 'Apr 4', earnings: 333 }, { date: 'Apr 5', earnings: 416 }, { date: 'Apr 6', earnings: 500 },
        { date: 'Apr 7', earnings: 583 }, { date: 'Apr 8', earnings: 666 }, { date: 'Apr 9', earnings: 750 },
        { date: 'Apr 10', earnings: 833 }, { date: 'Apr 11', earnings: 916 }, { date: 'Apr 12', earnings: 1000 },
        { date: 'Apr 13', earnings: 1083 }, { date: 'Apr 14', earnings: 1166 }, { date: 'Apr 15', earnings: 1250 },
    ],
    recentCredits: [
        { date: 'Apr 15, 2025', amount: 83.33, type: 'Daily ROI' },
        { date: 'Apr 14, 2025', amount: 83.33, type: 'Daily ROI' },
        { date: 'Apr 13, 2025', amount: 83.33, type: 'Daily ROI' },
    ]
  },
  'inv-2': {
    id: 'inv-2',
    status: 'active',
    clusterId: 'onitsha-electronics',
    name: 'Onitsha Electronics',
    amountInvested: 250000,
    currentValue: 272000,
    cycleProgress: 80,
    cycleTotalDays: 90,
    cycleStartDate: '2025-01-20',
     roiData: [
        { date: 'Apr 1', earnings: 200 }, { date: 'Apr 2', earnings: 400 }, { date: 'Apr 3', earnings: 600 },
        { date: 'Apr 4', earnings: 800 }, { date: 'Apr 5', earnings: 1000 }, { date: 'Apr 6', earnings: 1200 },
        { date: 'Apr 7', earnings: 1400 }, { date: 'Apr 8', earnings: 1600 }, { date: 'Apr 9', earnings: 1800 },
        { date: 'Apr 10', earnings: 2000 }, { date: 'Apr 11', earnings: 2200 }, { date: 'Apr 12', earnings: 2400 },
    ],
     recentCredits: [
        { date: 'Apr 12, 2025', amount: 200, type: 'Daily ROI' },
        { date: 'Apr 11, 2025', amount: 200, type: 'Daily ROI' },
        { date: 'Apr 10, 2025', amount: 200, type: 'Daily ROI' },
    ]
  },
  'inv-3': {
    id: 'inv-3',
    status: 'completed',
    clusterId: 'aba-shoes',
    name: 'Aba Shoes (Jan 2025 Cycle)',
    amountInvested: 50000,
    return: 14000,
    returnPercentage: 28,
    cycleStartDate: '2025-01-01',
    cycleEndDate: '2025-01-31',
    clusterSnapshot: {
        totalPool: 8000000,
        participants: 112,
        tradersFunded: 4,
    },
    roiData: Array.from({length: 30}, (_, i) => ({ date: `Jan ${i+1}`, earnings: (i+1) * (14000/30) })),
    recentCredits: [
        { date: 'Jan 31, 2025', amount: 466.67, type: 'Final ROI' },
        { date: 'Jan 30, 2025', amount: 466.67, type: 'Daily ROI' },
        { date: 'Jan 29, 2025', amount: 466.67, type: 'Daily ROI' },
    ]
  },
  'inv-4': {
    id: 'inv-4',
    status: 'completed',
    clusterId: 'balogun-textiles',
    name: 'Balogun Textiles (Dec 2024 Cycle)',
    amountInvested: 100000,
    return: 25000,
    returnPercentage: 25,
    cycleStartDate: '2024-12-01',
    cycleEndDate: '2024-12-31',
    clusterSnapshot: {
        totalPool: 12500000,
        participants: 150,
        tradersFunded: 8,
    },
    roiData: Array.from({length: 30}, (_, i) => ({ date: `Dec ${i+1}`, earnings: (i+1) * (25000/30) })),
    recentCredits: [
        { date: 'Dec 31, 2024', amount: 833.33, type: 'Final ROI' },
        { date: 'Dec 30, 2024', amount: 833.33, type: 'Daily ROI' },
        { date: 'Dec 29, 2024', amount: 833.33, type: 'Daily ROI' },
    ]
  }
};
