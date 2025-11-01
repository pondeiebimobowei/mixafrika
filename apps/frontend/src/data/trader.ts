
import type { SavingsItem, Repayment, TraderProfile } from '@/types';
import { FileCheck, UserCheck, FileText, FileSpreadsheet, Repeat, PiggyBank, User } from 'lucide-react';

export const DURATION_RATES: { [key: string]: number } = {
    '30': 0.15, // 15%
    '60': 0.25, // 25%
    '90': 0.35, // 35%
};

export const requiredDocs = [
    { id: 'businessReg', name: "Business Registration", icon: FileCheck },
    { id: 'ownerId', name: "Valid ID of Owner", icon: UserCheck },
    { id: 'proofOfAddress', name: "Proof of Address", icon: FileText },
    { id: 'statement', name: "Statement of Account", icon: FileSpreadsheet },
];

export const mockSavingsHistory: SavingsItem[] = [
    { id: 1, date: 'Today', amount: 1000, type: 'manual' },
    { id: 2, date: 'Yesterday', amount: 1000, type: 'auto' },
    { id: 3, date: '2 days ago', amount: 1000, type: 'auto' },
    { id: 4, date: '3 days ago', amount: 1000, type: 'manual' },
    { id: 5, date: '4 days ago', amount: 1000, type: 'auto' },
];

const maturityDate = new Date();
maturityDate.setDate(new Date().getDate() + 12);

export const maturityConfig = {
    startDate: new Date(new Date().getFullYear(), 0, 1),
    maturityDate: maturityDate,
};

export const initialRepaymentHistory: Repayment[] = [
    { id: '1', date: '2024-04-15', amount: 5500, status: 'Paid' },
    { id: '2', date: '2024-04-14', amount: 5500, status: 'Late' },
    { id: '3', date: '2024-04-13', amount: 5500, status: 'Paid' },
    { id: '4', date: '2024-04-12', amount: 5500, status: 'Paid' },
    { id: '5', date: '2024-04-11', amount: 5500, status: 'Late' },
    { id: '6', date: '2024-04-10', amount: 5500, status: 'Paid' },
];

export const upcomingRepayment = {
    amount: 5500,
    dueDate: 'Tomorrow'
};

export const walletBalance = 241124.00;


export const newsItems = [
    { id: 1, title: "Tips for managing your daily cash flow", category: "Financial Tips" },
    { id: 2, title: "New feature: Instant withdrawal to bank account", category: "Product Update" },
    { id: 3, title: "Meet our top performing trader of the month!", category: "Community" },
];

export const traderQuickActions = [
    { label: 'Apply', icon: FileText, href: '/trader/apply' },
    { label: 'Repayments', icon: Repeat, href: '/trader/repayments' },
    { label: 'Esusu', icon: PiggyBank, href: '/trader/esusu' },
    { label: 'Profile', icon: User, href: '/trader/profile' },
];

export const mockTraderData = {
    businessName: 'Aunty Funke',
    loanAmount: 500000,
    repaymentProgress: 350000,
    walletBalance: 75000,
    investorCount: 12,
    creditScore: 720,
    interestRate: 15,
    totalRepayment: 575000,
    nextPaymentDueDate: 'Tomorrow',
    nextPaymentAmount: 5500,
    loanDuration: '90 days',
    investors: [
        { name: "Tunde O.", avatar: "https://picsum.photos/seed/101/150/150" },
        { name: "Aisha B.", avatar: "https://picsum.photos/seed/102/150/150" },
        { name: "Emeka K.", avatar: "https://picsum.photos/seed/103/150/150" },
    ]
};

export const pastLoans = [
    { id: 1, amount: 200000, date: 'Dec 2023', status: 'Repaid', cluster: 'Balogun Textiles' },
    { id: 2, amount: 150000, date: 'Oct 2023', status: 'Repaid', cluster: 'Balogun Textiles' },
    { id: 3, amount: 300000, date: 'July 2023', status: 'Repaid', cluster: 'Balogun Textiles' },
];

export const creditScoreChartData: { [key: string] : { name:string, score: number}[] } = {
    '3M': Array.from({ length: 12 }, (_, i) => ({ name: `W${i+1}`, score: 680 + Math.floor(Math.random() * 40) })),
    '6M': Array.from({ length: 6 }, (_, i) => ({ name: `M${i+1}`, score: 650 + Math.floor(Math.random() * 70) })),
    '1Y': Array.from({ length: 12 }, (_, i) => ({ name: `M${i+1}`, score: 620 + Math.floor(Math.random() * 100) })),
    'All': Array.from({ length: 24 }, (_, i) => ({ name: `M${i+1}`, score: 600 + Math.floor(Math.random() * 120) })),
};

export const traderProfileData: TraderProfile = {
    businessName: 'Aunty Funke\'s Textiles',
    phoneNumber: '08012345678',
    address: '123, Balogun Market, Lagos',
    businessType: 'Textiles & Apparel',
    walletBalance: 75000,
    totalRepayment: 0,
    interestRate: 0,
};
