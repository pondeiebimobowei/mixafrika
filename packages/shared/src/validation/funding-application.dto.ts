import { z } from 'zod';

export const create_funding_application_dto = z.object({
  business_type: z.string().min(1, 'Please select a business type.'),
  business_location: z.string().min(1, 'Please select a business location.'),
  amount: z.string(),
  duration: z.string().min(1, 'Please select a duration.'),
  repayment_plan: z.string().min(1, 'Please select a repayment plan.'),
  purpose: z.string().min(3, 'Purpose must be at least 3 characters.'),
  statement: z.any(),
});

export type Create_funding_application_dto = z.infer<
  typeof create_funding_application_dto
>;
