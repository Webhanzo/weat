'use client';
import { useActionState, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GroupOrder } from "@/lib/types";
import { Users, Truck, Wallet, Utensils, Clock, Star } from "lucide-react";
import { format } from 'date-fns';
import { submitRating } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { SubmitButton } from '../ui/submit-button';
import RatingInput from '../rating/rating-input';
import { useToast } from '@/hooks/use-toast';

type PastOrderDetailsProps = {
  order: GroupOrder;
};

const ratingInitialState = {
    error: undefined,
    success: false,
}

export default function PastOrderDetails({ order }: PastOrderDetailsProps) {
  const [ratingState, formAction] = useActionState(submitRating, ratingInitialState);
  const { toast } = useToast();
  // For simplicity, we'll ask the user for their name to check if they've rated.
  // In a real app, this would come from an auth context.
  const [raterName, setRaterName] = useState('');
  const hasRated = raterName && order.ratings && !!order.ratings[raterName];
  const canRate = !hasRated && raterName !== '';

  const participants = order.participants || [];
  const deliveryFee = order.restaurant.deliveryFee || 0;
  const participantCount = participants.length > 0 ? participants.length : 1;
  const deliveryFeePerPerson = deliveryFee / participantCount;

  const participantTotals = participants.map(p => {
    const subtotal = p.items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
    const total = subtotal + deliveryFeePerPerson;
    return { name: p.name, subtotal, total, items: p.items };
  });

  const grandTotal = participantTotals.reduce((acc, p) => acc + p.total, 0);
  const totalItems = participants.reduce((acc, p) => acc + p.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);

  const uniqueDishes = [...new Map(order.participants.flatMap(p => p.items.map(i => [i.dish.id, i.dish]))).values()];

  useEffect(() => {
    if (ratingState.success) {
      toast({
          title: "Rating Submitted!",
          description: "Thank you for your feedback.",
      });
    } else if (ratingState.error) {
      toast({
          title: "Rating Error",
          description: ratingState.error,
          variant: 'destructive',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingState]);


  return (
    <Card className="w-full shadow-2xl rounded-2xl animate-in fade-in-50 duration-500">
        <CardHeader className="bg-muted/50 p-6">
            <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-4xl">{order.restaurant.name}</CardTitle>
                <CardDescription className="flex items-center pt-2 text-base">
                <Clock className="h-4 w-4 mr-2" />
                Order from {format(new Date(order.createdAt), "PPP")}
                </CardDescription>
            </div>
             <div className="text-right">
                <p className="text-sm text-muted-foreground">Order Code</p>
                <p className="font-mono text-lg tracking-widest text-primary">{order.orderCode}</p>
            </div>
            </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="font-headline text-2xl border-b pb-2">Order Breakdown</h3>
                {participants.length > 0 ? (
                    <ul className="space-y-4">
                    {participantTotals.map(participant => (
                        <li key={participant.name} className="p-4 bg-background rounded-lg border">
                        <p className="font-bold text-lg text-primary">{participant.name}</p>
                        <ul className="mt-2 space-y-1 text-sm pl-4 list-disc list-inside">
                            {participant.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{item.quantity}x {item.dish.name}</span>
                                <span className="font-mono">${(item.dish.price * item.quantity).toFixed(2)}</span>
                            </li>
                            ))}
                        </ul>
                         <Separator className="my-2" />
                         <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-mono">${participant.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Delivery Share</span>
                            <span className="font-mono">${deliveryFeePerPerson.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between font-bold text-base mt-1">
                            <span>Total</span>
                            <span className="font-mono">${participant.total.toFixed(2)}</span>
                        </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <div className="text-center py-8 text-muted-foreground rounded-lg border border-dashed">
                    <p>This order had no items.</p>
                    </div>
                )}
            </div>
             <div className="space-y-6">
                <h3 className="font-headline text-2xl border-b pb-2 flex items-center">
                    <Wallet className="h-6 w-6 mr-3 text-accent" />
                    Final Summary
                </h3>
                 <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                    <div className="w-full flex justify-between items-center">
                        <div className="flex items-center text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            <span>Participants</span>
                        </div>
                        <span className="font-bold">{participants.length}</span>
                    </div>
                     <div className="w-full flex justify-between items-center">
                        <div className="flex items-center text-muted-foreground">
                            <Utensils className="h-4 w-4 mr-2" />
                            <span>Total Items</span>
                        </div>
                        <span className="font-bold">{totalItems}</span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <div className="flex items-center text-muted-foreground">
                            <Truck className="h-4 w-4 mr-2" />
                            <span>Total Delivery</span>
                        </div>
                        <span className="font-mono">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2 bg-border"/>
                    <div className="w-full flex justify-between items-center text-2xl font-bold text-primary">
                        <span>Grand Total</span>
                        <span className="font-mono">${grandTotal.toFixed(2)}</span>
                    </div>
                 </div>
            </div>
        </CardContent>

        <CardFooter className="flex-col items-start space-y-4 p-6 bg-muted/50 rounded-b-2xl border-t">
            <h3 className="font-headline text-2xl flex items-center"><Star className="h-6 w-6 mr-3 text-amber-400" />Rate Your Order</h3>
            
            {!raterName && (
                 <div className="w-full space-y-2">
                    <p className="text-sm text-muted-foreground">Please enter your name (as it appeared in the order) to rate.</p>
                    <input 
                        value={raterName}
                        onChange={(e) => setRaterName(e.target.value)}
                        placeholder="Enter your name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                    />
                 </div>
            )}
            
            {hasRated && (
                <Alert variant="default" className="w-full border-green-500 bg-green-500/10">
                    <Star className="h-4 w-4 text-green-500" />
                    <AlertTitle>Thanks for rating!</AlertTitle>
                    <AlertDescription>You have already submitted your feedback for this order.</AlertDescription>
                </Alert>
            )}

            {canRate && (
                <form action={formAction} className="w-full space-y-6">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="restaurantId" value={order.restaurant.id} />
                    <input type="hidden" name="userId" value={raterName} />
                    
                    <div className="space-y-4 p-4 border rounded-lg bg-background">
                         <h4 className="font-bold">Rate the Restaurant: {order.restaurant.name}</h4>
                         <RatingInput name="restaurantRating" />
                    </div>

                    {uniqueDishes.length > 0 && (
                        <div className="space-y-4 p-4 border rounded-lg bg-background">
                            <h4 className="font-bold">Rate the Dishes</h4>
                            {uniqueDishes.map(dish => (
                                <div key={dish.id} className="space-y-2">
                                    <p>{dish.name}</p>
                                    <RatingInput name={`dish-${dish.id}-rating`} />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <SubmitButton className="w-full font-bold">
                        <Star className="mr-2 h-4 w-4" />
                        Submit Ratings
                    </SubmitButton>
                </form>
            )}
        </CardFooter>
    </Card>
  );
}

    