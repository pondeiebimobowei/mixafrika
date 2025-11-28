import { HttpException, Injectable } from '@nestjs/common';
import { LoanAccount } from 'src/database/models/loan-account.model';
import { Wallet } from 'src/database/models/wallet.model';
import { Transaction } from 'src/database/models/transaction.model';
import { RepaymentHistory } from 'src/database/models/repayment-history.model';
import { LoanStatus, RepaymentStatus, Types, Status } from '@shared/shared/src/enums';
import Decimal from 'decimal.js';
import { FundingApplication } from 'src/database/models/funding_application';

@Injectable()
export class LoanAccountService {

    async getLoanAccount(user_id: string,) {
        const loan_account = await LoanAccount.findOne({ where: { user_id, status: LoanStatus.APPROVED } })
        return {
            success: true,
            message: "Loan account record found!",
            data: loan_account
        }
    }

    async handleCreate( user_id:string, application_id: string) {
        const application = await FundingApplication.findOne({ where: { id: application_id }})

        const loan_account = await LoanAccount.create({
            application_id,
            duration: Number(application?.dataValues.duration),
            interest_rate: 15,
            approvedAt: '2025-11-12T16:13:42.425Z',
            received_amount: Number(application?.dataValues.amount),
            repayment_amount: Number(application?.dataValues.amount) * 1.15,
            repaid_amount: 0,
            status: LoanStatus.APPROVED,
            user_id,
        })
        return {
            success: true,
            message: 'Created Succesfully',
            data: loan_account
        }
    }

    async handleRepayment(user_id: string, days: number) {

        const amount = await this.calculateDynamicRepayment(user_id, days);

        const wallet = await Wallet.findOne({ where: { user_id } });
        
        if (Number(wallet?.dataValues.amount) < Number(amount)) {
            throw new HttpException({ success: false, message: "Insufficient Funds"}, 500 );
        }

        await Wallet.decrement( 'amount', { by: amount, where: { user_id } });

        await LoanAccount.increment( 'repaid_amount', {  by: amount, where: { user_id } });

        let loan_account = await LoanAccount.findOne({ where: { user_id, status: LoanStatus.APPROVED } });


        if(Number(loan_account?.dataValues.repaid_amount) >= Number(loan_account?.dataValues.repayment_amount)) {
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

    async calculateDynamicRepayment(user_id: string, daysToPay: number): Promise<number> {
        const loan = await LoanAccount.findOne({ where: { user_id, status: LoanStatus.APPROVED } });
        if (!loan) throw new HttpException({ success: false, message: "No Active Loan Found!"}, 500 );
            
        const outstandingBalance = new Decimal(loan.dataValues.repayment_amount).minus(loan.dataValues.repaid_amount);
        const regularInstallment = new Decimal(loan.dataValues.repayment_amount).div(loan.dataValues.duration);
        const days = new Decimal(daysToPay);

        const calculatedAmount = regularInstallment.mul(days).toDecimalPlaces(2, Decimal.ROUND_DOWN);

        if (calculatedAmount.greaterThan(outstandingBalance)) {
            return outstandingBalance.toNumber();
        }
        
        const projectedBalance = outstandingBalance.sub(calculatedAmount);

        if (projectedBalance.lessThan(regularInstallment)) {
        return outstandingBalance.toNumber();
        }
        
        return calculatedAmount.toNumber(); 
    }
}
