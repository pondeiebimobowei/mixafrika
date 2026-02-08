import { IRepaymentHistory } from "@shared/shared/src/types/repayment-history";
import { v4 as uuidv4 } from 'uuid';
import { ITransaction } from "@shared/shared/src/types/transaction";
import { ILoanAccount } from "@shared/shared/src/types/loan-account";

export const mockLoanRepaySeed: (response: ILoanAccount[], tx: ITransaction[]) => Promise<IRepaymentHistory[]> =( async (response: ILoanAccount[], tx: ITransaction[]) => {
    const loan_account_id = response.map((u) => u.id) as string[]
    return [
        {
            id: uuidv4(),
            transaction_id: tx[0].id as string,
            loan_account_id: loan_account_id[0],
            status: 'paid',
            amount: 0,
            createdAt: "2025-11-12T16:13:42.425Z",
            updatedAt: "2025-11-12T16:13:42.425Z",
        }
    ]
})