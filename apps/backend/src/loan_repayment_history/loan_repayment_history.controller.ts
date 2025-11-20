import { Body, Controller, Get, Query } from '@nestjs/common';
import { LoanRepaymentHistoryService } from './loan_repayment_history.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';

@Controller('v1/loan-repayment-history')
export class LoanRepaymentHistoryController {
    constructor( private readonly loanRepaymentHistoryService: LoanRepaymentHistoryService){}

    @Get()
    getLoanRepaymentHistory(
      @ParsedToken() jwt: IJwtToken
    ){
        return this.loanRepaymentHistoryService.handleGetLoanRepaymentHistory(jwt.id)
    }
}
