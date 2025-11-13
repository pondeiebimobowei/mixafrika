// import * as bcrypt from 'bcryptjs';
import * as bcrypt from 'bcrypt';

import { IUser } from "@shared/shared/src/types/user";

export const mockUserSeed: () => Promise<IUser[]> = ( async () => {
    return [
  {
    id: "19b47b8a-fc9a-4374-bc8e-0db7b6e87302",
    first_name: 'Emeka',
    last_name: 'Johnson',
    image: "https://picsum.photos/seed/401/150/150",
    is_email_verified: true,
    is_verified: true,
    user_name: "beastTrader",
    credit_score: 10,
    credit_score_status: 'Good',
    email: 'trader@gmail.com',
    password: await bcrypt.hash('password123', 10),
    role: 'user',
    
    createdAt: "2025-11-12T16:13:42.425Z",
    updatedAt: "2025-11-12T16:13:42.425Z"
  },
]});
