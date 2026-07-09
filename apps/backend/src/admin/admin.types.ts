import type { VerificationStatus } from '@shared/shared/src/enums';
import type { Roles } from '@shared/shared/src/enums';

export type AdminOverview = {
  users: {
    total: number;
    verified: number;
    pendingVerification: number;
    unverified: number;
  };
  businesses: {
    total: number;
    verified: number;
    pendingVerification: number;
  };
  activity: {
    pendingUserVerifications: number;
    pendingBusinessVerifications: number;
    totalBranches: number;
    totalCustomers: number;
  };
};

export type AdminModerationAction = {
  status: VerificationStatus;
  reviewed_by: string;
  reviewed_at: string;
  rejection_reason?: string;
};

export type AdminUserPayload = {
  first_name: string;
  last_name: string;
  email: string;
  role: Roles;
  password?: string;
  is_verified?: boolean;
  is_email_verified?: boolean;
};

export type AdminBusinessPayload = {
  name: string;
  type: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  is_verified?: boolean;
};
