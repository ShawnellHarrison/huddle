'use server';

/**
 * @fileOverview AI flow to generate a weekly report summarizing key company metrics and insights.
 *
 * - generateWeeklyReport - A function that generates the weekly report.
 * - GenerateWeeklyReportInput - The input type for the generateWeeklyReport function (currently empty).
 * - GenerateWeeklyReportOutput - The return type for the generateWeeklyReport function, containing the report text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeeklyReportInputSchema = z.object({});
export type GenerateWeeklyReportInput = z.infer<typeof GenerateWeeklyReportInputSchema>;

const GenerateWeeklyReportOutputSchema = z.object({
  reportText: z.string().describe('The generated weekly report text.'),
});
export type GenerateWeeklyReportOutput = z.infer<typeof GenerateWeeklyReportOutputSchema>;

export async function generateWeeklyReport(input: GenerateWeeklyReportInput): Promise<GenerateWeeklyReportOutput> {
  return generateWeeklyReportFlow(input);
}

const generateWeeklyReportPrompt = ai.definePrompt({
  name: 'generateWeeklyReportPrompt',
  input: {schema: GenerateWeeklyReportInputSchema},
  output: {schema: GenerateWeeklyReportOutputSchema},
  prompt: `You are an AI assistant tasked with generating weekly reports for companies.

  Your goal is to provide a concise and informative summary of the company's performance over the past week.
  The report should include key metrics and insights based on available data, such as task completion rates, invoice payments,
  kudos received, and overall team engagement.

  Consider the following factors when generating the report:

  - Task completion: How many tasks were completed this week? Were there any bottlenecks or delays?
  - Invoice payments: How much revenue was generated this week? Are there any overdue invoices?
  - Kudos received: How many kudos were given this week? Who were the top contributors?
  - Team engagement: How active were team members in channels and projects?

  Based on these factors, provide a summary of the company's performance and suggest areas for improvement.

  Here's the weekly report:
  `,
});

const generateWeeklyReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyReportFlow',
    inputSchema: GenerateWeeklyReportInputSchema,
    outputSchema: GenerateWeeklyReportOutputSchema,
  },
  async input => {
    const {output} = await generateWeeklyReportPrompt(input);
    return output!;
  }
);
