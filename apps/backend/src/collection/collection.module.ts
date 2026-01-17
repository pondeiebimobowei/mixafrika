import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { ClusterModule } from 'src/cluster/cluster.module';
import { ClusterService } from 'src/cluster/cluster.service';

@Module({
  // imports: [ClusterModule],
  controllers: [CollectionController],
  providers: [CollectionService, ClusterService]
})
export class CollectionModule {}
