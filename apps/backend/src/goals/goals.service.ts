import { Injectable } from '@nestjs/common';

@Injectable()
export class GoalsService {
  async handleGetGoals() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleCreateGoals() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleUpdateGoals(goals_id) {
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
