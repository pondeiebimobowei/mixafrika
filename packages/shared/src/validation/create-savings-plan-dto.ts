import { savingsFrequency, savingsType, sourceType } from '../enums';
import { z } from 'zod/v4';

export const create_savings_plan = z.object({
  name: z.string('Enter plan name').min(3, 'Savings target name must be at least 3 characters.'),
  target_amount: z.string('Enter target amount'),
  maturity_date: z.string('Select duration').nullable(),
  frequency: z.enum(Object.values(savingsFrequency),'Select frequency'),
  source_type: z.enum(Object.values(sourceType),'Select Source'),
  source_id: z.uuid('Select funding source'),
  type: z.enum(Object.values(savingsType)),
  auto_save: z.boolean(),
  is_locked: z.boolean(),
  interest_rate: z.string(),

}).superRefine((data, ctx) => {
  
  if (data.type === "locked" && !data.maturity_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maturity_date"],
      message: "Maturity date is required for locked savings plans.",
    });
  }

});

export type Create_savings_plan = z.infer<typeof create_savings_plan>;
