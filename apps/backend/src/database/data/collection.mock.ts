import { ICollection } from '@shared/shared/src/types/collection';
import { v4 as uuidv4 } from 'uuid';

export const mockColectionSeed: () => Promise<ICollection[]> = ( async () => {
    
    return [
        {
            id: uuidv4(),
            name: 'Computer Village Hub',
            about: 'We specialize in computer parts',
            city: 'Ikeja',
            country: 'Nigeria',
            cover_image: 'https://picsum.photos/seed/tech1/400/200',
            description: 'Wholesale import and distribution of smartphones, laptops, and accessories in the largest ICT hub.',
            min_investment: 5000,
            roi: 15,
            state: 'Lagos',
            total_traders: 302,

            sync_status: 'pending',
            sync_date: "2025-11-19T14:10:12.425Z",

            createdAt: "2025-11-19T14:10:12.425Z",
            updatedAt: "2025-11-19T14:10:12.425Z"

        },
    ]
});
