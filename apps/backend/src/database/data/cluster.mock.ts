import { ICluster } from '@shared/shared/src/types/cluster';
import { ICollection } from '@shared/shared/src/types/collection';
import { v4 as uuidv4 } from 'uuid';

export const mockClusterSeed: (collection: ICollection[]) => Promise<ICluster[]> = ( async (collection) => {
    const now = new Date()
    return [
        {
            id: uuidv4(),
            about:'30 days investment cluster',
            collection_id: collection[0].id  as string ,
            duration: 30,
            end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
            start_date: now.getDate().toString() ,
            status: '',
            description: '',
            is_active: true,
            name: 'Swali Traders Cluster',
            repayment: '',
            cover_image: '',
            target_fundraising_amount: 1_000_000,
            total_funds_raised: 45_000,
            roi: 15,
            createdAt: "2025-11-19T14:10:12.425Z",
            updatedAt: "2025-11-19T14:10:12.425Z",
            sync_status: 'pending',
            sync_date: new Date().toISOString(),

        },
        {
            id: uuidv4(),
            about:'30 days investment cluster',
            collection_id: collection[0].id  as string ,
            duration: 60,
            end_date: now.setDate(now.getDate() + 60).toString(),
            start_date: now.getDate().toString(),
            status: '',
            description: '',
            is_active: true,
            name: 'Ahoada Traders Cluster',
            repayment: '',
            cover_image: '',
            target_fundraising_amount: 2_000_000,
            total_funds_raised: 1_500_00,
            roi: 15,
            createdAt: "2025-11-19T15:11:12.425Z",
            updatedAt: "2025-11-19T15:11:12.425Z",
            sync_status: 'pending',
            sync_date: new Date().toISOString(),

        },
        {
            id: uuidv4(),
            about:'30 days investment cluster',
            collection_id: collection[0].id  as string ,
            duration: 90,
            end_date: now.setDate(now.getDate() + 90).toString(),
            start_date: now.getDate().toString() ,
            status: '',
            description: '',
            is_active: true,
            name: 'Igbogene Traders Cluster',
            repayment: '',
            cover_image: '',
            target_fundraising_amount: 3_000_000,
            total_funds_raised: 1_800_000,
            roi: 15,
            createdAt: "2025-11-19T16:09:12.425Z",
            updatedAt: "2025-11-19T16:09:12.425Z",
            sync_status: 'pending',
            sync_date: new Date().toISOString(),

        },
    ]
});
