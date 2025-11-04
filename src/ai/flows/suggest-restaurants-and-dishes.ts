'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting restaurants and dishes based on user preferences.
 *
 * @exports suggestRestaurantsAndDishes - A function that triggers the restaurant/dish suggestion flow.
 * @exports SuggestRestaurantsAndDishesInput - The input type for the suggestRestaurantsAndDishes function.
 * @exports SuggestRestaurantsAndDishesOutput - The output type for the suggestRestaurantsAndDishes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRestaurantsAndDishesInputSchema = z.object({
  dietaryRestrictions: z.string().describe('Any dietary restrictions for the group (e.g., vegetarian, vegan, gluten-free).'),
  budget: z.string().describe('The budget per person for the meal (e.g., low, medium, high).'),
  cuisines: z.string().describe('Preferred cuisines (e.g., Italian, Mexican, Indian).'),
  popularity: z.string().describe('The desired popularity of the restaurant (e.g., popular, hidden gem).'),
  userPreferences: z.string().describe('Additional user preferences or specific requests.'),
});
export type SuggestRestaurantsAndDishesInput = z.infer<typeof SuggestRestaurantsAndDishesInputSchema>;

const SuggestRestaurantsAndDishesOutputSchema = z.object({
  suggestions: z.string().describe('A list of suggested restaurants and dishes based on the input criteria.'),
});
export type SuggestRestaurantsAndDishesOutput = z.infer<typeof SuggestRestaurantsAndDishesOutputSchema>;

export async function suggestRestaurantsAndDishes(input: SuggestRestaurantsAndDishesInput): Promise<SuggestRestaurantsAndDishesOutput> {
  return suggestRestaurantsAndDishesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRestaurantsAndDishesPrompt',
  input: {schema: SuggestRestaurantsAndDishesInputSchema},
  output: {schema: SuggestRestaurantsAndDishesOutputSchema},
  prompt: `Suggest restaurants and dishes based on the following criteria:

Dietary Restrictions: {{{dietaryRestrictions}}}
Budget: {{{budget}}}
Cuisines: {{{cuisines}}}
Popularity: {{{popularity}}}
User Preferences: {{{userPreferences}}}

Please provide a list of restaurant and dish suggestions that meet these criteria.
`,
});

const suggestRestaurantsAndDishesFlow = ai.defineFlow(
  {
    name: 'suggestRestaurantsAndDishesFlow',
    inputSchema: SuggestRestaurantsAndDishesInputSchema,
    outputSchema: SuggestRestaurantsAndDishesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
