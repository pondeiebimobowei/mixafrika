export const roles = {
    USER: "user",
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
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];

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