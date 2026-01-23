import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionModule } from 'src/collection/collection.module';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
  imports: [CollectionModule]
})
export class AdminCollectionModule {}
