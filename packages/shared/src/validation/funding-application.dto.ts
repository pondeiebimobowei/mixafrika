
import { z } from 'zod';

export const createFundingApplicationDto = z.object({
  business_type: z.string().min(1, 'Please select a business type.'),
  business_location: z.string().min(1, 'Please select a business location.'),
  amount: z.number().positive('Amount must be positive.'),
  duration: z.string().min(1, 'Please select a duration.'),
  repayment_plan: z.string().min(1, 'Please select a repayment plan.'),
  purpose: z.string().min(3, 'Purpose must be at least 3 characters.'),
  statement: z.string().optional(),
});

export type CreateFundingApplicationDto = z.infer<typeof createFundingApplicationDto>;
