import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LoanAccountService } from './loan_account.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';
import { LoanHistoryService } from 'src/loan_history/loan_history.service';

@Controller('v1/loan-account')
export class LoanAccountController {
    constructor(
        private readonly loan_account_service: LoanAccountService,
        private readonly loan_account_history_service: LoanHistoryService
    ) { }
    @Get()
    handleGetLoanAccount(
        @ParsedToken() jwt: IJwtToken
    ) {
        return this.loan_account_service.getLoanAccount(jwt.id)
    }

    @Post('repay')
    handleRepayment(
        @ParsedToken() jwt: IJwtToken,
        @Body() body: { days: number }
    ) {
        return this.loan_account_service.handleRepayment(jwt.id, body.days);
    }

    @Get('transactions/:loan_id')
    handleGetLoanHistory(
        @Param('loan_id') loan_account_id: string
    ) {
        return this.loan_account_history_service.handleGetLoanHistory(loan_account_id);
    }
}
