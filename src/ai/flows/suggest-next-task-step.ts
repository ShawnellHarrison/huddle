'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the next step for a task.
 *
 * It includes:
 * - `suggestNextTaskStep`: An asynchronous function that takes task details as input and returns a suggested next step.
 * - `SuggestNextTaskStepInput`: The input type for the `suggestNextTaskStep` function.
 * - `SuggestNextTaskStepOutput`: The output type for the `suggestNextTaskStep` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextTaskStepInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task for which to suggest the next step.'),
  taskStatus: z
    .string()
    .describe('The current status of the task (e.g., todo, in_progress, done).'),
});

export type SuggestNextTaskStepInput = z.infer<typeof SuggestNextTaskStepInputSchema>;

const SuggestNextTaskStepOutputSchema = z.object({
  nextStepSuggestion: z
    .string()
    .describe('A suggestion for the next logical step to move the task forward.'),
});

export type SuggestNextTaskStepOutput = z.infer<typeof SuggestNextTaskStepOutputSchema>;

export async function suggestNextTaskStep(
  input: SuggestNextTaskStepInput
): Promise<SuggestNextTaskStepOutput> {
  return suggestNextTaskStepFlow(input);
}

const suggestNextTaskStepPrompt = ai.definePrompt({
  name: 'suggestNextTaskStepPrompt',
  input: {schema: SuggestNextTaskStepInputSchema},
  output: {schema: SuggestNextTaskStepOutputSchema},
  prompt: `You are an AI assistant helping project managers determine the next step for a task.

Given the following task description and current status, suggest the next logical step to move the task forward.

Task Description: {{{taskDescription}}}
Task Status: {{{taskStatus}}}

Next Step Suggestion:`,
});

const suggestNextTaskStepFlow = ai.defineFlow(
  {
    name: 'suggestNextTaskStepFlow',
    inputSchema: SuggestNextTaskStepInputSchema,
    outputSchema: SuggestNextTaskStepOutputSchema,
  },
  async input => {
    const {output} = await suggestNextTaskStepPrompt(input);
    return output!;
  }
);
