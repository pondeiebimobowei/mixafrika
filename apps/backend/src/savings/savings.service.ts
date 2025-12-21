import { Injectable, NotFoundException } from '@nestjs/common';
import { Create_savings_plan } from '@shared/shared/src/validation/create-savings-plan-dto';
import { SavingsHistory } from 'src/database/models/saving-history.model';
import { Savings } from 'src/database/models/saving.model';
import { WalletService } from '../wallet/wallet.service';
import { SavingsHistoryService } from 'src/savings_history/savings_history.service';

@Injectable()
export class SavingsService {
  constructor(
    private readonly savingsHistoryService: SavingsHistoryService,
    private readonly walletService: WalletService) { }

  async handleGetSavings(user_id: string) {
    const savings = await Savings.findAll({ where: { user_id } })
    return {
      success: true,
      message: 'Savings plans retrieved successfully',
      data: savings
    };
  }

  async handleCreateSavings(user_id: string, payload: Create_savings_plan) {
    const savings = await Savings.create({
      user_id,
      name: payload.name,
      type: payload.type,
      target_amount: Number(payload.target_amount),
      frequency: payload.frequency,
      total_amount: 0,
      interest_rate: payload.type === 'locked' ? 12 : 15, // Mock interest rate
      source_id: payload.source_id,
      source_type: payload.source_type,
      auto_save: false,
      is_locked: payload.is_locked,
      maturity_date: payload.maturity_date ? new Date(Date.now() + Number(payload.maturity_date) * 30 * 24 * 60 * 60 * 1000) : null,
    });

    return {
      success: true,
      message: 'Savings plan created successfully',
      data: savings,
    };
  }

  async handleTopUpSavings(user_id: string, savings_id: string, amount: number, source: 'wallet' | 'card') {
    const savings = await Savings.findOne({ where: { id: savings_id, user_id } });

    if (!savings) {
      throw new NotFoundException('Savings plan not found');
    }

    if (source === 'wallet') {
      await this.walletService.handleDebitWallet(user_id, amount);
    }

    // Increment total amount
    await savings.increment('total_amount', { by: amount });
    await savings.reload();

    await this.savingsHistoryService.handleCreateSavingsHistoryRecord(savings.id, amount, 'deposit');

    return {
      success: true,
      message: 'Top up successful',
      data: savings,
    };
  }

  async handleGetSavingsById(savings_id: string) {
    const saving = await Savings.findOne({ where: { id: savings_id }, include: [SavingsHistory] })
    return {
      success: true,
      message: '',
      data: saving,
    };
  }

  async handleUpdateSavingsById(savings_id: string) {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleGetSavingsHistory(savings_id) {
    const savings_history = await this.savingsHistoryService.handleGetSavingsHistoryBySavingsId(savings_id);
    
    return {
      success: true,
      message: 'Savings history retrieved successfully',
      data: savings_history,
    }
  }
}
