import { Injectable } from '@nestjs/common';
import { Cluster } from 'src/database/models/cluster.model';
import { Collection } from 'src/database/models/collection.model';

@Injectable()
export class ClusterService {
  async handleGetClusters() {
    const clusters = await Collection.findAll({ include: [Cluster]})
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
