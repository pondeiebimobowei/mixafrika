// import * as bcrypt from 'bcryptjs';
import * as bcrypt from 'bcrypt';


import { IUser } from "@shared/shared/src/types/user";

import { v4 as uuidv4 } from 'uuid';
export const mockUserSeed: () => Promise<IUser[]> = (async () => {
  return [
    {
      id: uuidv4(),
      first_name: 'Emeka',
      last_name: 'Johnson',
      is_email_verified: true,
      user_name: "beastTrader",
      credit_score: 10,
      is_verified: true,
      
      credit_score_status: 'Good',
      email: 'trader@mixafrika.com',
      password: await bcrypt.hash('password123', 10),
      role: 'trader',
      sync_status: "pending",

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    }
  ]
});
