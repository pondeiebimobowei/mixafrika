import { sourceType } from  '../../enums';
import { z } from 'zod';

export const create_investment_dto = z.object({
    cluster_id: z.string().uuid(),
    amount: z.number().positive(),
    source_type: z.enum(Object.values(sourceType),'Select source type'),
    source_id: z.string().uuid(),
});

export type CreateInvestmentDto = z.infer<typeof create_investment_dto>;
