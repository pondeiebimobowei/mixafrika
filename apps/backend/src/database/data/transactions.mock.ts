import { ITransaction } from "@shared/shared/src/types/transaction";
import { v4 as uuidv4 } from 'uuid';

export const mockTransactionsSeed: (response) => Promise<ITransaction[]> =( async (response: { id: string }[]) => {
    const user_id = response.map((u) => u.id)
      const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    return [
        {
            id: uuidv4(),
            amount: randomNumber(5000,450000),
            category: "",
            status: 'pending',
            title: 'Daily ROI',
            type: 'deposit',
            user_id: user_id[0],
            createdAt: "2025-11-4T16:13:42.425Z",
            updatedAt: "2025-11-4T16:13:42.425Z",
        },
        {
            id: uuidv4(),
            amount: randomNumber(5000,450000),
            category: "",
            status: 'completed',
            title: 'Withdrawal',
            type: 'withdrawal',
            user_id: user_id[0],
            createdAt: "2025-11-4T16:13:42.425Z",
            updatedAt: "2025-11-4T16:13:42.425Z",
        },
        {
            id: uuidv4(),
            amount: randomNumber(5000,450000),
            category: "",
            status: 'failed',
            title: 'Investment',
            type: 'investment',
            user_id: user_id[0],
            createdAt: "2025-11-4T16:13:42.425Z",
            updatedAt: "2025-11-4T16:13:42.425Z",
        },
        {
            id: uuidv4(),
            amount: randomNumber(5000,450000),
            category: "",
            status: 'failed',
            title: 'Daily ROI',
            type: 'disbursement',
            user_id: user_id[0],
            createdAt: "2025-11-4T16:13:42.425Z",
            updatedAt: "2025-11-4T16:13:42.425Z",
        },
        {
            id: uuidv4(),
            amount: randomNumber(5000,450000),
            category: "",
            status: 'pending',
            title: 'Repay Loan',
            type: 'repayment',
            user_id: user_id[0],
            createdAt: "2025-11-4T16:13:42.425Z",
            updatedAt: "2025-11-4T16:13:42.425Z",
        },
        {
            id: uuidv4(),
            amount: randomNumber(5000,450000),
            category: "",
            status: 'pending',
            title: 'Recieved Funding',
            type: 'loan',
            user_id: user_id[0],
            createdAt: "2025-11-4T16:13:42.425Z",
            updatedAt: "2025-11-4T16:13:42.425Z",
        },
    ]
})