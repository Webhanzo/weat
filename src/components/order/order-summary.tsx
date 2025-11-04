'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GroupOrder } from "@/lib/types";
import { Users, Truck, Wallet, Info, AtSign } from "lucide-react";
import Image from "next/image";

type OrderSummaryProps = {
  order: GroupOrder;
};

export default function OrderSummary({ order }: OrderSummaryProps) {
  const participants = order.participants || [];
  const deliveryFee = order.restaurant.deliveryFee;
  const participantCount = participants.length > 0 ? participants.length : 1;
  const deliveryFeePerPerson = deliveryFee / participantCount;

  const participantTotals = participants.map(p => {
    const subtotal = p.items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
    const total = subtotal + deliveryFeePerPerson;
    return { name: p.name, subtotal, total };
  });

  const grandTotal = participantTotals.reduce((acc, p) => acc + p.total, 0);

  return (
    <Card className="sticky top-24 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
            <Wallet className="h-6 w-6 mr-3 text-accent" />
            Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {participants.length > 0 ? (
          participantTotals.map((p, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg">{p.name}</h4>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${p.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Share</span>
                <span>${deliveryFeePerPerson.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-primary">
                <span>Total</span>
                <span>${p.total.toFixed(2)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Add items to see the cost breakdown.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start space-y-4 p-6 bg-muted/50 rounded-b-2xl">
        <div className="w-full flex justify-between items-center text-sm">
            <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>Participants</span>
            </div>
            <span>{participants.length}</span>
        </div>
        <div className="w-full flex justify-between items-center text-sm">
            <div className="flex items-center text-muted-foreground">
                <Truck className="h-4 w-4 mr-2" />
                <span>Total Delivery</span>
            </div>
            <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <Separator className="my-2"/>
         <div className="w-full flex justify-between items-center text-lg font-bold">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
