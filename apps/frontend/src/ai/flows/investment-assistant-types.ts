
import { z } from 'zod';

// Define the input schema for the investment assistant
export const InvestmentAssistantInputSchema = z.object({
  investmentAmount: z.number().describe('The total amount the user wants to invest.'),
  riskTolerance: z.enum(['low', 'medium', 'high']).describe('The user\'s risk tolerance.'),
  investmentGoals: z.string().describe('The user\'s investment goals (e.g., long-term growth, quick returns).'),
});
export type InvestmentAssistantInput = z.infer<typeof InvestmentAssistantInputSchema>;

// Define the output schema for the investment assistant's response
const SuggestedPortfolioSchema = z.object({
  clusterId: z.string().describe('The ID of the suggested cluster.'),
  clusterName: z.string().describe('The name of the suggested cluster.'),
  allocationPercentage: z.number().describe('The percentage of the total investment to allocate to this cluster.'),
  amount: z.number().describe('The absolute amount to invest in this cluster.'),
  reasoning: z.string().describe('A brief reason for suggesting this cluster.'),
});

export const InvestmentAssistantOutputSchema = z.object({
  portfolio: z.array(SuggestedPortfolioSchema).describe('An array of suggested clusters to invest in.'),
  commentary: z.string().describe('A general commentary or prediction about the market and the suggested portfolio.'),
});
export type InvestmentAssistantOutput = z.infer<typeof InvestmentAssistantOutputSchema>;
