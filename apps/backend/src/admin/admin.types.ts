import type { VerificationStatus } from '@shared/shared/src/enums';

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
