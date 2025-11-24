import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';
import { Create_savings_plan } from '@shared/shared/src/validation/create-savings-plan-dto';

@Controller('v1/savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) { }

  @Get()
  getSavings() {
    return this.savingsService.handleGetSavings();
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

  @Get(':savings_id')
  getSavingsHistory(@Param('savings_id') savings_id: string) {
    return this.savingsService.handleGetSavingsHistory(savings_id);
  }
}
