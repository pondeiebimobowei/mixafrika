import { IRepaymentHistory } from "@shared/shared/src/types/repayment-history";
import { v4 as uuidv4 } from 'uuid';

export const mockLoanRepaySeed: (response) => Promise<IRepaymentHistory[]> =( async (response: { id: string }[]) => {
    const loan_account_id = response.map((u) => u.id)
    return [
        {
            id: uuidv4(),
            loan_account_id: loan_account_id[0],
            status: 'paid',
            amount: 0,
            createdAt: "2025-11-12T16:13:42.425Z",
            updatedAt: "2025-11-12T16:13:42.425Z",
        }
    ]
})