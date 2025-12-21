import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { WalletModule } from '../wallet/wallet.module';
import { SavingsHistoryModule } from 'src/savings_history/savings_history.module';

@Module({
  providers: [SavingsService],
  controllers: [SavingsController],
  imports: [WalletModule, SavingsHistoryModule]
})
export class SavingsModule { }
