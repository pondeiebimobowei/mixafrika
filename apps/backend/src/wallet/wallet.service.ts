import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletService {
  async handleGethWalletBalances() {
    return {
      success: true,
      message: '',
      data: [],
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
