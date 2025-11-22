import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/database/models/transaction.model';

@Injectable()
export class TransactionService {
  async handleGetTransactions(user_id: string) {
    const transactions = await Transaction.findAll({ where: { user_id }})
    
    return {
      success: true,
      message: 'User Transactions found',
      data: transactions,
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
