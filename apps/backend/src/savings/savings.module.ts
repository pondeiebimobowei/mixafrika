import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  providers: [SavingsService],
  controllers: [SavingsController],
  imports: [WalletModule]
})
export class SavingsModule { }
