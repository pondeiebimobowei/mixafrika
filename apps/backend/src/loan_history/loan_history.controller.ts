import { Controller, Get, Param } from '@nestjs/common';
import { LoanHistoryService } from './loan_history.service';

@Controller('v1/loan-history')
export class LoanHistoryController {
    constructor(private readonly loan_history_service: LoanHistoryService) { }
    @Get('transaction/:loan_id')
    handleGetLoanHistory(
        @Param('loan_id') loan_account_id: string
    ) {
        return this.loan_history_service.handleGetLoanHistory(loan_account_id);
    }
}
