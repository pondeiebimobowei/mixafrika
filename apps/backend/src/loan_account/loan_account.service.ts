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
        let loan_account = await LoanAccount.findOne({ where: { user_id, status: LoanStatus.APPROVED } });
        if (!loan_account) {
            throw new HttpException({ success: false, message: "No Active Loan Found!"}, 500 );
        }

        const wallet = await Wallet.findOne({ where: { user_id } });
        
        if (Number(wallet?.dataValues.amount) < Number(amount)) {
            throw new HttpException({ success: false, message: "Insufficient Funds"}, 500 );
        }

        if(Number(amount) > Number(loan_account?.dataValues.repayment_amount - loan_account?.dataValues.repaid_amount)) {
            throw new HttpException({ success: false, message: `Max repayment amount is ${loan_account?.dataValues.repayment_amount - loan_account?.dataValues.repaid_amount}`}, 500 );
        }

        await Wallet.decrement( 'amount', { by: amount, where: { user_id } });

        await LoanAccount.increment( 'repaid_amount', {  by: amount, where: { user_id } });

        loan_account = await LoanAccount.findOne({ where: { user_id, status: LoanStatus.APPROVED } });


        if(Number(loan_account?.dataValues.repayment_amount) >= Number(loan_account?.dataValues.repayment_amount)) {
            await LoanAccount.update({ status: LoanStatus.COMPLETED }, { where: { user_id } });
        }

        await RepaymentHistory.create({
            loan_account_id: loan_account?.id as string,
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


        return {
            success: true,
            message: 'Repayment successful',
            data: loan_account,
        };
    }
}
