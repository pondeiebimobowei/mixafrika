import { ICluster } from '@shared/shared/src/types/cluster';
import { v4 as uuidv4 } from 'uuid';

export const mockClusterSeed: () => Promise<ICluster[]> = ( async () => {
    return [
        {
            id: uuidv4(),
            category: '',
            description: '',
            is_active: true,
            name: 'Swali Traders Cluster',
            repayment: '',
            cover_image: '',
            roi: 15,
            createdAt: "2025-11-19T14:10:12.425Z",
            updatedAt: "2025-11-19T14:10:12.425Z"

        },
        {
            id: uuidv4(),
            category: '',
            description: '',
            is_active: true,
            name: 'Ahoada Traders Cluster',
            repayment: '',
            cover_image: '',
            roi: 15,
            createdAt: "2025-11-19T15:11:12.425Z",
            updatedAt: "2025-11-19T15:11:12.425Z"

        },
        {
            id: uuidv4(),
            category: '',
            description: '',
            is_active: true,
            name: 'Igbogene Traders Cluster',
            repayment: '',
            cover_image: '',
            roi: 15,
            createdAt: "2025-11-19T16:09:12.425Z",
            updatedAt: "2025-11-19T16:09:12.425Z"

        },
    ]
});
