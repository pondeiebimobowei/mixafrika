// import * as bcrypt from 'bcryptjs';
import * as bcrypt from 'bcrypt';

import { IUser } from "@shared/shared/src/types/user";

export const mockInvestorSeed: () => Promise<IUser[]> = ( async () => {
    return [
  {
    id: "1e4f7e8b-5b8d-4c96-9312-dc0f8b7c94e2",
    first_name: "Chidi",
    last_name: "Okafor",
    image: "https://picsum.photos/seed/101/150/150",
    is_email_verified: true,
    is_verified: true,
    user_name: "alphaTrader",
    credit_score: 17,
    credit_score_status: "Fair",
    email: "chidi.okafor@mixafrica.com",
    password: await bcrypt.hash("password123", 10),
    role: "investor",
    createdAt: "2025-11-19T14:10:12.425Z",
    updatedAt: "2025-11-19T14:10:12.425Z"
  },

  {
    id: "92fae1fc-02b3-4c7e-8bcd-02cd598b79af",
    first_name: "Zainab",
    last_name: "Lawal",
    image: "https://picsum.photos/seed/102/150/150",
    is_email_verified: true,
    is_verified: true,
    user_name: "zaiFinance",
    credit_score: 23,
    credit_score_status: "Good",
    email: "zainab.lawal@mixafrica.com",
    password: await bcrypt.hash("password123", 10),
    role: "investor",
    createdAt: "2025-11-19T14:11:00.425Z",
    updatedAt: "2025-11-19T14:11:00.425Z"
  },

  {
    id: "d3814d1b-1558-43dc-8a87-61d5e7b9ac8e",
    first_name: "Samuel",
    last_name: "Adeyemi",
    image: "https://picsum.photos/seed/103/150/150",
    is_email_verified: false,
    is_verified: false,
    user_name: "sammyTrades",
    credit_score: 12,
    credit_score_status: "Good",
    email: "samuel.adeyemi@mixafrica.com",
    password: await bcrypt.hash("password123", 10),
    role: "investor",
    createdAt: "2025-11-19T14:13:26.425Z",
    updatedAt: "2025-11-19T14:13:26.425Z"
  },

  {
    id: "4a5d9b20-7ffe-4a92-9c74-56b4b40c7bfb",
    first_name: "Aisha",
    last_name: "Bello",
    image: "https://picsum.photos/seed/104/150/150",
    is_email_verified: true,
    is_verified: false,
    user_name: "bellaTrader",
    credit_score: 8,
    credit_score_status: "Poor",
    email: "aisha.bello@mixafrica.com",
    password: await bcrypt.hash("password123", 10),
    role: "investor",
    createdAt: "2025-11-19T14:15:10.425Z",
    updatedAt: "2025-11-19T14:15:10.425Z"
  },

  {
    id: "cfd8e2d1-d0f1-4575-a570-058d1ab9bfa0",
    first_name: "Tunde",
    last_name: "Balogun",
    image: "https://picsum.photos/seed/105/150/150",
    is_email_verified: false,
    is_verified: true,
    user_name: "tundeMarketKing",
    credit_score: 19,
    credit_score_status: "Fair",
    email: "tunde.balogun@mixafrica.com",
    password: await bcrypt.hash("password123", 10),
    role: "investor",
    createdAt: "2025-11-19T14:16:40.425Z",
    updatedAt: "2025-11-19T14:16:40.425Z"
  }
]
});
