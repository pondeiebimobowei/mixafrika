import { Module } from '@nestjs/common';
import { SavingsHistoryController } from './savings_history.controller';
import { SavingsHistoryService } from './savings_history.service';

@Module({
  controllers: [SavingsHistoryController],
  providers: [SavingsHistoryService],
  exports: [SavingsHistoryService]
})
export class SavingsHistoryModule {}
