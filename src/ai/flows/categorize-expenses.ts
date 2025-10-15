'use server';

/**
 * @fileOverview Expense categorization AI agent.
 *
 * - categorizeExpense - A function that categorizes an expense based on OCR data.
 * - CategorizeExpenseInput - The input type for the categorizeExpense function.
 * - CategorizeExpenseOutput - The return type for the categorizeExpense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeExpenseInputSchema = z.object({
  ocrRaw: z
    .string()
    .describe('The raw OCR output from the expense receipt.'),
});
export type CategorizeExpenseInput = z.infer<typeof CategorizeExpenseInputSchema>;

const CategorizeExpenseOutputSchema = z.object({
  category: z
    .string()
    .describe('The predicted category of the expense (e.g., "Food", "Travel", "Supplies").'),
});
export type CategorizeExpenseOutput = z.infer<typeof CategorizeExpenseOutputSchema>;

export async function categorizeExpense(input: CategorizeExpenseInput): Promise<CategorizeExpenseOutput> {
  return categorizeExpenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeExpensePrompt',
  input: {schema: CategorizeExpenseInputSchema},
  output: {schema: CategorizeExpenseOutputSchema},
  prompt: `You are an expert expense categorizer. Given the OCR output from a receipt, determine the most likely category for the expense.

OCR Output: {{{ocrRaw}}}

Respond with only the category name.
Possible categories: Food, Travel, Supplies, Utilities, Rent, Software, Marketing, Other`,
});

const categorizeExpenseFlow = ai.defineFlow(
  {
    name: 'categorizeExpenseFlow',
    inputSchema: CategorizeExpenseInputSchema,
    outputSchema: CategorizeExpenseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
