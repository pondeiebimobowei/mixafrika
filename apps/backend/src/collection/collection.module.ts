import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { ClusterModule } from 'src/cluster/cluster.module';

@Module({
  imports: [ClusterModule],
  controllers: [CollectionController],
  providers: [CollectionService]
})
export class CollectionModule {}
