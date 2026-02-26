import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesItemService } from './sales_item.service';
import { ISalesItem } from '@shared/shared/src/types/sales-item';

@Controller('sales-item')
export class SalesItemController {
    constructor(private readonly salesItemService: SalesItemService) { }

    @Post()
    create(@Body() salesItemData: Partial<ISalesItem>) {
        return this.salesItemService.create(salesItemData);
    }

    @Get()
    findAll() {
        return this.salesItemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesItemService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() salesItemData: Partial<ISalesItem>) {
        return this.salesItemService.update(id, salesItemData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.salesItemService.remove(id);
    }
}
