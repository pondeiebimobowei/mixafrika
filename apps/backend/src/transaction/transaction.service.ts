import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  async handleGetTransactions() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleGetTransactionById() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleGetWalletTransactions() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
