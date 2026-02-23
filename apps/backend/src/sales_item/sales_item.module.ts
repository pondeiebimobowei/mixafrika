import { Module } from '@nestjs/common';
import { SalesItemController } from './sales_item.controller';
import { SalesItemService } from './sales_item.service';

@Module({
  controllers: [SalesItemController],
  providers: [SalesItemService]
})
export class SalesItemModule {}
