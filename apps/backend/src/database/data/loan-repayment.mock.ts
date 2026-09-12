import { IRepaymentHistory } from '@mixafrica/shared';
import { v4 as uuidv4 } from 'uuid';
import { ITransaction } from '@mixafrica/shared';
import { ILoanAccount } from '@mixafrica/shared';

export const mockLoanRepaySeed: (response: ILoanAccount[], tx: ITransaction[]) => Promise<IRepaymentHistory[]> =( async (response: ILoanAccount[], tx: ITransaction[]) => {
    const loan_account_id = response.map((u) => u.id) as string[]
    return [
        {
            id: uuidv4(),
            transaction_id: tx[0].id as string,
            loan_account_id: loan_account_id[0],
            status: 'paid',
            amount: tx[0].amount,
            createdAt: "2025-11-12T16:13:42.425Z",
            updatedAt: "2025-11-12T16:13:42.425Z",
        }
    ]
})