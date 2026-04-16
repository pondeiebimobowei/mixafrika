import { v4 as uuidv4 } from 'uuid';
import { IBranch } from '@shared/shared/src/types/branch';
export const mockBranchSeed: (user: { id: string }[], user_business_id: { id: string}[]) => Promise<IBranch[]> = (async (user: { id: string }[], user_business_id: { id: string}[]) => {
  const business_id = user_business_id.map((u) => u.id);
  const user_id = user.map((u) => u.id);
  
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
      user_business_id: business_id[0],
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
      user_business_id: business_id[0],
      user_id: user_id[0],
      sync_status: 'pending',
      sync_date: "2025-11-12T16:13:42.425Z",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    },
  ]
});
