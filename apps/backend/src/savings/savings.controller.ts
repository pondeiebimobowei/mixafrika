import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';
import { Create_savings_plan } from '@shared/shared/src/validation/create-savings-plan-dto';

@Controller('v1/savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) { }

  @Get()
  getSavings(
    @ParsedToken() jwt: IJwtToken
  ) {
    return this.savingsService.handleGetSavings(jwt.id);
  }

  @Post()
  createSavings(@Body() body: Create_savings_plan, @ParsedToken() jwt: IJwtToken) {
    return this.savingsService.handleCreateSavings(jwt.id, body);
  }

  @Patch(':savings_id')
  updateSavings(@Param('savings_id') savings_id: string) {
    return this.savingsService.handleUpdateSavingsById(savings_id);
  }

  @Get(':savings_id')
  getSavingsById(@Param('savings_id') savings_id: string) {
    return this.savingsService.handleGetSavingsById(savings_id);
  }

  @Post(':savings_id/top-up')
  topUpSavings(
    @Param('savings_id') savings_id: string,
    @Body() body: { amount: number; source: 'wallet' | 'card' },
    @ParsedToken() jwt: IJwtToken
  ) {
    return this.savingsService.handleTopUpSavings(jwt.id, savings_id, body.amount, body.source);
  }

  @Get(':savings_id/history')
  getSavingsHistory(@Param('savings_id') savings_id: string) {
    return this.savingsService.handleGetSavingsHistory(savings_id);
  }
}
