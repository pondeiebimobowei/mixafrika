import { Injectable } from '@nestjs/common';
import { CollectionService } from 'src/collection/collection.service';
import { Cluster } from 'src/database/models/cluster.model';

@Injectable()
export class ClusterService {

  constructor( private readonly collectionService: CollectionService ){}

  async handleGetClusters() {
    const clusters = this.collectionService.handleGetCollections()
    return {
      success: true,
      message: 'Clusters found',
      data: clusters,
    };
  }

  async handleGetClusterById(cluster_id: string) {
    const cluster = await Cluster.findByPk(cluster_id)
    return {
      success: true,
      message: 'Cluster found',
      data: cluster,
    };
  }
}
