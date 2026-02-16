import { Module } from '@nestjs/common';
import { LoanAccountService } from './loan_account.service';
import { LoanAccountController } from './loan_account.controller';
import { LoanAccountHistoryModule } from 'src/loan_history/loan_history.module';

@Module({
  providers: [LoanAccountService],
  controllers: [LoanAccountController],
  imports: [LoanAccountHistoryModule]
})
export class LoanAccountModule {}
