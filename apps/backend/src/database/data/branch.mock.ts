import { v4 as uuidv4 } from 'uuid';
import { IBranch } from '@shared/shared/src/types/branch';
import { IUser } from '@shared/shared/src/types/user';
import { IBusiness } from '@shared/shared/src/types/business';
export const mockBranchSeed: (user: IUser[], business: IBusiness[]) => Promise<IBranch[]> = (async (user: IUser[], business: IBusiness[]) => {
  const business_id = business.map((u) => u.id) as string[];
  const user_id = user.map((u) => u.id) as string[];
  
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
      user_id: user_id[0],
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
      user_id: user_id[1],
      sync_status: 'pending',
      sync_date: "2025-11-12T16:13:42.425Z",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    },
  ]
});
