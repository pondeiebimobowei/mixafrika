import { Controller, Get } from '@nestjs/common';
import { CollectionService } from '../../collection/collection.service';

@Controller('v1/admin/collection')
export class CollectionController {
    constructor ( private readonly collectionService: CollectionService ) {}
    @Get()
    getCollections() {
        return this.collectionService.handleGetCollections()
    }
}
