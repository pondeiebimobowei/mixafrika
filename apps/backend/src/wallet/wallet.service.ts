import { Injectable } from '@nestjs/common';
import { Wallet } from 'src/database/models/wallet.model';
import { Transaction } from 'src/database/models/transaction.model';
import { Status, Types } from '@shared/shared/src/enums';

@Injectable()
export class WalletService {
  async handleGethWalletBalances(user_id: string) {

    const wallet = await Wallet.findOne({ where: { user_id } });

    return {
      success: true,
      data: wallet,
      message: "Wallet balance retrieved successfully"
    };
  }

  async handleFundWallet(user_id: string, amount: number) {

    const wallet = await Wallet.increment("amount", { by: amount, where: { user_id } });

    const transaction = await Transaction.create({
      user_id,
      type: Types.DEPOSIT,
      status: Status.COMPLETED,
      title: 'Wallet Funding',
      amount: amount,
      category: 'Funding',
    });

    return {
      success: true,
      message: 'Wallet funded successfully',
      data: { wallet, transaction },
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
