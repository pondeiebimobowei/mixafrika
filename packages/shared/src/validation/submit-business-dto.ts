import { z } from 'zod';

export const submit_business = z.object({
  name: z.string().min(3, 'Business name must be at least 3 characters.'),
  type: z.string().min(1, 'Please select a business type.'),
  street_address: z.string().min(1, 'Please enter street address.'),
  city: z.string().min(1, 'Please select a city.'),
  state: z.string().min(1, 'Please select a state.'),
  country: z.string().min(1, 'Please select a country.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  cac_document: z.any(),
  national_id_document: z.any(),
});

export type Submit_business = z.infer<typeof submit_business>;
