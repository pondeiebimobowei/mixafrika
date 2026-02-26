// import * as bcrypt from 'bcryptjs';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { IUser } from "@shared/shared/src/types/user";

export const mockInvestorSeed: () => Promise<IUser[]> = (async () => {
  return [


    {
      id: uuidv4(),
      first_name: 'Aria',
      last_name: 'Brown',
      image: "https://picsum.photos/seed/401/150/150",
      is_email_verified: true,
      verification_status: 'verified',
      business_verification_status: 'unverified',
      user_name: "beastInvestor",
      credit_score: 10,
      credit_score_status: 'Good',
      email: 'investor@mixafrika.com',
      password: await bcrypt.hash('password123', 10),
      role: 'investor',

      createdAt: "2025-11-12T16:13:42.425Z",
      updatedAt: "2025-11-12T16:13:42.425Z"
    },

    {
      id: uuidv4(),
      first_name: "Chidi",
      last_name: "Okafor",
      image: "https://picsum.photos/seed/101/150/150",
      is_email_verified: true,
      verification_status: 'verified',
      user_name: "alphaTrader",
      business_verification_status: 'unverified',
      credit_score: 17,
      credit_score_status: "Fair",
      email: "chidi.okafor@mixafrika.com",
      password: await bcrypt.hash("password123", 10),
      role: "investor",
      createdAt: "2025-11-19T14:10:12.425Z",
      updatedAt: "2025-11-19T14:10:12.425Z"
    },

    {
      id: uuidv4(),
      first_name: "Zainab",
      last_name: "Lawal",
      image: "https://picsum.photos/seed/102/150/150",
      is_email_verified: true,
      verification_status: 'verified',
      business_verification_status: 'unverified',
      user_name: "zaiFinance",
      credit_score: 23,
      credit_score_status: "Good",
      email: "zainab.lawal@mixafrika.com",
      password: await bcrypt.hash("password123", 10),
      role: "investor",
      createdAt: "2025-11-19T14:11:00.425Z",
      updatedAt: "2025-11-19T14:11:00.425Z"
    },

    {
      id: uuidv4(),
      first_name: "Samuel",
      last_name: "Adeyemi",
      image: "https://picsum.photos/seed/103/150/150",
      is_email_verified: false,
      verification_status: 'unverified',
      business_verification_status: 'unverified',
      user_name: "sammyTrades",
      credit_score: 12,
      credit_score_status: "Good",
      email: "samuel.adeyemi@mixafrika.com",
      password: await bcrypt.hash("password123", 10),
      role: "investor",
      createdAt: "2025-11-19T14:13:26.425Z",
      updatedAt: "2025-11-19T14:13:26.425Z"
    },

    {
      id: uuidv4(),
      first_name: "Aisha",
      last_name: "Bello",
      image: "https://picsum.photos/seed/104/150/150",
      is_email_verified: true,
      verification_status: 'unverified',
      business_verification_status: 'unverified',
      user_name: "bellaTrader",
      credit_score: 8,
      credit_score_status: "Poor",
      email: "aisha.bello@mixafrika.com",
      password: await bcrypt.hash("password123", 10),
      role: "investor",
      createdAt: "2025-11-19T14:15:10.425Z",
      updatedAt: "2025-11-19T14:15:10.425Z"
    },

    {
      id: uuidv4(),
      first_name: "Tunde",
      last_name: "Balogun",
      image: "https://picsum.photos/seed/105/150/150",
      is_email_verified: false,
      verification_status: 'verified',
      business_verification_status: 'unverified',
      user_name: "tundeMarketKing",
      credit_score: 19,
      credit_score_status: "Fair",
      email: "tunde.balogun@mixafrika.com",
      password: await bcrypt.hash("password123", 10),
      role: "investor",
      createdAt: "2025-11-19T14:16:40.425Z",
      updatedAt: "2025-11-19T14:16:40.425Z"
    }
  ]
});
