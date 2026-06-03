import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ISales } from '@shared/shared/src/types/sales';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    create(@ParsedToken() user: User, @Body() saleData: Partial<ISales>) {
        return this.salesService.create(user.id, saleData);
    }

    @Get()
    findAll(@ParsedToken() user: User) {
        return this.salesService.findAll(user.id);
    }

    @Get(':id')
    findOne(@ParsedToken() user: User, @Param('id') id: string) {
        return this.salesService.findOne(user.id, id);
    }

    @Patch(':id')
    update(@ParsedToken() user: User, @Param('id') id: string, @Body() saleData: Partial<ISales>) {
        return this.salesService.update(user.id, id, saleData);
    }

    @Delete(':id')
    remove(@ParsedToken() user: User, @Param('id') id: string) {
        return this.salesService.remove(user.id, id);
    }
}
