import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateInvestmentDto, create_investment_dto } from '@mixafrica/shared';
import { InvestmentService } from './investment.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@mixafrica/shared';

@Controller('v1/investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) { }

  @Get()
  getInvestments(@ParsedToken() { id }: IJwtToken) {
    return this.investmentService.handleGetInvestments(id);
  }

  @Post()
  createInvestment(
    @Body() payload: CreateInvestmentDto,
    @ParsedToken() { id }: IJwtToken,
  ) {
    return this.investmentService.handleCreateInvestment(payload, id);
  }

  @Get()
  getInvestmentById(@Param('investment_id') investment_id: string) {
    return this.investmentService.handleGetInvesmentById(investment_id);
  }
}
