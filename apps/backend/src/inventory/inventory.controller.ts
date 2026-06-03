import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { IInventory } from '@shared/shared/src/types/inventory';
import { ParsedToken } from 'src/decorators/parsed-token.decorator';
import { User } from 'src/database/models/user.model';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post()
    create(@ParsedToken() user: User, @Body() inventoryData: Partial<IInventory>) {
        return this.inventoryService.create(user.id, inventoryData);
    }

    @Get()
    findAll(@ParsedToken() user: User) {
        return this.inventoryService.findAll(user.id);
    }

    @Get(':id')
    findOne(@ParsedToken() user: User, @Param('id') id: string) {
        return this.inventoryService.findOne(user.id, id);
    }

    @Patch(':id')
    update(@ParsedToken() user: User, @Param('id') id: string, @Body() inventoryData: Partial<IInventory>) {
        return this.inventoryService.update(user.id, id, inventoryData);
    }

    @Delete(':id')
    remove(@ParsedToken() user: User, @Param('id') id: string) {
        return this.inventoryService.remove(user.id, id);
    }
}
