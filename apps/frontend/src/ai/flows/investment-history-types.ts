import { z } from 'zod';

// Define the schema for a single investment, to be used in the array
const InvestmentSchema = z.object({
    id: z.string(),
    clusterId: z.string(),
    name: z.string(),
    amountInvested: z.number(),
    status: z.enum(['active', 'completed']),
    currentValue: z.number().optional(),
    cycleProgress: z.number().optional(),
    cycleTotalDays: z.number().optional(),
    cycleStartDate: z.string().optional(),
    return: z.number().optional(),
    returnPercentage: z.number().optional(),
    cycleEndDate: z.string().optional(),
    date: z.string().optional(),
});

// Define the input schema for the history analysis flow
export const HistoryAnalysisInputSchema = z.object({
  question: z.string().describe('The user\'s question about their investment history.'),
  investmentHistory: z.array(InvestmentSchema).describe('The user\'s past and active investments.'),
});

export type HistoryAnalysisInput = z.infer<typeof HistoryAnalysisInputSchema>;

// Define the output schema for the flow's response
export const HistoryAnalysisOutputSchema = z.string().describe("The AI's answer to the user's question.");
export type HistoryAnalysisOutput = z.infer<typeof HistoryAnalysisOutputSchema>;
