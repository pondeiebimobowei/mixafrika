
export interface WeeklyPoolData {
  week: string;
  volume: [number, number, number, number]; // open, high, low, close
}

export type ChartType = 'bar' | 'area';
export type Timeframe = '1H' | '1D' | '1W' | '1M' | '3M' | '1Y' | 'All';
