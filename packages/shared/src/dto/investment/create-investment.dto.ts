import { z } from 'zod';

export const create_investment_dto = z.object({
    cluster_id: z.string().uuid(),
    amount: z.number().positive(),
});

export type CreateInvestmentDto = z.infer<typeof create_investment_dto>;
