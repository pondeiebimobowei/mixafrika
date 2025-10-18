import { Injectable } from '@nestjs/common';

@Injectable()
export class ClusterService {
  async handleGetClusters() {
    return {
      success: true,
      message: '',
      data: [],
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
