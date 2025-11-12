'use client';

import { useActionState } from 'react';
import { searchDishes } from '@/lib/actions';
import type { DishSearchResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Utensils, Search, CircleDollarSign, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type SearchState = {
    results?: DishSearchResult[];
    error?: string;
    query?: string;
}

const initialState: SearchState = {
    results: [],
};

export default function SuggestionsPage() {
    const [state, formAction] = useActionState(searchDishes, initialState);

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="text-center mb-8">
                <Utensils className="mx-auto h-12 w-12 text-accent" />
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mt-4">
                    Find Your Craving
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-2">
                    Search for any dish you have in mind and we'll find it for you across all restaurants.
                </p>
            </div>
            
            <Card className="shadow-lg mb-12">
                <CardContent className="p-6">
                     <form action={formAction} className="flex gap-2">
                        <Input 
                            id="dishName" 
                            name="dishName" 
                            placeholder="e.g., Burger, Shawerma, Pizza..." 
                            className="text-base"
                            required 
                        />
                        <SubmitButton className="font-bold">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </SubmitButton>
                    </form>
                </CardContent>
            </Card>

            {state.error && (
                <Alert variant="destructive">
                    <AlertTitle>Search Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
                {state.results && state.results.length > 0 && (
                    <h2 className="text-2xl font-bold font-headline text-accent border-b-2 border-accent pb-2">
                        Found {state.results.length} results for "{state.query}"
                    </h2>
                )}
                
                {state.results && state.results.map(({ dish, restaurantName, restaurantId, deliveryFee }) => (
                    <Card key={`${restaurantId}-${dish.id}`} className="overflow-hidden">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="font-headline text-2xl">{dish.name}</CardTitle>
                                    <CardDescription className="text-base">from <Link href={`/restaurants/${restaurantId}/edit`} className="text-primary hover:underline font-semibold">{restaurantName}</Link></CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary font-mono">${dish.price.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">Dish Price</p>
                                </div>
                            </div>
                        </CardHeader>
                        {dish.description && (
                            <CardContent>
                                <div className="flex items-start gap-2 text-sm text-muted-foreground border-t pt-4">
                                   <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                   <p>{dish.description}</p>
                                </div>
                            </CardContent>
                        )}
                        <CardFooter className="bg-muted/50 p-4 flex justify-between items-center text-sm">
                             <div className="flex items-center">
                                <CircleDollarSign className="h-4 w-4 mr-1.5" />
                                <span>Delivery Fee: ${deliveryFee.toFixed(2)}</span>
                            </div>
                            <Button asChild size="sm">
                                <Link href={`/orders/create`}>Start an Order</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {state.query && state.results?.length === 0 && (
                     <Alert>
                        <Search className="h-4 w-4" />
                        <AlertTitle>No Results Found</AlertTitle>
                        <AlertDescription>
                            We couldn't find any dishes matching "{state.query}". Please try a different search term.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

        </div>
    );
}
