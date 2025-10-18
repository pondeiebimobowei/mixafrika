import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [TransactionModule],
})
export class WalletModule {}
