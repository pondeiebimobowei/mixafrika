import { Injectable } from '@nestjs/common';
// import { ClusterService } from '../cluster/cluster.service';
import { Cluster } from '../database/models/cluster.model';
import { Collection } from '../database/models/collection.model';

@Injectable()
export class CollectionService {
    // constructor( private readonly clusterService: ClusterService ){}

    async handleGetCollections() {
        const data = await Collection.findAll({ include: [Cluster]})

        return {
            success: true,
            message: 'Collections found',
            data,
        };
    }
    
    async handleGetCollectionById(cluster_id: string) {
        const cluster = await Collection.findByPk(cluster_id, { include: [Cluster]})
        
        return {
            success: true,
            message: 'Collection found',
            data: cluster,
        };
    }
}
