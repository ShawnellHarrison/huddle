
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-next-task-step.ts';
import '@/ai/flows/execute-slash-commands.ts';
import '@/ai/flows/generate-weekly-report.ts';
import '@/ai/flows/categorize-expenses.ts';
import '@/ai/flows/summarize-document.ts';
import '@/ai/flows/generate-recurring-invoices.ts';
import '@/ai/flows/brand-voice-generator.ts';
