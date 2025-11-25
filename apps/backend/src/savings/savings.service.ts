import { Injectable } from '@nestjs/common';
import { Create_savings_plan } from '@shared/shared/src/validation/create-savings-plan-dto';
import { Savings } from 'src/database/models/saving.model';

@Injectable()
export class SavingsService {
  async handleGetSavings(user_id:string) {
    const savings = await Savings.findAll({ where: { user_id }})
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
      frequency: payload.frequency || '',
      total_amount: Number(payload.target_amount) || 0,
      interest_rate: payload.type === 'locked' ? 12 : 0, // Mock interest rate
      source_id: payload.source_id,
      source_type: payload.source_type,
      auto_save: false,
      is_locked: false,
      maturity_date: payload.maturity_date ? new Date(Date.now() + Number(payload.maturity_date) * 30 * 24 * 60 * 60 * 1000) : null,
    });

    return {
      success: true,
      message: 'Savings plan created successfully',
      data: savings,
    };
  }

  async handleGetSavingsById(savings_id) {
    const saving = Savings.findOne({ where: savings_id})
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
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
