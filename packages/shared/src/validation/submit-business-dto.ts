import { z } from 'zod';

export const submit_business = z.object({
  name: z.string().min(3, 'Business name must be at least 3 characters.'),
  type: z.string().min(1, 'Please select a business type.'),
  address: z.string().min(1, 'Please select a business address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
});

export type Submit_business = z.infer<typeof submit_business>;
