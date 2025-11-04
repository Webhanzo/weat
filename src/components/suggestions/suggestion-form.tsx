'use client';

import { useFormState } from 'react-dom';
import { suggestRestaurantsAndDishes } from '@/ai/flows/suggest-restaurants-and-dishes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Salad, CircleDollarSign, Pizza, Flame, PartyPopper } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type SuggestionState = {
    suggestions?: string;
    error?: string;
}

const initialState: SuggestionState = {};

async function getSuggestionsAction(prevState: SuggestionState, formData: FormData): Promise<SuggestionState> {
    const rawData = {
        dietaryRestrictions: formData.get('dietaryRestrictions') as string,
        budget: formData.get('budget') as string,
        cuisines: formData.get('cuisines') as string,
        popularity: formData.get('popularity') as string,
        userPreferences: formData.get('userPreferences') as string,
    };

    try {
        const result = await suggestRestaurantsAndDishes(rawData);
        return { suggestions: result.suggestions };
    } catch (e: any) {
        return { error: e.message || "An unknown error occurred." };
    }
}


export default function SuggestionForm() {
    const [state, formAction] = useFormState(getSuggestionsAction, initialState);
    const { toast } = useToast();

     useEffect(() => {
        if (state.error) {
            toast({
                title: 'Suggestion Error',
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state.error, toast]);

    return (
        <Card className="shadow-2xl rounded-2xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Decision Helper</CardTitle>
                <CardDescription>Fill in your group's preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="dietaryRestrictions" className="flex items-center"><Salad className="h-4 w-4 mr-2" />Dietary Restrictions</Label>
                        <Input id="dietaryRestrictions" name="dietaryRestrictions" placeholder="e.g., vegetarian, gluten-free, none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget" className="flex items-center"><CircleDollarSign className="h-4 w-4 mr-2" />Budget per Person</Label>
                            <Input id="budget" name="budget" placeholder="e.g., low, $15-20, high" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cuisines" className="flex items-center"><Pizza className="h-4 w-4 mr-2" />Preferred Cuisines</Label>
                            <Input id="cuisines" name="cuisines" placeholder="e.g., Italian, Mexican, any" />
                        </div>
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="popularity" className="flex items-center"><Flame className="h-4 w-4 mr-2" />Restaurant Popularity</Label>
                        <Input id="popularity" name="popularity" placeholder="e.g., popular spot, hidden gem" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="userPreferences" className="flex items-center"><PartyPopper className="h-4 w-4 mr-2" />Other Preferences</Label>
                        <Textarea id="userPreferences" name="userPreferences" placeholder="e.g., outdoor seating, quick service, good for large groups" />
                    </div>

                    <SubmitButton className="w-full font-bold">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get AI Suggestions
                    </SubmitButton>
                </form>

                {state.suggestions && (
                    <Alert className="mt-8 border-accent">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <AlertTitle className="font-headline text-accent">Here are your suggestions!</AlertTitle>
                        <AlertDescription className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
                            {state.suggestions}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
