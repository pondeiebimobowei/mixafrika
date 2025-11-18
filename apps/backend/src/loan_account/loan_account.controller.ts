import { Controller, Get } from '@nestjs/common';
import { LoanAccountService } from './loan_account.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';

@Controller('v1/loan-account')
export class LoanAccountController {
    constructor( private readonly loan_account_service: LoanAccountService){}
    @Get()
    handleGetLoanAccount(
        @ParsedToken() jwt: IJwtToken
    ){
        return this.loan_account_service.getLoanAccount(jwt.id)
    }
}
