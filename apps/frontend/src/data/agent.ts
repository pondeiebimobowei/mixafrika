
import type { IuserWithBusiness, IuserWithBusinessWithTransactions, } from '../../../../packages/shared/src/types/user';
import type { ITransactionWithUser } from '../../../../packages/shared/src/types/transaction';
import { Users, Repeat, FileText, Wallet } from 'lucide-react';

export const agentQuickActions = [
    { label: 'Traders', icon: Users, href: '/agent/traders' },
    { label: 'Repayments', icon: Repeat, href: '/agent/repayments' },
    { label: 'Reports', icon: FileText, href: '/agent/reports' },
    { label: 'Wallet', icon: Wallet, href: '/agent/wallet' },
];

export const traders: Partial<IuserWithBusiness>[] = [
    {
        id: 'trader-1',
        first_name: 'Aunty Funke',
        image: 'https://picsum.photos/seed/401/150/150',
        business: {
            type: 'Textiles & Apparel',
            address: '',
            name: '',
            phone: '',
            user_id: ''

        },
        trader: {
            last_activity: '',
            experience: '',
            rating: 0,
            status: 'active',
            stats: {
                amount_due: 0,
                days_over_due: 1,
                loan_amount: 500000,
                repayment_progress: 350000,
                total_repayment: 575000,
            },
            notes: [],
        },
        credit_score: 720,
        // status: 'Active',
    },
    {
        id: 'trader-2',
        first_name: 'Idris Bello',
        image: 'https://picsum.photos/seed/402/150/150',
        business: {
            type: 'Textiles & Apparel',
            address: '',
            name: '',
            phone: '',
            user_id: ''

        },
        trader: {
            last_activity: '',
            experience: '',
            rating: 0,
            status: 'active',
            stats: {
                amount_due: 0,
                days_over_due: 1,
                loan_amount: 300000,
                repayment_progress: 280000,
                total_repayment: 345000,
            },
            notes: [],
        },
        credit_score: 780,
        // status: 'Active',
    },
    {
        id: 'trader-3',
        first_name: 'Mr. Ebuka',
        image: 'https://picsum.photos/seed/403/150/150',
        business: {
            type: 'Consumer Electronics',
            address: '',
            name: '',
            phone: '',
            user_id: ''

        },
        trader: {
            last_activity: '',
            experience: '',
            rating: 0,
            status: 'active',
            stats: {
                amount_due: 0,
                days_over_due: 1,
                loan_amount: 1200000,
                repayment_progress: 400000,
                total_repayment: 1500000,
            },
            notes: [],
        },
        credit_score: 650,
        // status: 'Defaulted',
    },
    {
        id: 'trader-4',
        first_name: 'Chinaza Okoro',
        image: 'https://picsum.photos/seed/404/150/150',
        business: {
            type: 'Consumer Electronics',
            address: '',
            name: '',
            phone: '',
            user_id: ''

        },
        trader: {
            last_activity: '',
            experience: '',
            rating: 0,
            status: 'active',
            stats: {
                amount_due: 0,
                days_over_due: 1,
                loan_amount: 750000,
                repayment_progress: 100000,
                total_repayment: 937500,
            },
            notes: [],
        },
        credit_score: 690,
        // status: 'Active',
    },
    {
        id: 'trader-5',
        first_name: 'New Applicant',
        image: 'https://picsum.photos/seed/409/150/150',
        business: {
            type: 'Agriculture',
            address: '',
            name: '',
            phone: '',
            user_id: ''

        },
        trader: {
            last_activity: '',
            experience: '',
            rating: 0,
            status: 'active',
            stats: {
                amount_due: 0,
                days_over_due: 1,
                loan_amount: 250000,
                repayment_progress: 0,
                total_repayment: 312500,
            },
            notes: [],
        },
        credit_score: 0,
        // status: 'Pending',
    },
];

export const traderDetailsData: { [key: string]: IuserWithBusinessWithTransactions } = {
    'trader-1': {
        ...traders[0],
        createdAt: '2023-01-15',
        business: {
            address: '123 Balogun Market, Lagos',
            phone: '08012345678',
            name: '',
            type: '',
            user_id: '',
        },
        image: '',
        credit_score: 0,
        credit_score_status: '',
        email: '',
        first_name: '',
        is_email_verified: true,
        is_verified: true,
        last_name: '',
        password: '',
        role: 'trader',
        trader: {
            experience: '',
            rating: 0,
            stats: {
                amount_due: 0,
                days_over_due: 0,
                loan_amount: 0,
                repayment_progress: 0,
                total_repayment: 0
            },
            status:'active',
            last_activity: 'Repayment of ₦5,500 made 2 hours ago',
            notes: [
                { id: 'n1', createdAt: '2024-03-20', user: { first_name: 'Agent Smith' }, note: 'Consistently pays on time. Good candidate for loan top-up.' }
            ]
        },
        transactions: [
            { id: 't1', category: '', title: '', user_id: '', createdAt: '2024-04-15', type: 'repayment', amount: 5500, status: 'completed' },
            { id: 't2', category: '', title: '', user_id: '', createdAt: '2024-04-14', type: 'repayment', amount: 5500, status: 'completed' },
            { id: 't3', category: '', title: '', user_id: '', createdAt: '2024-01-15', type: 'disbursement', amount: 500000, status: 'completed' },
        ],
    },
     'trader-3': {
        ...traders[2],
        createdAt: '2022-11-01',
        business: {
            address: 'Shop 45, Alaba International Market, Lagos',
            phone: '09087654321',
            name: '',
            type: '',
            user_id: '',
        },
        image: '',
        credit_score: 0,
        credit_score_status: '',
        email: '',
        first_name: '',
        is_email_verified: true,
        is_verified: true,
        last_name: '',
        password: '',
        role: 'trader',
        trader: {
            experience: '',
            rating: 0,
            stats: {
                amount_due: 0,
                days_over_due: 0,
                loan_amount: 0,
                repayment_progress: 0,
                total_repayment: 0
            },
            status:'active',
            last_activity: 'Missed repayment of ₦12,000 on 2024-04-10',
            notes: [
                { id: 'n1', createdAt: '2024-04-11', user: { first_name: 'Agent Smith' }, note: 'Multiple missed payments. High risk of default. Monitoring closely.' },
                { id: 'n2', createdAt: '2024-02-05', user: { first_name: 'Agent Smith' }, note: 'Reported drop in sales due to market conditions.' }
            ]
        },
        transactions: [
            { id: 't1', category: '', title: '', user_id: '', createdAt: '2024-04-05', type: 'repayment', amount: 12000, status: 'completed' },
            { id: 't2', category: '', title: '', user_id: '', createdAt: '2024-03-15', type: 'repayment', amount: 12000, status: 'pending' },
            { id: 't3', category: '', title: '', user_id: '', createdAt: '2022-11-01', type: 'disbursement', amount: 1200000, status: 'completed' },
        ],
    },
    // Add other trader details as needed
};

// Add default data for other traders
traders.forEach(trader => {
    if (!traderDetailsData[trader?.id || 0]) {
        traderDetailsData['ed'] = {
            ...trader,
            credit_score: 0,
            credit_score_status: '',
            email: '',
            first_name: '',
            image: '',
            is_email_verified: true,
            is_verified: true,
            password: '',
            role: 'trader',
            user_name: '',
            last_name: '',

            createdAt: '2023-05-10',
            business: {
                address: 'N/A',
                name: '',
                phone: '',
                type: '',
                user_id: ''
            },
            trader: {
                experience: '',
                last_activity: 'No recent activity',
                rating: 0,
                stats: {
                    amount_due: 0,
                    days_over_due: 0,
                    loan_amount: 0,
                    repayment_progress: 0,
                    total_repayment: 0
                },
                status: 'active',
                notes: []
            },
            transactions: [],
        };
    }
});

interface initialAgentRepayments{
    id: string;
    traderId: string;
    traderName: string;
    traderAvatar: string;
    amount: number;
    date: string;
    status: string;
}

export const initialAgentRepayments: ITransactionWithUser[] = [
    { id: 'ar-today', type: "repayment", category: "loan", title: 'Nirsal Loan', user_id: 'trader-1', user: {first_name: 'Aunty Funke', image: 'https://picsum.photos/seed/401/150/150'}, amount: 5500, createdAt: new Date().toISOString(), status: 'paid' },
    { id: 'ar1', type: "repayment", category: "loan", title: 'Nirsal Loan', user_id: 'trader-1', user: {first_name: 'Aunty Funke', image: 'https://picsum.photos/seed/401/150/150'}, amount: 5500, createdAt: '2024-04-15', status: 'paid' },
    { id: 'ar2', type: "repayment", category: "loan", title: 'Nirsal Loan', user_id: 'trader-2', user: {first_name: 'Idris Bello', image: 'https://picsum.photos/seed/402/150/150'}, amount: 4000, createdAt: '2024-04-15', status: 'paid' },
    { id: 'ar3', type: "repayment", category: "loan", title: 'Nirsal Loan', user_id: 'trader-3', user: {first_name: 'Mr. Ebuka', image: 'https://picsum.photos/seed/403/150/150'}, amount: 12000, createdAt: '2024-04-14', status: 'missed' },
    { id: 'ar4', type: "repayment", category: "loan", title: 'Nirsal Loan', user_id: 'trader-4', user: {first_name: 'Chinaza Okoro', image: 'https://picsum.photos/seed/404/150/150'}, amount: 8000, createdAt: '2024-04-14', status: 'paid' },
    { id: 'ar5', type: "repayment", category: "loan", title: 'Nirsal Loan', user_id: 'trader-1', user: {first_name: 'Aunty Funke', image: 'https://picsum.photos/seed/401/150/150'}, amount: 5500, createdAt: '2024-04-13', status: 'paid (late)' },
    { id: 'ar6', type: "repayment", category: "loan", title: 'Nirsal Loan', user_id: 'trader-2', user: {first_name: 'Idris Bello', image: 'https://picsum.photos/seed/402/150/150'}, amount: 4000, createdAt: '2024-04-13', status: 'paid' },
];

export const agentPortfolioBreakdown = {
    active: 1000000,
    pending: 250000,
    topTraders: [
        traders.find(t => t.id === 'trader-2'),
        traders.find(t => t.id === 'trader-1'),
        traders.find(t => t.id === 'trader-4'),
    ]
}

export const todaysDefaulters = [
    { traderId: 'trader-3', traderName: 'Mr. Ebuka', traderAvatar: 'https://picsum.photos/seed/403/150/150', amountDue: 12000, daysOverdue: 1, businessType: 'Consumer Electronics' },
    { traderId: 'trader-4', traderName: 'Chinaza Okoro', traderAvatar: 'https://picsum.photos/seed/404/150/150', amountDue: 8000, daysOverdue: 1, businessType: 'Consumer Electronics' },
    { traderId: 'trader-2', traderName: 'Idris Bello', traderAvatar: 'https://picsum.photos/seed/402/150/150', amountDue: 4000, daysOverdue: 1, businessType: 'Textiles & Apparel' },
];
    
