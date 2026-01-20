export const roles = {
    TRADER: "trader",
    INVESTOR: "investor",
    AGENT: "agent",
    ADMIN: "admin",
    SUBADMIN: "subadmin"
} as const;

export type Roles = (typeof roles)[keyof typeof roles];

export const LoanStatus = {
    PENDING: "pending",
    APPROVED: "approved",
    REPAID: "repaid",
    COMPLETED: 'completed'
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];

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

export const RepaymentStatus = {
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

export type RepaymentStatus = (typeof RepaymentStatus)[keyof typeof RepaymentStatus];

export const savingsType = {
    TARGET: 'target',
    FIXED: 'fixed',
    LOCKED: 'locked',
    GROUP: 'group',
    MIX: 'mix',
}

export type SavingsType = (typeof savingsType)[keyof typeof savingsType];

export const Status = {
    ACTIVE: "active",
    DEFAULTED: "defaulted",
    FAILED: "failed",
    PENDING: "pending",
    COMPLETED: "completed",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Types = {
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdrawal",
    DISBURSEMENT: "disbursement",
    INVESTMENT: "investment",
    LOAN: "loan",
    REPAYMENT: "repayment",
} as const;

export type Types = (typeof Types)[keyof typeof Types];

export const NotificationType = {
    ...Types,

    GOAL: "goal",
    SYSTEM: "system",
    INVESTMENT: "investment",
    FOLLOWING: "following",
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const PaymentStatus = {
    PENDING: "pending",
    SUCCESSFUL: "successful",
    FAILED: "failed",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const ApplicationStatus = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const VerificationStatus = {
    PENDING: "pending",
    VERIFIED: "verified",
    UNVERIFIED: 'unverified',
    REJECTED: "rejected",
} as const;

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];