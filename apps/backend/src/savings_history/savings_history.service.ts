import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from '@shared/shared/src/enums';
import { SavingsHistory } from 'src/database/models/saving-history.model';
import { Transaction } from 'src/database/models/transaction.model';

@Injectable()
export class SavingsHistoryService {

    async handleCreateSavingsHistoryRecord( user_id: string, savings_id: string, amount: number, type: Types) {
      const tx = await Transaction.create({
        amount,
        category: '',
        status: 'active',
        title: '',
        type: 'deposit',
        user_id,

      })
      await SavingsHistory.create({
        transaction_id: tx.id,
        savings_id,
        amount,
        type,
      });
    }

    async handleGetSavingsHistoryBySavingsId(savings_id: string) {
      return await SavingsHistory.findAll({
        where: {
          savings_id,
        },
      });
    }
}
