import { Injectable } from '@nestjs/common';

@Injectable()
export class InvestmentService {
  async handleGetInvestments() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleCreateInvestment() {
    return {
      success: true,
      message: '',
      data: [],
    };
  }

  async handleGetInvesmentById(investment_id: string) {
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
