import { Module } from '@nestjs/common';
import { ClusterController } from './cluster.controller';
import { ClusterService } from './cluster.service';
import { CollectionService } from 'src/collection/collection.service';

@Module({
  controllers: [ClusterController],
  providers: [ClusterService, CollectionService],
  // exports:[ClusterService],
})
export class ClusterModule {}
