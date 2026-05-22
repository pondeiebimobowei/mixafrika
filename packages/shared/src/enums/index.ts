export const roles = {
    TRADER: "trader",
    INVESTOR: "investor",
    AGENT: "agent",
    ADMIN: "admin",
    SUBADMIN: "subadmin"
} as const;

export type Roles = (typeof roles)[keyof typeof roles];

export const loanStatus = {
    PENDING: "pending",
    APPROVED: "approved",
    REPAID: "repaid",
    COMPLETED: 'completed'
} as const;

export type LoanStatus = (typeof loanStatus)[keyof typeof loanStatus];

export const duration = {
    THIRITY: 30,
    SIXTY: 60,
    NINETY: 90,

} as const;

export type Duration = (typeof duration)[keyof typeof duration];

export const sourceType = {
    BANK: 'bank',
    WALLET: 'wallet',
    CARD: 'card'
} as const;

export type SourceType = (typeof sourceType)[keyof typeof sourceType];

export const savingsFrequency = {
    MANUAL: 'manual',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    MARKET_DAY: 'market_day',
} as const;

export type SavingsFrequency = (typeof savingsFrequency)[keyof typeof savingsFrequency];

export const repaymentStatus = {
    PAID: "paid",
    "PAID (LATE)": "paid (late)",
    MISSED: "missed",
} as const;

export const cardType = {
    VISA: "visa",
    MASTERCARD: "mastercard",
    VERVE: "verve",
} as const;

export type CardType = (typeof cardType)[keyof typeof cardType];

export type RepaymentStatus = (typeof repaymentStatus)[keyof typeof repaymentStatus];

export const savingsType = {
    TARGET: 'target',
    FIXED: 'fixed',
    LOCKED: 'locked',
    GROUP: 'group',
    MIX: 'mix',
}

export type SavingsType = (typeof savingsType)[keyof typeof savingsType];

export const status = {
    ACTIVE: "active",
    DEFAULTED: "defaulted",
    FAILED: "failed",
    PENDING: "pending",
    COMPLETED: "completed",
} as const;

export type Status = (typeof status)[keyof typeof status];

export const types = {
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdrawal",
    DISBURSEMENT: "disbursement",
    INVESTMENT: "investment",
    LOAN: "loan",
    REPAYMENT: "repayment",
} as const;

export type Types = (typeof types)[keyof typeof types];

export const notificationType = {
    ...types,

    GOAL: "goal",
    SYSTEM: "system",
    INVESTMENT: "investment",
    FOLLOWING: "following",
} as const;

export type NotificationType = (typeof notificationType)[keyof typeof notificationType];

export const paymentStatus = {
    PENDING: "pending",
    SUCCESSFUL: "successful",
    FAILED: "failed",
} as const;

export type PaymentStatus = (typeof paymentStatus)[keyof typeof paymentStatus];

export const applicationStatus = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
} as const;

export type ApplicationStatus = (typeof applicationStatus)[keyof typeof applicationStatus];

export const verificationStatus = {
    PENDING: "pending",
    VERIFIED: "verified",
    UNVERIFIED: 'unverified',
    REJECTED: "rejected",
} as const;

export type VerificationStatus = (typeof verificationStatus)[keyof typeof verificationStatus];

export const salesStatus = {
    PENDING: "pending",
    VERIFIED: "verified",
    UNVERIFIED: 'unverified',
    REJECTED: "rejected",
} as const;

export type SalesStatus = (typeof salesStatus)[keyof typeof salesStatus];

export const transferStatus = {
    PENDING: "pending",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    FAILED: "failed",
} as const;

export type TransferStatus = (typeof transferStatus)[keyof typeof transferStatus];

export const syncStatus = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
} as const;

export type SyncStatus = (typeof syncStatus)[keyof typeof syncStatus];
