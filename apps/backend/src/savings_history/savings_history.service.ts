import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from '@shared/shared/src/enums';
import { SavingsHistory } from 'src/database/models/saving-history.model';

@Injectable()
export class SavingsHistoryService {

    constructor() { }

    async handleCreateSavingsHistoryRecord(savings_id: string, amount: number, type: Types) {
      await SavingsHistory.create({
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
