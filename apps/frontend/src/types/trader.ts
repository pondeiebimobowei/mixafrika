
export interface SavingsItem {
    id: number;
    date: string;
    amount: number;
    type: 'manual' | 'auto';
}

export type RepaymentStatus = 'Paid' | 'Late' | 'Paid (Late)';

export type Repayment = {
    id: string;
    date: string;
    amount: number;
    status: RepaymentStatus;
};

export type UploadedFilesState = {
    [key: string]: File | null;
};

export type SavingsType = 'manual' | 'auto';

export interface TraderProfile {
    businessName: string;
    phoneNumber: string;
    address: string;
    businessType: string;
    walletBalance: number;
    totalRepayment: number;
    interestRate: number;
}
