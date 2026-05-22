import { v4 as uuidv4 } from 'uuid';
import { IBranch } from '@shared/shared/src/types/branch';
import { IBusiness } from '@shared/shared/src/types/business';
import { ICollection } from '@shared/shared/src/types/collection';
export const mockBranchSeed: ( business: IBusiness[], collection: ICollection[]) => Promise<IBranch[]> = (async (business: IBusiness[], collection: ICollection[]) => {
  const business_id = business.map((u) => u.id) as string[];
  const collection_id = collection.map((u)=> u.id) as string[];

  
  return [
    {
      id: uuidv4(),
      name: 'Branch 1',
      is_head_office: true,
      phone: '1234567890',
      street_address: '123 Main St',
      city: 'City',
      state: 'State',
      country: 'Country',
      business_id: business_id[0],
      collection_id: collection_id[0],
      sync_status: 'pending',
      sync_date: "2025-11-12T16:13:42.425Z",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    },  

    {
      id: uuidv4(),
      name: 'Branch 2',
      is_head_office: false,
      phone: '1234567890',
      street_address: '123 Main St',
      city: 'City',
      state: 'State',
      country: 'Country',
      business_id: business_id[0],
      collection_id: collection_id[0],
      sync_status: 'pending',
      sync_date: "2025-11-12T16:13:42.425Z",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    },
  ]
});
