
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

export interface PastLoan {
    id: number;
    amount: number;
    date: string;
    status: 'Repaid';
    cluster: string;
}

export interface TraderData {
    business_name: string;
    avatar: string;
    loan_amount: number;
    repayment_progress: number;
    wallet_balance: number;
    investor_count: number;
    credit_score: number;
    interest_rate: number;
    total_repayment: number;
    next_payment_due_date: string;
    next_payment_amount: number;
    loan_duration: string;
    investors: { name: string, avatar: string }[];
    past_loans: PastLoan[];
}