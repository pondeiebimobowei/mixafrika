import { Injectable } from '@nestjs/common';
import { LoanAccount } from 'src/database/models/loan-account.model';

@Injectable()
export class LoanAccountService {

    async getLoanAccount(user_id: string, ){
        const loan_account = await LoanAccount.findOne({ where: { user_id }})
        return {
            success: true,
            message: "Loan account record found!",
            data: loan_account
        }
    }
}
