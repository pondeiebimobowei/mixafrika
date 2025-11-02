import { Injectable } from '@nestjs/common';
import { Wallet } from 'src/database/models/wallet.model';

@Injectable()
export class WalletService {
  async handleGethWalletBalances(user_id:string) {
    await Wallet.increment('amount', { by: 100, where: { user_id } })
    await Wallet.increment('total_portfolio', { by: 3, where: { user_id } })

    const wallet = await Wallet.findOrCreate({ where: { user_id } });

    return {
        success: true,
        data: wallet[0],
        message: "Wallet balance retrieved successfully"
    };
  }

  async handleFundWallet() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleWithdrawFromWallet() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
