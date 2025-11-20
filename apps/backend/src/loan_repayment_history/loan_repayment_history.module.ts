import { Module } from '@nestjs/common';
import { LoanRepaymentHistoryService } from './loan_repayment_history.service';
import { LoanRepaymentHistoryController } from './loan_repayment_history.controller';

@Module({
  providers: [LoanRepaymentHistoryService],
  controllers: [LoanRepaymentHistoryController]
})
export class LoanRepaymentHistoryModule {}
