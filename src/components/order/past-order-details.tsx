'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GroupOrder } from "@/lib/types";
import { Users, Truck, Wallet, Utensils, Clock } from "lucide-react";
import { format } from 'date-fns';

type PastOrderDetailsProps = {
  order: GroupOrder;
};

export default function PastOrderDetails({ order }: PastOrderDetailsProps) {
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
    </Card>
  );
}
