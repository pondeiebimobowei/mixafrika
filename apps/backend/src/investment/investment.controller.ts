import { Controller, Get, Param, Post } from '@nestjs/common';
import { InvestmentService } from './investment.service';

@Controller('v1/investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Get()
  getInvestments() {
    return this.investmentService.handleGetInvestments;
  }

  @Post()
  createInvestment() {
    return this.investmentService.handleCreateInvestment();
  }

  @Get()
  getInvestmentById(@Param('investment_id') investment_id: string) {
    return this.investmentService.handleGetInvesmentById(investment_id);
  }
}
