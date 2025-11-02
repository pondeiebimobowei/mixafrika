import type { StateCreator } from "zustand";
import type { ILoanHistory } from "../../../../../packages/shared/src/types/loan-history";

export interface LoanHistory {
    history: ILoanHistory[],
    set_history: ({ history } : { history: ILoanHistory[]}) => void
}

export const createLoanHistory: StateCreator<
LoanHistory,
[],
[],
LoanHistory
> = (set) => ( {
    history: [],
    set_history: ({ history }) => {
        set({ history })
    }

})