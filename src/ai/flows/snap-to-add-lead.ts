'use server';
/**
 * @fileOverview AI flow to identify a business from a photo and create a client lead.
 *
 * - snapToAddLead - Analyzes a storefront photo and creates a new client.
 * - SnapToAddLeadInput - The input type for the function.
 * - SnapToAddLeadOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Input: A data URI of the photo
const SnapToAddLeadInputSchema = z.object({
  photoDataUri: z.string().describe(
    "A photo of a storefront, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type SnapToAddLeadInput = z.infer<typeof SnapToAddLeadInputSchema>;


// Output: Just the client name and a dummy email
const SnapToAddLeadOutputSchema = z.object({
  clientName: z.string().describe('The identified name of the business or storefront.'),
  clientEmail: z.string().describe('A plausible contact email address for the business (e.g., contact@businessname.com).'),
});
export type SnapToAddLeadOutput = z.infer<typeof SnapToAddLeadOutputSchema>;


/**
 * A tool that creates a new client record in the Firestore database.
 */
const createClientLeadTool = ai.defineTool(
  {
    name: 'createClientLeadTool',
    description: 'Creates a new client lead record in the database.',
    inputSchema: z.object({
        companyId: z.string().describe("The ID of the company to which this lead belongs."),
        name: z.string().describe("The name of the new client lead."),
        email: z.string().describe("The contact email for the new client lead."),
    }),
    outputSchema: z.string().describe('The ID of the newly created client document.'),
  },
  async ({ companyId, name, email }) => {
    const { firestore } = initializeFirebase();
    const clientsRef = collection(firestore, 'clients');
    
    const newClient = {
      companyId,
      name,
      email,
      dealValue: 0, // Initial deal value
      lastContactAt: new Date(),
      photoURL: `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/100/100`, // Generate a consistent placeholder
    };

    const docRef = await addDoc(clientsRef, newClient);
    return docRef.id;
  }
);


export async function snapToAddLead(input: SnapToAddLeadInput): Promise<SnapToAddLeadOutput> {
  return snapToAddLeadFlow(input);
}


const snapToAddLeadFlow = ai.defineFlow(
  {
    name: 'snapToAddLeadFlow',
    inputSchema: SnapToAddLeadInputSchema,
    outputSchema: SnapToAddLeadOutputSchema,
    tools: [createClientLeadTool]
  },
  async (input) => {
    
    // In a real app, we'd get this from the authenticated user's context
    const mockCompanyId = 'company-1';

    const llmResponse = await ai.generate({
        prompt: `Analyze the attached image of a storefront. Your goal is to identify the business name and create a new lead for it.
        
        1.  First, determine the name of the business from the signs or text in the image.
        2.  Once you have the name, generate a plausible contact email, like "contact@[businessname].com".
        3.  Finally, use the createClientLeadTool to save this information as a new lead for company ID "${mockCompanyId}".
        
        Image to analyze: {{media url=photoDataUri}}`,
        model: 'googleai/gemini-2.5-flash',
        tools: [createClientLeadTool],
    });

    const toolCalls = llmResponse.toolCalls();
    
    // Find the arguments of the first call to our tool
    const createCall = toolCalls.find(call => call.toolName === 'createClientLeadTool');
    if (!createCall || !createCall.input) {
      throw new Error("The AI failed to create a client lead from the image.");
    }
    
    // Return the name and email that the AI decided to use.
    return {
        clientName: createCall.input.name,
        clientEmail: createCall.input.email,
    };
  }
);
