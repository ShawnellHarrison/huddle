
'use server';

/**
 * @fileOverview AI flow to generate recurring monthly invoices.
 *
 * This flow is designed to be run on a schedule (e.g., daily) to check for
 * invoices that are marked as 'repeatMonthly' and generate new ones if needed.
 *
 * - generateRecurringInvoices - A function that handles the invoice generation process.
 * - GenerateRecurringInvoicesInput - The input type (currently empty).
 * - GenerateRecurringInvoicesOutput - The return type, indicating success and the number of invoices created.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const GenerateRecurringInvoicesInputSchema = z.object({
  companyId: z.string().describe('The ID of the company to process invoices for.'),
});
export type GenerateRecurringInvoicesInput = z.infer<typeof GenerateRecurringInvoicesInputSchema>;

const GenerateRecurringInvoicesOutputSchema = z.object({
  success: z.boolean().describe('Whether the operation was successful.'),
  invoicesCreated: z.number().describe('The number of new invoices created.'),
  message: z.string().describe('A summary of the operation.'),
});
export type GenerateRecurringInvoicesOutput = z.infer<typeof GenerateRecurringInvoicesOutputSchema>;


/**
 * A tool to get all invoices that are due to be renewed.
 */
const getRenewableInvoices = ai.defineTool(
  {
    name: 'getRenewableInvoices',
    description: 'Retrieves all invoices for a company that are marked for monthly renewal and are due to be renewed.',
    inputSchema: z.object({ companyId: z.string() }),
    outputSchema: z.array(z.any()),
  },
  async ({ companyId }) => {
    const { firestore } = initializeFirebase();
    const invoicesRef = collection(firestore, 'invoices');
    
    const q = query(
      invoicesRef,
      where('companyId', '==', companyId),
      where('repeatMonthly', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const renewableInvoices: any[] = [];
    const now = new Date();

    querySnapshot.forEach(doc => {
      const invoice = doc.data();
      const lastGenerated = invoice.lastGeneratedAt?.toDate() || invoice.createdAt?.toDate();
      
      if (lastGenerated) {
        const nextGenerationDate = new Date(lastGenerated);
        nextGenerationDate.setMonth(nextGenerationDate.getMonth() + 1);

        if (now.getTime() >= nextGenerationDate.getTime()) {
          renewableInvoices.push({ id: doc.id, ...invoice });
        }
      }
    });

    return renewableInvoices;
  }
);


/**
 * A tool to create a new draft invoice based on a previous one.
 */
const createNewDraftInvoice = ai.defineTool(
    {
        name: 'createNewDraftInvoice',
        description: 'Creates a new draft invoice based on an existing one and updates the original invoice\'s lastGeneratedAt timestamp.',
        inputSchema: z.object({
            originalInvoice: z.any().describe('The original invoice data.'),
        }),
        outputSchema: z.string().describe('The ID of the new invoice.'),
    },
    async ({ originalInvoice }) => {
        const { firestore } = initializeFirebase();
        const invoicesRef = collection(firestore, 'invoices');
        const originalInvoiceRef = doc(firestore, 'invoices', originalInvoice.id);

        const newDueDate = new Date(originalInvoice.dueDate.toDate());
        newDueDate.setMonth(newDueDate.getMonth() + 1);

        const newInvoiceData = {
            ...originalInvoice,
            status: 'draft',
            createdAt: serverTimestamp(),
            lastGeneratedAt: serverTimestamp(),
            dueDate: newDueDate,
            number: `${originalInvoice.number.split('-')[0]}-${Date.now()}`, // Simple way to create a new invoice number
        };
        
        // Remove original ID to let Firestore generate a new one
        delete newInvoiceData.id;

        const newDocRef = await addDoc(invoicesRef, newInvoiceData);

        // Update the lastGeneratedAt on the original invoice
        await updateDoc(originalInvoiceRef, {
            lastGeneratedAt: serverTimestamp(),
        });
        
        return newDocRef.id;
    }
);


export async function generateRecurringInvoices(input: GenerateRecurringInvoicesInput): Promise<GenerateRecurringInvoicesOutput> {
  return generateRecurringInvoicesFlow(input);
}

const generateRecurringInvoicesFlow = ai.defineFlow(
  {
    name: 'generateRecurringInvoicesFlow',
    inputSchema: GenerateRecurringInvoicesInputSchema,
    outputSchema: GenerateRecurringInvoicesOutputSchema,
    tools: [getRenewableInvoices, createNewDraftInvoice]
  },
  async ({ companyId }) => {
    
    const llmResponse = await ai.generate({
        prompt: `You are an automated billing assistant for the company with ID "${companyId}". Your task is to identify and process recurring monthly invoices that are due for renewal. First, find all renewable invoices using the getRenewableInvoices tool. Then, for each renewable invoice found, create a new draft using the createNewDraftInvoice tool. Finally, report the outcome.`,
        model: 'googleai/gemini-2.5-flash',
        tools: [getRenewableInvoices, createNewDraftInvoice],
        toolConfig: {
            execution: 'tool'
        }
    });

    const toolOutputs = llmResponse.toolRequest()?.outputs;

    let createdCount = 0;
    if (toolOutputs) {
        for (const output of toolOutputs) {
            if(output.toolName === 'createNewDraftInvoice'){
                createdCount++;
            }
        }
    }


    if (createdCount > 0) {
      return {
        success: true,
        invoicesCreated: createdCount,
        message: `Successfully generated ${createdCount} new recurring invoice(s).`,
      };
    } else {
      return {
        success: true,
        invoicesCreated: 0,
        message: 'No recurring invoices were due for generation.',
      };
    }
  }
);
