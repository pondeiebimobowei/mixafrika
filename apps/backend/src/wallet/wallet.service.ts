import { Injectable } from '@nestjs/common';
import { Wallet } from 'src/database/models/wallet.model';

@Injectable()
export class WalletService {
  async handleGethWalletBalances(user_id:string) {

    const wallet = await Wallet.findOne({ where: { user_id } });

    return {
        success: true,
        data: wallet,
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
