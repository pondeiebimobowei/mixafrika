import { Injectable } from '@nestjs/common';
import { LoanHistory } from 'src/database/models/loan-history.model';
import { RepaymentHistory } from 'src/database/models/repayment-history.model';

@Injectable()
export class LoanHistoryService {
    async handleGetLoanHistory(loan_account_id: string) {
        const loan_history = await RepaymentHistory.findAll({
            where: {
             loan_account_id 
            },
        });
        return {
            success: true,
            message: 'Loan history retrieved successfully',
            data: loan_history,
        };
    }
}
