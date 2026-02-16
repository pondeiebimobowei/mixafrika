import { Module } from '@nestjs/common';
import { LoanHistoryService } from './loan_history.service';
import { LoanHistoryController } from './loan_history.controller';

@Module({
  providers: [LoanHistoryService],
  controllers: [LoanHistoryController],
  exports: [LoanHistoryService]
})
export class LoanAccountHistoryModule {}
