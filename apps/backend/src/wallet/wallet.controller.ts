import { Controller, Get, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';
import { IJwtToken } from '@shared/shared/src/types/jwt';

@Controller('v1/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
  ) { }

  @Get()
  getWalletBalance(@ParsedToken() user: User) {
    return this.walletService.handleGethWalletBalances(user.id);
  }

  @Get('transactions')
  getWalletTransactions() {
    return this.transactionService.handleGetWalletTransactions();
  }

  @Post()
  fundWallet(@Body() body: { amount: number }, @ParsedToken() jwt: IJwtToken) {
    return this.walletService.handleFundWallet(jwt.id, body.amount);
  }

  @Post('withdraw')
  withdrawWallet() {
    return this.walletService.handleWithdrawFromWallet();
  }
}
