import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { IJwtToken } from '@shared/shared/src/types/jwt';

@Controller('v1/transactions')
export class TransactionController {
  constructor(private readonly transactionsService: TransactionService) { }

  @Get()
  getTransactions(
    @ParsedToken() jwt: IJwtToken,
    @Query('type') type?: string
  ) {
    return this.transactionsService.handleGetTransactions(jwt.id, type);
  }

  @Get()
  getTransactionById() {
    return this.transactionsService.handleGetTransactionById();
  }
}
