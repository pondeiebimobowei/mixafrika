import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BatchService } from './batch.service';
import { IBatch } from '@shared/shared/src/types/batch';

@Controller('batch')
export class BatchController {
    constructor(private readonly batchService: BatchService) { }

    @Post()
    create(@Body() batchData: Partial<IBatch>) {
        return this.batchService.create(batchData);
    }

    @Get()
    findAll() {
        return this.batchService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.batchService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() batchData: Partial<IBatch>) {
        return this.batchService.update(id, batchData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.batchService.remove(id);
    }
}
