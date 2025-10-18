import { Controller, Get, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Controller('v1/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get()
  getWalletBalance() {
    return this.walletService.handleGethWalletBalances();
  }

  @Get('transactions')
  getWalletTransactions() {
    return this.transactionService.handleGetWalletTransactions();
  }

  @Post('fund')
  fundWallet() {
    return this.walletService.handleFundWallet();
  }

  @Post('withdraw')
  withdrawWallet() {
    return this.walletService.handleWithdrawFromWallet();
  }
}
