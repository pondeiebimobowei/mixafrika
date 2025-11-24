import { savingsType } from '../enums';
import { z } from 'zod';

export const create_savings_plan = z.object({
  name: z.string('Enter plan name').min(3, 'Savings target name must be at least 3 characters.'),
  target_amount: z.string('Enter target amount'),
  maturity_date: z.string('Select duration').nullable(),
  frequency: z.string('Select frequency').nullable(),
  source: z.string('Select source'),
  type: z.enum(Object.values(savingsType)),
  auto_save: z.boolean(),
  is_locked: z.boolean(),
  interest_rate: z.string(),

});

export type Create_savings_plan = z.infer<typeof create_savings_plan>;
