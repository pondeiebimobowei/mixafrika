
'use server';
/**
 * @fileOverview An AI flow to answer questions about a user's investment history.
 *
 * - askAboutHistory - A function that takes a question and investment history to provide an answer.
 */

import { ai } from '@/ai/genkit';
import {
    HistoryAnalysisInputSchema,
    HistoryAnalysisOutputSchema,
    type HistoryAnalysisInput,
    type HistoryAnalysisOutput,
} from './investment-history-types';


/**
 * An async wrapper function that invokes the Genkit flow to answer a question about investment history.
 * @param input The user's question and their investment history.
 * @returns A promise that resolves to the AI's answer.
 */
export async function askAboutHistory(input: HistoryAnalysisInput): Promise<HistoryAnalysisOutput> {
  return await investmentHistoryFlow(input);
}

// Define the Genkit prompt for the history analysis
const investmentHistoryPrompt = ai.definePrompt({
  name: 'investmentHistoryPrompt',
  input: { schema: HistoryAnalysisInputSchema as any },
  output: { schema: HistoryAnalysisOutputSchema as any },
  prompt: `You are an expert financial analyst reviewing an investor's history on ClustrTrade.
  Your task is to answer the user's question based on the provided investment history data.

  User's Question:
  "{{{question}}}"

  User's Investment History (JSON format):
  \`\`\`json
  {{{json investmentHistory}}}
  \`\`\`

  Instructions:
  1.  Analyze the user's question and their investment history.
  2.  Formulate a clear and concise answer based *only* on the data provided in the investment history.
  3.  If you perform calculations (like total return, average ROI, etc.), briefly mention how you arrived at the number.
  4.  Keep the tone helpful, professional, and easy to understand.
  5.  If the question cannot be answered from the provided history, state that clearly. Do not make up information.`,
});

// Define the Genkit flow that orchestrates the AI call
const investmentHistoryFlow = ai.defineFlow(
  {
    name: 'investmentHistoryFlow',
    inputSchema: HistoryAnalysisInputSchema as any,
    outputSchema: HistoryAnalysisOutputSchema as any,
  },
  async (input: HistoryAnalysisInput) => {
    const { output } = await investmentHistoryPrompt(input);
    
    if (output === undefined) {
      throw new Error('The AI model did not return a valid answer.');
    }
    
    return output;
  }
);
