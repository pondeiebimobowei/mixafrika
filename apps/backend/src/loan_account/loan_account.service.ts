import { HttpException, Injectable } from '@nestjs/common';
import { LoanAccount } from 'src/database/models/loan-account.model';
import { Wallet } from 'src/database/models/wallet.model';
import { Transaction } from 'src/database/models/transaction.model';
import { RepaymentHistory } from 'src/database/models/repayment-history.model';
import { LoanStatus, RepaymentStatus, Types, Status } from '@shared/shared/src/enums';

@Injectable()
export class LoanAccountService {

    async getLoanAccount(user_id: string,) {
        const loan_account = await LoanAccount.findOne({ where: { user_id } })
        return {
            success: true,
            message: "Loan account record found!",
            data: loan_account
        }
    }

    async handleRepayment(user_id: string, amount: number) {
        const loan_account = await LoanAccount.findOne({ where: { user_id, status: LoanStatus.APPROVED } });
        if (!loan_account) {
            throw new HttpException({ success: false, message: "No Active Loan Found!"}, 500 );
        }

        const wallet = await Wallet.findOne({ where: { user_id } });
        
        if (Number(wallet?.dataValues.amount) < Number(amount)) {
            throw new HttpException({ success: false, message: "Insufficient Funds"}, 500 );
        }

        await Wallet.decrement( 'amount', { by: amount, where: { user_id } });

        await LoanAccount.increment( 'repaid_amount', {  by: amount, where: { user_id } });

        await RepaymentHistory.create({
            loan_account_id: loan_account.id,
            amount: amount,
            status: RepaymentStatus.PAID,
        });

        await Transaction.create({
            user_id,
            type: Types.REPAYMENT,
            status: Status.COMPLETED,
            title: 'Loan Repayment',
            amount,
            category: 'Loan',
        });

        //TODO: implement update loan account status to completed, if fully repaid

        return {
            success: true,
            message: 'Repayment successful',
            data: loan_account,
        };
    }
}
