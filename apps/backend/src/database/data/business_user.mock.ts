// import * as bcrypt from 'bcryptjs';
import * as bcrypt from 'bcrypt';


import { IBusinessUser } from "@shared/shared/src/types/business-user";

import { v4 as uuidv4 } from 'uuid';
export const mockBusinessUserSeed: (user, business) => Promise<IBusinessUser[]> = (async ( user: { id: string }[], business: { id: string}[]) => {
  const user_id = user.map((u) => u.id);
  const business_id = business.map((b) => b.id);
  return [
    {
      id: uuidv4(),
      role: 'trader',
      is_active: true,
      has_full_access: true,
      user_id: user_id[0],
      
      business_id: business_id[0],
      sync_status: 'pending',
      sync_date: "2025-11-12T16:13:42.425Z",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    },

    {
      id: uuidv4(),
      role: 'trader',
      is_active: true,
      has_full_access: true,
      user_id: user_id[0],
      business_id: business_id[1],
      sync_status: 'pending',
      sync_date: "2025-11-12T16:13:42.425Z",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    },
  ]
});
