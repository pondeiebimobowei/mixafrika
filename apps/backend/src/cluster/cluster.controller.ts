import { Controller, Get, Param } from '@nestjs/common';
import { ClusterService } from './cluster.service';

@Controller('v1/cluster')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}
  

  @Get(':cluster_id')
  getClusterById(@Param('cluster_id') cluster_id: string) {
    return this.clusterService.handleGetClusterById(cluster_id);
  }
}
