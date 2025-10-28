
'use server';
/**
 * @fileOverview AI flow to generate content in a specific brand voice.
 *
 * - generateBrandVoiceContent - A function that generates content based on a brand description, topic, and platform.
 * - GenerateBrandVoiceContentInput - The input type for the function.
 * - GenerateBrandVoiceContentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBrandVoiceContentInputSchema = z.object({
  brandDescription: z.string().describe('A description of the desired brand voice and tone (e.g., "Friendly, witty, and professional").'),
  topic: z.string().describe('The topic or subject matter for the content to be generated.'),
  platform: z.string().describe('The target platform for the content (e.g., "blog-post", "marketing-email", "social-media-ad").'),
});
export type GenerateBrandVoiceContentInput = z.infer<typeof GenerateBrandVoiceContentInputSchema>;

const GenerateBrandVoiceContentOutputSchema = z.object({
  content: z.string().describe('The generated content in the specified brand voice.'),
});
export type GenerateBrandVoiceContentOutput = z.infer<typeof GenerateBrandVoiceContentOutputSchema>;

export async function generateBrandVoiceContent(input: GenerateBrandVoiceContentInput): Promise<GenerateBrandVoiceContentOutput> {
  return generateBrandVoiceContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brandVoicePrompt',
  input: { schema: GenerateBrandVoiceContentInputSchema },
  output: { schema: GenerateBrandVoiceContentOutputSchema },
  prompt: `You are an expert marketing copywriter. Your task is to generate content for a specific platform based on a given topic, strictly adhering to the provided brand voice.

Brand Voice Description:
"{{{brandDescription}}}"

Topic:
"{{{topic}}}"

Platform:
"{{{platform}}}"

Based on the information above, please generate compelling content. The output should be only the generated text, ready to be used.
`,
});

const generateBrandVoiceContentFlow = ai.defineFlow(
  {
    name: 'generateBrandVoiceContentFlow',
    inputSchema: GenerateBrandVoiceContentInputSchema,
    outputSchema: GenerateBrandVoiceContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
