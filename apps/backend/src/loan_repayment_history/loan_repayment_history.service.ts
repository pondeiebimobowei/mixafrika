import { Injectable } from '@nestjs/common';
import { LoanStatus } from '@shared/shared/src/enums';
import { LoanAccount } from 'src/database/models/loan-account.model';
import { RepaymentHistory } from 'src/database/models/repayment-history.model';

@Injectable()
export class LoanRepaymentHistoryService {

    async handleGetLoanRepaymentHistory(user_id: string){

        const loan_acount = await LoanAccount.findOne({ where: { user_id, status: LoanStatus.APPROVED}})

        const history = await RepaymentHistory.findAll({ where: { loan_account_id: loan_acount?.id }})

        return { 
            success: true,
            message: 'Loan Repayment History found!',
            data: history
        }

    }
}
