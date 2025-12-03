import { Injectable } from '@nestjs/common';
import { Cluster } from 'src/database/models/cluster.model';
import { Collection } from 'src/database/models/collection.model';

@Injectable()
export class ClusterService {
  async handleGetClusters() {
    const clusters = await Cluster.findAll({ include: [Collection]})
    return {
      success: true,
      message: '',
      data: clusters,
    };
  }

  async handleGetClusterById(cluster_id: string) {
    return {
      success: true,
      message: '',
      data: [],
    };
  }
}
