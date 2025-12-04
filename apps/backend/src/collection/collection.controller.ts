import { Controller, Get, Param } from '@nestjs/common';
import { CollectionService } from './collection.service';

@Controller('v1/collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}
    
    @Get()
    getCollections() {
        return this.collectionService.handleGetCollections();
    }

    @Get(':collection_id')
    getCollectionById(@Param('collection_id') collection_id: string) {
        return this.collectionService.handleGetCollectionById(collection_id);
    }
}
