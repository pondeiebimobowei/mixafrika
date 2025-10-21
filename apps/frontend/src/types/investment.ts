
export interface RoiData {
    date: string;
    earnings: number;
}

export interface RecentCredit {
    date: string;
    amount: number;
    type: string;
}

export interface ClusterSnapshot {
    totalPool: number;
    participants: number;
    tradersFunded: number;
}

export type Investment = {
  id: string;
  clusterId: string;
  name: string;
  amountInvested: number;
  status: 'active' | 'completed';
  currentValue?: number;
  cycleProgress?: number;
  cycleTotalDays?: number;
  cycleStartDate?: string;
  roiData?: RoiData[];
  recentCredits?: RecentCredit[];
  return?: number;
  returnPercentage?: number;
  cycleEndDate?: string;
  clusterSnapshot?: ClusterSnapshot;
  cycleEnds?: string;
  date?: string;
};
