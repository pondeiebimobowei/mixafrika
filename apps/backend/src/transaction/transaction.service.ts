import { Injectable } from '@nestjs/common';
import { Types } from '@shared/shared/src/enums';
import { Transaction } from 'src/database/models/transaction.model';

@Injectable()
export class TransactionService {
  async handleGetTransactions(user_id: string, type?: string) {
    const where: any = { user_id };
    if (type && type !== 'All') {
      if (type === Types.DEPOSIT) where.type = Types.DEPOSIT;
      else if (type === Types.WITHDRAWAL) where.type = Types.WITHDRAWAL;
      else if (type === Types.DISBURSEMENT) where.type = Types.DISBURSEMENT;
      else if (type === Types.INVESTMENT) where.type = Types.INVESTMENT;
      else if (type === Types.LOAN) where.type = Types.LOAN;
      else if (type === Types.REPAYMENT) where.type = Types.REPAYMENT;      
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
