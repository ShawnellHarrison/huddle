'use server';

/**
 * @fileOverview Implements the AI copilot for parsing and executing slash commands.
 *
 * - executeSlashCommand - Parses and executes slash commands entered by the user.
 * - ExecuteSlashCommandInput - The input type for the executeSlashCommand function.
 * - ExecuteSlashCommandOutput - The return type for the executeSlashCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExecuteSlashCommandInputSchema = z.object({
  command: z.string().describe('The slash command to execute.'),
  userId: z.string().describe('The ID of the user executing the command.'),
  companyId: z.string().describe('The ID of the company the user belongs to.'),
  channelId: z.string().optional().describe('The ID of the channel where the command was entered.'),
});
export type ExecuteSlashCommandInput = z.infer<typeof ExecuteSlashCommandInputSchema>;

const ExecuteSlashCommandOutputSchema = z.object({
  success: z.boolean().describe('Whether the command was executed successfully.'),
  message: z.string().describe('A message indicating the result of the command execution.'),
  data: z.record(z.any()).optional().describe('Optional data associated with the command execution.'),
});
export type ExecuteSlashCommandOutput = z.infer<typeof ExecuteSlashCommandOutputSchema>;

export async function executeSlashCommand(input: ExecuteSlashCommandInput): Promise<ExecuteSlashCommandOutput> {
  return executeSlashCommandFlow(input);
}

const executeSlashCommandPrompt = ai.definePrompt({
  name: 'executeSlashCommandPrompt',
  input: {schema: ExecuteSlashCommandInputSchema},
  output: {schema: ExecuteSlashCommandOutputSchema},
  prompt: `You are an AI copilot designed to parse and execute slash commands within a business application.

  A user has entered the following slash command:
  Command: {{{command}}}
  User ID: {{{userId}}}
  Company ID: {{{companyId}}}
  Channel ID: {{{channelId}}}

  Your task is to determine the appropriate action to take based on the command and user context. You can create tasks, create invoices, provide weekly summaries, or set reminders.

  Examples of slash commands and their corresponding actions:
  - 
  - 
  - /summary week: Generates a summary of the past week's activities and progress within the company.
  - /invoice client X due [date]: Creates an invoice for client X with the specified due date.
  - /remind 3pm: set a reminder at 3pm
  - /huddle create-task [task details]: create a task for the user.
  Based on the command, return a JSON object indicating whether the command was successful and a message describing the result.
`,
});

const executeSlashCommandFlow = ai.defineFlow(
  {
    name: 'executeSlashCommandFlow',
    inputSchema: ExecuteSlashCommandInputSchema,
    outputSchema: ExecuteSlashCommandOutputSchema,
  },
  async input => {
    try {
      const {output} = await executeSlashCommandPrompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error executing slash command:', error);
      return {
        success: false,
        message: `An error occurred while processing the command: ${error.message ?? 'Unknown error'}`,
      };
    }
  }
);
