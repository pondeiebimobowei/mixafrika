import type { ILoanAccount } from "../../../../../packages/shared/src/types/loan-account.js";
import type { StateCreator } from "zustand"

export interface LoanAccount {
    loan_account: ILoanAccount | null,
    set_loan_account: ({ loan_account}: { loan_account: ILoanAccount}) =>void
}

export const createLoanAccount: StateCreator<
LoanAccount,
[],
[],
LoanAccount
> = (set) => ({
    loan_account: null,
    set_loan_account: ({ loan_account }) => {
        set({ loan_account })
    }  
})