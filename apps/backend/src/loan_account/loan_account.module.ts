import { Module } from '@nestjs/common';
import { LoanAccountService } from './loan_account.service';
import { LoanAccountController } from './loan_account.controller';

@Module({
  providers: [LoanAccountService],
  controllers: [LoanAccountController]
})
export class LoanAccountModule {}
