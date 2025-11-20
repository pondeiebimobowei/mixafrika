import { Module } from '@nestjs/common';
import { LoanService } from './loan_history.service';
import { LoanController } from './loan_history.controller';

@Module({
  providers: [LoanService],
  controllers: [LoanController],
})
export class LoanModule {}
