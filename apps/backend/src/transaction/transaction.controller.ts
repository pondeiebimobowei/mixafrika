import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('v1/transactions')
export class TransactionController {
  constructor(private readonly transactionsService: TransactionService) {}

  @Get()
  getTransactions() {
    return this.transactionsService.handleGetTransactions();
  }

  @Get()
  getTransactionById() {
    return this.transactionsService.handleGetTransactionById();
  }
}
