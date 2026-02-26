import { ITrader } from '@mixafrica/shared/types/trader';
import type { StateCreator } from 'zustand';

export interface TraderRecord {
  trader_record: ITrader | null;
  setTrader: ({ trader_record }: { trader_record: ITrader }) => void;
}

export const createTraderRecord: StateCreator<
  TraderRecord,
  [],
  [],
  TraderRecord
> = (set) => ({
  trader_record: traderProfiles,
  setTrader: ({ trader_record }) => {
    set({ trader_record });
  },
});

const traderSpecificData = [
  {
    loan_amount: 1500000,
    repayment_progress: 950000,
    wallet_balance: 75000,
    total_repayment: 1725000,
    interest_rate: 15,
    next_payment_amount: 5500,
    loan_duration: '90 days',
    business_name: "Aunty Funke's Textiles",
  },
  {
    loan_amount: 800000,
    repayment_progress: 250000,
    wallet_balance: 32000,
    total_repayment: 944000,
    interest_rate: 18,
    next_payment_amount: 8800,
    loan_duration: '60 days',
    business_name: 'Bello Electronics',
  },
  {
    loan_amount: 1200000,
    repayment_progress: 400000,
    wallet_balance: 15000,
    total_repayment: 1500000,
    interest_rate: 25,
    next_payment_amount: 12000,
    loan_duration: '90 days',
    business_name: "Mr. Ebuka's Gadgets",
  },
  {
    loan_amount: 250000,
    repayment_progress: 240000,
    wallet_balance: 150000,
    total_repayment: 280000,
    interest_rate: 12,
    next_payment_amount: 4500,
    loan_duration: '90 days',
    business_name: 'Okoro Imports',
  },
  {
    loan_amount: 0,
    repayment_progress: 0,
    wallet_balance: 10000,
    total_repayment: 0,
    interest_rate: 0,
    next_payment_amount: 0,
    loan_duration: 'N/A',
    business_name: 'New Trader Ventures',
  },
  {
    loan_amount: 0,
    repayment_progress: 0,
    wallet_balance: 5000,
    total_repayment: 0,
    interest_rate: 0,
    next_payment_amount: 0,
    loan_duration: 'N/A',
    business_name: 'My First Shop',
  },
  {
    loan_amount: 0,
    repayment_progress: 0,
    wallet_balance: 2500,
    total_repayment: 0,
    interest_rate: 0,
    next_payment_amount: 0,
    loan_duration: 'N/A',
    business_name: '',
  },
];

const randomIndex = Math.floor(Math.random() * traderSpecificData.length);

export const traderProfiles: ITrader = {
  stats: {
    loan_amount: traderSpecificData[randomIndex].loan_amount,
    amount_due: traderSpecificData[randomIndex].loan_amount,
    days_over_due: traderSpecificData[randomIndex].loan_amount,
    repayment_progress: traderSpecificData[randomIndex].repayment_progress,
    total_repayment: traderSpecificData[randomIndex].total_repayment,
  },
  experience: 'High',
  last_activity: 'Payment ',
  notes: [],
  rating: 2,
  status: 'active',
};
