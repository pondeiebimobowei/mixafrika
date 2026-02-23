import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ISales } from '@shared/shared/src/types/sales';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    create(@Body() saleData: Partial<ISales>) {
        return this.salesService.create(saleData);
    }

    @Get()
    findAll() {
        return this.salesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() saleData: Partial<ISales>) {
        return this.salesService.update(id, saleData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.salesService.remove(id);
    }
}
