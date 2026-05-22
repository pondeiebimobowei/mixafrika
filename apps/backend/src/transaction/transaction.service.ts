import { Injectable } from '@nestjs/common';
import { types } from '@shared/shared/src/enums';
import { Transaction } from 'src/database/models/transaction.model';

@Injectable()
export class TransactionService {
  async handleGetTransactions(user_id: string, type?: string) {
    const where: any = { user_id };
    if (type && type !== 'All') {
      if (type === types.DEPOSIT) where.type = types.DEPOSIT;
      else if (type === types.WITHDRAWAL) where.type = types.WITHDRAWAL;
      else if (type === types.DISBURSEMENT) where.type = types.DISBURSEMENT;
      else if (type === types.INVESTMENT) where.type = types.INVESTMENT;
      else if (type === types.LOAN) where.type = types.LOAN;
      else if (type === types.REPAYMENT) where.type = types.REPAYMENT;
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    const groupedTransactions: Record<string, Transaction[]> = {};

    transactions.forEach((t) => {
      const date = new Date(t.createdAt);
      const dateString = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      if (!groupedTransactions[dateString]) {
        groupedTransactions[dateString] = [];
      }
      groupedTransactions[dateString].push(t);
    });

    return {
      success: true,
      message: 'User Transactions found',
      data: groupedTransactions,
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
