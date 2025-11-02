
'use server';
/**
 * @fileOverview An AI investment assistant that suggests diversified portfolios.
 *
 * - suggestPortfolio - A function that suggests a portfolio based on user input.
 */

import { ai } from '@/ai/genkit';
import { allClusters } from '@/data/markets';
import { 
    InvestmentAssistantInputSchema, 
    InvestmentAssistantOutputSchema, 
    type InvestmentAssistantInput, 
    type InvestmentAssistantOutput 
} from './investment-assistant-types';


/**
 * An async wrapper function that invokes the Genkit flow to get a portfolio suggestion.
 * @param input The user's investment preferences.
 * @returns A promise that resolves to the suggested portfolio and commentary.
 */
export async function suggestPortfolio(input: InvestmentAssistantInput): Promise<InvestmentAssistantOutput> {
  return await investmentAssistantFlow(input);
}

// Define the Genkit prompt for the AI assistant
const investmentAssistantPrompt = ai.definePrompt({
  name: 'investmentAssistantPrompt',
  input: { schema: InvestmentAssistantInputSchema as any },
  output: { schema: InvestmentAssistantOutputSchema as any },
  prompt: `You are an expert financial advisor for ClustrTrade, specializing in African market clusters.
  Your task is to create a diversified investment portfolio based on the user's preferences and the available market clusters.

  User Preferences:
  - Investment Amount: {{{investmentAmount}}}
  - Risk Tolerance: {{{riskTolerance}}}
  - Investment Goals: "{{{investmentGoals}}}"

  Available Clusters for Investment (JSON format):
  \`\`\`json
  {{{json allClusters}}}
  \`\`\`

  Instructions:
  1.  Analyze the user's risk tolerance and investment goals.
  2.  Select a mix of clusters from the provided list that aligns with the user's preferences.
      - For 'low' risk, prefer 'active' clusters with a history of stable returns.
      - For 'medium' risk, create a mix of 'active' and 'pooling' clusters.
      - For 'high' risk, you can include more 'pooling' clusters with higher potential ROI.
  3.  Determine the percentage of the total investment to allocate to each chosen cluster. The total allocation must sum up to 100%.
  4.  Calculate the absolute amount to invest in each cluster based on the allocation percentage and the total investment amount.
  5.  Provide a brief, clear reasoning for each cluster selection.
  6.  Write a general market commentary and a summary of why the suggested portfolio is suitable for the user.
  7.  Ensure the output is in the correct JSON format as defined by the output schema.`,
});

// Define the Genkit flow that orchestrates the AI call
const investmentAssistantFlow = ai.defineFlow(
  {
    name: 'investmentAssistantFlow',
    inputSchema: InvestmentAssistantInputSchema as any,
    outputSchema: InvestmentAssistantOutputSchema as any,
  },
  async (input: { schema: InvestmentAssistantInput }) => {

    const { output } = await investmentAssistantPrompt({
        ...input,
        allClusters: allClusters.map(({ logo, ...rest }) => rest), // Exclude non-serializable 'logo' component
    });

    if (!output) {
      throw new Error('The AI model did not return a valid portfolio suggestion.');
    }
    
    return output;
  }
);
